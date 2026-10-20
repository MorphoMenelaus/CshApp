<script setup>
import { ref, shallowRef, computed, watch, onMounted, onBeforeMount, onBeforeUnmount, inject, provide } from "vue";
import { tokenInterceptFetch } from "@/dependencies/csh-libs.js";
import EditMovieDetails from "@/components/EditMovieDetails.vue";
import MovieDetails from "@/components/MovieDetails.vue";
import { appNotify } from "@/dependencies/models.js";

const props = defineProps({
	appState: Object,
	isMobile: Boolean,
	windowWidth: Number,
});

const serverStatus = Object.assign({}, appNotify);
const copyright = inject("copyright");
const baseUrl = inject("baseUrl");
const showHideLoader = inject("showHideLoader");
const updateStatus = inject("sendUpdateStatus");
const forceLogout = inject("forceLogout");
const loginShow = inject("loginShow");
const registerUser = inject("registerUser");
const sortByOptions = [
	{ text: "Title", value: "title" },
	{ text: "Rating", value: "rating" },
	{ text: "Year", value: "year" },
	{ text: "Director", value: "tags_director" },
	{ text: "Genre", value: "tags_genre" },
];

const dialog = ref(null);
const modalContainer = ref(null);
const limit = ref(10);
const offset = ref(0);
const currentPage = ref(1);
const pages = ref(0);
const totalMovies = ref(0);
const totalMoviesFromKeywords = ref(0);
const limitOptions = ref([]);
const sortBy = ref("year");
const orderDir = ref("DESC");
const contains = ref("");
const movieList = ref([]);
const currentComponent = shallowRef(null);
const selectedMovie = ref({});
const favoritesList = ref([]);
const movieFavorites = ref([]);
const favoritesOnly = ref(false);
const columns = ref(1);

const prevDisable = computed(() => currentPage.value <= 1);
const nextDisable = computed(() => currentPage.value >= pages.value);

const getMovieList = async () => {
	showHideLoader(true);

	let headerObj = new Headers();
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL("/api/movies/", baseUrl);

	let params = requestUrl.searchParams;
	params.set("limit", limit.value);
	params.set("offset", offset.value);
	params.set("sort", sortBy.value);
	params.set("order", orderDir.value);
	params.set("keyword", contains.value);
	params.set("time", new Date().getTime());
	requestUrl.search = params.toString();

	let request = new Request(requestUrl.toString(), {
		method: "GET",
		headers: headerObj,
	});

	try {
		let response = await fetch(request);
		let data = await response.json();

		if (data?.code === 403) {
			data.forced = true;
			forceLogout(data);
		}

		movieList.value = data.movies;
		totalMovies.value = data.tableRowCount;
		totalMoviesFromKeywords.value = data.totalLikeRows;
		pages.value = contains.value.length > 0 ? Math.ceil(data.totalLikeRows / limit.value) : Math.ceil(totalMovies.value / limit.value);

		getFavoriteList();
	} catch (error) {
		console.error("Error posting data:", error);
		serverStatus.code = 500;
		serverStatus.message = `Error getting data: ${error}`;
		serverStatus.success = false;
		updateStatus(serverStatus);
	} finally {
		scrollToTop();
		showHideLoader(false);
	}
};

const getFavoriteList = async () => {
	if (!props.appState?.permissions?.verified) {
		return;
	}

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL(`/api/movies/favorites/${props.appState.user.userId}`, baseUrl);

	let params = requestUrl.searchParams;
	params.set("time", new Date().getTime());
	requestUrl.search = params.toString();

	let request = new Request(requestUrl.toString(), {
		method: "GET",
		headers: headerObj,
	});

	try {
		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		favoritesList.value = data?.userFavorites || [];
	} catch (error) {
		console.error("Error posting data:", error);
		serverStatus.code = 500;
		serverStatus.message = `Error getting data: ${error}`;
		serverStatus.success = false;
		updateStatus(serverStatus);
	}
};

const getMovieByFavorites = async () => {
	showHideLoader(true);

	let body = {
		movieIds: favoritesList.value,
	};

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL("/api/movies/", baseUrl);

	let request = new Request(requestUrl.toString(), {
		method: "POST",
		headers: headerObj,
		body: JSON.stringify(body),
	});

	try {
		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		movieFavorites.value = data.movies;
	} catch (error) {
		console.error("Error posting data:", error);
		serverStatus.code = 500;
		serverStatus.message = `Error getting data: ${error}`;
		serverStatus.success = false;
		updateStatus(serverStatus);
	} finally {
		scrollToTop();
		showHideLoader(false);
	}
};

const setFavorite = async (movieId) => {
	let body = {
		userId: props.appState.user.userId,
		movieId: movieId,
	};

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL("/api/movies/favorites", baseUrl);

	let request = new Request(requestUrl.toString(), {
		method: "POST",
		headers: headerObj,
		body: JSON.stringify(body),
	});

	try {
		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		if (data.success) {
			getFavoriteList();
		}

		serverStatus.code = data.code;
		serverStatus.message = data.message;
		serverStatus.success = data.success;
		if (serverStatus.code !== 200) updateStatus(serverStatus);
	} catch (error) {
		console.error("Error fetching data:", error);
	}
};

const removeFavorite = async (movieId) => {
	let body = {
		movieId: movieId,
	};

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL(`/api/movies/favorites/${props.appState.user.userId}`, baseUrl);

	let request = new Request(requestUrl.toString(), {
		method: "PUT",
		headers: headerObj,
		body: JSON.stringify(body),
	});

	try {
		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		if (data.success) {
			getFavoriteList();
		}

		serverStatus.code = data.code;
		serverStatus.message = data.message;
		serverStatus.success = data.success;
		if (serverStatus.code !== 200) updateStatus(serverStatus);
	} catch (error) {
		console.error("Error fetching data:", error);
	}
};

const refreshMoviesWithFaves = async () => {
	if (favoritesOnly.value) {
		await getMovieByFavorites();
		movieList.value = movieFavorites.value;
	} else {
		getMovieList();
	}
};

const previousPage = () => {
	if (currentPage.value == 1) return;
	currentPage.value--;
	offset.value = offset.value - limit.value;
	getMovieList();
};

const nextPage = () => {
	if (movieList.value.length < limit.value) return;
	offset.value = offset.value + limit.value;
	currentPage.value++;
	getMovieList();
};

const closeModal = (refresh = true) => {
	currentComponent.value = null;
	selectedMovie.value = null;
	if (refresh) refreshMoviesWithFaves();
};

const keyDown = (e) => {
	if (e.key === "Escape") {
		currentComponent.value = null;
		dialog.value.close();
	}
};

const clickHandler = (e) => {
	if (e.target.id === "movie-details") currentComponent.value = null;
};

const showRegisterUserComponent = (login = false, register = false) => {
	dialog.value.close();
	loginShow(login);
	registerUser(register);
};

const openPermissionsDialog = () => {
	dialog.value.showModal();
};

const populateLimits = () => {
	let width = props.windowWidth;
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
	}
	let limitBase = [2, 4, 6, 8, 10];
	limitOptions.value = [];
	limitBase.forEach((limit) => {
		let limitObj = { text: "", value: null };
		limitObj.text = (limit * multiplier).toString();
		limitObj.value = limit * multiplier;
		limitOptions.value.push(limitObj);
	});

	// set defaults for limit and columns
	limit.value = 2 * multiplier;
	columns.value = multiplier;
};

const favoritesHandler = (movieId) => {
	if (!props.appState?.permissions?.verified) {
		openPermissionsDialog();
		return;
	}

	if (favoritesList.value.includes(movieId)) {
		removeFavorite(movieId);
	} else {
		setFavorite(movieId);
	}
};

const viewThisEntry = (movie) => {
	selectedMovie.value = movie;
	currentComponent.value = MovieDetails;
};

const editThisEntry = (movie) => {
	selectedMovie.value = movie;
	currentComponent.value = EditMovieDetails;
};

const scrollToTop = () => {
	let container = document.getElementById("app");
	container.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};

watch([sortBy, orderDir, contains], () => {
	currentPage.value = 1;
	offset.value = 0;
	getMovieList();
});

watch(limit, (newLimit) => {
	currentPage.value = 1;
	offset.value = 0;
	pages.value = contains.value.length > 0 ? Math.ceil(totalMoviesFromKeywords.value / newLimit) : Math.ceil(totalMovies.value / newLimit);
	refreshMoviesWithFaves();
});

watch(
	() => props.windowWidth,
	() => {
		populateLimits();
	},
);

watch(favoritesOnly, () => {
	refreshMoviesWithFaves();
});

onBeforeMount(() => {
	provide("movieUpdated", closeModal);
	window.addEventListener("keydown", keyDown);
});

onBeforeUnmount(() => {
	window.removeEventListener("keydown", keyDown);
	modalContainer.value.removeEventListener("click", clickHandler);
});

onMounted(() => {
	limit.value = columns.value * 2;
	populateLimits();
	getMovieList();
	dialog.value = document.getElementById("not-allowed");
	modalContainer.value = document.getElementById("modal-container");
	modalContainer.value.addEventListener("click", clickHandler);
});
</script>

<template>
	<main>
		<h1 class="julius-sans">Movie Database</h1>
		<div id="movie-header">
			<p>
				This page queries a searchable list of more than 1500 movies in my database containing cast, crew, ratings, etc., and sortable by title, rating,
				year, director or genra. This UI fully demonstrates database interactions as a guest or public user but additional features are available for
				registered users. For example, full editing abilities for each entry if your account has edit permissions or favorites can be saved to your
				registred account with any access level.
			</p>
		</div>

		<div class="favorite-check" v-if="favoritesList.length > 0">
			<label for="favoritesOnly" title="Show only movies in your favorites list">Favorites only</label>
			<input id="favoritesOnly" title="Show only movies in your favorites list" type="checkbox" v-model="favoritesOnly" />
		</div>
		<div id="paging" v-if="!favoritesOnly || favoritesList.length === 0">
			<div class="center">
				<label for="limitOptions">Limit List</label>
				<select v-model="limit">
					<option v-for="(item, index) in limitOptions" :key="index" :value="item.value">{{ item.text }}</option>
				</select>
			</div>
			<div class="flex-row">
				<label
					for="sortByOptions"
					title="Click to toggle sort order"
					class="link"
					@click="orderDir === 'ASC' ? (orderDir = 'DESC') : (orderDir = 'ASC')"
					>Sort By</label
				>
				<div class="order">
					<small title="Click to toggle sort order" @click="orderDir === 'ASC' ? (orderDir = 'DESC') : (orderDir = 'ASC')">{{
						orderDir === "ASC" ? "Ascend" : "Descend"
					}}</small>
					<select v-model="sortBy">
						<option v-for="(item, index) in sortByOptions" :key="index" :value="item.value">{{ item.text }}</option>
					</select>
				</div>
			</div>
			<div class="form-group">
				<input v-model="contains" placeholder="Title contains..." />
				<span v-if="contains.length > 0" title="Clear search" @click="contains = ''" class="clear-field">✕</span>
			</div>
			<div>
				<button class="prev-button btn" :disabled="prevDisable" type="button" @click="previousPage()" title="Previous Page">previous</button>
				<button class="next-button btn" :disabled="nextDisable" type="button" @click="nextPage()" title="Next Page">next</button>
				<span :currentPage="currentPage">page {{ currentPage }} / {{ pages.toFixed() }}</span>
			</div>
		</div>
		<div id="movies">
			<div id="cards" v-if="movieList?.length > 0">
				<div class="card" v-for="(item, index) in movieList" :key="index">
					<button v-if="appState?.permissions?.admin" class="btn edit" @click="editThisEntry(item)" title="Edit this movie's detils">Edit</button>
					<!-- <div v-if="item.original_title" class="summary-pop">
							<p>{{ item.summary }}</p>
						</div> -->
					<div class="inner">
						<div class="title-description" :title="`View details for ${item.title}`" @click="viewThisEntry(item)">
							<h2 :title="item.original_title ? item.original_title : ''">
								{{ item.title }}
							</h2>
							<h3>{{ item.tagline }}</h3>
							<p class="genr-year">
								<small>{{ item.tags_genre }}</small>
								<small>{{ item.year }}</small>
							</p>
							<!-- <p>{{ item.summary }}</p> -->
						</div>
						<div class="image-container" :title="`View details for ${item.title}`" @click="viewThisEntry(item)">
							<img :alt="item.title" :src="`./media-poster/${item.slug}.jpg`" />
						</div>
						<span
							id="favorite"
							:class="favoritesList.includes(item.movieId) ? 'favs' : ''"
							@click="favoritesHandler(item.movieId)"
							:title="`${favoritesList.includes(item.movieId) ? 'Remove from' : 'Add to'} favorites`"
							>🔖</span
						>
						<span v-if="item.content_rating.length > 0" class="content-rating">{{ item.content_rating }}</span>
					</div>
				</div>
			</div>
			<div v-else>
				<h1>No Results Found</h1>
			</div>
			<div class="button-container" v-if="!favoritesOnly || favoritesList.length === 0">
				<button class="prev-button btn" :disabled="prevDisable" type="button" @click="previousPage()" title="Previous Page">previous</button>
				<button class="next-button btn" :disabled="nextDisable" type="button" @click="nextPage()" title="Next Page">next</button>
			</div>
		</div>

		<div id="modal-container">
			<component :is="currentComponent" :appState="appState" :selectedMovie="selectedMovie" :favoritesList="favoritesList" :isMobile="isMobile" />
		</div>

		<div id="permissions-dialog-container">
			<dialog id="not-allowed">
				<div>
					<h2>Saving Favorites requires a verified account</h2>
					<p>You must be logged in with a verified account to save to your fovorites list.</p>
					<div class="dialog-buttons">
						<button class="btn" @click="showRegisterUserComponent(false, true)" title="Click to register">Click to register</button>
						<button class="btn" title="Login here" @click="showRegisterUserComponent(true, false)">Login here</button>
						<button class="btn cancel" @click="dialog.close()">Close</button>
					</div>
				</div>
			</dialog>
		</div>
		<div id="copyright">
			<small v-html="copyright"></small>
		</div>
	</main>
</template>

<style scoped>
h1,
h2 {
	text-align: center;
}

h1 {
	margin-top: 1em;
	font-size: 3em;
}

#movie-header {
	background-color: #e7e7e7;
	color: #000;
	width: fit-content;
	max-width: 95%;
	margin: 30px auto auto;
	padding: 15px 30px 30px;
	border-radius: 12px;
	border: 1px #aaa solid;
}

#movie-header p {
	text-indent: 1.5em;
}

.uiDarkMode #movie-header {
	background-color: #333;
	color: #c1c1c1;
}

#movies {
	/* padding-bottom: 90px; */
	padding: 15px 15px 90px;
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
	cursor: pointer;
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
	cursor: pointer;
}

img {
	width: 200px;
	min-height: 300px;
}

#paging {
	color: #000;
	font-size: 18px;
}

.mobile #paging {
	display: grid;
}

label[for="limitOptions"] {
	margin-right: 15px;
}

#paging .btn {
	margin: auto 5px;
}

.mobile #paging .center {
	display: block;
	margin: auto;
}

#paging .flex-row {
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
}

.mobile #paging .flex-row {
	margin: 15px auto 0;
}

#paging .flex-row * {
	margin: auto 3px;
}

.clear-field {
	padding: 4px;
	background-color: #ccc;
	color: #000;
	font-size: 0.9em;
	line-height: 0.9em;
	font-weight: bold;
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

.order {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	bottom: 10px;
}

.order small {
	background-color: #238519;
	color: #fff;
	padding: 0 5px;
	line-height: 1.25em;
	margin-bottom: 3px;
	cursor: pointer;
	position: relative;
	bottom: 5px;
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

label[for="favoritesOnly"] {
	cursor: pointer;
}

#permissions-dialog-container dialog {
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

p.movie-intro {
	width: 95%;
	margin: auto;
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

	#movie-header {
		width: 90%;
	}
}

@media (min-width: 1024px) {
	#cards {
		grid-template-columns: repeat(3, 1fr);
	}

	#movie-header {
		width: 85%;
	}
}

@media (min-width: 1200px) {
	#cards {
		grid-template-columns: repeat(4, 1fr);
	}

	#movie-header {
		width: 80%;
	}
}

@media (min-width: 1800px) {
	#cards {
		grid-template-columns: repeat(5, 1fr);
	}

	#movie-header {
		width: 70%;
	}
}

@media (min-width: 2400px) {
	F #cards {
		grid-template-columns: repeat(6, 1fr);
	}

	#movie-header {
		width: 60%;
	}
}

@media (min-width: 2800px) {
	#cards {
		grid-template-columns: repeat(7, 1fr);
	}
}
</style>
