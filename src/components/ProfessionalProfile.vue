<script setup>
import { inject } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
	isMobile: Boolean,
});

const route = useRoute();

const contactEmail = inject("contactEmail", () => {
	console.warn("Global function not found! contactEmail()");
});
</script>

<template>
	<h2 class="julius-sans center bold">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="32"
			height="32"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			className="h-4 w-4"
			aria-hidden="true"
		>
			<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
			<path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
			<path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
		</svg>
		Professional Profile
	</h2>
	<picture v-if="route.name === 'about'">
		<source type="image/webp" srcset="/icons/Chris_Hardwick_200.webp" />
		<source type="image/jpeg" srcset="/icons/Chris_Hardwick_200.jpg" />
		<img
			v-if="!isMobile"
			src="/icons/Chris_Hardwick_200.jpg"
			class="bio-pic"
			title="Contact Chris Hardwick, Front-End Web Developer"
			alt="Chris Hardwick, Web Designer"
			width="140"
			height="140"
			@click="contactEmail(true)"
		/>
	</picture>
	<p>
		Creative and experienced front-end and web application developer with over 10 years of experience building fluid, modern, responsive user experiences.
		Blending a strong background in graphic design, intuitive user interface architecture, and extensive experience in relational database optimization, I
		seamlessly integrate user connections to the data supporting modern web applications.
	</p>
	<p>
		With an approach rooted in mobile-first, intrinsic design, I start by building a lightweight, single-column layout for mobile. From there, I use CSS
		Grid and Flexbox to create fluid architectures that automatically adapt to changing viewports. Instead of relying solely on media queries at rigid
		device breakpoints, I use modern CSS functions like clamp(), min(), and max() for fluid typography and container queries for truly modular, responsive
		components.
	</p>
	<p>
		I treat media queries as a tool to enhance the layout when a design naturally breaks, while ensuring performance is optimized through responsive images
		using srcset to keep load times fast on any device.
	</p>
	<p>With a proven track record of collaborating across teams and working independently, I continue to launch successful, production web ecosystems.</p>
</template>

<style scoped>
.bio-pic {
	float: right;
	border-radius: 50%;
	display: flex;
	margin: 0em 0 1em 2em;
	border: 3px rgb(59 92 255 / 25%) solid;
	cursor: pointer;
}

svg {
	margin-bottom: -0.2em;
}

#about svg {
	width: 1em;
	height: 1em;
	margin-bottom: -0.1em;
}

#about h2 {
	font-size: 2em;
}

p {
	text-indent: 1.5em;
	margin-bottom: 0.5em;
}

.center {
	text-align: center;
}

.bold,
strong {
	font-weight: bold;
}
</style>
