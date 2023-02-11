import { createSignal, onCleanup, onMount } from "solid-js";
import { defaultColors } from "../../constants";
import Canvas from "../canvas";

const AU = 149.6e6 * 1000; // 149.6 million km, in meters.
const G = 6.67428e-11;
const cWidthScale = 15 * AU;
const defaultDt = 120 * 3600;

const getForceOnBody = ({ body, otherBody }) => {
  const dy = otherBody.pos.y - body.pos.y;
  const dx = otherBody.pos.x - body.pos.x;
  const force =
    (G * body.mass * otherBody.mass) / (Math.abs(dx) ** 2 + Math.abs(dy) ** 2);
  const angle = Math.atan2(dy, dx);
  const forceX = Math.cos(angle) * force;
  const forceY = Math.sin(angle) * force;
  return { x: forceX, y: forceY };
};

const simulate = ({ bodies, dt }) => {
  for (const body of bodies) {
    let force = { x: 0, y: 0 };
    for (const otherBody of bodies) {
      if (otherBody.id !== body.id) {
        const otherForce = getForceOnBody({ body, otherBody });
        force.x += otherForce.x;
        force.y += otherForce.y;
      }
    }
    body.acc.x = force.x / body.mass;
    body.acc.y = force.y / body.mass;
    body.vel.x = body.vel.x + body.acc.x * dt;
    body.vel.y = body.vel.y + body.acc.y * dt;
    body.pos.y = body.pos.y + body.vel.y * dt;
    body.pos.x = body.pos.x + body.vel.x * dt;
  }
};

const draw = ({ ctx, canvas, bodies, x, y, scale }) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const body of bodies) {
    const orbitRadius =
      (scale * (body.vel.x ** 2 + body.vel.y ** 2)) /
      Math.sqrt(body.acc.x ** 2 + body.acc.y ** 2);
    ctx.fillStyle = body.color || defaultColors.red;
    ctx.beginPath();
    ctx.arc(
      x(body.pos),
      y(body.pos),
      scale * body.radius * 100,
      0.0,
      2.0 * Math.PI
    );
    ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = "#444444";
    ctx.beginPath();
    ctx.arc(
      268.8618391303887,
      268.9326646281977,
      orbitRadius,
      0.0,
      2.0 * Math.PI
    );
    ctx.stroke();
    ctx.closePath();
  }
};

const PlanetaryOrbitSimulation = ({ paused }) => {
  const [dt, setDt] = createSignal(defaultDt);
  let canvas;
  let frame;
  onMount(() => {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerHeight - 200;
    canvas.height = window.innerHeight - 200;
    const SCALE = canvas.height / cWidthScale;
    let SUN = {
      id: 0,
      mass: 1.989e30,
      pos: {
        x: 0.5 * cWidthScale,
        y: 0.5 * cWidthScale,
      },
      vel: {
        x: 0,
        y: 0,
      },
      acc: { x: 0, y: 0 },
      color: "#FFD000",
      radius: 696340e3,
    };
    let EARTH = {
      id: 3,
      mass: 5.9742e24,
      pos: {
        x: SUN.pos.x - AU,
        y: 0.5 * cWidthScale,
      },
      vel: {
        y: 30 * 1000,
        x: 0,
      },
      acc: { x: 0, y: 0 },
      radius: 6371e4,
      color: "#0F80FF",
    };
    let JUPITER = {
      id: 5,
      pos: {
        x: SUN.pos.x - 5.203 * AU,
        y: 0.5 * cWidthScale,
      },
      vel: {
        x: 0,
        y: 13.07 * 1000,
      },
      acc: { x: 0, y: 0 },
      mass: 1.89813e27,
      radius: 69911 * 1000,
    };
    const bodies = [EARTH, SUN, JUPITER];
    const cX = (pos) => pos.x * SCALE;
    const cY = (pos) => canvas.height - pos.y * SCALE;

    frame = requestAnimationFrame(update);

    function update(t) {
      if (!paused()) {
        simulate({
          bodies,
          dt: dt(),
        });
      }
      draw({
        bodies,
        canvas,
        ctx,
        x: cX,
        y: cY,
        scale: SCALE,
      });
      frame = requestAnimationFrame(update);
    }
  });
  onCleanup(() => {
    cancelAnimationFrame(frame);
  });
  return (
    <div style={{ display: "flex", "flex-direction": "column" }}>
      <text>{Math.round(dt())}</text>
      <input
        type="range"
        onChange={(e) => {
          setDt(((parseInt(e.target.value) + 50) / 100) ** 4 * defaultDt);
        }}
      ></input>
      <Canvas ref={canvas} />
    </div>
  );
};

export default PlanetaryOrbitSimulation;
