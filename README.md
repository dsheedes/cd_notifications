
# Codesign Notifications

This resource was created as a default notification system for all of our paid and non paid resources, as well as people who are looking to change things up on their servers.

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![Lua](https://img.shields.io/badge/lua-%232C2D72.svg?style=for-the-badge&logo=lua&logoColor=white)

## Documentation

[Documentation](https://docs.codesign.pro/free-scripts/notifications)


## Installation

### FiveM Server
1. Download the release from the [releases section](https://github.com/dsheedes/cd_notifications/releases).
2. Paste into your resources folder
3. Read and configure the files in the `cd_notifications/configs` folder
4. Ensure the resource in your `server.cfg`
    - `ensure cd_notifications`
5. If the server is live start the resource, otherwise start the server

### For development & contributions
1. Clone the repository in to the directory of your choice
2. Navigate your terminal to `cd_notifications/html`
3. Run `npm i` to install all the packages

*Use `npm run build` to compile the code. It will appear under `cd_notifications/html/dist`. This folder contains ready the ready to run UI. (Contents of this folder would go inside the `html` folder on the server)*

*Use `npm run dev` to test the UI locally. (Lua side won't work.)*


    
## Features

- **Stackable notifications** - Same notifications won't flood the screen, instead they will get grouped together.
- **Custom styles** - Can set custom styles to title, message, icon or the entire notification.
- **Color aware notifications** - Set your own color - the script calculates shades and readable text color.
- **Icon support** - Supports Fontawesome, SVG and image (url) icons
- **6 Built in types**  - Set a type and forget about styles. *Can also create your own custom types*
- **Position selection** - Select where your notifications appear on the screen.
- **Animation selection** - Select the animation style of the notifications appearing.
- **Custom sounds** - Each sent notification can have it's own sound.
- **Text To Speech support** - The notifications will be read out to you.
- **Notification history** - List of previous notifications in case you missed something out.
- Out of the box compatibility with Codesign resources


## Usage/Examples
*1. Notification styles*

![Notification styles](https://i.imgur.com/FjfE6Fj.png)

*2. Stacked notifications*

![Notification stacked](https://i.imgur.com/wm98r3M.png)

### Sending a notification
Some examples of the **add** event.

`Client -> Client`

Limited options (*It still looks good I promise*)
```lua
-- Sends a default info notification
TriggerEvent('cd_notifications:Add', {title = 'Title', message = 'My message'})

-- Sends a success notification
TriggerEvent('cd_notifications:Add', {title = 'Title', message = 'My message', type = 'success'})

-- Sends an error notification with set time
TriggerEvent('cd_notifications:Add', {title = 'Title', message = 'My message', type = 'error', options = { duration = 30}})
```

More options!!!
```lua
TriggerEvent('cd_notifications:Add', {
            ---BASIC OPTIONS---
            title = 'Title', 
            message = 'Message',
            type = 'success', --'success | warning | error | info | dark'.
            options = {
                ---INTERMEDIATE OPTIONS---
                duration = 5, --How long should the notification last? (in seconds)
                use_progress = true, --Do you want a progress bar on the notification?
                stack = true, --Do you want this notification to stack?
                sound = 'notification.ogg', --Choose a sound file name from the [sound] folder.
                icon = 'fas fa-bell', --The icon displayed on the notification.
                use_html = true, --Do you want to allow the use of html in the title and message?
                fields = {
                    use_icon = true, --Do you want the icon to be visible on the notification?
                    use_title = true, --Do you want the title to be visible on the notification?
                    use_message = true, --Do you want the message to be visible on the notification?
                },
            }
        })
```

List of all options ⬇️
## Data types & default values


### Notification Object
| Field   | Type                      | Default   | Required | Comment |
|---------|---------------------------|-----------|----------|---------|
| title   | string                    | ''        | no       |         |
| message | string                    | ''        | no       |         |
| type    | string                    | 'info'    | no       |  Possible options 'success' ('error' / 'danger'), ('info' / 'inform' / 'primary'), 'warning', 'light', 'dark' or custom       |
| options | NotificationObjectOptions | undefined | no       |         |

### Notification Object Options
| Field              | Type                       | Default            | Required | Comment                                                                                   |
|--------------------|----------------------------|--------------------|----------|-------------------------------------------------------------------------------------------|
| duration           | number                     | 5                  | no       |                                                                                           |
| fields             | object                     | undefined          | no       |                                                                                           |
| fields.use_icon    | boolean                    | undefined          | no       |                                                                                           |
| fields.use_title   | boolean                    | undefined          | no       |                                                                                           |
| fields.use_message | boolean                    | undefined          | no       |                                                                                           |
| sound              | string                     | 'notification.ogg' | no       | The sound will default to notification.ogg if nothing is set                              |
| force_tts          | boolean                    | false              | no       |                                                                                           |
| use_progress       | boolean                    | true               | no       | The progress bar underneath the notification element                                      |
| stack              | boolean                    | true               | no       | True if this notification should enter the stack group if multiple same ones are found    |
| use_html           | boolean                    | false              | no       | Toggles usage of html within the notification title and message                           |
| style              | NotificationStyle or string | undefined          | no       | Can be a set of properties or a style string which is applied to the notification element |
| icon               | string                     | ->                 | no       | Defaults based off type, can also be set to Fontawesome string, svg or image url          |

### Notification style
| Field           | Type   | Default   | Required | Comment                                                                                                                    |
|-----------------|--------|-----------|----------|----------------------------------------------------------------------------------------------------------------------------|
| class           | string | undefined | no       | Applies this string as class name to the notification element                                                              |
| backgroundColor | string | undefined | no       | HEX or RGB color code which will apply to the notification. Calculates stack shades, border and text color based off this  |
| title           | string | undefined | no       | Style of the title                                                                                                         |
| message         | string | undefined | no       | Style of the message                                                                                                       |
| icon            | string | undefined | no       | Style of the icon                                                                                                          |

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en)

