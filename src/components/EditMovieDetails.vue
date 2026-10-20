<script setup>
import { ref, inject, onMounted } from "vue";
import { addUserLog, tokenInterceptFetch } from "@/dependencies/csh-libs.js";
import { appNotify } from "@/dependencies/models.js";

const props = defineProps({
	appState: Object,
	selectedMovie: Object,
	favoritesList: Array,
});

const baseUrl = inject("baseUrl");
const updateStatus = inject("sendUpdateStatus");
const showHideLoader = inject("showHideLoader");
const movieUpdated = inject("movieUpdated");
const serverStatus = Object.assign({}, appNotify);

const dialog = ref(null);
const disableBtn = ref(false);
const movie = ref({});
const title = ref(props.selectedMovie.title);
const original_title = ref(props.selectedMovie.original_title);
const tagline = ref(props.selectedMovie.tagline);
const summary = ref(props.selectedMovie.summary);
const studio = ref(props.selectedMovie.studio);
const rating = ref(props.selectedMovie.rating);
const content_rating = ref(props.selectedMovie.content_rating);
const duration = ref(props.selectedMovie.duration);
const tags_genre = ref(props.selectedMovie.tags_genre);
const tags_director = ref(props.selectedMovie.tags_director);
const tags_writer = ref(props.selectedMovie.tags_writer);
const tags_star = ref(props.selectedMovie.tags_star);
const year = ref(props.selectedMovie.year);
const tags_country = ref(props.selectedMovie.tags_country);
const audience_rating = ref(props.selectedMovie.audience_rating);
const slug = ref(props.selectedMovie.slug);

const updateMovie = async () => {
	showHideLoader(true);
	disableBtn.value = true;

	let body = {
		title: title.value,
		original_title: original_title.value,
		tagline: tagline.value,
		summary: summary.value,
		studio: studio.value,
		rating: rating.value,
		content_rating: content_rating.value,
		duration: duration.value,
		tags_genre: tags_genre.value,
		tags_director: tags_director.value,
		tags_writer: tags_writer.value,
		tags_star: tags_star.value,
		year: year.value,
		tags_country: tags_country.value,
		audience_rating: audience_rating.value,
		slug: slug.value,
	};

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL(`/api/movies/${props.selectedMovie.movieId}`, baseUrl);

	let request = new Request(requestUrl.toString(), {
		method: "PUT",
		headers: headerObj,
		body: JSON.stringify(body),
	});

	try {
		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		if (data.success) {
			movieUpdated(true);
		}

		serverStatus.code = data.code;
		serverStatus.message = data.message;
		serverStatus.success = data.success;
		updateStatus(serverStatus);
	} catch (error) {
		console.error("Error fetching data:", error);
	} finally {
		showHideLoader(false);
		disableBtn.value = false;
		addUserLog(props.appState, `Update Movie Details. MovieId: ${props.selectedMovie.movieId}`);
	}
};

const openConfirmDialog = () => {
	dialog.value.showModal();
};

const cancel = () => {
	// Event is movieUpdated() but it can work as a cancel as well
	// false only closes component and true closes and refreshes movie list
	movieUpdated(false);
};

onMounted(() => {
	dialog.value = document.getElementById("confirmEdit");
});
</script>

<template>
	<div id="edit-movies" @keyup.esc="cancel()">
		<div class="wrapper">
			<h1>Movie Details (movieId: {{ selectedMovie.movieId }})</h1>
			<div id="edit">
				<div class="form-container">
					<form @submit.prevent="updateMovie" method="put">
						<div class="fields">
							<div id="fieldset-one">
								<div class="form-group">
									<label for="title">Title</label>
									<input id="title" v-model="title" />
								</div>
								<div class="form-group">
									<label for="original_title">Original Title</label>
									<input id="original_title" v-model="original_title" />
								</div>
								<div class="form-group">
									<label for="tagline">Tagline</label>
									<input id="tagline" v-model="tagline" />
								</div>
								<div class="form-group">
									<label for="summary">Summary</label>
									<textarea id="summary" v-model="summary" />
								</div>
								<div class="form-group">
									<label for="studio">Studio</label>
									<input id="studio" v-model="studio" />
								</div>
								<div class="form-group">
									<label for="rating">Rating</label>
									<input id="rating" v-model="rating" />
								</div>
								<div class="form-group">
									<label for="content_rating">Content Rating</label>
									<input id="content_rating" v-model="content_rating" />
								</div>
							</div>
							<div id="fieldset-two">
								<div class="form-group">
									<label for="tags_genre">Genre</label>
									<input id="tags_genre" v-model="tags_genre" />
								</div>
								<div class="form-group">
									<label for="tags_director">Director</label>
									<input id="tags_director" v-model="tags_director" />
								</div>
								<div class="form-group">
									<label for="tags_writer">Writer</label>
									<input id="tags_writer" v-model="tags_writer" />
								</div>
								<div class="form-group">
									<label for="tags_star">Star</label>
									<input id="tags_star" v-model="tags_star" />
								</div>
								<div class="form-group">
									<label for="year">Year</label>
									<input id="year" v-model="year" />
								</div>
								<div class="form-group">
									<label for="tags_country">Country</label>
									<input id="tags_country" v-model="tags_country" />
								</div>
								<div class="form-group">
									<label for="audience_rating">Audience Rating</label>
									<input id="audience_rating" v-model="audience_rating" />
								</div>
								<div class="form-group">
									<label for="slug">Image Name <small>(file type assumed to be .jpg)</small></label>
									<input id="slug" v-model="slug" />
								</div>
							</div>
						</div>
					</form>
					<div class="button-container">
						<button @click="openConfirmDialog()" class="btn" title="Update Movie Details">Update Movie Details</button>
						<button @click="cancel()" class="btn" title="Cancel">Cancel</button>
					</div>
				</div>
			</div>
		</div>

		<div id="edit-dialog-container">
			<dialog id="confirmEdit">
				<div>
					<h2>Are you sure you want to edit movie?</h2>
					<p>This cannot be undone.</p>
					<div class="dialog-buttons">
						<button class="btn" @click="updateMovie()" :disabled="disableBtn">Update</button>
						<button class="btn cancel" @click="dialog.close()">Cancel</button>
					</div>
				</div>
			</dialog>
		</div>
	</div>
</template>

<style scoped>
#view {
	padding-bottom: 90px;
}

h1,
h2,
#confirmEdit p {
	font-weight: bold;
	text-align: center;
}

#edit-movies h1 {
	font-size: 2.5em;
}

#edit-movies {
	position: fixed;
	inset: 90px 0 45px;
	background-color: rgb(50 55 63 / 80%);
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
	overflow: hidden auto;
}

.wrapper {
	margin: 30px auto 15px;
}

.fields {
	display: flex;
	font-size: 18px;
}

.mobile .form-container {
	padding-bottom: 30px;
}

.mobile .fields {
	flex-direction: column;
}

#fieldset-one,
#fieldset-two {
	width: 40%;
	display: flex;
	flex-direction: column;
	margin: 0 auto 15px;
}

.mobile #fieldset-one,
.mobile #fieldset-two {
	width: 95%;
}

.form-group label {
	font-size: 1.52em;
}

textarea#summary {
	font-size: 1.3em;
	font-family: inherit;
	font-weight: 500;
	color: #000;
}

.button-container {
	display: flex;
	justify-self: center;
	width: 20em;
}

.fields,
.drop-downs {
	margin: 15px;
}

.form-group {
	display: grid;
}

.form-group * {
	margin: 5px 0 0;
}

input {
	font-weight: bold;
	font-size: 1.25em;
}

textarea {
	min-height: 4.75em;
}

button.btn {
	display: block;
	margin: 15px auto 0;
}

#edit-dialog-container dialog {
	margin: auto;
	padding: 30px;
	color: #bda5af;
	background-color: #313b64;
	border-radius: 12px;
	border-width: 1px;
}

::backdrop {
	background-color: rgb(0 0 0 / 60%);
	-webkit-backdrop-filter: blur(10px);
	backdrop-filter: blur(10px);
}

.dialog-buttons {
	display: flex;
	justify-content: space-evenly;
	margin: 30px auto 0;
}

.cancel {
	background-color: #3f445f;
}

.err {
	border: 2px #f00 solid;
}
</style>
