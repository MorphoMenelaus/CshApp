<script setup>
import { ref, onMounted } from 'vue';
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel"
import "vue3-carousel/carousel.css"

// Configuration options
const config = {
	itemsToShow: 1.5,
	snapAlign: "center",
	autoplay: 3000,
	wrapAround: true, // Infinite scroll loop
	breakpoints: {
		768: { itemsToShow: 3, snapAlign: "center" },
		1024: { itemsToShow: 4.5, snapAlign: "start" }
	}
}

let slides = ref([]);
let isLoading = ref(true);
let limit = 5;
let offset = 0;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

onMounted(async () => {
	let headerObj = new Headers();
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL("/api/movies/slides", baseUrl);
	let params = requestUrl.searchParams;
	params.set("limit", limit);
	params.set("offset", offset);
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
		slides.value = data.slides;
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false;
		console.log(slides.value);
	}
});

</script>

<template>
	<div id="carousel-container" v-if="slides?.length > 0">
		<!-- <div v-if="isLoading">Loading images...</div> -->
		<Carousel v-bind="config">
			<Slide v-for="slide in slides" :key="slide.id">
				<div class="carousel__item">
					<span>{{ slide.title }}</span>
					<img :src="slide.relativePath + slide.image" />
				</div>
			</Slide>
			<!-- Addons are optional slots for UI elements -->
			<template #addons>
				<Navigation />
				<Pagination />
			</template>
		</Carousel>
	</div>
</template>

<style>
#carousel-container {
	width: 100vw;
	padding: 0;
	margin: 0 auto;
	position: absolute;
	left: 0;
	top: 90px;
}

.carousel__item {
	min-height: 200px;
	width: 100%;
	color: white;
	font-size: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 8px;
}

.carousel__icon {
	color: #000;
	background-color: #fff;
	border-radius: 10px;
	transition: background-color 300ms ease-in-out,
		color 300ms ease-in-out;
}

.carousel__icon:hover {
	color: #a8befb;
	background-color: #4b4f8c;
}
</style>
