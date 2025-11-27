TriggerEvent('chat:addSuggestion', '/'..Config.OpenSettingsUI, Locale('opensettingsui'))
RegisterCommand(Config.OpenSettingsUI, function()
    EnableNuiFocus()
    TriggerEvent('cd_notifications:ShowSettings')
end, false)

local function CheckParameters(title, message)
    local isTitleValid = type(title) == 'string'
    local isMessageValid = type(message) == 'string'

    if isTitleValid and isMessageValid then
        return false
    end

    if not isTitleValid and not isMessageValid then
        print(string.format(
            '^1[Codesign ErrorHandler] - invalid_title_and_message\n' ..
            '^3(title) expected: string | got: %s | value: %s\n' ..
            '^3(message) expected: string | got: %s | value: %s^0',
            type(title), tostring(title),
            type(message), tostring(message)
        ))
    elseif not isTitleValid then
        print(string.format(
            '^1[Codesign ErrorHandler] - invalid_title\n' ..
            '^3(title) expected: string | got: %s | value: %s^0',
            type(title), tostring(title)
        ))
    elseif not isMessageValid then
        print(string.format(
            '^1[Codesign ErrorHandler] - invalid_message (%s)\n' ..
            '^3(message) expected: string | got: %s | value: %s^0',
            type(message), tostring(message)
        ))
    end

    return true
end

RegisterNetEvent('cd_notifications:Add', function(data)
    if CheckParameters(data.title, data.message) then
        return
    end

	SendNUIMessage({
        action = 'add_notification',
        title = data.title,
        message = data.message,
        type = data.type,
        options = data.options
    })
end)

RegisterNetEvent('cd_notifications:ShowNotifications', function()
	SendNUIMessage({action = 'show_notifications'})
end)

RegisterNetEvent('cd_notifications:HideNotifications', function()
	SendNUIMessage({action = 'hide_notifications',})
end)

RegisterNetEvent('cd_notifications:ShowSettings', function()
	SendNUIMessage({action = 'show_settings'})
end)

RegisterNetEvent('cd_notifications:HideSettings', function()
	SendNUIMessage({action = 'hide_settings'})
end)

RegisterNetEvent('cd_notifications:EnableTTS', function()
	SendNUIMessage({action = 'enable_tts'})
end)

RegisterNetEvent('cd_notifications:DisableTTS', function()
	SendNUIMessage({action = 'disable_tts'})
end)

RegisterNUICallback('close', function()
    DisableNuiFocus()
end)