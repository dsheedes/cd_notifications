type Sound = {
    name: string;
    audio?: HTMLAudioElement;
    volume?: number;
    disabled?: boolean;
}
export default class SoundController {
    sounds = new Map<string, Sound>();
    volume;
    speech = window.speechSynthesis;
    voice = this.speech.getVoices()[0];
    rate = 1;
    pitch = 1;
    speechVolume = 1;

    disabled = false;
    
    constructor(sounds: Array<Sound>, volume: number){
        (sounds)?this.batchAdd(sounds):null;
        (volume)?this.volume = volume : this.volume = 0.5;
    }
    
    getVoices(){
        return this.speech.getVoices();
    }

    setVoice(voice: SpeechSynthesisVoice){
        this.voice = voice;
    }

    findVoice(name: string){
        const voices = this.speech.getVoices();
        for(let i = 0; i < voices.length; i++){
            if(voices[i].name === name){
                return voices[i];
            }
        }
        return voices[0];
    }

    setSpeechRate(rate: number){
        this.rate = rate;
    }
    getSpeechRate(){
        return this.rate;  
    }
    setSpeechPitch(pitch: number){
        this.pitch = pitch;
    }
    getSpeechPitch(){
        return this.pitch;  
    }
    setSpeechVolume(volume: number){
        this.speechVolume = volume;
    }
    getSpeechVolume(){
        return this.speechVolume;  
    }
    speak(text:string, lang?:string, rate?:number, pitch?:number, volume?:number, voice?: SpeechSynthesisVoice){
        if(this.disabled) return;
        const utterance = new SpeechSynthesisUtterance(text);

        if(lang) utterance.lang = lang;

        utterance.volume = (volume)?volume:this.speechVolume;
        utterance.rate = (rate)?rate:1;
        utterance.pitch = (pitch)?pitch:1;
        utterance.voice = (voice)?voice:this.voice;

        this.speech.speak(utterance);
    }

    add(name: string, location: string, volume?: number, disabled?: boolean, ){
        let audio = new Audio(location);
        this.sounds.set(name, {
            audio: audio,
            volume: (volume)?volume:this.volume,
            disabled: (disabled)?disabled:false,
            name: name
        });
    }
    remove(name: string){
        this.sounds.delete(name);
    }

    disable(name?: string){
        if(name){
            const sound = this.sounds.get(name);
            if(!sound) return;
            sound.disabled = true;
        } else {
            this.disabled = true;
        }
    }

    enable(name?: string){
        if(name){
            const sound = this.sounds.get(name);
            if(!sound) return;
            sound.disabled = false;
        } else {
            this.disabled = false;
        }
        
    }

    batchAdd(sounds: Array<Sound>){
        if(!sounds) return;
        if(!Array.isArray(sounds)) return;
        if(sounds.length === 0) return;

        for(let i = 0; i < sounds.length; i++){
            this.add(sounds[i].name, `/sounds/${sounds[i].name}`, sounds[i].volume, sounds[i].disabled);
        }
    }

    getVolume(name?: string){
        if(name){
            const sound = this.sounds.get(name);
            if(!sound) return;
            return sound.volume;
        } else if(this.disabled) return 0;
        
        return this.volume;
    }

    async setVolume(value: number, name?: string){
        if(name){
            const sound = this.sounds.get(name);
            if(!sound) return;
            sound.volume = value;
            return;
        } else this.volume = value;
        
    }
    
    async play(name: string, volume?: number){
        if(this.disabled) return;
            let temp = this.sounds.get(name);
            if(!temp || !temp.audio) {
                // Load the audio file on the fly
                let audio = new Audio(`/sounds/${name}`);
                // Check if file exists and is loaded
                audio.addEventListener('canplaythrough', () => {
                    this.sounds.set(name, {
                        audio: audio,
                        volume: (volume)?volume:this.volume,
                        disabled: false,
                        name: name
                    });
                    this.play(name, volume);
                }, { once: true });

                audio.addEventListener('error', () => {
                    console.error("Sound does not exist.");
                    audio.remove();

                    //@ts-ignore
                    audio = null;
                    return;
                }, { once: true });
                return;
            };

            if(temp.disabled) return;

            temp.audio.pause();
            temp.audio.currentTime = 0;

            if(volume) {
                temp.audio.volume = volume;
            } else if(temp.volume) {
                temp.audio.volume = temp.volume;
            } else temp.audio.volume = this.volume;
            
            temp.audio.play().catch((e: Error) => console.error(e));
    }

    async stop(name: string){
        const sound = this.sounds.get(name);
        if(!sound || !sound.audio) return;
        sound.audio.pause();
        sound.audio.currentTime = 0;
    }
}