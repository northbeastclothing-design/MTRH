import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { TermNode } from '../termTreeData';

// Force-directed "word web" of the codex, using the same pills as the tree view.
//   nothing selected  -> the main categories in a ring
//   something selected -> that entry in the middle (selected style), its parent theme, sub-themes,
//                         related terms and the entries that reference it around it, and a couple
//                         of offshoots per word further out.
// Clicking a pill selects it (same as the tree) and the web re-centres on it. Zoom scales the
// distances only: pills and text keep their size. Pan by dragging the background.

export interface LinkIndex {
  children: Map<string, string[]>;
  incoming: Map<string, string[]>;
  byId: Map<string, TermNode>;
  degree: (id: string) => number;
}

type Kind = 'center' | 'parent' | 'child' | 'related' | 'backlink' | 'leaf' | 'root';

interface WebNode {
  id: string;
  node: TermNode;
  kind: Kind;
  ring: 0 | 1 | 2;
  anchor: string | null; // the node this one hangs off (null = the origin)
}

interface WebEdge { source: string; target: string; kind: Kind; }
interface Pos { x: number; y: number; vx: number; vy: number; }

interface CodexWebProps {
  centerId: string | null;
  selectedId: string | null;
  hoveredId: string | null;
  nodes: TermNode[];
  index: LinkIndex;
  getNodeColor: (node: TermNode) => string;  // root-category colour for any node
  getNodeIcon: (node: TermNode) => string;
  hasSubItems: (node: TermNode) => boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  theme: any;
  isDark: boolean;
  originShift?: { x: number; y: number };
}

const CAPS = { children: 14, related: 8, backlinks: 6, leavesPer: 1, total: 46 };
const REST: Record<Kind, number> = { center: 0, parent: 270, child: 245, related: 265, backlink: 285, leaf: 125, root: 240 };
const PILL_H = 32;
const GAP = 10; // minimum screen-space gap between pills

const CodexWeb: React.FC<CodexWebProps> = ({
  centerId, selectedId, hoveredId, nodes, index, getNodeColor, getNodeIcon, hasSubItems,
  onSelect, onHover, theme, isDark, originShift
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const [, setFrame] = useState(0);
  const posRef = useRef<Map<string, Pos>>(new Map());
  const widthRef = useRef<Map<string, number>>(new Map());
  const pillRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const alphaRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const viewRef = useRef({ x: 0, y: 0, k: 1 });
  const dragRef = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);
  const loopRef = useRef<(() => void) | null>(null);
  const originShiftRef = useRef(originShift || { x: 0, y: 0 });
  originShiftRef.current = originShift || { x: 0, y: 0 };

  // Parent callbacks are re-created every render; keep them in refs so the graph/simulation
  // only rebuild when the centre or the data actually change.
  const fnRef = useRef({ getNodeColor, getNodeIcon, hasSubItems, onSelect, onHover });
  fnRef.current = { getNodeColor, getNodeIcon, hasSubItems, onSelect, onHover };

  // ---- graph -------------------------------------------------------------------------------
  const graph = useMemo(() => {
    const { children, incoming, byId, degree } = index;
    const webNodes: WebNode[] = [];
    const edges: WebEdge[] = [];
    const seen = new Set<string>();
    const add = (id: string, kind: Kind, ring: 0 | 1 | 2, anchor: string | null) => {
      const n = byId.get(id);
      if (!n || seen.has(id) || webNodes.length >= CAPS.total) return false;
      seen.add(id);
      webNodes.push({ id, node: n, kind, ring, anchor });
      if (anchor) edges.push({ source: anchor, target: id, kind });
      return true;
    };
    const byDegree = (ids: string[]) => [...ids].sort((a, b) => degree(b) - degree(a));

    if (centerId && byId.has(centerId)) {
      const c = byId.get(centerId)!;
      add(centerId, 'center', 0, null);
      [c.parentId, ...(c.secondaryParentIds || [])].filter(Boolean).forEach(p => add(p as string, 'parent', 1, centerId));
      byDegree(children.get(centerId) || []).slice(0, CAPS.children).forEach(id => add(id, 'child', 1, centerId));
      byDegree(c.relatedIds || []).slice(0, CAPS.related).forEach(id => add(id, 'related', 1, centerId));
      byDegree(incoming.get(centerId) || []).slice(0, CAPS.backlinks).forEach(id => add(id, 'backlink', 1, centerId));
      const ring1 = webNodes.filter(n => n.ring === 1);
      ring1.forEach(r => {
        const pool = byDegree([...(children.get(r.id) || []), ...(r.node.relatedIds || [])]);
        let taken = 0;
        for (const id of pool) {
          if (taken >= CAPS.leavesPer) break;
          if (add(id, 'leaf', 2, r.id)) taken++;
        }
      });
    } else {
      // start state: the main categories, same as the first tree column
      nodes.filter(n => !n.parentId).forEach(r => add(r.id, 'root', 1, null));
    }
    return { webNodes, edges };
  }, [centerId, nodes, index]);

  // ---- layout / simulation -----------------------------------------------------------------
  useEffect(() => {
    const pos = posRef.current;
    const ids = new Set(graph.webNodes.map(n => n.id));
    // keep the clicked word where it is and slide everything so it ends up in the middle
    const center = graph.webNodes.find(n => n.ring === 0);
    const prev = center ? pos.get(center.id) : null;
    if (prev && (prev.x !== 0 || prev.y !== 0)) {
      const dx = prev.x, dy = prev.y;
      pos.forEach(p => { p.x -= dx; p.y -= dy; });
    }
    Array.from(pos.keys()).forEach(id => { if (!ids.has(id)) pos.delete(id); });
    const ring1Count = Math.max(1, graph.webNodes.filter(n => n.ring === 1).length);
    let ring1Idx = 0;
    graph.webNodes.forEach(n => {
      if (pos.has(n.id)) { if (n.ring === 1) ring1Idx++; return; }
      const a = n.anchor ? pos.get(n.anchor) : null;
      let ang: number, r: number;
      if (n.ring === 1) { ang = (ring1Idx++ / ring1Count) * Math.PI * 2 - Math.PI / 2; r = REST[n.kind] * 0.8; }
      else { ang = Math.random() * Math.PI * 2; r = n.ring === 0 ? 0 : 60; }
      pos.set(n.id, { x: (a ? a.x : 0) + Math.cos(ang) * r, y: (a ? a.y : 0) + Math.sin(ang) * r, vx: 0, vy: 0 });
    });
    alphaRef.current = 1;
    viewRef.current = { x: 0, y: 0, k: 1 };

    const nodesArr = graph.webNodes;
    const edges = graph.edges;
    let extraTicks = 0;
    let fitted = false;
    const tick = () => {
      const alpha = alphaRef.current;
      const k = viewRef.current.k;
      const P = nodesArr.map(n => pos.get(n.id)!);
      const W = nodesArr.map(n => widthRef.current.get(n.id) || (n.node.name.length * 7 + 36));
      let overlaps = 0;
      for (let i = 0; i < nodesArr.length; i++) {
        for (let j = i + 1; j < nodesArr.length; j++) {
          const a = P[i], b = P[j];
          let dx = b.x - a.x, dy = b.y - a.y;
          if (dx === 0 && dy === 0) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; }
          // charge in layout units (zoom-independent)
          const d2 = dx * dx + dy * dy;
          const strength = (nodesArr[i].ring === 2 || nodesArr[j].ring === 2) ? 1600 : 5200;
          const f = Math.min(10, (strength * alpha) / Math.max(d2, 1));
          const d = Math.sqrt(Math.max(d2, 1));
          a.vx -= (dx / d) * f; a.vy -= (dy / d) * f; b.vx += (dx / d) * f; b.vy += (dy / d) * f;
          // pill collision in screen units: pills never shrink, so they must not overlap at any zoom
          const sx = dx * k, sy = dy * k;
          const ox = (W[i] + W[j]) / 2 + GAP - Math.abs(sx);
          const oy = PILL_H + GAP - Math.abs(sy);
          if (ox > 0 && oy > 0) {
            overlaps++;
            if (ox < oy) { const push = (ox / 2) * 0.9 / k * Math.sign(sx || 1); a.vx -= push; b.vx += push; }
            else { const push = (oy / 2) * 0.9 / k * Math.sign(sy || 1); a.vy -= push; b.vy += push; }
          }
        }
      }
      edges.forEach(e => {
        const a = pos.get(e.source), b = pos.get(e.target);
        if (!a || !b) return;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const f = (d - REST[e.kind]) * 0.05 * alpha;
        const fx = (dx / d) * f, fy = (dy / d) * f;
        const wa = e.kind === 'leaf' ? 0.2 : 0.5, wb = 1 - wa;
        a.vx += fx * wa; a.vy += fy * wa; b.vx -= fx * wb; b.vy -= fy * wb;
      });
      nodesArr.forEach((n, i) => {
        const p = P[i];
        if (n.kind === 'root') {
          // categories: spring to a ring around the origin
          const d = Math.max(1, Math.sqrt(p.x * p.x + p.y * p.y));
          const f = (d - REST.root) * 0.05 * alpha;
          p.vx -= (p.x / d) * f; p.vy -= (p.y / d) * f;
        } else if (n.ring === 2) {
          // offshoots: stay outside their anchor's ring so they never pile up around the centre
          const a = n.anchor ? pos.get(n.anchor) : null;
          const anchorR = a ? Math.sqrt(a.x * a.x + a.y * a.y) : REST.child;
          const d = Math.max(1, Math.sqrt(p.x * p.x + p.y * p.y));
          const target = anchorR + 90;
          if (d < target) { const f = (target - d) * 0.06 * Math.max(alpha, 0.05); p.vx += (p.x / d) * f; p.vy += (p.y / d) * f; }
        } else {
          const g = n.ring === 0 ? 0.3 : 0.01;
          p.vx -= p.x * g * alpha; p.vy -= p.y * g * alpha;
        }
        p.vx *= 0.5; p.vy *= 0.5;
        p.x += p.vx; p.y += p.vy;
      });
      alphaRef.current = Math.max(0, alpha * 0.965);
      setFrame(f => f + 1);
      // first settle: if the web runs past the visible area, pull the spacing in so it fits
      if (!fitted && alphaRef.current <= 0.01) {
        fitted = true;
        const { w, h } = sizeRef.current;
        let maxX = 1, maxY = 1, pillHalf = 0;
        nodesArr.forEach((n, i) => { const p = P[i]; maxX = Math.max(maxX, Math.abs(p.x) * k); maxY = Math.max(maxY, Math.abs(p.y) * k); pillHalf = Math.max(pillHalf, W[i] / 2); });
        const shift = originShiftRef.current;
        const availX = Math.min(w / 2 + shift.x, w / 2 - shift.x) - pillHalf - 24;
        const availY = Math.min(h / 2 + shift.y, h / 2 - shift.y) - PILL_H / 2 - 70;
        const sFit = Math.min(availX / maxX, availY / maxY);
        if (sFit < 0.97) {
          const newK = Math.max(0.5, k * sFit);
          viewRef.current = { ...viewRef.current, k: newK };
          alphaRef.current = 0.15; extraTicks = 0;
        }
      }
      // keep nudging while pills still overlap (bounded, so a packed hub can't spin forever)
      if (overlaps > 0 && alphaRef.current <= 0.01 && extraTicks < 240) { alphaRef.current = 0.012; extraTicks++; }
      if (alphaRef.current > 0.01) rafRef.current = requestAnimationFrame(tick);
      else rafRef.current = null;
    };
    loopRef.current = () => { extraTicks = 0; if (!rafRef.current) rafRef.current = requestAnimationFrame(tick); };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; };
  }, [graph]);

  // measure pill widths after each render so the collision model uses real sizes
  useLayoutEffect(() => {
    let changed = false;
    pillRefs.current.forEach((el, id) => {
      const w = el.offsetWidth;
      if (w && widthRef.current.get(id) !== w) { widthRef.current.set(id, w); changed = true; }
    });
    if (changed && alphaRef.current < 0.2) { alphaRef.current = 0.3; loopRef.current?.(); }
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth || 800, h: el.clientHeight || 600 });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- pan / zoom --------------------------------------------------------------------------
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { x: e.clientX, y: e.clientY, vx: viewRef.current.x, vy: viewRef.current.y, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    viewRef.current = { ...viewRef.current, x: d.vx + dx, y: d.vy + dy };
    setFrame(f => f + 1);
  };
  const onPointerUp = () => { dragRef.current = null; setFrame(f => f + 1); };
  const applyZoom = (factor: number, px?: number, py?: number) => {
    const v = viewRef.current;
    const k = Math.min(2.5, Math.max(0.35, v.k * factor));
    const cx = px ?? 0, cy = py ?? 0; // pointer position relative to the origin (screen px)
    viewRef.current = { k, x: cx - (cx - v.x) * (k / v.k), y: cy - (cy - v.y) * (k / v.k) };
    // pills keep their size, so re-settle the layout for the new spacing
    alphaRef.current = Math.max(alphaRef.current, 0.25);
    loopRef.current?.();
    setFrame(f => f + 1);
  };
  const onWheel = (e: React.WheelEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const px = (rect ? e.clientX - rect.left : size.w / 2) - size.w / 2 - (originShift?.x || 0);
    const py = (rect ? e.clientY - rect.top : size.h / 2) - size.h / 2 - (originShift?.y || 0);
    applyZoom(e.deltaY < 0 ? 1.12 : 0.89, px, py);
  };

  // ---- render ------------------------------------------------------------------------------
  const pos = posRef.current;
  const view = viewRef.current;
  const ox = size.w / 2 + (originShift?.x || 0) + view.x;
  const oy = size.h / 2 + (originShift?.y || 0) + view.y;
  const screen = (p: Pos) => ({ x: ox + p.x * view.k, y: oy + p.y * view.k });
  const mono = '"Space Mono", monospace';
  const highlightId = hoveredId; // dim the rest only while hovering; the selection just gets the selected pill style
  const connected = useMemo(() => {
    if (!highlightId) return null;
    const s = new Set<string>([highlightId]);
    graph.edges.forEach(e => { if (e.source === highlightId) s.add(e.target); if (e.target === highlightId) s.add(e.source); });
    return s;
  }, [highlightId, graph]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', cursor: dragRef.current?.moved ? 'grabbing' : 'grab', touchAction: 'none', userSelect: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      <svg width={size.w} height={size.h} style={{ display: 'block', position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {graph.edges.map(e => {
          const a = pos.get(e.source), b = pos.get(e.target);
          if (!a || !b) return null;
          const A = screen(a), B = screen(b);
          const dashed = e.kind === 'related' || e.kind === 'backlink';
          const lit = connected ? (e.source === highlightId || e.target === highlightId) : true;
          return (
            <line
              key={`${e.source}->${e.target}`}
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke={theme.text}
              strokeWidth={e.kind === 'leaf' ? 1 : 2}
              strokeDasharray={dashed ? '4,4' : undefined}
              opacity={lit ? (e.kind === 'leaf' ? 0.35 : e.kind === 'backlink' ? 0.45 : 0.75) : 0.12}
              style={{ transition: 'opacity 0.15s ease' }}
            />
          );
        })}
      </svg>

      {graph.webNodes.map(n => {
        const p = pos.get(n.id);
        if (!p) return null;
        const S = screen(p);
        const node = n.node;
        const color = fnRef.current.getNodeColor(node);
        const isSelected = selectedId === node.id;
        const isHovered = hoveredId === node.id;
        const faded = connected ? !connected.has(n.id) : false;
        const isRoot = !node.parentId;
        const chevron = fnRef.current.hasSubItems(node);
        const common: React.CSSProperties = {
          position: 'absolute',
          left: S.x,
          top: S.y,
          transform: 'translate(-50%, -50%)',
          height: `${PILL_H}px`,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: '16px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          maxWidth: '260px',
          opacity: faded ? 0.25 : 1,
          zIndex: isSelected ? 15 : isHovered ? 12 : n.ring === 2 ? 4 : 5,
          transition: 'background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease'
        };
        const handlers = {
          ref: (el: HTMLDivElement | null) => { if (el) pillRefs.current.set(n.id, el); else pillRefs.current.delete(n.id); },
          onPointerEnter: () => fnRef.current.onHover(node.id),
          onPointerLeave: () => fnRef.current.onHover(null),
          onPointerDown: (e: React.PointerEvent) => { e.stopPropagation(); },
          onClick: (e: React.MouseEvent) => { e.stopPropagation(); if (!dragRef.current?.moved) fnRef.current.onSelect(node.id); },
          title: `${node.name}${n.kind === 'backlink' ? ' · references this entry' : n.kind === 'parent' ? ' · parent theme' : n.kind === 'child' ? ' · sub-theme' : n.kind === 'related' ? ' · related' : ''}`
        };

        if (isRoot) {
          // main category: same look as the first tree column (icon pill)
          return (
            <div
              key={n.id}
              {...handlers}
              style={{
                ...common,
                padding: '0 4px 0 0',
                background: isSelected ? '#000000' : isHovered ? color : (isDark ? '#1a1a1a' : '#ffffff'),
                border: isSelected ? `1px solid ${isDark ? '#ffffff' : '#000000'}` : `1px solid ${theme.border}`,
                color: isSelected ? '#ffffff' : isHovered ? '#000000' : theme.text,
                boxShadow: isSelected ? `0 0 10px ${color}44` : 'none'
              }}
            >
              <div style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: isSelected || isHovered ? 'transparent' : color, borderRadius: '15px' }}>
                <img src={fnRef.current.getNodeIcon(node)} style={{ width: '30px', height: '30px' }} alt={node.name} draggable={false} />
              </div>
              <span style={{ fontSize: '10px', lineHeight: '24px', fontWeight: 700, fontFamily: mono, letterSpacing: '0.5px', padding: '0 8px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {node.name}
              </span>
              {chevron && (
                <img src="/icons/icon-arrow-down.svg" style={{ width: '24px', height: '24px', transform: 'rotate(-90deg)', filter: isSelected ? 'invert(1)' : (isDark && !isHovered ? 'invert(1)' : 'none'), flexShrink: 0 }} alt="" draggable={false} />
              )}
            </div>
          );
        }

        // every other entry: same look as the tree's secondary columns
        return (
          <div
            key={n.id}
            {...handlers}
            style={{
              ...common,
              padding: '0 12px',
              border: isSelected ? `2px solid ${isDark ? '#ffffff' : '#000000'}` : '2px solid transparent',
              background: (isSelected || isHovered) ? color : `${color}a6`,
              color: (isSelected || isHovered) ? '#000000' : theme.text,
              boxShadow: isSelected ? `0 0 8px ${color}44` : 'none'
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: isSelected || isHovered ? 700 : 500, fontFamily: mono, letterSpacing: '0.5px', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {node.subLabel === 'Possible Nephilim Bloodline' && <span style={{ fontWeight: 900, marginRight: '6px' }}>✖</span>}
              {node.name}
            </span>
            {chevron && (
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flexShrink: 0, marginLeft: '6px' }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </div>
        );
      })}

      {/* zoom buttons (text and pills keep their size; only the spacing changes) */}
      <div style={{ position: 'absolute', right: 20, bottom: 20, display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 20 }} onPointerDown={e => e.stopPropagation()}>
        {[['+', 1.25], ['−', 0.8]].map(([label, f]) => (
          <button
            key={label as string}
            type="button"
            onClick={() => applyZoom(f as number)}
            style={{ width: 32, height: 32, borderRadius: 16, border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontFamily: mono, fontSize: 14, cursor: 'pointer' }}
            title={label === '+' ? 'Spread the web out' : 'Pull the web in'}
          >
            {label as string}
          </button>
        ))}
      </div>

      {graph.webNodes.length <= 1 && centerId && (
        <div style={{ position: 'absolute', left: '50%', top: '58%', transform: 'translate(-50%,-50%)', fontFamily: mono, fontSize: 10, color: theme.textDim }}>
          This entry has no linked terms yet.
        </div>
      )}
    </div>
  );
};

export default CodexWeb;
