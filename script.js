function init() {
  requestDeviceOrientation()

  const canvas = document.getElementById("canvas");
  const scoreDisplay = document.getElementById("score");
  const ctx = canvas.getContext("2d");

  canvas.width =  window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';


  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 0,
    vy: 0,
    radius: 20,
    color: "white",
		score: 0
  };

  const obstacle = {
    x: -100,
    y: -100,
    radius: 40,
    color: "black",
    dx: 1,
    dy: 1
  };  

  function handleOrientation(event) {
    // extract the alpha, beta, and gamma values
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
  
    // calculate the new position of the ball based on the gyroscope data
    const dx = gamma / 10; // divide by 10 to reduce the sensitivity
    const dy = beta / 10;

    ball.vx = dx;
    ball.vy = dy;

    // update the position of the ball based on its velocity
    ball.x += ball.vx;
    ball.y += ball.vy;

    // add some friction to slow down the ball's motion over time
    ball.vx *= 0.9;
    ball.vy *= 0.9;
  
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

  function gameLoop() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ballRadius = ball.radius + Math.sin(Date.now() / 200) * 1;

    // draw the ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    const obstacleRadius = obstacle.radius + Math.sin(Date.now() / 200) * 1;
    // draw the obstacle
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacleRadius, 0, Math.PI * 2);
    ctx.fillStyle = obstacle.color;
    ctx.fill();
    ctx.closePath();

    // move the obstacle
    obstacle.x += obstacle.dx;
    obstacle.y += obstacle.dy;

    // calculate the distance between the ball and the obstacle
    const obstacleDistance = Math.sqrt(
      Math.pow(ball.x - obstacle.x, 2) + Math.pow(ball.y - obstacle.y, 2)
    );

    // calculate the score based on the distance from the ball to the center of the canvas
    const distance = Math.sqrt(
      Math.pow(ball.x - canvas.width / 2, 2) +
        Math.pow(ball.y - canvas.height / 2, 2)
    );
    const score = Math.floor((canvas.width / 2 - distance) / 10);
    ball.score += score;
  
    // update the score display
    scoreDisplay.textContent = `Score: ${ball.score}`;
  
    // check if the ball has hit the boundary
    if (
      ball.x <= ball.radius ||
      ball.x >= canvas.width - ball.radius ||
      ball.y <= ball.radius ||
      ball.y >= canvas.height - ball.radius ||
      obstacleDistance < ballRadius + obstacleRadius
    ) {
      // stop the game loop
      cancelAnimationFrame(gameLoop);

      // display  restart button
      const gameOver = document.getElementById("gameOver");
      if (gameOver.style) gameOver.style.display = "block";
      const restartButton = document.createElement("button");
      restartButton.textContent = "Restart";
      restartButton.addEventListener("click", () => {
        // reset the ball position and score
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.score = 0;
        // reset the obstacle position
        obstacle.x = -100;
        obstacle.y = -100;
        // remove the restart button and start the game loop again
        gameOver.style.display = "none";
        restartButton.remove();
        gameLoop();
      });
      gameOver.appendChild(restartButton);
    } else {
      // request the next frame of the game loop
      requestAnimationFrame(gameLoop);
    }
  }
  

  // set up the event listener for the deviceorientation event
  window.addEventListener("deviceorientation", handleOrientation, true);

  // start the game loop
  gameLoop();
}
