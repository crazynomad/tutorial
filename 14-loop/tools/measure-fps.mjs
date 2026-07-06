#!/usr/bin/env node
// measure-fps.mjs — particle-sim 的固定测量脚本(loop 契约的「仪表」)。
// 这个文件是裁判的一部分:优化循环不得修改它,页面代码不得针对它做特判。
//
// 用法: node tools/measure-fps.mjs [页面路径,默认 ../particle-sim-baseline.html]
// 输出: 一行 JSON(判定证据) + 人读摘要;达标 exit 0,未达标 exit 1。
// 判定: particles===3000(采样前/中/后三次核对) 且 avg_fps>=59,画布与 dpr 不缩水。

import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const require = createRequire(execFileSync('npm', ['root', '-g']).toString().trim() + '/');
const { chromium } = require('playwright');

const HERE = dirname(fileURLToPath(import.meta.url));
const target = resolve(HERE, '..', process.argv[2] ?? 'particle-sim-baseline.html');

const PARTICLES = 3000;      // 契约锁死:不许减
const VIEWPORT = { width: 1600, height: 900 };
const DSF = 2;               // retina 口径,锁死:不许降
const WARMUP_MS = 5000;
const SAMPLE_MS = 15000;
const TARGET_MS = 4.0;       // 每帧计算预算(vsync 已解除,帧间隔=真实每帧成本)
const MIN_CANVAS_W = Math.floor(VIEWPORT.width * DSF * 0.9);   // 画布缩水即作弊

// 解除 60Hz 封顶:rAF 全速运行,帧率不再有天花板,指标才有分辨力
const browser = await chromium.launch({
  headless: false,
  args: ['--disable-frame-rate-limit', '--disable-gpu-vsync'],
});
const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: DSF });
await page.goto(pathToFileURL(target).href);
await page.waitForTimeout(500);

// 把粒子数拉到 3000(走页面自己的滑杆事件,和人手操作等价)
await page.evaluate((n) => {
  const el = document.getElementById('count');
  el.value = String(n);
  el.dispatchEvent(new Event('input'));
}, PARTICLES);

const countAt = () => page.evaluate(() => balls.length);

await page.waitForTimeout(WARMUP_MS);
const countBefore = await countAt();

// 在页面里数真实渲染帧:rAF 间隔序列 → 平均帧率 + 最差 1% 帧
const frames = await page.evaluate((ms) => new Promise((done) => {
  const deltas = [];
  let prev = performance.now();
  const t0 = prev;
  function tick(now) {
    deltas.push(now - prev);
    prev = now;
    if (now - t0 < ms) requestAnimationFrame(tick);
    else done(deltas);
  }
  requestAnimationFrame(tick);
}), SAMPLE_MS);
const countMid = await countAt();
await page.waitForTimeout(200);
const countAfter = await countAt();

const env = await page.evaluate(() => ({
  canvas_w: document.getElementById('cv').width,
  canvas_h: document.getElementById('cv').height,
  dpr: window.devicePixelRatio,
}));

const total = frames.reduce((a, b) => a + b, 0);
const avg_ms = +(total / frames.length).toFixed(2);
const avg_fps = +(frames.length * 1000 / total).toFixed(1);
const sorted = [...frames].sort((a, b) => b - a);
const worst1pc = sorted.slice(0, Math.max(1, Math.floor(sorted.length / 100)));
const p1_low_fps = +(1000 / (worst1pc.reduce((a, b) => a + b, 0) / worst1pc.length)).toFixed(1);

mkdirSync(resolve(HERE, 'shots'), { recursive: true });
const shot = resolve(HERE, 'shots', `run-${Date.now()}.png`);
await page.screenshot({ path: shot });
await browser.close();

const particles_locked = countBefore === PARTICLES && countMid === PARTICLES && countAfter === PARTICLES;
const canvas_ok = env.canvas_w >= MIN_CANVAS_W && env.dpr >= DSF;
const pass = particles_locked && canvas_ok && avg_ms <= TARGET_MS;

const result = {
  page: target.split('/').pop(),
  particles: countMid,
  particles_locked,
  avg_ms,
  avg_fps,
  p1_low_fps,
  frames_sampled: frames.length,
  canvas: `${env.canvas_w}x${env.canvas_h}@dpr${env.dpr}`,
  canvas_ok,
  target: `avg_ms<=${TARGET_MS} @ ${PARTICLES} particles (unthrottled)`,
  screenshot: shot,
  pass,
};
console.log(JSON.stringify(result));
console.log(`\n${pass ? '✅ PASS' : '❌ FAIL'} · ${countMid} particles · avg ${avg_ms} ms/frame (${avg_fps} fps unthrottled) · 1% low ${p1_low_fps} fps · ${env.canvas_w}x${env.canvas_h}@${env.dpr}x`);
process.exit(pass ? 0 : 1);
