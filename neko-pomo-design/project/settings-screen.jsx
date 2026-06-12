// SettingsScreen — ⚙️ せってい — cat customization + timer prefs.

function SettingsScreen() {
  const [focusMin, setFocusMin] = React.useState(25);
  const [breakMin, setBreakMin] = React.useState(5);
  const [longMin, setLongMin] = React.useState(15);
  const [sound, setSound] = React.useState('meow');
  const [haptics, setHaptics] = React.useState(true);
  const [autoBreak, setAutoBreak] = React.useState(false);

  return (
    <div style={{
      flex: 1, overflow: 'auto',
      background: NP.cream,
      padding: '14px 20px 100px',
      fontFamily: NP.font,
    }}>
      <h1 style={{
        margin: '6px 0 14px', fontSize: 26, fontWeight: 800, color: NP.brown,
        letterSpacing: -0.5,
      }}>せってい</h1>

      {/* Cat profile card */}
      <div style={{
        background: '#FFFFFF', borderRadius: 22,
        padding: '16px 16px 18px',
        boxShadow: `0 2px 10px ${NP.shadowSm}`,
        marginBottom: 14,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* paw watermark */}
        <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.08, color: NP.brown }}>
          <PawPrint size={88} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 76, height: 76, borderRadius: '50%',
            background: NP.pinkBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            position: 'relative',
          }}>
            <div style={{ marginTop: 8 }}>
              <Mugi mood="calm" size={84} />
            </div>
            <button style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 26, height: 26, borderRadius: '50%',
              background: NP.pink, color: '#fff',
              border: '2.5px solid #fff', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 13,
            }}>✎</button>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: NP.brownMid, letterSpacing: 1 }}>あいぼうのねこ</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: NP.brown, margin: '2px 0' }}>むぎ</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: NP.brownLt }}>
              キジトラ・ ねむがり・ Lv.7
            </div>
          </div>
        </div>
      </div>

      {/* Timer settings */}
      <SettingGroup label="タイマー">
        <StepperRow label="集中タイム" value={focusMin} unit="分" min={5} max={90} step={5}
          color={NP.pink} onChange={setFocusMin} />
        <Divider />
        <StepperRow label="休憩タイム" value={breakMin} unit="分" min={1} max={30} step={1}
          color={NP.green} onChange={setBreakMin} />
        <Divider />
        <StepperRow label="長休憩タイム" value={longMin} unit="分" min={5} max={60} step={5}
          color={NP.yellow} onChange={setLongMin} />
        <Divider />
        <ToggleRow label="自動で休憩スタート" value={autoBreak} onChange={setAutoBreak} />
      </SettingGroup>

      {/* Sound */}
      <SettingGroup label="サウンド ＆ バイブ">
        <RadioRow label="開始のおと" value={sound} onChange={setSound}
          options={[
            { v: 'meow', l: 'にゃーん' },
            { v: 'bell', l: 'りん♪' },
            { v: 'pad', l: 'にくきゅう' },
            { v: 'none', l: 'なし' },
          ]} />
        <Divider />
        <ToggleRow label="バイブレーション" value={haptics} onChange={setHaptics} />
      </SettingGroup>

      {/* About */}
      <SettingGroup label="そのほか">
        <LinkRow label="つうち" right="ON" />
        <Divider />
        <LinkRow label="テーマ" right="クリーム" />
        <Divider />
        <LinkRow label="バックアップ" right="iCloud" />
        <Divider />
        <LinkRow label="むぎについて" right="v1.0" />
      </SettingGroup>

      <div style={{
        textAlign: 'center', marginTop: 18,
        fontSize: 11, fontWeight: 700, color: NP.brownLt,
      }}>
        made with <span style={{ color: NP.pink }}>♥</span> for focused humans
      </div>
    </div>
  );
}

function SettingGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: 11, fontWeight: 800, color: NP.brownMid,
        letterSpacing: 1, padding: '0 14px 8px',
      }}>{label.toUpperCase()}</div>
      <div style={{
        background: '#FFFFFF', borderRadius: 18,
        boxShadow: `0 2px 10px ${NP.shadowSm}`,
        overflow: 'hidden',
      }}>{children}</div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: NP.creamDk, margin: '0 14px' }} />;
}

function StepperRow({ label, value, unit, min, max, step, color, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '12px 14px', gap: 12,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%', background: color,
      }} />
      <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: NP.brown }}>{label}</span>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: NP.creamDk, borderRadius: 999, padding: 3,
      }}>
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          style={{ ...stepBtn, color: NP.brown }}>−</button>
        <div style={{
          minWidth: 56, textAlign: 'center',
          fontSize: 14, fontWeight: 800, color: NP.brown,
          fontVariantNumeric: 'tabular-nums',
        }}>{value}<span style={{ fontSize: 11, marginLeft: 2, fontWeight: 700, color: NP.brownLt }}>{unit}</span></div>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          style={{ ...stepBtn, color: NP.brown }}>+</button>
      </div>
    </div>
  );
}
const stepBtn = {
  width: 28, height: 28, borderRadius: '50%',
  border: 'none', cursor: 'pointer',
  background: '#FFFFFF', boxShadow: '0 1px 3px rgba(74,44,26,0.12)',
  fontFamily: NP.font, fontWeight: 800, fontSize: 16,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 0,
};

function ToggleRow({ label, value, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '12px 14px', gap: 12,
    }}>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: NP.brown }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 48, height: 28, borderRadius: 14,
          background: value ? NP.pink : NP.creamDk,
          border: 'none', cursor: 'pointer', padding: 2,
          display: 'flex', alignItems: 'center',
          transition: 'background .2s',
        }}>
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: '#FFFFFF',
          transform: value ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform .2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}

function RadioRow({ label, value, onChange, options }) {
  return (
    <div style={{ padding: '12px 14px' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: NP.brown, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map(o => (
          <button key={o.v}
            onClick={() => onChange(o.v)}
            style={{
              border: 'none', cursor: 'pointer',
              padding: '7px 12px', borderRadius: 999,
              background: value === o.v ? NP.pink : NP.creamDk,
              color: value === o.v ? '#FFFFFF' : NP.brownMid,
              fontFamily: NP.font, fontWeight: 800, fontSize: 12,
              transition: 'all .15s',
            }}>{o.l}</button>
        ))}
      </div>
    </div>
  );
}

function LinkRow({ label, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '14px', gap: 12, cursor: 'pointer',
    }}>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: NP.brown }}>{label}</span>
      {right && <span style={{ fontSize: 13, fontWeight: 700, color: NP.brownLt }}>{right}</span>}
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke={NP.brownLt} strokeWidth="2" strokeLinecap="round">
        <path d="M1 1l5 6-5 6"/>
      </svg>
    </div>
  );
}
window.SettingsScreen = SettingsScreen;
