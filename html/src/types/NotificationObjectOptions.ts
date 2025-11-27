type NotificationObjectOptions = {
    duration: number;

    fields: {
        use_icon?: boolean,
        use_title?: boolean,
        use_message?: boolean
    }

    sound: string,
    force_tts: boolean,
    use_progress: boolean,
    stack: boolean,
    use_html: boolean,

    style: NotificationStyle | string,

    icon: string
}