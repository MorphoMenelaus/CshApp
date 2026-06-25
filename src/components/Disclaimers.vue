<template>
	<div id="disclaimers">
		<p>This web application was made using a <strong>Vue 3</strong> frontend with a <strong>NodeJS</strong> backend.
		</p>
		<p>
			This site is protected by reCAPTCHA and the Google
			<strong>
				<a class="link" title="Privacy Policy" target="_blank"
					href="https://policies.google.com/privacy">Privacy Policy</a>
			</strong> and
			<strong>
				<a class="link" title="Terms of Service" target="_blank" href="https://policies.google.com/terms">Terms
					of Service</a>
			</strong> apply.
		</p>
	</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
strong {
	font-weight: bold;
}

#disclaimers {
	text-align: center;
	color: #222;
	background-color: rgb(219 221 247 / 80%);
	border-radius: 8px;
	margin: 30px auto 0;
	padding: 15px 30px;
	width: fit-content;
}

@media (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 768px) {}

@media (min-width: 992px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) {}
</style>