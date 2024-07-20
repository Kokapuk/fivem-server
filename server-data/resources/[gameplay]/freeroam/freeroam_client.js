const giveAllWeapons = () => {
  const player = PlayerPedId();

  const weapons = [
    { hash: 0x3813fc08 }, // Stone Hatchet
    { hash: 0x8bb05fd7 }, // Flashlight

    { hash: 0x3656c8c1 }, // Taser
    { hash: 0xaf3696a1 }, // Up-n-Atomizer
    {
      hash: 0xcb96392f, // Heavy Revolver Mk II
      components: [
        0xdc8ba3f, // Full Metal Jacket Rounds
        0x420fd713, // Holographic Sight
        0x27077ccb, // Compressor
      ],
      tint: 18, // Bold Green Features
    },

    {
      hash: 0x13532244, // Assault SMG
      components: [
        0x10e6ba2b, // Extended Clip
        0x9d2fbf29, // Scope
        0xa73d4664, // Suppressor
      ],
      tint: 2, // Gold
    },

    {
      hash: 0x555af99a, // Pump Shotgun Mk II
      components: [
        0x3be4465d, // Explosive Slugs
        0x3f3c8181, // Medium Scope
        0xac42df71, // Suppressor
      ],
      tint: 16, // Green and Purple
    },

    {
      hash: 0x969c3d67, // Special Carbine Mk II
      components: [
        0xde011286, // Incendiary Rounds
        0xc66b6542, // Large scope
        0xa73d4664, // Suppressor
        0x9d65907a, // Grip
        0xf97f783b, // Heavy Barrel
      ],
      tint: 17, // Bold Red Features
    },

    {
      hash: 0x6a6c02e0, // Marksman Rifle Mk II
      components: [
        0xe14a9ed3, // Full Metal Jacket Rounds
        0x837445aa, // Suppressor
        0x9d65907a, // Grip
        0x68373ddc, // Heavy barrel
      ],
      tint: 26, // Metallic Purple & Lime
    },
    {
      hash: 0xa914799, // Heavy Sniper Mk II
      components: [
        0x89ebdaa7, // Explosive Rounds
        0xbc54da77, // Advanced Scope
        0xac42df71, // Suppressor
        0x108ab09e, // Heavy barrel
      ],
      tint: 11, // Yellow
    },

    {
      hash: 0xb1ca77b1, // RPG
      tint: 1, // Green
    },
    {
      hash: 0x42bf8a85, // Minigun
      tint: 6, // Orange
    },
    {
      hash: 0x7f7497e5, // Firework Launcher
      tint: 6, // Orange
    },
    {
      hash: 0x63ab0442, // Homing Launcher
      tint: 3, // Pink
    },
    {
      hash: 0x6d544c99, // Railgun
      tint: 7, // Platinum
    },

    { hash: 0x24b17070 }, // Molotov
    { hash: 0x2c3731d9 }, // Sticky Bomb

    { hash: 0xfbab5776 }, // Parachute
    { hash: 0x34a67b97 }, // Jerry Can
  ];

  weapons.forEach((weapon) => {
    GiveWeaponToPed(player, weapon.hash, 0, false, false);

    if (weapon.tint) {
      SetPedWeaponTintIndex(player, weapon.hash, weapon.tint);
    }

    if (weapon.components) {
      weapon.components.forEach((component) => {
        GiveWeaponComponentToPed(player, weapon.hash, component);
      });
    }

    const ammoType = GetPedAmmoTypeFromWeapon(player, weapon.hash);
    AddAmmoToPedByType(player, ammoType, 1000);
  });

  // SetPedInfiniteAmmoClip(player, true);
};

SetMinimapComponent(15, true, 0);
setInterval(() => NetworkOverrideClockTime(10, 0, 0), 100);
SetOverrideWeather('EXTRASUNNY');

[
  'MP0_STAMINA',
  'MP0_STRENGTH',
  'MP0_LUNG_CAPACITY',
  'MP0_WHEELIE_ABILITY',
  'MP0_FLYING_ABILITY',
  'MP0_SHOOTING_ABILITY',
  'MP0_STEALTH_ABILITY',
].forEach((i) => StatSetInt(i, 100, true));

on('onClientGameTypeStart', () => {
  exports.spawnmanager.setAutoSpawnCallback(() => {
    const skins = ['ig_kerrymcintosh', 's_f_y_clubbar_01', 'a_f_y_topless_01'];

    exports.spawnmanager.spawnPlayer({
      x: -385,
      y: 907,
      z: 232,
      model: skins[Math.floor(Math.random() * skins.length)],
    });
  });

  exports.spawnmanager.setAutoSpawn(true);
  exports.spawnmanager.forceRespawn();
});

on('playerSpawned', () => {
  giveAllWeapons();

  NetworkSetFriendlyFireOption(true);
  SetCanAttackFriendly(PlayerPedId(), true, true);
});

RegisterCommand('weapons', giveAllWeapons, false);

RegisterCommand(
  'tpw',
  async () => {
    const waypoint = GetFirstBlipInfoId(8);

    if (!DoesBlipExist(waypoint)) {
      return;
    }

    const entity = exports.freeroam.getLocalPlayerVehicle() ?? PlayerPedId();
    const waypointPos = GetBlipInfoIdCoord(waypoint);
    const highestZ = GetHeightmapTopZForPosition(waypointPos[0], waypointPos[1]);
    const sightingPos = [waypointPos[0], waypointPos[1], highestZ];
    SetEntityCoords(entity, ...sightingPos, false, false, false, false);
    FreezeEntityPosition(entity, true);

    let groundZ = 0;

    for (let i = 0; i < 20; i++) {
      await exports.freeroam.delay(100);
      [, groundZ] = GetGroundZFor_3dCoord(waypointPos[0], waypointPos[1], 1000, false);

      if (groundZ) {
        break;
      }
    }

    if (!groundZ) {
      FreezeEntityPosition(entity, false);
      return;
    }

    const precisePos = [waypointPos[0], waypointPos[1], groundZ];
    SetEntityCoords(entity, ...precisePos, false, false, false, false);
    FreezeEntityPosition(entity, false);
  },
  false
);

RegisterCommand('god', (_, args) => {
  if (!args.length) {
    return;
  }

  const isEnabled = !!parseInt(args[0]);
  SetEntityInvincible(PlayerPedId(), isEnabled);

  emit('chat:addMessage', { args: [`You are ${isEnabled ? 'invincible' : 'vulnerable'} now!`] });
});

RegisterCommand(
  'kill',
  () => {
    SetEntityHealth(PlayerPedId(), 0);
  },
  false
);

RegisterCommand(
  'lester',
  (_, args) => {
    if (!args.length) {
      return;
    }

    const isEnabled = !!parseInt(args[0]);
    SetMaxWantedLevel(isEnabled ? 0 : 5);
    isEnabled && SetPlayerWantedLevel(PlayerId(), 0, false);

    emit('chat:addMessage', { args: [`Cops has been ${isEnabled ? 'disabled' : 'enabled'}!`] });
  },
  false
);

RegisterCommand(
  'ipl',
  (_, args) => {
    if (!args.length) {
      return;
    }

    RequestIpl(args[0]);
  },
  false
);
