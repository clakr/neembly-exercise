<script setup lang="ts">
import { twMerge } from "tailwind-merge";

const model = defineModel<string | number>();

const props = withDefaults(defineProps<{ className?: string }>(), {
  className: "",
});

const classes = computed(() =>
  twMerge("border border-slate-200/75 px-3 py-2 rounded", props.className)
);
</script>

<template>
  <input v-model="model" :class="classes" />
</template>
