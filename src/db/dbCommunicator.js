import { db } from "./dbStarter.js";

export async function getAllProducts(sortBy = null) {
  let products = await db.products.toArray();

  switch (sortBy) {
    case "priceAsc":
      products.sort((a, b) => a.price - b.price);
      break;

    case "priceDesc":
      products.sort((a, b) => b.price - a.price);
      break;

    case "dateAsc":
      products.sort((a, b) => a.dateOfCreation.localeCompare(b.dateOfCreation));
      break;

    case "dateDesc":
      products.sort((a, b) => b.dateOfCreation.localeCompare(a.dateOfCreation));
      break;
  }

  return products;
}

// SEARCH PRODUCTS BY NAME (Case-Insensitive)
export async function getProductsByName(name) {
  if (!name) return await getAllProducts();

  return await db.products
    .filter(
      (product) =>
        product.name && product.name.toLowerCase().includes(name.toLowerCase())
    )
    .toArray();
}

// SEARCH PRODUCTS BY CATEGORY
export async function getProductsByCategory(category) {
  if (!category) return await getAllProducts();

  // Dynamically format "Home & Kitchen" -> "home_and_kitchen"
  const formattedCategory = category
    .toLowerCase()
    .replace(/\s*&\s*/g, "_and_") // Replace '&' surrounded by spaces with '_and_'
    .replace(/\s+/g, "_"); // Replace remaining spaces with underscores

  return await db.products
    .filter(
      (product) =>
        product.category && product.category.toLowerCase() === formattedCategory
    )
    .toArray();
}

// SEARCH PRODUCTS BY DATE RANGE

export async function getProductsByDateRange(startDate, EndDate) {
  if (!startDate && !EndDate) return await getAllProducts();

  // reversing the date so it matches the db

  const formattedStartDate = startDate.split("/").reverse().join("-");

  const formattedEndDate = EndDate.split("/").reverse().join("-");

  return await db.products
    .filter(
      (product) =>
        product.dateOfCreation >= formattedStartDate &&
        product.dateOfCreation <= formattedEndDate
    )
    .toArray();
}

// ADD NEW PRODUCT
export async function addProduct(product) {
  return await db.products.add(product);
}

// DELETE PRODUCT BY ID
export async function deleteProduct(productId) {
  return await db.products.delete(productId);
}

// GET PRODUCT BY ID
export async function getProductById(productId) {
  return await db.products.get(productId);
}
