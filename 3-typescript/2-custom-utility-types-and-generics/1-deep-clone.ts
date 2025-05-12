/**
 * Challenge: Create a deep clone function
 *
 * Create a function that takes an object and returns a deep clone of that object. The function should handle nested objects, arrays, and primitive types.
 *
 * Requirements:
 * - The function should accept an object of any type.
 * - It should return a new object that is a deep clone of the original object.
 * - The function should handle nested objects and arrays.
 * - It should handle primitive types (strings, numbers, booleans, null, undefined).
 * - The function should not use any external libraries
 */

export function deepClone<T>(objectToCopy: T): T {
  if (typeof objectToCopy !== "object" || objectToCopy === null) {
    return objectToCopy;
  }

  if (Array.isArray(objectToCopy)) {
    const arrayCopy = objectToCopy.map((element) => deepClone(element)) as T;
    return arrayCopy;
  }

  const objectEntriesCopy = Object.entries(objectToCopy).map(
    ([key, value]) => [key, deepClone(value)],
  );
  const objectCopy = Object.fromEntries(objectEntriesCopy) as T;
  return objectCopy;
}

let original = {
  name: "Misael",
  age: 23,
  workstation: {
    cpu: {
      name: "AMD Ryzen",
      cores: 12,
    },
    RAM: 16 * 1024,
    gpu: "NVIDIA RTX",
  },
  skills: ["Javscript", "Typescript"],
};
let copied = deepClone(original);

original.name = "Svante";
original.age = 50;
original.skills.push("Python");
original.workstation.cpu.name = "Intel Core-i9";
original.workstation.RAM = 32 * 1024;
original.workstation.gpu = "AMD RX";
original.workstation.cpu.cores = 12;

console.log("original:", original);
console.log("copy:", copied);
