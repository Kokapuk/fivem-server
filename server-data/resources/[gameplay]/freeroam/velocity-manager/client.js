// RegisterCommand(
//   'setvel',
//   (_, args) => {
//     if (args.length < 2) {
//       return;
//     }

//     const vehicle = exports.freeroam.getLocalPlayerVehicle();

//     if (!vehicle) {
//       return;
//     }

//     const directionVector = { up: [0, 0, 1], forward: GetEntityForwardVector(vehicle) }[args[0]];

//     if (!directionVector) {
//       return;
//     }

//     const velocityMultiplier = parseInt(args[1]);

//     if (isNaN(velocityMultiplier)) {
//       return;
//     }

//     const velocity = directionVector.map((i) => i * velocityMultiplier);
//     SetEntityVelocity(vehicle, ...velocity);
//   },
//   false
// );

// let forwardVelInterval;
// let savedForwardVelDirection;
// let savedRotation;

// RegisterCommand(
//   '+forwardvel',
//   () => {
//     const vehicle = exports.freeroam.getLocalPlayerVehicle();

//     if (!vehicle) {
//       return;
//     }

//     savedForwardVelDirection = GetEntityForwardVector(vehicle).map((i) => i * 150);
//     savedRotation = GetEntityRotation(vehicle);

//     forwardVelInterval = setInterval(() => {
//       SetEntityVelocity(vehicle, savedForwardVelDirection[0], savedForwardVelDirection[1], -25);
//       SetEntityRotation(vehicle, ...savedRotation);
//     });
//   },
//   false
// );

// RegisterCommand(
//   '-forwardvel',
//   () => {
//     const vehicle = exports.freeroam.getLocalPlayerVehicle();

//     if (!vehicle) {
//       return;
//     }

//     const velocity = GetEntityForwardVector(vehicle).map((i) => i * 10);
//     SetEntityVelocity(vehicle, velocity[0], velocity[1], -25);

//     clearInterval(forwardVelInterval);
//   },
//   false
// );

// RegisterKeyMapping('+forwardvel', 'Forward velocity', 'mouse_button', 'MOUSE_EXTRABTN1');
