// RecordsScreen — 📊 きろく — stats, streak, weekly graph.

function RecordsScreen() {
  // weekday data
  const week = [
    { d: '月', v: 3 },
    { d: '火', v: 5 },
    { d: '水', v: 2 },
    { d: '木', v: 6 },
    { d: '金', v: 4 },
    { d: '土', v: 7 },
    { d: '日', v: 4, today: true },
  ];
  const max = 8;

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
      }}>きろく</h1>

      {/* Mugi happiness card */}
      <div style={{
        background: `linear-gradient(135deg, ${NP.pinkBg} 0%, ${NP.peach} 100%)`,
        borderRadius: 22,
        padding: 16,
        display: 'flex', alignItems: 'center', gap: 14,
        marginBottom: 14,
        boxShadow: `0 4px 14px ${NP.shadow}`,
      }}>
        <div style={{
          width: 64, height: 64,
          background: '#FFFFFF', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `inset 0 0 0 3px ${NP.pink}`,
        }}>
          <div style={{ marginTop: 6 }}>
            <Mugi mood="happy" size={68} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: NP.brownMid, letterSpacing: 1 }}>
            むぎの きげん
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: NP.brown, margin: '2px 0 6px' }}>
            ごきげん♡
          </div>
          <div style={{
            height: 8, background: '#FFFFFF', borderRadius: 4, overflow: 'hidden',
          }}>
            <div style={{ height: '100%', width: '78%', background: NP.pink, borderRadius: 4 }} />
          </div>
        </div>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <StatCard icon="🔥" label="れんぞく" value="12" unit="日" color={NP.pink} />
        <StatCard icon="🐾" label="きょう" value="4" unit="ポモ" color={NP.green} />
        <StatCard icon="⏰" label="ごうけい" value="62" unit="時間" color={NP.yellow} />
        <StatCard icon="✨" label="タスク" value="48" unit="かんりょう" color={NP.peachDk} />
      </div>

      {/* Weekly chart */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 22, padding: 16,
        boxShadow: `0 2px 10px ${NP.shadowSm}`,
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: NP.brownMid, letterSpacing: 0.5 }}>
              こんしゅう
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: NP.brown }}>31 ポモドーロ</div>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 800, color: NP.green,
            background: '#E6F0E8', borderRadius: 999, padding: '4px 10px',
          }}>+18% ↑</div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          height: 110, gap: 6, paddingBottom: 22, position: 'relative',
        }}>
          {week.map((d, i) => {
            const h = (d.v / max) * 86;
            return (
              <div key={i} style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4,
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: d.today ? NP.pink : NP.brownLt }}>
                  {d.v}
                </div>
                <div style={{
                  width: '100%', maxWidth: 28, height: h,
                  background: d.today ? NP.pink : NP.peach,
                  borderRadius: '10px 10px 4px 4px',
                  boxShadow: d.today ? `0 2px 0 ${NP.brown}` : 'none',
                }} />
                <div style={{
                  position: 'absolute', bottom: 0,
                  fontSize: 11, fontWeight: 800,
                  color: d.today ? NP.pink : NP.brownLt,
                }}>{d.d}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements strip */}
      <div style={{
        background: '#FFFFFF', borderRadius: 22, padding: 16,
        boxShadow: `0 2px 10px ${NP.shadowSm}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12,
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: NP.brown }}>あつめたバッジ</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: NP.brownLt }}>7 / 24</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { e: '🌅', l: 'はやおき', got: true, bg: NP.peach },
            { e: '🐾', l: '10ポモ', got: true, bg: NP.pinkBg },
            { e: '📚', l: '読書家', got: true, bg: '#E6F0E8' },
            { e: '🌙', l: 'よふかし', got: false, bg: NP.creamDk },
            { e: '🍡', l: '？？？', got: false, bg: NP.creamDk },
          ].map((b, i) => (
            <div key={i} style={{
              flex: 1, aspectRatio: '1 / 1',
              borderRadius: 14, background: b.bg,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 2, opacity: b.got ? 1 : 0.4,
              filter: b.got ? 'none' : 'grayscale(1)',
            }}>
              <div style={{ fontSize: 22 }}>{b.e}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: NP.brown }}>{b.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, unit, color }) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 18, padding: 14,
      boxShadow: `0 2px 10px ${NP.shadowSm}`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 11, fontWeight: 800, color: NP.brownMid,
        marginBottom: 4,
      }}>
        <span style={{
          width: 22, height: 22, borderRadius: '50%',
          background: color, opacity: 0.18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13,
        }}>{icon}</span>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontSize: 26, fontWeight: 800, color: NP.brown,
          lineHeight: 1, fontVariantNumeric: 'tabular-nums',
        }}>{value}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: NP.brownLt }}>{unit}</span>
      </div>
    </div>
  );
}
window.RecordsScreen = RecordsScreen;
