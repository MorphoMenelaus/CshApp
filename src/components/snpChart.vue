<template>
	<div>
		<div class="input-fields">
			<div class="form-group">
				<label for="startDate">Start date:</label>
				<input v-model="startDate" type="date" id="startDate" name="startDate" min="" max="endDate" />
			</div>
			<div class="form-group">
				<label for="endDate">End date:</label>
				<input v-model="endDate" type="date" id="endDate" name="endDate" min="startDate" max="" />
			</div>
			<div class="btn-group">
				<button class="btn" @click="getStocksData()">Get Stock Data</button>
			</div>
		</div>
		<div id="paging">
			<label for="series">Market Series</label>
			<select v-model="series">
				<option v-for="(item, index) in seriesOptions" :key="index" :value="item.series_id">{{ item.desciption }}
				</option>
			</select>
			<label for="limitOptions">Limit List</label>
			<select v-model="limit">
				<option v-for="(item, index) in limitOptions" :key="index" :value="item.value">{{ item.value }}
				</option>
			</select>
			<button class="prev-button btn" type="button" @click="previousPage()"
				title="Previous Page">previous</button>
			<button class="next-button btn" type="button" @click="nextPage()" title="Next Page">next</button>
			<span :currentPage="currentPage">page {{ currentPage }}</span>
		</div>

		<div>{{ stocks }}</div>

		<div id="stocks">
			<canvas id="stocks-graph" :width="chartWidth" :height="chartHeight"></canvas>
		</div>

	</div>
</template>

<script>
import seriesIds from '@/dependencies/seriesIds.json';
import Chart from 'chart.js/auto';

export default {
	name: "snpChart",
	props: {
		appState: Object,
		isMobile: Boolean,
		windowWidth: Number
	},
	components: {},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			chartElem: null,
			startDate: new Date().toISOString().split('T')[0],
			endDate: new Date().toISOString().split('T')[0],
			chartWidth: this.windowWidth,
			chartHeight: this.windowWidth / 2,
			seriesOptions: seriesIds,
			limitOptions: [
				{ text: "50", value: 50 },
				{ text: "100", value: 100 },
				{ text: "250", value: 250 },
				{ text: "500", value: 500 },
				{ text: "750", value: 750 },
				{ text: "1000", value: 1000 },
				{ text: "2500", value: 2500 },
				{ text: "5000", value: 5000 },
			],
			CHART_COLORS: {
				red: 'rgb(255, 99, 132)',
				orange: 'rgb(255, 159, 64)',
				yellow: 'rgb(255, 205, 86)',
				green: 'rgb(75, 192, 192)',
				blue: 'rgb(54, 162, 235)',
				purple: 'rgb(153, 102, 255)',
				grey: 'rgb(201, 203, 207)',
				white: 'rgb(255, 255, 255)',
				black: 'rgb(0, 0, 0)'
			},
			startMin: this.endDate,
			endMax: this.startDate,
			limit: 500,
			offset: 0,
			series: "SP500",
			stocks: {},
			observations: [],
		};
	},
	watch: {},
	methods: {
		async getStocksData() {
			this.eventBus.emit("showHideLoader", true);

			try {

				let headerObj = new Headers();
				headerObj.append("Content-Type", "application/json; charset=utf-8");
				let requestUrl = new URL("/api/stocks", this.baseUrl);

				let params = requestUrl.searchParams;
				params.set("start", this.startDate);
				params.set("end", this.endDate);
				params.set("limit", this.limit);
				params.set("offset", this.offset);
				params.set("series_id", this.series);
				requestUrl.search = params.toString();

				let request = new Request(
					requestUrl.toString(), {
					method: 'GET',
					headers: headerObj,
				});

				let response = await fetch(request);
				let data = await response.json();

				this.observations = data.stocks.observations;
				delete data.stocks.observations;
				this.stocks = data.stocks;

				this.drawChart();

				this.serverStatus.code = data.code;
				this.serverStatus.message = data.message;
				this.serverStatus.success = data.success;
				this.eventBus.emit("updateStatus", (this.serverStatus));

			} catch (error) {
				console.error('Error posting data:', error);
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
			this.getStocksData();
		},
		nextPage() {
			if (this.observations.length < this.limit) return;
			this.offset = this.offset + this.limit;
			this.currentPage++;
			this.getStocksData();
		},
		drawChart() {

			this.setupForGraph();

			const existingChart = Chart.getChart("stocks-graph");
			if (existingChart) {
				existingChart.destroy();
			}

			const extractedValues = this.observations.map(item => Number(item.value));
			const extractedDates = this.observations.map(item => item.date);

			const data = {
				labels: extractedDates,
				datasets: [
					{
						type: 'line',
						label: "USD",
						data: extractedValues,
						backgroundColor: this.CHART_COLORS.blue,
						borderColor: this.CHART_COLORS.blue,
						fill: false,
						yAxisID: "y1"
					},
				]
			};

			const chartConfig = {
				// type: 'line',
				data: data,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						title: {
							display: true,
							text: `S&P 500`,
							font: {
								weight: 700,
								size: this.isMobile ? 16 : 26
							}
						},
					},
					interaction: {
						intersect: false,
					},
					scales: {
						x: {
							display: true,
							title: {
								display: true,
								text: 'Date'
							},
						},
						y1: {
							display: true,
							title: {
								display: true,
								text: 'USD',
								color: this.CHART_COLORS.blue
							},
							suggestedMin: Math.min(...extractedValues) - 100,
							suggestedMax: Math.max(...extractedValues) + 100
						},
					}
				},
			}

			Chart.defaults.font.size = this.isMobile ? 12 : 18;
			this.weatherChart = new Chart(this.chartElem, chartConfig);
		},
		setupForGraph() {
			this.chartElem = document.getElementById('stocks-graph');
		}
	},
	mounted() {
		this.setupForGraph();
	},
	created() {
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.uiDarkMode #stocks-graph {
	background-color: #ccc;
}

#stocks-graph {
	padding: unset;
	background-color: #eee;
	border-radius: 12px;
	margin: auto;
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>