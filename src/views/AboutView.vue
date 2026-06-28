<template>
	<div>
		<div id="about">
			<h1 class="julius-sans">Chris Hardwick</h1>
			<div class="tagline-box">
				<h2>Vue 3 &amp; Node.js Full-Stack Developer</h2>
				<h3>Web Application Developer</h3>
				<h3>Front-End Web Developer</h3>
			</div>
			<div class="btn-container top">
				<a class="btn linkedin" href="https://www.linkedin.com/in/cs-hardwick"
					title="Chris Hardwick | Linkedin Profile" target="_blank">Linkedin Profile</a>
				<button class="btn" @click="eventBus.emit('contactEmail', true)">Contact Me</button>
			</div>
			<div id="profile">
				<h2 class="julius-sans profile">Professional Profile</h2>
				<p>
					Chris is a creative and experienced website and web application developer with over 10 years of
					experience
					creating UI excellence and fluid User Experiences. Chris engineers modern responsive web
					environments
					using
					technologies that engage users in an intuitive, clean connection to well structured data.</p>
				<p>
					Since modern website layouts are necessarily visual and eye-catching, Chris' graphic design talents
					blend
					together perfectly with coding precision to create memorable user interfaces.</p>
				<p>
					Chris' focus on teamwork and communication makes him a valuable asset for any team wanting to design
					and
					complete a project beautifully or can work independently as required.
				</p>
			</div>
			<Disclaimers />
		</div>
	</div>
</template>

<script>
import Disclaimers from "../components/Disclaimers.vue";

export default {
	components: {
		Disclaimers
	},
	mounted() {
	},
	methods: {
	},
};
</script>

<style scoped>
#about {
	/* position: absolute;
	top: 84px;
	right: 0;
	bottom: 0;
	left: 0; */
	/* height: calc(100vh - 150px); */
	width: 100%;
	margin: 15px auto;
	/* padding: 15px 30px 100px; */
	/* background-color: var(--vt-c-white-mute); */
	color: var(--vt-c-text-light-2);
	/* z-index: -1; */
	font-size: 18px;
}

#about {
	width: 98%;
	margin: 15px auto;
	padding-bottom: 45px;
}


.uiDarkMode #about {
	/* background-color: #181818; */
	color: #aaa;
}

h1,
h2,
h3 {
	text-align: center;
}

h1 {
	font-size: 4em;
	/* font-weight: bold; */
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

.profile {
	margin: 15px;
}

h2.profile {
	margin: 15px auto 0;
	font-size: 1.5em;
}

#profile {
	/* background-color: #ccc; */
	color: #000;
	border: 1px solid #555;
	border-radius: 12px;
	padding: 15px;
	font-size: 1.25em;
	margin: 15px auto;
	background-color: #e7e7e7;
	/* width: 80%; */
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
	font-size: .75em;
	line-height: 1.5em;
	padding: 5px 15px;
	border: 1px #000 solid;
}

.btn-container.top {
	display: flex;
	flex-direction: row;
	justify-self: center;
	justify-content: space-evenly;
	width: 100%;
	margin: auto;
	font-size: 18px;
}

.tagline-box {
	border: 1px #555 solid;
	background-color: #fff;
	padding: 15px 30px;
	border-radius: 8px;
	width: fit-content;
	margin: 0 auto 30px;
}

.uiDarkMode .tagline-box {
	background-color: #222;
}

@media (max-width: 767px) {
	h1 {
		font-size: 2.5em;
	}

	h2 {
		font-size: 1.5em;
	}

	h3 {
		font-size: 1.25em;
	}
}

@media (min-width: 768px) {
	.btn-container.top {
		width: 50%;
	}
}

@media (min-width: 992px) {
	#about {
		width: 90%;
	}
}

@media (min-width: 1200px) {
	#about {
		width: 85%;
	}
}

@media (min-width: 1024px) {
	/* .about {
		min-height: 100vh;
		display: flex;
		align-items: center;
	} */
}

@media (min-width: 992px) {
	#about {
		width: 90%;
	}
}

@media (min-width: 1200px) {
	#about {
		width: 80%;
	}
}

@media (min-width: 1800px) {
	#about {
		width: 70%;
	}
}

@media (min-width: 2200px) {
	#about {
		width: 60%;
	}
}
</style>
``