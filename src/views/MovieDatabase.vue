<template>

	<div>
		<h1>Movie List</h1>

		<div id="paging">
			<label for="limitOptions">Limit List</label>
			<select v-model="limit">
				<option v-for="(item, index) in limitOptions" :key="index" :value="item.value">{{ item.text }}
				</option>
			</select>
			<label for="sortByOptions">Sort By</label>
			<select v-model="sortBy">
				<option v-for="(item, index) in sortByOptions" :key="index" :value="item.value">{{ item.text }}
				</option>
			</select>
			<input v-model="contains" placeholder="Title contains..." />
			<span v-if="contains.length > 0" title="Clear search" @click="contains = ''" class="clear-field">❌</span>
			<button class="prev-button btn" type="button" @click="previousPage()">previous</button>
			<button class="next-button btn" type="button" @click="nextPage()">next</button>
			<span :currentPage="currentPage">page {{ currentPage }}</span>
		</div>

		<div id="movies">
			<div id="cards" v-if="movieList?.length > 0">
				<div class="card" v-for="(item, index) in movieList" :key="index">
					<button v-if="appState?.permissions.admin" class="btn edit" @click="editThisEntry(item)">Edit</button>
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
						<span v-if="item.content_rating.length > 0" class="content-rating">{{ item.content_rating }}</span>
					</div>
				</div>
			</div>
			<div v-else>
				<h1>No Results Found</h1>
			</div>
			<div class="button-container">
				<button class="prev-button btn" type="button" @click="previousPage()">previous</button>
				<button class="next-button btn" type="button" @click="nextPage()">next</button>
			</div>
		</div>

		<component :is="currentComponent" :appState="appState" :selectedMovie="selectedMovie" />

	</div>
</template>

<script>
// @ is an alias to /src
import { ref } from "vue";
// import session from "@/dependencies/sessionMethods";
import router from "@/router";
import { onBeforeUnmount } from "vue";
import EditMovieDetails from "@/components/EditMovieDetails.vue";

export default {
	name: "MovieDatabase",
	props: {
		appState: Object,
		isMobile: Boolean
	},
	components: {
		EditMovieDetails
	},
	data() {
		return {
			postStatus: Object.assign({}, this.appNotify),
			limit: 10,
			offset: 0,
			currentPage: 1,
			limitOptions: [
				{ text: "5", value: 5 },
				{ text: "10", value: 10 },
				{ text: "15", value: 15 },
				{ text: "20", value: 20 },
				{ text: "50", value: 50 },
				{ text: "75", value: 75 },
				{ text: "100", value: 100 },
				{ text: "200", value: 200 },
				{ text: "300", value: 300 },
			],
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
			currentComponent: null,
			selectedMovie: {}
		};
	},
	watch: {
		limit() {
			this.currentPage = 1;
			this.offset = 0;
			this.getMovieList();
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
		}
	},
	methods: {
		editThisEntry(movie) {
			this.selectedMovie = movie;
			this.currentComponent = "EditMovieDetails";
		},
		async getMovieList() {
			this.eventBus.emit("showHideLoader", true);
			this.eventBus.emit("checkIfRefreshNeeded");

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("/api/movies/", this.baseUrl);

			let params = requestUrl.searchParams;
			params.set("limit", this.limit);
			params.set("offset", this.offset);
			params.set("sort", this.sortBy);
			params.set("keyword", this.contains);
			requestUrl.search = params.toString();

			let request = new Request(
				requestUrl.toString(), {
				method: 'GET',
				headers: headerObj,
			});

			try {
				let response = await fetch(request);
				let data = await response.json();
				this.movieList = [];
				this.movieList = data.movies;

			} catch (error) {
				console.error('Error posting data:', error);
				this.postStatus.code = 500;
				this.postStatus.message = `Error getting data: ${error}`;
				this.postStatus.success = false;
				this.eventBus.emit("updateStatus", (this.postStatus));
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
	grid-template-columns: repeat(1, 90%);
	background: rgba(92, 89, 136, 0.38);
	margin: auto;
	border-radius: 1.25em;
}

.card {
	position: relative;
}

.card .inner {
	background-color: #313b64;
	border: 1px solid #777;
	border-radius: 12px;
	flex-direction: column;
	justify-content: space-between;
	width: 250px;
	margin: 30px auto;
	display: flex;
	width: 90%;
	height: 460px;
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
}

.mobile #paging {
	width: 90%;
	margin: 30px auto 0;
}

.clear-field {
	background-color: #fff;
	padding: 0px 2px 1px;
	border-radius: 6px;
	cursor: pointer;
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
}

@media (min-width: 1024px) {
	#cards {
		grid-template-columns: repeat(5, 20%);
	}
}
</style>