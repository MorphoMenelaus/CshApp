<script setup>
import urls from "@/dependencies/commonUrls.json";
</script>

<template>
	<div id="available">
		<a :title="urls.linkedin.title" :href="urls.linkedin.url" target="_blank" @click="sendAnalyticsEvent('linkedin', 'linkedin_available')">
			<span class="pulse">Available</span>
		</a>
	</div>
</template>

<style scoped>
#available span {
	/* color: #8eef8e; */
	color: #b3ffb3;
	background-color: rgb(0 128 0);
	padding: 0 15px 0 25px;
	border-radius: 1em;
	border: 1px #0f0 solid;
	position: relative;
	transition:
		border-color 0.2s,
		background-color 0.2s;
}

#available a {
	color: #b3ffb3;
	text-decoration: none;
	transition: color 0.2s;
}

#available a:hover {
	color: #fff;
}

#available span:hover {
	background-color: rgb(0 160 0);
	border-color: #fff;
}

.pulse::before,
.pulse::after {
	content: "";
	position: absolute;
	border-radius: 50%;
	border: 2px #0f0 solid;
	animation: pulse 1.2s infinite ease-in-out both;
}

.pulse::before {
	top: 5px;
	left: 6px;
	width: 12px;
	height: 12px;
	animation-delay: -0.32s;
}

.pulse::after {
	left: 1px;
	top: 0;
	width: 22px;
	height: 22px;
	animation-delay: -0.16s;
}

@keyframes pulse {
	0%,
	80%,
	100% {
		transform: scale(0);
		opacity: 0.3;
	}

	100% {
		transform: scale(1);
		opacity: 1;
	}
}
</style>
