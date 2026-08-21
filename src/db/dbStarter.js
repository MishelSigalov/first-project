/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import Dexie from "dexie";
export const db = new Dexie("StoreDatabase");

// Define Schema
db.version(1).stores({
  products: "++id, category, price",
  orders: "++id, clientId, dateOfPurchase",
  orderDetails: "[orderId+productId], orderId, productId",
  users: "++id, &email",
});

// Seed Hardcoded Data on Initial Creation
db.on("populate", async () => {
  await db.products.bulkAdd([
    {
      id: 1,
      name: "Wireless Headphones",
      price: 199.99,
      category: "electronics",
      stockAvailability: 45,
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      price: 89.5,
      category: "electronics",
      stockAvailability: 30,
    },
    {
      id: 3,
      name: "Smart Watch",
      price: 129.0,
      category: "electronics",
      stockAvailability: 12,
    },
    {
      id: 4,
      name: "4K Monitor 27-inch",
      price: 320.0,
      category: "electronics",
      stockAvailability: 18,
    },
    {
      id: 5,
      name: "Denim Jacket",
      price: 65.0,
      category: "clothing",
      stockAvailability: 50,
    },
    {
      id: 6,
      name: "Graphic T-Shirt",
      price: 24.99,
      category: "clothing",
      stockAvailability: 100,
    },
    {
      id: 7,
      name: "Running Shoes",
      price: 110.0,
      category: "clothing",
      stockAvailability: 20,
    },
    {
      id: 8,
      name: "Data-Intensive Apps",
      price: 45.99,
      category: "books",
      stockAvailability: 15,
    },
    {
      id: 9,
      name: "Pragmatic Programmer",
      price: 39.95,
      category: "books",
      stockAvailability: 25,
    },
    {
      id: 10,
      name: "Clean Code",
      price: 42.0,
      category: "books",
      stockAvailability: 8,
    },
    {
      id: 11,
      name: "Insulated Tumbler",
      price: 18.5,
      category: "home_and_kitchen",
      stockAvailability: 75,
    },
    {
      id: 12,
      name: "Cold Brew Maker",
      price: 29.99,
      category: "home_and_kitchen",
      stockAvailability: 40,
    },
    {
      id: 13,
      name: "Yoga Mat",
      price: 34.5,
      category: "fitness",
      stockAvailability: 60,
    },
    {
      id: 14,
      name: "Adjustable Dumbbell",
      price: 249.0,
      category: "fitness",
      stockAvailability: 10,
    },
    {
      id: 15,
      name: "Wireless Controller",
      price: 59.99,
      category: "gaming",
      stockAvailability: 35,
    },
    {
      id: 16,
      name: "Gaming Mouse Pad",
      price: 22.0,
      category: "gaming",
      stockAvailability: 85,
    },
    {
      id: 17,
      name: "Ergonomic Chair",
      price: 185.0,
      category: "office_supplies",
      stockAvailability: 14,
    },
    {
      id: 18,
      name: "Laptop Stand",
      price: 27.99,
      category: "office_supplies",
      stockAvailability: 50,
    },
    {
      id: 19,
      name: "Camping Hammock",
      price: 38.0,
      category: "outdoor",
      stockAvailability: 28,
    },
    {
      id: 20,
      name: "Garden Lanterns",
      price: 31.5,
      category: "outdoor",
      stockAvailability: 42,
    },
  ]);
});
