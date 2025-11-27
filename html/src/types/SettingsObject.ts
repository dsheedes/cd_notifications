type SettingsObject = {
    version: string,
    position: {
        x: number,
        y: number
    },
    transition: "left" | "right" | "top" | "bottom",
    direction: "column" | "row",
    history: number,
    sound: boolean,
    tts: {
        enabled: boolean,
        voice: string,
        pitch: number,
        rate: number
        volume: number,
    }
}