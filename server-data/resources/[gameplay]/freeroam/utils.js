const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getLocalPlayerVehicle = () => {
  const player = PlayerPedId();
  const vehicle = GetVehiclePedIsIn(player, false);

  return DoesEntityExist(vehicle) ? vehicle : null;
};

const findPlayerByNamePart = (namePart) => {
  for (let i = 0; i < GetNumPlayerIndices(); i++) {
    const player = GetPlayerFromIndex(i);
    const playerName = GetPlayerName(player);

    if (!playerName.toLowerCase().includes(namePart.toLowerCase())) {
      continue;
    }

    return player;
  }

  return null;
};

exports('delay', delay);
exports('getLocalPlayerVehicle', getLocalPlayerVehicle);
exports('findPlayerByNamePart', findPlayerByNamePart);
