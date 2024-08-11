<script setup lang="ts">
const {
  status: productsStatus,
  error: productsError,
  data: products,
} = await useLazyAsyncData<Product[]>("products", () => client("/products"), {
  getCachedData: (key, nuxtApp) =>
    nuxtApp.payload.data[key] || nuxtApp.static.data[key],
});

const {
  status: categoriesStatus,
  error: categoriesError,
  data: categories,
} = await useLazyAsyncData<Category[]>(
  "categories",
  () => client("/products/categories"),
  {
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  }
);

const selectedCategories = ref<Category[]>([]);

const filteredProducts = computed(() => {
  if (selectedCategories.value.length === 0) {
    return products.value;
  }

  return products.value?.filter((product) =>
    selectedCategories.value.includes(product.category)
  );
});
</script>

<template>
  <main class="max-w-screen-2xl mx-auto p-4 flex flex-col gap-y-2">
    <NuxtLink
      to="/products/create"
      class="bg-slate-800 text-white px-3 py-2 rounded flex items-center gap-x-2 justify-center self-end"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="size-6"
      >
        <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
      </svg>
      Create Product
    </NuxtLink>
    <section class="grid grid-cols-[250px_1fr] gap-x-4">
      <span
        v-if="productsStatus === 'pending' && categoriesStatus === 'pending'"
      >
        loading...
      </span>
      <span
        v-else-if="productsStatus === 'error' || categoriesStatus === 'error'"
      >
        {{ productsError || categoriesError }}
      </span>
      <template v-else-if="products && categories">
        <div
          class="flex flex-col gap-y-1 bg-white p-4 rounded border border-slate-200"
        >
          <label
            v-for="category in categories"
            :key="category"
            :for="category"
            class="flex items-center gap-x-1.5"
          >
            <input
              :id="category"
              v-model="selectedCategories"
              :value="category"
              type="checkbox"
            />
            {{ category }}
          </label>
        </div>
        <div
          class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(400px,1fr))] auto-rows-[400px] col-start-2"
        >
          <article
            v-for="product in filteredProducts"
            :key="product.id"
            class="border bg-white border-slate-200 p-8 rounded-lg group hover:border-slate-400 transition-colors relative"
          >
            <NuxtLink :to="`/products/${product.id}`" class="">
              <img
                :src="product.image"
                alt=""
                class="rounded aspect-square object-contain bg-center group-hover:scale-105 transition-transform h-full mx-auto"
              />
            </NuxtLink>
            <div
              class="absolute bottom-6 left-6 bg-slate-100 border border-slate-200 flex rounded-full max-w-[calc(100%-3rem)] p-1"
            >
              <h2 class="grid place-content-center px-2 font-medium">
                {{ product.title }}
              </h2>
              <Pill>{{ formatCurrency(product.price) }} USD</Pill>
            </div>
          </article>
        </div>
      </template>
    </section>
  </main>
</template>
