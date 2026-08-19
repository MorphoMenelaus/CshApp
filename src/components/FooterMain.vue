<template>
	<footer>
		<div class="flex-between">
			<h3 id="name-contact" title="Contact Chris Hardwick" @click="openThisModalCloseOthers()">
				<strong>Chris&nbsp;Hardwick</strong> {{
					!isMobile ? ' &mdash; Web Application Developer &amp; Frontend Developer' :
						'' }}
			</h3>
			<!-- <small>Powered by Vue 3 &amp; Node/Express</small> -->
			<div id="footer-contacts">
				<a v-if="!isMobile" class="footer-link" href="https://www.linkedin.com/in/cs-hardwick" target="_blank"
					title="Chris Hardwick | Linkedin Profile">Linkedin</a>
				<a v-if="!isMobile" class="footer-link" href="https://hardwick.design" target="_blank"
					title="Chris Hardwick | Graphic Designer">Personal Site</a>
				<span class="footer-link" @click="openThisModalCloseOthers()" title="Contact Chris Hardwick">Contact
					Me</span>
			</div>
		</div>
	</footer>
</template>

<script>
import { inject } from "vue";

export default {
	name: 'FooterMain',
	props: {
		// serverVersion: String,
		isMobile: Boolean
	},
	data() {
		return {
			contactEmail: inject("contactEmail"),
			loginShow: inject("loginShow"),
			registerUser: inject('registerUser'),
		}
	},
	methods: {
		openThisModalCloseOthers() {
			this.loginShow(false);
			this.registerUser(false);
			this.contactEmail(true);
			this.sendAnalyticsEvent('contact_form_footer', 'contact_modal');
		}
	},
}
</script>

<style scoped>
footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 3em;
	align-content: center;
	background-color: #313b64;
	border-top: 1px #fff solid;
	color: var(--color-text);
}

h3 {
	text-align: center;
	color: #fff;
}

.flex-between {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	/* margin-left: 30px; */
	padding: 0 30px;
}

#name-contact {
	cursor: pointer;
	font-size: 1.25em;
}

#name-contact:hover {
	color: #f60;
}

#footer-contacts {
	display: flex;
	align-items: center;
}

a.footer-link,
span.footer-link {
	color: #7ab5ff;
	margin-right: 15px;
	text-decoration: none;
	padding: 0 15px 0 7px;
	border-radius: 6px;
}

a.footer-link:hover,
span.footer-link:hover {
	color: #93d329;
	text-decoration: underline;
	background-color: unset;
}

span.footer-link {
	margin-right: 0;
	padding-right: 0;
	cursor: pointer;
}

@media (min-width: 768px) {}
</style>
