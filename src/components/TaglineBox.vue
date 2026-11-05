<script setup>
import { useRoute } from "vue-router";
import Available from "@/components/Available.vue";

const route = useRoute();
</script>

<template>
	<h1 :class="['julius-sans stroke name', { about: route.name === 'about' }]">
		<RouterLink to="/about" title="Chris Hardwick | Professional Profile" :disabled="route.name === 'about'">Chris Hardwick</RouterLink>
	</h1>
	<div id="tagline-box">
		<Available />
		<h2>Vue 3 &amp; Node.js Full-Stack Developer</h2>
		<h3>Web Application Developer</h3>
		<h3>Front-End Web Developer</h3>
		<span class="text-center map-pin">Atlanta, GA | On-site, Hybrid, Remote</span>
	</div>
</template>

<style scoped>
.about a:hover {
	background: unset;
	cursor: default;
}

h1,
h2,
h3 {
	text-align: center;
}

h1 {
	font-size: 3rem;
}

h2 {
	font-size: 1.75rem;
}

h3 {
	font-size: 1.4rem;
}

.name a {
	text-decoration: none;
	color: inherit;
}

a.name:hover h1 {
	color: #000;
}
.uiDarkMode a.name:hover h1 {
	color: #fff;
}

#tagline-box {
	position: relative;
	border: 1px #555 solid;
	background-color: aliceblue;
	padding: 15px 30px;
	border-radius: 12px;
	width: fit-content;
	margin: 15px auto 30px;
}

.uiDarkMode #tagline-box {
	background-color: #222;
}

.map-pin {
	position: relative;
	width: fit-content;
	margin: auto;
}

.map-pin::before {
	content: "";
	background: url(/icons/map_pin.png) 0 0 / contain no-repeat;
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
		font-size: 3.75rem;
	}
}

@media (min-width: 992px) {
	h1 {
		font-size: 4.25rem;
	}

	h2 {
		font-size: 2.25rem;
	}

	h3 {
		font-size: 1.75rem;
	}
}

@media (min-width: 1024px) {
	#tagline-box {
		margin: 0 auto 30px;
	}
}
</style>
