/*!
 * CSH Classes and Utilities v0.0.1
 * (c) 2026 Chris Hardwick
 */

class Storage {
	/**
	 * Saves or retrieves localStorage or sessionStorage
	 * 
	 * @name Storage
	 * 
	 * @param {String} parentKey Storage object key - required for some methods
	 * @param {String} storageType Expected "local" or "session" | Default to "local"
	 * @param {Object} storage
	 * @returns {Object} 
	 * @throws {StorageError}
	 */

	constructor(parentKey, storageType) {
		this.parentKey = parentKey || "cshApp";
		this.storageType = storageType || "local";
	}

	getstorageKey() {
		return this.parentKey;
	}

	get(key = this.parentKey) {
		let store = {};
		switch (this.storageType) {
			case "session":
				store = JSON.parse(sessionStorage.getItem(key));
				break;
			default:
				store = JSON.parse(localStorage.getItem(key));
		}
		return store || {};
	}

	save(storage = null) {
		if (!storage) {
			throw new StorageError("Save method requires an object");
		};
		switch (this.storageType) {
			case "session":
				sessionStorage.setItem(this.parentKey, JSON.stringify(storage));
				break;
			default:
				localStorage.setItem(this.parentKey, JSON.stringify(storage));
		}
		return true;
	}

	add(key = null, storage = null) {
		if (!key || !storage) {
			throw new StorageError("Invalid Key Value pair arguments");
		};
		let store = {};
		switch (this.storageType) {
			case "session":
				store = JSON.parse(sessionStorage.getItem(this.parentKey) || "{}");
				store[key] = storage;
				sessionStorage.setItem(this.parentKey, JSON.stringify(store));
				break;
			default:
				store = JSON.parse(localStorage.getItem(this.parentKey) || "{}");
				store[key] = storage;
				localStorage.setItem(this.parentKey, JSON.stringify(store));
		}
		return true;
	}

	delete(key = null) {
		if (!key) {
			throw new StorageError("Delete method requires a key");
		};
		let store = {};
		switch (this.storageType) {
			case "session":
				store = JSON.parse(sessionStorage.getItem(this.parentKey) || "{}");
				delete store[key];
				sessionStorage.setItem(this.parentKey, JSON.stringify(store));
				break;
			default:
				store = JSON.parse(localStorage.getItem(this.parentKey) || "{}");
				delete store[key];
				localStorage.setItem(this.parentKey, JSON.stringify(store));
		}
		return true;
	}

	deleteAll() {
		switch (this.storageType) {
			case "session":
				sessionStorage.removeItem(this.parentKey);
				break;
			default:
				localStorage.removeItem(this.parentKey);
		}
	}
}

async function addUserLog(appState = null, actionPerformed = null) {

	if (!appState || !actionPerformed) {
		throw new AddUserLogError("Invalid or missing arguments");
	};

	try {
		let body = {
			userId: appState.user.userId,
			userName: appState.user.userName,
			actionPerformed: actionPerformed,
		};

		let headerObj = new Headers();
		headerObj.append("Authorization", `Bearer ${appState.accessToken}`);
		headerObj.append("Content-Type", "application/json; charset=utf-8");
		let requestUrl = new URL("/api/userlogs", window.location.origin);

		let request = new Request(
			requestUrl.toString(), {
			method: 'POST',
			headers: headerObj,
			body: JSON.stringify(body)
		});

		await fetch(request);

	} catch (error) {
		throw new AddUserLogError(`Error posting data: ${error}`);
	}
}

function toTitleCase(str) {
	let spaced = str.replace(/([a-z])([A-Z])/g, '$1 $2');
	return `${spaced.charAt(0).toUpperCase()}${spaced.slice(1)}`;
}

function isUTCtime(str) {
	// strictly enforces a trailing Z or +00:00/ -00:00 offset
	let utcRegex = /^(?:.+)(Z|[+-]00:?00)$/;
	if (!utcRegex.test(str)) return false;

	// ensure the string can be successfully parsed into a real date
	let date = new Date(str);
	return !isNaN(date.getTime());
}

function sendAnalyticsEvent(eventType, method) {
	gtag('event', eventType, {
		'method': method,
		'page_location': window.location.href
	});
}

async function refreshAuthTokenAsNeeded(appState, forceRefresh = false) {
	// forceRefresh (optional argument) mostly implemented
	// to check if tokens are valid at any time for any reason 
	let serverResponse = {
		code: null,
		message: null,
		success: true,
	}

	if (!appState) {
		throw new RefreshTokenError("Invalid or missing appState");
	};


	// Server settings for Token expiration is 1h
	// Give it 20 seconds of wiggle room on expire time (20000ms)
	// Better to refresh a minute early than to cause a race condition error
	let expireMS = appState?.accessTokenExpiration - 20000;
	let currTime = new Date().getTime();
	if (currTime < expireMS && !forceRefresh) {
		serverResponse.code = 304;
		serverResponse.message = "Access Token unchanged";
		serverResponse.success = true;
		return serverResponse;
	}

	let body = {
		accessToken: appState?.accessToken,
		refreshToken: appState?.refreshToken,
	};

	try {

		let headerObj = new Headers();
		headerObj.append("Content-Type", "application/json; charset=utf-8");
		let requestUrl = new URL('/api/auth/refresh', window.location.origin);

		let request = new Request(
			requestUrl.toString(), {
			method: 'POST',
			headers: headerObj,
			body: JSON.stringify(body)
		});

		let response = await fetch(request);
		const data = await response.json();

		if (data?.success) {
			let updateAppState = appState;
			updateAppState.accessToken = data.authorization.accessToken;
			updateAppState.accessTokenExpiration = data.authorization.accessTokenExpiration;
			updateAppState.refreshToken = data.authorization.refreshToken;
			updateAppState.isLoggedOn = true;

			serverResponse.code = data.code;
			serverResponse.message = data.message;
			serverResponse.success = data.success;
			serverResponse.appState = updateAppState;
		} else {
			serverResponse = { ...serverResponse, ...data };
		}
	} catch (error) {
		console.error(error);
		throw new RefreshTokenError(`Error posting data: ${error}`);
	} finally {
		return serverResponse;
	}
}

async function tokenCheck(appState) {
	let serverResponse = {
		code: null,
		tokenValid: false,
		success: false,
	}

	if (!appState?.accessToken || !appState?.refreshToken) {
		throw new TokenCheckError("Invalid or missing arguments");
	};

	let body = {
		accessToken: appState?.accessToken,
		refreshToken: appState?.refreshToken,
	};

	try {

		let headerObj = new Headers();
		headerObj.append("Content-Type", "application/json; charset=utf-8");
		let requestUrl = new URL('/api/auth/tokencheck', window.location.origin);

		let request = new Request(
			requestUrl.toString(), {
			method: 'POST',
			headers: headerObj,
			body: JSON.stringify(body)
		});

		let response = await fetch(request);
		const data = await response.json();

		serverResponse.code = data.code;
		serverResponse.tokenValid = data.tokenValid;
		serverResponse.success = data.success;
	} catch (error) {
		console.error(error);
		throw new TokenCheckError(`Error posting data: ${error}`);
	} finally {
		return serverResponse;
	}
}

class StorageError extends Error {
	constructor(message) {
		super(message);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

class AddUserLogError extends Error {
	constructor(message) {
		super(message);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

class RefreshTokenError extends Error {
	constructor(message) {
		super(message);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

class TokenCheckError extends Error {
	constructor(message) {
		super(message);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export {
	Storage,
	addUserLog,
	toTitleCase,
	isUTCtime,
	sendAnalyticsEvent,
	refreshAuthTokenAsNeeded,
	tokenCheck
}
