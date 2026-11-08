/*!
 * CSH Models and Constants v0.0.6
 * (c) 2026 Chris Hardwick
 */

const trackerModel = {
	id: null,
	workspace_id: null,
	project_id: null,
	start: null,
	stop: null,
	duration: null,
	description: null,
	tags: null,
	tag_ids: null,
	at: null,
	user_id: null,
	uid: null,
	wid: null,
	pid: null,
};

const candidateProfile = {
	id: Number,
	name: String,
	title: String,
	location: String,
	email: String,
	phone: String,
	websiteA: String,
	websiteB: String,
	websiteC: String,
	github: String,
	linkedin: String,
	summary: String,
	status: String,
	experienceStart: Date,
	featuredQuote: String,
	skills: Array,
};

const dutiesModel = [
	{
		id: Number,
		title: String,
		company: String,
		dates: String,
		type: String,
		duties: [
			{
				details: String,
				related: Array,
			},
		],
	},
];

const appNotify = {
	code: "",
	message: "",
	success: false,
};

const dateOptions = {
	weekday: "long",
	year: "numeric",
	month: "long",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
	second: "2-digit",
	hour12: false,
};

const timeOptions = {
	hour: "numeric",
	minute: "2-digit",
	second: "2-digit",
};

const permissionsModel = {
	admin: false,
	siteAdmin: false,
	siteEditor: false,
	contributor: false,
	verified: false,
	loggedIn: false,
};

const movieModel = {
	title: "",
	original_title: "",
	tagline: "",
	summary: "",
	studio: "",
	rating: "",
	content_rating: "",
	duration: "",
	tags_genre: "",
	tags_director: "",
	tags_writer: "",
	tags_star: "",
	year: "",
	tags_country: "",
	audience_rating: "",
	slug: "",
};

export { trackerModel, candidateProfile, dutiesModel, appNotify, dateOptions, timeOptions, permissionsModel, movieModel };
