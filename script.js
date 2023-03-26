const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
	// extract the alpha, beta, and gamma values
	const alpha = event.alpha;
	const beta = event.beta;
	const gamma = event.gamma;
  
	// calculate the new position of the ball based on the gyroscope data
	const dx = gamma / 10; // divide by 10 to reduce the sensitivity
	const dy = -beta / 10;
	ball.x += dx;
	ball.y += dy;
  
	// keep the ball within the canvas boundaries
	if (ball.x < ball.radius) {
	  ball.x = ball.radius;
	} else if (ball.x > canvas.width - ball.radius) {
	  ball.x = canvas.width - ball.radius;
	}
	if (ball.y < ball.radius) {
	  ball.y = ball.radius;
	} else if (ball.y > canvas.height - ball.radius) {
	  ball.y = canvas.height - ball.radius;
	}
}

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: "red"
};

function gameLoop() {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw the ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();

  // calculate the score based on the distance from the ball to the center of the canvas
  const distance = Math.sqrt(
    Math.pow(ball.x - canvas.width / 2, 2) +
      Math.pow(ball.y - canvas.height / 2, 2)
  );
  const score = Math.floor((canvas.width / 2 - distance) * 100);
	const scoreDisplay = document.getElementById("score");
  // update the score display
  scoreDisplay.textContent = `Score: ${score}`;

  // request the next frame of the game loop
  requestAnimationFrame(gameLoop);
}

// start the game loop
requestAnimationFrame(gameLoop);
