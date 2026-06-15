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
			<button class="prev-button" type="button" @click="previousPage()">previous</button>
			<button class="next-button" type="button" @click="nextPage()">next</button>
			<span :currentPage="currentPage">page {{ currentPage }}</span>
		</div>

		<div id="movies">
			<div id="cards">
				<div class="card" v-for="(item, index) in movieList" :key="index">
					<div class="inner">
						<div class="title-description">
							<h2 :title="item.original_title ? `Original Title: ${item.original_title}` : ''">
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
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
// @ is an alias to /src
import { ref } from "vue";
// import session from "@/dependencies/sessionMethods";
import router from "@/router";
import { onBeforeUnmount } from "vue";

export default {
	name: "MovieDatabase",
	props: {
		appState: Object,
		isMobile: Boolean
	},
	components: {},
	data() {
		return {
			postStatus: Object.assign({}, this.appNotify),
			limit: 5,
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
			movieList: []
		};
	},
	watch: {
		limit() {
			this.currentPage = 1;
			this.offset = null;
			this.getMovieList();
		},
		sortBy() {
			this.currentPage = 1;
			this.offset = null;
			this.getMovieList();
		},
	},
	methods: {
		async getMovieList() {
			this.eventBus.emit("showHideLoader", true);
			this.eventBus.emit("checkIfRefreshNeeded");

			let headerObj = new Headers();
			headerObj.append("Authorization", `Bearer ${this.appState.accessToken}`);
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("/api/userlogs/movies/", this.baseUrl);

			let params = requestUrl.searchParams;
			params.set("limit", this.limit);
			params.set("offset", this.offset);
			params.set("sort", this.sortBy);
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
			if (this.movieList.length < this.limit) return;
			this.offset = this.offset + this.limit;
			this.currentPage++;
			this.getMovieList();
		},
	},
	mounted() {
		this.getMovieList();
	},
	created() {
		// this.eventBus.emit("eventTest", "Component Created");
		// onBeforeUnmount(() => {
		// 	this.eventBus.off("eventTest");
		// });
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
	/* position: relative; */
	display: grid;
	justify-content: center;
	align-content: center;
	grid-template-columns: repeat(5, 20%);
	/* grid-template-rows: minmax(100px, auto) repeat(5, 200px); */
	background: rgba(92, 89, 136, 0.38);
	margin: auto;
	border-radius: 1.25em;
	/* padding: 30px; */
}

/* #cards > div {
	margin: 2px auto;
	min-width: 3em;
	font-size: 2rem;
	border: 1px solid #fff;
	outline: none;
	cursor: pointer;
	background-color: rgba(255, 255, 255, 0.6);
	transition: transform 0.2s;
} */

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
</style>