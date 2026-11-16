<script setup>
/**
 * WordPress REST API base url:
 * /wp-json/wp/v2
 *
 * WordPress endpoints:
 * /pages, /posts, /users, /categories, /tags, /comments, /posts
 *
 * WordPress params:
 * _embed[no value], per_page=[number], post=[post_id]
 *
 * Example URL:
 * /wp-json/wp/v2/posts?per_page=5&_embed
 * _embed=true will also work. It just needs the _embed flag to be there
 */

import { ref, onBeforeMount } from "vue";
import { useFetchJson } from "@/composables/useCommonFetch";
import { useWindowEvent } from "@/composables/useCommonEvents.js";

const wpApiUrlBase = import.meta.env.VITE_APP_CSHWP_API_BASE;
const wpApiJsonBase = "/wp-json/wp/v2";

const showHideLoader = ref(false);
const posts = ref([]);
const selectedPost = ref({});
const per_page = ref(35);

const cleanHtmlAnchors = (html) => {
	const doc = new DOMParser().parseFromString(html, "text/html");

	doc.querySelectorAll("a").forEach((anchor) => {
		// Replace the <a> tag with its own child nodes (preserves inner text & nested tags)
		let span = document.createElement("span");
		span.classList.add("removed-link", ...anchor.classList);
		span.append(...anchor.childNodes);
		anchor.replaceWith(span);
	});

	return doc.body.innerHTML;
};

const removeAnchors = (html) => {
	const doc = new DOMParser().parseFromString(html, "text/html");
	doc.querySelectorAll("a").forEach((anchor) => {
		anchor.parentNode.removeChild(anchor);
	});
	return doc.body.innerHTML;
};

const getPostList = async () => {
	showHideLoader.value = true;
	try {
		// const response = await fetch(`${wpApiUrlBase}${wpApiJsonBase}/posts?per_page=${per_page.value}&_embed`);
		const response = await useFetchJson(`${wpApiJsonBase}/posts`, wpApiUrlBase, [{ per_page: per_page.value }, { _embed: true }]);
		// let data = await response;
		posts.value = response;
	} catch (error) {
		console.error("Error fetching posts list:", error);
	} finally {
		showHideLoader.value = false;
	}
};

const getPost = async (postId) => {
	showHideLoader.value = true;
	try {
		const response = await fetch(`${wpApiUrlBase}${wpApiJsonBase}/posts/${postId}?_embed`);
		if (response?.ok) {
			let data = await response.json();
			selectedPost.value = data;
		}
	} catch (error) {
		console.error("Error fetching posts:", error);
	} finally {
		showHideLoader.value = false;
	}
};

onBeforeMount(() => {
	getPostList();
});

useWindowEvent("keydown", (e) => {
	if (e.key === "Escape") selectedPost.value = {};
});
</script>

<template>
	<div id="wp-blogs" class="playground-container">
		<Transition name="fade">
			<div v-if="showHideLoader" id="loading-icon" class="loading">
				<div class="spinner-pulse"></div>
				<h3>Loading Posts</h3>
			</div>
		</Transition>
		<h1 class="page-header julius-sans text-center">Blog Posts</h1>
		<article v-for="post in posts" :key="post.id" class="post-card">
			<img
				v-if="post._embedded?.['wp:featuredmedia']?.[0]?.source_url"
				:src="post._embedded['wp:featuredmedia'][0].source_url"
				:alt="post._embedded['wp:featuredmedia'][0].alt_text"
				:title="post._embedded['wp:featuredmedia'][0].alt_text"
				class="post-thumbnail"
				@click="getPost(post.id)"
			/>
			<h2 v-html="post.title.rendered"></h2>
			<small>{{ new Date(post.date).toLocaleString("en-US") }}</small>
			<div v-html="removeAnchors(post.excerpt.rendered)" class="excerpt"></div>
			<span class="read-more link" @click="getPost(post.id)"> Read Post → </span>
		</article>
		<Transition name="fade">
			<div v-if="Object.keys(selectedPost).length > 0 && !selectedPost?.content?.protected" id="selected-post">
				<div id="post-inner">
					<img
						v-if="selectedPost._embedded?.['wp:featuredmedia']?.[0]?.source_url"
						:src="selectedPost._embedded['wp:featuredmedia'][0].source_url"
						:alt="selectedPost._embedded['wp:featuredmedia'][0].alt_text"
						:title="selectedPost._embedded['wp:featuredmedia'][0].alt_text"
						class="post-thumbnail"
					/>
					<h2 class="title" v-html="selectedPost.title.rendered"></h2>
					<div v-html="cleanHtmlAnchors(selectedPost.content.rendered)"></div>
				</div>
				<button class="btn close-post" @click="selectedPost = {}">Close</button>
			</div>
			<h2 class="text-center" v-else-if="selectedPost?.content?.protected">Post is protected</h2>
			<!-- <h2 class="text-center" v-else>No post loaded</h2> -->
		</Transition>
	</div>
</template>

<style scoped>
h2.title {
	font-size: 3rem;
	text-align: center;
}

#selected-post {
	position: fixed;
	inset: 5em 0 3em 0;
	z-index: 50000;
	background-color: rgb(0 0 0 / 80%);
	backdrop-filter: blur(10px);
	padding: 2em;
	overflow: hidden auto;
}

.btn.close-post {
	position: fixed;
	top: 1em;
	right: 1em;
	z-index: 50000;
	font-size: 1.5rem;
}

article h2 {
	margin: 0.5rem auto;
	text-align: center;
	color: #333;
}
small {
	color: #333;
}
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
	/* font-size: 0.9rem; */
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

<style>
/* WP STYLING START */
#post-inner {
	background-color: rgb(49 49 49 / 80%);
	padding: 4rem;
	width: 80%;
	margin: auto;
}
#wp-blogs main.site-main {
}
#wp-blogs article.post {
}
#wp-blogs .post-thumbnail {
}
#wp-blogs .entry-header {
	padding: 0 10%;
}
#wp-blogs .entry-title {
}
#wp-blogs .entry-content {
}
#wp-blogs h3.wp-block-heading,
#wp-blogs h4.wp-block-heading {
	line-height: 1.5rem;
	margin-top: 2rem;
	margin-bottom: 2rem;
	text-align: center;
}
#wp-blogs h3.wp-block-heading {
	font-size: 2.7rem;
}
#wp-blogs h4.wp-block-heading {
	font-size: 2rem;
}
#wp-blogs .fineP {
	font-size: 0.7em;
}
#wp-blogs .subhead {
	color: #fff;
	font-style: italic;
	font-weight: bold;
	text-align: center;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	margin: 1em 2em 1.3em;
}
#wp-blogs p {
	text-indent: 2rem;
	margin-bottom: 1rem;
}
#wp-blogs .wp-caption {
}
#wp-blogs .size-full {
}
#wp-blogs img {
	/* object-fit: contain; */
	cursor: pointer;
}
#wp-blogs .alignleft,
#wp-blogs .alignright {
	clear: both;
	display: inline;
	width: fit-content;
	margin-top: 1rem;
	margin-bottom: 1rem;
}
#wp-blogs .alignleft {
	float: left;
	margin-right: 2rem;
}
#wp-blogs .alignright {
	float: right;
	margin-left: 2rem;
}
#wp-blogs .aligncenter {
	display: block;
	margin-right: auto;
	margin-left: auto;
	width: fit-content;
}

@media screen and (min-width: 38.75em) {
	#wp-blogs .entry-header {
		padding: 0 9.0909%;
	}
}
/* WP STYLING END */
</style>
