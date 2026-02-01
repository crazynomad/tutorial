import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import {
  color,
  font,
  fontWeight,
  shadow,
  gradient,
  radius,
  cardStyle as themeCardStyle,
  iconBadge,
  s,
} from "./lib/theme";

// ─── Helpers ───────────────────────────────────────────────

const enterSpring = (
  frame: number,
  fps: number,
  delay: number,
  config = { damping: 10, stiffness: 160, mass: 0.7 },
) =>
  spring({
    frame: frame - delay,
    fps,
    config,
  });

const clamp = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
) =>
  interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const glowPulse = (frame: number, speed = 0.06) =>
  0.3 + Math.sin(frame * speed) * 0.15;

// ─── Shared Styles ─────────────────────────────────────────

const baseText: React.CSSProperties = {
  fontFamily: font.display,
  fontWeight: fontWeight.bold,
  color: color.text,
  letterSpacing: "-0.02em",
};

const localCardStyle: React.CSSProperties = {
  ...themeCardStyle(),
};

/** Icon circle consistent with project pattern */
const iconCircle = (c: string, size = s(72)): React.CSSProperties =>
  iconBadge(c, size);

// ─── Section 1: 开场火车 (0-90f) ──────────────────────────

const TrainIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const trainX = interpolate(frame, [0, 30], [-300, 960], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const titleScale = enterSpring(frame, fps, 22);
  const titleOpacity = clamp(frame, [22, 32], [0, 1]);

  // Subtitle slides up
  const subY = interpolate(frame, [35, 50], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subOpacity = clamp(frame, [35, 48], [0, 1]);

  // Glow line extends beneath title
  const lineWidth = clamp(frame, [30, 55], [0, s(280)]);

  const fadeOut = clamp(frame, [75, 88], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* AI-generated green train hero image */}
      <Img
        src={staticFile("hero-green-train.png")}
        style={{
          position: "absolute",
          top: s(220),
          left: 0,
          width: s(400),
          height: s(240),
          objectFit: "contain",
          transform: `translateX(${trainX - 480}px)`,
          filter: `drop-shadow(0 0 20px ${color.green}60)`,
        }}
      />

      {/* Title */}
      <div
        style={{
          ...baseText,
          fontSize: s(72),
          fontWeight: fontWeight.heavy,
          color: color.green,
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textShadow: shadow.textGlow(color.green, 0.25),
        }}
      >
        绿皮火车
      </div>

      {/* Accent line */}
      <div
        style={{
          width: lineWidth,
          height: s(3),
          borderRadius: s(2),
          background: gradient.accentLine(color.green),
          marginTop: s(12),
        }}
      />

      {/* Subtitle */}
      <div
        style={{
          ...baseText,
          fontSize: s(28),
          color: color.textSecondary,
          fontWeight: fontWeight.medium,
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          marginTop: s(16),
          letterSpacing: "0.08em",
        }}
      >
        AI 工具系列教程
      </div>
    </AbsoluteFill>
  );
};

// ─── Section 2: 打破刻板印象 (90-330f) ────────────────────

const StereotypeBreak: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - 90;

  if (localFrame < 0 || localFrame > 240) return null;

  const label1Scale = enterSpring(localFrame, fps, 10);
  const label2Scale = enterSpring(localFrame, fps, 30);
  const label1Opacity = clamp(localFrame, [10, 20], [0, 1]);
  const label2Opacity = clamp(localFrame, [30, 40], [0, 1]);

  // Strikethrough line
  const strikeWidth = clamp(localFrame, [80, 105], [0, 100]);
  const strikeOpacity = clamp(localFrame, [78, 85], [0, 1]);

  // Labels dim after strike
  const labelDim = clamp(localFrame, [100, 120], [1, 0.3]);

  // "普通人也行" card enters
  const altScale = enterSpring(localFrame, fps, 125);
  const altOpacity = clamp(localFrame, [125, 138], [0, 1]);
  const altGlow = localFrame > 140 ? glowPulse(localFrame) + 0.7 : 1;

  const fadeOut = clamp(localFrame, [210, 235], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Stereotype label cards */}
      <div
        style={{
          display: "flex",
          gap: s(32),
          marginBottom: s(50),
          position: "relative",
          opacity: labelDim,
        }}
      >
        <div
          style={{
            ...localCardStyle,
            padding: `${s(16)}px ${s(32)}px`,
            transform: `scale(${label1Scale})`,
            opacity: label1Opacity,
          }}
        >
          <span
            style={{
              ...baseText,
              fontSize: s(38),
              display: "flex",
              alignItems: "center",
              gap: s(12),
            }}
          >
            <div style={iconCircle(color.purple, s(48))}>
              <span style={{ fontSize: s(24) }}>🤓</span>
            </div>
            AI大佬
          </span>
        </div>

        <div
          style={{
            ...localCardStyle,
            padding: `${s(16)}px ${s(32)}px`,
            transform: `scale(${label2Scale})`,
            opacity: label2Opacity,
          }}
        >
          <span
            style={{
              ...baseText,
              fontSize: s(38),
              display: "flex",
              alignItems: "center",
              gap: s(12),
            }}
          >
            <div style={iconCircle(color.blue, s(48))}>
              <span style={{ fontSize: s(24) }}>👨‍💻</span>
            </div>
            程序员专属
          </span>
        </div>

        {/* Strikethrough line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: `${strikeWidth}%`,
            height: s(3),
            background: color.red,
            boxShadow: `0 0 12px ${color.red}60`,
            transform: "translateY(-50%)",
            opacity: strikeOpacity,
            borderRadius: s(2),
            zIndex: 5,
          }}
        />
      </div>

      {/* "普通人也行" success card */}
      <div
        style={{
          ...localCardStyle,
          padding: `${s(20)}px ${s(48)}px`,
          background: `linear-gradient(135deg, ${color.green}15, ${color.green}08)`,
          border: `1px solid ${color.green}40`,
          boxShadow: `0 0 30px ${color.green}15`,
          opacity: altOpacity * altGlow,
          transform: `scale(${altScale})`,
        }}
      >
        <span
          style={{
            ...baseText,
            fontSize: s(48),
            fontWeight: fontWeight.heavy,
            color: color.green,
            display: "flex",
            alignItems: "center",
            gap: s(16),
          }}
        >
          <div style={iconCircle(color.green, s(56))}>
            <span style={{ fontSize: s(28) }}>🙋</span>
          </div>
          普通人也行
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Section 3: 0基础 (330-480f) ──────────────────────────

const ZeroBasis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - 330;

  if (localFrame < 0 || localFrame > 150) return null;

  // Drop in from above
  const dropY = interpolate(localFrame, [0, 16], [-500, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const bounceScale = spring({
    frame: Math.max(0, localFrame - 16),
    fps,
    config: { damping: 6, stiffness: 200, mass: 0.8 },
  });

  // Ring burst on impact
  const ringScale = clamp(localFrame, [16, 50], [0.2, 2.5]);
  const ringOpacity = clamp(localFrame, [16, 50], [0.8, 0]);

  // Subtitle appears
  const subOpacity = clamp(localFrame, [30, 42], [0, 1]);
  const subY = interpolate(localFrame, [30, 45], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shake on impact
  const shakeX =
    localFrame >= 16 && localFrame <= 26
      ? Math.sin(localFrame * 7) * (26 - localFrame) * 1.5
      : 0;

  const fadeOut = clamp(localFrame, [120, 145], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        transform: `translateX(${shakeX}px)`,
      }}
    >
      {/* Impact ring */}
      <div
        style={{
          position: "absolute",
          width: s(200),
          height: s(200),
          borderRadius: "50%",
          border: `2px solid ${color.gold}`,
          opacity: ringOpacity,
          transform: `scale(${ringScale})`,
          boxShadow: `0 0 20px ${color.gold}40`,
        }}
      />

      {/* Big "0" numeral */}
      <div
        style={{
          ...baseText,
          fontSize: s(160),
          fontWeight: fontWeight.heavy,
          color: color.gold,
          textShadow: shadow.textGlow(color.gold, 0.3),
          transform: `translateY(${dropY}px) scale(${bounceScale})`,
          lineHeight: 1,
        }}
      >
        0
      </div>

      {/* "基础" beneath */}
      <div
        style={{
          ...baseText,
          fontSize: s(56),
          fontWeight: fontWeight.bold,
          color: color.text,
          marginTop: s(-8),
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
        }}
      >
        基础
      </div>

      {/* Accent line */}
      <div
        style={{
          width: s(120),
          height: s(3),
          borderRadius: s(2),
          background: gradient.accentLine(color.gold),
          marginTop: s(16),
          opacity: subOpacity,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Section 4: 磁盘清理 (480-660f) ──────────────────────

const DiskCleanup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - 480;

  if (localFrame < 0 || localFrame > 180) return null;

  // Progress bar: red → green
  const barFill = clamp(localFrame, [20, 100], [0.92, 0.18]);
  const progressColor = barFill > 0.6
    ? color.red
    : barFill > 0.35
      ? color.gold
      : color.green;

  // Card entrance
  const cardScale = enterSpring(localFrame, fps, 5);
  const cardOpacity = clamp(localFrame, [5, 15], [0, 1]);

  // GB label counter
  const usedGB = Math.round(interpolate(barFill, [0.18, 0.92], [46, 236]));
  const totalGB = 256;
  const gbOpacity = clamp(localFrame, [15, 25], [0, 1]);

  // Alert / success status
  const alertBlink =
    localFrame < 95 ? (Math.sin(localFrame * 0.5) > 0 ? 1 : 0.3) : 0;
  const successOpacity = clamp(localFrame, [100, 112], [0, 1]);
  const successScale = enterSpring(localFrame, fps, 100);
  const successGlow =
    localFrame > 115 ? glowPulse(localFrame) + 0.7 : 1;

  const fadeOut = clamp(localFrame, [155, 175], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Main card */}
      <div
        style={{
          ...localCardStyle,
          padding: `${s(36)}px ${s(48)}px`,
          width: s(560),
          display: "flex",
          flexDirection: "column",
          gap: s(20),
          boxShadow: `0 20px 60px rgba(19,19,20,0.08)`,
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: s(16),
          }}
        >
          <div style={iconCircle(color.blue, s(48))}>
            <span style={{ fontSize: s(22) }}>💾</span>
          </div>
          <span
            style={{
              ...baseText,
              fontSize: s(28),
              fontWeight: fontWeight.semibold,
            }}
          >
            硬盘空间
          </span>
        </div>

        {/* Progress bar track */}
        <div
          style={{
            width: "100%",
            height: s(8),
            background: "rgba(19,19,20,0.06)",
            borderRadius: s(4),
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${barFill * 100}%`,
              height: "100%",
              background: progressColor,
              borderRadius: s(4),
              boxShadow: `0 0 12px ${progressColor}40`,
            }}
          />
        </div>

        {/* GB label */}
        <div
          style={{
            ...baseText,
            fontSize: s(18),
            fontWeight: fontWeight.medium,
            color: color.textSecondary,
            opacity: gbOpacity,
            fontFamily: font.mono,
          }}
        >
          {usedGB} GB / {totalGB} GB 已使用
        </div>
      </div>

      {/* Alert: 余额不足 */}
      {localFrame < 105 && (
        <div
          style={{
            ...localCardStyle,
            marginTop: s(24),
            padding: `${s(12)}px ${s(28)}px`,
            background: `${color.red}15`,
            border: `1px solid ${color.red}40`,
            opacity: alertBlink,
          }}
        >
          <span
            style={{
              ...baseText,
              fontSize: s(28),
              color: color.red,
              display: "flex",
              alignItems: "center",
              gap: s(10),
            }}
          >
            <span style={{ fontSize: s(22) }}>⚠️</span>
            空间不足
          </span>
        </div>
      )}

      {/* Success: 余额充足 */}
      <div
        style={{
          ...localCardStyle,
          marginTop: s(24),
          padding: `${s(12)}px ${s(28)}px`,
          background: `${color.green}12`,
          border: `1px solid ${color.green}35`,
          boxShadow: `0 0 20px ${color.green}15`,
          opacity: successOpacity * successGlow,
          transform: `scale(${successScale})`,
        }}
      >
        <span
          style={{
            ...baseText,
            fontSize: s(28),
            color: color.green,
            display: "flex",
            alignItems: "center",
            gap: s(10),
          }}
        >
          <span style={{ fontSize: s(22) }}>✓</span>
          空间充足
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Section 5: 文件整理 (660-810f) ──────────────────────

const FileOrganize: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - 660;

  if (localFrame < 0 || localFrame > 150) return null;

  const fileItems = [
    { emoji: "📄", label: "文档", color: color.blue },
    { emoji: "📸", label: "照片", color: color.green },
    { emoji: "📦", label: "安装包", color: color.purple },
    { emoji: "🎵", label: "音乐", color: color.gold },
    { emoji: "🎬", label: "视频", color: color.red },
    { emoji: "📊", label: "表格", color: color.blue },
    { emoji: "📝", label: "笔记", color: color.green },
    { emoji: "🖼️", label: "图片", color: color.purple },
  ];

  // Phase transitions
  const chaos = localFrame < 60 ? 1 : clamp(localFrame, [60, 90], [1, 0]);
  const order = 1 - chaos;

  // Sweep indicator (progress bar style instead of broom emoji)
  const sweepProgress = clamp(localFrame, [50, 80], [0, 1]);
  const sweepOpacity =
    localFrame >= 45 && localFrame <= 90
      ? clamp(localFrame, [45, 55], [0, 1]) *
        clamp(localFrame, [80, 90], [1, 0])
      : 0;

  // Folder card appears
  const folderScale = enterSpring(localFrame, fps, 82);
  const folderOpacity = clamp(localFrame, [82, 90], [0, 1]);

  const fadeOut = clamp(localFrame, [125, 145], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* File icons */}
      {fileItems.map((item, i) => {
        const angle =
          (i / fileItems.length) * Math.PI * 2 + localFrame * 0.03;

        // Chaotic orbiting
        const chaosX = Math.cos(angle + i * 1.5) * (160 + i * 18);
        const chaosY = Math.sin(angle * 1.3 + i) * (100 + i * 12);

        // Ordered grid
        const col = i % 4;
        const row = Math.floor(i / 4);
        const orderX = (col - 1.5) * 90;
        const orderY = row * 80 + 40;

        const x = chaosX * chaos + orderX * order;
        const y = chaosY * chaos + orderY * order;
        const rotation = chaos * (Math.sin(localFrame * 0.08 + i * 2) * 25);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
            }}
          >
            <div style={iconCircle(item.color, s(56))}>
              <span style={{ fontSize: s(26) }}>{item.emoji}</span>
            </div>
          </div>
        );
      })}

      {/* Sweep progress indicator */}
      <div
        style={{
          position: "absolute",
          bottom: s(380),
          width: s(500),
          opacity: sweepOpacity,
        }}
      >
        <div
          style={{
            width: "100%",
            height: s(4),
            background: "rgba(19,19,20,0.06)",
            borderRadius: s(2),
          }}
        >
          <div
            style={{
              width: `${sweepProgress * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${color.blue}, ${color.green})`,
              borderRadius: s(2),
              boxShadow: `0 0 10px ${color.blue}40`,
            }}
          />
        </div>
        <div
          style={{
            ...baseText,
            fontSize: s(16),
            fontWeight: fontWeight.medium,
            color: color.textSecondary,
            marginTop: s(8),
            textAlign: "center" as const,
          }}
        >
          整理中...
        </div>
      </div>

      {/* Organized folder card */}
      <div
        style={{
          position: "absolute",
          bottom: s(260),
          opacity: folderOpacity,
          transform: `scale(${folderScale})`,
        }}
      >
        <div
          style={{
            ...localCardStyle,
            padding: `${s(16)}px ${s(36)}px`,
            display: "flex",
            alignItems: "center",
            gap: s(14),
            boxShadow: `0 12px 40px rgba(19,19,20,0.06)`,
          }}
        >
          <div style={iconCircle(color.green, s(48))}>
            <span style={{ fontSize: s(22) }}>📂</span>
          </div>
          <span
            style={{
              ...baseText,
              fontSize: s(24),
              fontWeight: fontWeight.semibold,
            }}
          >
            整理完成
          </span>
          <span
            style={{
              ...baseText,
              fontSize: s(20),
              color: color.green,
              fontWeight: fontWeight.semibold,
            }}
          >
            ✓
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Section 6: 安装攻略 (810-1020f) ─────────────────────

const InstallGuide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - 810;

  if (localFrame < 0 || localFrame > 210) return null;

  const checkItems = [
    { text: "下载安装包", icon: "📥" },
    { text: "一键安装", icon: "⚡" },
    { text: "打开即用", icon: "🚀" },
    { text: "零配置", icon: "✨" },
  ];

  // "技术门槛" shatter
  const shatterOpacity = clamp(localFrame, [20, 30], [0, 1]);
  const shatterProgress = clamp(localFrame, [100, 130], [0, 1]);
  const shatterChars = "技术门槛".split("");

  // Badge
  const badgeScale = enterSpring(localFrame, fps, 142);
  const badgeOpacity = clamp(localFrame, [142, 152], [0, 1]);

  const fadeOut = clamp(localFrame, [185, 205], [1, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Checklist card (left) */}
      <div
        style={{
          position: "absolute",
          left: s(280),
          top: s(260),
          ...localCardStyle,
          padding: `${s(32)}px ${s(36)}px`,
          boxShadow: `0 20px 60px rgba(19,19,20,0.08)`,
        }}
      >
        <div
          style={{
            ...baseText,
            fontSize: s(22),
            fontWeight: fontWeight.semibold,
            color: color.textSecondary,
            marginBottom: s(20),
            letterSpacing: "0.04em",
          }}
        >
          安装步骤
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: s(18) }}>
          {checkItems.map((item, i) => {
            const checkDelay = 15 + i * 22;
            const checked = localFrame > checkDelay;
            const itemScale = enterSpring(localFrame, fps, checkDelay);
            const itemOpacity = clamp(
              localFrame,
              [checkDelay, checkDelay + 10] as [number, number],
              [0, 1],
            );

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: s(14),
                  opacity: itemOpacity,
                  transform: `scale(${itemScale})`,
                }}
              >
                {/* Status circle */}
                <div
                  style={{
                    width: s(28),
                    height: s(28),
                    borderRadius: "50%",
                    border: `2px solid ${checked ? color.green : color.border}`,
                    background: checked
                      ? `${color.green}20`
                      : "transparent",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: checked
                      ? `0 0 12px ${color.green}25`
                      : "none",
                  }}
                >
                  {checked && (
                    <span
                      style={{
                        ...baseText,
                        fontSize: s(14),
                        color: color.green,
                        fontWeight: fontWeight.bold,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>
                <span
                  style={{
                    ...baseText,
                    fontSize: s(30),
                    fontWeight: fontWeight.semibold,
                    color: checked ? color.text : color.textTertiary,
                  }}
                >
                  {item.icon} {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* "技术门槛" shattering (right) */}
      <div
        style={{
          position: "absolute",
          right: s(300),
          top: s(320),
          display: "flex",
          gap: s(4),
          opacity:
            shatterOpacity * (1 - shatterProgress * 0.85),
        }}
      >
        {shatterChars.map((char, i) => {
          const seedX = [-60, 40, -30, 80][i];
          const seedRot = [-120, 150, -90, 200][i];
          const offsetX = shatterProgress * (seedX + i * 40);
          const offsetY = shatterProgress * (150 + i * 30);
          const rot = shatterProgress * (seedRot + i * 45);

          return (
            <div
              key={i}
              style={{
                ...baseText,
                fontSize: s(52),
                color: color.red,
                textShadow: shadow.textGlow(color.red, 0.25),
                transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rot}deg)`,
              }}
            >
              {char}
            </div>
          );
        })}
      </div>

      {/* Success badge (right) */}
      <div
        style={{
          position: "absolute",
          right: s(330),
          top: s(490),
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
        }}
      >
        <div
          style={{
            ...localCardStyle,
            width: s(100),
            height: s(100),
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${color.green}18, ${color.green}08)`,
            border: `2px solid ${color.green}50`,
            boxShadow: `0 0 30px ${color.green}20`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: s(48),
          }}
        >
          👍
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Component ───────────────────────────────────────

export const OpeningMemes: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <TrainIntro />
      <StereotypeBreak />
      <ZeroBasis />
      <DiskCleanup />
      <FileOrganize />
      <InstallGuide />
    </AbsoluteFill>
  );
};
