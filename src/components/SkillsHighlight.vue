<template>
	<div id="skills-list" class="stroke">
		<ul>
			<li>Vue 3</li>
			<li>Pinia / Vuex</li>
			<li>NodeJS / ExpressJS</li>
			<li>JavaScript</li>
			<li>HTML5</li>
			<li>CSS3</li>
			<li>REST API</li>
			<li class="mobile-show">WCAG / ADA accessibility</li>
		</ul>
		<ul>
			<li>SQL</li>
			<li>ChartJS</li>
			<li>Agile Development</li>
			<li>Single Page Applications</li>
			<li>Responsive Web Design</li>
			<li>Full-Stack Development</li>
			<li class="mobile-hide">WCAG / ADA accessibility</li>
		</ul>
	</div>
</template>

<style scoped>
#skills-list {
	display: flex;
	justify-content: space-around;
	/* align-items: center; */
	margin: 30px auto;
	font-size: 1.25em;
	width: 50%;
	padding: 0 30px;
	color: rgb(25 25 25);
}

.uiDarkMode #skills-list {
	color: inherit;
}

.mobile #skills-list {
	width: 100%;
}

.mobile-hide {
	display: none;
}

@media (max-width: 767px) {
	#skills-list {
		padding: 0;
	}
}

@media (min-width: 768px) {
}

@media (min-width: 992px) {
}

@media (min-width: 1200px) {
	.mobile-hide {
		display: list-item;
	}

	.mobile-show {
		display: none;
	}
}
</style>
