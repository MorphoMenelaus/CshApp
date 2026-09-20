<script setup>
import Available from "@/components/Available.vue";
</script>

<template>
	<h1 class="julius-sans stroke">Chris Hardwick</h1>
	<div id="tagline-box">
		<Available />
		<h2>Vue 3 &amp; Node.js Full-Stack Developer</h2>
		<h3>Web Application Developer</h3>
		<h3>Front-End Web Developer</h3>
		<span class="text-center map-pin">Atlanta, GA (Open to Hybrid / Remote)</span>
	</div>
</template>

<style scoped>
h1,
h2,
h3 {
	text-align: center;
}

h1 {
	font-size: 2.5em;
}

h2 {
	font-size: 1.5em;
}

h3 {
	font-size: 1.25em;
}

#tagline-box {
	position: relative;
	border: 1px #555 solid;
	background-color: #fff;
	padding: 15px 30px;
	border-radius: 8px;
	width: fit-content;
	margin: 0 auto 30px;
}

.uiDarkMode #tagline-box {
	background-color: #222;
}

#available {
	position: absolute;
	top: -18px;
	left: 15px;
}

.map-pin {
	position: relative;
	width: fit-content;
	margin: auto;
}

.map-pin::before {
	content: "";
	background: url(../icons/map_pin.png) 0 0 / contain no-repeat;
	width: 18px;
	height: 26px;
	position: absolute;
	top: 0;
	left: -20px;
}

.text-center {
	display: block;
	text-align: center;
}

@media (min-width: 768px) {
	h1 {
		font-size: 3.25em;
	}
}

@media (min-width: 992px) {
	h1 {
		font-size: 3.75em;
	}

	h2 {
		font-size: 2em;
	}

	h3 {
		font-size: 1.5em;
	}
}
</style>
