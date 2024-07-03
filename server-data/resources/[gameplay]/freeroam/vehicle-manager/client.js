let vehicleBlips = {};

RegisterCommand(
  'veh',
  async (_, args) => {
    if (!args.length) {
      return;
    }

    const modelHash = GetHashKey(args[0]);

    if (!IsModelInCdimage(modelHash) || !IsModelAVehicle(modelHash)) {
      return;
    }

    emitNet('vehicle-manager:spawnVehicle', modelHash);
  },
  false
);

RegisterCommand(
  'ft',
  () => {
    const vehicle = exports.freeroam.getLocalPlayerVehicle();

    if (vehicle === null) {
      return;
    }

    SetVehicleModKit(vehicle, 0);

    [
      { modType: 10, modeIndex: 0 },
      { modType: 11, modeIndex: 3 },
      { modType: 12, modeIndex: 2 },
      { modType: 15, modeIndex: 3 },
      { modType: 16, modeIndex: 4 },
      { modType: 18, modeIndex: 0 },
      { modType: 22, modeIndex: 0 },
      { modType: 40, modeIndex: 2 },
      { modType: 41, modeIndex: 2 },
      { modType: 42, modeIndex: 3 },
    ].forEach((i) => {
      ToggleVehicleMod(vehicle, i.modType, true);
      SetVehicleMod(vehicle, i.modType, i.modeIndex, false);
    });

    SetVehicleWindowTint(vehicle, 1);
    SetVehicleNumberPlateTextIndex(vehicle, 1);
  },
  false
);

RegisterCommand(
  'vehgod',
  (_, args) => {
    if (!args.length) {
      return;
    }

    const vehicle = exports.freeroam.getLocalPlayerVehicle();

    if (vehicle === null) {
      return;
    }

    const isEnabled = !!parseInt(args[0]);
    SetEntityInvincible(vehicle, isEnabled);
    SetVehicleCanBeVisiblyDamaged(vehicle, !isEnabled);
    SetVehicleTyresCanBurst(vehicle, !isEnabled);

    emit('chat:addMessage', { args: [`Your vehicle is ${isEnabled ? 'invincible' : 'vulnerable'} now!`] });
  },
  false
);

RegisterCommand(
  'repair',
  () => {
    const vehicle = exports.freeroam.getLocalPlayerVehicle();

    if (vehicle === null) {
      return;
    }

    SetVehicleFixed(vehicle);
    SetVehicleDirtLevel(vehicle, 0);
  },
  false
);

RegisterCommand(
  'mod',
  (_, args) => {
    if (args.length < 2) {
      return;
    }

    const modType = parseInt(args[0]);
    const modIndex = parseInt(args[1]);

    if (isNaN(modType) || isNaN(modIndex)) {
      return;
    }

    const vehicle = exports.freeroam.getLocalPlayerVehicle();

    if (vehicle === null) {
      return;
    }

    SetVehicleMod(vehicle, modType, modIndex);
  },
  false
);

RegisterCommand(
  'livery',
  (_, args) => {
    if (!args.length) {
      return;
    }

    const liveryIndex = parseInt(args[0]);

    if (isNaN(liveryIndex)) {
      return;
    }

    const vehicle = exports.freeroam.getLocalPlayerVehicle();

    if (vehicle === null) {
      return;
    }

    console.log(vehicle, liveryIndex);
    SetVehicleLivery(vehicle, liveryIndex);
  },
  false
);

RegisterCommand(
  'getmods',
  () => {
    const vehicle = exports.freeroam.getLocalPlayerVehicle();

    if (vehicle === null) {
      return;
    }

    const modSlots = {};

    for (let i = 0; i < 200; i++) {
      const numMods = GetNumVehicleMods(vehicle, i);

      if (!numMods) {
        continue;
      }

      const name = GetModSlotName(vehicle, i);
      modSlots[i] = { name, numMods };
    }

    emit('chat:addMessage', {
      multiline: true,
      args: [
        Object.entries(modSlots)
          .map(([index, value]) => `${index}: "${value.name}" ${value.numMods}`)
          .join('\n'),
      ],
    });
  },
  false
);

RegisterCommand(
  'boost',
  (_, args) => {
    if (!args.length) {
      return;
    }

    const enginePowerMultiplier = parseFloat(args[0]);

    if (isNaN(enginePowerMultiplier)) {
      return;
    }

    const vehicle = exports.freeroam.getLocalPlayerVehicle();

    if (vehicle === null) {
      return;
    }

    ModifyVehicleTopSpeed(vehicle, enginePowerMultiplier);
  },
  false
);

RegisterCommand(
  'gravity',
  (_, args) => {
    if (!args.length) {
      return;
    }

    const gravity = parseFloat(args[0]);

    if (isNaN(gravity)) {
      return;
    }

    const vehicle = exports.freeroam.getLocalPlayerVehicle();

    if (vehicle === null) {
      return;
    }

    SetVehicleGravityAmount(vehicle, gravity);
  },
  false
);

onNet('vehicle-manager:updateBlips', async (vehiclesMap) => {
  for (const vehicle of vehiclesMap) {
    if (vehicleBlips[vehicle.netId] === undefined) {
      vehicleBlips[vehicle.netId] = AddBlipForCoord(...vehicle.position);

      SetBlipSprite(vehicleBlips[vehicle.netId], 545);
      SetBlipColour(vehicleBlips[vehicle.netId], 25);
    } else {
      SetBlipCoords(vehicleBlips[vehicle.netId], ...vehicle.position);
    }
  }

  for (const [vehicleNetId, blip] of Object.entries(vehicleBlips)) {
    if (vehiclesMap.some((i) => i.netId == vehicleNetId)) {
      continue;
    }

    delete vehicleBlips[vehicleNetId];
    RemoveBlip(blip);
  }
});
