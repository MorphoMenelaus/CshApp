<template>

	<header>
		<div id="serverInfo">
			<small class="version" v-if="serverVersion">Server Version: {{ serverVersion }}</small>
			<small class="appVersion" v-if="this.appCurrentVersion">App Version: {{ this.appCurrentVersion }}</small>
		</div>
		<!-- <div class="status-message" v-if="appStatus.code != null || appStatus.message != null"
			:class="!appStatus.ok ? 'error' : 'ok'">
			<span v-if="appStatus.code != null">{{ appStatus.code }}</span>
			<span v-if="appStatus.message != null">{{ appStatus.message }}</span>
			<span v-if="appStatus.userMustDismiss == true" id="dismiss-error">x</span>
		</div> -->

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
			dateOptions: this.dateOptions,
			timeOptions: this.timeOptions,
			dayLocal: "",
			dateLocal: "",
			timeLocal: "",
		};
	},
	watch: {
	},
	created() {
		this.updateDateTime();
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
			this.dateLocal = date.toLocaleDateString("en-US", this.dateOptions);
			this.timeLocal = date.toLocaleTimeString();
		},
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

.status-message {
	position: relative;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
}

.bank-status,
.status-message {
	position: absolute;
	top: 15px;
	left: 15px;
	padding: 10px 15px;
	border-radius: 6px;
	font-weight: 700;
	transition: background-color 0.3s ease, color 0.3s ease;
	z-index: 500;
}

.status-message.ok {
	background-color: #0f0;
	color: #000;
}

.status-message.error {
	background-color: #f00;
	color: #fff;
}

.status-message span {
	display: block;
}
</style>
