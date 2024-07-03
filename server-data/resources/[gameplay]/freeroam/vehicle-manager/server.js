let vehicles = [];

RegisterCommand(
  'clearvehs',
  () => {
    vehicles.forEach(DeleteEntity);
    vehicles = [];
  },
  false
);

RegisterCommand(
  'vehdel',
  (source) => {
    if (!source) {
      return;
    }

    const player = GetPlayerPed(source);
    const vehicle = GetVehiclePedIsIn(player);

    DeleteEntity(vehicle);
    vehicles = vehicles.filter((i) => i !== vehicle);
  },
  false
);

RegisterCommand(
  'paint',
  (source, args) => {
    if (!source) {
      return;
    }

    if (!args) {
      return;
    }

    const colorPrimary = parseInt(args[0]);
    const colorSecondary = parseInt(args[1]);

    if (isNaN(colorPrimary)) {
      return;
    }

    const player = GetPlayerPed(source);
    const vehicle = GetVehiclePedIsIn(player);

    SetVehicleColours(vehicle, colorPrimary, isNaN(colorSecondary) ? colorPrimary : colorSecondary);
  },
  false
);

onNet('vehicle-manager:spawnVehicle', async (modelHash) => {
  const player = GetPlayerPed(source);
  const playerPos = GetEntityCoords(player);
  const playerHeading = GetEntityHeading(player);
  const vehicle = CreateVehicle(modelHash, playerPos[0], playerPos[1], playerPos[2], playerHeading, true, false);

  while (!DoesEntityExist(vehicle)) {
    await exports.freeroam.delay(100);
  }

  vehicles.push(vehicle);

  SetVehicleNumberPlateText(vehicle, 'KOLO');
  SetPedIntoVehicle(player, vehicle, -1);
});

setInterval(() => {
  const vehiclesMap = vehicles.map((i) => ({
    netId: NetworkGetNetworkIdFromEntity(i),
    position: GetEntityCoords(i),
  }));

  emitNet('vehicle-manager:updateBlips', -1, vehiclesMap);
}, 200);
