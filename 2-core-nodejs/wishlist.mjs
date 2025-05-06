import readline from "node:readline";
import fs from "node:fs/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let wishlistDatabase = [];

const showMenuOptions = () => {
  process.stdout.write(`What do you want to do?
1) Create a new entry
2) Show all entries
3) Update an entry
4) Delete an entry
5) Exit

Type in the option you want to perform: `);
};

const loadDataFromFile = async (fileName) => {
  try {
    const rawData = await fs.readFile(new URL(fileName, import.meta.url));
    const jsonData = JSON.parse(rawData);
    return jsonData;
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error(
        `Encountered an error while trying to read stored data. No data will be loaded.\n${error}\n`,
      );
    }
    return [];
  }
};

const saveDataLocally = async (fileName) => {
  const jsonData = JSON.stringify(wishlistDatabase);
  try {
    await fs.writeFile(new URL(fileName, import.meta.url), jsonData);
  } catch (error) {
    console.error(
      `Encountered an error while trying to save data locally. No data has been saved.\n${error}`,
    );
  }
};

const createWishlistItem = async (item) => {
  const id =
    wishlistDatabase.length > 0
      ? wishlistDatabase[wishlistDatabase.length - 1].id + 1
      : 1;
  wishlistDatabase.push({ id, ...item });
  try {
    await saveDataLocally("./wishlist.json");
  } catch (error) {
    console.error(
      `Encountered an error while trying to save data locally. Item has not been inserted.\n${error}\n`,
    );
  }
};

const findWishlistItem = (id) => {
  const itemIndex = wishlistDatabase.findIndex((record) => record.id === id);
  return itemIndex;
};

const updateWishlistItem = async (index, updatedItem) => {
  wishlistDatabase[index] = { ...updatedItem };
  try {
    await saveDataLocally("./wishlist.json");
  } catch (error) {
    console.error(
      `Encountered an error while trying to save data locally. Item has not been inserted.\n${error}\n`,
    );
  }
};

const showAllItems = () => {
  console.log("Id\tName\tPrice\tStore");
  for (const { id, name, price, store } of wishlistDatabase) {
    console.log(`${id}\t${name}\t${price}\t${store}`);
  }
};

const deleteWishlistItem = async (id) => {
  wishlistDatabase = wishlistDatabase.filter((item) => item.id !== id);
  try {
    await saveDataLocally("./wishlist.json");
  } catch (error) {
    console.error(
      `Encountered an error while trying to save data locally. Item has not been removed.\n${error}\n`,
    );
  }
};

const promisifiedQuestion = (query) => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => resolve(answer));
  });
};

const askForValidString = async (query, emptyAllowed = false) => {
  while (true) {
    const value = await promisifiedQuestion(query);
    if (!emptyAllowed && value === "") {
      console.log("You must enter a non-empty string");
    } else {
      return value;
    }
  }
};

const askForValidNumber = async (query, isInteger = false) => {
  while (true) {
    let val = await promisifiedQuestion(query);
    val = parseFloat(val);
    if (isNaN(val) || val < 0 || (isInteger && !Number.isInteger(val))) {
      console.log("Please, enter a valid number");
    } else {
      return val;
    }
  }
};

const askItemCreationOptions = async () => {
  const newItem = { name: null, price: null, store: null };

  newItem.name = await askForValidString("Enter the item name: ");
  newItem.price = await askForValidNumber("Enter the item price: ");
  newItem.store = await askForValidString("Enter the store name: ");

  try {
    await createWishlistItem(newItem);
  } catch (error) {
    console.error(
      `Encountered an error while trying to save data locally. Item has not been created.\n${error}\n`,
    );
  }
};

const askItemUpdatingOptions = async () => {
  const id = await askForValidNumber(
    "Enter the id of the item you wish to update: ",
    true,
  );
  const itemIndex = findWishlistItem(id);
  if (itemIndex === -1) {
    console.error("The item with the specified id does not exist");
    return;
  }
  const updatedItem = wishlistDatabase[itemIndex];
  updatedItem.name = await askForValidString("Enter the item name: ");
  updatedItem.price = await askForValidNumber("Enter the item price: ");
  updatedItem.store = await askForValidString("Enter the store name: ");
  await updateWishlistItem(itemIndex, updatedItem);
};

const askItemDeletionOptions = async () => {
  const id = await askForValidNumber(
    "Enter the id of the item you wish to remove: ",
    true,
  );
  await deleteWishlistItem(id);
};

const close = () => {
  console.log("Bye...");
  process.exit(0);
};

const processUserRequestedAction = (input) => {
  const actions = [
    askItemCreationOptions,
    showAllItems,
    askItemUpdatingOptions,
    askItemDeletionOptions,
    close,
  ];
  const maxAvailableOption = actions.length;

  const option = parseInt(input);
  if (
    !Number.isInteger(option) ||
    (option < 1 && option > maxAvailableOption)
  ) {
    return null;
  }
  const requestedActionIndex = option - 1;
  return actions[requestedActionIndex];
};

const onLine = async (line) => {
  const action = processUserRequestedAction(line);
  if (!action) {
    process.stdout.write("Please, enter a valid option\n");
  } else {
    if (typeof action === "string") {
      process.stdout.write(action);
    } else {
      await action();
    }
  }
  showMenuOptions();
};

rl.on("line", onLine);

const main = async () => {
  wishlistDatabase = await loadDataFromFile("./wishlist.json");
  showMenuOptions();
};
main();
