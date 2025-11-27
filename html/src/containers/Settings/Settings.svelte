<script lang="ts">
	import { onMount } from 'svelte';

	import { quintOut } from 'svelte/easing';
	import { crossfade, fly } from 'svelte/transition';
	import History from '../History/History.svelte';
	import { tooltip } from '@svelte-plugins/tooltips';
	import { reposition } from '../../lib/reposition';
	import TTSSettings from './TTSSettings.svelte';

	let {
		settings = $bindable(),
		debug_mode,
		history,
		close,
		show,
		hide,
		clear_history,
		delete_history_notification
	}: {
		settings: SettingsObject;
		debug_mode: boolean;
		history: { [key: string]: NotificationObject };
		close: () => void;
		show: () => void;
		hide: () => void;
		clear_history: () => void;
		delete_history_notification: (notification: NotificationObject) => void;
	} = $props();

	//@ts-ignore
	const LOCALE = window['LOCALE'];

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});
	onMount(() => {
		displayRow = settings.direction == 'column' ? false : true;
		soundOff = !settings.sound;
		historyAmount = settings.history;

		let s = document.getElementById('settings') as HTMLDivElement;
		s.style.left = settings.position.x + 'px';
		s.style.top = settings.position.y + 'px';
	});

	let displayRow = $state(false);
	let soundOff = $state(false);

	let historyAmount = $state(25);

	let displayHistory = $state(false);

	let toggleAnimation = $state(true);

	let areTTSSettingsVisible = $state(false);
	let trigger = {};

	function closeSettings() {
		settings.direction = displayRow ? 'row' : 'column';
		settings.history = historyAmount;

		close();
	}

	function handleHistoryChange() {
		switch (historyAmount) {
			case 10:
				historyAmount = 25;
				settings.history = 25;
				break;
			case 25:
				historyAmount = 50;
				settings.history = 50;
				break;
			case 50:
				historyAmount = 100;
				settings.history = 100;
				break;
			case 100:
				historyAmount = 10;
				settings.history = 10;
				break;
		}
	}
	function handleHistoryOff() {
		displayHistory = false;
		show();
	}

	function handleHistoryOn() {
		displayHistory = true;
		hide();
	}

	function handleHistoryClose() {
		closeSettings();
		show();
	}

	function handleHistorySwitch() {
		handleHistoryOff();
	}

	function handleKeyUp(event: KeyboardEvent) {
		if (event.key == 'Escape' || event.key == 'Backspace') closeSettings();
		return;
	}

	function handleDragMove(event: CustomEvent) {
		const { detail } = event;
		if (detail) {
			const { x, y } = detail;
			// Save new position to local storage settings
			settings.position.x = x.split('px')[0];
			settings.position.y = y.split('px')[0];
		}
	}

	function triggerTestNotification() {
		postMessage({
			action: 'add_notification',
			title: 'Test Notification',
			message: 'This is a test notification.',
			duration: 5,
			type: 'success'
		});
	}
</script>

<svelte:window onkeyup={handleKeyUp} />
{#if displayHistory}
	<History
		{history}
		{debug_mode}
		{clear_history}
		history_close={handleHistoryClose}
		history_switch={handleHistorySwitch}
		{delete_history_notification} />
{:else}
	<div
		id="settings"
		style="left:{settings.position.x}px;top:{settings.position.y}px;position:absolute"
		use:reposition={{
			cursorOver: 'grab',
			cursorDragging: 'grabbing',
			handle: '#drag-handle',
			x: settings.position.x + 'px',
			y: settings.position.y + 'px'
		}}
		onmove={handleDragMove}>
		<div id="drag-handle" class="top-button right">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-arrows-move"
				viewBox="0 0 16 16"
				><path
					fill-rule="evenodd"
					d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10zM.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708l-2-2zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8z" /></svg>
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			use:tooltip={{
				content: LOCALE.history,
				autoPosition: true,
				position: 'right'
			}}
			id="history-toggle"
			onclick={handleHistoryOn}
			class="top-button left">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-clock-fill"
				viewBox="0 0 16 16"
				><path
					d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" /></svg>
		</div>
		<div class="settings-placeholder-wrapper {displayRow ? 'row' : 'column'}">
			{#if areTTSSettingsVisible}
				<TTSSettings bind:ttsOptions={settings.tts} />
			{:else}
				{#each Array(2) as _, i (i)}
					{#key trigger}
						<div class="settings-placeholder">
							<div class="settings-placeholder-icon"></div>
							<div class="settings-placeholder-fields">
								<div class="settings-placeholder-title"></div>
								<div class="settings-placeholder-message"></div>
							</div>
						</div>
					{/key}
				{/each}
			{/if}
		</div>
		<div id="options">
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<div class="option-group">
				<label
					class="option option-radio"
					for="animation-top"
					use:tooltip={{
						content: LOCALE.animation_bottom,
						autoPosition: true,
						position: 'top',
						animation: 'slide'
					}}>
					<input
						type="radio"
						name="animation"
						bind:group={settings.transition}
						value="top"
						checked={true}
						id="animation-top" />

					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-arrow-up-short"
						viewBox="0 0 16 16">
						<path
							fill-rule="evenodd"
							d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
					</svg>
				</label>
				<label
					use:tooltip={{
						content: LOCALE.animation_left,
						autoPosition: true,
						position: 'top',
						animation: 'slide'
					}}
					class="option option-radio"
					for="animation-right">
					<input
						type="radio"
						name="animation"
						bind:group={settings.transition}
						value="right"
						id="animation-right" />

					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-arrow-right-short"
						viewBox="0 0 16 16">
						<path
							fill-rule="evenodd"
							d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z" />
					</svg>
				</label>
				<label
					use:tooltip={{
						content: LOCALE.animation_top,
						autoPosition: true,
						position: 'top',
						animation: 'slide'
					}}
					class="option option-radio"
					for="animation-bottom">
					<input
						type="radio"
						name="animation"
						bind:group={settings.transition}
						value="bottom"
						id="animation-bottom" />

					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-arrow-down-short"
						viewBox="0 0 16 16">
						<path
							fill-rule="evenodd"
							d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
					</svg>
				</label>
				<label
					use:tooltip={{
						content: LOCALE.animation_right,
						autoPosition: true,
						position: 'top',
						animation: 'slide'
					}}
					class="option option-radio"
					for="animation-left">
					<input
						type="radio"
						name="animation"
						bind:group={settings.transition}
						value="left"
						id="animation-left" />

					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-arrow-left-short"
						viewBox="0 0 16 16">
						<path
							fill-rule="evenodd"
							d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
					</svg>
				</label>

				<label
					use:tooltip={{
						content: LOCALE.mute_unmute,
						autoPosition: true,
						animation: 'slide',
						position: 'top'
					}}
					class="option option-checkbox">
					<input bind:checked={settings.sound} type="checkbox" name="sound" id="sound" />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-volume-mute-fill"
						viewBox="0 0 16 16">
						<path
							d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
					</svg>
				</label>

				<!-- <label
					use:tooltip={{
						content: LOCALE.row_column,
						autoPosition: true,
						animation: 'slide',
						position: 'top'
					}}
					class="option option-checkbox">
					<input bind:checked={displayRow} type="checkbox" name="display-row" id="display-row" />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-distribute-vertical"
						viewBox="0 0 16 16"
						><path
							fill-rule="evenodd"
							d="M1 1.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0-.5.5zm0 13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0-.5.5z" /><path
							d="M2 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z" /></svg>
				</label> -->

				<label
					class="option option-checkbox"
					use:tooltip={{
						content: LOCALE.tts_options,
						autoPosition: true,
						animation: 'slide',
						position: 'top'
					}}>
					<input bind:checked={areTTSSettingsVisible} type="checkbox" name="tts" id="tts" />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-megaphone-fill"
						viewBox="0 0 16 16">
						<path
							d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-11zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25.222 25.222 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56V3.224zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009a68.14 68.14 0 0 1 .496.008 64 64 0 0 1 1.51.048zm1.39 1.081c.285.021.569.047.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a65.81 65.81 0 0 1 1.692.064c.327.017.65.037.966.06z" />
					</svg>
				</label>

				<label
					class="option option-checkbox"
					onclick={handleHistoryChange}
					use:tooltip={{
						content: LOCALE.notification_amount,
						animation: 'slide',
						autoPosition: true,
						position: 'top'
					}}>
					{historyAmount}
				</label>

				<label
					class="option option-checkbox"
					onclick={triggerTestNotification}
					use:tooltip={{
						content: LOCALE.test_notification,
						animation: 'slide',
						autoPosition: true,
						position: 'top'
					}}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-play-fill"
						viewBox="0 0 16 16">
						<path
							d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
					</svg>
				</label>

				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div onclick={closeSettings} class="option close">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-x"
						viewBox="0 0 16 16">
						<path
							d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
					</svg>
				</div>
			</div>
		</div>
	</div>
{/if}
