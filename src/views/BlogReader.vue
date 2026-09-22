<script setup>
import { ref, inject, watch, onMounted } from "vue";
import { isObjNullOrEmpty, tokenInterceptFetch } from "@/dependencies/csh-libs.js";
import { appNotify } from "@/dependencies/models.js";

const props = defineProps({
	appState: Object,
	isMobile: Boolean,
});

const baseUrl = inject("baseUrl");
const updateStatus = inject("sendUpdateStatus");
const showHideLoader = inject("showHideLoader");
const serverStatus = Object.assign({}, appNotify);
const limitOptions = [
	{ text: "5", value: 5 },
	{ text: "10", value: 10 },
	{ text: "15", value: 15 },
	{ text: "20", value: 20 },
	{ text: "50", value: 50 },
];
const sortByOptions = [
	{ text: "Author", value: "post_author" },
	{ text: "Date", value: "post_date" },
	{ text: "Title", value: "post_title" },
	{ text: "Post Id", value: "post_id" },
];
const orderDirOptions = [
	{ text: "Descending", value: "DESC" },
	{ text: "Ascending", value: "ASC" },
];
const postStatusOptions = [
	{ text: "Published", value: "publish" },
	{ text: "Hidden", value: "hidden" },
];
const limit = ref(10);
const offset = ref(0);
const currentPage = ref(1);
const postStatus = ref("publish");
const orderDir = ref("ASC");
const sortBy = ref("post_date");
const blogList = ref([]);
const postButtons = ref([]);
const selectedBlog = ref({});

const loadPost = (post_id) => {
	selectedBlog.value = blogList.value.filter((post) => post_id === post.post_id)[0];
};

const getBlogPosts = async () => {
	showHideLoader(true);

	let headerObj = new Headers();
	headerObj.append("Authorization", `Bearer ${props.appState.accessToken}`);
	headerObj.append("Content-Type", "application/json; charset=utf-8");
	let requestUrl = new URL("/api/blog/", baseUrl);

	let params = requestUrl.searchParams;
	params.set("limit", limit.value);
	params.set("offset", offset.value);
	params.set("sort", sortBy.value);
	params.set("order", orderDir.value);
	params.set("status", postStatus.value);
	params.set("time", new Date().getTime());
	requestUrl.search = params.toString();

	let request = new Request(requestUrl.toString(), {
		method: "GET",
		headers: headerObj,
	});

	try {
		const response = await tokenInterceptFetch(request);
		const data = await response.json();

		blogList.value = data.posts;

		postButtons.value = [];
		blogList.value.forEach((post) => {
			let button = {
				post_id: post.post_id,
				post_title: post.post_title,
			};
			postButtons.value.push(button);
		});
	} catch (error) {
		console.error("Error reading data:", error);
		serverStatus.code = 500;
		serverStatus.message = `Error getting data: ${error}`;
		serverStatus.success = false;
		updateStatus(serverStatus);
	} finally {
		showHideLoader(false);
	}
};

const previousPage = () => {
	if (currentPage.value == 1) return;
	currentPage.value--;
	offset.value = offset.value - limit.value;
	getBlogPosts();
};

const nextPage = () => {
	if (blogList.value?.length < limit.value) return;
	offset.value = offset.value + limit.value;
	currentPage.value++;
	getBlogPosts();
};

watch([limit, sortBy, orderDir, postStatus], () => {
	selectedBlog.value = {};
	getBlogPosts();
});

onMounted(() => {
	getBlogPosts();
});
</script>

<template>
	<div>
		<div id="blogs">
			<div>
				<div class="blog-intro">
					<h1>Blog</h1>
					<p>
						These are all old blog posts from a blog I had over ten years ago. It was originally a Wordpress site but I found an old backup of that
						site including the SQL backup files. All are pretty dated and not using the Wordpress themes and styles but kind of amusing to see past
						posts.
					</p>
					<p>Many posts are hidden and will be unhidden as I clean them up a little but even the ones that are unhidden are pretty rough.</p>
				</div>
			</div>
			<div>
				<div id="paging">
					<label for="limitOptions">Limit{{ isMobile ? "" : " List" }}</label>
					<select v-model="limit" id="limitOptions">
						<option v-for="(item, index) in limitOptions" :key="index" :value="item.value">{{ item.text }}</option>
					</select>
					<label for="sortBy" title="Click to toggle sort order" class="link" @click="orderDir === 'ASC' ? (orderDir = 'DESC') : (orderDir = 'ASC')"
						>Sort By</label
					>
					<div class="order">
						<small title="Click to toggle sort order" @click="orderDir === 'ASC' ? (orderDir = 'DESC') : (orderDir = 'ASC')">{{
							orderDir === "ASC" ? "Ascend" : "Descend"
						}}</small>
						<select v-model="sortBy" id="sortBy">
							<option v-for="(item, index) in sortByOptions" :key="index" :value="item.value">{{ item.text }}</option>
						</select>
					</div>
					<button class="prev-button btn" type="button" @click="previousPage()" title="Previous Page">previous</button>
					<button class="next-button btn" type="button" @click="nextPage()" title="Next Page">next</button>
					<span :currentPage="currentPage">page {{ currentPage }}</span>
				</div>
				<div v-if="appState?.permissions.admin" id="status-container">
					<label for="postStatusOptions">Post Status</label>
					<select v-model="postStatus" id="postStatusOptions">
						<option v-for="(item, index) in postStatusOptions" :key="index" :value="item.value">
							{{ item.text }}
						</option>
					</select>
				</div>
				<div class="button-container">
					<button
						class="btn"
						:class="item.post_id === selectedBlog?.post_id ? 'selected' : ''"
						v-for="(item, index) in postButtons"
						:key="index"
						@click="loadPost(item.post_id)"
					>
						{{ item.post_title }}
					</button>
				</div>
				<div id="posts" v-if="!isObjNullOrEmpty(selectedBlog)">
					<span v-if="selectedBlog?.post_status == 'hidden'" class="hidden-post">Post is hidden</span>
					<h1>{{ selectedBlog?.post_title }}</h1>
					<h3>{{ selectedBlog?.post_author }}</h3>
					<span class="post-date">Published: {{ new Date(selectedBlog?.post_date).toLocaleDateString("en-US") }}</span>
					<div v-html="selectedBlog?.post_content"></div>
				</div>
				<h1 v-else>Click a button to view a blog post</h1>
			</div>
		</div>
	</div>
</template>

<style>
/* BEGIN Blog styles - not scoped */
#posts .indent {
	text-indent: 3em;
}

#posts .subhead {
	text-align: center;
	margin: 10px auto 20px;
	font-weight: 500;
}

#posts > div {
	margin-bottom: 45px;
}

#posts .alignright,
#posts .alignleft,
#posts .size-medium {
	margin: 30px;
}

#posts .alignright {
	float: right;
}

#posts .alignleft {
	float: left;
}

#posts .aligncenter {
	display: block;
	margin: auto;
}

#posts .size-full {
	width: 100%;
	object-fit: contain;
	margin: 30px auto;
}

#posts .post-date {
	display: block;
	text-align: right;
}

#posts figure {
	margin-bottom: 15px;
}

#posts figure img {
	margin: 15px auto 5px;
}

#posts figcaption {
	text-align: center;
	max-width: 60%;
	margin: auto;
}

#posts p {
	margin-bottom: 30px;
}

/* END Blog styles - not scoped */
</style>

<style scoped>
h1,
h2,
h3 {
	text-align: center;
}

#view {
	width: 100%;
	margin: 15px auto;
	padding: 15px;
	position: relative;
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

#status-container {
	display: flex;
	justify-content: center;
}

#status-container > * {
	margin: 15px;
}

.blog-intro {
	background-color: #e7e7e7;
	color: #000;
	font-size: 1em;
	padding: 15px 30px 30px;
	border-radius: 12px;
	border: 1px #999 solid;
	margin: 30px auto 45px;
}

.uiDarkMode .blog-intro {
	border: 1px #555 solid;
	background-color: #222;
	color: #c1c1c1;
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

.hidden-post {
	display: flex;
	justify-content: center;
	margin: auto;
	width: fit-content;
	padding: 5px 15px;
	background-color: #ff0;
	font-weight: bold;
}

@media (min-width: 768px) {
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
