import { Product, Brand } from "./1-types";

/**
 * Products - Challenge 1: Product Price Analysis
 *
 * Create a function that analyzes pricing information from an array of products.
 *
 * Requirements:
 * - Create a function called `analyzeProductPrices` that accepts an array of Product objects
 * - The function should return an object containing:
 *   - totalPrice: The sum of all product prices
 *   - averagePrice: The average price of all products (rounded to 2 decimal places)
 *   - mostExpensiveProduct: The complete Product object with the highest price
 *   - cheapestProduct: The complete Product object with the lowest price
 *   - onSaleCount: The number of products that are currently on sale
 *   - averageDiscount: The average discount percentage for products on sale (rounded to 2 decimal places)
 * - Prices should be manage in regular prices and not in sale prices
 * - Use proper TypeScript typing for parameters and return values
 * - Implement the function using efficient array methods
 *
 *
 **/

export interface ProductPriceAnalysis {
  totalPrice: number;
  averagePrice: number;
  mostExpensiveProduct: Product;
  cheapestProduct: Product;
  onSaleCount: number;
  averageDiscount: number;
}

export async function analyzeProductPrices(
  products: Product[],
): Promise<ProductPriceAnalysis> {
  if (products.length === 0) {
    throw new Error(
      "Product list is empty. Cannot compute average, most expensive, nor cheapest product",
    );
  }

  const productPriceAnalysis: ProductPriceAnalysis =
    products.reduce<ProductPriceAnalysis>(
      (acc, curr) => {
        acc.totalPrice += curr.price;

        if (curr.price > acc.mostExpensiveProduct.price) {
          acc.mostExpensiveProduct = curr;
        }

        if (curr.price < acc.cheapestProduct.price) {
          acc.cheapestProduct = curr;
        }

        if (curr.onSale) {
          acc.onSaleCount++;
          if (curr.salePrice != null) {
            const currentDiscountPercentage =
              ((curr.price - curr.salePrice) / curr.price) * 100;
            acc.averageDiscount += currentDiscountPercentage;
          }
        }

        return acc;
      },
      {
        totalPrice: 0,
        averagePrice: 0,
        mostExpensiveProduct: products[0],
        cheapestProduct: products[0],
        onSaleCount: 0,
        averageDiscount: 0,
      },
    );

  const averagePrice = productPriceAnalysis.totalPrice / products.length;
  productPriceAnalysis.averagePrice = parseFloat(averagePrice.toFixed(2));

  const averageDiscount =
    productPriceAnalysis.averageDiscount / productPriceAnalysis.onSaleCount;
  productPriceAnalysis.averageDiscount = parseFloat(averageDiscount.toFixed(2));

  return productPriceAnalysis;
}

/**
 *  Challenge 2: Build a Product Catalog with Brand Metadata
 *
 * Create a function that takes arrays of Product and Brand, and returns a new array of enriched product entries. Each entry should include brand details embedded into the product, under a new brandInfo property (excluding the id and isActive fields).
 *  e.g
 *  buildProductCatalog(products: Product[], brands: Brand[]): EnrichedProduct[]

  Requirements:
  - it should return an array of enriched product entries with brand details
  - Only include products where isActive is true and their corresponding brand is also active.
  - If a product’s brandId does not match any active brand, it should be excluded.
  - The brandInfo field should include the rest of the brand metadata (name, logo, description, etc.).
 */

type BrandMetadata = Omit<Brand, "id" | "isActive">;

export interface EnrichedProduct extends Product {
  brandInfo: BrandMetadata;
}

export async function buildProductCatalog(
  products: Product[],
  brands: Brand[],
): Promise<EnrichedProduct[]> {
  const brandsMetadata: Map<number, BrandMetadata> = brands.reduce(
    (acc, curr) => {
      const { id, isActive, ...brandMetadata } = curr;
      if (isActive) {
        const brandId: number = typeof id === "number" ? id : parseInt(id);
        acc.set(brandId, brandMetadata);
      }
      return acc;
    },
    new Map<number, BrandMetadata>(),
  );

  const activeProducts: Product[] = products.filter(
    (product) => product.isActive && brandsMetadata.has(product.brandId),
  );
  const enrichedProducts: EnrichedProduct[] = activeProducts.map((product) => {
    return {
      ...product,
      brandInfo: brandsMetadata.get(product.brandId)!,
    };
  });
  return enrichedProducts;
}

/**
 * Challenge 3: One image per product
 *
 * Create a function that takes an array of products and returns a new array of products, each with only one image.
 *
 * Requirements:
 * - The function should accept an array of Product objects.
 * - Each product should have only one image in the images array.
 * - The image should be the first one in the images array.
 * - If a product has no images, it should be excluded from the result.
 * - The function should return an array of Product objects with the modified images array.
 * - Use proper TypeScript typing for parameters and return values.
 */

export async function filterProductsWithOneImage(
  products: Product[],
): Promise<Product[]> {
  const productsWithImages: Product[] = products.filter(
    (product) => product.images.length > 0,
  );
  const productsWithOneImage: Product[] = productsWithImages.map((product) => {
    return {
      ...product,
      images: [product.images[0]],
    };
  });
  return productsWithOneImage;
}
