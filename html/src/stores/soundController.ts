import { writable } from "svelte/store";
import SoundController from "../lib/sound";

export let soundController = writable<SoundController>();