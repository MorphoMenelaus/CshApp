<template>

	<div>
		<h1>Movie Database</h1>

		<div class="favorite-check" v-if="favoritesList.length > 0">
			<label for="favoritesOnly">Favorites only</label>
			<input id="favoritesOnly" type="checkbox" v-model="favoritesOnly" />
		</div>
		<div id="paging" v-if="!favoritesOnly || favoritesList.length === 0">
			<label for="limitOptions">Limit List</label>
			<select v-model="limit">
				<option v-for="(item, index) in limitOptions" :key="index" :value="item.value">{{ item.text }}
				</option>
			</select>
			<div v-if="appState?.permissions.admin">
				<label for="sortByOptions">Sort By</label>
				<select v-model="sortBy">
					<option v-for="(item, index) in sortByOptions" :key="index" :value="item.value">{{ item.text }}
					</option>
				</select>
			</div>
			<input v-model="contains" placeholder="Title contains..." />
			<span v-if="contains.length > 0" title="Clear search" @click="contains = ''" class="clear-field">❌</span>
			<button class="prev-button btn" type="button" @click="previousPage()"
				title="Previous Page">previous</button>
			<button class="next-button btn" type="button" @click="nextPage()" title="Next Page">next</button>
			<span :currentPage="currentPage">page {{ currentPage }}</span>
		</div>

		<div id="movies">
			<div id="cards" v-if="movieList?.length > 0">
				<div class="card" v-for="(item, index) in movieList" :key="index">
					<button v-if="appState?.permissions.admin" class="btn edit" @click="editThisEntry(item)"
						title="Edit this movie's detils">Edit</button>
					<div class="inner">
						<div class="title-description">
							<h2 :title="item.original_title ? item.original_title : ''">
								{{ item.title }}</h2>
							<h3>{{ item.tagline }}</h3>
							<p class="genr-year">
								<small>{{ item.tags_genre }}</small>
								<small>{{ item.year }}</small>
							</p>
							<!-- <p>{{ item.summary }}</p> -->
						</div>
						<div class="image-container">
							<img :alt="item.title" :title="item.summary" :src="`./media-poster/${item.slug}.jpg`" />
						</div>
						<span id="favorite" :class="favoritesList.includes(item.movieId) ? 'favs' : ''"
							@click="favoritesHandler(item.movieId)"
							:title="`${favoritesList.includes(item.movieId) ? 'Remove from' : 'Add to'} favorites`">🔖</span>
						<span v-if="item.content_rating.length > 0" class="content-rating">{{ item.content_rating
						}}</span>
					</div>
				</div>
			</div>
			<div v-else>
				<h1>No Results Found</h1>
			</div>
			<div class="button-container" v-if="!favoritesOnly || favoritesList.length === 0">
				<button class="prev-button btn" type="button" @click="previousPage()"
					title="Previous Page">previous</button>
				<button class="next-button btn" type="button" @click="nextPage()" title="Next Page">next</button>
			</div>
		</div>

		<component :is="currentComponent" :appState="appState" :selectedMovie="selectedMovie"
			:favoritesList="favoritesList" />

	</div>
</template>

<script>
// @ is an alias to /src
import { onBeforeUnmount } from "vue";
import EditMovieDetails from "@/components/EditMovieDetails.vue";
// Test placeholderData
// import placeholderData from "@/dependencies/movies.json";

export default {
	name: "MovieDatabase",
	props: {
		appState: Object,
		isMobile: Boolean,
		windowWidth: Number
	},
	components: {
		EditMovieDetails
	},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			limit: 10,
			offset: 0,
			currentPage: 1,
			limitOptions: [],
			sortByOptions: [
				{ text: "Title", value: "title" },
				{ text: "Rating", value: "rating" },
				{ text: "Year", value: "year" },
				{ text: "Director", value: "tags_director" },
				{ text: "Genre", value: "tags_genre" },
			],
			sortBy: "title",
			contains: "",
			movieList: [],
			// Test placeholderData
			// movieList: placeholderData,
			currentComponent: null,
			selectedMovie: {},
			favoritesList: [],
			movieFavorites: [],
			favoritesOnly: false,
			columns: 1,
		};
	},
	watch: {
		async limit() {
			this.currentPage = 1;
			this.offset = 0;
			if (this.favoritesOnly) {
				await this.getMovieByFavorites();
				this.movieList = this.movieFavorites;
			} else {
				this.getMovieList();
			}
		},
		sortBy() {
			this.currentPage = 1;
			this.offset = 0;
			this.getMovieList();
		},
		contains() {
			this.currentPage = 1;
			this.offset = 0;
			this.getMovieList();
		},
		windowWidth() {
			this.populateLimits();
		},
		async favoritesOnly() {
			if (this.favoritesOnly) {
				await this.getMovieByFavorites();
				this.movieList = this.movieFavorites;
			} else {
				this.getMovieList();
			}
		}
	},
	methods: {
		populateLimits() {
			let width = this.windowWidth;
			let multiplier;
			switch (true) {
				case width < 576:
					multiplier = 1;
					break;
				case width < 768:
					multiplier = 1;
					break;
				case width < 1024:
					multiplier = 2;
					break;
				case width < 1200:
					multiplier = 3;
					break;
				case width < 1800:
					multiplier = 4;
					break;
				case width < 2400:
					multiplier = 5;
					break;
				case width < 2800:
					multiplier = 6;
					break;
				case width >= 2800:
					multiplier = 7;
					break;
				default:
					multiplier = 1;
			};
			let limitBase = [2, 4, 6, 8, 10]
			this.limitOptions = [];
			limitBase.forEach(limit => {
				console.log(limit * multiplier);
				let limitCbj = { text: "", value: null }
				limitCbj.text = (limit * multiplier).toString();
				limitCbj.value = (limit * multiplier);
				this.limitOptions.push(limitCbj);
			})

			// set defaults for limit and columns
			this.limit = 2 * multiplier;
			this.columns = multiplier;
		},
		favoritesHandler(movieId) {
			if (this.favoritesList.includes(movieId)) {
				this.removeFavorite(movieId);
			} else {
				this.setFavorite(movieId)
			}
		},
		editThisEntry(movie) {
			this.selectedMovie = movie;
			this.currentComponent = "EditMovieDetails";
		},
		async setFavorite(movieId) {
			// this.eventBus.emit("showHideLoader", true);

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (!refreshResponse.success) {
				let mergedStatus = { ...this.serverStatus, ...refreshResponse };
				this.eventBus.emit("updateStatus", mergedStatus);
				return;
			}

			let body = {
				userId: this.appState.user.userId,
				movieId: movieId
			};

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL('/api/movies/favorites', this.baseUrl);

			let request = new Request(
				requestUrl.toString(), {
				method: 'POST',
				headers: headerObj,
				body: JSON.stringify(body)
			});

			try {
				let response = await fetch(request);
				const data = await response.json();

				if (data.success) {
					this.eventBus.emit("favoriteUpdated");
					this.getFavoriteList();
				}

				this.serverStatus.code = data.code;
				this.serverStatus.message = data.message;
				this.serverStatus.success = data.success;
				// this.eventBus.emit("updateStatus", (this.serverStatus));

			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				// this.addUserLog(this.appState, "Update Movie Details");
			}
		},
		async removeFavorite(movieId) {

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (!refreshResponse.success) {
				let mergedStatus = { ...this.serverStatus, ...refreshResponse };
				this.eventBus.emit("updateStatus", mergedStatus);
				return;
			}

			let body = {
				movieId: movieId
			};

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL(`/api/movies/favorites/${this.appState.user.userId}`, this.baseUrl);

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
					this.eventBus.emit("favoriteUpdated");
					this.getFavoriteList();
				}

				this.serverStatus.code = data.code;
				this.serverStatus.message = data.message;
				this.serverStatus.success = data.success;
				// this.eventBus.emit("updateStatus", (this.serverStatus));

			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				// this.addUserLog(this.appState, "Update Movie Details");
			}
		},
		async getFavoriteList() {
			// this.eventBus.emit("showHideLoader", true);

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (!refreshResponse.success) {
				let mergedStatus = { ...this.serverStatus, ...refreshResponse };
				this.eventBus.emit("updateStatus", mergedStatus);
				return;
			}

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL(`/api/movies/favorites/${this.appState.user.userId}`, this.baseUrl);

			let params = requestUrl.searchParams;
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

				this.favoritesList = data?.userFavorites || [];

			} catch (error) {
				console.error('Error posting data:', error);
				this.serverStatus.code = 500;
				this.serverStatus.message = `Error getting data: ${error}`;
				this.serverStatus.success = false;
				this.eventBus.emit("updateStatus", (this.serverStatus));
			} finally {
				// this.eventBus.emit("showHideLoader", false);
			}
		},
		async getMovieByFavorites() {
			this.eventBus.emit("showHideLoader", true);

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (!refreshResponse.success) {
				let mergedStatus = { ...this.serverStatus, ...refreshResponse };
				this.eventBus.emit("updateStatus", mergedStatus);
				return;
			}

			let body = {
				movieIds: this.favoritesList
			}

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("/api/movies/", this.baseUrl);

			let request = new Request(
				requestUrl.toString(), {
				method: 'POST',
				headers: headerObj,
				body: JSON.stringify(body)
			});

			try {
				let response = await fetch(request);
				let data = await response.json();
				this.movieFavorites = data.movies;

			} catch (error) {
				console.error('Error posting data:', error);
				this.serverStatus.code = 500;
				this.serverStatus.message = `Error getting data: ${error}`;
				this.serverStatus.success = false;
				this.eventBus.emit("updateStatus", (this.serverStatus));
			} finally {
				this.eventBus.emit("showHideLoader", false);
			}
		},
		async getMovieList() {
			this.eventBus.emit("showHideLoader", true);

			const refreshResponse = await this.refreshAuthTokenAsNeeded(this.appState);
			if (!refreshResponse.success) {
				let mergedStatus = { ...this.serverStatus, ...refreshResponse };
				this.eventBus.emit("updateStatus", mergedStatus);
				return;
			}

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("/api/movies/", this.baseUrl);

			let params = requestUrl.searchParams;
			params.set("limit", this.limit);
			params.set("offset", this.offset);
			params.set("sort", this.sortBy);
			params.set("keyword", this.contains);
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
				this.movieList = data.movies;

				this.getFavoriteList();

			} catch (error) {
				console.error('Error posting data:', error);
				this.serverStatus.code = 500;
				this.serverStatus.message = `Error getting data: ${error}`;
				this.serverStatus.success = false;
				this.eventBus.emit("updateStatus", (this.serverStatus));
			} finally {
				this.eventBus.emit("showHideLoader", false);
			}
		},
		previousPage() {
			if (this.currentPage == 1) return;
			this.currentPage--;
			this.offset = this.offset - this.limit;
			this.getMovieList();
		},
		nextPage() {
			if (this.movieList?.length < this.limit) return;
			this.offset = this.offset + this.limit;
			this.currentPage++;
			this.getMovieList();
		},
	},
	mounted() {
		this.limit = this.columns * 2;
		this.populateLimits();
		this.getMovieList();
	},
	created() {
		this.eventBus.on("movieUpdated", () => {
			this.currentComponent = null;
			this.getMovieList();
		});
		onBeforeUnmount(() => {
			this.eventBus.off("movieUpdated");
		});
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
	text-align: center;
}

#movies {
	padding-bottom: 90px;
}

#cards {
	display: grid;
	justify-content: center;
	align-content: center;
	grid-template-columns: repeat(1, 1fr);
	background: rgba(92, 89, 136, 0.38);
	margin: auto;
	border-radius: 1.25em;
	font-size: 18px;
}

.card {
	position: relative;
}

.card .inner {
	color: #000;
	background-color: #abb8f1;
	border: 1px solid #777;
	border-radius: 12px;
	flex-direction: column;
	justify-content: space-between;
	width: 90%;
	height: 460px;
	margin: 30px auto;
	display: flex;
}

.uiDarkMode .card .inner {
	background-color: #313b64;
	color: inherit;
}

.title-description {
	padding: 5px 15px;
	text-align: center;
}

.genr-year {
	display: flex;
	justify-content: space-evenly;
}

.image-container {
	width: 200px;
	height: 300px;
	overflow: hidden;
	margin: 15px auto;
	border-radius: 8px;
	border: 1px #999 solid;
	user-select: none;
}

img {
	width: 200px;
	min-height: 300px;
}

#paging {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	width: 40%;
	margin: 30px auto 15px;
	color: #000;
	font-size: 18px;
}

.uiDarkMode #paging {
	color: inherit;
}

.mobile #paging {
	width: 90%;
	margin: 30px auto;
}

.clear-field {
	background-color: #ccc;
	padding: 0px 2px 1px;
	border-radius: 6px;
	cursor: pointer;
}

.uiDarkMode .clear-field {
	background-color: #fff;
}


.button-container {
	display: flex;
	justify-content: center;
	align-self: center;
	margin-top: 30px;
}

.button-container button {
	margin: 0 15px;
}

.btn.edit {
	position: relative;
	top: 45px;
	left: 5px;
}

.content-rating {
	position: absolute;
	bottom: 40px;
	right: 30px;
	background-color: #a39595;
	padding: 0 8px;
	border-radius: 8px;
	color: #000;
	font-weight: bold;
	border: 1px #000 solid;
	user-select: none;
}

#favorite {
	font-size: 1.25em;
	background-color: rgb(163 149 149 / 40%);
	left: 30px;
	bottom: 40px;
	position: absolute;
	border: 1px #000 solid;
	border-radius: 8px;
	cursor: pointer;
	user-select: none;
}

#favorite.favs {
	background-color: #ff0;
}

.uiDarkMode #favorite.favs {
	background-color: #afaf03;
}

.favorite-check {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 15px 0;
	color: #000;
}

.uiDarkMode .favorite-check {
	color: inherit;
}

.favorite-check input {
	margin-left: 10px;
}

@media (min-width: 576px) {
	#cards {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 768px) {
	#cards {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 1024px) {
	#cards {
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (min-width: 1200px) {
	#cards {
		grid-template-columns: repeat(4, 1fr);
	}
}

@media (min-width: 1800px) {
	#cards {
		grid-template-columns: repeat(5, 1fr);
	}
}

@media (min-width: 2400px) {
	#cards {
		grid-template-columns: repeat(6, 1fr);
	}
}

@media (min-width: 2800px) {
	#cards {
		grid-template-columns: repeat(7, 1fr);
	}
}
</style>