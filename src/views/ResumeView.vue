<template>
	<div>
		<div id="layout-container">

			<div id="resume-header">
				<h1 class="julius-sans center name">Chris Hardwick</h1>
				<h2>Resume</h2>
			</div>

			<div class="btn-container top">
				<a class="btn" href="/pdf/ChrisHardwickResume2026nc.pdf" title="Download Chris Hardwick Resume PDF"
					download="ChrisHardwickResume2026.pdf" @click="sendAnalyticsEvent('download', 'resume_link')">
					Download PDF
				</a>
				<a class="btn linkedin" href="https://www.linkedin.com/in/cs-hardwick"
					title="Chris Hardwick | Linkedin Profile" target="_blank"
					@click="sendAnalyticsEvent('linkedin', 'linkedin_link')">Linkedin Profile</a>
				<button class="btn" @click="eventBus.emit('contactEmail', true)">Contact Me</button>
			</div>
			<div>
				<div class="form-group">
					<label for="keywords">Search Roles</label>
					<input id="keywords" title="keywords" v-model.trim="keywords" type="text" name="keywords"
						class="form-control">
					<span v-if="keywords.length > 0" title="Clear search" @click="keywords = ''"
						class="clear-field">❌</span>
				</div>
				<div v-if="filteredArray.length > 0 && keywords.length >= 3" id="filtered">
					<h2>Filtered Resposibilities</h2>
					<ul id="resp-list">
						<li v-for="(item, index) in filteredArray" :key="index" v-html="item"></li>
					</ul>
				</div>
			</div>
			<div v-if="resumeArray.length > 0 && !isMobile">
				<ResumeTable :resumeArray="resumeArray" />
			</div>

			<div v-if="resumeArray.length > 0 && isMobile">
				<ResumeTableMobile :resumeArray="resumeArray" />
			</div>

		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import ResumeTable from "@/components/ResumeTable.vue";
import ResumeTableMobile from "@/components/ResumeTableMobile.vue";

export default {
	name: "ResumeView",
	props: {
		appState: Object,
		isMobile: Boolean
	},
	components: {
		ResumeTable,
		ResumeTableMobile
	},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			resumeArray: [],
			allDutiesArray: [],
			keywords: "",
			filteredArray: [],
		};
	},
	watch: {
		keywords() {
			this.keywordFilter();
		}
	},
	methods: {
		keywordFilter() {
			let filtered = [];
			const regex = new RegExp(this.keywords, "gi");
			this.allDutiesArray.forEach(duty => {
				if (duty.toUpperCase().includes(this.keywords.toUpperCase()))
					filtered.push(duty.replaceAll(regex, (match) => {
						return match.replaceAll(regex, `<b>${match}</b>`);
					}));
			});
			this.filteredArray = filtered;
		},
		combineAllToNewArray() {
			let newArr = [];
			this.resumeArray.forEach(entry => {
				newArr = [...newArr, ...entry.duties]
			});
			this.allDutiesArray = newArr;
		},
		async getResumeData() {
			this.eventBus.emit("showHideLoader", true);

			let headerObj = new Headers();
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("/api/blog/resume/", this.baseUrl);

			let params = requestUrl.searchParams;
			params.set("time", new Date().getTime());
			requestUrl.search = params.toString();

			let request = new Request(
				requestUrl.toString(), {
				method: 'GET',
				headers: headerObj,
			});

			try {

				let response = await fetch(request);
				let data = await response.json();
				if (data?.success) {
					this.resumeArray = data.resume;
					this.combineAllToNewArray();
				}

			} catch (error) {
				console.error('Error reading data:', error);
				this.serverStatus.code = 500;
				this.serverStatus.message = `Error getting data: ${error}`;
				this.serverStatus.success = false;
				this.eventBus.emit("updateStatus", (this.serverStatus));
			} finally {
				this.eventBus.emit("showHideLoader", false);
			}
		},
	},
	mounted() {
		this.getResumeData();
	},
};
</script>

<style>
#filtered {
	background-color: #c1c1c1;
	color: #000;
	padding: 5px 15px 10px;
	border-radius: 12px;
	margin: 15px auto;
	border: 2px rgb(255 255 0 / 50%) solid;
}

#resp-list b {
	background-color: rgb(86 131 239 / 30%);
	color: #000;
	font-weight: 500;
	padding-bottom: 2px;
	border-radius: 4px;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2 {
	text-align: center;
	font-weight: 500;
}

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
	/* font-weight: bold; */
}

.center {
	text-align: center;
}

.btn-container .btn {
	font-size: .75em;
	line-height: 1.5em;
	padding: 5px 15px;
	border: 1px #000 solid;
}

.btn-container.top {
	display: flex;
	flex-direction: row;
	justify-self: center;
	justify-content: space-evenly;
	width: 100%;
	margin: auto;
	font-size: 18px;
}


.btn-container button {
	font-size: 1em;
}

.clear-field {
	position: relative;
	right: -5px;
	background-color: #ccc;
	padding: 0px 2px 1px;
	border-radius: 6px;
	cursor: pointer;
}

.form-group input {
	font-size: .8em;
	padding-left: 10px;
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
	}
}

@media (min-width: 768px) {
	.btn-container.top {
		width: 50%;
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