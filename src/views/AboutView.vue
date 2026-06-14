<template>
	<div id="about">
		<h1>This is an about page</h1>
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
			magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
			commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
			nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
			anim id est laborum.</p>
	</div>
	<NumInputPad />
</template>

<script>
import NumInputPad from "@/components/NumInputPad.vue";

export default {
	components: {
		NumInputPad,
	},
	mounted() {
	},
	methods: {
	},
};
</script>

<style>
h1 {
	text-align: center;
}

#about {
	position: absolute;
	top: 94px;
	right: 0;
	bottom: 0;
	left: 0;
	height: calc(100vh - 154px);
	width: 100%;
	margin: 15px auto;
	padding: 15px 30px;
	background-color: #181818;
	/* z-index: 100000; */
}

@media (min-width: 1024px) {
	.about {
		min-height: 100vh;
		display: flex;
		align-items: center;
	}
}
</style>
``