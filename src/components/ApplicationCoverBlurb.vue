<script setup></script>

<template>
	<div id="cover-blurb">
		<h2 class="julius-sans">Proactive Upskilling &amp; Latest Accomplishments</h2>
		<p>
			I build high-performance, interactive web applications and websites with clean architecture and seamless user experiences. Most recently, I
			engineered the data-driven frontend interfaces for a full suite of four interconnected Single Page Applications using the Vue 3 framework. Makrö
			Gaming Studios required those Vue apps to manage complex, dynamic dashboards and access relational databases via REST APIs and role-based permission
			systems.
		</p>
		<p>
			Motivated by a commitment to self-driven upskilling and continuous growth, I have spent the past year expanding my engineering toolkit into robust
			full-stack development. I have transitioned into the React and TypeScript ecosystems, styling responsive interfaces with Tailwind CSS, and building
			scalable backend environments using Node.js and Express.js. I bridge the gap between beautiful client-side interactivity and secure server-side
			logic.
		</p>
	</div>
</template>

<style scoped>
h2 {
	text-align: center;
	font-size: 1.5em;
	font-weight: bold;
}

p {
	margin: 15px auto;
	text-indent: 1.5em;
}

.uiDarkMode #cover-blurb > h2 {
	font-weight: normal;
}

@media (min-width: 768px) {
	h2 {
		font-size: 1.75em;
	}
}

@media (min-width: 992px) {
	h2 {
		font-size: 2em;
	}
}
</style>
