let players = [];

onNet('player-blips:playerSpawned', () => {
  const player = GetPlayerPed(source);

  if (players.includes(player)) {
    return;
  }

  players.push(player);
});

setInterval(() => {
  players = players.filter(DoesEntityExist);

  const playersMap = players.map((i) => ({
    netId: NetworkGetNetworkIdFromEntity(i),
    position: GetEntityCoords(i),
  }));

  emitNet('player-blips:updateBlips', -1, playersMap);
}, 200);
