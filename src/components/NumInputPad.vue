<template>
	<div id="keypad">
		<div id="keypad-container">
			<div class="keypad-grid">
				<div class="keypad-display">
					<div class="current-input">{{ keypadInputString }}</div>
				</div>
				<button data-number>7</button>
				<button data-number>8</button>
				<button data-number>9</button>
				<button data-clear class="span-two-rows">Clear</button>
				<button data-number>4</button>
				<button data-number>5</button>
				<button data-number>6</button>
				<button data-number>1</button>
				<button data-number>2</button>
				<button data-number>3</button>
				<button data-enter class="span-two-rows">Enter</button>
				<button data-number class="span-three-col">0</button>
			</div>
		</div>
	</div>
</template>

<script>
import { onBeforeUnmount } from "vue";
export default {
	name: "NumInputPad",
	props: {
		inputConfig: {
			type: Object,
		},
	},
	data() {
		return {
			inputField: null,
			keypadInput: 0,
			keypadInputString: "0",
			keypadElement: null,
			keypadLocale: true,
			eventSync: {
				time: new Date(),
				component: "", // component property is optional for targeting events
				inputFromNumPad: 0,
				// optional payload can be added to the eventSync object
			},
		};
	},
	watch: {
		keypadInputAU() {
			this.keypadInputString = this.keypadLocale ? new Intl.NumberFormat().format(this.keypadInput) : this.keypadInputAU.toString();
		},
	},
	methods: {
		appendNumDisplay(numPadInput) {
			if (this.keypadInput.toString().length < this.inputConfig.limitNumber) {
				let numString = this.keypadInput.toString() + numPadInput.toString();
				this.keypadInput = parseInt(numString);
			}
		},
		clearInput() {
			this.keypadInput = 0;
		},
		backspace() {
			let numberString = this.keypadInput.toString();
			if (numberString.length <= 1) {
				this.keypadInput = 0;
				return;
			}
			numberString = numberString.slice(0, -1);
			this.keypadInput = parseInt(numberString);
		},
		commitInput() {
			this.eventSync.time = new Date().getTime();
			this.eventSync.inputFromNumPad = this.keypadInput;
			this.inputField.value = this.keypadInput;
			this.inputField.dispatchEvent(new Event("input", { bubbles: true }));
			this.eventBus.emit("commitInputFromNumPad", this.keypadInput);
			this.closeKeypad();
		},
		closeKeypad() {
			this.keypadElement.style.display = "none";
			this.keypadInput = 0;
		},
	},
	mounted() {
		let self = this;
		const body = document.querySelector("body");
		const numButtons = document.querySelectorAll("[data-number]");
		const clearButton = document.querySelector("[data-clear]");
		const enterButtons = document.querySelector("[data-enter]");
		numButtons.forEach((button) => {
			button.addEventListener("click", (button) => {
				self.appendNumDisplay(button.target.innerText);
			});
		});
		clearButton.addEventListener("click", () => {
			self.clearInput();
		});
		enterButtons.addEventListener("click", () => {
			self.commitInput();
		});
		this.keypadElement = document.getElementById("keypad");
		this.keypadElement.addEventListener("click", (e) => {
			if (e.target.id == "keypad-container") this.closeKeypad();
		});
		body.onkeydown = (e) => {
			let keyNumber = parseInt(e.key);
			switch (e.key) {
				case "Enter":
					self.commitInput();
					break;
				case "Delete":
					self.clearInput();
					break;
				case "Escape":
					self.closeKeypad();
					break;
				case "Backspace":
					self.backspace();
					break;
				case keyNumber.toString():
					self.appendNumDisplay(keyNumber);
					break;
				case isNaN(keyNumber):
					break;
			}
		};
	},
	created() {
		this.eventBus.on("numInputPadInit", () => {
			this.keypadElement.style.display = "block";
			this.keypadLocale = this.inputConfig.locale;
			this.inputField = document.querySelector(`[name="${this.inputConfig.inputField}"]`);
			this.keypadInput = parseInt(this.inputField.value) || 0;
		});
		onBeforeUnmount(() => {
			this.eventBus.off("numInputPadInit");
		});
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#keypad {
	display: none;
	position: fixed;
	height: 100vh;
	width: 100vw;
	top: 0;
	right: 0;
	bottom: 60px;
	left: 0;
	background-color: rgba(0, 0, 0, 0.6);
	backdrop-filter: blur(4px);
	z-index: 100;
}

#keypad-container {
	display: grid;
	height: 100%;
	align-content: center;
}

.keypad-grid {
	position: relative;
	display: grid;
	justify-content: center;
	align-content: center;
	grid-template-columns: repeat(4, 100px);
	grid-template-rows: minmax(100px, auto) repeat(4, 100px);
	background: rgba(92, 89, 136, 0.38);
	margin: auto;
	border-radius: 1.25em;
	padding: 30px;
}

.keypad-grid>button {
	margin: 2px auto;
	min-width: 3em;
	font-size: 2rem;
	border: 1px solid #fff;
	outline: none;
	cursor: pointer;
	background-color: rgba(255, 255, 255, 0.6);
	transition: transform 0.2s;
}

.keypad-grid>button:hover {
	background-color: rgba(205, 221, 255, 0.8);
	transform: scale(0.98);
}

button.span-two-rows {
	grid-row: span 2;
	min-width: 3em;
}

button.span-three-col {
	grid-column: span 3;
	min-width: 9.25em;
}

.keypad-display {
	grid-column: 1 / -1;
	background-color: rgba(0, 0, 0, 0.7);
	display: flex;
	align-items: flex-end;
	justify-content: space-around;
	flex-direction: column;
	padding: 10px;
	word-wrap: break-word;
	word-break: break-all;
	border-radius: 8px;
	margin: 2px;
}

.keypad-display .current-input {
	color: #fff;
	font-size: 2.5rem;
}
</style>
