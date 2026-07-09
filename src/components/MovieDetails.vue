<template>
	<div>
		<div id="movie-details" :class="isMobile ? 'mobile' : ''">
			<div class="card">
				<div class="img-box">
					<img class="poster" :src="`./media-poster/${selectedMovie.slug}.jpg`" />
				</div>
				<div class="details-box">
					<h1>{{ selectedMovie.title }}</h1>
					<small v-if="selectedMovie.original_title">Original Title: {{ selectedMovie.original_title
					}}</small>
					<small>Directed By: {{ selectedMovie.tags_director.replaceAll("|", ", ") }}</small>
					<h2>{{ selectedMovie.tagline }}</h2>
					<div class="year-block">
						<div>{{ selectedMovie.year }}</div>
						<div>{{ formatDuration(selectedMovie.duration) }}</div>
						<div>{{ selectedMovie.content_rating }}</div>
					</div>
					<div>{{ selectedMovie.tags_genre.replaceAll("|", ", ") }}</div>
					<div class="rating-block">
						<div v-if="selectedMovie.rating">Rating: {{ selectedMovie.rating }}</div>
						<div v-if="selectedMovie.audience_rating">Audience Rating: {{ selectedMovie.audience_rating }}
						</div>
					</div>
					<div>
						<p>{{ selectedMovie.summary }}</p>
					</div>
					<h3>Cast: {{ selectedMovie.tags_star.replaceAll("|", ", ") }}</h3>
					<div>Writer: {{ selectedMovie.tags_writer.replaceAll("|", ", ") }}</div>
					<div v-if="selectedMovie.studio">Studio: {{ selectedMovie.studio.replaceAll("|", ", ") }}</div>
					<div class="btn-container">
						<button @click="cancel()" class="btn" title="Close Details">Close Details</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { onBeforeUnmount } from "vue";

export default {
	name: "MovieDetails",
	props: {
		isMobile: Boolean,
		selectedMovie: Object
	},
	data() {
		return {
			// movie: this.selectedMovie,
		};
	},
	watch: {
	},
	methods: {
		cancel() {
			// Event is movieUpdated but it can work as a cancel as well
			// The event handler only closes conponent and refreshes movie list
			this.eventBus.emit("movieUpdated");
		},
		formatDuration(ms) {
			const seconds = Math.floor((ms / 1000) % 60);
			const minutes = Math.floor((ms / (1000 * 60)) % 60);
			const hours = Math.floor(ms / (1000 * 60 * 60));

			return [
				String(hours).padStart(2, '0'),
				String(minutes).padStart(2, '0'),
				String(seconds).padStart(2, '0')
			].join(':');
		}
	},
	mounted() {
	},
	created() {
		// this.eventBus.on("EscapeKeyDown", this.cancel());
		// onBeforeUnmount(() => {
		// 	this.eventBus.off("EscapeKeyDown");
		// });
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
	margin: 30px auto;
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
	display: flex;
	width: 80%;
	flex-flow: row;
	margin: auto;
	background-color: #c7c7c7;
	padding: 30px;
	border-radius: 15px;
	color: #000;
}

.mobile .card {
	flex-direction: column;
	width: 90%;
	margin: 15px auto;
}

.img-box {
	display: flex;
	padding-right: 30px;
}

.details-box small {
	display: block;
}

.mobile .img-box {
	padding: unset;
	align-items: center;
	margin: auto;
}

img.poster {
	border: 1px solid #999;
	border-radius: 14px;
	overflow: hidden;
}

.mobile img.poster {
	width: 100%;
}

.year-block,
.rating-block {
	display: flex;
	justify-content: flex-start;
	/* width: 20em; */
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
	margin: 30px auto 15px;
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>