fx_version 'cerulean'
game 'gta5'

author 'Kokapuk'
description 'Freeroam game mode'
version '1.0.0'

resource_type 'gametype' { name = 'Freeroam' }

client_script {'utils.js', 'freeroam_client.js', 'vehicle-manager/client.js', 'noclip/client.js'}
server_script {'utils.js', 'freeroam_server.js', 'vehicle-manager/server.js'}