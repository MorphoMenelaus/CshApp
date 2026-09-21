// Models and constants used across the app
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

export { trackerModel, candidateProfile, dutiesModel, appNotify, dateOptions, timeOptions, permissionsModel };
