<script setup>
import { ref, onBeforeMount, onMounted } from "vue";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/carousel.css";
import techStack from "@/dependencies/techStack.json";

const props = defineProps({
	isMobile: Boolean,
});

const wrapperRef = ref(null);
const shuffledTech = ref([]);

// Configuration options
const config = {
	itemsToShow: 1.5,
	snapAlign: "center",
	marquee: true,
	marqueeSpeed: 50,
	wrapAround: true,
};

const createBreakpointConfig = () => {
	// setup all the breakpoints to keep the icons even and consistent
	let offset = 110;
	let breakItems = {};
	let maxWidth = 3400; // max viewport width
	for (let i = 300; i < maxWidth; i += 200) {
		breakItems[i] = { itemsToShow: Math.round(i / offset) };
	}
	config.breakpoints = breakItems;
};

function shuffleArray(array) {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
}

onMounted(() => {
	let newTechStack = techStack.filter((icon) => !icon.class.includes("sql-light"));
	shuffledTech.value = shuffleArray(newTechStack);

	// This is to fix race conditions on layout calculations for vue3-carousel in marquee mode
	// Issue found only on Firefox, so far...
	// but probably good to have for any unforseen layout calculation race conditions that might come up
	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			if (wrapperRef.value) {
				// Forces Firefox ResizeObserver to fire just like a real window resize
				wrapperRef.value.style.width = "calc(100% - 1px)";
				requestAnimationFrame(() => {
					wrapperRef.value.style.width = "";
				});
			}
		});
	});
});

onBeforeMount(() => {
	createBreakpointConfig();
});
</script>

<template>
	<div id="tech-container" ref="wrapperRef">
		<Carousel v-bind="config">
			<Slide class="tech-container" v-for="(slide, i) in shuffledTech" :key="i">
				<div class="carousel__item">
					<div class="item-container" :title="slide.title">
						<img :class="slide.class" :src="slide.src" width="50" height="50" />
						<div class="icon-overlay">
							<span class="text-stroke">{{ slide.title }}</span>
						</div>
					</div>
				</div>
			</Slide>
		</Carousel>
	</div>
</template>

<style scoped>
.tech-container {
	user-select: none;
}

.carousel__item {
	background-color: var(--wc-branding-accent-color);
	background-color: rgb(131 153 193 / 60%);
	background-image: radial-gradient(rgb(91 233 55 / 40%) 40%, rgb(41 38 163 / 30%) 90%);
	color: #ddd;
	padding: 0.5em;
	width: 100%;
	height: 100%;
	text-align: center;
	align-content: center;
	font-weight: bold;
}

.item-container {
	display: flex;
	justify-content: center;
	align-content: center;
	background-image: linear-gradient(#0f438f, #020618);
	border-radius: 8px;
	height: 100%;
	width: 100%;
	padding: 0.5em;
	overflow: hidden;
	text-overflow: ellipsis;
}

img.logo {
	display: flex;
	justify-self: center;
}

.filter {
	filter: invert(0.2) brightness(1);
}

.invert {
	filter: invert(1);
}

.carousel__slide:hover .icon-overlay {
	bottom: 0;
}

.icon-overlay {
	color: #fff;
	text-align: center;
	background: linear-gradient(0deg, #0090ff, transparent);
	flex-flow: column;
	justify-content: center;
	width: 100%;
	height: 4em;
	padding: 7px 0 5px;
	transition: bottom 0.2s;
	display: flex;
	position: absolute;
	left: 0;
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
