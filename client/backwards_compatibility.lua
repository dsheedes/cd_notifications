function RegisterLegacyExport(resourceName, exportName, callback)
    if type(resourceName) ~= 'string' or resourceName == '' then
        print(('^1[ERROR] [RegisterLegacyExport] Invalid resourceName, expected string, got %s^7'):format(type(resourceName)))
        return
    end

    if type(exportName) ~= 'string' or exportName == '' then
        print(('^1[ERROR] [RegisterLegacyExport] Invalid exportName, expected string, got %s^7'):format(type(exportName)))
        return
    end

    if type(callback) ~= 'function' then
        print(('^1[ERROR] [RegisterLegacyExport] Invalid callback, expected function, got %s^7'):format(type(callback)))
        return
    end

    AddEventHandler(('__cfx_export_%s_%s'):format(resourceName, exportName), function(register)
        register(function(...)
            local ok, result = pcall(callback, ...)
            if ok then
                return result
            end
            print(('^1[ERROR] [RegisterLegacyExport] Error in export callback for %s:%s - %s^7'):format(resourceName, exportName, result))
            return nil
        end)
    end)
end

local function Notification(message, notifType, title)
    TriggerEvent('cd_notifications:Add', {
        title = title or Locale('title'),
        message = message,
        type = notifType
    })
end

RegisterLegacyExport('mythic_notify', 'DoLongHudText', function(message, notifType)
    Notification(message, notifType)
end)

RegisterLegacyExport('okokNotify', 'Alert', function(title, message, time, notifType)
    Notification(message, notifType, title)
end)

RegisterLegacyExport('origen_notify', 'ShowNotification', function(message)
    Notification(message, 'info')
end)

RegisterLegacyExport('ox_lib', 'notify', function(data)
    Notification(data.description, data.type, data.title)
end)

RegisterLegacyExport('pNotify', 'SendNotification', function(data)
    Notification(data.text, data.type)
end)

RegisterLegacyExport('ps-ui', 'Notify', function(message, notifType, time)
    Notification(message, notifType)
end)

AddEventHandler('rtx_notify:Notify', function(title, notifType, message, time)
    Notification(message, notifType, title)
end)

RegisterLegacyExport('vms_notifyv2', 'Notification', function(data)
    Notification(data.description, 'info', data.title)
end)

RegisterLegacyExport('ZSX_UIV2', 'Notification', function(title, message)
    Notification(message, 'info', title)
end)

RegisterLegacyExport('qbx_core', 'Notify', function(message, notifType)
    Notification(message, notifType)
end)