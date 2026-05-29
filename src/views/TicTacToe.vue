<template>
	<div id="board">
		<div class="board-container">
			<div className="board-row">
				{this.renderSquare(0)} {this.renderSquare(1)} {this.renderSquare(2)}
			</div>
			<div className="board-row">
				{this.renderSquare(3)} {this.renderSquare(4)} {this.renderSquare(5)}
			</div>
			<div className="board-row">
				{this.renderSquare(6)} {this.renderSquare(7)} {this.renderSquare(8)}
			</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import { ref } from "vue";
// import sessionMethods from "@/dependencies/sessionMethods";
import router from "@/router";
import { onBeforeUnmount } from "vue";

export default {
	name: "TicTacToe",
	props: {},
	components: {},
	data() {
		return {};
	},
	watch: {
		deepWatch: {
			// Deep watch example
			// Watches for changes to all properties of an object
			handler(val, oldVal) {
				// doSomething();
			},
			deep: true,
		},
		otherWatch() {
			// doSomething();
			// maybe this.$forceUpdate();
		},
	},
	methods: {
		consoleTest() {
			console.log("consoleTest");
		},
	},
	mounted() {
		this.eventBus.emit("eventTest", "Component Mounted");
	},
	created() {
		this.eventBus.emit("eventTest", "Component Created");
	},
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>