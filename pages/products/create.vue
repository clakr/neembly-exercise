<script setup lang="ts">
const {
  status,
  error,
  data: categories,
} = await useLazyAsyncData<Category[]>(
  "categories",
  () => client("/products/categories"),
  {
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  }
);

async function handleCreateProduct(event: Event) {
  const formData = new FormData(event.target as HTMLFormElement);
  const data = Object.fromEntries(formData);

  // create product server-side
  await client("/products", {
    method: "POST",
    body: data,
    onResponse() {
      // create product client-side
      const createdProduct = {
        id: +data.id,
        title: data.title.toString(),
        price: +data.price,
        description: data.description.toString(),
        category: data.category.toString(),
        image: data.image.toString(),
        rating: {
          rate: 0,
          count: 0,
        },
      };

      const productNuxtData = useNuxtData(`products:${data.id}`);
      productNuxtData.data.value = createdProduct;

      const productsNuxtData = useNuxtData("products");
      const products = productsNuxtData.data.value as Product[];

      products.unshift(createdProduct);

      alert("Success: Create Product");

      navigateTo("/");
    },
  });
}
</script>

<template>
  <main class="max-w-screen-2xl mx-auto p-4">
    <span v-if="status === 'pending'">loading...</span>
    <span v-else-if="status === 'error' && error">{{ error }}</span>
    <template v-else-if="status === 'success' && categories">
      <form
        class="flex flex-col gap-y-3 bg-white rounded border border-slate-200 p-4"
        @submit.prevent="handleCreateProduct"
      >
        <input type="hidden" name="id" :value="new Date().getTime()" />
        <input type="hidden" name="image" value="https://placehold.co/400" />
        <FormField>
          <FormLabel for="title">Title</FormLabel>
          <FormInput id="title" type="text" name="title" />
        </FormField>
        <FormField>
          <FormLabel for="price">Price</FormLabel>
          <FormInput id="price" type="number" name="price" />
        </FormField>
        <FormField>
          <FormLabel for="description">Description</FormLabel>
          <FormTextarea id="description" name="description" />
        </FormField>
        <FormField>
          <FormLabel for="category">Category</FormLabel>
          <FormSelect id="category" name="category">
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </FormSelect>
        </FormField>
        <button class="bg-slate-800 text-slate-50 py-2 rounded mt-2">
          Create Product
        </button>
      </form>
    </template>
  </main>
</template>
