<script setup>
import { ref, onBeforeMount } from "vue";
import { useFetchJson } from "@/composables/useCommonFetch";
const wpApiUrl = import.meta.env.VITE_APP_CSHWP_API;

let showHideLoader = ref(false);
const posts = ref([]);
const pending = ref(null);
const error = ref(null);

const getPosts = async () => {
	showHideLoader.value = true;
	try {
		const response = await fetch(`${wpApiUrl}/posts?_embed`);
		if (response?.ok) {
			let data = await response.json();
			posts.value = data;
		}
	} catch (error) {
		console.error("Error fetching server version:", error);
	} finally {
		showHideLoader.value = false;
	}
};

onBeforeMount(() => {
	getPosts();
});
</script>

<template>
	<div class="playground-container">
		<Transition name="fade">
			<div v-if="showHideLoader" id="loading-icon" class="loading">
				<div class="spinner-pulse"></div>
				<h3>Loading Posts</h3>
			</div>
		</Transition>
		<h1 class="page-header julius-sans text-center">CSH Photography</h1>
		<article v-for="post in posts" :key="post.id" class="post-card">
			<img
				v-if="post._embedded?.['wp:featuredmedia']?.[0]?.source_url"
				:src="post._embedded['wp:featuredmedia'][0].source_url"
				:alt="post._embedded['wp:featuredmedia'][0].alt_text"
				:title="post._embedded['wp:featuredmedia'][0].alt_text"
				class="post-thumbnail"
			/>
			<h2 v-html="post.title.rendered"></h2>
			<div v-html="post.excerpt.rendered" class="excerpt"></div>
			<a :href="`${wpApiUrl}/posts/${post.id}`" class="read-more" target="_blank"> Read Post → </a>
		</article>
	</div>
</template>

<style scoped>
.playground-container {
	position: relative;
	margin: 0 auto;
	padding: 2rem;
	font-family: sans-serif;
}
.posts-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 2rem;
	margin-top: 2rem;
}
.post-card {
	border: 1px solid #eee;
	padding: 1.5rem;
	border-radius: 8px;
	background: #fff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	margin-bottom: 1rem;
}
.post-thumbnail {
	width: 100%;
	height: 320px;
	object-fit: cover;
	border-radius: 0.6rem;
}
.excerpt {
	color: #666;
	font-size: 0.9rem;
	line-height: 1.5;
}
.read-more {
	display: inline-block;
	margin-top: 1rem;
	color: #42b883; /* Vue Green */
	text-decoration: none;
	font-weight: bold;
}

#loading-icon {
	position: absolute;
	height: 100%;
	right: 0;
	bottom: 0;
	left: 0;
	display: grid;
	align-content: center;
	background-color: rgb(0 0 0 / 60%);
	backdrop-filter: blur(10px);
	z-index: 1;
	user-select: none;
}

#loading-icon {
	margin-top: 15px;
	color: #eee;
	font-size: 1.5em;
	text-align: center;
}

.spinner-pulse,
.spinner-pulse:before,
.spinner-pulse:after {
	background-color: #61a7ff;
	width: 30px;
	height: 30px;
}

.spinner-pulse:before {
	left: -40px;
}

.spinner-pulse:after {
	left: 40px;
}
</style>
