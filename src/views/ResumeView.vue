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
				<button class="btn" @click="eventBus.emit('contactEmail', true)">Contact Me</button>
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
		isMobile: Boolean
	},
	components: {
		ResumeTable,
		ResumeTableMobile
	},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			resumeArray: []
		};
	},
	methods: {
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
				if (data?.success)
					this.resumeArray = data.resume;

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


<!-- Add "scoped" attribute to limit CSS to this component only -->
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