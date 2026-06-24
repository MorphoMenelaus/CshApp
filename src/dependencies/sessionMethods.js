// AppState session persistence
const storageKey = "cshApp";
const recall = {
	get(key = storageKey) {
		const storage = JSON.parse(sessionStorage.getItem(key) || "{}");
		return storage;
	},
	add(value, key = storageKey) {
		let storage = JSON.parse(sessionStorage.getItem(key) || "{}");
		storage[key] = value;
		sessionStorage.setItem(key, JSON.stringify(storage));
	},
	save(storage, key = storageKey) {
		sessionStorage.setItem(key, JSON.stringify(storage));
	},
	deleteAll(key = storageKey) {
		sessionStorage.removeItem(key);
	}
}

const storage = {
	get(key = storageKey) {
		const storage = JSON.parse(localStorage.getItem(key) || "{}");
		return storage;
	},
	add(value, key, storeKey = storageKey) {
		let storage = JSON.parse(localStorage.getItem(storeKey) || "{}");
		storage[key] = value;
		localStorage.setItem(storeKey, JSON.stringify(storage));
	},
	save(storage, key = storageKey) {
		localStorage.setItem(key, JSON.stringify(storage));
	},
	deleteAll(key = storageKey) {
		localStorage.removeItem(key);
	}
}

const session = {
	recall,
	storage,
}

export default session;