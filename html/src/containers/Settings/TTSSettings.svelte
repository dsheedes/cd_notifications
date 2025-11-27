<script lang="ts">
	import { fade } from 'svelte/transition';
	import { soundController } from '../../stores/soundController';

	//@ts-ignore
	const LOCALE = window['LOCALE'];
	let {
		ttsOptions = $bindable()
	}: {
		ttsOptions: {
			enabled: boolean;
			voice: string;
			pitch: number;
			rate: number;
			volume: number;
		};
	} = $props();

	function handleVoiceChange() {
		$soundController.speak(
			ttsOptions.voice,
			undefined,
			ttsOptions.rate,
			ttsOptions.pitch,
			ttsOptions.volume,
			$soundController.findVoice(ttsOptions.voice)
		);
	}
</script>

<div in:fade={{ duration: 200 }} class="tts-options-wrapper">
	<div class="tts-field tts-enabled">
		<label for="tts-enabled">{LOCALE.tts_fields.enable}</label>
		<input type="checkbox" bind:checked={ttsOptions.enabled} id="tts-enabled" />
	</div>
	<div class="tts-voice tts-field tts-column">
		<label for="tts-voice">{LOCALE.tts_fields.voice}</label>
		<select bind:value={ttsOptions.voice} id="tts-voice" onchange={handleVoiceChange}>
			{#each $soundController.getVoices() as voice, index}
				<option selected={ttsOptions.voice === voice.name} value={voice.name}
					>{voice.name} ({voice.lang})</option>
			{/each}
		</select>
	</div>
	<div class="tts-field tts-pitch">
		<label for="tts-pitch">{LOCALE.tts_fields.pitch} {ttsOptions.pitch}</label>
		<input type="range" bind:value={ttsOptions.pitch} min="0" max="2" step="0.1" id="tts-pitch" />
	</div>
	<div class="tts-field tts-rate">
		<label for="tts-rate">{LOCALE.tts_fields.rate} {ttsOptions.rate}</label>
		<input type="range" bind:value={ttsOptions.rate} min="0.5" max="2" step="0.1" id="tts-rate" />
	</div>
	<div class="tts-field tts-volume">
		<label for="tts-volume">{LOCALE.tts_fields.volume} {ttsOptions.volume}</label>
		<input type="range" bind:value={ttsOptions.volume} min="0" max="1" step="0.1" id="tts-volume" />
	</div>
</div>
