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
	pid: null
}

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
	skills: Array
}

export {
	trackerModel,
	candidateProfile
}
