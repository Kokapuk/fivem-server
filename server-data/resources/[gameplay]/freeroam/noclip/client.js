const speedModes = { slow: 0.15, medium: 0.5, fast: 2, hyper: 4 };
let speedMultiplier = speedModes.medium;
let isActive = false;

RegisterCommand(
  '+noclip:toggle',
  () => {
    isActive = !isActive;

    const entity = exports.freeroam.getLocalPlayerVehicle() ?? PlayerPedId();
    FreezeEntityPosition(entity, isActive);
  },
  false
);

RegisterKeyMapping('+noclip:toggle', 'Noclip: Toggle', 'mouse_button', 'MOUSE_EXTRABTN1');
RegisterCommand('-noclip:toggle', () => {}, false);

RegisterCommand(
  '+noclip:changeSpeed',
  () => {
    const activeSpeedModeIndex = Object.values(speedModes).findIndex((i) => i === speedMultiplier);
    const nextSeedModeIndex =
      activeSpeedModeIndex + 1 === Object.keys(speedModes).length ? 0 : activeSpeedModeIndex + 1;
    const nextSeedMode = Object.entries(speedModes)[nextSeedModeIndex];

    speedMultiplier = nextSeedMode[1];

    emit('chat:addMessage', { args: [`Noclip: Changed speed to ${nextSeedMode[0]}`] });
  },
  false
);

RegisterKeyMapping('+noclip:changeSpeed', 'Noclip: Change speed', 'mouse_button', 'MOUSE_EXTRABTN2');
RegisterCommand('-noclip:changeSpeed', () => {}, false);

const move = (direction, scale) => {
  if (!isActive) {
    return;
  }

  const entity = exports.freeroam.getLocalPlayerVehicle() ?? PlayerPedId();
  const newPos = GetEntityCoords(entity).map((i, index) => i + direction[index] * scale * speedMultiplier);
  const gameplayCamRot = GetGameplayCamRot(2);

  SetEntityCoordsNoOffset(entity, ...newPos, false, false, false);
  SetEntityRotation(entity, gameplayCamRot[0], 0, gameplayCamRot[2], 2, false);
};

const getForwardVector = () => {
  const gameplayCamRot = GetGameplayCamRot(2).map((i) => i * (Math.PI / 180));

  return [
    -Math.sin(gameplayCamRot[2]) * Math.abs(Math.cos(gameplayCamRot[0])),
    Math.cos(gameplayCamRot[2]) * Math.abs(Math.cos(gameplayCamRot[0])),
    Math.sin(gameplayCamRot[0]),
  ];
};

let moveForwardInterval;

RegisterCommand(
  '+noclip:moveForward',
  () => (moveForwardInterval = setInterval(() => move(getForwardVector(), 1), 0)),
  false
);
RegisterCommand('-noclip:moveForward', () => clearInterval(moveForwardInterval), false);
RegisterKeyMapping('+noclip:moveForward', 'Noclip: Move forward', 'keyboard', 'w');

let moveBackInterval;

RegisterCommand(
  '+noclip:moveBack',
  () => (moveBackInterval = setInterval(() => move(getForwardVector(), -1), 0)),
  false
);
RegisterCommand('-noclip:moveBack', () => clearInterval(moveBackInterval), false);
RegisterKeyMapping('+noclip:moveBack', 'Noclip: Move back', 'keyboard', 's');

const getRightVector = () => {
  const gameplayCamRot = GetGameplayCamRot(2).map((i) => i * (Math.PI / 180));
  return [Math.cos(gameplayCamRot[2]), Math.sin(gameplayCamRot[2]), 0];
};

let moveRightInterval;

RegisterCommand(
  '+noclip:moveRight',
  () => (moveRightInterval = setInterval(() => move(getRightVector(), 1), 0)),
  false
);
RegisterCommand('-noclip:moveRight', () => clearInterval(moveRightInterval), false);
RegisterKeyMapping('+noclip:moveRight', 'Noclip: Move right', 'keyboard', 'd');

let moveLeftInterval;

RegisterCommand('+noclip:moveLeft', () => (moveLeftInterval = setInterval(() => move(getRightVector(), -1), 0)), false);
RegisterCommand('-noclip:moveLeft', () => clearInterval(moveLeftInterval), false);
RegisterKeyMapping('+noclip:moveLeft', 'Noclip: Move right', 'keyboard', 'a');
