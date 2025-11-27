NUI_status = false
function EnableNuiFocus()
    CreateThread(function()
        NUI_status = true
        while NUI_status do
            Wait(5)
            SetNuiFocus(NUI_status, NUI_status)
            SetNuiFocusKeepInput(NUI_status)
            DisableControlAction(0, 1,   true)
            DisableControlAction(0, 2,   true)
            DisableControlAction(0, 106, true)
            DisableControlAction(0, 142, true)
            DisableControlAction(0, 21,  true)
            DisableControlAction(0, 24,  true)
            DisableControlAction(0, 25,  true)
            DisableControlAction(0, 47,  true)
            DisableControlAction(0, 58,  true)
            DisableControlAction(0, 263, true)
            DisableControlAction(0, 264, true)
            DisableControlAction(0, 257, true)
            DisableControlAction(0, 140, true)
            DisableControlAction(0, 141, true)
            DisableControlAction(0, 143, true)
            DisableControlAction(0, 75,  true)
            DisableControlAction(27, 75, true)
            SetPlayerCanDoDriveBy(PlayerId(), false)
        end
        SetNuiFocus(false, false)
        SetNuiFocusKeepInput(false)
        local count, keys = 0, {177, 200, 202, 322}
        while count < 100 do
            Wait(0)
            count=count+1
            for c, d in pairs(keys) do
                DisableControlAction(0, d, true)
            end
        end
    end)
end

function DisableNuiFocus()
    NUI_status = false
end

function Locale(locale)
    if LocalesTable[Config.Language][locale] then
        return LocalesTable[Config.Language][locale]
    end
end