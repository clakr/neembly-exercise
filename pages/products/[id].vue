<script setup lang="ts">
const route = useRoute();
const productId = route.params.id;

const {
  status,
  error,
  data: product,
} = await useLazyAsyncData<Product>(
  `products:${productId}`,
  () => $fetch(`https://fakestoreapi.com/products/${productId}`),
  {
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  },
);
</script>

<template>
  <main class="max-w-screen-2xl mx-auto p-4">
    <span v-if="status === 'pending'">loading...</span>
    <span v-else-if="status === 'error' && error">{{ error }}</span>
    <template v-else-if="status === 'success' && product">
      <section
        class="bg-white border-slate-200 border p-12 rounded grid grid-cols-7 gap-12"
      >
        <div class="col-span-4">
          <img
            :src="product.image"
            alt=""
            class="aspect-square bg-center object-contain mx-auto h-[500px]"
          />
        </div>
        <div class="col-span-3 flex flex-col gap-y-4 h-full">
          <h1 class="text-5xl font-semibold">{{ product.title }}</h1>
          <div class="flex justify-between">
            <Pill>{{ formatCurrency(product.price) }} USD</Pill>
            <div
              class="flex gap-x-1 items-center font-medium text-slate-950/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                class="size-6 fill-slate-800"
              >
                <path
                  d="m234.29 114.85l-45 38.83L203 211.75a16.4 16.4 0 0 1-24.5 17.82L128 198.49l-50.53 31.08A16.4 16.4 0 0 1 53 211.75l13.76-58.07l-45-38.83A16.46 16.46 0 0 1 31.08 86l59-4.76l22.76-55.08a16.36 16.36 0 0 1 30.27 0l22.75 55.08l59 4.76a16.46 16.46 0 0 1 9.37 28.86Z"
                />
              </svg>
              <span>{{ product.rating.rate }}</span>
              <span>({{ product.rating.count }})</span>
            </div>
          </div>
          <hr />
          <p class="text-slate-950/75">{{ product.description }}</p>
          <button
            type="button"
            class="bg-slate-800 text-white py-3 rounded-full flex items-center gap-x-2 justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="size-6 fill-current"
            >
              <path d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </section>
    </template>
  </main>
</template>
