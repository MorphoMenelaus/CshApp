<script setup>
import { inject } from "vue";
import { useRoute } from "vue-router";
const contactEmail = inject("contactEmail");
const route = useRoute();
</script>
<template>
	<div
		id="available"
		title="Schedule an Interview or inquire about my services"
		@click="
			contactEmail(true);
			sendAnalyticsEvent('contact_form_footer', 'contact_modal');
		"
	>
		<span class="pulse" :class="route.name === 'about' ? 'about' : ''">Available</span>
	</div>
</template>

<style scoped>
#available span {
	/* font-size: 1.25em; */
	/* color: #8eef8e; */
	color: #b3ffb3;
	background-color: rgb(0 128 0);
	padding: 1px 15px 0 25px;
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

#available span.about {
	padding-top: 0;
	/* padding-bottom: 1px; */
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
	top: 8px;
	left: 8px;
	width: 12px;
	height: 12px;
	animation-delay: -0.32s;
}

.pulse::after {
	top: 2px;
	left: 2px;
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
