<template>
	<div>
		<div id="pseudo-table">

			<div class="container">
				<div class="flex-inner" v-for="(item, index) in resumeArray" :key="index" :id="`id-${item.id}`">
					<div class="left-column">
						<h2>{{ item.title }}</h2>
						<h3>{{ item.company }}</h3>
						<h4>{{ item.dates }}</h4>
						<small>{{ item.type }}</small>
					</div>
					<div class="right-column">
						<ul>
							<li v-for="(duty, index) in item.duties" :key="index">{{ duty }}</li>
						</ul>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
export default {
	name: "ResumeTable",
	props: {
		resumeArray: Array
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#pseudo-table {
	border: 1px #666 solid;
	border-radius: 12px;
	/* color: #666; */
	/* color: rgb(0 0 0 / 70%); */
	color: #222;
}

.uiDarkMode #pseudo-table {
	color: #aaa;
}

.container {
	padding: 15px;
}

.flex-inner {
	display: flex;
	gap: 20px;
	padding: 15px 30px;
	background-color: #e7e7e7;
	border: 1px #555 solid;
	border-radius: 8px;
	margin-bottom: 15px;
}

.uiDarkMode .flex-inner {
	background-color: #000;
}

.left-column {
	flex: 1;
}

.right-column {
	flex: 3;
}
</style>