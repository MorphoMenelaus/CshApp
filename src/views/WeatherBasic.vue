<template>
	<div>
		<div id="weather-container">
			<div id="description-box">
				<h1>{{ forecastDayText }} Weather Forecast</h1>
				<p>This data is retreived by a REST API call for up-to-date weather and is the combined reliable NOAA
					GFS weather model with rapid updating HRRR weather model.</p>
				<p>The graph is plotted based on data as returned by a weather server API and formatted to make the
					data more readable.</p>
				<small>No promises or guarantees of forecasts.</small>
			</div>
			<div class="input-container">
				<label for="forecastDays">Forecast</label>
				<select id="forecastDays" v-model="forecastDays">
					<option v-for="(item, index) in forecastDaysOptions" :key="index" :value="item.value">{{ item.text
					}}
					</option>
				</select>
				<label for="location">City</label>
				<select id="location" v-model="location">
					<option v-for="(item, index) in locationOptions" :key="index" :value="item">{{ item.city }}
					</option>
				</select>
				<small v-if="!isMobile">Latitude: {{ location.lat }} | Longitude: {{ location.long }}<br /><span
						:title="`${weatherData?.elevation} meters above sea level`">
						Elevation: {{
							weatherData?.elevation }}m asl
					</span></small>
			</div>
			<div v-if="weatherDateTime" class="weather-time">
				<span>Last refreshed: {{ weatherDateTime.toLocaleString() }}</span>
				<button v-if="weatherRefreshButton" class="btn" @click="getWeatherData()">Refresh Data</button>
			</div>
			<div id="weather">
				<canvas id="weather-graph" :width="chartWidth" :height="chartHeight"></canvas>
			</div>
			<div class="attribution">
				<span>REST API weather data by </span>
				<a class="link" href="https://open-meteo.com/" title="Go to Open-Meteo.com" target="_blank">
					Open-Meteo.com
				</a>&nbsp;|&nbsp;
				<a class="link" href="https://github.com/open-meteo/open-meteo/blob/main/LICENSE"
					title="Read licence here" target="_blank">Licence here</a>
			</div>
		</div>
	</div>
</template>

<script>
// import session from "@/dependencies/sessionMethods.js";
import locations from '@/dependencies/locations.json';
import Chart from 'chart.js/auto';

const defaultMult = .25;

export default {
	name: "WeatherBasic",
	props: {
		isMobile: Boolean,
		windowWidth: Number
	},
	components: {},
	data() {
		return {
			serverStatus: Object.assign({}, this.appNotify),
			chartElem: null,
			weatherChart: null,
			multiplier: defaultMult,
			chartWidth: this.windowWidth,
			chartHeight: this.windowWidth * defaultMult,
			dateOptions: {
				month: 'numeric',
				day: 'numeric',
				hour: 'numeric',
				hour12: true
			},
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
			forecastDaysOptions: [
				{ text: "1 Day", value: 1 },
				{ text: "3 Day", value: 3 },
				{ text: "5 Day", value: 5 },
				{ text: "7 Day", value: 7 },
			],
			forecastDays: this.isMobile ? 1 : 7,
			forecastDayText: "",
			dataSet: [],
			weatherData: {},
			location: locations.filter(loc => loc.city === "Atlanta")[0],
			locationOptions: locations.toSorted((a, b) => a.city.localeCompare(b.city)),
			weatherDateTime: null,
			weatherRefreshButton: false,
			refreshTimer: null,
		};
	},
	watch: {
		location: {
			handler() {
				this.getWeatherData();
			},
			deep: true,
		},
		forecastDays() {
			this.forecastDayText = this.forecastDaysOptions.filter(item => item.value === this.forecastDays)[0].text;
			this.getWeatherData();
		},
		windowWidth() {
			this.setGraphSizeRatio();
			this.drawChart();
			if (this.isMobile)
				this.forecastDays = 1;
			this.chartWidth = this.windowWidth;
			this.chartHeight = this.windowWidth * this.multiplier;
		},
	},
	methods: {
		setGraphSizeRatio() {
			let width = this.windowWidth;
			switch (true) {
				case width < 768:
					this.multiplier = 1;
					break;
				case width < 1024:
					this.multiplier = .7;
					break;
				case width < 1200:
					this.multiplier = .6;
					break;
				case width < 1800:
					this.multiplier = .5;
					break;
				case width < 2400:
					this.multiplier = .4;
					break;
				default:
					this.multiplier = 1;
			};
		},
		refreshButton() {
			this.weatherRefreshButton = true;
		},
		setRefreshTimer() {
			if (this.refreshTimer) clearTimeout(this.refreshTimer);
			this.weatherRefreshButton = false;
			this.refreshTimer = setTimeout(this.refreshButton, 1800000);
		},
		formatWeatherTime() {
			// Formats every hour item in the weather data array.
			let newTimeArr = [];
			this.weatherData.hourly.time.forEach(time => {
				let date = new Date(time);
				newTimeArr.push(new Intl.DateTimeFormat('en-US', this.dateOptions).format(date));
			});
			this.weatherData.hourly.time = newTimeArr;
		},
		// getWeatherFromSession(data) {
		// 	this.weatherData = data;
		// 	this.weatherDateTime = new Date(this.weatherData.forecastTimecode);
		// 	this.formatWeatherTime();
		// 	this.drawChart();
		// },
		async getWeatherData() {
			this.eventBus.emit("showHideLoader", true);

			let headerObj = new Headers();
			headerObj.append("Content-Type", "application/json; charset=utf-8");
			let requestUrl = new URL("https://api.open-meteo.com/v1/forecast");

			let params = requestUrl.searchParams;
			params.set("latitude", this.location.lat);
			params.set("longitude", this.location.long);
			params.set("hourly", this.location.hourly);
			params.set("forecast_days", this.forecastDays);
			params.set("temperature_unit", "fahrenheit");
			params.set("precipitation_unit", "inch");
			params.set("timezone", "auto");
			requestUrl.search = params.toString();

			let request = new Request(
				requestUrl.toString(), {
				method: 'GET',
				headers: headerObj,
			});

			try {
				let response = await fetch(request);
				let data = await response.json();

				if (data?.error) {
					console.error('Error getting data:', data?.reason);
					this.serverStatus.code = 503;
					this.serverStatus.message = data?.reason;
					this.serverStatus.success = false;
					this.eventBus.emit("updateStatus", (this.serverStatus));
					return;
				}

				this.weatherData = data;
				this.weatherData.forecastTimecode = new Date().getTime();

				this.weatherDateTime = new Date();
				this.setRefreshTimer();
				this.weatherRefreshButton = false;

				// session.recall.save(this.weatherData, "weatherData");

				this.formatWeatherTime();
				this.drawChart();

			} catch (error) {
				console.error('Error getting data:', error);
				this.serverStatus.code = 500;
				this.serverStatus.message = `Error getting data: ${error}`;
				this.serverStatus.success = false;
				this.eventBus.emit("updateStatus", (this.serverStatus));
			} finally {
				this.eventBus.emit("showHideLoader", false);
			}
		},
		drawChart() {

			const existingChart = Chart.getChart("weather-graph");
			if (existingChart) {
				existingChart.destroy();
			}

			const temperatureData = this.weatherData.hourly.temperature_2m;
			const precipProbData = this.weatherData.hourly.precipitation_probability;
			const precipitation = this.weatherData.hourly.precipitation;

			const data = {
				labels: this.weatherData.hourly.time,
				datasets: [
					{
						type: 'line',
						label: 'Temperature',
						data: temperatureData,
						backgroundColor: this.CHART_COLORS.blue,
						borderColor: this.CHART_COLORS.blue,
						fill: false,
						cubicInterpolationMode: 'monotone',
						tension: 0.4,
						yAxisID: "y1"
					},
				]
			};

			// dataSetsExtended conditionally added. Added when windowWidth is big enought.
			const dataSetsExtended = [
				{
					type: 'line',
					label: 'Precip. Probability',
					data: precipProbData,
					backgroundColor: this.CHART_COLORS.green,
					borderColor: this.CHART_COLORS.green,
					fill: false,
					tension: 0.4,
					yAxisID: "y2"
				},
				{
					type: 'bar',
					label: 'Precipitation Inches',
					data: precipitation,
					backgroundColor: this.CHART_COLORS.purple,
					borderColor: this.CHART_COLORS.purple,
					fill: false,
					yAxisID: "y3"
				},
			];

			if (!this.isMobile) {
				data.datasets = [...data.datasets, ...dataSetsExtended];
			}

			const chartConfig = {
				// type: 'line',
				data: data,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						title: {
							display: true,
							text: `${this.forecastDayText} Weather for ${this.location.city}`,
							font: {
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
								text: 'Date / Time'
							},
						},
						y1: {
							display: true,
							title: {
								display: true,
								text: 'Temperature °F'
							},
							suggestedMin: (Math.min(...temperatureData) < 50 ? Math.min(...temperatureData) : 50) - 10,
							suggestedMax: (Math.max(...temperatureData) > 80 ? Math.max(...temperatureData) : 80) + 10
						},
						y2: {
							display: this.isMobile ? false : true,
							title: {
								display: true,
								text: 'Precip. Probability %'
							},
							suggestedMin: 0,
							suggestedMax: (Math.max(...precipitation) > 60 ? Math.max(...precipitation) : 60) + 10
						},
						y3: {
							display: this.isMobile ? false : true,
							title: {
								display: true,
								text: 'Precip. inch'
							},
							suggestedMin: 0,
							suggestedMax: (Math.max(...precipitation) > .15 ? Math.max(...precipitation) : .15) + .05
						}
					}
				},
			}

			Chart.defaults.font.size = this.isMobile ? 12 : 18;
			this.weatherChart = new Chart(this.chartElem, chartConfig);
		},
		setupForGraph() {
			this.forecastDayText = this.forecastDaysOptions.filter(item => item.value === this.forecastDays)[0].text;
			this.setGraphSizeRatio();
			this.chartWidth = this.windowWidth;
			this.chartHeight = this.windowWidth * this.multiplier;
			this.chartElem = document.getElementById('weather-graph');
		}
	},
	mounted() {
		this.setupForGraph();
		this.getWeatherData();
	},
	created() {
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
	margin: 15px auto;
}

h1,
small {
	text-align: center;
}

small {
	display: block;
	font-size: .75em;
}

#description-box {
	background-color: rgb(191 191 191 / 75%);
	color: #000;
	width: 95%;
	margin: 30px auto 15px;
	border-radius: 12px;
	padding: 5px 15px 45px;
	border: 1px #000 solid;
}

.uiDarkMode #description-box {
	background-color: rgb(100 100 100 / 75%);
	color: #c1c1c1;
}

#weather-container {
	margin: auto;
	padding: unset;
}

#weather {
	background-color: #eee;
	padding: unset;
	margin: auto;
	border-radius: 12px;
}

.uiDarkMode #weather {
	background-color: #ccc;
}

.input-container {
	color: #000;
	background-color: #e7e7e7;
	border: 1px solid #7f7f7f;
	border-radius: 12px;
	justify-content: space-evenly;
	align-items: center;
	width: 100%;
	max-width: 35em;
	margin: auto auto 15px;
	padding: 5px 15px;
	display: flex;
}

.uiDarkMode .input-container {
	color: #ddd;
	background-color: #000;
	border: 1px solid #fff;
}

select {
	font-size: 1em;
	cursor: pointer;
}

small span {
	cursor: default;
}

.weather-time {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.weather-time .btn {
	margin-left: 15px;
}

@media (max-width: 767px) {
	#weather {
		margin-bottom: 60px;
	}

	#weather-graph {
		padding-bottom: 15px;
	}
}

@media (min-width: 768px) {
	#description-box {
		width: 90%;
		padding: 5px 30px 45px;

	}
}

@media (min-width: 992px) {
	#description-box {
		width: 85%;
	}

	#weather-container {
		padding: 15px 30px;
	}

	#weather {
		padding: 15px;
	}
}

@media (min-width: 1024px) {
	#description-box {
		width: 80%;
		padding: 5px 45px 45px;
	}
}

@media (min-width: 1200px) {
	#description-box {
		width: 75%;
	}
}

@media (min-width: 2400px) {
	#description-box {
		width: 60%;
	}
}
</style>