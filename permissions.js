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