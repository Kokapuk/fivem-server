let playerBlips = {};

on('playerSpawned', () => {
  emitNet('player-blips:playerSpawned');
});

onNet('player-blips:updateBlips', async (playersMap) => {
  for (const player of playersMap) {
    if (playerBlips[player.netId] === undefined) {
      playerBlips[player.netId] = AddBlipForCoord(...player.position);

      SetBlipSprite(playerBlips[player.netId], 1);
      SetBlipColour(playerBlips[player.netId], 38);
    } else {
      SetBlipCoords(playerBlips[player.netId], ...player.position);
    }
  }

  for (const [playerNetId, blip] of Object.entries(playerBlips)) {
    if (playersMap.some((i) => i.netId == playerNetId)) {
      continue;
    }

    delete playerBlips[playerNetId];
    RemoveBlip(blip);
  }
});
