/**
 * useCommonFetch: Contains GET and POST methods designed for most use cases.
 * Headers and Query Params are accepted as Arrays
 */

/**
 * Try and determine what data type an endpoint is returning
 *
 * @name parseFetchResponse
 *
 * @param {response} response
 * @returns {Object}
 */
async function parseFetchResponse(response) {
	// Check the header first as a quick hint
	const contentType = response.headers.get("content-type") || "";

	// Read the stream as plain text so it can be safely inspected
	const rawText = await response.text();

	try {
		const parsed = JSON.parse(rawText);

		// JSON.parse can return primitives (e.g., "123" -> 123, "true" -> true)
		// Verify it is actually an object or array
		if (parsed !== null && typeof parsed === "object") {
			return { type: "json-object", data: parsed };
		}

		return { type: "json-primitive", data: parsed };
	} catch (error) {
		// If JSON.parse fails, it is plain text, HTML, XML, or malformed JSON
		if (contentType.includes("text/html")) {
			return { type: "html", data: rawText };
		}
		return { type: "text-or-other", data: rawText };
	}
}

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

		const response = await fetch(request);
		const result = await parseFetchResponse(response);
		return result.data;
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
