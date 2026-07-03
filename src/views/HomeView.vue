<script setup>
import { ref, onMounted, inject } from 'vue';
import Disclaimers from "../components/Disclaimers.vue";

const sendAnalyticsEvent = inject('sendAnalyticsEvent', () => {
	console.warn('Global function not found! sendAnalyticsEvent()')
});

// import Carousel from "../components/Carousel.vue";
// <Carousel v-if="appState?.isLoggedOn" :appState="appState" />

// Props & Emits
const props = defineProps({
	appState: Object,
})

let lessText = ref(false);

const targetSection = ref(null);

const copyright = `Copyright &copy;${new Date().getFullYear()} Chris Hardwick, All Rights Reserved.`;

const scrollToId = (id) => {
	const element = document.getElementById(id)
	if (element) {
		element.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}
}

const showDetails = (id) => {
	lessText?.value ? lessText.value = false : lessText.value = true;
	scrollToId(id);
	sendAnalyticsEvent('show_details', 'accomplishments');
}
</script>

<template>
	<main class="roboto-body">

		<div v-if="appState?.isLoggedOn && !appState?.permissions.verified" class="not-verified">
			<span>Not Verified. </span>
			<RouterLink class="unverified" to="/verify">Click to Verify Account</RouterLink>
		</div>

		<div id="main-home-layout">
			<div id="title-block">
				<div>
					<h1 id="name-title" class="julius-sans">Chris Hardwick</h1>
					<div class="tagline-box">
						<h2>Vue 3 &amp; Node.js Full-Stack Developer</h2>
						<h3>Web Application Developer</h3>
						<h3>Front-End Web Developer</h3>
					</div>
				</div>
				<div id="skills-list">
					<ul>
						<li>Vue 3</li>
						<li>Vuex</li>
						<li>NodeJS</li>
						<li>REST API</li>
						<li>HTML5</li>
						<li>CSS3</li>
						<li>JavaScript ES6</li>
					</ul>
					<ul>
						<li>C#</li>
						<li>SQL</li>
						<li>Single Page Applications</li>
						<li>Responsive Web Design</li>
						<li>Full-Stack Development</li>
						<li>ADA compliant design</li>
						<li>Godot</li>
					</ul>
				</div>
			</div>
			<div id="latest-summary">
				<h2 class="julius-sans">Latest Accomplishments</h2>
				<h3>Web Application Developer | Makrö Gaming Studios</h3>
				<p>
					I developed a full suite of Single Page Applications using the Vue 3 framework to accompany the
					video
					slots
					game application ecosystem for Makrö Gaming Studios. I placed a strong emphasis on responsive clean
					design,
					interactivity and readability in order to present and effortlessly manage potentially complex
					functionality
					and data. The apps consist of an Admin App, Cashier App, Player App and Report App to facilitate all
					the
					behind-the-scenes functions and player facing needs in order to support the game client and the site
					administrators mostly through REST API calls to the game server.
				</p>
				<p>
					A robust role and permissions management system was implemented in each application that dynamically
					renders
					user interfaces and enables functions based on role/permissions. Authorization for Admin, HelpDesk,
					Cashier,
					Reporter, and Player all allow for different access and abilities.
				</p>
				<div class="btn-link-container">
					<Button id="scroll-anchor" class="btn" @click="showDetails('scroll-anchor')">{{ lessText ? 'Fewer' :
						'More'
					}} Details</Button>
					<a class="btn linkedin" href="https://www.linkedin.com/in/cs-hardwick"
						title="Chris Hardwick | Linkedin Profile" target="_blank"
						@click="sendAnalyticsEvent('linkedin', 'linkedin_link')">Linkedin Profile</a>
				</div>
				<div v-if="lessText" id="latest-details">
					<div class="details-ul">
						<h3 class="julius-sans">Admin App:</h3>
						<ul>
							<li>Allows casino administrators to manage casinos and to view and set game settings.</li>
							<li>Admins can enable or disable any games, game types or pay tiers.</li>
							<li>Admins can review all game history, logs and player account status.</li>
							<li>Admins can review each individual game play, showing the reels spin, bonus games, and
								payouts for each line to help with dispute resolution.</li>
							<li>Game play history can be filtered by game name and date/time range.</li>
						</ul>
					</div>
					<div class="details-ul">
						<h3 class="julius-sans">Cashier App:</h3>
						<ul>
							<li>Handles all cash-in/cash-out requirements of the players. All cash-in is immediately
								playable in any game in the system.</li>
							<li>View the transaction history for each player account.</li>
							<li>Prints receipts to a connected receipt printer.</li>
							<li>Displays and prints each cashier’s bank transaction totals, and starting and ending cash
								for
								the shift.</li>
						</ul>
					</div>
					<div class="details-ul">
						<h3 class="julius-sans">Player App:</h3>
						<ul>
							<li>Register new accounts and verify email address or phone number depending on rules set by
								the
								site administrator.</li>
							<li>Verify player identification in jurisdictions where this is required.</li>
							<li>Generate QR code on the player mobile app for Cashiers to scan to authorize funds
								transfers
								for the player’s account.</li>
						</ul>
					</div>
					<div class="details-ul">
						<h3 class="julius-sans">Report App:</h3>
						<ul>
							<li>All reports can be filtered by various parameters and date/time range.</li>
							<li>Game performance data tables to document individual game performance.</li>
							<li>Casino payout liability reports.</li>
							<li>Shows all active players and stats.</li>
						</ul>
					</div>
				</div>
			</div>
			<Disclaimers />
		</div>
		<div id="copyright">
			<small v-html="copyright"></small>
		</div>
	</main>
</template>

<style scoped>
#copyright {
	text-align: center;
}

h1,
h2,
#title-block h3,
#latest-summary>h3 {
	text-align: center;
}

h1 {
	font-size: 2.5em;
}

h2 {
	font-size: 2em;
}

h3 {
	font-size: 1.5em;
}

p {
	margin: 15px auto;
	text-indent: 30px;
}

#view {
	/* position: relative; */
	width: 100%;
	margin: 15px auto;
	padding: 15px;
	/* padding-bottom: 110px; */
	/* z-index: -1; */
	position: absolute;
	inset: 0;
}

#view.mobile {
	/* margin: 0;
	padding: 0; */
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

#name-title {
	font-size: 4em;
	/* font-weight: bold; */
}

.uiDarkMode #name-title {
	font-weight: normal;
}


#latest-summary {
	background-color: #e7e7e7;
	padding: 15px;
	/* font-size: 1.25em; */
	border: 1px #555 solid;
	border-radius: 12px;
}

.uiDarkMode #latest-summary {
	background-color: #000;
}

#latest-summary>h3 {
	font-size: 1.25em;
}

#latest-summary>h2 {
	font-weight: bold;
}

.uiDarkMode #latest-summary>h2 {
	font-weight: normal;
}

#latest-details {
	margin-top: 30px;
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
}

.mobile #skills-list {
	/* flex-direction: column; */
	width: 100%;
}

.details-ul h3 {
	position: relative;
	top: -15px;
	left: -15px;
	width: calc(100% + 30px);
	padding: 15px;
	background-color: #c1c1c1;
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
}

.linkedin {
	display: inline-block;
	position: relative;
	right: 0;
	font-size: .75em;
	padding: 3px 15px 2px;
	border: 1px #000 solid;
	box-shadow: 1px 1px 0px #000;
}

@media (max-width: 767px) {
	#name-title {
		font-size: 2.5em;
	}

	h2 {
		font-size: 1.5em;
	}

	h3 {
		font-size: 1.25em;
	}

	#skills-list {
		padding: 0;
	}
}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {
	/* #main-home-layout {
		width: 95%;
	} */
}

@media (min-width: 992px) {
	#main-home-layout {
		width: 90%;
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
