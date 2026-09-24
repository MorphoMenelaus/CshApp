<template>
	<div id="bg-parent" class="animate">
		<div class="one"></div>
		<div class="two"></div>
	</div>
</template>

<style scoped>
#bg-parent {
	position: fixed;
	display: flex;
	top: -75px;
	right: 0;
	left: -15vw;
	bottom: 0;
	width: 130vw;
	height: 130vh;
	z-index: -1;
	opacity: 0.2;
}

.uiDarkMode #bg-parent {
	opacity: 0.3;
}

.one,
.two {
	width: 100%;
	height: 100%;
}

.one {
	transform: translateY(-20%) translateX(12%) scaleX(1.5) scaleY(1.25);
	background: radial-gradient(circle, rgb(213 0 255 / 75%) 0%, rgba(2, 6, 24, 0) 60%);
}

.mobile .one {
	transform: translateY(-20%) translateX(12%) scaleX(3) scaleY(3.25);
	background: radial-gradient(circle, rgb(213 0 255 / 75%) 0%, rgba(2, 6, 24, 0) 20%);
}

.uiDarkMode .one {
	background: radial-gradient(circle, rgb(253 0 255 / 50%) 0%, rgba(2, 6, 24, 0) 60%);
}

.uiDarkMode .mobile .one {
	background: radial-gradient(circle, rgb(253 0 255 / 50%) 0%, rgba(2, 6, 24, 0) 20%);
}

.two {
	transform: translateY(15%) translateX(-15%) scaleX(1.75) scaleY(1.25);
	background: radial-gradient(circle, rgb(0 112 255 / 90%) 0%, rgba(2, 6, 24, 0) 55%);
}

.mobile .two {
	transform: translateY(15%) translateX(-15%) scaleX(3) scaleY(3.25);
	background: radial-gradient(circle, rgb(0 112 255 / 90%) 0%, rgba(2, 6, 24, 0) 20%);
}

.uiDarkMode .two {
	background: radial-gradient(circle, rgb(0 112 255 / 70%) 0%, rgba(2, 6, 24, 0) 55%);
}

.uiDarkMode .mobile .two {
	background: radial-gradient(circle, rgb(0 112 255 / 70%) 0%, rgba(2, 6, 24, 0) 20%);
}

#bg-parent.animate {
	animation: rotate-bg 25s infinite ease-in-out both;
}

.animate .one {
	animation: rotate-one 8s infinite ease-in-out both;
}

.animate .two {
	animation: rotate-two 8s infinite ease-in-out both;
	animation-delay: 4s;
}

@keyframes rotate-bg {
	0% {
		transform: rotateZ(0deg) scale(0.8);
	}

	50% {
		transform: rotateZ(180deg) scale(1.2);
	}

	100% {
		transform: rotateZ(359deg) scale(0.8);
	}
}

@keyframes rotate-one {
	0%,
	80%,
	100% {
		transform: translateY(-20%) translateX(12%) scaleX(1.5) scaleY(1.25) rotateZ(0deg);
	}

	40% {
		transform: rotateZ(180deg);
	}
}

@keyframes rotate-two {
	0%,
	80%,
	100% {
		transform: translateY(15%) translateX(-15%) scaleX(1.75) scaleY(1.25) rotateZ(0deg);
	}

	40% {
		transform: rotateZ(180deg);
	}
}

@media (min-width: 992px) {
	#bg-parent {
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}
}
</style>
