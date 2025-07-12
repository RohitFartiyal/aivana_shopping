  // Helper function to serialize car data
  export const serializeProductData = (product, wishlisted = false) => {
    return {
      ...product,
      ratting: product.ratting ? parseFloat(product.ratting.toString()) : 0,
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
      wishlisted: wishlisted,
    };
  };