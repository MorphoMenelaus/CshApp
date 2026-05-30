<template>
	<header>
		<h1>Welcome</h1>
	</header>
	<div class="status-message" v-if="status.code != null || status.message != null"
		:class="!status.ok ? 'error' : 'ok'">
		<span v-if="status.code != null">{{ status.code }}</span>
		<span v-if="status.message != null">{{ status.message }}</span>
		<!-- <span v-if="status.userMustDismiss == true" id="dismiss-error">x</span> -->
	</div>
</template>

<script>
export default {
	name: "Header",
	props: {
		status: Object,
	},
	watch: {
	},
	methods: {
	},
	created() {
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
	text-align: center;
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
