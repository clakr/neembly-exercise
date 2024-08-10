<script setup lang="ts">
import { twMerge } from "tailwind-merge";

const props = withDefaults(defineProps<{ className?: string }>(), {
  className: "",
});

const classes = computed(() =>
  twMerge(
    "whitespace-nowrap grid place-content-center bg-slate-800 text-slate-50 rounded-full px-3 py-1.5 font-medium",
    props.className,
  ),
);
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
