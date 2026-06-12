// TodoTab — the lower half when "やること" tab is selected.

function TodoTab({ todos, setTodos, activeId, setActiveId }) {
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const addRef = React.useRef(null);
  React.useEffect(() => { if (adding && addRef.current) addRef.current.focus(); }, [adding]);

  const toggle = (id) => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const commitAdd = () => {
    const v = draft.trim();
    if (v) setTodos([...todos, { id: Date.now(), text: v, done: false, pomos: 0, goal: 2 }]);
    setDraft(''); setAdding(false);
  };

  const remaining = todos.filter(t => !t.done).length;

  return (
    <div style={{
      padding: '14px 20px 0',
      fontFamily: NP.font,
    }}>
      {/* header row */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <h2 style={{
          margin: 0, fontSize: 18, fontWeight: 800, color: NP.brown,
        }}>きょうのやること</h2>
        <span style={{
          fontSize: 12, fontWeight: 700, color: NP.brownLt,
        }}>のこり {remaining}こ</span>
      </div>

      {/* list */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 8,
        maxHeight: 250, overflow: 'auto',
        paddingBottom: 6,
      }}>
        {todos.map(t => (
          <TodoRow key={t.id} todo={t}
            active={t.id === activeId}
            onToggle={() => toggle(t.id)}
            onPick={() => setActiveId && setActiveId(t.id)} />
        ))}

        {/* add row */}
        {adding ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#FFFFFF', borderRadius: 14,
            padding: '12px 14px',
            boxShadow: `0 2px 8px ${NP.shadow}`,
            border: `2px solid ${NP.pink}`,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              border: `2px solid ${NP.pink}`,
              flexShrink: 0,
            }} />
            <input
              ref={addRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitAdd}
              onKeyDown={(e) => { if (e.key === 'Enter') commitAdd(); if (e.key === 'Escape') { setDraft(''); setAdding(false); } }}
              placeholder="なにをする？"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: NP.font, fontSize: 15, fontWeight: 700, color: NP.brown,
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'transparent',
              border: `2px dashed ${NP.brownLt}`,
              color: NP.brownLt,
              borderRadius: 14, padding: '12px 14px',
              cursor: 'pointer',
              fontFamily: NP.font, fontSize: 14, fontWeight: 800,
            }}>
            <span style={{
              width: 22, height: 22, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${NP.brownLt}`,
              fontSize: 14, lineHeight: 1,
            }}>＋</span>
            あたらしいタスク
          </button>
        )}
      </div>
    </div>
  );
}

function TodoRow({ todo, active, onToggle, onPick }) {
  return (
    <div
      onClick={onPick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: active ? '#FFFFFF' : '#FFFFFF',
        borderRadius: 14,
        padding: '12px 14px',
        boxShadow: active
          ? `0 4px 0 ${NP.brown}, 0 6px 14px ${NP.shadow}`
          : `0 2px 8px ${NP.shadowSm}`,
        border: active ? `2px solid ${NP.pink}` : `2px solid transparent`,
        cursor: 'pointer',
        opacity: todo.done ? 0.55 : 1,
        transition: 'all .15s',
      }}>
      {/* checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        style={{
          width: 22, height: 22, borderRadius: '50%',
          border: `2px solid ${todo.done ? NP.pink : NP.brownLt}`,
          background: todo.done ? NP.pink : '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0, flexShrink: 0,
        }}>
        {todo.done && (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 5.5l2.5 2.5L9 3"/>
          </svg>
        )}
      </button>

      {/* text + pomos */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: NP.brown,
          textDecoration: todo.done ? 'line-through' : 'none',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{todo.text}</div>
        {todo.goal > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
            {Array.from({ length: todo.goal }).map((_, i) => (
              <span key={i} style={{
                color: i < todo.pomos ? NP.pink : NP.creamDk,
                display: 'flex',
              }}>
                <PawPrint size={10} />
              </span>
            ))}
            <span style={{ fontSize: 10, fontWeight: 700, color: NP.brownLt, marginLeft: 3 }}>
              {todo.pomos}/{todo.goal}
            </span>
          </div>
        )}
      </div>

      {/* active indicator */}
      {active && (
        <div style={{
          fontSize: 10, fontWeight: 800, color: NP.pink,
          background: NP.pinkBg,
          borderRadius: 999,
          padding: '3px 8px',
          letterSpacing: 0.5,
        }}>NOW</div>
      )}
    </div>
  );
}
window.TodoTab = TodoTab;
