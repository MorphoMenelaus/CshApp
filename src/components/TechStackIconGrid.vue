<script setup>
import techStack from "@/dependencies/techStack.json";
</script>

<template>
	<div id="tech-stack-grid">
		<div v-for="(icon, i) in techStack" :key="i" class="icon" :title="icon.title">
			<img :class="icon.class" :src="icon.src" />
			<div class="icon-overlay">
				<span class="roboto-body text-stroke">{{ icon.title }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
#tech-stack-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(10%, 1fr));
	/* grid-auto-rows: 120px; */
	grid-gap: 25px 10px;
	margin: auto;
	align-items: center;
	justify-items: center;
	background-color: #e7e7e7;
	padding: 1em;
	border-radius: 12px;
	border: 1px #555 solid;
}

.uiDarkMode #tech-stack-grid {
	background-color: #222;
}

.icon {
	background-color: rgb(69 170 223 / 30%);
	padding: 1em 0.5em;
	border: 4px #00bbff solid;
	border-radius: 8px;
	display: flex;
	justify-content: center;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}

.uiDarkMode .icon {
	background-color: #000;
	border: 2px #4848ff solid;
}

.filter {
	filter: invert(0.2) brightness(1);
}

.uiDarkMode .invert {
	filter: invert(1);
}

.invert,
.uiDarkMode .filter {
	filter: unset;
}

img.logo {
	margin: auto 0.5em;
	height: 4em;
	width: 60px;
	user-select: none;
}

.icon:hover .icon-overlay {
	bottom: 0;
}

.icon-overlay {
	color: #fff;
	text-align: center;
	background: linear-gradient(0deg, #0090ff, transparent);
	flex-flow: column;
	justify-content: center;
	width: 100%;
	height: 6em;
	padding: 7px 0 5px;
	transition: bottom 0.2s;
	display: flex;
	position: absolute;
	bottom: -100px;
}

.icon-overlay span {
	color: #fff;
	font-size: 0.9em;
	font-weight: bold;
	position: absolute;
	bottom: 0.25em;
	text-align: center;
	width: 100%;
}
</style>
