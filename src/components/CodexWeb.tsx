import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { TermNode } from '../termTreeData';

// Word web of the codex, built from the same pills as the tree view.
//   nothing selected   -> the main categories in a ring
//   something selected -> that entry in the middle (selected style); around it its parent theme,
//                         sub-themes, related terms and the entries that reference it, plus one
//                         offshoot per word.
// Behaviour mirrors the tree: a click selects and re-centres, after which the layout is static.
// The layout is computed once per selection (synchronously) and pills glide into place; nothing
// keeps simulating afterwards. Wheel = zoom (spacing only, pills keep their size), drag the
// background = pan, drag a pill = move that pill.

export interface LinkIndex {
  children: Map<string, string[]>;
  incoming: Map<string, string[]>;
  byId: Map<string, TermNode>;
  degree: (id: string) => number;
}

type Kind = 'center' | 'parent' | 'child' | 'related' | 'backlink' | 'leaf' | 'root';

interface WebNode { id: string; node: TermNode; kind: Kind; ring: 0 | 1 | 2; anchor: string | null; }
interface WebEdge { source: string; target: string; kind: Kind; }
interface XY { x: number; y: number; }

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
const REST: Record<Kind, number> = { center: 0, parent: 235, child: 210, related: 230, backlink: 250, leaf: 115, root: 215 };
const PILL_H = 32;
const GAP = 24; // minimum breathing room between pills, in screen pixels
const MAX_PILL_W = 260;
const ANIM_MS = 480;

const estimateWidth = (n: WebNode) => {
  const text = n.node.name.length * 6.1;
  const w = !n.node.parentId ? 30 + 16 + text + 24 : 24 + text + 14;
  return Math.min(MAX_PILL_W, Math.round(w));
};

// ---- synchronous force layout ----------------------------------------------------------------
function runLayout(
  webNodes: WebNode[], edges: WebEdge[], widths: Map<string, number>,
  start: Map<string, XY>, k: number, ticks: number, collisionOnly = false
): Map<string, XY> {
  const P = webNodes.map(n => ({ ...(start.get(n.id) || { x: 0, y: 0 }), vx: 0, vy: 0 }));
  const idx = new Map(webNodes.map((n, i) => [n.id, i]));
  const W = webNodes.map(n => widths.get(n.id) || estimateWidth(n));
  let alpha = collisionOnly ? 0.25 : 1;
  for (let t = 0; t < ticks; t++) {
    const N = P.length;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const a = P[i], b = P[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        if (dx === 0 && dy === 0) { dx = ((i * 7919) % 13) / 13 - 0.5; dy = ((j * 104729) % 11) / 11 - 0.5; }
        if (!collisionOnly) {
          const d2 = Math.max(1, dx * dx + dy * dy);
          const strength = (webNodes[i].ring === 2 || webNodes[j].ring === 2) ? 1600 : 5200;
          const f = Math.min(10, (strength * alpha) / d2);
          const d = Math.sqrt(d2);
          a.vx -= (dx / d) * f; a.vy -= (dy / d) * f; b.vx += (dx / d) * f; b.vy += (dy / d) * f;
        }
        // pills never shrink, so overlap is measured in screen pixels at the current zoom; the two
        // pills are treated as an ellipse and pushed apart along the line between their centres
        const rx = (W[i] + W[j]) / 2 + GAP, ry = PILL_H + GAP;
        const nx = (dx * k) / rx, ny = (dy * k) / ry;
        const nd = Math.sqrt(nx * nx + ny * ny);
        if (nd < 1) {
          const ux = nd > 1e-6 ? nx / nd : 1, uy = nd > 1e-6 ? ny / nd : 0;   // unit vector in ellipse space
          const push = (1 - nd) * 0.5;                                        // fraction of the ellipse radii
          const px = ux * push * rx / k, py = uy * push * ry / k;             // back to layout units
          a.vx -= px * 0.5; a.vy -= py * 0.5; b.vx += px * 0.5; b.vy += py * 0.5;
        }
      }
    }
    edges.forEach(e => {
      const ia = idx.get(e.source), ib = idx.get(e.target);
      if (ia === undefined || ib === undefined) return;
      const a = P[ia], b = P[ib];
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const f = (d - REST[e.kind]) * (collisionOnly ? 0.01 : 0.05) * alpha;
      const fx = (dx / d) * f, fy = (dy / d) * f;
      const wa = e.kind === 'leaf' ? 0.2 : 0.5, wb = 1 - wa;
      a.vx += fx * wa; a.vy += fy * wa; b.vx -= fx * wb; b.vy -= fy * wb;
    });
    webNodes.forEach((n, i) => {
      const p = P[i];
      if (!collisionOnly) {
        if (n.kind === 'root') {
          const d = Math.max(1, Math.sqrt(p.x * p.x + p.y * p.y));
          const f = (d - REST.root) * 0.05 * alpha;
          p.vx -= (p.x / d) * f; p.vy -= (p.y / d) * f;
        } else if (n.ring === 2) {
          const a = n.anchor !== null && idx.has(n.anchor) ? P[idx.get(n.anchor)!] : null;
          const anchorR = a ? Math.sqrt(a.x * a.x + a.y * a.y) : REST.child;
          const d = Math.max(1, Math.sqrt(p.x * p.x + p.y * p.y));
          const target = anchorR + 90;
          if (d < target) { const f = (target - d) * 0.06 * Math.max(alpha, 0.05); p.vx += (p.x / d) * f; p.vy += (p.y / d) * f; }
        } else {
          const g = n.ring === 0 ? 0.3 : 0.01;
          p.vx -= p.x * g * alpha; p.vy -= p.y * g * alpha;
        }
      }
      if (n.ring === 0) { p.vx = 0; p.vy = 0; p.x = 0; p.y = 0; } // the selection is pinned to the middle
      p.vx *= 0.5; p.vy *= 0.5;
      p.x += p.vx; p.y += p.vy;
    });
    alpha *= collisionOnly ? 0.97 : 0.975;
  }
  return new Map(webNodes.map((n, i) => [n.id, { x: P[i].x, y: P[i].y }]));
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const CodexWeb: React.FC<CodexWebProps> = ({
  centerId, selectedId, hoveredId, nodes, index, getNodeColor, getNodeIcon, hasSubItems,
  onSelect, onHover, theme, isDark, originShift
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const sizeRef = useRef(size); sizeRef.current = size;
  const shiftRef = useRef(originShift || { x: 0, y: 0 }); shiftRef.current = originShift || { x: 0, y: 0 };
  const [, setFrame] = useState(0);
  const redraw = () => setFrame(f => f + 1);

  const targetRef = useRef<Map<string, XY>>(new Map());   // where pills should end up (layout units)
  const displayRef = useRef<Map<string, XY>>(new Map());  // where they are drawn right now
  const widthRef = useRef<Map<string, number>>(new Map());
  const pillRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const viewRef = useRef({ x: 0, y: 0, k: 1 });
  const animRef = useRef<{ raf: number | null; from: Map<string, XY>; t0: number }>({ raf: null, from: new Map(), t0: 0 });
  const panRef = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);
  const pillDragRef = useRef<{ id: string; startX: number; startY: number; origin: XY; moved: boolean } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const widthRelayoutsRef = useRef(0);

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
      webNodes.filter(n => n.ring === 1).forEach(r => {
        const pool = byDegree([...(children.get(r.id) || []), ...(r.node.relatedIds || [])]);
        let taken = 0;
        for (const id of pool) { if (taken >= CAPS.leavesPer) break; if (add(id, 'leaf', 2, r.id)) taken++; }
      });
    } else {
      nodes.filter(n => !n.parentId).forEach(r => add(r.id, 'root', 1, null));
    }
    return { webNodes, edges };
  }, [centerId, nodes, index]);

  // ---- animation towards the targets -------------------------------------------------------
  const animateTo = (targets: Map<string, XY>) => {
    const anim = animRef.current;
    if (anim.raf) cancelAnimationFrame(anim.raf);
    anim.from = new Map(displayRef.current);
    anim.t0 = performance.now();
    targetRef.current = targets;
    const step = (now: number) => {
      const t = Math.min(1, (now - anim.t0) / ANIM_MS);
      const e = easeOut(t);
      const disp = new Map<string, XY>();
      targets.forEach((to, id) => {
        const from = anim.from.get(id) || to;
        disp.set(id, { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e });
      });
      displayRef.current = disp;
      redraw();
      anim.raf = t < 1 ? requestAnimationFrame(step) : null;
    };
    anim.raf = requestAnimationFrame(step);
  };

  const fitZoom = (targets: Map<string, XY>, k: number) => {
    const { w, h } = sizeRef.current;
    const shift = shiftRef.current;
    let maxX = 1, maxY = 1, pillHalf = 0;
    graph.webNodes.forEach(n => {
      const p = targets.get(n.id)!;
      maxX = Math.max(maxX, Math.abs(p.x) * k); maxY = Math.max(maxY, Math.abs(p.y) * k);
      pillHalf = Math.max(pillHalf, (widthRef.current.get(n.id) || estimateWidth(n)) / 2);
    });
    const availX = Math.min(w / 2 + shift.x, w / 2 - shift.x) - pillHalf - 24;
    const availY = Math.min(h / 2 + shift.y, h / 2 - shift.y) - PILL_H / 2 - 60;
    const s = Math.min(availX / maxX, availY / maxY);
    return s < 0.97 ? Math.max(0.6, k * s) : k;
  };

  // one layout per selection: compute, fit, then glide into place and stay there
  useEffect(() => {
    const prevTargets = targetRef.current;
    const prevDisplay = displayRef.current;
    const ids = new Set(graph.webNodes.map(n => n.id));
    const center = graph.webNodes.find(n => n.ring === 0);
    // keep the old positions of words that stay, relative to the new centre
    const off = center && prevTargets.get(center.id) ? prevTargets.get(center.id)! : { x: 0, y: 0 };
    const start = new Map<string, XY>();
    const ring1Count = Math.max(1, graph.webNodes.filter(n => n.ring === 1).length);
    let ring1Idx = 0;
    graph.webNodes.forEach(n => {
      const prev = prevTargets.get(n.id);
      if (prev && ids.has(n.id)) { start.set(n.id, { x: prev.x - off.x, y: prev.y - off.y }); if (n.ring === 1) ring1Idx++; return; }
      const a = n.anchor ? start.get(n.anchor) || prevTargets.get(n.anchor) : null;
      let ang: number, r: number;
      if (n.ring === 1) { ang = (ring1Idx++ / ring1Count) * Math.PI * 2 - Math.PI / 2; r = REST[n.kind] * 0.8; }
      else { ang = ((n.id.length * 2.399963) % (Math.PI * 2)); r = n.ring === 0 ? 0 : 60; }
      start.set(n.id, { x: (a ? a.x : 0) + Math.cos(ang) * r, y: (a ? a.y : 0) + Math.sin(ang) * r });
    });
    let k = 1;
    let targets = runLayout(graph.webNodes, graph.edges, widthRef.current, start, k, 240);
    // the viewport is wider than tall: stretch sideways (never creates overlaps)
    targets.forEach(p => { p.x *= 1.25; });
    widthRelayoutsRef.current = 0;
    const fitted = fitZoom(targets, k);
    if (fitted !== k) { k = fitted; targets = runLayout(graph.webNodes, graph.edges, widthRef.current, targets, k, 90, true); }
    viewRef.current = { x: 0, y: 0, k };
    // new words start at their anchor's current drawn position so they grow out of the web
    const disp = new Map<string, XY>();
    graph.webNodes.forEach(n => {
      const d = prevDisplay.get(n.id);
      if (d) disp.set(n.id, { x: d.x - off.x, y: d.y - off.y });
      else { const a = n.anchor ? (prevDisplay.get(n.anchor) || { x: 0, y: 0 }) : { x: 0, y: 0 }; disp.set(n.id, { x: a.x - off.x, y: a.y - off.y }); }
    });
    displayRef.current = disp;
    animateTo(targets);
    return () => { if (animRef.current.raf) cancelAnimationFrame(animRef.current.raf); animRef.current.raf = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph]);

  // real pill widths: if the estimate was off, re-run the layout once (before paint, no flicker)
  useLayoutEffect(() => {
    let changed = false;
    pillRefs.current.forEach((el, id) => {
      const w = el.offsetWidth;
      if (w && Math.abs((widthRef.current.get(id) || 0) - w) > 6) { widthRef.current.set(id, w); changed = true; }
    });
    if (changed && !pillDragRef.current && widthRelayoutsRef.current < 2) {
      widthRelayoutsRef.current++;
      const k = viewRef.current.k;
      const targets = runLayout(graph.webNodes, graph.edges, widthRef.current, targetRef.current, k, 60, true);
      animateTo(targets);
    }
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

  // wheel zoom (non-passive so the page itself doesn't scroll); spacing only, pills keep their size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const v = viewRef.current;
      const factor = Math.exp(-e.deltaY * 0.0015);
      const k = Math.min(3, Math.max(0.35, v.k * factor));
      const rect = el.getBoundingClientRect();
      const { w, h } = sizeRef.current;
      const px = e.clientX - rect.left - w / 2 - shiftRef.current.x;
      const py = e.clientY - rect.top - h / 2 - shiftRef.current.y;
      viewRef.current = { k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) };
      redraw();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // ---- pan (background drag) ---------------------------------------------------------------
  const onBgPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    panRef.current = { x: e.clientX, y: e.clientY, vx: viewRef.current.x, vy: viewRef.current.y, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onBgPointerMove = (e: React.PointerEvent) => {
    const d = panRef.current;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    viewRef.current = { ...viewRef.current, x: d.vx + dx, y: d.vy + dy };
    redraw();
  };
  const onBgPointerUp = () => { panRef.current = null; redraw(); };

  // ---- pill drag / click -------------------------------------------------------------------
  const onPillPointerDown = (id: string) => (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const origin = targetRef.current.get(id) || { x: 0, y: 0 };
    pillDragRef.current = { id, startX: e.clientX, startY: e.clientY, origin, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPillPointerMove = (e: React.PointerEvent) => {
    const d = pillDragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX, dy = e.clientY - d.startY;
    if (!d.moved && Math.abs(dx) + Math.abs(dy) > 4) { d.moved = true; setDraggingId(d.id); }
    if (!d.moved) return;
    const k = viewRef.current.k;
    const p = { x: d.origin.x + dx / k, y: d.origin.y + dy / k };
    targetRef.current.set(d.id, p);
    displayRef.current.set(d.id, p);
    redraw();
  };
  const onPillPointerUp = (id: string) => (e: React.PointerEvent) => {
    const d = pillDragRef.current;
    pillDragRef.current = null;
    e.stopPropagation();
    if (d && d.moved) { setDraggingId(null); return; }
    fnRef.current.onSelect(id);
  };

  // ---- render ------------------------------------------------------------------------------
  const view = viewRef.current;
  const ox = size.w / 2 + (originShift?.x || 0) + view.x;
  const oy = size.h / 2 + (originShift?.y || 0) + view.y;
  const screen = (p: XY) => ({ x: ox + p.x * view.k, y: oy + p.y * view.k });
  const disp = displayRef.current;
  const mono = '"Space Mono", monospace';
  const highlightId = hoveredId;
  const connected = useMemo(() => {
    if (!highlightId) return null;
    const s = new Set<string>([highlightId]);
    graph.edges.forEach(e => { if (e.source === highlightId) s.add(e.target); if (e.target === highlightId) s.add(e.source); });
    return s;
  }, [highlightId, graph]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', cursor: panRef.current?.moved ? 'grabbing' : 'grab', touchAction: 'none', userSelect: 'none' }}
      onPointerDown={onBgPointerDown}
      onPointerMove={onBgPointerMove}
      onPointerUp={onBgPointerUp}
      onPointerCancel={onBgPointerUp}
    >
      <svg width={size.w} height={size.h} style={{ display: 'block', position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {graph.edges.map(e => {
          const a = disp.get(e.source), b = disp.get(e.target);
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
              opacity={lit ? (e.kind === 'leaf' ? 0.35 : e.kind === 'backlink' ? 0.45 : 0.75) : 0.18}
              style={{ transition: 'opacity 0.15s ease' }}
            />
          );
        })}
      </svg>

      {graph.webNodes.map(n => {
        const p = disp.get(n.id);
        if (!p) return null;
        const S = screen(p);
        const node = n.node;
        const color = fnRef.current.getNodeColor(node);
        const isSelected = selectedId === node.id;
        const isHovered = hoveredId === node.id;
        const isDragging = draggingId === node.id;
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
          cursor: isDragging ? 'grabbing' : 'pointer',
          whiteSpace: 'nowrap',
          width: 'max-content',
          maxWidth: `${MAX_PILL_W}px`,
          opacity: faded ? 0.45 : 1,
          zIndex: isDragging ? 20 : isSelected ? 15 : isHovered ? 12 : n.ring === 2 ? 4 : 5,
          transition: 'background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease'
        };
        const handlers = {
          ref: (el: HTMLDivElement | null) => { if (el) pillRefs.current.set(n.id, el); else pillRefs.current.delete(n.id); },
          onPointerEnter: () => fnRef.current.onHover(node.id),
          onPointerLeave: () => fnRef.current.onHover(null),
          onPointerDown: onPillPointerDown(node.id),
          onPointerMove: onPillPointerMove,
          onPointerUp: onPillPointerUp(node.id),
          onPointerCancel: () => { pillDragRef.current = null; setDraggingId(null); },
          title: `${node.name}${n.kind === 'backlink' ? ' · references this entry' : n.kind === 'parent' ? ' · parent theme' : n.kind === 'child' ? ' · sub-theme' : n.kind === 'related' ? ' · related' : ''} · drag to move`
        };

        if (isRoot) {
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
                boxShadow: isSelected ? `0 0 10px ${color}44` : isDragging ? '0 6px 18px rgba(0,0,0,0.25)' : 'none'
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
              boxShadow: isSelected ? `0 0 8px ${color}44` : isDragging ? '0 6px 18px rgba(0,0,0,0.25)' : 'none'
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

      {graph.webNodes.length <= 1 && centerId && (
        <div style={{ position: 'absolute', left: '50%', top: '58%', transform: 'translate(-50%,-50%)', fontFamily: mono, fontSize: 10, color: theme.textDim }}>
          This entry has no linked terms yet.
        </div>
      )}
    </div>
  );
};

export default CodexWeb;
