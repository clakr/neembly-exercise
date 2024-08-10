<script setup lang="ts">
const {
  status,
  error,
  data: products,
} = await useFetch<Product[]>("https://fakestoreapi.com/products");
</script>

<template>
  <main
    class="max-w-screen-xl mx-auto p-4 grid gap-4 grid-cols-[repeat(auto-fit,minmax(350px,1fr))] auto-rows-[350px]"
  >
    <span v-if="status === 'pending'">loading...</span>
    <span v-else-if="status === 'error' && error">{{ error }}</span>
    <template v-else>
      <article
        v-for="product in products"
        :key="product.id"
        class="border bg-white border-slate-200 p-8 rounded-lg group hover:border-slate-400 transition-colors relative"
      >
        <a :href="`/products/${product.id}`" class="">
          <img
            :src="product.image"
            alt=""
            class="rounded aspect-square object-contain bg-center group-hover:scale-105 transition-transform h-full mx-auto"
          />
        </a>
        <div
          class="absolute bottom-6 left-6 bg-slate-100 border border-slate-200 flex rounded-full max-w-[calc(100%-3rem)] p-1"
        >
          <h2 class="grid place-content-center px-2 font-medium">
            {{ product.title }}
          </h2>
          <span
            class="whitespace-nowrap grid place-content-center bg-slate-800 text-slate-50 rounded-full px-3 py-1.5"
          >
            {{ formatCurrency(product.price) }} USD
          </span>
        </div>
      </article>
    </template>
  </main>
</template>
