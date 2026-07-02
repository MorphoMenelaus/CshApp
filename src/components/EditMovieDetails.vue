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
								<!-- <div class="form-group">
									<label for="duration">Duration</label>
									<input id="duration" v-model="duration" />
								</div> -->
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
									<label for="slug">Image Name</label>
									<input id="slug" v-model="slug" />
								</div>
							</div>
						</div>
					</form>
					<div class="button-container">
						<button @click="openConfirmDialog()" class="btn" title="Update Movie Details">Update Movie
							Details</button>
						<button @click="cancel()" class="btn" title="Cancel">Cancel</button>
					</div>
				</div>
			</div>
		</div>

		<div id="edit-dialog-container">
			<dialog id="confirmEdit">
				<div>
					<h2>
						Are you sure you want to edit movie?
					</h2>
					<p>This cannot be undone.</p>
					<div class="dialog-buttons">
						<button class="btn" @click="updateMovie()">Update</button>
						<button class="btn cancel" @click="dialog.close()">Cancel</button>
					</div>
				</div>
			</dialog>
		</div>

	</div>

</template>

<script>
import ChangePassword from "@/components/ChangePassword.vue";

export default {
	name: "EditMovieDetails",
	props: {
		appState: Object,
		selectedMovie: Object,
		favoritesList: Array
	},
	components: {
		ChangePassword
	},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			dialog: null,
			movie: {},
			currentComponent: null,
			title: this.selectedMovie.title,
			original_title: this.selectedMovie.original_title,
			tagline: this.selectedMovie.tagline,
			summary: this.selectedMovie.summary,
			studio: this.selectedMovie.studio,
			rating: this.selectedMovie.rating,
			content_rating: this.selectedMovie.content_rating,
			duration: this.selectedMovie.duration,
			tags_genre: this.selectedMovie.tags_genre,
			tags_director: this.selectedMovie.tags_director,
			tags_writer: this.selectedMovie.tags_writer,
			tags_star: this.selectedMovie.tags_star,
			year: this.selectedMovie.year,
			tags_country: this.selectedMovie.tags_country,
			audience_rating: this.selectedMovie.audience_rating,
			slug: this.selectedMovie.slug,
		};
	},
	watch: {
	},
	methods: {
		openConfirmDialog() {
			this.dialog.showModal()
		},
		async updateMovie() {
			this.eventBus.emit("showHideLoader", true);

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (!refreshResponse.success) {
				let mergedStatus = { ...this.serverStatus, ...refreshResponse };
				this.eventBus.emit("updateStatus", mergedStatus);
				return;
			}

			let body = {
				title: this.title,
				original_title: this.original_title,
				tagline: this.tagline,
				summary: this.summary,
				studio: this.studio,
				rating: this.rating,
				content_rating: this.content_rating,
				duration: this.duration,
				tags_genre: this.tags_genre,
				tags_director: this.tags_director,
				tags_writer: this.tags_writer,
				tags_star: this.tags_star,
				year: this.year,
				tags_country: this.tags_country,
				audience_rating: this.audience_rating,
				slug: this.slug,
			};

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL(`/api/movies/${this.selectedMovie.movieId}`, this.baseUrl);

			let request = new Request(
				requestUrl.toString(), {
				method: 'PUT',
				headers: headerObj,
				body: JSON.stringify(body)
			});

			try {
				let response = await fetch(request);
				const data = await response.json();

				if (data.success) {
					this.eventBus.emit("movieUpdated");
				}

				this.serverStatus.code = data.code;
				this.serverStatus.message = data.message;
				this.serverStatus.success = data.success;
				this.eventBus.emit("updateStatus", (this.serverStatus));

			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				// this.addUserLog(this.appState, "Update Movie Details");
				this.eventBus.emit("showHideLoader", false);
				this.addUserLog(this.appState, `Update Movie Details. MovieId: ${this.selectedMovie.movieId}`);
			}
		},
		cancel() {
			// Event is movieUpdated but it can work as a cancel as well
			// The event handler only closes conponent and refreshes movie list
			this.eventBus.emit("movieUpdated");
		}
	},
	mounted() {
		this.dialog = document.getElementById("confirmEdit");
	},
	created() {
	},
}; 
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
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

#fieldset-one,
#fieldset-two {
	width: 40%;
	display: flex;
	flex-direction: column;
	margin: 0 auto 15px;
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