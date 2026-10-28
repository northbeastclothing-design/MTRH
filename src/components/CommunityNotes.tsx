import React, { useEffect, useMemo, useState } from 'react';
import { Firestore, addDoc, collection, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';

// Community notes attached to a data point (map feature, codex node or timeline item).
// Storage: Firestore collection `notes` { pointId, name, text, createdAt } — anyone can read and
// add (rate-limited by the Firestore rules); only the admin can edit or delete.

interface CommunityNote {
  id: string;
  name: string;
  text: string;
  createdAt: number; // ms epoch (0 while the server timestamp is pending)
}

interface CommunityNotesProps {
  db: Firestore;
  pointId: string;
  theme: any;
  isDark?: boolean;
  trackCustomEvent?: (name: string, params?: Record<string, any>) => void;
}

const MAX_TEXT = 500;
const MAX_NAME = 40;
const COOLDOWN_MS = 60_000;
const COOLDOWN_KEY = 'mtrh_note_last_post';

const sanitizeId = (id: string) => String(id).replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 128);

const timeAgo = (ms: number) => {
  if (!ms) return 'just now';
  const s = Math.max(1, Math.floor((Date.now() - ms) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); if (d < 30) return `${d}d ago`;
  return new Date(ms).toLocaleDateString();
};

const CommunityNotes: React.FC<CommunityNotesProps> = ({ db, pointId, theme, isDark, trackCustomEvent }) => {
  const safeId = useMemo(() => sanitizeId(pointId), [pointId]);
  const [notes, setNotes] = useState<CommunityNote[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error' | 'cooldown'>('idle');

  useEffect(() => {
    setNotes([]); setOpen(false); setStatus('idle');
    if (!safeId) return;
    const q = query(collection(db, 'notes'), where('pointId', '==', safeId));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list: CommunityNote[] = [];
      snap.forEach((d) => {
        const data: any = d.data();
        list.push({
          id: d.id,
          name: typeof data.name === 'string' && data.name.trim() ? data.name.trim() : 'Anonymous',
          text: typeof data.text === 'string' ? data.text : '',
          createdAt: data.createdAt && typeof data.createdAt.toMillis === 'function' ? data.createdAt.toMillis() : 0
        });
      });
      list.sort((a, b) => (b.createdAt || Date.now()) - (a.createdAt || Date.now()));
      setNotes(list);
    }, () => { /* read errors are non-fatal: the section just stays empty */ });
    return () => unsubscribe();
  }, [db, safeId]);

  const submit = async () => {
    const body = text.trim();
    if (!body || status === 'sending') return;
    try {
      const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
      if (Date.now() - last < COOLDOWN_MS) { setStatus('cooldown'); return; }
    } catch { /* storage unavailable: skip the client-side cooldown */ }
    setStatus('sending');
    try {
      await addDoc(collection(db, 'notes'), {
        pointId: safeId,
        name: name.trim().slice(0, MAX_NAME),
        text: body.slice(0, MAX_TEXT),
        createdAt: serverTimestamp()
      });
      try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch { /* ignore */ }
      setText(''); setStatus('sent'); setOpen(false);
      trackCustomEvent?.('community_note_added', { point_id: safeId });
    } catch {
      setStatus('error');
    }
  };

  const mono = '"Space Mono", monospace';
  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    border: `1px solid ${theme.border}`, color: theme.text, fontFamily: mono, fontSize: '10px', padding: '8px', outline: 'none', borderRadius: '2px'
  };

  return (
    <div style={{ marginTop: '24px', borderTop: `1px solid ${theme.borderLight || theme.border}`, paddingTop: '20px', textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ fontFamily: mono, fontWeight: 700, fontSize: '11px', lineHeight: '22px', color: theme.text, letterSpacing: '1px' }}>
          COMMUNITY NOTES{notes.length > 0 ? ` (${notes.length})` : ''}
        </div>
        <button
          type="button"
          onClick={() => { setOpen(o => !o); setStatus('idle'); }}
          style={{ background: open ? theme.text : 'transparent', color: open ? theme.bg : theme.text, border: `1px solid ${theme.text}`, fontFamily: mono, fontSize: '9px', fontWeight: 700, letterSpacing: '1px', padding: '4px 10px', cursor: 'pointer', borderRadius: '12px' }}
        >
          {open ? 'CANCEL' : '+ ADD NOTE'}
        </button>
      </div>

      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
          <input type="text" placeholder="NAME (OPTIONAL)" maxLength={MAX_NAME} value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          <textarea
            placeholder="ADD CONTEXT, A SOURCE, A CORRECTION OR A FIRST-HAND ACCOUNT..."
            maxLength={MAX_TEXT} value={text} onChange={e => setText(e.target.value)} rows={4}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '70px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: mono, fontSize: '8px', color: theme.textDim }}>{text.length}/{MAX_TEXT} · notes are public</span>
            <button
              type="button" onClick={submit} disabled={!text.trim() || status === 'sending'}
              style={{ background: theme.text, color: theme.bg, border: 'none', fontFamily: mono, fontSize: '9px', fontWeight: 700, letterSpacing: '1px', padding: '6px 12px', cursor: text.trim() ? 'pointer' : 'default', opacity: text.trim() ? 1 : 0.5, borderRadius: '12px' }}
            >
              {status === 'sending' ? 'POSTING...' : 'POST NOTE'}
            </button>
          </div>
          {status === 'error' && <span style={{ fontFamily: mono, fontSize: '9px', color: '#ff6b6b' }}>Could not post the note. Try again in a moment.</span>}
          {status === 'cooldown' && <span style={{ fontFamily: mono, fontSize: '9px', color: theme.textDim }}>One note per minute, please.</span>}
        </div>
      )}
      {status === 'sent' && !open && <div style={{ fontFamily: mono, fontSize: '9px', color: theme.textDim, marginTop: '6px' }}>Note posted.</div>}

      {notes.length === 0 ? (
        !open && <div style={{ fontFamily: mono, fontSize: '9px', color: theme.textDim, marginTop: '8px', lineHeight: '16px' }}>No notes yet. Know something about this entry? Add the first one.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
          {notes.map(n => (
            <div key={n.id} style={{ borderLeft: `2px solid ${theme.border}`, padding: '2px 0 2px 10px' }}>
              <div style={{ fontFamily: mono, fontSize: '8px', color: theme.textDim, letterSpacing: '0.5px', marginBottom: '2px' }}>
                {n.name.toUpperCase()} · {timeAgo(n.createdAt)}
              </div>
              <div style={{ fontFamily: mono, fontSize: '10px', lineHeight: '18px', color: theme.text, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{n.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityNotes;
