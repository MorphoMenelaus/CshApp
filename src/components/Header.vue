<template>

	<header>
		<div v-if="statusArray.length > 0" id="notifications" :class="isMobile ? 'mobile' : ''">
			<div class="status-message" v-for="(item, index) in statusArray" :key="index"
				:class="item.success ? 'ok' : 'error'">
				<button @click="closeNotification(item)" class="close-notification"
					title="Close This Notification">❌</button>
				<span v-if="item.code != null">{{ item.code }}</span>
				<span v-if="item.message != null">{{ item.message }}</span>
			</div>
		</div>

		<div id="loading-icon" :class="showHideLoader ? 'loading' : ''">
			<div class="loader-icon"></div>
		</div>

		<div id="clock" v-if="!isMobile">
			<div id="time-container">
				<span id="time">{{ timeLocal }}</span>
			</div>
			<div id="date-container">
				<span id="dayLong">{{ dayLocal }}</span><br />
				<span id="dateLong">{{ dateLocal }}</span>
			</div>
		</div>

		<MainNavbar :appState="appState" :isMobile="isMobile" />

	</header>

</template>

<script>
import MainNavbar from "@/components/MainNavbar.vue";

export default {
	name: "Header",
	components: {
		MainNavbar
	},
	props: {
		appState: Object,
		serverVersion: String,
		isMobile: Boolean
	},
	data() {
		return {
			appNotify: Object.assign({}, this.appNotify),
			statusArray: [],
			dayLocal: "",
			dateLocal: "",
			timeLocal: "",
			messageTimeout: 0,
			showHideLoader: false
		};
	},
	watch: {
	},
	created() {
		this.updateDateTime();
		this.eventBus.on("updateStatus", (payload) => {
			let notification = Object.assign({}, this.appNotify);
			notification.code = payload?.code;
			notification.message = payload?.message;
			notification.success = payload?.success;
			let date = new Date();
			notification.expireTime = date.getTime() + 10000;
			notification.eventTimeDisplay = date.toLocaleTimeString();
			this.statusArray.push(notification);
		});
		this.eventBus.on("showHideLoader", payload => {
			this.showHideLoader = payload;
		});
	},
	mounted() {
		setInterval(() => {
			this.updateDateTime();
		}, 1000);
	},
	methods: {
		updateDateTime() {
			let date = new Date();
			this.dayLocal = date.toLocaleDateString('en-US', { weekday: 'long' });
			this.dateLocal = date.toLocaleDateString("en-US");
			this.timeLocal = date.toLocaleTimeString();
			if (this.statusArray.length > 0) this.removeStaleEvents();
			this.eventBus.emit("updateDateTime", {
				dayLocal: this.dayLocal,
				dateLocal: this.dateLocal,
				timeLocal: this.timeLocal
			});
		},
		removeStaleEvents() {
			let currentTime = new Date().getTime();
			let newArray = this.statusArray.filter(item => item.expireTime > currentTime);
			this.statusArray = newArray;
		},
		closeNotification(timeCode) {
			let newArray = this.statusArray.filter(item => item.expireTime !== timeCode.expireTime);
			this.statusArray = newArray;
		}
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header {
	color: var(--color-text);
}

#clock {
	position: absolute;
	top: 10px;
	left: 15px;
	min-width: 6em;
	z-index: 1000;
	user-select: none;
	font-size: 18px;
}

h1 {
	width: 100%;
	margin-top: 30px;
	text-align: center;
	font-size: 3em;
}

#notifications {
	display: flex;
	flex-direction: column;
	position: absolute;
	max-height: 90vh;
	top: 15px;
	left: 15px;
	overflow: hidden auto;
	z-index: 100200;
}

#notifications.mobile {
	top: 115px;
	display: contents;
}

.status-message {
	position: relative;
	display: flex;
	flex-flow: column nowrap;
	margin: 5px;
	padding: 10px 30px 10px 15px;
	border-radius: 6px;
	border: 1px #a1a1a1 solid;
	font-weight: 700;
	z-index: 100000;
}

.status-message.ok {
	background-color: #008000;
	color: #fff;
}

.status-message.error {
	background-color: #b02c2c;
	color: #fff;
}

.status-message span {
	display: block;
}

.close-notification {
	position: absolute;
	top: -10px;
	right: -10px;
	margin: 0;
	padding: 1px 2px 1px;
	font-size: 1.1em;
	border-radius: 6px;
	cursor: pointer;
}

#loading-icon {
	display: none;
	align-content: center;
	justify-content: center;
	position: fixed;
	top: 94px;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100vw;
	/* height: calc(100vh - 140px); */
	background: rgb(0 0 0 / 75%);
	z-index: 10000;
}

.loader-icon {
	height: 48px;
	width: 48px;
	border: 3px solid;
	border-radius: 100%;
	border-color: red white blue black;
	animation: loader 0.5s linear infinite;
}

#loading-icon.loading {
	display: grid;
}

@keyframes loader {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(359deg);
	}
}
</style>
