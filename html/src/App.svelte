<script lang="ts">
	const version = '1.0.0';

	// Svelte objects
	import Notification from './containers/Notification/Notification.svelte';
	import Settings from './containers/Settings/Settings.svelte';

	// Vendor
	import murmurhash3_32_gc from './vendor/murmurhash3_gc';

	// Svelte
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

	// Lib
	import { Log } from './lib/logger';

	// Store
	import { soundController } from './stores/soundController';
	import { onMount } from 'svelte';
	import Messenger from './lib/messenger';
	import SoundController from './lib/sound';

	// @ts-ignore
	const GENERAL = window['GENERAL'];

	soundController.set(
		new SoundController(
			[
				{
					name: 'notification.ogg',
					volume: 0.5,
					disabled: false
				},
				{
					name: 'n_warning.ogg',
					volume: 0.5,
					disabled: false
				},
				{
					name: 'n_error2.ogg',
					volume: 0.5,
					disabled: false
				},
				{
					name: 'n_synth.ogg',
					volume: 0.5,
					disabled: false
				},
				{
					name: 'n_chime.ogg',
					volume: 0.5,
					disabled: false
				},
				{
					name: 'n_click1.ogg',
					volume: 0.5,
					disabled: false
				},
				{
					name: 'n_click2.ogg',
					volume: 0.5,
					disabled: false
				},
				{
					name: 'n_error.ogg',
					volume: 0.5,
					disabled: false
				},
				{
					name: 'n_kalimba.ogg',
					volume: 0.5,
					disabled: false
				}
			],
			0.5
		)
	);

	let notifications: { [key: string]: NotificationObject } = $state({});
	let history: { [key: string]: NotificationObject } = $state({});

	let settings: SettingsObject = $state({
		version,
		position: {
			// Default at top right if we know the container size is 20% of max width
			x: window.innerWidth * 0.8 - 32,
			y: 16
		},
		transition: 'left',
		direction: 'column',
		history: 25,
		sound: true,
		tts: {
			enabled: false,
			voice: $soundController.getVoices().length > 0 ? $soundController.getVoices()[0].name : '',
			pitch: 1,
			rate: 1,
			volume: 0.5
		}
	});

	let showUi = $state(true);
	let showSettings = $state(false);
	let hidden = $state(false);

	let transitionObject = $state({});

	// @ts-ignore
	let debug_mode = false;

	function createNotification(notification: NotificationObject) {
		if (!notification.message && !notification.title) {
			Log('Attempted to create a notification without a message and a title', 'warn', debug_mode);
			return;
		}
		const checksum = createChecksum(notification.message, notification.title, notification.type);

		const existingNotification = notifications[checksum];

		// If we have an exsiting notification set to true and stack set to true
		// Stack the notifications
		if (
			existingNotification &&
			((notification.options.stack != null && notification.options.stack == true) ||
				notification.options.stack == null)
		) {
			existingNotification.seed += 1;
			existingNotification.stackAmount += 1;
			existingNotification.options.duration = notification.options.duration || 5;
			existingNotification.reset = true;

			notifications[checksum] = existingNotification;

			if (showUi)
				$soundController.play(
					notification.options.sound ? notification.options.sound : 'notification.ogg'
				);

			Log('Stacked notification => ' + existingNotification.checksum, 'info', debug_mode);
			return;
		} else {
			notification.createdAt = new Date();
			notification.stackAmount = 1;

			notification.checksum = checksum;

			// If a notification already exists, and stack is not selected we should generate a new checksum with a seed based off increment
			if (existingNotification) {
				existingNotification.seed += 1;
				notifications[checksum] = existingNotification;

				notification.checksum = createChecksum(
					notification.message,
					notification.title,
					notification.type,
					existingNotification.seed
				);
			}

			notifications[notification.checksum] = notification;

			// If sound is enabled in the settings play a notification
			if (showUi && settings.sound)
				$soundController.play(
					notification.options.sound ? notification.options.sound : 'notification.ogg'
				);

			// If Text to speech is enabled read out the message
			if ((showUi && settings.tts.enabled) || notification.options.force_tts)
				$soundController.speak(
					notification.type + '. ' + notification.title + '. ' + notification.message + '.',
					undefined,
					settings.tts.rate,
					settings.tts.pitch,
					settings.tts.volume,
					$soundController.findVoice(settings.tts.voice)
				);

			Log('Created new notification => ' + notification.checksum, 'info', debug_mode);
			return;
		}
	}

	function createChecksum(message: string, title: string, type: string, seed?: number) {
		return String(murmurhash3_32_gc(message + title + type, seed || 1));
	}

	function deleteNotification(checksum: string) {
		// Add to history
		if (Object.keys(history).length == settings.history) {
			let keys = Object.keys(history);
			delete history[history[keys[keys.length - 1]].checksum];

			Log(
				'Removing last from history because length is at ' + settings.history,
				'info',
				debug_mode
			);
		}

		history[checksum] = notifications[checksum];

		Log('Appended one to history => ' + checksum, 'info', debug_mode);

		// Delete
		delete notifications[checksum];

		Log('Deleted notification => ' + checksum, 'info', debug_mode);

		return;
	}

	const request = {
		// Adds a notification to the display
		add_notification: (data: any) => {
			try {
				let notification: NotificationObject = {
					title: data.title ?? '',
					message: data.message ?? '',
					type: data.type ?? 'info',
					seed: 1,
					createdAt: new Date(),
					checksum: '',
					stackAmount: 1,
					reset: false,
					options: {
						duration: data.options?.duration ?? 5,
						sound: data.options?.sound ?? null,
						force_tts: data.options?.force_tts ?? false,
						icon: data.options?.icon ?? null,
						use_progress: data.options?.use_progress ?? true,
						stack: data.options?.stack ?? true,
						use_html: data.options?.use_html ?? true,
						fields: {
							use_icon: data.options?.fields?.use_icon ?? true,
							use_title: data.options?.fields?.use_title ?? true,
							use_message: data.options?.fields?.use_message ?? true
						},
						style: {
							class: '',
							backgroundColor: '',
							title: '',
							message: '',
							icon: ''
						}
					}
				};

				// Apply the custom type if found in the config file
				// @ts-ignore
				if (data.type && data.type in window['STYLES']) {
					// @ts-ignore
					notification.options.style = window['STYLES'][data.type];
				}

				if (data.options) {
					if (data.options.style && !(data.options.style instanceof String)) {
						notification.options.style = {
							class: '',
							backgroundColor: '',
							title: '',
							message: '',
							icon: ''
						};
						if (data.options.style) {
							notification.options.style.class = data.options.style.class;
							notification.options.style.backgroundColor = data.options.style.backgroundColor;

							if (data.options.style.title) {
								notification.options.style.title = data.options.style.title;
							}

							if (data.options.style.message) {
								notification.options.style.message = data.options.style.message;
							}

							if (data.options.style.icon) {
								notification.options.style.icon = data.options.style.icon;
							}
						}
					}
				}
				createNotification(notification);
			} catch (e) {
				Log('Something went wrong while creating notification', 'error', debug_mode);
				Log(e, 'error', debug_mode);

				return;
			}
		},
		// Removes a notification (if still alive) based off the id / checksum
		remove_notification: (data: any) => {
			try {
				deleteNotification(data.checksum);
			} catch (e) {
				Log('Unable to delete notification => ' + data.checksum, 'error', debug_mode);
				Log(e, 'error', debug_mode);
				return;
			}
		},
		// Enables the notification display once again
		// If hidden displays the notifications which were not shown during the hidden state
		show_notifications: () => {
			showUi = true;
		},
		// Hides the notification display, placing the previously created notifications in a show queue
		hide_notifications: () => {
			showUi = false;
		},
		// Displays the settings menu allowing players to adjust the notification location and choose the animation type
		show_settings: () => {
			showSettings = true;
		},
		// Hides the settings menu
		hide_settings: () => {
			showSettings = false;
		},
		enable_tts: () => {
			settings.tts.enabled = true;
		},

		disable_tts: () => {
			settings.tts.enabled = false;
		}
	};

	async function handleMessage(event: MessageEvent) {
		// If the action is in request
		if (event.data.action in request) {
			// Call the function from the request object
			// @ts-ignore
			request[event.data.action](event.data);

			Log('Received message => ' + event.data.action, 'info', debug_mode);
			return;
		} else {
			// Action does not exist in the request, cancel
			Log('Cannot find request action => ' + event.data.action, 'error', debug_mode);
			return;
		}
	}

	async function handleSettingsClose() {
		showSettings = false;
		saveSettingsToLocalStorage();
		createTransitionObject();
		Messenger.send('close', { ok: true });

		return;
	}

	async function handleShowNotifications() {
		showUi = true;
		return;
	}

	async function handleHideNotifications() {
		showUi = false;
		return;
	}

	async function getSettingsFromLocalStorage() {
		let savedSettings: string | SettingsObject | null = localStorage.getItem(
			'cd_notifications_settings'
		);

		if (savedSettings) {
			try {
				savedSettings = JSON.parse(savedSettings) as SettingsObject;
				// Versions are the same, we can safely use the saved settings
				if (savedSettings.version == version) {
					settings = savedSettings;
					createTransitionObject();
					return;
				} else {
					saveSettingsToLocalStorage();
					createTransitionObject();
					return;
				}
			} catch (e) {
				Log('Failed to parse saved settings, using default settings', 'warn', debug_mode);
				saveSettingsToLocalStorage();
				createTransitionObject();
				return;
			}
		}

		// In case there is nothing saved save the default version
		saveSettingsToLocalStorage();
		createTransitionObject();
		return;
	}

	async function saveSettingsToLocalStorage() {
		localStorage.setItem('cd_notifications_settings', JSON.stringify(settings));
	}

	function createTransitionObject() {
		if (settings.transition == 'left') {
			transitionObject = { duration: 200, easing: quintOut, x: 500 };
		} else if (settings.transition == 'right') {
			transitionObject = { duration: 200, easing: quintOut, x: -500 };
		} else if (settings.transition == 'top') {
			transitionObject = { duration: 200, easing: quintOut, y: 500 };
		} else {
			transitionObject = { duration: 200, easing: quintOut, y: -500 };
		}
	}

	function handleVisibilityChange() {
		if (document.hidden) {
			hidden = true;
		} else hidden = false;
	}

	function removeNotification(checksum: string) {
		delete notifications[checksum];
		Log('Deleted notification => ' + checksum, 'info', debug_mode);
		return;
	}

	function clear_history() {
		history = {};
		Log('Cleared notification history', 'info', debug_mode);
		return;
	}

	function delete_history_notification(notification: NotificationObject) {
		delete history[notification.checksum];
		Log('Deleted history notification => ' + notification.checksum, 'info', debug_mode);
		return;
	}
	onMount(() => {
		document.addEventListener('visibilitychange', handleVisibilityChange);
		getSettingsFromLocalStorage();
		debug_mode = GENERAL.debug_mode;
	});

	$effect(() => {
		if (settings.transition) {
			createTransitionObject();
		}
	});
</script>

<svelte:head>
	{#if GENERAL.use_fontawesome}
		{#if GENERAL.fontawesome_kit && GENERAL.fontawesome_kit.length > 0}
			<link rel="stylesheet" href={GENERAL.fontawesome_kit} />
		{:else}
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
		{/if}
	{/if}
</svelte:head>
<svelte:window onmessage={handleMessage} />
{#if showSettings}
	<div id="settings-wrapper" transition:fade={{ duration: 300 }}>
		<Settings
			{debug_mode}
			bind:settings
			close={handleSettingsClose}
			show={handleShowNotifications}
			hide={handleHideNotifications}
			{history}
			{clear_history}
			{delete_history_notification} />
	</div>
{/if}

{#if showUi && !hidden}
	<div id="notifications-wrapper">
		<div
			class="notifications {settings.direction}"
			style="left:{settings.position.x}px; top:{settings.position.y}px">
			{#each Object.keys(notifications).map((key) => notifications[key]) as value (value.checksum)}
				<div animate:flip transition:fly={transitionObject}>
					<Notification
						message={deleteNotification}
						remove={removeNotification}
						notification={value}
						{debug_mode}></Notification>
				</div>
			{/each}
		</div>
	</div>
{/if}
