<template>
	<div id="about">
		<h1 class="julius-sans">Chris Hardwick</h1>
		<h2>Vue 3 &amp; Node.js Full-Stack Developer</h2>
		<h3>Web Application Developer</h3>
		<h3>Front-End Web Developer</h3>
		<h3 class="linkedin">
			<a class="btn" href="https://www.linkedin.com/in/cs-hardwick" title="Chris Hardwick | Linkedin Profile"
				target="_blank">Linkedin Profile</a>
		</h3>
		<div class="btn-container">
			<button class="btn" @click="eventBus.emit('contactEmail', true)">Contact Form</button>
		</div>
		<div id="profile">
			<h2 class="julius-sans profile">Professional Profile</h2>
			<p>
				Chris is a creative and experienced website and web application developer with over 10 years of
				experience
				creating UI excellence and fluid User Experiences. Chris engineers modern responsive web environments
				using
				technologies that engage users in an intuitive, clean connection to well structured data.</p>
			<p>
				Since modern website layouts are necessarily visual and eye-catching, Chris' graphic design talents
				blend
				together perfectly with coding precision to create memorable user interfaces.</p>
			<p>
				Chris' focus on teamwork and communication makes him a valuable asset for any team wanting to design and
				complete a project beautifully or can work independently as required.
			</p>
		</div>
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

<style scoped>
#about {
	position: absolute;
	top: 84px;
	right: 0;
	bottom: 0;
	left: 0;
	height: calc(100vh - 150px);
	width: 100%;
	margin: 15px auto;
	padding: 15px 30px;
	background-color: var(--vt-c-white-mute);
	color: var(--vt-c-text-light-2);
	;
	/* z-index: -1; */
}

.uiDarkMode #about {
	background-color: #181818;
	color: #aaa;
}

h1,
h2,
h3 {
	text-align: center;
}

h1 {
	font-size: 4em;
	font-weight: bold;
}

.uiDarkMode #about h1 {
	font-weight: normal;
}

h2 {
	font-size: 2em;
}

h3 {
	font-size: 1.5em;
}

p {
	/* text-indent: 30px; */
	margin: 0 auto 15px;
	padding: 0 30px 15px;
}

.linkedin {
	margin-top: 15px;
}

.profile {
	margin: 15px;
}

h2.profile {
	margin: 15px auto 0;
	font-size: 1.5em;
}

#profile {
	background-color: #ccc;
	color: #000;
	border: 1px solid #555;
	border-radius: 12px;
	padding: 15px;
	font-size: 1.25em;
	margin: 15px auto;
	width: 80%;
}

.uiDarkMode #profile {
	background-color: #000;
	color: #aaa;
}

.btn-container {
	margin: 15px auto;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5em;
}

.btn-container .btn {
	font-size: 1em;
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