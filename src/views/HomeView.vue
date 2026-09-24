<script setup>
import { ref, inject, onMounted, onUnmounted, nextTick } from "vue";
import { sendAnalyticsEvent } from "@/dependencies/csh-libs.js";
import urls from "@/dependencies/commonUrls.json";
import Disclaimers from "@/components/Disclaimers.vue";
import StockCharts from "@/components/StockCharts.vue";
import TaglineBox from "@/components/TaglineBox.vue";
import SkillsHighlight from "@/components/SkillsHighlight.vue";
import AppDevDuties from "@/components/AppDevDuties.vue";
import CoreTechStack from "@/components/CoreTechStack.vue";

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
				<SkillsHighlight />
			</div>
			<div id="latest-summary">
				<h2 class="julius-sans">Proactive Upskilling &amp; Latest Accomplishments</h2>
				<p>
					I build high-performance, interactive web applications with clean architecture and seamless user experiences. Most recently,
					I&nbsp;engineered a full suite of four interconnected Single Page Applications using Vue 3 for Makrö Gaming Studios, managing complex
					dashboards and dynamic, role-based permission systems backed by relational databases via REST APIs.
				</p>
				<p>
					Motivated by a commitment to self-driven upskilling and continuous growth, I have spent the past year expanding my engineering toolkit into
					robust full-stack development. I have transitioned into the React and TypeScript ecosystems, styling responsive interfaces with Tailwind
					CSS, and building scalable backend environments using Node.js and Express. I bridge the gap between beautiful client-side interactivity and
					secure server-side logic.
				</p>
				<CoreTechStack />
				<div class="btn-link-container">
					<button id="scroll-anchor" class="btn" @click="showDetails('latest-details')">
						<span v-if="!isMobile">{{ lessText ? "Fewer " : "More " }}</span
						>Details
						<span class="arrow" :class="lessText ? 'rotated' : ''">▽</span>
					</button>
					<a
						v-if="!isMobile"
						class="btn acrobat-icon"
						href="/pdf/ChrisHardwickResume2026-09nc.pdf"
						title="Download Chris Hardwick Resume PDF"
						download="ChrisHardwickResume2026.pdf"
						@click="sendAnalyticsEvent('download', 'resume_link_home')"
					>
						Download Resume
					</a>
					<RouterLink to="/resume" title="Chris Hardwick Resume" class="btn personal-icon" @click="sendAnalyticsEvent('resume_online', 'resume_link')"
						>Resume Page</RouterLink
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
						<AppDevDuties :appDevDuties="appState.appDevDuties" />
					</div>
				</Transition>
				<div v-if="!appState?.appDevDuties?.length > 0">
					<h1>No results found. Please refresh your browser.</h1>
				</div>
			</div>

			<!-- <div id="stocks-container">
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
			</div> -->

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

/* #stocks-container {
	margin-top: 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
} */

#latest-summary,
#stocks-container {
	background-color: #e7e7e7;
	padding: 1em;
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

#summary-flex {
	display: flex;
	flex-flow: row wrap;
}

.summary-inner {
	flex-basis: 70%;
}

#tech-stack {
	flex-basis: 30%;
}

#latest-details {
	margin-top: 30px;
	overflow: hidden;
}

#latest-details ul {
	margin-bottom: 30px;
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
	margin-top: 2em;
}

.mobile .btn-link-container > * {
	margin: 5px 10px;
}

.mobile .btn span {
	right: 0;
}

.linkedin,
.acrobat-icon,
.personal-icon {
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
.btn.linkedin-icon,
.btn.personal-icon {
	font-size: 0.8em;
	text-align: center;
}

.acrobat-icon::after,
.linkedin-icon::after,
.personal-icon::after {
	content: unset;
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

	#charts-header h2 {
		font-size: 1.5em;
	}
}

@media (min-width: 768px) {
	#latest-summary,
	#stocks-container {
		padding: 1em 2em;
	}

	#scroll-top {
		display: inline-block;
		position: fixed;
		bottom: 80px;
		right: 30px;
	}

	#scroll-anchor,
	#stocks-anchor,
	.btn.acrobat-icon,
	.btn.linkedin-icon,
	.btn.personal-icon {
		font-size: 1em;
	}

	#stocks-anchor.btn .arrow,
	.btn-link-container .btn .arrow {
		margin-left: 10px;
	}

	.btn.acrobat-icon,
	.btn.linkedin-icon,
	.btn.personal-icon {
		padding-right: 48px;
	}

	.acrobat-icon::after,
	.linkedin-icon::after,
	.personal-icon::after {
		content: "";
		top: 4px;
		right: 10px;
		width: 26px;
		height: 26px;
	}

	.personal-icon::after {
		top: 5px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 1px #eee solid;
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
	#latest-summary,
	#stocks-container {
		padding: 2em 4em;
	}

	#main-home-layout {
		width: 90%;
	}

	h2 {
		font-size: 2em;
	}

	h3 {
		font-size: 1.5em;
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
