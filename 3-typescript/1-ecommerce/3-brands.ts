import { Brand, Product } from "./1-types";

/**
 *  Challenge 4: Get Countries with Brands and Amount of Products
 *
 * Create a function that takes an array of brands and products, and returns the countries with the amount of products available in each country.
 *
 * Requirements:
 * - The function should accept an array of Brand objects and an array of Product objects.
 * - Each brand should have a country property.
 * - Each product should have a brandId property that corresponds to the id of a brand.
 * - The function should return an array of objects, each containing a country and the amount of products available in that country.
 * - The amount of products should be calculated by counting the number of products that have a brandId matching the id of a brand in the same country.
 * - The return should be a type that allow us to define the country name as a key and the amount of products as a value.
 */

export type CountriesInfo = Record<string, number>;

export async function getCountriesWithBrandsAndProductCount(
  brands: Brand[],
  products: Product[],
): Promise<CountriesInfo> {
  const brandCountryLookup: Map<number, string> = brands.reduce((acc, curr) => {
    const { id, headquarters } = curr;

    const locations: string[] = headquarters.split(" ");
    const country: string = locations[locations.length - 1];

    const brandId: number = typeof id === "number" ? id : parseInt(id);
    acc.set(brandId, country);
    return acc;
  }, new Map<number, string>());

  const availableProducts: Product[] = products.filter((product) =>
    brandCountryLookup.has(product.brandId),
  );
  const countriesWithBrandsAndProducts: CountriesInfo =
    availableProducts.reduce<CountriesInfo>((acc, curr) => {
      const country: string = brandCountryLookup.get(curr.brandId)!;
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

  return countriesWithBrandsAndProducts;
}
