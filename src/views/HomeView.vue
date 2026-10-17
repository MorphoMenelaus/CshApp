<script setup>
import { inject } from "vue";
import { sendAnalyticsEvent } from "@/dependencies/csh-libs.js";
import urls from "@/dependencies/commonUrls.json";
import Disclaimers from "@/components/Disclaimers.vue";
import TaglineBox from "@/components/TaglineBox.vue";
import SkillsHighlight from "@/components/SkillsHighlight.vue";
import ApplicationCoverBlurb from "@/components/ApplicationCoverBlurb.vue";
import AdditionalBullets from "@/components/AdditionalBullets.vue";
import CoreTechStack from "@/components/CoreTechStack.vue";

const props = defineProps({
	appState: Object,
	isMobile: Boolean,
	windowWidth: Number,
});

const contactEmail = inject("contactEmail");
const copyright = inject("copyright");
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
					<TaglineBox />
				</div>
				<SkillsHighlight />
			</div>
			<div id="latest-summary">
				<ApplicationCoverBlurb />
				<CoreTechStack />
				<AdditionalBullets />
				<div class="btn-link-container">
					<div>
						<a
							class="btn acrobat-icon"
							href="/pdf/ChrisHardwickResume2026-09nc.pdf"
							title="Download Chris Hardwick Resume PDF"
							download="ChrisHardwickResume2026.pdf"
							@click="sendAnalyticsEvent('download', 'resume_link_home')"
						>
							Download&nbsp;Resume
						</a>
					</div>
					<div>
						<RouterLink
							to="/resume"
							title="Chris Hardwick Resume"
							class="btn personal-icon"
							@click="sendAnalyticsEvent('resume_online', 'resume_link')"
							>Resume Page</RouterLink
						>
					</div>
					<div>
						<a
							class="btn linkedin linkedin-icon"
							:href="urls.linkedin.url"
							:title="urls.linkedin.title"
							target="_blank"
							@click="sendAnalyticsEvent('linkedin', 'linkedin_link')"
							>{{ urls.linkedin.text }}
						</a>
					</div>
					<div>
						<a class="btn email-icon" @click="contactEmail(true)" title="Contact Me">Contact Me</a>
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
.btn-link-container .btn .arrow {
	display: inline-block;
	position: relative;
	right: -5px;
	font-weight: bold;
	transform: rotate(-90deg);
	transition: transform 0.4s ease-in-out;
}

.btn-link-container .btn .arrow.rotated {
	transform: rotate(0deg);
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

#latest-summary {
	background-color: #e7e7e7;
	padding: 1em;
	border: 1px #555 solid;
	border-radius: 12px;
}

.uiDarkMode #latest-summary {
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
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1em;
	justify-items: center;
}

.btn-link-container > div {
	align-items: center;
	justify-items: center;
	width: fit-content;
	margin: auto;
}

.btn-link-container .btn {
	text-transform: uppercase;
	font-size: inherit !important;
}

.btn-link-container > div > * {
	min-width: 12em;
}

.mobile .btn-link-container > div {
	margin: 10px;
}

.mobile .btn span {
	right: 0;
}

.linkedin,
.acrobat-icon,
.personal-icon,
.email-icon {
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

.btn.acrobat-icon,
.btn.linkedin-icon,
.btn.personal-icon,
.btn.email-icon {
	font-size: 0.8em;
	text-align: center;
}

.acrobat-icon::after,
.linkedin-icon::after,
.personal-icon::after,
.email-icon::after {
	content: unset;
}

@media (max-width: 512px) {
	.btn-link-container {
		grid-template-columns: 1fr;
		gap: 0.5em;
	}
}

@media (max-width: 767px) {
	h2 {
		font-size: 1.5em;
	}

	h3 {
		font-size: 1.25em;
	}
}

@media (min-width: 768px) {
	#latest-summary {
		padding: 1em 2em;
	}

	.btn.acrobat-icon,
	.btn.linkedin-icon,
	.btn.personal-icon {
		font-size: 1em;
	}

	.btn-link-container .btn .arrow {
		margin-left: 10px;
	}

	.btn.acrobat-icon,
	.btn.linkedin-icon,
	.btn.personal-icon,
	.btn.email-icon {
		padding-right: 48px;
	}

	.acrobat-icon::after,
	.linkedin-icon::after,
	.personal-icon::after,
	.email-icon::after {
		content: "";
		top: 2px;
		right: 10px;
		width: 26px;
		height: 26px;
		box-shadow: 0px 0px 3px 1px rgb(0 0 0 / 30%);
		border-radius: 50%;
	}

	.email-icon::after {
		right: 13px;
		border-radius: unset;
		box-shadow: unset;
	}

	.personal-icon::after {
		top: 3px;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		border: 1px #eee solid;
	}

	.email-icon::after {
		top: 6px;
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
	#latest-summary {
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

@media (min-width: 1024px) {
	.btn-link-container {
		align-items: center;
		margin-top: 2em;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1em;
	}

	.btn-link-container > div > * {
		min-width: 12em;
	}
}

@media (min-width: 1200px) {
	#main-home-layout {
		width: 80%;
	}
}

@media (min-width: 1400px) {
	.btn-link-container {
		grid-template-columns: repeat(4, 1fr);
	}

	.btn-link-container > div > * {
		min-width: unset;
	}

	.acrobat-icon::after,
	.linkedin-icon::after,
	.personal-icon::after {
		top: 3px;
	}
}

@media (min-width: 1800px) {
	#main-home-layout {
		width: 70%;
	}

	.acrobat-icon::after,
	.linkedin-icon::after,
	.personal-icon::after {
		top: 5px;
	}

	.email-icon::after {
		top: 8px;
	}
}

@media (min-width: 2200px) {
	#main-home-layout {
		width: 60%;
	}
}
</style>
