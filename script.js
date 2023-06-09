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
    radius: 30,
    color: "white",
		score: 0,
    highscore: 0
  };

  let obstacle = createObstacle()
  let reward = createReward()


  function handleOrientation(event) {
    // extract the alpha, beta, and gamma values
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
  
    // calculate the new position of the ball based on the gyroscope data
    const dx = gamma / 5; // divide by 10 to reduce the sensitivity
    const dy = beta / 5;

    // update the position of the ball based on its velocity
    ball.x += dx
    ball.y += dy
  
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

    const rewardRadius = reward.radius + Math.sin(Date.now() / 200) * 1;
    // draw the reward
    ctx.beginPath();
    ctx.arc(reward.x, reward.y, rewardRadius, 0, Math.PI * 2);
    ctx.fillStyle = reward.color;
    ctx.fill();
    ctx.closePath();

    // move the obstacle
    obstacle.x += obstacle.dx;
    obstacle.y += obstacle.dy;

    // move the reward
    reward.x += reward.dx;
    reward.y += reward.dy;

    // calculate the distance between the ball and the obstacle
    const obstacleDistance = Math.sqrt(
      Math.pow(ball.x - obstacle.x, 2) + Math.pow(ball.y - obstacle.y, 2)
    );

    // calculate the distance between the ball and the reward
    const rewardDistance = Math.sqrt(
      Math.pow(ball.x - reward.x, 2) + Math.pow(ball.y - reward.y, 2)
    );

    // check if the ball has hit the reward
    if (rewardDistance < ballRadius + rewardRadius) {
      // create a new reward
      ball.score += 10000;
      reward = createReward();
    }

    // calculate the score based on the distance from the ball to the center of the canvas
    const distance = Math.sqrt(
      Math.pow(ball.x - canvas.width / 2, 2) +
        Math.pow(ball.y - canvas.height / 2, 2)
    );
    const score = Math.floor((canvas.height / 2 - distance) / 10);
    ball.score += score;

    // update the score display
    scoreDisplay.textContent = `Score: ${ball.score}`;

    // check if obstacle is outside the canvas
    if (
      obstacle.x < -obstacle.radius ||
      obstacle.x > canvas.width + obstacle.radius ||
      obstacle.y < -obstacle.radius ||
      obstacle.y > canvas.height + obstacle.radius
    ) {
      // create a new obstacle
      obstacle = createObstacle();
    }

    // check if reward is outside the canvas
    if (
      reward.x < -reward.radius ||
      reward.x > canvas.width + reward.radius ||
      reward.y < -reward.radius ||
      reward.y > canvas.height + reward.radius
    ) {
      // create a new reward
      reward = createReward();
    }
  
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

      if (ball.score > ball.highscore) {
        ball.highscore = ball.score;
      }
      // display the high score
      document.getElementById("highscore").textContent = `Highscore: ${ball.highscore}`;

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

  function createObstacle() {
    const random = Math.random();

    const obstacle = {
      x: 0,
      y: 0,
      radius: random*10+30,
      color: "black",
      dx: 1,
      dy: 1
    };  
  
    // set obstacle position to random position outside the canvas near the boundary
    if (random < 0.25) {
      obstacle.x = -obstacle.radius;
      obstacle.y = Math.random() * canvas.height;
    } else if (random < 0.5) {
      obstacle.x = canvas.width + obstacle.radius;
      obstacle.y = Math.random() * canvas.height;
    } else if (random < 0.75) {
      obstacle.x = Math.random() * canvas.width;
      obstacle.y = -obstacle.radius;
    } else {
      obstacle.x = Math.random() * canvas.width;
      obstacle.y = canvas.height + obstacle.radius;
    }
  
    const randomSpeed = Math.random() * 2 + 2;
    // set obstacle direction to move towards the center of the canvas
    if (obstacle.x < canvas.width / 2) {
      obstacle.dx = randomSpeed*Math.abs(obstacle.dx);
    } else {
      obstacle.dx = randomSpeed*-Math.abs(obstacle.dx);
    }
    if (obstacle.y < canvas.height / 2) {
      obstacle.dy = randomSpeed*Math.abs(obstacle.dy);
    } else {
      obstacle.dy = -randomSpeed*Math.abs(obstacle.dy);
    }
    return obstacle;
  }

  function createReward() {
    const random = Math.random();

    const reward = {
      x: 0,
      y: 0,
      radius: 10,
      color: "yellow",
      dx: 1,
      dy: 1
    };  
  
    // set reward position to random position outside the canvas near the boundary
    if (random < 0.25) {
      reward.x = -reward.radius;
      reward.y = Math.random() * canvas.height;
    } else if (random < 0.5) {
      reward.x = canvas.width + reward.radius;
      reward.y = Math.random() * canvas.height;
    } else if (random < 0.75) {
      reward.x = Math.random() * canvas.width;
      reward.y = -reward.radius;
    } else {
      reward.x = Math.random() * canvas.width;
      reward.y = canvas.height + reward.radius;
    }
  
    const randomSpeed = Math.random() * 2 + 2;
    // set reward direction to move towards the center of the canvas
    if (reward.x < canvas.width / 2) {
      reward.dx = randomSpeed*Math.abs(reward.dx);
    } else {
      reward.dx = randomSpeed*-Math.abs(reward.dx);
    }
    if (reward.y < canvas.height / 2) {
      reward.dy = randomSpeed*Math.abs(reward.dy);
    } else {
      reward.dy = -randomSpeed*Math.abs(reward.dy);
    }
    return reward;
  }
  

  // set up the event listener for the deviceorientation event
  window.addEventListener("deviceorientation", handleOrientation, true);

  // start the game loop
  gameLoop();
}
