import { Department, Product } from "./1-types";
import { readJsonFile } from "./utils/read-json.util";
import { join } from "path";

/**
 *  Challenge 5: Get Departments with Product Count
 *
 * Create a function that takes an array of departments and products, and returns a new array of departments with the amount of products available in each department.
 *
 * Requirements:
 * - The function should accept an array of Department objects and an array of Product objects.
 * - Each department should include the quantity of products available in that department.
 * - The department should be idetified just by its name and id other properties should be excluded.
 * - In the information of the department, include the amount of products available in that department and just the name and id of the department.
 * - Add the name of the products in an array called productsNames inside the department object.
 */

interface ProductInfo {
  availableProducts: number;
  productsNames: string[];
}

export type DepartmentInfo = Pick<Department, "id" | "name"> & ProductInfo;

export async function getDepartmentsWithProductCount(
  departments: Department[],
  products: Product[],
): Promise<DepartmentInfo[]> {
  const productDepartmentLookup = products.reduce((acc, curr) => {
    const productInfo = acc.get(curr.departmentId) ?? {
      availableProducts: 0,
      productsNames: [],
    };
    productInfo.availableProducts++;
    productInfo.productsNames.push(curr.name);

    acc.set(curr.departmentId, productInfo);
    return acc;
  }, new Map<number, ProductInfo>());

  const availableDepartments = departments.filter((department) =>
    productDepartmentLookup.has(department.id),
  );
  const departmentsWithProductCount: DepartmentInfo[] =
    availableDepartments.map((department) => {
      const { id, name } = department;
      return {
        id,
        name,
        ...productDepartmentLookup.get(id)!,
      };
    });
  return departmentsWithProductCount;
}

const main = async () => {
  const departments: Department[] = await readJsonFile(
    join(__dirname, "./data/departments.json"),
  );
  const products: Product[] = await readJsonFile(
    join(__dirname, "./data/products.json"),
  );

  const departmentsInfo = await getDepartmentsWithProductCount(
    departments,
    products,
  );

  console.log("getDepartmentsWithProductCount() demo:");
  console.log(departmentsInfo);
};

main();
