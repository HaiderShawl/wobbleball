function init() {
  const canvas = document.getElementById("canvas");
  const scoreDisplay = document.getElementById("score");
  const ctx = canvas.getContext("2d");

  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: "red",
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

		// // reverse the direction of the ball when the device is tilted forwards or backwards
		// if (beta > 90 || beta < -90) {
		// 	dy = -dy;
		// }

    ball.x += dx;
    ball.y -= dy;

		document.getElementById("dy").innerHTML = "dy: " + dy;

  
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
		document.getElementById("y").innerHTML = "Y: " + ball.y;

    // request the next frame of the game loop
    requestAnimationFrame(gameLoop);
  }

  // set up the event listener for the deviceorientation event
  window.addEventListener("deviceorientation", handleOrientation, true);

  // start the game loop
  gameLoop();
}


function requestDeviceOrientation () {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
  DeviceOrientationEvent.requestPermission()
  .then(permissionState => {
  if (permissionState === 'granted') {
  window.addEventListener('deviceorientation', () => {});
  }
  })
  .catch(console.error);
  } else {
  // handle regular non iOS 13+ devices
  console.log ("not iOS");
  }
}