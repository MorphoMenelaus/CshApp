<template>
	<div>
		<div id="pseudo-table">

			<div class="container">
				<div class="flex-inner" v-for="(item, index) in resumeArray" :key="index" :id="`id-${item.id}`">
					<div class="top-row">
						<h2>{{ item.title }}</h2>
						<h3>{{ item.company }}</h3>
						<h4>{{ item.dates }}</h4>
						<small>{{ item.type }}</small>
					</div>
					<div class="bottom-row">
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
	name: "ResumeTableMobile",
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
	color: rgb(0 0 0 / 70%);
}

.uiDarkMode #pseudo-table {
	color: #aaa;
}

.container {
	padding: 15px;
}

.flex-inner {
	display: flex;
	flex-direction: column;
	gap: 15px;
	padding: 15px;
	background-color: #e7e7e7;
	border: 1px #555 solid;
	border-radius: 8px;
	margin-bottom: 15px;
}

.uiDarkMode .flex-inner {
	background-color: #000;
}
</style>