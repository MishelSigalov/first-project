/* eslint-disable prettier/prettier */
import { db } from "./dbStarter.js";

// GET ALL PRODUCTS
export async function getAllProducts() {
  return await db.products.toArray();
}

// SEARCH PRODUCTS BY NAME (Case-Insensitive)
export async function getProductsByName(name) {
  if (!name) return await getAllProducts();
  
  return await db.products
    .filter((product) => 
      product.name && product.name.toLowerCase().includes(name.toLowerCase())
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
