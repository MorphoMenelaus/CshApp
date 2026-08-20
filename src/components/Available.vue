<script setup>
</script>

<template>
	<div id="available">
		<span class="pulse">Available</span>
	</div>
</template>

<style scoped>
#available span {
	/* color: #8eef8e; */
	color: #b3ffb3;
	background: rgb(0 128 0);
	padding: 0 15px 0 25px;
	border-radius: 1em;
	border: 1px #0f0 solid;
	position: relative;
}

.pulse::before,
.pulse::after {
	content: '';
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