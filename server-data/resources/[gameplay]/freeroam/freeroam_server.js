RegisterCommand(
  'tp',
  (source, args) => {
    if (!source || !args.length) {
      return;
    }

    const foundPlayer = exports.freeroam.findPlayerByNamePart(args[0]);

    if (!foundPlayer) {
      return;
    }

    const player = GetPlayerPed(source);
    const vehicle = GetVehiclePedIsIn(player, false);
    const foundPlayerPed = GetPlayerPed(foundPlayer);
    const foundPlayerPos = GetEntityCoords(foundPlayerPed);
    SetEntityCoords(DoesEntityExist(vehicle) ? vehicle : player, ...foundPlayerPos, false, false, false, false);
  },
  false
);

RegisterCommand(
  'pt',
  (source, args) => {
    if (!source || !args.length) {
      return;
    }

    const foundPlayer = exports.freeroam.findPlayerByNamePart(args[0]);

    if (!foundPlayer) {
      return;
    }

    const player = GetPlayerPed(source);
    const playerPos = GetEntityCoords(player);
    const foundPlayerPed = GetPlayerPed(foundPlayer);
    const vehicle = GetVehiclePedIsIn(foundPlayerPed, false);
    SetEntityCoords(DoesEntityExist(vehicle) ? vehicle : foundPlayerPed, ...playerPos, false, false, false, false);
  },
  false
);
