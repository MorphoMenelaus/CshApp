<template>
	<div id="markets">
		<Transition name="fade">
			<div v-if="showHideLoader" id="loading-icon" class="loading">
				<div class="spinner-pulse"></div>
			</div>
		</Transition>
		<h2>{{ seriesDetails.desciption }}</h2>
		<div class="input-fields">
			<div class="input-container">
				<label for="series">Series</label>
				<select id="series" v-model="series" title="Select series">
					<option v-for="(item, index) in seriesOptions" :key="index" :value="item.series_id">{{
						item.desciption
					}}
					</option>
				</select>
			</div>
			<div class="btn-group">
				<button v-for="(item, index) in dateRanges" :key="index" :value="item.value" class="btn"
					@click="selectDateRange(item)" :class="selectedDate.value == item.value ? 'selected' : ''">
					{{ item.text }}</button>
			</div>
		</div>
		<div id="stocks">
			<canvas id="stocks-graph"></canvas>
		</div>
		<small class="text-center">This product uses the FRED&reg; API but is not endorsed or certified by the Federal
			Reserve Bank of St. Louis.
		</small>
	</div>
</template>

<script>
import { onBeforeUnmount } from "vue";
import seriesIds from '@/dependencies/seriesIds.json';
import Chart from 'chart.js/auto';

const verticalLinePlugin = {
	id: 'verticalLine',
	afterDraw: (chart) => {
		if (chart.tooltip?._active && chart.tooltip._active.length) {
			const { ctx, chartArea: { top, bottom } } = chart;
			const activePoint = chart.tooltip._active[0];
			const x = activePoint.element.x;

			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x, top);
			ctx.lineTo(x, bottom);
			ctx.lineWidth = 1.5;
			ctx.strokeStyle = '#f00';
			ctx.setLineDash([6, 6]);
			ctx.stroke();
			ctx.restore();
		}
	}
};

export default {
	name: "StockCharts",
	props: {
		appState: Object,
		isMobile: Boolean,
		windowWidth: Number
	},
	components: {},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			showHideLoader: false,
			chartElem: null,
			startDate: new Date().toISOString().split('T')[0],
			endDate: new Date().toISOString().split('T')[0],
			currentDate: new Date().toISOString().split('T')[0],
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
			dateRanges: [
				{ text: "30 Day", value: 1 },
				{ text: "60 Day", value: 2 },
				{ text: "90 Day", value: 3 },
				{ text: "6 Mo.", value: 6 },
				{ text: "12 Mo.", value: 12 },
				{ text: "24 Mo.", value: 24 }
			],
			selectedDate: this.isMobile ? { text: "60 Day", value: 2 } : { text: "6 Mo.", value: 6 },
			limit: 500,
			offset: 0,
			series: "SP500",
			seriesDetails: {},
			stocks: {},
			observations: [],
		};
	},
	watch: {
		windowWidth() {
			this.drawChart();
		},
		series() {
			this.seriesDetails = this.seriesOptions.filter(item => item.series_id === this.series)[0];
			this.selectRanges();
			this.getStocksData();
		},
	},
	methods: {
		selectDateRange(select) {
			this.selectedDate = select;
			this.selectRanges();
			this.getStocksData();
		},
		selectRanges() {
			let monthOffset = this.selectedDate.value;
			let date = new Date();
			let start = date.setMonth(date.getMonth() - monthOffset);
			this.startDate = new Date(start).toISOString().split('T')[0];
			this.limit = 30 * monthOffset;
		},
		async getStocksData() {
			this.eventBus.emit("showStockLoader", true);

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

				this.sendAnalyticsEvent("stocks_chart", this.series);

				this.drawChart();

				this.serverStatus.code = data.code;
				this.serverStatus.message = data.message;
				this.serverStatus.success = data.success;
				if (this.serverStatus.code !== 200) this.eventBus.emit("updateStatus", this.serverStatus);

			} catch (error) {
				console.error('Error posting data:', error);
				this.serverStatus.code = 500;
				this.serverStatus.message = `Error getting data: ${error}`;
				this.serverStatus.success = false;
				this.eventBus.emit("updateStatus", (this.serverStatus));
			} finally {
				this.eventBus.emit("showStockLoader", false);
			}
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
						label: this.seriesDetails.units,
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
					interaction: {
						mode: 'index', // Snaps line to the closest date point
						intersect: false
					},
					plugins: {
						tooltip: {
							enabled: true // Keeps default hover text visible
						},
						title: {
							display: true,
							text: this.seriesDetails.desciption,
							font: {
								weight: 700,
								size: this.isMobile ? 16 : 26
							}
						},
					},
					scales: {
						x: {
							display: true,
							title: {
								display: true,
								text: 'DATE',
								// color: this.CHART_COLORS.blue,
								font: {
									// weight: 700,
									size: this.isMobile ? 14 : 24
								}
							},
						},
						y1: {
							display: true,
							title: {
								display: true,
								text: this.seriesDetails.units,
								// color: this.CHART_COLORS.blue,
								font: {
									// weight: 700,
									size: this.isMobile ? 14 : 24
								}
							},
							suggestedMin: Math.min(...extractedValues) - 100,
							suggestedMax: Math.max(...extractedValues) + 100
						},
					}
				},
				plugins: [verticalLinePlugin]
			}

			Chart.defaults.font.size = this.isMobile ? 12 : 18;
			this.weatherChart = new Chart(this.chartElem, chartConfig);
		},
		setupForGraph() {
			this.chartElem = document.getElementById('stocks-graph');
		}
	},
	mounted() {
		this.seriesDetails = this.seriesOptions.filter(item => item.series_id === this.series)[0];
		this.setupForGraph();
		this.selectRanges();
		this.getStocksData();
	},
	created() {
		this.eventBus.on("showStockLoader", payload => {
			this.showHideLoader = payload;
		});
		onBeforeUnmount(() => {
			this.eventBus.off("showStockLoader");
		});
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* #latest-stocks {
	overflow: hidden;
} */

#markets {
	position: relative;
}

small.text-center {
	display: block;
}

h2,
.text-center {
	text-align: center;
}

h2 {
	margin-top: 15px;
	font-size: 2em;
}

.uiDarkMode #stocks-graph {
	background-color: #ccc;
}

#stocks {
	background-color: #dbdbdb;
	border: 1px solid #ababab;
	border-radius: 12px;
	margin: 15px 0;
	padding: 15px;
}

#stocks-graph {
	padding: unset;
	background-color: #eee;
	border-radius: 12px;
	margin: auto;
}

.input-fields {
	display: flex;
	justify-content: space-around;
	align-items: baseline;
	margin: 15px;
}

.mobile .input-fields {
	flex-direction: column;
	align-items: center;
}

.mobile .input-fields .btn:nth-child(4),
.mobile .input-fields .btn:nth-child(5),
.mobile .input-fields .btn:nth-child(6) {
	display: none;
}

.mobile .btn-group {
	margin-top: 15px;
}

.input-fields select {
	max-width: 20em;
	overflow: hidden;
	text-overflow: ellipsis;
	padding: 2px 5px;
	font-size: .8em;
	cursor: pointer;
}

.input-fields .btn {
	margin: 0 5px;
}

#series {
	margin-left: 10px;
}

canvas#stocks-graph {
	width: 100%;
	height: calc(100vw / 3);
	max-height: 800px;
	border: 1px #000 solid;
}

.mobile canvas#stocks-graph {
	height: calc(100vh / 2);
	max-height: 400px;
}

.btn.selected {
	background-color: #2a5575;
	border: 1px #eee solid;
}

#loading-icon {
	position: absolute;
	top: 5px;
	right: 0;
	bottom: 0;
	left: 0;
	display: grid;
	align-items: center;
	background-color: rgb(0 0 0 / 20%);
	backdrop-filter: blur(10px);
	border-radius: 12px;
}

.spinner-pulse,
.spinner-pulse:before,
.spinner-pulse:after {
	background-color: #5a87bf;
	width: 30px;
	height: 30px;
}

.spinner-pulse:before {
	left: -40px;
}

.spinner-pulse:after {
	left: 40px;
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>