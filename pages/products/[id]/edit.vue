<script setup lang="ts">
import Textarea from "~/components/Form/Textarea.vue";

const route = useRoute();
const productId = route.params.id;

const productNuxtKey = `products:${productId}`;

const { data: product } = await useLazyAsyncData<Product>(
  productNuxtKey,
  () => client(`/products/${productId}`),
  {
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  }
);

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

async function handleUpdateProduct(event: Event) {
  const formData = new FormData(event.target as HTMLFormElement);
  const data = Object.fromEntries(formData);

  // update product server-side
  await client(`/products/${productId}`, {
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
        <Field>
          <Label for="title">Title</Label>
          <Input id="title" type="text" name="title" :value="product.title" />
        </Field>
        <Field>
          <Label for="price">Price</Label>
          <Input
            id="price"
            type="number"
            name="price"
            step="0.01"
            min="0.01"
            :value="product.price"
          />
        </Field>
        <Field>
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            :value="product.description"
          />
        </Field>
        <Field>
          <Label for="category">Category</Label>
          <Select id="category" name="category">
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
              :selected="product.category === category"
            >
              {{ category }}
            </option>
          </Select>
        </Field>
        <button class="bg-slate-800 text-slate-50 py-2 rounded mt-2">
          Update Product
        </button>
      </form>
    </template>
  </main>
</template>
