<script lang="ts">
	import Notification from '../Notification/Notification.svelte';

	let {
		debug_mode,
		history,
		history_close,
		history_switch,
		clear_history,
		delete_history_notification
	}: {
		debug_mode: boolean;
		history: { [key: string]: NotificationObject };
		history_close: () => void;
		history_switch: () => void;
		clear_history: () => void;
		delete_history_notification: (notification: NotificationObject) => void;
	} = $props();
</script>

<div id="notifications-wrapper">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div id="toggle-buttons">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div onclick={history_switch} class="top-button">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-gear-fill"
				viewBox="0 0 16 16">
				<path
					d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
			</svg>
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div onclick={clear_history} class="top-button small">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-eraser-fill"
				viewBox="0 0 16 16">
				<path
					d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
			</svg>
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div onclick={history_close} class="top-button close small">
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
	<div class="notifications column history">
		{#each Object.values(history) as historyItem (historyItem.checksum)}
			<div>
				<Notification
					{delete_history_notification}
					notification={historyItem}
					{debug_mode}
					is_history={true}></Notification>
			</div>
		{/each}
	</div>
</div>

<style lang="scss">
	#toggle-buttons {
		z-index: 99999;
		left: 2rem;
		top: 2rem;
		gap: 1rem;

		position: absolute;

		display: flex;
		align-items: center;

		& > .top-button.small {
			padding: 0.75rem;
		}

		& > .top-button.close {
			background-color: #ff5d57;

			& > svg {
				fill: rgba(233, 236, 239, 1);
			}
		}
	}

	.history {
		height: 100%;
		overflow: auto;

		right: 0rem;
		&::-webkit-scrollbar-track {
			-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
			background-color: rgba(233, 236, 239, 1);
		}

		&::-webkit-scrollbar {
			width: 6px;
			background-color: rgba(233, 236, 239, 1);
		}

		&::-webkit-scrollbar-thumb {
			background-color: #333;
		}
	}
</style>
