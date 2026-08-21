/* eslint-disable prettier/prettier */
import { db } from "./dbStarter.js";

// GET ALL PRODUCTS
export async function getAllProducts() {
  return await db.products.toArray();
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
