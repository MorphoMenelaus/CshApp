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

const session = {
	recall,
}

export default session;