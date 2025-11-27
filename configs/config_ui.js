window['STYLES'] = {
// Create preset styles for your notifications through the config file
// The name of the style cannot be the same as the default presets
// If you set the "type" of the notification when sending it, the data will be pulled from here. 
// For example if you set "type":"example" when sending a notification, the style below will be applied.
    "example": {
        "notification": {
            class:"example-notification",
            border:"1px solid #000",
            background: "#fff",
    
            title: {
                title_color: "#000",
                size: "1.2rem"
            },
    
            message: {
                message_color: "#000",
                size: "1rem"
            },
            
            icon: {
                fill: "#000",
                size: "1rem"
            }
        },
        "stack": {
            primary_color: "#111",
            secondary_color: "#222" 
        }
    },
}

window['GENERAL'] = {
    debug_mode: false,
}
