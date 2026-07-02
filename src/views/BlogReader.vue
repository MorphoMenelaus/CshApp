<template>
	<div>
		<div id="blogs">
			<div>
				<h1>Blog</h1>
			</div>
			<div>
				<div id="paging">
					<label for="limitOptions">Limit{{ isMobile ? '' : ' List' }}</label>
					<select v-model="limit" id="limitOptions">
						<option v-for="(item, index) in limitOptions" :key="index" :value="item.value">{{ item.text }}
						</option>
					</select>
					<label for="sortBy" title="Click to toggle sort order" class="link"
						@click="orderDir === 'ASC' ? orderDir = 'DESC' : orderDir = 'ASC'">Sort By</label>
					<div class="order">
						<small title="Click to toggle sort order"
							@click="orderDir === 'ASC' ? orderDir = 'DESC' : orderDir = 'ASC'">{{ orderDir === 'ASC' ?
								'Ascend' : 'Descend' }}</small>
						<select v-model="sortBy" id="sortBy">
							<option v-for="(item, index) in sortByOptions" :key="index" :value="item.value">{{ item.text
							}}
							</option>
						</select>
					</div>
					<button class="prev-button btn" type="button" @click="previousPage()"
						title="Previous Page">previous</button>
					<button class="next-button btn" type="button" @click="nextPage()" title="Next Page">next</button>
					<span :currentPage="currentPage">page {{ currentPage }}</span>
				</div>
				<div class="button-container">
					<button class="btn" :class="item.post_id === selectedBlog?.post_id ? 'selected' : ''"
						v-for="(item, index) in postButtons" :key="index" @click="loadPost(item.post_id)">
						{{ item.post_title }}</button>
				</div>
				<div id="posts" v-if="Object.keys(selectedBlog).length > 0">
					<h1>{{ selectedBlog?.post_title }}</h1>
					<h3>{{ selectedBlog?.post_author }}</h3>
					<div v-html="selectedBlog?.post_content"></div>
				</div>
				<h1 v-else>Click a button to view a blog post</h1>
			</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { ref } from "vue";
import router from "@/router";
import { onBeforeUnmount } from "vue";

export default {
	name: "BlogReader",
	props: {
		appState: Object,
		isMobile: Boolean,
	},
	components: {},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			limit: 10,
			offset: 0,
			currentPage: 1,
			limitOptions: [
				{ text: "5", value: 5 },
				{ text: "10", value: 10 },
				{ text: "15", value: 15 },
				{ text: "20", value: 20 },
				{ text: "50", value: 50 },
			],
			sortByOptions: [
				{ text: "Author", value: "post_author" },
				{ text: "Date", value: "post_date" },
				{ text: "Title", value: "post_title" },
				{ text: "Status", value: "post_status" },
				{ text: "Post Id", value: "post_id" },
			],
			orderDirOptions: [
				{ text: "Descending", value: "DESC" },
				{ text: "Ascending", value: "ASC" },
			],
			orderDir: "ASC",
			sortBy: "post_date",
			blogList: [],
			postButtons: [],
			selectedBlog: {},
		};
	},
	watch: {
		limit() {
			this.getBlogPosts();
		},
		sortBy() {
			this.getBlogPosts();
		},
		orderDir() {
			this.getBlogPosts();
		},
	},
	methods: {
		loadPost(post_id) {
			this.selectedBlog = this.blogList.filter(post => post_id === post.post_id)[0];
		},
		async getBlogPosts() {
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
			let requestUrl = new URL("/api/blog/", this.baseUrl);

			let params = requestUrl.searchParams;
			params.set("limit", this.limit);
			params.set("offset", this.offset);
			params.set("sort", this.sortBy);
			params.set("order", this.orderDir);
			// params.set("keyword", this.contains);
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
				this.blogList = data.posts;

				this.postButtons = [];
				this.blogList.forEach(post => {
					let button = {
						post_id: post.post_id,
						post_title: post.post_title,
						post_id: post.post_id
					}
					if (post.post_status === "publish")
						this.postButtons.push(button);
				});

			} catch (error) {
				console.error('Error reading data:', error);
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
			this.getBlogPosts();
		},
		nextPage() {
			if (this.blogList?.length < this.limit) return;
			this.offset = this.offset + this.limit;
			this.currentPage++;
			this.getBlogPosts();
		},
	},
	mounted() {
		this.getBlogPosts();
	},
	created() {
		this.eventBus.emit("eventTest", "Component Created");
		onBeforeUnmount(() => {
			this.eventBus.off("eventTest");
		});
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2,
h3 {
	text-align: center;
}

#view {
	/* position: relative; */
	width: 100%;
	margin: 15px auto;
	padding: 15px;
	/* padding-bottom: 110px; */
	/* z-index: -1; */
	position: absolute;
	inset: 0;
}

#posts {
	color: #000;
	background-color: #e7e7e7;
	border: 1px solid #555;
	border-radius: 12px;
	margin: 15px auto;
	padding: 30px;
	font-size: 1em;
}

#blogs {
	width: 98%;
	margin: 15px auto;
	padding-bottom: 45px;
}

#paging {
	color: #000;
	font-size: 18px;
}

#paging {
	color: #000;
}

.uiDarkMode #paging {
	color: #c1c1c1;
}

.mobile .order,
.mobile label[for="sortBy"] {
	display: none;
}

.button-container {
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
}

.button-container * {
	padding: 10px 15px;
	margin: 5px;
	max-width: 15em;
	text-overflow: ellipsis;
}

.btn.selected {
	background-color: green;
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
}

@media (min-width: 768px) {
	/* #blogs {
		width: 95%;
	} */
}

@media (min-width: 992px) {
	#blogs {
		width: 90%;
	}

	#latest-summary {
		padding: 30px 60px;
	}
}

@media (min-width: 1200px) {
	#blogs {
		width: 80%;
	}
}

@media (min-width: 1800px) {
	#blogs {
		width: 70%;
	}
}

@media (min-width: 2200px) {
	#blogs {
		width: 60%;
	}
}
</style>