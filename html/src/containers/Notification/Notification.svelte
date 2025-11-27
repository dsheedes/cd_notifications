<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { NotificationIcon } from '../../lib/notification_icons';
	import { pSBC } from '../../vendor/psbc';
	import { contrast, luminance } from '../../vendor/colors';
	import { Log } from '../../lib/logger';
	let {
		notification = $bindable(),
		is_history,
		debug_mode,
		delete_history_notification,
		message,
		remove
	}: {
		notification: NotificationObject;
		is_history?: boolean;
		debug_mode: boolean | undefined;
		delete_history_notification?: (notification: NotificationObject) => void;
		message?: (checksum: string) => void;
		remove?: (checksum: string) => void;
	} = $props();

	let ignoreNextUpdate = false;

	let ttlString = $state('');
	let builtStyle: BuiltStyle | string = $state({
		class: '',
		notification: '',
		boxShadow: '',
		backgroundColor: '',
		title: '',
		message: '',
		icon: '',
		primary_color: '',
		secondary_color: ''
	});

	function dispatchDelete(): void {
		if (!message) return;

		message(notification.checksum);
		return;
	}

	builtStyle = buildStyleFromOptions(notification.options.style);

	onMount(() => {
		// Apply the progress bar with delay 0 to start the animation after render
		setTimeout(() => {
			ttlString =
				'transition: width ' + notification.options.duration + 's linear!important; width:0%;';
		}, 0);
	});

	// Handling timer reset when stacking occurs
	$effect(() => {
		if (ignoreNextUpdate) {
			ignoreNextUpdate = false;
			return;
		}

		if (notification.reset) {
			ttlString = 'width:100%';
			ignoreNextUpdate = true;
			setTimeout(() => {
				ttlString =
					'transition: width ' +
					notification.options.duration +
					's linear 0.1s!important; width:0%;';
			}, 100);

			notification.reset = false;
		}
	});
	onDestroy(() => {
		if (!remove) return;
		remove(notification.checksum);
	});

	function buildStyleFromOptions(
		style: NotificationStyle | undefined | string
	): BuiltStyle | string {
		const builtStyle = {
			class: '',
			notification: '',
			backgroundColor: '',
			boxShadow: '',
			title: '',
			message: '',
			icon: '',
			primary_color: '',
			secondary_color: ''
		};

		if (style == null) return builtStyle;

		if (style instanceof Object) {
			builtStyle.class = style.class ?? '';

			if (style.title) {
				builtStyle.title = style.title;
			}

			if (style.message) {
				builtStyle.message = style.message;
			}

			if (style.icon) {
				builtStyle.icon = style.icon;
			}

			if (style.backgroundColor) {
				builtStyle.backgroundColor = style.backgroundColor;

				// Calculate the values of primary and secondary colors for stacking
				// Primery color has 0.8 alpha, secondary 0.6 of background

				const temp_div = document.createElement('div');
				temp_div.style.backgroundColor = builtStyle.backgroundColor;
				document.body.appendChild(temp_div);
				const computedColor = getComputedStyle(temp_div).backgroundColor;
				document.body.removeChild(temp_div);

				const ripped = pSBC.pSBCr(computedColor);

				if (!ripped) {
					Log('Failed to parse color for notification styling.', 'warn', debug_mode);
					return builtStyle;
				}

				builtStyle.primary_color = `rgba(${ripped.r}, ${ripped.g}, ${ripped.b}, 0.8)`;
				builtStyle.secondary_color = `rgba(${ripped.r}, ${ripped.g}, ${ripped.b}, 0.6)`;

				if (luminance(ripped.r, ripped.g, ripped.b) < 0.5) {
					builtStyle.boxShadow = `inset 0px 0px 0px 1px ${pSBC(0.05, builtStyle.backgroundColor)}`;
				} else {
					builtStyle.boxShadow = `inset 0px 0px 0px 1px ${pSBC(-0.05, builtStyle.backgroundColor)}`;
				}

				if (builtStyle.title == '' && builtStyle.message == '') {
					const white_contrast = contrast([255, 255, 255], [ripped.r, ripped.g, ripped.b]);
					const black_contrast = contrast([0, 0, 0], [ripped.r, ripped.g, ripped.b]);

					if (white_contrast >= black_contrast) {
						builtStyle.title = 'color: white;';
						builtStyle.message = 'color: white;';

						if (builtStyle.icon == '') {
							builtStyle.icon = 'color: white; fill: white;';
						}
					} else {
						builtStyle.title = 'color: black;';
						builtStyle.message = 'color: black;';

						if (builtStyle.icon == '') {
							builtStyle.icon = 'color: black; fill: black;';
						}
					}
				}
			}
		} else {
			builtStyle.notification = style as unknown as string;
		}
		return builtStyle;
	}

	function handleDeleteNotification() {
		if (!is_history) return;
		if (!delete_history_notification) return;
		delete_history_notification(notification);
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	onclick={handleDeleteNotification}
	class="notification-wrapper {builtStyle instanceof Object
		? builtStyle.class
		: ''} {notification.type} {notification.options.stack
		? notification.stackAmount >= 3
			? 'notification-count-3'
			: notification.stackAmount == 2
				? 'notification-count-2'
				: 'notification-count-1'
		: ''} {builtStyle instanceof Object && (builtStyle.primary_color || builtStyle.secondary_color)
		? 'custom-stack'
		: ''}"
	style={builtStyle instanceof Object
		? `--notification-primary-color: ${builtStyle.primary_color}; --notification-secondary-color: ${builtStyle.secondary_color};`
		: ''}>
	<div
		class="notification-fields"
		style={builtStyle instanceof Object && builtStyle.notification.length > 0
			? builtStyle.notification
			: builtStyle instanceof Object
				? `background-color: ${builtStyle.backgroundColor}; box-shadow: ${builtStyle.boxShadow};`
				: ''}>
		{#if notification.options.stack && notification.stackAmount > 1}
			<div class="notification-counter">
				{notification.stackAmount}
				{window['LOCALE'].of_same_kind}
			</div>
		{/if}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="notification">
			{#if notification.options.fields.use_icon}
				<div class="notification-icon" style={builtStyle instanceof Object ? builtStyle.icon : ''}>
					{#if notification.options.icon}
						{#if notification.options.icon.startsWith('http')}
							<img src={notification.options.icon} alt="Notification Icon" />
						{:else if notification.options.icon.startsWith('<svg') && notification.options.icon.endsWith('</svg>')}
							{@html notification.options.icon}
						{:else}
							<i class={notification.options.icon}></i>
						{/if}
					{:else}
						{@html NotificationIcon[notification.type] || NotificationIcon['info']}
					{/if}
				</div>
			{/if}
			<div class="notification-content">
				{#if notification.options.fields.use_title}
					<div
						class="notification-title"
						style={builtStyle instanceof Object ? builtStyle.title : ''}>
						{notification.title}
					</div>
				{/if}
				{#if notification.options.fields.use_message}
					<div
						class="notification-message"
						style={builtStyle instanceof Object ? builtStyle.message : ''}>
						{#if notification.options.use_html}
							{@html notification.message}
						{:else}
							{notification.message}
						{/if}
					</div>
				{/if}
			</div>
		</div>
		<div
			class="notification-progress {!notification.options.use_progress || is_history
				? 'notification-progress-hide'
				: ''}"
			ontransitionend={dispatchDelete}
			style={!is_history ? ttlString : ''}>
		</div>
	</div>
</div>
