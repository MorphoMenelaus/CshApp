<template>
	<div>
		<TimeTracker v-if="project?.client_id" :appState="appState" :project="project" />
		<table>
			<thead>
				<tr class="header-row">
					<th>Project</th>
					<th>Client</th>
					<th>Project Id</th>
					<th>Created</th>
					<th>Hours</th>
					<th>Status</th>
					<th>Start_date</th>
				</tr>
			</thead>
			<tbody>
				<tr class="data-row" v-for="(item, index) in projects" :key="index">
					<td @click="project = item" :title="`Select ${item.name}`">
						<div :style="`background-color: ${item.color}`">{{ item.name }}</div>
					</td>
					<td>
						<div>{{ item.client_name }}</div>
					</td>
					<td>
						<div>{{ item.project_id }}</div>
					</td>
					<td>
						<div>{{ new Date(item.created_at).toLocaleString() }}</div>
					</td>
					<td>
						<div>{{ (item.actual_seconds / 60 / 60).toFixed(2) }}</div>
					</td>
					<td>
						<div>{{ item.status }}</div>
					</td>
					<td>
						<div>{{ item.start_date }}</div>
					</td>
				</tr>
			</tbody>
		</table>

	</div>
</template>

<script>
import TimeTracker from "@/components/TimeTracker.vue";

export default {
	name: "ProjectTable",
	props: {
		appState: Object,
		projects: Array
	},
	components: {
		TimeTracker
	},
	data() {
		return {
			project: {}
		};
	},
	watch: {
	},
	methods: {
	},
	mounted() {
	},
	created() {
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
th,
td {
	text-align: left;
}

th,
td div {
	border-radius: 12px;
	margin: 5px;
	padding: 5px 15px;
	font-weight: bold;
}

td:first-child div {
	color: #000;
	box-shadow: inset -3px -3px 6px 1px rgb(0 0 0 / 80%),
		inset 2px 2px 6px rgb(255 255 255 / 80%);
	cursor: pointer;
	user-select: none;
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>