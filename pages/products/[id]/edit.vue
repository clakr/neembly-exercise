<script setup lang="ts">
const route = useRoute();
const productId = route.params.id;

const productNuxtKey = `products:${productId}`;

const { data: product } = await useLazyAsyncData<Product>(
  productNuxtKey,
  () => $fetch(`https://fakestoreapi.com/products/${productId}`),
  {
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  }
);

const {
  status,
  error,
  data: categories,
} = await useLazyAsyncData<Category[]>(
  "categories",
  () => $fetch(`https://fakestoreapi.com/products/categories`),
  {
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
    },
  }
);

async function handleUpdateProduct(event: Event) {
  const formData = new FormData(event.target as HTMLFormElement);
  const data = Object.fromEntries(formData);

  // update product server-side
  await $fetch(`https://fakestoreapi.com/products/${productId}`, {
    method: "PUT",
    body: data,
    onResponse() {
      // update product client-side
      const productNuxtData = useNuxtData(productNuxtKey);
      const product = productNuxtData.data.value as Product;

      const productsNuxtData = useNuxtData("products");
      const products = productsNuxtData.data.value as Product[];
      const productIndex = products.findIndex(
        ({ id }) => productId === id.toString()
      );

      productNuxtData.data.value = { ...product, ...data };
      products[productIndex] = { ...products[productIndex], ...data };

      alert("Success: Update Product");

      navigateTo("/");
    },
  });
}
</script>

<template>
  <main class="max-w-screen-2xl mx-auto p-4">
    <span v-if="status === 'pending'">loading...</span>
    <span v-else-if="status === 'error' && error">{{ error }}</span>
    <template v-else-if="status === 'success' && product">
      <form
        class="flex flex-col gap-y-3 bg-white rounded border border-slate-200 p-4"
        @submit.prevent="handleUpdateProduct"
      >
        <FormField>
          <FormLabel for="title">Title</FormLabel>
          <FormInput
            id="title"
            type="text"
            name="title"
            :value="product.title"
          />
        </FormField>
        <FormField>
          <FormLabel for="price">Price</FormLabel>
          <FormInput
            id="price"
            type="number"
            name="price"
            :value="product.price"
          />
        </FormField>
        <FormField>
          <FormLabel for="description">Description</FormLabel>
          <FormTextarea
            id="description"
            name="description"
            :value="product.description"
          />
        </FormField>
        <FormField>
          <FormLabel for="category">Category</FormLabel>
          <FormSelect id="category" name="category">
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
              :selected="product.category === category"
            >
              {{ category }}
            </option>
          </FormSelect>
        </FormField>
        <button class="bg-slate-800 text-slate-50 py-2 rounded mt-2">
          Update Product
        </button>
      </form>
    </template>
  </main>
</template>
