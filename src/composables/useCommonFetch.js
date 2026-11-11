/**
 * GET json from any REST API endpoint
 *
 * @name useFetchJson
 *
 * @method {GET}
 * @param {String} endpoint (String)
 * @param {String} baseUrl (String)
 * @param {Array} paramArgs (optional) [{ paramName: value }]
 * @param {Array} headerArgs (optional) [{ headerName: value }]
 * @returns {Promise<Object>}
 * @throws {useFetchError}
 */
const useFetchJson = async (endpoint, baseUrl, paramArgs = [], headerArgs = []) => {
	let headersArray = [{ "Content-Type": "application/json; charset=utf-8" }, ...headerArgs];

	let headerObj = new Headers();
	headersArray.forEach((item) => {
		let header = Object.entries(item).flatMap(([key, value]) => [key, value]);
		headerObj.append(header[0], header[1]);
	});

	let requestUrl = new URL(endpoint, baseUrl);

	if (paramArgs.length > 0) {
		let params = requestUrl.searchParams;
		paramArgs.forEach((item) => {
			let param = Object.entries(item).flatMap(([key, value]) => [key, value]);
			params.set(param[0], param[1]);
		});
		requestUrl.search = params.toString();
	}

	try {
		let request = new Request(requestUrl.toString(), {
			method: "GET",
			headers: headerObj,
		});

		let response = await fetch(request);
		let data = response.json();

		return data;
	} catch (error) {
		throw new useFetchError(`useFetch Error: ${error}`);
	}
};

/**
 * POST to any REST API endpoint
 *
 * @name useFetchPost
 *
 * @method {POST}
 * @param {String} endpoint (String)
 * @param {String} baseUrl (String)
 * @param {Array} headerArgs (optional) [{ headerName: value }]
 * @param {Object} body (optional)
 * @returns {Promise<Object>}
 * @throws {useFetchError}
 */
const useFetchPost = async (endpoint, baseUrl, headerArgs = [], body = {}) => {
	let headersArray = [{ "Content-Type": "application/json; charset=utf-8" }, ...headerArgs];

	let headerObj = new Headers();
	headersArray.forEach((item) => {
		let header = Object.entries(item).flatMap(([key, value]) => [key, value]);
		headerObj.append(header[0], header[1]);
	});

	let requestUrl = new URL(endpoint, baseUrl);

	try {
		let request = new Request(requestUrl.toString(), {
			method: "POST",
			headers: headerObj,
			body: body,
		});

		let response = await fetch(request);
		let data = response.json();

		return data;
	} catch (error) {
		throw new useFetchError(`useFetch Error: ${error}`);
	}
};

class useFetchError extends Error {
	constructor(message) {
		super(message);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export { useFetchJson, useFetchPost };
