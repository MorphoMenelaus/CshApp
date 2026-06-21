<script setup>
import { ref, onMounted } from 'vue';
// import Carousel from "../components/Carousel.vue";
// <Carousel v-if="appState?.isLoggedOn" :appState="appState" />

// Props & Emits
const props = defineProps({
	appState: Object,
})

let lessText = ref(false);

</script>

<template>
	<main class="roboto-body">
		<div id="main-home-layout">
			<div>
				<h1 id="name-title" class="julius-sans">Chris Hardwick</h1>
				<h2>Vue 3 &amp; Node.js Full-Stack Developer</h2>
				<div id="skills-list">
					<ul>
						<li>Responsive Web Design</li>
						<li>Full-Stack Development</li>
						<li>HTML5</li>
						<li>CSS3</li>
						<li>JavaScript ES6</li>
						<li>Vue 3</li>
						<li>NodeJS</li>
						<li>REST APIs</li>
					</ul>
					<ul>
						<li>SQL</li>
						<li>C#</li>
						<li>SQL</li>
						<li>Web Application Development</li>
						<li>Single Page Applications (SPA)</li>
						<li>ADA compliant design</li>
						<li>Godot</li>
					</ul>
				</div>
			</div>
			<div id="latest-summary">
				<h1 class="julius-sans">Latest Accomplishments</h1>
				<h2>Web Application Developer | Makrö Gaming Studios</h2>
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
				<Button class="btn" @click="lessText ? lessText = false : lessText = true">{{ lessText ? 'Fewer' :
					'More'
				}} Details</Button>
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
		</div>
	</main>
</template>

<style scoped>
#view {
	margin: 15px auto;
	padding: 15px;
	width: 80%;
}

main#view {
	position: relative;
	padding-bottom: 110px;
	z-index: -1;
}

#view.mobile {
	margin: 0;
	padding: 0;
	width: 100%;
}

#main-home-layout {
	width: 98%;
	margin: 15px auto;
}

#name-title {
	font-size: 4em;
}

#latest-summary {
	background-color: #000;
	padding: 15px;
	font-size: 1.25em;
	border: 1px #555 solid;
	border-radius: 12px;
}

#latest-details {
	margin-top: 30px;
}

#latest-details ul {
	margin-bottom: 30px;
}

h1,
h2 {
	text-align: center;
}

h1 {
	font-size: 2.5em;
}

h2 {
	font-size: 2em;
}

p {
	margin: 15px auto;
	text-indent: 30px;
}

#skills-list {
	display: flex;
	justify-content: space-evenly;
	margin: 30px auto;
	font-size: 1.25em;
}

.details-ul {
	background-color: #1c2138;
	padding: 15px;
	margin-bottom: 30px;
	border-radius: 0 0 8px 8px;
}

.details-ul h3 {
	background-color: #112;
	padding: 15px;
	position: relative;
	top: -15px;
	left: -15px;
	color: #fff;
	width: calc(100% + 30px);
	border: 1px #444 solid;
	border-radius: 8px 8px 0 0;
}

@media (max-width: 767px) {}

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

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {
	#main-home-layout {
		width: 85%;
	}
}
</style>
