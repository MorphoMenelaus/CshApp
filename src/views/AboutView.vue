<script setup>
import { inject } from "vue";
import urls from "../dependencies/commonUrls.json";
import Disclaimers from "../components/Disclaimers.vue";
import PrivacyDisclaimer from "../components/PrivacyDisclaimer.vue";
import TaglineBox from "@/components/TaglineBox.vue";

const appCurrentVersion = inject("appCurrentVersion");

const props = defineProps({
	appState: Object,
	serverVersion: String,
	isMobile: Boolean,
});

const sendAnalyticsEvent = inject("sendAnalyticsEvent", () => {
	console.warn("Global function not found! sendAnalyticsEvent()");
});
const contactEmail = inject("contactEmail", () => {
	console.warn("Global function not found! contactEmail()");
});

const copyright = `Copyright &copy;${new Date().getFullYear()} Chris Hardwick, All Rights Reserved.`;
</script>

<template>
	<div>
		<div id="about">
			<div id="serverInfo" v-if="appState?.isLoggedOn">
				<small class="version" v-if="serverVersion"
					>Server Version: <span>{{ serverVersion }}</span></small
				>
				<small class="appVersion" v-if="appCurrentVersion"
					>App Version: <span>{{ appCurrentVersion }}</span></small
				>
			</div>
			<RouterLink class="about-img" to="/" title="Home" @click="closeDialogs('home_title')">
				<img src="/icons/CS20260822_256.png" alt="CSH App" />
			</RouterLink>
			<TaglineBox />
			<div class="btn-container top">
				<a
					class="btn csh-icon"
					:href="urls.hardwickDesign.url"
					:title="urls.hardwickDesign.title"
					target="_blank"
					@click="sendAnalyticsEvent('hardwick_design', 'hardwick_design_link')"
					>Personal Website</a
				>
				<a class="btn email-icon" @click="contactEmail(true)" title="Contact Me">Contact Me</a>
				<a
					class="btn linkedin-icon"
					:href="urls.linkedin.url"
					:title="urls.linkedin.title"
					target="_blank"
					@click="sendAnalyticsEvent('linkedin', 'linkedin_link')"
					>Linkedin Profile</a
				>
			</div>
			<div id="profile">
				<h2 class="julius-sans profile">Professional Profile</h2>
				<p>
					Chris is a creative and experienced website and web application developer with over 10 years of experience creating UI excellence and fluid
					User Experiences. Chris engineers modern responsive web environments using technologies that engage users in an intuitive, clean connection
					to well structured data.
				</p>
				<p>
					Since modern website layouts are necessarily visual and eye-catching, Chris' graphic design talents blend together perfectly with coding
					precision to create memorable user interfaces.
				</p>
				<p>
					Chris' focus on teamwork and communication makes him a valuable asset for any team wanting to design and complete a project beautifully or
					can work independently as required.
				</p>
			</div>
			<Disclaimers />
			<PrivacyDisclaimer />
		</div>
		<div id="copyright">
			<small v-html="copyright"></small>
		</div>
	</div>
</template>

<style scoped>
#view {
	margin: 15px auto;
	padding-bottom: 15px;
}

#about {
	width: 100%;
	margin: 15px auto;
	color: var(--vt-c-text-light-2);
	/* font-size: 18px; */
}

#about {
	width: 98%;
	margin: 15px auto;
	padding-bottom: 45px;
}

.about-img {
	display: flex;
	justify-content: center;
	justify-self: center;
	height: 64px;
	object-fit: contain;
	margin: 30px 0 15px;
}

.uiDarkMode #about {
	color: #aaa;
}

#available {
	position: absolute;
	top: -18px;
	left: 15px;
}

h1,
h2,
h3 {
	text-align: center;
}

h1 {
	font-size: 4em;
}

h2 {
	font-size: 2em;
}

h3 {
	font-size: 1.5em;
}

p {
	margin: 0 auto 15px;
	padding: 0 30px 15px;
	text-indent: 1.5em;
}

.profile {
	margin: 15px;
}

h2.profile {
	margin: 15px auto 0;
	font-size: 2em;
	/* font-weight: bold; */
}

#profile {
	color: #000;
	border: 1px solid #555;
	border-radius: 12px;
	padding: 15px 0;
	/* font-size: 1em; */
	margin: 15px auto;
	background-color: #e7e7e7;
}

#profile p {
	/* font-size: 1.15rem; */
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
	line-height: 1.5em;
	padding: 5px 15px;
	border: 1px #000 solid;
}

.btn-container.top {
	display: flex;
	flex-direction: row;
	justify-self: center;
	justify-content: space-evenly;
	align-items: baseline;
	width: 100%;
	margin: auto;
	font-size: 18px;
}

#copyright {
	text-align: center;
}

#serverInfo {
	position: absolute;
	display: flex;
	flex-direction: column;
	top: 0;
	right: 0;
	padding: 5px 15px;
	z-index: 500;
	font-size: 18px;
	text-align: right;
	background-color: rgb(0 133 255 / 40%);
	color: #fff;
	border-radius: 0 0 0 12px;
}

#serverInfo span {
	user-select: all;
}

a.btn.large {
	height: 2em;
	width: 15em;
	width: auto;
	font-size: 1.65em;
	padding-right: 72px;
	overflow: hidden;
	text-overflow: ellipsis;
}

.mobile .btn.email-icon,
.mobile .btn.csh-icon,
.mobile .btn.linkedin-icon {
	padding-right: 15px;
	text-align: center;
	margin: 0 5px;
}

.mobile .btn.email-icon::after,
.mobile .btn.csh-icon::after,
.mobile .btn.linkedin-icon::after {
	display: none;
}

.btn:hover::after {
	filter: brightness(0.8);
}

.large::after {
	width: 48px;
	height: 48px;
}

/* #about #disclaimers h3, */
#about #privacy h3 {
	font-size: 1.25em;
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
	.about-img {
		height: 128px;
	}

	#profile {
		padding: 15px;
		/* font-size: 1.25em; */
	}

	.btn.csh-icon,
	.btn.linkedin-icon {
		padding-right: 48px;
	}

	.csh-icon::after,
	.linkedin-icon::after,
	.email-icon::after {
		content: "";
		top: 4px;
		right: 10px;
		width: 28px;
		height: 28px;
	}

	.email-icon::after {
		top: 8px;
	}

	.linkedin-icon::after {
		border-radius: 2px;
		border: 1px #fff solid;
	}

	.btn.email-icon {
		padding-right: 45px;
	}

	.btn-container.top {
		width: 75%;
		margin-bottom: 30px;
	}
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
