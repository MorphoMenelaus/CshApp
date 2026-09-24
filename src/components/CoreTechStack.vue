<template>
	<div id="tech-stack">
		<h2 class="julius-sans">
			Core Tech Stack
			<i class="icon devicon-htmx-plain" title="HTML5"></i>
			<i class="icon devicon-javascript-plain" title="JavaScript"></i>
			<i class="icon devicon-css3-plain" title="CSS3"></i>
			<i class="icon devicon-chartjs-plain" title="ChartJS"></i>
		</h2>
		<hr />
		<div class="ul-grid">
			<div>
				<div class="card">
					<h4>Frontend Ecosystem</h4>
					<ul>
						<li>Vue 3</li>
						<li>Vuex / Pinia</li>
						<li>React (Recent)</li>
						<li>TypeScript (Recent)</li>
						<li>JavaScript (ES6+)</li>
						<li>HTML5 / CSS3</li>
					</ul>
				</div>
			</div>
			<div>
				<div class="card">
					<h4>Backend &amp; Databases</h4>
					<ul>
						<li>Node.js (Recent)</li>
						<li>Express.js (Recent)</li>
						<li>RESTful APIs</li>
						<li>Relational Databases (SQL)</li>
					</ul>
				</div>
			</div>
			<div>
				<div class="card">
					<h4>UI &amp; Styling</h4>
					<ul>
						<li>Tailwind CSS (Recent)</li>
						<li>Responsive Web Design</li>
						<li>Clean &amp; Readable UI Design</li>
					</ul>
				</div>
			</div>
			<div>
				<div class="card">
					<h4>Tools &amp; Architecture</h4>
					<ul>
						<li>Git / Version Control</li>
						<li>Single Page Applications (SPAs)</li>
						<li>Role-Based Access Control (RBAC)</li>
						<li>State Management</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
#tech-stack {
	margin-bottom: 1.5em;
}

h2 {
	font-size: 1.75em;
	font-weight: bold;
	text-align: center;
	margin: 1em auto 0.5em;
}

h4 {
	font-weight: bold;
	text-transform: uppercase;
	/* font-size: 1.2em; */
}

.ul-grid {
	display: grid;
	gap: 0.75em;
	justify-items: center;
	margin: auto;
	width: fit-content;
	/* width: 100%; */
}

.ul-grid > div {
	width: 100%;
	height: 100%;
}

.card {
	height: 100%;
	padding: 1.2em;
	background-color: aliceblue;
	border-radius: 12px;
	border: 1px rgb(191 191 191 / 75%) solid;
}

.uiDarkMode .card {
	background-color: #333;
}

.icon {
	margin: 0 0.25em;
}

hr {
	margin-bottom: 1em;
}

@media (min-width: 768px) {
	.ul-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 1024px) {
	.ul-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 1400px) {
	.ul-grid {
		grid-template-columns: repeat(4, 1fr);
	}
}
</style>
