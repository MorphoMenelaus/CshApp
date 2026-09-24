<script setup>
defineProps({
	appDevDuties: Object,
});
</script>
<template>
	<h2 class="julius-sans" title="Single Page Applications suite for Makrö Gaming Studios">SPA suite for Makrö Gaming Studios</h2>
	<hr />
	<div class="details-ul" v-for="(app, index) in appDevDuties" :key="index">
		<h3 class="julius-sans">{{ app.appName }}:</h3>
		<ul>
			<li v-for="(li, index) in app.duties" :key="index">{{ li }}</li>
		</ul>
	</div>
</template>

<style scoped>
h2 {
	margin: 0.75em auto 0.5em;
	text-align: center;
	font-size: 1.75em;
	font-weight: bold;
}

hr {
	margin-bottom: 1em;
}

.details-ul h3 {
	position: relative;
	top: -15px;
	left: -15px;
	width: calc(100% + 30px);
	padding: 15px;
	background-color: #d5d5d5;
	color: #444;
	font-size: 1.25em;
	font-weight: bold;
	border: 1px #444 solid;
	border-radius: 8px 8px 0 0;
}

.uiDarkMode .details-ul h3 {
	color: #fff;
	background-color: #112;
}

.details-ul {
	background-color: #fff;
	padding: 15px;
	margin-bottom: 30px;
	border-radius: 0 0 8px 8px;
}

.uiDarkMode .details-ul {
	background-color: #1c2138;
}
</style>
