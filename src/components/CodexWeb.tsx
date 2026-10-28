import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { TermNode } from '../termTreeData';

// Force-directed "word web" of a codex entry's neighbourhood (Visuwords style):
//   centre = the active entry; ring 1 = parent(s), sub-themes, related terms and the entries that
//   reference it; ring 2 = a few offshoots of each ring-1 word. Clicking any word hands it to
//   onSelect, which re-centres the web on that word. Simulation is a small custom spring/charge
//   model so no graph library is needed.

export interface LinkIndex {
  children: Map<string, string[]>;
  incoming: Map<string, string[]>;
  byId: Map<string, TermNode>;
  degree: (id: string) => number;
}

type Kind = 'center' | 'parent' | 'child' | 'related' | 'backlink' | 'leaf' | 'root';

interface WebNode {
  id: string;
  name: string;
  kind: Kind;
  ring: 0 | 1 | 2;
  color: string;
  weight: number;
  anchor: string | null; // the node this one spawned next to
}

interface WebEdge {
  source: string;
  target: string;
  kind: Kind;
}

interface Pos { x: number; y: number; vx: number; vy: number; }

interface CodexWebProps {
  centerId: string | null;
  nodes: TermNode[];
  index: LinkIndex;
  getNodeColor: (node: TermNode) => string;
  onSelect: (id: string) => void;
  theme: any;
  isDark: boolean;
  originShift?: { x: number; y: number };
}

const CAPS = { children: 22, related: 14, backlinks: 12, leavesPer: 3, total: 110 };
const REST: Record<Kind, number> = { center: 0, parent: 200, child: 170, related: 195, backlink: 215, leaf: 62, root: 170 };
const RADIUS: Record<Kind, number> = { center: 9, parent: 6.5, child: 5.5, related: 5.5, backlink: 5, leaf: 3, root: 6.5 };

const cleanName = (name: string) => name.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim() || name;

const CodexWeb: React.FC<CodexWebProps> = ({ centerId, nodes, index, getNodeColor, onSelect, theme, isDark, originShift }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [, setFrame] = useState(0);
  const posRef = useRef<Map<string, Pos>>(new Map());
  const alphaRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const viewRef = useRef({ x: 0, y: 0, k: 1 });
  const dragRef = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);
  // getNodeColor is re-created by the parent on every render; read it through a ref so the graph
  // (and with it the simulation) only rebuilds when the centre or the data actually change
  const colorRef = useRef(getNodeColor);
  colorRef.current = getNodeColor;

  // ---- graph -------------------------------------------------------------------------------
  const graph = useMemo(() => {
    const { children, incoming, byId, degree } = index;
    const getNodeColor = colorRef.current;
    const webNodes: WebNode[] = [];
    const edges: WebEdge[] = [];
    const seen = new Set<string>();
    const add = (id: string, kind: Kind, ring: 0 | 1 | 2, anchor: string | null) => {
      const n = byId.get(id);
      if (!n || seen.has(id) || webNodes.length >= CAPS.total) return false;
      seen.add(id);
      webNodes.push({ id, name: cleanName(n.name), kind, ring, color: getNodeColor(n), weight: degree(id), anchor });
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
      // ring 2: a few offshoots per ring-1 word so the web shows where each branch leads
      const ring1 = webNodes.filter(n => n.ring === 1);
      ring1.forEach(r => {
        const rn = byId.get(r.id)!;
        const pool = byDegree([...(children.get(r.id) || []), ...(rn.relatedIds || [])]);
        let taken = 0;
        for (const id of pool) {
          if (taken >= CAPS.leavesPer) break;
          if (add(id, 'leaf', 2, r.id)) taken++;
        }
      });
    } else {
      // no selection: the root themes around a virtual hub, each with a few sub-themes
      webNodes.push({ id: '__codex__', name: 'CODEX', kind: 'center', ring: 0, color: '#b6a6ff', weight: 0, anchor: null });
      seen.add('__codex__');
      const roots = nodes.filter(n => !n.parentId);
      roots.forEach(r => add(r.id, 'root', 1, '__codex__'));
      roots.forEach(r => byDegree(children.get(r.id) || []).slice(0, 3).forEach(id => add(id, 'leaf', 2, r.id)));
    }
    return { webNodes, edges };
  }, [centerId, nodes, index]);

  // ---- layout / simulation -----------------------------------------------------------------
  useEffect(() => {
    const pos = posRef.current;
    const ids = new Set(graph.webNodes.map(n => n.id));
    // Re-frame the camera on the new centre so the clicked word slides into the middle
    const center = graph.webNodes.find(n => n.ring === 0);
    const prevCenter = center ? pos.get(center.id) : null;
    if (prevCenter && (prevCenter.x !== 0 || prevCenter.y !== 0)) {
      const dx = prevCenter.x, dy = prevCenter.y;
      pos.forEach(p => { p.x -= dx; p.y -= dy; });
    }
    // Drop words that left the web, spawn new ones next to their anchor
    Array.from(pos.keys()).forEach(id => { if (!ids.has(id)) pos.delete(id); });
    graph.webNodes.forEach((n, i) => {
      if (pos.has(n.id)) return;
      const a = n.anchor ? pos.get(n.anchor) : null;
      const ang = (i * 2.399963) % (Math.PI * 2); // golden angle spread
      const r = n.ring === 0 ? 0 : n.ring === 1 ? 40 + Math.random() * 40 : 20 + Math.random() * 20;
      pos.set(n.id, { x: (a ? a.x : 0) + Math.cos(ang) * r, y: (a ? a.y : 0) + Math.sin(ang) * r, vx: 0, vy: 0 });
    });
    alphaRef.current = 1;
    viewRef.current = { x: 0, y: 0, k: 1 };

    const nodesArr = graph.webNodes;
    const edges = graph.edges;
    const tick = () => {
      const alpha = alphaRef.current;
      const P = nodesArr.map(n => pos.get(n.id)!);
      // charge: every word pushes every other away
      for (let i = 0; i < nodesArr.length; i++) {
        for (let j = i + 1; j < nodesArr.length; j++) {
          const a = P[i], b = P[j];
          let dx = b.x - a.x, dy = b.y - a.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) { dx = (Math.random() - 0.5); dy = (Math.random() - 0.5); d2 = 1; }
          const strength = (nodesArr[i].ring === 2 && nodesArr[j].ring === 2) ? 700 : (nodesArr[i].ring === 2 || nodesArr[j].ring === 2) ? 1500 : 5200;
          const f = Math.min(12, (strength * alpha) / d2);
          const d = Math.sqrt(d2);
          const fx = (dx / d) * f, fy = (dy / d) * f;
          a.vx -= fx; a.vy -= fy; b.vx += fx; b.vy += fy;
        }
      }
      // springs along edges
      edges.forEach(e => {
        const a = pos.get(e.source), b = pos.get(e.target);
        if (!a || !b) return;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const rest = REST[e.kind];
        const f = (d - rest) * 0.06 * alpha;
        const fx = (dx / d) * f, fy = (dy / d) * f;
        const wa = e.kind === 'leaf' ? 0.25 : 0.5, wb = e.kind === 'leaf' ? 0.75 : 0.5;
        a.vx += fx * wa; a.vy += fy * wa; b.vx -= fx * wb; b.vy -= fy * wb;
      });
      // gravity: centre word is pulled hard to the origin, everyone else gently
      nodesArr.forEach((n, i) => {
        const p = P[i];
        const g = n.ring === 0 ? 0.25 : 0.012;
        p.vx -= p.x * g * alpha; p.vy -= p.y * g * alpha;
        p.vx *= 0.55; p.vy *= 0.55;
        p.x += p.vx; p.y += p.vy;
      });
      alphaRef.current = Math.max(0, alpha * 0.975);
      setFrame(f => f + 1);
      if (alphaRef.current > 0.012) rafRef.current = requestAnimationFrame(tick);
      else rafRef.current = null;
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; };
  }, [graph]);

  // ---- container size ----------------------------------------------------------------------
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
  const onPointerUp = () => { dragRef.current = null; };
  const onWheel = (e: React.WheelEvent) => {
    const v = viewRef.current;
    const k = Math.min(3, Math.max(0.4, v.k * (e.deltaY < 0 ? 1.1 : 0.9)));
    // zoom around the pointer
    const rect = containerRef.current?.getBoundingClientRect();
    const px = (rect ? e.clientX - rect.left : size.w / 2) - size.w / 2 - (originShift?.x || 0);
    const py = (rect ? e.clientY - rect.top : size.h / 2) - size.h / 2 - (originShift?.y || 0);
    viewRef.current = { k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) };
    setFrame(f => f + 1);
  };

  // ---- render ------------------------------------------------------------------------------
  const pos = posRef.current;
  const view = viewRef.current;
  const ox = size.w / 2 + (originShift?.x || 0) + view.x;
  const oy = size.h / 2 + (originShift?.y || 0) + view.y;
  const mono = '"Space Mono", monospace';
  const connected = useMemo(() => {
    if (!hoverId) return null;
    const s = new Set<string>([hoverId]);
    graph.edges.forEach(e => { if (e.source === hoverId) s.add(e.target); if (e.target === hoverId) s.add(e.source); });
    return s;
  }, [hoverId, graph]);
  const maxW = Math.max(1, ...graph.webNodes.filter(n => n.ring === 1).map(n => n.weight));
  const edgeColor = theme.text;
  const dimColor = theme.textDim;
  const haloColor = isDark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.85)';

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, cursor: dragRef.current?.moved ? 'grabbing' : 'grab', touchAction: 'none', userSelect: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      <svg width={size.w} height={size.h} style={{ display: 'block' }}>
        <g transform={`translate(${ox} ${oy}) scale(${view.k})`}>
          {graph.edges.map(e => {
            const a = pos.get(e.source), b = pos.get(e.target);
            if (!a || !b) return null;
            const dashed = e.kind === 'related' || e.kind === 'backlink';
            const active = connected ? (connected.has(e.source) && connected.has(e.target) && (e.source === hoverId || e.target === hoverId)) : true;
            return (
              <line
                key={`${e.source}->${e.target}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={e.kind === 'backlink' ? dimColor : edgeColor}
                strokeWidth={e.kind === 'leaf' ? 0.8 : e.kind === 'parent' ? 1.6 : 1.1}
                strokeDasharray={dashed ? '4,4' : undefined}
                opacity={active ? (e.kind === 'leaf' ? 0.45 : e.kind === 'backlink' ? 0.5 : 0.7) : 0.12}
                style={{ transition: 'opacity 0.15s ease' }}
              />
            );
          })}
          {graph.webNodes.map(n => {
            const p = pos.get(n.id);
            if (!p) return null;
            const isCenter = n.ring === 0;
            const r = RADIUS[n.kind] + (n.ring === 1 ? 2.5 * Math.log(1 + n.weight) / Math.log(1 + maxW) : 0);
            const fontSize = isCenter ? 14 : n.ring === 1 ? 10 + Math.round(3 * Math.log(1 + n.weight) / Math.log(1 + maxW)) : 8;
            const faded = connected ? !connected.has(n.id) : false;
            const labelLeft = p.x < 0 && !isCenter;
            const labelColor = isCenter ? n.color : n.ring === 2 ? dimColor : n.kind === 'backlink' ? dimColor : theme.text;
            const clickable = n.id !== '__codex__';
            return (
              <g
                key={n.id}
                transform={`translate(${p.x} ${p.y})`}
                opacity={faded ? 0.18 : 1}
                style={{ cursor: clickable ? 'pointer' : 'default', transition: 'opacity 0.15s ease' }}
                onPointerEnter={() => setHoverId(n.id)}
                onPointerLeave={() => setHoverId(h => (h === n.id ? null : h))}
                onClick={(e) => { e.stopPropagation(); if (dragRef.current?.moved) return; if (clickable && !isCenter) onSelect(n.id); }}
              >
                <title>{`${n.name}${n.kind === 'backlink' ? ' · references this entry' : n.kind === 'child' ? ' · sub-theme' : n.kind === 'parent' ? ' · parent theme' : n.kind === 'related' ? ' · related' : ''}${n.weight ? ` · ${n.weight} connections` : ''}`}</title>
                {isCenter && <circle r={r + 6} fill={n.color} opacity={0.18} />}
                <circle r={r} fill={n.color} stroke={isDark ? '#000' : '#fff'} strokeWidth={isCenter ? 2 : 1} />
                <text
                  x={isCenter ? 0 : (labelLeft ? -(r + 5) : r + 5)}
                  y={isCenter ? r + 16 : 3}
                  textAnchor={isCenter ? 'middle' : (labelLeft ? 'end' : 'start')}
                  fontFamily={mono}
                  fontSize={fontSize}
                  fontWeight={isCenter || n.kind === 'parent' ? 700 : 400}
                  fill={labelColor}
                  stroke={haloColor}
                  strokeWidth={3}
                  paintOrder="stroke"
                  style={{ letterSpacing: isCenter ? '0.5px' : undefined }}
                >
                  {n.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      {graph.webNodes.length <= 1 && (
        <div style={{ position: 'absolute', left: '50%', top: '55%', transform: 'translate(-50%,-50%)', fontFamily: mono, fontSize: 10, color: dimColor }}>
          This entry has no linked terms yet.
        </div>
      )}
    </div>
  );
};

export default CodexWeb;
