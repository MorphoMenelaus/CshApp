<script setup>
import { ref, inject } from "vue";

const props = defineProps({
	isMobile: Boolean,
	selectedMovie: Object,
});

const movieUpdated = inject("movieUpdated");
const posterImage = ref(props.selectedMovie.slug ? `url('/media-poster/${props.selectedMovie.slug}-poster.jpg')` : null);

const cancel = () => {
	// Event is movieUpdated but it can work as a cancel as well
	// The event handler only closes conponent and refreshes movie list
	movieUpdated(false);
};

const formatDuration = (ms) => {
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / (1000 * 60)) % 60);
	const hours = Math.floor(ms / (1000 * 60 * 60));

	return [String(hours).padStart(2, "0"), String(minutes).padStart(2, "0"), String(seconds).padStart(2, "0")].join(":");
};
</script>

<template>
	<div>
		<div id="movie-details" :class="isMobile ? 'mobile' : ''">
			<div class="card">
				<div class="img-box-container">
					<div class="img-box">
						<img class="poster" :src="`./media-poster/${selectedMovie.slug}.jpg`" />
					</div>
				</div>
				<div class="details-box">
					<h1>{{ selectedMovie.title }}</h1>
					<small v-if="selectedMovie.original_title">Original Title: {{ selectedMovie.original_title }}</small>
					<small>Directed By: {{ selectedMovie.tags_director.replaceAll("|", ", ") }}</small>
					<h2>{{ selectedMovie.tagline }}</h2>
					<div class="year-block">
						<div class="rating">{{ selectedMovie.content_rating }}</div>
						<div>{{ selectedMovie.year }}</div>
						<div>{{ formatDuration(selectedMovie.duration) }}</div>
					</div>
					<div>{{ selectedMovie.tags_genre.replaceAll("|", ", ") }}</div>
					<div class="rating-block">
						<div v-if="selectedMovie.rating">Rating: {{ selectedMovie.rating }}</div>
						<div v-if="selectedMovie.audience_rating">Audience Rating: {{ selectedMovie.audience_rating }}</div>
					</div>
					<div>
						<p>{{ selectedMovie.summary }}</p>
					</div>
					<h3><strong>Cast:</strong> {{ selectedMovie.tags_star.replaceAll("|", ", ") }}</h3>
					<div><strong>Writer:</strong> {{ selectedMovie.tags_writer.replaceAll("|", ", ") }}</div>
					<div v-if="selectedMovie.studio"><strong>Studio:</strong> {{ selectedMovie.studio.replaceAll("|", ", ") }}</div>
					<div class="btn-container">
						<button @click="cancel()" class="btn" title="Close Details">Close Details</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
p {
	margin: 30px auto;
	font-size: 1.25rem;
}

.details-box h1 {
	font-size: 3rem;
	font-weight: bold;
}

.details-box h2 {
	font-size: 2rem;
	font-weight: bold;
}

#movie-details {
	display: grid;
	align-items: center;
	position: fixed;
	top: 100px;
	right: 0;
	bottom: 60px;
	left: 0;
	background-color: rgb(0 0 0 / 80%);
	backdrop-filter: blur(10px);
	z-index: 1;
}

#movie-details.mobile {
	overflow: hidden auto;
	top: 95px;
	bottom: 45px;
}

.card {
	height: 90%;
	/* max-height: calc(100vh - 190px); */
	margin: auto;
	padding: 30px;
	/* background-color: #c7c7c7; */
	background-color: #ababab;
	background-image: v-bind(posterImage);
	background-image: v-bind(posterImage), radial-gradient(rgb(171 171 171 / 60%), transparent);
	background-repeat: no-repeat;
	background-position:
		center center,
		center center;
	background-size: cover, contain;
	background-blend-mode: overlay;
	border-radius: 15px;
	color: #000;
	overflow: hidden auto;
	display: grid;
	grid-template-columns: 1fr 2fr;
	border: 2px rgb(255 255 255 / 50%) solid;
	align-items: center;
}

.mobile .card {
	display: block;
	flex-direction: column;
	width: 90%;
	margin: 15px auto;
}

.img-box-container {
	margin-right: 30px;
	overflow: hidden;
}

.mobile .img-box-container {
	margin-right: unset;
	align-content: unset;
}

.details-box {
	background-color: rgb(255 255 255 / 60%);
	/* padding-left: 1em;
	padding-right: 1em; */
	padding: 1em;
	border-radius: 12px;
	border: 1px rgb(128 128 128 / 70%) solid;
	height: fit-content;
}

.details-box {
	flex: 1 1 auto;
	/* height: 100%; */
}

.details-box * {
	font-weight: 500;
}

.details-box small {
	display: block;
}

.img-box {
	display: flex;
	justify-content: center;
	margin-top: 10px;
}

.mobile .img-box {
	align-items: center;
	padding: unset;
	/* margin: auto; */
	margin: auto auto 1em;
}

img.poster {
	width: fit-content;
	max-height: 600px;
	object-fit: contain;
	overflow: hidden;
	border: 1px solid #999;
	border-radius: 14px;
}

.year-block,
.rating-block {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.year-block div,
.rating-block div {
	margin-right: 30px;
	font-weight: 500;
}

.btn-container {
	display: flex;
	width: 100%;
	justify-content: center;
	margin: 15px auto;
}

button.btn {
	font-size: 1.25rem;
}

.rating {
	background-color: rgb(0 0 0 / 75%);
	padding: 0.1em 0.5em 0;
	border-radius: 0.3em;
	color: white;
	font-weight: bold;
}

@media (max-width: 767px) {
	/* .card {
		max-height: calc(100vh - 245px);
	} */
}

@media (min-width: 768px) {
	.card {
		width: 90%;
	}
}

@media (min-width: 992px) {
	.card {
		width: 85%;
	}
}

@media (min-width: 1200px) {
	.card {
		width: 80%;
		/* max-height: 75%; */
	}
}

@media (min-width: 2200px) {
	.card {
		width: 60%;
	}
}
</style>
