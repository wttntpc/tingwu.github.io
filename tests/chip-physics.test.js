const test = require('node:test');
const assert = require('node:assert/strict');
const ChipPhysics = require('../chip-physics.js');
const HomeDelight = require('../home-delight.js');

// three chips in a row inside a 300 x 100 box
const rects = () => [{ x: 10, y: 10, w: 80, h: 24 }, { x: 100, y: 10, w: 90, h: 24 }, { x: 10, y: 44, w: 100, h: 24 }];
const run = (sim, s, dt = 1 / 60) => { for (let t = 0; t < s; t += dt) sim.step(dt); };

test('chips start at home with no overlap and no energy', () => {
  const sim = ChipPhysics.create(300, 100, rects());
  assert.equal(sim.overlaps(), 0);
  assert.equal(sim.energy(), 0);
});

test('a thrown chip stays inside the box however hard it is thrown', () => {
  const sim = ChipPhysics.create(300, 100, rects());
  sim.grab(0);
  sim.release(0, 9000, -9000);
  for (let t = 0; t < 4; t += 1 / 60) {
    sim.step(1 / 60);
    for (const b of sim.bodies) {
      assert.ok(b.x >= -0.001 && b.x + b.w <= 300.001, 'x inside: ' + b.x);
      assert.ok(b.y >= -0.001 && b.y + b.h <= 100.001, 'y inside: ' + b.y);
    }
  }
});

test('after a toss every chip floats back home and nothing overlaps', () => {
  const sim = ChipPhysics.create(300, 100, rects());
  sim.grab(1);
  sim.moveTo(1, 180, 60);
  sim.release(1, 700, 500);
  run(sim, 12);
  assert.ok(sim.energy() < 0.3, 'energy ' + sim.energy());
  assert.equal(sim.overlaps(), 0);
  sim.settle();
  sim.bodies.forEach((b) => { assert.equal(b.x, b.hx); assert.equal(b.y, b.hy); });
});

test('a dragged chip pushes the others out of the way instead of passing through', () => {
  const sim = ChipPhysics.create(300, 200, rects());
  sim.grab(0);
  sim.moveTo(0, 100, 10); // drop it on top of chip 1
  run(sim, 0.5);
  assert.equal(sim.bodies[0].x, 100, 'the dragged chip does not get pushed');
  assert.equal(sim.overlaps(), 0, 'the others made room');
});

test('a fast chip hits another one and sets it moving', () => {
  const sim = ChipPhysics.create(600, 100, [{ x: 10, y: 10, w: 40, h: 24 }, { x: 300, y: 10, w: 40, h: 24 }]);
  sim.release(0, 800, 0);
  let moved = 0;
  for (let t = 0; t < 1.5; t += 1 / 60) {
    sim.step(1 / 60);
    moved = Math.max(moved, Math.abs(sim.bodies[1].x - 300));
    sim.bodies.forEach((b) => assert.ok(Number.isFinite(b.x) && Number.isFinite(b.vx)));
  }
  assert.ok(moved > 5, 'the second chip was knocked by ' + moved + ' px');
});

test('release clamps absurd speeds', () => {
  const sim = ChipPhysics.create(300, 100, rects());
  sim.release(0, 1e6, 1e6);
  assert.ok(Math.hypot(sim.bodies[0].vx, sim.bodies[0].vy) <= sim.world.options.maxSpeed + 1e-6);
});

test('resizing the box keeps every chip inside it', () => {
  const sim = ChipPhysics.create(300, 100, rects());
  sim.resize(150, 100);
  sim.step(1 / 60);
  sim.bodies.forEach((b) => assert.ok(b.x + b.w <= 150.001));
});

test('count-up goes from 0 to the target, never overshoots and is monotone', () => {
  assert.equal(HomeDelight.countValue(45, 0, 900), 0);
  assert.equal(HomeDelight.countValue(45, 900, 900), 45);
  assert.equal(HomeDelight.countValue(45, 5000, 900), 45);
  let prev = -1;
  for (let t = 0; t <= 900; t += 30) {
    const v = HomeDelight.countValue(45, t, 900);
    assert.ok(v >= prev && v <= 45);
    prev = v;
  }
  assert.equal(HomeDelight.countValue(8, -10, 900), 0);
});

test('no chip ends up stuck behind another: every chip gets home after being thrown across the others', () => {
  const sim = ChipPhysics.create(300, 100, rects());
  sim.grab(0);
  sim.moveTo(0, 10, 76); // under chip 2's home
  sim.release(0, 0, 0);
  run(sim, 10);
  sim.bodies.forEach((b) => {
    assert.ok(Math.abs(b.x - b.hx) < 1 && Math.abs(b.y - b.hy) < 1, 'chip ' + b.id + ' at ' + b.x.toFixed(1) + ',' + b.y.toFixed(1));
  });
});
