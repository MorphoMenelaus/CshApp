<template>

	<header>
		<div id="serverInfo">
			<small class="version" v-if="serverVersion">Server Version: {{ serverVersion }}</small>
			<small class="appVersion" v-if="this.appCurrentVersion">App Version: {{ this.appCurrentVersion }}</small>
		</div>
		<div v-if="statusArray.length > 0" id="notifications">
			<div class="status-message" v-for="(item, index) in statusArray" :key="index"
				:class="item.success ? 'ok' : 'error'">
				<button @click="closeNotification(item)" class="close-notification" title="Close This Notification">❌</button>
				<span v-if="item.code != null">{{ item.code }}</span>
				<span v-if="item.message != null">{{ item.message }}</span>
				<span v-if="item.eventTimeDisplay != null">{{ item.eventTimeDisplay }}</span>
			</div>
		</div>

		<MainNavbar :appState="appState" />

		<!-- <h1>Welcome</h1> -->

		<div id="clock">
			<div id="time-container">
				<span id="time">{{ timeLocal }}</span>
			</div>
			<div id="date-container">
				<span id="dayLong">{{ dayLocal }}</span><br />
				<span id="dateLong">{{ dateLocal }}</span>
			</div>
		</div>

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
		appState: {
			type: Object,
		},
		serverVersion: {
			type: String,
		},
	},
	data() {
		return {
			appStatus: Object.assign({}, this.appStatus),
			statusArray: [],
			dayLocal: "",
			dateLocal: "",
			timeLocal: "",
			messageTimeout: 0
		};
	},
	watch: {
	},
	created() {
		this.updateDateTime();
		this.eventBus.on("updateStatus", (message) => {
			let notification = Object.assign({}, this.appStatus);
			notification.code = message?.code;
			notification.message = message?.message;
			notification.success = message?.success;
			let date = new Date();
			notification.expireTime = date.getTime() + 15000;
			notification.eventTimeDisplay = date.toLocaleTimeString();
			this.statusArray.push(notification);
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
#serverInfo {
	position: absolute;
	display: flex;
	flex-direction: column;
	top: 0;
	left: 0;
	padding: 5px 15px;
	z-index: 500;
}

#clock {
	position: absolute;
	top: 10px;
	right: 15px;
	min-width: 6em;
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
	top: 15px;
	left: 15px;
	z-index: 5000;
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
	padding: 0 0 2px 1px;
	font-size: 1.1em;
	border-radius: 6px;
	cursor: pointer;
}
</style>
