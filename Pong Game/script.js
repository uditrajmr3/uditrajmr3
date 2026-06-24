// Pong — pure vanilla JS, no libraries.
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const W = canvas.width;
const H = canvas.height;

const WIN_SCORE = 7;
const PADDLE_W = 12;
const PADDLE_H = 80;
const BALL_R = 8;

const player = { x: 18, y: H / 2 - PADDLE_H / 2, score: 0 };
const cpu = { x: W - 18 - PADDLE_W, y: H / 2 - PADDLE_H / 2, score: 0 };
const ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, speed: 6 };

let running = false;
let winner = null;
const keys = {};

const playerScoreEl = document.getElementById("playerScore");
const cpuScoreEl = document.getElementById("cpuScore");
const hintEl = document.getElementById("hint");

function resetBall(dir) {
  ball.x = W / 2;
  ball.y = H / 2;
  ball.speed = 6;
  // serve at a mild angle toward `dir` (-1 left / +1 right)
  const angle = (Math.random() * 0.5 - 0.25) * Math.PI; // -45deg..45deg
  ball.vx = dir * ball.speed * Math.cos(angle);
  ball.vy = ball.speed * Math.sin(angle);
}

function startGame() {
  if (winner) {
    player.score = 0;
    cpu.score = 0;
    winner = null;
    updateScore();
  }
  resetBall(Math.random() < 0.5 ? -1 : 1);
  running = true;
  hintEl.style.visibility = "hidden";
}

function updateScore() {
  playerScoreEl.textContent = player.score;
  cpuScoreEl.textContent = cpu.score;
}

// ---- input ----
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleY = canvas.height / rect.height;
  const y = (e.clientY - rect.top) * scaleY;
  player.y = Math.max(0, Math.min(H - PADDLE_H, y - PADDLE_H / 2));
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const scaleY = canvas.height / rect.height;
  const y = (e.touches[0].clientY - rect.top) * scaleY;
  player.y = Math.max(0, Math.min(H - PADDLE_H, y - PADDLE_H / 2));
}, { passive: false });

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === " ") startGame();
});
window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));
canvas.addEventListener("click", startGame);

// ---- update ----
function update() {
  // keyboard control
  const step = 7;
  if (keys["w"] || keys["arrowup"]) player.y -= step;
  if (keys["s"] || keys["arrowdown"]) player.y += step;
  player.y = Math.max(0, Math.min(H - PADDLE_H, player.y));

  if (!running) return;

  ball.x += ball.vx;
  ball.y += ball.vy;

  // top / bottom walls
  if (ball.y - BALL_R < 0) {
    ball.y = BALL_R;
    ball.vy *= -1;
  }
  if (ball.y + BALL_R > H) {
    ball.y = H - BALL_R;
    ball.vy *= -1;
  }

  // paddle collisions
  bounceOffPaddle(player, 1);
  bounceOffPaddle(cpu, -1);

  // scoring
  if (ball.x + BALL_R < 0) {
    cpu.score++;
    updateScore();
    endOrServe(1);
  } else if (ball.x - BALL_R > W) {
    player.score++;
    updateScore();
    endOrServe(-1);
  }

  // simple AI: ease the cpu paddle toward the ball
  const target = ball.y - PADDLE_H / 2;
  const cpuSpeed = 4.6;
  if (cpu.y + 1 < target) cpu.y += Math.min(cpuSpeed, target - cpu.y);
  else if (cpu.y - 1 > target) cpu.y -= Math.min(cpuSpeed, cpu.y - target);
  cpu.y = Math.max(0, Math.min(H - PADDLE_H, cpu.y));
}

function bounceOffPaddle(p, dir) {
  // dir +1 = ball moving left toward player, -1 = toward cpu
  const movingToward = dir === 1 ? ball.vx < 0 : ball.vx > 0;
  if (!movingToward) return;
  if (
    ball.x - BALL_R < p.x + PADDLE_W &&
    ball.x + BALL_R > p.x &&
    ball.y + BALL_R > p.y &&
    ball.y - BALL_R < p.y + PADDLE_H
  ) {
    // reflect, add spin based on where it hit the paddle
    const hit = (ball.y - (p.y + PADDLE_H / 2)) / (PADDLE_H / 2); // -1..1
    ball.speed = Math.min(ball.speed + 0.4, 13);
    const bounce = hit * (Math.PI / 4); // up to 45deg
    ball.vx = dir * ball.speed * Math.cos(bounce);
    ball.vy = ball.speed * Math.sin(bounce);
    // nudge out of paddle
    ball.x = dir === 1 ? p.x + PADDLE_W + BALL_R : p.x - BALL_R;
  }
}

function endOrServe(dir) {
  if (player.score >= WIN_SCORE || cpu.score >= WIN_SCORE) {
    running = false;
    winner = player.score > cpu.score ? "You win! 🏆" : "CPU wins 🤖";
    hintEl.innerHTML = winner + " &nbsp;·&nbsp; Click to play again.";
    hintEl.style.visibility = "visible";
  } else {
    resetBall(dir);
  }
}

// ---- render ----
function draw() {
  ctx.clearRect(0, 0, W, H);

  // center net
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 14]);
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2, H);
  ctx.stroke();
  ctx.setLineDash([]);

  // paddles
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(player.x, player.y, PADDLE_W, PADDLE_H);
  ctx.fillRect(cpu.x, cpu.y, PADDLE_W, PADDLE_H);

  // ball
  ctx.fillStyle = "#f53f79";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
  ctx.fill();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

updateScore();
draw();
loop();
