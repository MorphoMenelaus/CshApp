<script setup>
import { ref, inject, onMounted, onUnmounted } from "vue";
// Vue 3.5+ destructure props to preserve reactivity
// hiddenLabel(bool) to optionally hide the label visually
// but still allow screen readers to see it in the DOM
const { label, id, error, hiddenLabel, required } = defineProps({
	label: String,
	id: String,
	error: String,
	hiddenLabel: Boolean,
	required: Boolean,
});

// Inject the validation bridge from the parent container
const formValidation = inject("FormValidation", null);

// Create a reactive two-way binding for v-model
const model = defineModel({ type: String, default: "" });

const validate = () => {
	if (!model.value && required) return `${label} is required.`;
	return null;
};

onMounted(() => {
	if (formValidation) {
		// Register this nested chunk to the master form
		formValidation.registerField(id, validate);
	}
});

onUnmounted(() => {
	if (formValidation) {
		formValidation.unregisterField(id);
	}
});
</script>

<template>
	<div class="input-group">
		<label :hidden="hiddenLabel" :for="id">{{ label }}</label>
		<input :id="id" v-model="model" :class="{ 'has-error': error }" :placeholder="label" @keyup="validate" />
		<small v-if="error" class="error-msg">{{ error }}</small>
	</div>
</template>

<style scoped>
.input-group {
	display: flex;
	align-content: center;
	flex-direction: column;
	margin-bottom: 15px;
}

.has-error {
	border: 1px #f00 solid;
}

.error-msg {
	color: #f00;
}
</style>
