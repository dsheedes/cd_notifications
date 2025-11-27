fx_version 'cerulean'
game 'gta5'
author 'discord.gg/codesign'
description 'Codesign Notifications'
version '1.0.0'
lua54 'yes'

shared_scripts {
    'configs/locales.lua',
    'configs/config.lua'
}

client_scripts {
    'client/functions.lua',
    'client/client.lua'
}

ui_page {
    'html/index.html',
}
files {
    'configs/locales_ui.js',
    'configs/config_ui.js',
    'html/index.html',
    'html/assets/*.css',
    'html/assets/*.js',
    'sounds/*.ogg'
}