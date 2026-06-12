// TimerTab — the lower half when "タイマー" tab is selected.
// Mode chips + circular timer + start/pause + current task chip.

function TimerTab({ mode, setMode, running, setRunning, remaining, total, task, pomosToday = 0, pomoGoal = 4 }) {
  const modes = [
    { id: 'focus',     label: '集中', sub: '25分', color: NP.pink },
    { id: 'break',     label: '休憩', sub: '5分',  color: NP.green },
    { id: 'longbreak', label: '長休憩', sub: '15分', color: NP.yellow },
  ];

  return (
    <div style={{
      padding: '18px 20px 0',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      fontFamily: NP.font,
    }}>
      {/* Mode chips */}
      <div style={{
        display: 'flex', gap: 8,
        background: NP.creamDk,
        padding: 4, borderRadius: 999,
      }}>
        {modes.map(m => (
          <button key={m.id}
            onClick={() => setMode && setMode(m.id)}
            style={{
              border: 'none', cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 999,
              background: mode === m.id ? '#FFFFFF' : 'transparent',
              boxShadow: mode === m.id ? '0 2px 8px rgba(74,44,26,0.12)' : 'none',
              fontFamily: NP.font,
              fontWeight: 800,
              fontSize: 13,
              color: mode === m.id ? NP.brown : NP.brownLt,
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all .2s',
            }}>
            <span>{m.label}</span>
            {mode === m.id && (
              <span style={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.sub}</span>
            )}
          </button>
        ))}
      </div>

      {/* Timer dial */}
      <TimerDial remaining={remaining} total={total} mode={mode} running={running} />

      {/* Current task chip */}
      {task && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: NP.cream, border: `1.5px dashed ${NP.brownLt}`,
          borderRadius: 999,
          padding: '8px 14px',
          maxWidth: 280,
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: NP.brownLt, letterSpacing: 1 }}>NOW</span>
          <span style={{
            fontSize: 13, fontWeight: 700, color: NP.brown,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: 180,
          }}>{task}</span>
        </div>
      )}

      {/* Start / Pause + secondary actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 2 }}>
        {/* skip */}
        <button style={{
          border: 'none', cursor: 'pointer',
          width: 44, height: 44, borderRadius: 22,
          background: NP.cream, color: NP.brownMid,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 2px 8px ${NP.shadow}`,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3 3l8 5-8 5V3zM12 3h2v10h-2z"/></svg>
        </button>

        {/* main button */}
        <button
          onClick={() => setRunning && setRunning(!running)}
          style={{
            border: 'none', cursor: 'pointer',
            height: 56, minWidth: 160, padding: '0 28px',
            borderRadius: 28,
            background: NP.pink,
            color: '#fff',
            fontFamily: NP.font,
            fontWeight: 800, fontSize: 16, letterSpacing: 0.5,
            boxShadow: `0 6px 0 ${NP.brown}, 0 8px 16px rgba(255,133,161,0.4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transform: running ? 'translateY(2px)' : 'translateY(0)',
            transition: 'transform .1s',
          }}>
          {running ? (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="1" width="4" height="12" rx="1"/><rect x="8" y="1" width="4" height="12" rx="1"/></svg>
              いったん休む
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M2 1l11 6-11 6V1z"/></svg>
              スタート
            </>
          )}
        </button>

        {/* reset */}
        <button style={{
          border: 'none', cursor: 'pointer',
          width: 44, height: 44, borderRadius: 22,
          background: NP.cream, color: NP.brownMid,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 2px 8px ${NP.shadow}`,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 8a6 6 0 1 0 1.5-4M2 3v3.5H5.5"/>
          </svg>
        </button>
      </div>

      {/* Pomos today */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        marginTop: 2,
      }}>
        {Array.from({ length: pomoGoal }).map((_, i) => (
          <div key={i} style={{
            width: 18, height: 18, borderRadius: '50%',
            background: i < pomosToday ? NP.pink : NP.creamDk,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: i < pomosToday ? '#FFFFFF' : NP.brownLt,
          }}>
            <PawPrint size={11} />
          </div>
        ))}
        <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 800, color: NP.brownMid }}>
          {pomosToday}/{pomoGoal} 今日のもくひょう
        </span>
      </div>
    </div>
  );
}
window.TimerTab = TimerTab;
