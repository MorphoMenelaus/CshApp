<template>

	<div>
		<h1 class="not-found centered">404</h1>
		<h2 class="centered">The page that was requested was not found.</h2>
		<h3 class="centered">
			<RouterLink to="/" title="Home">Take Me Home!</RouterLink>
		</h3>
	</div>

</template>

<script>
export default {
	name: "NotFound",
	props: {},
	components: {},
	data() {
		return {};
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1.not-found {
	font-size: 4em;
}

.centered {
	text-align: center;
}
</style>