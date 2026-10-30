<script setup>
import { ref, onBeforeMount, onMounted } from "vue";
import urls from "@/dependencies/commonUrls.json";

const showH1 = ref(true);

// Helper function to inject the script safely
function loadScript() {
	return new Promise((resolve, reject) => {
		const existingScript = document.getElementById("bug-script");

		if (existingScript) {
			resolve();
			return;
		}

		const script = document.createElement("script");
		script.id = "bug-script";
		script.src = `${urls.hdCdn.url}bug.js`;
		script.async = true;
		script.defer = true;

		script.onload = () => resolve();
		script.onerror = () => reject(new Error("Failed to load the script"));

		document.head.appendChild(script);
	});
}

onMounted(async () => {
	try {
		await loadScript();

		new BugController({});
		new SpiderController({});
	} catch (error) {
		console.error(error);
	}
});

onBeforeMount(() => {
	if (!document.getElementById("nosi-font")) {
		const link = document.createElement("link");
		link.id = "nosi-font";
		link.href = `https://fonts.googleapis.com/css?family=Nosifer`;
		link.rel = "stylesheet";
		document.head.appendChild(link);
	}
});
</script>

<template>
	<div id="hw-parent">
		<h1 v-if="showH1" class="halloween nosi text-stroke animated bounceInDown" title="Click to hide" @click="showH1 = false">
			Happy Halloween!<span class="close">✕</span>
		</h1>
		<img class="spider1" src="/img/SpiderWeb2.png" alt="Spider" />
		<img class="spider2" src="/img/SpiderWeb.png" alt="Spider" />
		<img class="pumkin" src="/img/HalloweenPumpkin.png" alt="Pumkin" />
		<img class="bat" src="/img/Bat3.png" alt="Bat" />
	</div>
</template>

<style>
body {
	cursor: url("/img/BonyPointer64.png"), url("/img/BonyPointer64.gif"), url("/img/BonyPointer64.cur"), auto;
}

a:hover,
.close,
.btn:hover,
select:hover,
label:hover,
input.submit:hover,
a.router-link-active:hover {
	cursor: url("/img/BonyOpen.png"), url("/img/BonyOpen.gif"), url("/img/BonyOpen.cur"), auto !important;
}
</style>

<style scoped>
h1.halloween {
	position: fixed;
	font-size: 4em;
	text-align: center;
	display: flex;
	justify-self: center;
	bottom: 1.5em;
	z-index: 1000;
	color: #e66f19;
	background-color: #000;
	border-radius: 0.3em;
	padding: 0.1em 0.5em;
	border: 1px #777 solid;
}

span.close {
	position: relative;
	top: -2.5em;
	right: -2.5em;
	font-size: 24px;
	padding: 0.35em 0.5em 0;
	background-color: rgb(29 58 73 / 80%);
	display: flex;
	align-self: center;
	border-radius: 12px;
	font-weight: 700;
}

.nosi {
	font-family: "Nosifer", cursive;
}

.bat,
.pumkin,
.spider1,
.spider2 {
	position: fixed;
	z-index: 1;
}

.bat,
.pumkin {
	max-height: 25vh;
}

.bat {
	width: 20em;
	top: 5em;
	right: 9em;
	transform: rotateY(180deg);
}

.spider1,
.spider2 {
	top: 4em;
	opacity: 0.7;
	max-height: 40vh;
}

.spider1 {
	left: -10px;
}

.spider2 {
	right: 0;
	width: 30em;
}

.pumkin {
	bottom: calc(3em - 8px);
	right: calc(1em - 8px);
}

.uiDarkMode .spider1,
.uiDarkMode .spider2 {
	filter: invert(0.8);
}

.animated {
	-webkit-animation-duration: 1s;
	animation-duration: 1s;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
	animation-delay: 2s;
	-webkit-animation-delay: 2s;
}

.animated.bounceInDown,
.animated.bounceIn,
.animated.bounceOut {
	-webkit-animation-duration: 0.75s;
	animation-duration: 0.75s;
}

@-webkit-keyframes bounceInDown {
	from,
	60%,
	75%,
	90%,
	to {
		-webkit-animation-timing-function: cubic-bezier(3.215, 3.61, 3.355, 4);
		animation-timing-function: cubic-bezier(3.215, 3.61, 3.355, 4);
	}

	0% {
		opacity: 0;
		-webkit-transform: translate3d(0, -3000px, 0);
		transform: translate3d(0, -3000px, 0);
	}

	60% {
		opacity: 1;
		-webkit-transform: translate3d(0, 25px, 0);
		transform: translate3d(0, 25px, 0);
	}

	75% {
		-webkit-transform: translate3d(0, -10px, 0);
		transform: translate3d(0, -10px, 0);
	}

	90% {
		-webkit-transform: translate3d(0, 5px, 0);
		transform: translate3d(0, 5px, 0);
	}

	to {
		-webkit-transform: none;
		transform: none;
	}
}

@keyframes bounceInDown {
	from,
	60%,
	75%,
	90%,
	to {
		-webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
	}

	0% {
		opacity: 0;
		-webkit-transform: translate3d(0, -3000px, 0);
		transform: translate3d(0, -3000px, 0);
	}

	60% {
		opacity: 1;
		-webkit-transform: translate3d(0, 25px, 0);
		transform: translate3d(0, 25px, 0);
	}

	75% {
		-webkit-transform: translate3d(0, -12px, 0);
		transform: translate3d(0, -12px, 0);
	}

	90% {
		-webkit-transform: translate3d(0, 15px, 0);
		transform: translate3d(0, 15px, 0);
	}

	to {
		-webkit-transform: none;
		transform: none;
	}
}

.bounceInDown {
	-webkit-animation-name: bounceInDown;
	animation-name: bounceInDown;
}
</style>
