import { onMount, onCleanup } from "solid-js";
import { defaultColors } from "../../constants";
import Canvas from "../canvas";

const gravity = { x: 0.0, y: -9.8 };
const dt = 1.0 / 60.0;
const ball = {
  radius: 0.5,
  pos: { x: 0, y: 15 },
  vel: { x: 10, y: 0 },
};

const draw = ({ ctx, canvas, ball, x, y, scale }) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = defaultColors.red;

  ctx.beginPath();
  ctx.arc(x(ball.pos), y(ball.pos), scale * ball.radius, 0.0, 2.0 * Math.PI);
  ctx.fill();
  ctx.closePath();
};

const simulate = ({ object, force, dt, dimension }) => {
  object.vel.x += force.x * dt;
  object.vel.y += force.y * dt;
  object.pos.x += object.vel.x * dt;
  object.pos.y += object.vel.y * dt;

  if (object.pos.x < 0.0) {
    object.pos.x = 0.0;
    object.vel.x = -object.vel.x;
  }
  if (object.pos.x > dimension.width) {
    object.pos.x = dimension.width;
    object.vel.x = -object.vel.x;
  }
  if (object.pos.y < 0.0) {
    object.pos.y = 0.0;
    object.vel.y = -object.vel.y;
  }
};

const BallSimulation = ({ paused }) => {
  let canvas;
  let frame;
  onMount(() => {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth - 68;
    canvas.height = window.innerHeight - 200;

    const simMinWidth = 20.0;
    const cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
    const simWidth = canvas.width / cScale;
    const simHeight = canvas.height / cScale;

    const cX = (pos) => pos.x * cScale;
    const cY = (pos) => canvas.height - pos.y * cScale;

    frame = requestAnimationFrame(update);

    function update(t) {
      if (!paused()) {
        simulate({
          dimension: { width: simWidth, height: simHeight },
          dt,
          force: gravity,
          object: ball,
        });
      }
      draw({ ball, canvas, ctx, x: cX, y: cY, scale: cScale });
      frame = requestAnimationFrame(update);
    }
  });
  onCleanup(() => {
    cancelAnimationFrame(frame);
  });
  return <Canvas ref={canvas} />;
};

export default BallSimulation;
