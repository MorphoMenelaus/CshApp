import { onMounted, onUnmounted, isRef, watch } from "vue";

function useWindowEvent(type, handler) {
	onMounted(() => window.addEventListener(type, handler));
	onUnmounted(() => window.removeEventListener(type, handler));
}

function useElementEvent(target, type, handler) {
	let cleanup = () => {};

	const attachListener = (el) => {
		cleanup(); // Clean up any previous listener if the element changed
		if (el && typeof el.addEventListener === "function") {
			el.addEventListener(type, handler);
			cleanup = () => el.removeEventListener(type, handler);
		}
	};

	// Case 1: Dynamic Template Ref or Reactive Source
	if (isRef(target) || typeof target === "function") {
		// Watch for when the DOM element is bound or changes
		const stopWatch = watch(
			target,
			(newEl) => attachListener(newEl),
			{ immediate: true, flush: "post" }, // flush post ensures DOM is updated
		);

		onUnmounted(() => {
			stopWatch();
			cleanup();
		});
	}
	// Case 2: Static element passed (e.g., document, document.body)
	else {
		onMounted(() => attachListener(target));
		onUnmounted(() => cleanup());
	}
}

export { useWindowEvent, useElementEvent };
