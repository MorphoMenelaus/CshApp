function isValidOpenValue(value) {
	let goodRange;
	if (value != null && !isNaN(value)) {
		goodRange = value >= 0 && value <= 1000000000 ? true : false;
		return goodRange;
	}
	return false;
}

function isValidTransferValue(value) {
	let goodRange;
	if (value != null && !isNaN(value)) {
		goodRange = value >= -1000000000 && value <= 1000000000 ? true : false;
		return goodRange;
	}
	return false;
}

function checkFetchErrors(fetchResponse) {
	let status = {
		code: fetchResponse?.status?.code ? fetchResponse.status.code : fetchResponse.status,
		message: "",
		ok: true,
		userMustDismiss: false
	};
	if ((!fetchResponse.length > 0 && !fetchResponse.ok) || fetchResponse.status >= 400) {
		status.ok = false;
		switch (fetchResponse.status) {
			case 400:
				status.message = "Bad Request";
				break;
			case 401:
				status.message = "User mame or password is incorrect or Access Token has expired.";
				status.userMustDismiss = true;
				break;
			case 403:
				status.message = "You don't have permissions to do that";
				status.userMustDismiss = true;
				break;
			case 500:
				status.message = "Internal Server Error";
				break;
			case 503:
				status.message = "Service Unavailable";
				break;
			case undefined:
				status.code = null;
				status.message = "No results";
				break;
			default:
				status.message = fetchResponse.status;
				status.userMustDismiss = true;
		}
		console.error(status);
	};
	return status;
}

const sharedScripts = {
	checkFetchErrors,
	isValidOpenValue,
	isValidTransferValue
}

export default sharedScripts;