<template>
	<footer>
		<div id="serverInfo">
			<small class="version" v-if="serverVersion">Server Version: <span>{{ serverVersion }}</span></small>
			<small class="appVersion" v-if="this.appCurrentVersion">App Version: <span>{{ this.appCurrentVersion
			}}</span></small>
		</div>
		<div class="center-flex">
			<h3 id="name-contact" title="Contact Me" @click="openThisModalCloseOthers()">{{ isMobile ? 'CSH' :
				'Chris&nbsp;Hardwick' }}</h3>
		</div>
		<div class="btn-container">
			<button title="Contact Me" class="btn" @click="openThisModalCloseOthers()">Contact Me</button>
		</div>
	</footer>
</template>

<script>
import { inject } from "vue";

export default {
	name: 'FooterMain',
	props: {
		serverVersion: String,
		isMobile: Boolean
	},
	data() {
		return {
			loginShowEvent: inject("loginShow"),
			registerUser: inject('registerUser'),
		}
	},
	methods: {
		openThisModalCloseOthers() {
			this.loginShowEvent(false);
			this.registerUser(false);
			this.eventBus.emit("contactEmail", true);
			this.sendAnalyticsEvent('contact_form_footer', 'contact_modal');
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 3em;
	align-content: center;
	background-color: #313b64;
	border-top: 1px #fff solid;
	color: var(--color-text);
}

h3 {
	text-align: center;
	color: #fff;
}

#serverInfo {
	position: absolute;
	display: flex;
	flex-direction: column;
	top: 0;
	left: 0;
	padding: 5px 15px;
	z-index: 500;
	font-size: 18px;
}

#serverInfo span {
	user-select: all;
}

.btn-container {
	position: absolute;
	right: 15px;
	top: 15px;
	font-size: 18px;
}

.btn-container button {
	font-size: 1em;
}

.center-flex {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

#name-contact {
	cursor: pointer;
	font-size: 1.25em;
}

#name-contact:hover {
	color: #f60;
}
</style>
