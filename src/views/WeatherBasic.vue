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
			<div id="weather-box">
				<div class="input-container">
					<label for="forecastDays">Forecast</label>
					<select id="forecastDays" v-model="forecastDays">
						<option v-for="(item, index) in forecastDaysOptions" :key="index" :value="item.value">
							{{ item.text }}
						</option>
					</select>
					<label for="location">City</label>
					<select id="location" v-model="location">
						<option v-for="(item, index) in locationOptions" :key="index" :value="item">{{ item.city }}
						</option>
					</select>
					<small v-if="!isMobile">Latitude: {{ location.lat }} | Longitude: {{ location.long }}<br /><span
							:title="`${weatherData?.elevation} meters above sea level`">
							Elevation: {{ weatherData?.elevation }}m asl
						</span></small>
				</div>
				<div v-if="weatherDateTime" class="weather-time">
					<small>Last refreshed: {{ weatherDateTime.toLocaleString() }}</small>
					<button v-if="weatherRefreshButton" class="btn" @click="getWeatherData()">Refresh Data</button>
				</div>
				<div id="weather">
					<Transition name="fade">
						<div v-if="showHideLoader" id="loading-icon" class="loading">
							<div class="spinner-pulse"></div>
						</div>
					</Transition>
					<span class="mobile-message" v-if="isMobile">Tap graph for details</span>
					<canvas id="weather-graph" v-if="!weatherData?.error"></canvas>
					<div v-else id="weather-error">
						<h1>Weather service API not responding.</h1>
						<h2>Please, check again later.</h2>
						<h3>{{ weatherData?.reason }}</h3>
					</div>
				</div>
				<div class="attribution">
					<small>REST API weather data by
						<a href="https://open-meteo.com/" title="Go to Open-Meteo.com" target="_blank">
							Open-Meteo.com
						</a>&nbsp;|&nbsp;
						<a href="https://github.com/open-meteo/open-meteo/blob/main/LICENSE" title="Read licence here"
							target="_blank">Licence here</a>
					</small>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { inject } from "vue";
import locations from '@/dependencies/locations.json';
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
	name: "WeatherBasic",
	props: {
		appState: Object,
		isMobile: Boolean,
		windowWidth: Number
	},
	components: {},
	data() {
		return {
			updateStatus: inject('sendUpdateStatus'),
			forceLogout: inject('forceLogout'),
			serverStatus: Object.assign({}, this.appNotify),
			showHideLoader: false,
			chartElem: null,
			weatherChart: null,
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
			forecastDays: this.isMobile ? 3 : 7,
			forecastDayText: "",
			dataSet: [],
			weatherData: {},
			locationDefault: this.appState?.user?.locationDefault || "Atlanta",
			location: {},
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
				this.sendAnalyticsEvent("weather_location", this.location.city);
			},
			deep: true,
		},
		forecastDays() {
			this.forecastDayText = this.forecastDaysOptions.filter(item => item.value === this.forecastDays)[0].text;
			this.getWeatherData();
		},
		windowWidth() {
			this.drawChart();
		},
	},
	methods: {
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
		async getWeatherData() {
			this.showHideLoader = true;

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

				if (data?.code === 403) {
					data.forced = true;
					this.forceLogout(data);
				}

				this.weatherData = data;
				this.weatherData.forecastTimecode = new Date().getTime();

				if (data?.error) {
					console.error('Error getting data:', data?.reason);
					this.serverStatus.code = 503;
					this.serverStatus.message = data?.reason;
					this.serverStatus.success = false;
					this.updateStatus(this.serverStatus);
					return;
				}

				this.weatherDateTime = new Date();
				this.setRefreshTimer();
				this.weatherRefreshButton = false;

				this.formatWeatherTime();
				this.drawChart();

			} catch (error) {
				console.error('Error getting data:', error);
				this.serverStatus.code = 500;
				this.serverStatus.message = `Error getting data: ${error}`;
				this.serverStatus.success = false;
				this.updateStatus(this.serverStatus);
			} finally {
				this.showHideLoader = false;
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
						yAxisID: "y1",
						order: 3
					},
					{
						type: 'line',
						label: 'Precip. Probability',
						data: precipProbData,
						backgroundColor: this.CHART_COLORS.green,
						borderColor: this.CHART_COLORS.green,
						fill: false,
						tension: 0.4,
						yAxisID: "y2",
						order: 2
					},
					{
						type: 'bar',
						label: 'Precipitation Inches',
						data: precipitation,
						backgroundColor: this.CHART_COLORS.purple,
						borderColor: this.CHART_COLORS.purple,
						fill: false,
						yAxisID: "y3",
						order: 1
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
						tooltip: {
							enabled: true // Keeps default hover text visible
						},
						title: {
							display: true,
							text: `${this.forecastDayText} Weather for ${this.location.city}`,
							font: {
								weight: 700,
								size: this.isMobile ? 16 : 26
							}
						},
					},
					interaction: {
						mode: 'index', // Snaps line to the closest date point
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
							display: this.isMobile ? false : true,
							title: {
								display: true,
								text: 'Temperature °F',
								color: this.CHART_COLORS.blue
							},
							suggestedMin: (Math.min(...temperatureData) < 50 ? Math.min(...temperatureData) : 50) - 10,
							suggestedMax: (Math.max(...temperatureData) > 80 ? Math.max(...temperatureData) : 80) + 10
						},
						y2: {
							display: this.isMobile ? false : true,
							title: {
								display: true,
								text: 'Precip. Probability %',
								color: this.CHART_COLORS.green
							},
							suggestedMin: 0,
							suggestedMax: (Math.max(...precipitation) > 60 ? Math.max(...precipitation) : 60) + 10
						},
						y3: {
							display: this.isMobile ? false : true,
							title: {
								display: true,
								text: 'Precip. inch',
								color: this.CHART_COLORS.purple
							},
							suggestedMin: 0,
							suggestedMax: (Math.max(...precipitation) > .15 ? Math.max(...precipitation) : .15) + .05
						}
					}
				},
				plugins: [verticalLinePlugin]
			}

			Chart.defaults.font.size = this.isMobile ? 12 : 18;
			this.weatherChart = new Chart(this.chartElem, chartConfig);
		},
		setupForGraph() {
			this.forecastDayText = this.forecastDaysOptions.filter(item => item.value === this.forecastDays)[0].text;
			this.chartElem = document.getElementById('weather-graph');
		}
	},
	mounted() {
		this.location = locations.filter(loc => loc.city === this.locationDefault)[0];
		this.setupForGraph();
		this.getWeatherData();
	},
};
</script>

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
	/* width: 95%; */
	margin: 30px auto 15px;
	border-radius: 12px;
	padding: 5px 15px 45px;
	border: 1px #000 solid;
}

#description-box p {
	width: 80%;
	margin: auto;
}

.uiDarkMode #description-box {
	background-color: #333;
	color: #c1c1c1;
}

#weather-container {
	width: 98%;
	margin: 15px auto;
	padding-bottom: 45px;
}

#weather {
	position: relative;
	background-color: #dbdbdb;
	border: 1px solid #ababab;
	border-radius: 12px;
	margin: 15px 0;
	padding: 15px;
}

.uiDarkMode #weather {
	background-color: #ccc;
}

#weather-box {
	background-color: #e7e7e7;
	padding: 15px;
	border-radius: 12px;
	border: 1px solid #555;
}

.uiDarkMode #weather-box {
	background-color: #000;
}

#weather-error {
	color: #000;
	text-align: center;
}

#weather-graph {
	padding: unset;
	background-color: #eee;
	border-radius: 12px;
	margin: auto;
}

canvas#weather-graph {
	width: 100%;
	height: calc(100vw / 3);
	max-height: 800px;
	border: 1px #000 solid;
}

.mobile canvas#weather-graph {
	height: calc(100vh / 2);
	max-height: 400px;
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
	margin: 15px auto;
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

.mobile-message {
	display: grid;
	justify-content: center;
	margin: 0 auto 15px;
	padding: 0px 10px;
	width: fit-content;
	font-weight: 500;
	font-size: .8em;
	text-transform: uppercase;
	background: #92bdff;
	border-radius: 8px;
	border: 1px #b1b1b1 solid;
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
		/* width: 90%; */
		padding: 5px 30px 45px;

	}
}

@media (min-width: 992px) {
	/* #description-box {
		width: 85%;
	} */

	#weather-container {
		width: 90%;
	}

	#weather {
		padding: 15px;
	}
}

@media (min-width: 1024px) {
	#description-box {
		/* width: 80%; */
		padding: 5px 45px 45px;
	}
}

@media (min-width: 1200px) {
	#weather-container {
		width: 80%;
	}
}

@media (min-width: 1800px) {
	#weather-container {
		width: 70%;
	}
}

@media (min-width: 2200px) {
	#weather-container {
		width: 60%;
	}
}
</style>
