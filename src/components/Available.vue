<script setup>
import { inject } from "vue";
import { sendAnalyticsEvent } from "@/dependencies/csh-libs.js";
const contactEmail = inject("contactEmail");
</script>
<template>
	<div
		id="available"
		title="Schedule an Interview or inquire about my services"
		@click="
			contactEmail(true);
			sendAnalyticsEvent('contact_form_available', 'contact_modal');
		"
	>
		<span class="pulse">Available</span>
	</div>
</template>

<style scoped>
#available {
	position: absolute;
	top: -1rem;
	left: 1.5rem;
	user-select: none;
	font-size: 1.25rem;
}

#available span {
	color: #b3ffb3;
	background-color: rgb(0 128 0);
	padding: 1px 1em 0 1.5em;
	border-radius: 1em;
	border: 1px #0f0 solid;
	position: relative;
	text-decoration: none;
	cursor: pointer;
	transition:
		color 0.2s,
		border-color 0.2s,
		background-color 0.2s;
}

#available:hover span {
	color: #fff;
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
	top: -0.3em;
	left: -0.3em;
	width: 1.8em;
	height: 1.8em;
	animation-delay: -0.16s;
}

.pulse::after {
	top: 0.125em;
	left: 0.2em;
	width: 1em;
	height: 1em;
	animation-delay: -0.32s;
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
