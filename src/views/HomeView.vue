<script setup>
import { ref, inject, onMounted, onUnmounted, nextTick } from "vue";
import urls from "@/dependencies/commonUrls.json";
import Disclaimers from "@/components/Disclaimers.vue";
import StockCharts from "@/components/StockCharts.vue";
import TaglineBox from "@/components/TaglineBox.vue";

const sendAnalyticsEvent = inject("sendAnalyticsEvent", () => {
	console.warn("Global function not found! sendAnalyticsEvent()");
});

const props = defineProps({
	appState: Object,
	isMobile: Boolean,
	windowWidth: Number,
});

const lessText = ref(false);
const showStocks = ref(false);
const targetElement = ref(null);
const showScrollButton = ref(false);
let observer = null;

const copyright = `Copyright &copy;${new Date().getFullYear()} Chris Hardwick, All Rights Reserved.`;

const scrollToId = (id) => {
	const element = document.getElementById(id);
	if (element) {
		element.scrollIntoView({
			behavior: "smooth",
			block: "start",
			inline: "nearest",
		});
	}
};

const scrollHomeLayout = () => {
	lessText.value = false;
	showStocks.value = false;
	scrollToId("view");
};
const showDetails = (id) => {
	lessText.value = lessText?.value ? false : true;
	setTimeout(() => {
		scrollToId(id);
	}, 200);
	sendAnalyticsEvent("show_details", "accomplishments");
};
const showStockDetails = (id) => {
	showStocks.value = showStocks?.value ? false : true;
	setTimeout(() => {
		scrollToId(id);
	}, 200);
	sendAnalyticsEvent("stock_charts", "details");
};

onMounted(async () => {
	await nextTick();
	observer = new IntersectionObserver(
		([entry]) => {
			showScrollButton.value = !entry.isIntersecting;
		},
		{
			root: document.getElementById("view"),
			threshold: 0.5,
		},
	);

	if (targetElement.value) {
		observer.observe(targetElement.value);
	}
});
onUnmounted(() => {
	if (observer) {
		observer.disconnect();
	}
});
</script>

<template>
	<main class="roboto-body">
		<div v-if="appState?.isLoggedOn && !appState?.permissions.verified" class="not-verified">
			<span>Not Verified. </span>
			<RouterLink class="unverified" to="/verify">Click to Verify Account</RouterLink>
		</div>

		<!-- <button v-if="showScrollButton" class="btn" @click="scrollHomeLayout()" id="scroll-top"><span>▽</span>&nbsp;Scroll to Top</button> -->

		<div id="main-home-layout" ref="targetElement">
			<div id="title-block">
				<div>
					<TaglineBox />
				</div>
				<div id="skills-list" class="stroke">
					<ul>
						<li>Vue 3</li>
						<li>Pinia &amp; Vuex</li>
						<li>NodeJS</li>
						<li>ExpressJS</li>
						<li>REST API</li>
						<li>HTML5</li>
						<li>CSS3</li>
						<li>JavaScript</li>
						<li class="mobile-show">WCAG / ADA accessibility principles</li>
					</ul>
					<ul>
						<li>SQL</li>
						<li>ChartJS</li>
						<li>C#</li>
						<li>Agile Development</li>
						<li>Single Page Applications</li>
						<li>Responsive Web Design</li>
						<li>Full-Stack Development</li>
						<li class="mobile-hide">WCAG / ADA accessibility principles</li>
					</ul>
				</div>
			</div>
			<div id="latest-summary">
				<h2 class="julius-sans">Latest Accomplishments</h2>
				<h3>Front-End Web Developer | Makrö Gaming Studios</h3>
				<p>
					I developed a full suite of Single Page Applications using the Vue 3 framework to accompany the video slots online game application
					ecosystem for Makrö Gaming Studios. I placed a strong emphasis on responsive clean design, interactivity and readability in order to present
					and effortlessly manage potentially complex functionality and data. The apps consist of an Admin App, Cashier App, Player App and Report App
					to facilitate all the behind-the-scenes functions and player facing needs in order to support the game client and the site administrators
					mostly through REST API calls to the game server.
				</p>
				<p>
					A robust role and permissions management system was implemented in each application that dynamically renders user interfaces and enables
					functions based on role/permissions. Authorization for Admin, HelpDesk, Cashier, Reporter, and Player all allow for different access and
					abilities.
				</p>
				<div class="btn-link-container">
					<button id="scroll-anchor" class="btn" @click="showDetails('latest-details')">
						<span v-if="!isMobile">{{ lessText ? "Fewer " : "More " }}</span
						>Details
						<span class="arrow" :class="lessText ? 'rotated' : ''">▽</span>
					</button>
					<RouterLink to="/resume" title="Chris Hardwick Resume" class="btn acrobat-icon" @click="sendAnalyticsEvent('download', 'resume_link')"
						>{{ isMobile ? "" : "Chris Hardwick " }}Resume</RouterLink
					>
					<a
						class="btn linkedin linkedin-icon"
						:href="urls.linkedin.url"
						:title="urls.linkedin.title"
						target="_blank"
						@click="sendAnalyticsEvent('linkedin', 'linkedin_link')"
						>Linkedin<span v-if="!isMobile">&nbsp;Profile</span>
					</a>
				</div>
				<Transition name="slide-down">
					<div v-if="appState?.appDevDuties?.length > 0 && lessText" id="latest-details">
						<div class="details-ul" v-for="(app, index) in appState.appDevDuties" :key="index">
							<h3 class="julius-sans">{{ app.appName }}:</h3>
							<ul>
								<li v-for="(li, index) in app.duties" :key="index">{{ li }}</li>
							</ul>
						</div>
					</div>
				</Transition>
				<div v-if="!appState?.appDevDuties?.length > 0">
					<h1>No results found. Please refresh your browser.</h1>
				</div>
			</div>

			<div id="stocks-container">
				<div id="charts-header">
					<h2 class="julius-sans" @click="showStockDetails('latest-stocks')" :title="`${showStocks ? 'Close' : 'Open'} Market Summary Graphs`">
						Market Summary Graphs
					</h2>
					<span v-if="!isMobile">(Using REST APIs & ChartJS)</span>
					<button id="stocks-anchor" class="btn" @click="showStockDetails('latest-stocks')">
						<span v-if="!isMobile">{{ showStocks ? "Close " : "Open " }}</span
						>Market Graphs
						<span class="arrow" :class="showStocks ? 'rotated' : ''">▽</span>
					</button>
				</div>
				<Transition name="slide-down">
					<div v-if="showStocks" id="latest-stocks">
						<StockCharts :appState="appState" :isMobile="isMobile" :windowWidth="windowWidth" />
					</div>
				</Transition>
			</div>

			<Disclaimers />
		</div>
		<div id="copyright">
			<small v-html="copyright"></small>
		</div>
	</main>
</template>

<style scoped>
#stocks-anchor.btn .arrow,
.btn-link-container .btn .arrow {
	display: inline-block;
	position: relative;
	right: -5px;
	font-weight: bold;
	transform: rotate(-90deg);
	transition: transform 0.4s ease-in-out;
}

#stocks-anchor.btn .arrow.rotated,
.btn-link-container .btn .arrow.rotated {
	transform: rotate(0deg);
}

#copyright {
	text-align: center;
}

h1,
h2,
#title-block h3,
#latest-summary > h3 {
	text-align: center;
}

h1 {
	font-size: 2.5em;
}

h2 {
	font-size: 1.75em;
}

h3 {
	font-size: 1.25em;
}

#charts-header h2 {
	font-size: 1.8em;
	font-weight: bold;
	cursor: pointer;
	transition: color 0.25s ease-in-out;
}

.uiDarkMode #charts-header h2 {
	font-weight: normal;
}

#charts-header h2:hover {
	color: #4c88ff;
}

p {
	margin: 15px auto;
	text-indent: 1.5em;
}

#view {
	width: 100%;
	margin: 15px auto;
	padding: 15px;
	/* position: absolute; */
	position: relative;
	inset: 0;
}

#main-home-layout {
	width: 98%;
	margin: 15px auto;
	padding-bottom: 45px;
}

#title-block {
	display: flex;
	font-size: 18px;
}

.mobile #title-block {
	flex-direction: column;
}

#stocks-container {
	margin-top: 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

#latest-summary,
#stocks-container {
	background-color: #e7e7e7;
	padding: 15px;
	border: 1px #555 solid;
	border-radius: 12px;
}

.uiDarkMode #latest-summary,
.uiDarkMode #stocks-container {
	background-color: #000;
}

#latest-summary > h3 {
	font-size: 1.25em;
}

#latest-summary > h2 {
	font-weight: bold;
}

.uiDarkMode #latest-summary > h2 {
	font-weight: normal;
}

#latest-details {
	margin-top: 30px;
	overflow: hidden;
}

#latest-details ul {
	margin-bottom: 30px;
}

#skills-list {
	display: flex;
	justify-content: space-around;
	margin: 30px auto;
	font-size: 1.25em;
	width: 50%;
	padding: 0 30px;
	color: rgb(25 25 25);
}

.uiDarkMode #skills-list {
	color: inherit;
}

#charts-header {
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 95%;
}

#latest-stocks {
	overflow: hidden;
}

.mobile #skills-list {
	width: 100%;
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

.not-verified {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	color: #f00;
	text-align: center;
	font-weight: bold;
	text-transform: uppercase;
	z-index: 10000;
}

.btn-link-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.mobile .btn-link-container > * {
	margin: 5px 10px;
}

.mobile .btn span {
	right: 0;
}

.linkedin,
.acrobat-icon {
	display: inline-block;
	position: relative;
	right: 0;
	padding: 3px 15px 2px;
	border: 1px #000 solid;
	box-shadow: 1px 1px 0px #000;
}

.text-center {
	display: block;
	text-align: center;
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

#scroll-anchor,
#stocks-anchor,
.btn.acrobat-icon,
.btn.linkedin-icon {
	font-size: 0.8em;
	text-align: center;
}

.acrobat-icon::after,
.linkedin-icon::after {
	content: unset;
}

.mobile-hide {
	display: none;
}

#scroll-top {
	display: none;
}

#scroll-top span {
	transform: rotate(180deg);
	position: absolute;
	top: 0;
	left: 2px;
	font-size: 1.25em;
}

@media (max-width: 767px) {
	h2 {
		font-size: 1.5em;
	}

	h3 {
		font-size: 1.25em;
	}

	#skills-list {
		padding: 0;
	}
	#charts-header h2 {
		font-size: 1.5em;
	}
}

@media (min-width: 768px) {
	#scroll-top {
		display: inline-block;
		position: fixed;
		bottom: 80px;
		right: 30px;
	}

	.mobile-show {
		display: none;
	}

	.mobile-hide {
		display: list-item;
	}

	#scroll-anchor,
	#stocks-anchor,
	.btn.acrobat-icon,
	.btn.linkedin-icon {
		font-size: 1em;
	}

	#stocks-anchor.btn .arrow,
	.btn-link-container .btn .arrow {
		margin-left: 10px;
	}

	.btn.acrobat-icon,
	.btn.linkedin-icon {
		padding-right: 48px;
	}

	.acrobat-icon::after,
	.linkedin-icon::after {
		content: "";
		top: 4px;
		right: 10px;
		width: 26px;
		height: 26px;
	}

	.linkedin-icon::after {
		border-radius: 2px;
		border: 1px #fff solid;
	}

	.btn:hover::after {
		filter: brightness(0.8);
	}
}

@media (min-width: 992px) {
	#main-home-layout {
		width: 90%;
	}

	h2 {
		font-size: 2em;
	}

	h3 {
		font-size: 1.5em;
	}

	#latest-summary {
		padding: 30px 60px;
	}
}

@media (min-width: 1200px) {
	#main-home-layout {
		width: 80%;
	}
}

@media (min-width: 1800px) {
	#main-home-layout {
		width: 70%;
	}
}

@media (min-width: 2200px) {
	#main-home-layout {
		width: 60%;
	}
}
</style>
