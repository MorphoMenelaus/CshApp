<script setup>
import { ref, onMounted } from "vue";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/carousel.css";
import techStack from "@/dependencies/techStack.json";

const props = defineProps({
	isMobile: Boolean,
});

const shuffledTech = ref([]);

// Configuration options
const config = {
	itemsToShow: 1.5,
	snapAlign: "center",
	autoplay: 3000,
	// marquee: true,
	// marqueeSpeed: 100,
	wrapAround: true,
	breakpoints: {
		320: { itemsToShow: 3, snapAlign: "start" },
		480: { itemsToShow: 4, snapAlign: "start" },
		768: { itemsToShow: 6, snapAlign: "start" },
		992: { itemsToShow: 8, snapAlign: "start" },
		1024: { itemsToShow: 10, snapAlign: "start" },
		1200: { itemsToShow: 14, snapAlign: "start" },
		1920: { itemsToShow: 18, snapAlign: "start" },
		2200: { itemsToShow: 20, snapAlign: "start" },
	},
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
	shuffledTech.value = shuffleArray(techStack);
});
</script>

<template>
	<div id="tech-container">
		<Carousel v-bind="config">
			<Slide class="tech-container" v-for="(slide, i) in shuffledTech" :key="i">
				<div class="carousel__item">
					<div class="item-container" :title="slide.title">
						<img :class="slide.class" :src="slide.src" />
						<div class="icon-overlay">
							<span class="roboto-body text-stroke">{{ slide.title }}</span>
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
	background-image: linear-gradient(#0f438f, #020618);
	border-radius: 8px;
	height: 100%;
	width: 100%;
	padding: 0.5em;
	align-content: center;
	overflow: hidden;
	text-overflow: ellipsis;
}

img.logo {
	max-width: 50px;
	max-height: 50px;
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
	cursor: pointer;
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
