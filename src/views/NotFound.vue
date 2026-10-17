<script setup>
const copyright = inject("copyright");
</script>
<template>
	<main>
		<div class="centered">
			<h1>404</h1>
			<h2>Page Not Found</h2>
			<h3>
				<p>The link may be broken, or the file has been moved.</p>
				<router-link to="/" class="btn">Return to Homepage</router-link>
			</h3>
		</div>
		<div id="copyright">
			<small v-html="copyright"></small>
		</div>
	</main>
</template>

<style scoped>
h1 {
	font-size: 4em;
}

h2 {
	font-size: 1.8rem;
}

p {
	margin-bottom: 20px;
}

.centered {
	text-align: center;
}
</style>
