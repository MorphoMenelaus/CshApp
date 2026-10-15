<script setup>
import { ref } from "vue";
import AppDevDuties from "@/components/AppDevDuties.vue";
import { sendAnalyticsEvent } from "@/dependencies/csh-libs.js";

const props = defineProps({
	appDevDuties: Array,
	resumeArray: Array,
});

const lessText = ref(false);

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

const showHideDetails = (id) => {
	lessText.value = lessText?.value ? false : true;
	setTimeout(() => {
		scrollToId(id);
	}, 200);
	sendAnalyticsEvent("show_details", "accomplishments");
};
</script>

<template>
	<div>
		<div id="pseudo-table">
			<div class="container">
				<!-- <h2 class="julius-sans center bold">Professional Experience</h2> -->
				<div v-for="(item, index) in resumeArray" :key="index" :id="`id-${item.id}`">
					<div class="flex-inner">
						<div class="left-column">
							<h2>{{ item.title }}</h2>
							<h3>{{ item.company }}</h3>
							<h4>{{ item.dates }}</h4>
							<small>{{ item.type }}</small>
							<div v-if="item.id === 1">
								<button :class="['btn', { absolute: !lessText }]" @click="showHideDetails('latest-details')">
									<span>{{ lessText ? "Hide" : "Show" }}</span
									>&nbsp;App Suite Details
									<span class="arrow" :class="lessText ? 'rotated' : ''">▽</span>
								</button>
							</div>
						</div>
						<div class="right-column">
							<ul>
								<li v-for="(duty, index) in item.duties" :key="index">{{ duty }}</li>
							</ul>
						</div>
					</div>
					<Transition name="slide-down">
						<div v-if="item.id === 1 && appDevDuties?.length > 0 && lessText" id="latest-details">
							<button class="btn scroll-top" @click="showHideDetails('pseudo-table')"><span>▽</span>&nbsp;Hide App Suite Details</button>
							<AppDevDuties :appDevDuties="appDevDuties" />
							<button class="btn scroll-top" @click="showHideDetails('pseudo-table')"><span>▽</span>&nbsp;Hide App Suite Details</button>
						</div>
					</Transition>
				</div>
			</div>
		</div>
	</div>
</template>

<!-- <script>
export default {
	name: "ResumeTable",
	props: {
		resumeArray: Array,
	},
};
</script> -->

<style scoped>
.bold,
strong {
	font-weight: bold;
}

.center {
	text-align: center;
}

button {
	display: flex;
	justify-self: center;
	margin: 1em auto 2em;
	text-transform: uppercase;
	align-items: center;
}

button.absolute {
	position: absolute;
	bottom: 0;
}

.btn .arrow {
	display: inline-block;
	position: relative;
	right: -5px;
	font-weight: bold;
	transform: rotate(-90deg);
	transition: transform 0.4s ease-in-out;
}

.scroll-top span {
	transform: rotate(180deg);
	position: relative;
	top: -2px;
	left: -5px;
	font-size: 1.25em;
}

.arrow.rotated {
	transform: rotate(0deg);
}

#id-1 {
	position: relative;
	z-index: 3;
}

#latest-details {
	overflow: hidden;
}
#latest-details {
	background: aliceblue;
	padding: 1em;
	position: relative;
	top: -1.25em;
	z-index: -1;
	box-shadow: inset 0px -1px 12px 0px rgb(0 0 0 / 75%);
	border-radius: 0 0 10px 10px;
}

#pseudo-table {
	border: 1px #666 solid;
	border-radius: 12px;
	/* color: #222; */
	overflow: hidden;
}

.uiDarkMode #latest-details,
.uiDarkMode #pseudo-table {
	/* color: #aaa; */
	background-color: #0d1126;
}

.container {
	padding: 15px;
	background-color: #e7e7e7;
}

.uiDarkMode .container {
	background-color: rgb(34 34 34 / 30%);
}

.flex-inner {
	display: flex;
	gap: 20px;
	padding: 15px 30px;
	/* background-color: #e7e7e7; */
	background-color: aliceblue;
	border: 1px #555 solid;
	border-radius: 8px;
	margin-bottom: 15px;
}

.uiDarkMode .flex-inner {
	background-color: #000;
}

.left-column {
	flex: 1;
}

.right-column {
	flex: 3;
}
</style>
