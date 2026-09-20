<template>
	<div id="general-disclaimer">
		<h3 class="julius-sans">Site built using a <strong>Vue 3</strong> frontend with a <strong>NodeJS/ExpressJS</strong> backend.</h3>
		<div>
			<p>
				I designed and built a backend server featuring more than 40 REST API endpoints, utilizing optimized SQL database queries for seamless data
				retrieval and state management. Together, the server and Vue 3 frontend enforce strong authentication with role-based access control (RBAC).
			</p>
			<p>
				Each page of this demonstration website showcases end-to-end features that cleanly integrate a responsive frontend UI with a well-organized
				relational database.
			</p>
			<p>
				While public and guest users have access to many features, certain areas require creating and verifying a user account to mitigate spam and
				bots. Core database interactions are fully demonstrated within the public areas.
			</p>
		</div>
		<div class="logos">
			<img class="logo" src="/icons/vue-logo.svg" title="Vue 3" alt="Vue 3 Logo" />
			<img class="logo" src="/icons/express-logo-white.svg" title="ExpressJS" alt="ExpressJS Logo" />
			<img class="logo short-logo" src="/icons/nodejsStackedDark.svg" title="NodeJS" alt="NodeJS Logo" />
			<img class="logo short-logo" src="/icons/mysql-official.svg" title="MySQL" alt="MySQL Logo" />
		</div>
	</div>
</template>

<style scoped>
#general-disclaimer {
	display: flex;
	flex-direction: column;
	margin: 15px auto;
}

h2,
h3 {
	font-weight: bold;
}

p {
	text-align: left;
	color: #222;
	text-indent: 1.5em;
	padding: 10px 0;
	width: fit-content;
}

strong {
	font-weight: bold;
}

.logos {
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	align-items: center;
}

img.logo {
	max-width: 50px;
	max-height: 40px;
	object-fit: contain;
	margin: 10px;
}

img.short-logo {
	max-width: 140px;
}

@media (min-width: 768px) {
	p {
		padding: 10px 0;
	}

	img.logo {
		max-width: 100px;
		max-height: 80px;
		margin: 15px 30px;
	}
}
</style>
