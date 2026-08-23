import { db } from "./dbStarter.js";
import { liveQuery } from "dexie";

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

export function getCartCountLive(clientId) {
  return liveQuery(async () => {
    if (!clientId) return 0;

    const cart = await db.orderDetails
      .where("clientId")
      .equals(clientId)
      .first();

    if (!cart || !cart.products) {
      return 0;
    }

    return cart.products.reduce((total, item) => total + item[1], 0);
  });
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

export async function getUser(username) {
  return await db.users.where("name").equals(username).first();
}

export async function updateProduct(productId, product) {
  return await db.products.update(productId, product);
}

export async function doesProductExist(name) {
  const product = await db.products.where("name").equals(name).first();

  return product;
}

export async function addProductToCart(productId, clientId) {
  // Check if the user already has a cart
  let cart = await db.orderDetails.where("clientId").equals(clientId).first();

  // No cart → create one
  if (!cart) {
    const cartId = await db.orderDetails.add({
      clientId,
      products: [[productId, 1]],
    });

    return await db.orderDetails.get(cartId);
  }

  // Check if product already exists
  const productIndex = cart.products.findIndex((item) => item[0] === productId);

  if (productIndex !== -1) {
    // Exists → increase amount
    cart.products[productIndex][1]++;
  } else {
    // Doesn't exist → add it
    cart.products.push([productId, 1]);
  }

  await db.orderDetails.put(cart);

  return cart;
}

// REDUCE QUANTITY BY 1
export async function decreaseQuantity(productId, clientId) {
  const cart = await db.orderDetails.where("clientId").equals(clientId).first();
  if (!cart) return null;
  const productIndex = cart.products.findIndex((item) => item[0] === productId);

  if (productIndex === -1) {
    return cart;
  }

  // Reduce quantity by 1
  cart.products[productIndex][1]--;

  // If quantity reaches 0, remove the product
  if (cart.products[productIndex][1] <= 0) {
    cart.products.splice(productIndex, 1);
  }

  // Save the updated cart
  await db.orderDetails.put(cart);

  return cart;
}

export async function removeProductFromCart(productId, clientId) {
  const cart = await db.orderDetails.where("clientId").equals(clientId).first();

  if (!cart) return null;

  cart.products = cart.products.filter((item) => item[0] !== productId);

  await db.orderDetails.put(cart);

  return cart;
}

export async function clearCart(clientId) {
  const cart = await db.orderDetails.where("clientId").equals(clientId).first();

  if (!cart) return;

  await db.orderDetails.delete(cart.id);
}

export async function getCart(clientId) {
  return await db.orderDetails.where("clientId").equals(clientId).first();
}

export async function getOrders(clientId) {
  return await db.orders
    .where("clientId")
    .equals(clientId)
    .reverse()
    .sortBy("dateOfPurchase");
}

export async function addOrder(listId, clientId, totalPrice) {
  // Get current cart
  const cart = await db.orderDetails.get(listId);

  if (!cart) {
    throw new Error("Cart not found");
  }

  if (cart.clientId !== clientId) {
    throw new Error("This cart does not belong to this user");
  }

  const orderProducts = [];

  // Get information about every product in the cart
  for (const item of cart.products) {
    const productId = item[0];
    const amount = item[1];

    const product = await db.products.get(productId);

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    orderProducts.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      amount: amount,
      image: product.image,
    });
  }

  // Create the order
  const orderId = await db.orders.add({
    clientId: clientId,
    dateOfPurchase: new Date(),
    totalPrice: totalPrice,
    products: orderProducts,
  });

  // Delete the shopping cart after successful purchase
  await db.orderDetails.delete(listId);

  // Return the newly created order
  return await db.orders.get(orderId);
}

export async function deleteOrder(orderId) {
  const order = await db.orders.where("id").equals(orderId).first();

  if (!order) return false;

  await db.orders.delete(orderId);
  return true;
}
