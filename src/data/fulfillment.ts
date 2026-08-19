export const fulfillmentCatalog = {
  "tee-classic": {
    provider: "aliexpress" as const,
    aliexpressProductId: process.env.ALIEXPRESS_TEE_PRODUCT_ID ?? null,
    sku: process.env.ALIEXPRESS_TEE_SKU ?? null,
  },
};
