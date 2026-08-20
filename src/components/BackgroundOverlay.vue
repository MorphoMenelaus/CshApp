<template>
	<div id="bg-parent">
		<div class="one"></div>
		<div class="two"></div>
	</div>
</template>

<style scoped>
#bg-parent {
	position: fixed;
	display: flex;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	width: 100vw;
	height: 100vh;
	z-index: -1;
	opacity: .3;
}

.uiDarkMode #bg-parent[data-v-bd50b37f] {
	opacity: .5;
}

.one,
.two {
	width: 100%;
	height: 100%;
}

.one {
	transform: translateY(-20%) translateX(12%) scaleX(1.5) scaleY(1.25);
	background: radial-gradient(circle, rgb(77 0 255 / 35%) 0%, rgba(2, 6, 24, 0) 60%);
}

.mobile .one {
	background: radial-gradient(circle, rgb(77 0 255 / 35%) 0%, rgba(2, 6, 24, 0) 35%);
}

.uiDarkMode .one {
	background: radial-gradient(circle, rgb(77 0 255 / 60%) 0%, rgba(2, 6, 24, 0) 60%);
}

.uiDarkMode .mobile .one {
	background: radial-gradient(circle, rgb(77 0 255 / 60%) 0%, rgba(2, 6, 24, 0) 35%);
}

.two {
	transform: translateY(15%) translateX(-15%) scaleX(1.5) scaleY(1.25);
	background: radial-gradient(circle, rgb(0 112 255 / 100%) 0%, rgba(2, 6, 24, 0) 60%);
}

.mobile .two {
	background: radial-gradient(circle, rgb(0 112 255 / 100%) 0%, rgba(2, 6, 24, 0) 30%);
}

.uiDarkMode .two {
	background: radial-gradient(circle, rgb(0 112 255 / 50%) 0%, rgba(2, 6, 24, 0) 60%);
}

.uiDarkMode .mobile .two {
	background: radial-gradient(circle, rgb(0 112 255 / 50%) 0%, rgba(2, 6, 24, 0) 35%);
}
</style>