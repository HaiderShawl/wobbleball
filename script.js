function init() {
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
    const score = Math.floor((canvas.width / 2 - distance) / 10);
    ball.score += score;
  
    // update the score display
    scoreDisplay.textContent = `Score: ${ball.score}`;
  
    // check if the ball has hit the boundary
    if (
      ball.x <= ball.radius ||
      ball.x >= canvas.width - ball.radius ||
      ball.y <= ball.radius ||
      ball.y >= canvas.height - ball.radius
    ) {
      // stop the game loop
      cancelAnimationFrame(gameLoop);

      // display the final score at the center of the canvas
      ctx.font = "bold 48px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(`Final Score: ${ball.score}`, canvas.width / 2, canvas.height / 2);

      // display the restart button
      const restartButton = document.createElement("button");
      restartButton.textContent = "Restart";
      restartButton.addEventListener("click", () => {
        // reset the ball position and score
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.score = 0;

        // remove the restart button and start the game loop again
        restartButton.remove();
        gameLoop();
      });
      document.getElementById("mask").appendChild(restartButton);
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
