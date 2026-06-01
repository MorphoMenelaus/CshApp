<template>
	<footer>
		<h3>Csh App</h3>
	</footer>
</template>

<script>
export default {
	name: 'Footer',
	props: {
	}
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
}

h3 {
	text-align: center;
	color: #fff;
}
</style>
