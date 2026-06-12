// NekopomoApp — main composition for the prototype.
// Each artboard instance gets its own state via props; the app drives a real
// countdown timer when running so the prototype feels alive.

function NekopomoApp({
  initialNav = 'home',
  initialTab = 'timer',
  initialMode = 'focus',
  initialRemaining,        // seconds; defaults from mode
  initialRunning = false,
  timeOfDay = 'day',       // 'day' | 'dusk' | 'night'
  mood,                    // override mood; otherwise computed
  bubble,                  // override bubble text
  initialTodos,
  initialActiveId,
  pomosToday = 2,
}) {
  const totals = { focus: 25 * 60, break: 5 * 60, longbreak: 15 * 60 };

  const [nav, setNav] = React.useState(initialNav);
  const [tab, setTab] = React.useState(initialTab);
  const [mode, setMode] = React.useState(initialMode);
  const [running, setRunning] = React.useState(initialRunning);
  const [remaining, setRemaining] = React.useState(
    initialRemaining ?? totals[initialMode]
  );

  const [todos, setTodos] = React.useState(initialTodos ?? [
    { id: 1, text: 'デザインレビューの準備',  done: false, pomos: 1, goal: 2 },
    { id: 2, text: '英語の勉強（リスニング）', done: false, pomos: 0, goal: 1 },
    { id: 3, text: 'メール返信',              done: true,  pomos: 1, goal: 1 },
    { id: 4, text: '部屋のかたづけ',          done: false, pomos: 0, goal: 2 },
    { id: 5, text: '本を30ページ読む',        done: false, pomos: 0, goal: 1 },
  ]);
  const [activeId, setActiveId] = React.useState(initialActiveId ?? 1);

  // Tick timer when running.
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { setRunning(false); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // Reset remaining when mode changes (and not running).
  const handleMode = (m) => {
    setMode(m);
    if (!running) setRemaining(totals[m]);
  };

  // Pick mood for Mugi
  const computedMood = mood ?? (() => {
    if (timeOfDay === 'night') return 'sleep';
    if (mode === 'break' || mode === 'longbreak') return 'happy';
    if (running) return 'focus';
    return 'calm';
  })();

  // Bubble text
  const activeTask = todos.find(t => t.id === activeId);
  const bubbleText = bubble ?? (() => {
    if (computedMood === 'sleep') return 'むにゃ…\nおやすみ…';
    if (computedMood === 'grumpy') return 'なに サボってるにゃ？';
    if (computedMood === 'happy' && (mode === 'break' || mode === 'longbreak')) return 'おつかれさま♡';
    if (computedMood === 'focus') return 'しーっ…\nがんばってる！';
    if (tab === 'todo') return 'きょうも がんばろ〜';
    if (running) return 'よこに いるよ';
    return 'おはよう！\nなにから する？';
  })();

  return (
    <div style={{
      width: '100%', height: '100%',
      background: NP.cream,
      display: 'flex', flexDirection: 'column',
      fontFamily: NP.font,
      color: NP.brown,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* keyframes for pulse animation */}
      <style>{`
        @keyframes np-pulse { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(1.4); opacity: .5 } }
        @keyframes np-bob { 0%,100% { transform: translate(-50%, 0) } 50% { transform: translate(-50%, -3px) } }
        @keyframes np-sway { 0%,100% { transform: translate(-50%, 0) rotate(-1deg) } 50% { transform: translate(-50%, -2px) rotate(1deg) } }
      `}</style>

      {/* iOS status bar spacer (status bar is rendered absolutely by IOSDevice) */}
      <div style={{ height: 54, flexShrink: 0 }} />

      {nav === 'home' && (
        <>
          {/* TOP — room scene + cat */}
          <RoomScene time={timeOfDay} height={362}>
            {/* speech bubble */}
            <SpeechBubble
              text={bubbleText}
              style={{ position: 'absolute', top: 90, right: 28, zIndex: 5 }}
            />
            {/* the cat */}
            <div style={{
              position: 'absolute',
              bottom: 6,
              left: '50%',
              transform: 'translate(-50%, 0)',
              animation: running && computedMood === 'focus' ? 'np-bob 3.6s ease-in-out infinite' : 'np-sway 4.2s ease-in-out infinite',
              zIndex: 4,
            }}>
              <Mugi mood={computedMood} size={196} />
            </div>
            {/* "むぎ" name tag floating */}
            <div style={{
              position: 'absolute', bottom: 12, left: 18,
              background: 'rgba(255,255,255,0.85)',
              border: `1.5px solid ${NP.brown}`,
              borderRadius: 999, padding: '3px 10px',
              fontSize: 11, fontWeight: 800, color: NP.brown,
              backdropFilter: 'blur(4px)',
            }}>
              <PawPrintInline /> むぎ
            </div>
          </RoomScene>

          {/* Tab switcher */}
          <div style={{
            display: 'flex', justifyContent: 'center',
            padding: '12px 20px 0',
            background: NP.cream,
          }}>
            <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
              <TabButton active={tab === 'timer'} onClick={() => setTab('timer')}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="7" cy="8" r="5"/>
                  <path d="M7 5v3l2 1.5M5 1h4M7 3V1"/>
                </svg>
                タイマー
              </TabButton>
              <TabButton active={tab === 'todo'} onClick={() => setTab('todo')}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M2 4h10M2 7h7M2 10h10"/>
                  <circle cx="11" cy="9" r="1.5" fill="currentColor" stroke="none"/>
                </svg>
                やること
              </TabButton>
            </div>
          </div>

          {/* Bottom content */}
          <div style={{ flex: 1, overflow: 'auto', background: NP.cream }}>
            {tab === 'timer' ? (
              <TimerTab
                mode={mode} setMode={handleMode}
                running={running} setRunning={setRunning}
                remaining={remaining} total={totals[mode]}
                task={activeTask?.text}
                pomosToday={pomosToday} pomoGoal={4}
              />
            ) : (
              <TodoTab
                todos={todos} setTodos={setTodos}
                activeId={activeId} setActiveId={setActiveId}
              />
            )}
          </div>
        </>
      )}

      {nav === 'records'  && <RecordsScreen  />}
      {nav === 'settings' && <SettingsScreen />}

      {/* Bottom nav */}
      <BottomNav nav={nav} setNav={setNav} />
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? NP.brown : 'transparent',
        color: active ? NP.cream : NP.brownLt,
        border: 'none', cursor: 'pointer',
        padding: '8px 16px',
        borderRadius: 999,
        fontFamily: NP.font,
        fontSize: 13, fontWeight: 800,
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'all .15s',
      }}>{children}</button>
  );
}

function PawPrintInline() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: -1 }}>
      <ellipse cx="12" cy="16" rx="6" ry="5"/>
      <ellipse cx="5" cy="9" rx="2.2" ry="3"/>
      <ellipse cx="9" cy="5" rx="2.2" ry="3"/>
      <ellipse cx="15" cy="5" rx="2.2" ry="3"/>
      <ellipse cx="19" cy="9" rx="2.2" ry="3"/>
    </svg>
  );
}

function BottomNav({ nav, setNav }) {
  const items = [
    { id: 'home',     label: 'ホーム', icon: <HouseIcon /> },
    { id: 'records',  label: 'きろく', icon: <ChartIcon /> },
    { id: 'settings', label: 'せってい', icon: <GearIcon /> },
  ];
  return (
    <div style={{
      flexShrink: 0,
      background: '#FFFFFF',
      borderTop: `1px solid ${NP.creamDk}`,
      paddingBottom: 28, // home indicator space
      paddingTop: 8,
      display: 'flex', justifyContent: 'space-around',
      boxShadow: '0 -4px 14px rgba(74,44,26,0.04)',
    }}>
      {items.map(it => (
        <button key={it.id}
          onClick={() => setNav(it.id)}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '4px 12px',
            color: nav === it.id ? NP.pink : NP.brownLt,
            fontFamily: NP.font,
            fontWeight: 800, fontSize: 10,
            transition: 'color .15s',
          }}>
          <div style={{
            width: 36, height: 24, borderRadius: 12,
            background: nav === it.id ? NP.pinkBg : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background .15s',
          }}>{it.icon}</div>
          {it.label}
        </button>
      ))}
    </div>
  );
}

function HouseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M3 9l7-5.5L17 9v8H3V9z"/>
      <path d="M8 17v-4h4v4"/>
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16V8M8 16V4M13 16v-6M3 16h14"/>
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <circle cx="10" cy="10" r="2.5"/>
      <path d="M10 1.5v3M10 15.5v3M18.5 10h-3M4.5 10h-3M16 4l-2 2M6 14l-2 2M16 16l-2-2M6 6L4 4"/>
    </svg>
  );
}

window.NekopomoApp = NekopomoApp;
