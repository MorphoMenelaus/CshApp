// Site Variables
const baseUrl = "";

// sessionStorage persistence
const storageKey = "cshApp";
const session = {
	get() {
		const storage = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
		return storage;
	},
	add(key, value) {
		let storage = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
		storage[key] = value;
		sessionStorage.setItem(storageKey, JSON.stringify(storage));
	},
	save(storage) {
		sessionStorage.setItem(storageKey, JSON.stringify(storage));
	},
	deleteAll() {
		sessionStorage.removeItem(storageKey);
	}
}

const sessionMethods = {
	session,
	baseUrl,
}

export default sessionMethods;