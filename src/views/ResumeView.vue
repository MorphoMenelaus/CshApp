<script setup>
import { ref, inject, watch, onMounted } from "vue";
import { sendAnalyticsEvent } from "@/dependencies/csh-libs.js";
import urls from "@/dependencies/commonUrls.json";
import { appNotify } from "@/dependencies/models.js";
import ResumeTable from "@/components/ResumeTable.vue";
import ResumeTableMobile from "@/components/ResumeTableMobile.vue";
import skills from "@/dependencies/skills.json";

const props = defineProps({
	appState: Object,
	isMobile: Boolean,
});

const baseUrl = inject("baseUrl");
const personalRestricted = inject("personalRestricted");
const updateStatus = inject("sendUpdateStatus");
const showHideLoader = inject("showHideLoader");
const contactEmail = inject("contactEmail");
const forceLogout = inject("forceLogout");
const serverStatus = Object.assign({}, appNotify);
const resumeArray = ref([]);
const allDutiesArray = ref([]);
const keywords = ref("");
const filteredArray = ref([]);
const filteredSkills = ref([]);

const keywordFilter = () => {
	let filtered = [];
	let filterSkills = [];
	const regex = new RegExp(keywords.value, "gi");
	allDutiesArray.value.forEach((duty) => {
		if (duty.toUpperCase().includes(keywords.value.toUpperCase()))
			filtered.push(
				duty.replaceAll(regex, (match) => {
					return match.replaceAll(regex, `<b>${match}</b>`);
				}),
			);
	});
	skills.forEach((skill) => {
		if (skill.toUpperCase().includes(keywords.value.toUpperCase()))
			filterSkills.push(
				skill.replaceAll(regex, (match) => {
					return match.replaceAll(regex, `<b>${match}</b>`);
				}),
			);
	});
	filteredArray.value = filtered;
	filteredSkills.value = filterSkills;
};

const combineAllToNewArray = () => {
	let newArr = [];
	let duitiesArr = [];
	if (props.appState?.appDevDuties?.length > 0) {
		duitiesArr = props.appState?.appDevDuties.flatMap((app) => app.duties);
		newArr = [...newArr, ...duitiesArr];
	}
	resumeArray.value.forEach((entry) => {
		newArr = [...newArr, ...entry.duties];
	});
	allDutiesArray.value = newArr;
};

const getResumeData = async () => {
	showHideLoader(true);

	let headerObj = new Headers();
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL("/api/blog/resume/", baseUrl);

	let params = requestUrl.searchParams;
	params.set("time", new Date().getTime());
	requestUrl.search = params.toString();

	let request = new Request(requestUrl.toString(), {
		method: "GET",
		headers: headerObj,
	});

	try {
		let response = await fetch(request);
		let data = await response.json();

		if (data?.code === 403) {
			data.forced = true;
			forceLogout(data);
		}

		if (data?.success) {
			resumeArray.value = data.resume;
			combineAllToNewArray();
		}
	} catch (error) {
		console.error("Error reading data:", error);
		serverStatus.code = 500;
		serverStatus.message = `Error getting data: ${error}`;
		serverStatus.success = false;
		updateStatus(serverStatus);
	} finally {
		showHideLoader(false);
	}
};

watch(keywords, () => {
	keywordFilter();
});

onMounted(() => {
	getResumeData();
});
</script>
<template>
	<div>
		<div id="layout-container">
			<div id="resume-header">
				<h1 class="julius-sans center name stroke">Chris Hardwick</h1>
				<h2>Resume</h2>
			</div>

			<div class="btn-container top">
				<a
					class="btn acrobat-icon"
					href="/pdf/ChrisHardwickResume2026-09nc.pdf"
					title="Download Chris Hardwick Resume PDF"
					download="ChrisHardwickResume2026.pdf"
					@click="sendAnalyticsEvent('download', 'resume_link')"
				>
					Download Resume
				</a>
				<button class="btn email-icon" @click="contactEmail(true)">Contact Me</button>
				<a
					class="btn linkedin linkedin-icon"
					:href="urls.linkedin.url"
					:title="urls.linkedin.title"
					target="_blank"
					@click="sendAnalyticsEvent('linkedin', 'linkedin_link')"
					>Linkedin Profile</a
				>
			</div>
			<div>
				<div class="form-group">
					<label for="keywords">Search Skills&nbsp;&amp;&nbsp;Roles</label>
					<input
						id="keywords"
						title="keywords"
						v-model.trim="keywords"
						type="text"
						name="keywords"
						placeholder="Enter keyword to search"
						class="form-control"
					/>
					<span v-if="keywords.length > 0" title="Clear search" @click="keywords = ''" class="clear-field">✕</span>
				</div>
				<Transition name="slide-down">
					<div v-if="(filteredSkills.length > 0 || filteredArray.length > 0) && keywords.length >= 3" id="filtered">
						<div v-if="filteredArray.length > 0">
							<h2>Roles Search Results</h2>
							<ul id="resp-list">
								<li v-for="(item, index) in filteredArray" :key="index" v-html="item"></li>
							</ul>
						</div>
						<div v-if="filteredSkills.length > 0">
							<h2>Skills Search Results</h2>
							<ul id="skill-list">
								<li v-for="(item, index) in filteredSkills" :key="index" v-html="item"></li>
							</ul>
						</div>
					</div>
				</Transition>
			</div>
			<div v-if="resumeArray?.length > 0">
				<div v-if="!isMobile">
					<ResumeTable :resumeArray="resumeArray" />
				</div>
				<div v-if="isMobile">
					<ResumeTableMobile :resumeArray="resumeArray" />
				</div>
			</div>
			<div v-else>
				<h1 class="center">Resume Data Failed to Load.</h1>
				<h2 class="center">Please try again.</h2>
			</div>
		</div>
	</div>
</template>

<style>
#filtered {
	background: linear-gradient(#eafbea, #dff7ff 50%);
	color: #000;
	padding: 5px 15px 10px;
	border-radius: 12px;
	margin: 15px auto;
	border: 2px rgb(255 255 0 / 50%) solid;
	overflow: hidden;
}

.uiDarkMode #filtered {
	background-image: none;
	background-color: #c1c1c1;
}

#filtered h2 {
	text-align: center;
	font-weight: 500;
}

#resp-list b,
#skill-list b {
	background-color: rgb(86 131 239 / 30%);
	color: #000;
	font-weight: 500;
	padding-bottom: 2px;
	border-radius: 4px;
}

#skill-list {
	margin: auto;
	width: fit-content;
}
</style>

<style scoped>
.btn {
	margin: 15px auto;
	display: block;
	width: fit-content;
}

#layout-container {
	width: 98%;
	margin: 15px auto;
	padding-bottom: 45px;
}

#resume-header {
	margin-top: 15px;
}

#resume-header h1,
#resume-header h2 {
	text-align: center;
}

#resume-header h2 {
	font-size: 2em;
}

.form-group {
	color: #000;
	background-color: #e7e7e7;
	border: 1px solid #7f7f7f;
	border-radius: 12px;
	justify-content: space-around;
	width: 20em;
	margin: auto;
	padding: 5px 15px;
	display: flex;
	margin-bottom: 15px;
}

.uiDarkMode .form-group {
	color: #ddd;
	background-color: #000;
	border: 1px solid #fff;
}

.name {
	font-size: 3.5em;
}

.center {
	text-align: center;
}

#keywords {
	align-self: center;
}

#keywords::placeholder {
	font-weight: 500;
	color: #000;
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

.btn-container button {
	font-size: 1em;
}

.clear-field {
	cursor: pointer;
	background-color: #ccc;
	border-radius: 6px;
	padding: 4px;
	position: relative;
	right: -5px;
	font-size: 0.9em;
	font-weight: bold;
	line-height: 0.9em;
	color: #000;
	align-self: center;
}

.clear-field:hover {
	background-color: #aaa;
}

.form-group input {
	font-size: 0.8em;
	padding-left: 6px;
}

.email-icon::after {
	top: 8px;
	right: 10px;
	width: 20px;
	height: 20px;
}

.mobile .btn.email-icon,
.mobile .btn.acrobat-icon,
.mobile .btn.linkedin-icon {
	padding-right: 15px;
	text-align: center;
	margin: 15px 5px;
}

.mobile .btn.email-icon::after,
.mobile .btn.acrobat-icon::after,
.mobile .btn.linkedin-icon::after {
	display: none;
}

.btn:hover::after {
	filter: brightness(0.8);
}

@media (max-width: 767px) {
	#resume-header h1 {
		font-size: 2.5em;
	}

	#resume-header h2 {
		font-size: 1.5em;
	}

	h3 {
		font-size: 1.25em;
	}
}

@media (min-width: 576px) {
	.btn-container.top {
		flex-direction: row;
		margin-bottom: 0.8em;
	}
}

@media (min-width: 768px) {
	.btn.acrobat-icon,
	.btn.linkedin-icon {
		padding-right: 48px;
	}

	.acrobat-icon::after,
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
		width: 80%;
	}
}

@media (min-width: 992px) {
	#layout-container {
		width: 90%;
	}
}

@media (min-width: 1200px) {
	#layout-container {
		width: 80%;
	}
}

@media (min-width: 1800px) {
	#layout-container {
		width: 70%;
	}
}

@media (min-width: 2200px) {
	#layout-container {
		width: 60%;
	}
}
</style>
