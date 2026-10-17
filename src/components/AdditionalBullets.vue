<template>
	<ul id="cover-bullets">
		<li>
			<strong>Development Versatility:</strong> Offering 15+ years of cross-functional tech experience, spanning from early Software QA at Apple to
			designing and building complex, data-driven single-page applications.
		</li>
		<li>
			<strong>Adaptive Frontend Expertise:</strong> Deeply proficient in modern UI architecture (Vue 3, TypeScript, Vite), leveraging an intuitive grasp
			of component lifecycle and state management to rapidly expand my skill set into modern React frameworks.
		</li>
		<li>
			<strong>Hybrid Design & Architecture:</strong> Blending an extensive background in graphic design and mobile-first intrinsic layout design
			(CSS&nbsp;Grid/Flexbox, container queries) with strict engineering practices, ensuring pixel-perfect delivery without compromising backend API
			efficiency.
		</li>
		<li>
			<strong>Proven Backend Engine:</strong> Bringing strong, production-tested proficiency in Node.js, Express.js, and SQL database optimization to
			drive multi-tenant enterprise applications and robust role-based access control systems.
		</li>
	</ul>
</template>

<style scoped>
#cover-bullets {
	/* margin-top: 1em; */
}

h2 {
	text-align: center;
	font-size: 1.5em;
	font-weight: bold;
}

strong {
	font-size: 130%;
	font-weight: bold;
}

li {
	margin-top: 1em;
	/* margin-bottom: 1em; */
}

li::marker {
	display: inline-block;
	transform: translateY(-3px);
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
