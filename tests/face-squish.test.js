const test = require('node:test');
const assert = require('node:assert/strict');
const FaceSquish = require('../face-squish.js');

function run(sim, seconds, dt = 1 / 60) {
  for (let t = 0; t < seconds; t += dt) sim.step(dt);
}

test('the mesh starts at rest and is a regular grid with consistent triangles', () => {
  const sim = FaceSquish.create();
  assert.equal(sim.count, (sim.cols + 1) * (sim.rows + 1));
  assert.equal(sim.indices.length, sim.cols * sim.rows * 6);
  assert.equal(sim.energy(), 0);
  assert.ok(Math.abs(sim.minOrientation() - 1) < 1e-6, 'every triangle keeps its rest orientation');
});

test('dragging moves the grabbed point towards the pointer but never all the way past the soft limit', () => {
  const sim = FaceSquish.create();
  sim.grab(0.5, 0.5);
  sim.drag(0.5, 5); // absurdly far
  run(sim, 1);
  const k = Math.round(0.5 * sim.rows) * (sim.cols + 1) + Math.round(0.5 * sim.cols);
  const moved = sim.pos.y[k] - sim.rest.y[k];
  assert.ok(moved > 0.05, 'the point follows the pointer');
  assert.ok(moved <= sim.maxPull * 1.0001, 'but the pull is capped by the soft limit');
});

test('after release the sheet wobbles and then returns to rest', () => {
  const sim = FaceSquish.create();
  sim.grab(0.4, 0.45);
  sim.drag(0.7, 0.6);
  run(sim, 0.6);
  assert.ok(sim.energy() > 0.02);
  sim.release();
  run(sim, 4);
  assert.ok(sim.energy() < 1e-3, 'settled: ' + sim.energy());
});

test('it overshoots on release (a little wobble) but stays bounded', () => {
  const sim = FaceSquish.create();
  sim.grab(0.5, 0.5);
  sim.drag(0.5, 0.8);
  run(sim, 0.8);
  sim.release();
  const k = Math.round(0.5 * sim.rows) * (sim.cols + 1) + Math.round(0.5 * sim.cols);
  let minY = Infinity;
  for (let t = 0; t < 1.5; t += 1 / 60) { sim.step(1 / 60); minY = Math.min(minY, sim.pos.y[k] - sim.rest.y[k]); }
  assert.ok(minY < -0.001, 'swings past the rest position');
  assert.ok(minY > -sim.maxPull * 0.6, 'but not wildly');
});

test('no triangle ever flips over, whatever the user does', () => {
  const sim = FaceSquish.create();
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let worst = Infinity;
  for (let gesture = 0; gesture < 60; gesture++) {
    sim.grab(rand(), rand());
    const steps = 5 + Math.floor(rand() * 40);
    for (let s = 0; s < steps; s++) {
      sim.drag(rand() * 1.4 - 0.2, rand() * 1.4 - 0.2); // sometimes off the picture
      sim.step(1 / 60);
      worst = Math.min(worst, sim.minOrientation());
    }
    sim.release();
    for (let s = 0; s < 90; s++) { sim.step(1 / 60); worst = Math.min(worst, sim.minOrientation()); }
  }
  assert.ok(worst > 0.05, 'smallest orientation ratio was ' + worst);
});

test('the soft limit sits below the analytic fold-over limit even with the spring overshoot', () => {
  const o = FaceSquish.DEFAULTS;
  // underdamped spring step response overshoot
  const zeta = o.damping / (2 * Math.sqrt(o.stiffness));
  const overshoot = Math.exp(-Math.PI * zeta / Math.sqrt(1 - zeta * zeta));
  const limit = FaceSquish.foldLimit(o.sigma, 0);
  assert.ok(o.maxPullInSigmas * o.sigma * (1 + overshoot) < limit, 'pull ' + o.maxPullInSigmas * o.sigma * (1 + overshoot) + ' < ' + limit);
});

test('a large step does not blow the simulation up', () => {
  const sim = FaceSquish.create();
  sim.grab(0.5, 0.5);
  sim.drag(0.9, 0.9);
  sim.step(10); // clamped internally
  for (let k = 0; k < sim.count; k++) assert.ok(Number.isFinite(sim.pos.x[k]) && Number.isFinite(sim.pos.y[k]));
});

test('settle() snaps back instantly', () => {
  const sim = FaceSquish.create();
  sim.grab(0.5, 0.5);
  sim.drag(0.8, 0.8);
  run(sim, 0.5);
  sim.release();
  sim.settle();
  assert.equal(sim.energy(), 0);
});

test('the profile photo configured in app.js exists and is a transparent-background WebP', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const m = app.match(/const PROFILE_PHOTO = '([^']+)';/);
  assert.ok(m, 'PROFILE_PHOTO is set');
  const file = path.join(__dirname, '..', m[1]);
  assert.ok(fs.existsSync(file), 'photo file exists: ' + m[1]);
  const head = fs.readFileSync(file).subarray(0, 32);
  assert.equal(head.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(head.subarray(8, 12).toString('ascii'), 'WEBP');
  assert.ok(fs.statSync(file).size < 200 * 1024, 'photo stays small');
});
