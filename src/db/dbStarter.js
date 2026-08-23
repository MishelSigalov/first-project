/* eslint-disable prettier/prettier */
import Dexie from "dexie";

export const db = new Dexie("StoreDatabase");

// Define Schema matching your exact fields
db.version(1).stores({
  products: "++id, name, category, price, stockAvailability, dateOfCreation, image",
  orders: "++id, clientId, dateOfPurchase, totalPrice",
  orderDetails: "++id, clientId",
  users: "++id, name, password, isAdmin"
});

// Seed Initial Data
db.on("populate", async () => {
  // 1. Initial Products
  await db.products.bulkAdd([
    { id: 1, name: "Wireless Headphones", description: "Noise-canceling over-ear headphones", price: 199.99, category: "electronics", stockAvailability: 45, dateOfCreation: "2026-01-10", image:"/pictures/headphones.png" },
    { id: 2, name: "Mechanical Keyboard", description: "RGB mechanical gaming keyboard", price: 89.50, category: "electronics", stockAvailability: 30, dateOfCreation: "2026-01-12", image:"/pictures/keyboard.png" },
    { id: 3, name: "Smart Watch", description: "Fitness tracker with heart rate monitor", price: 129.00, category: "electronics", stockAvailability: 12, dateOfCreation: "2026-01-15", image:"/pictures/watch.png" },
    { id: 4, name: "4K Monitor 27-inch", description: "UHD IPS display monitor", price: 320.00, category: "electronics", stockAvailability: 18, dateOfCreation: "2026-01-18", image:"/pictures/monitor.png" },
    { id: 5, name: "Denim Jacket", description: "Classic blue denim jacket", price: 65.00, category: "clothing", stockAvailability: 50, dateOfCreation: "2026-02-01", image:"/pictures/jacket.png" },
    { id: 6, name: "Graphic T-Shirt", description: "100% cotton casual tee", price: 24.99, category: "clothing", stockAvailability: 100, dateOfCreation: "2026-02-02", image:"/pictures/shirt.png" },
    { id: 7, name: "Running Shoes", description: "Lightweight breathable sneakers", price: 110.00, category: "clothing", stockAvailability: 20, dateOfCreation: "2026-02-05", image:"/pictures/shoes.png" },
    { id: 8, name: "Data-Intensive Apps", description: "Designing Data-Intensive Applications book", price: 45.99, category: "books", stockAvailability: 15, dateOfCreation: "2026-02-10", image:"/pictures/book.png" },
    { id: 9, name: "Pragmatic Programmer", description: "Software engineering best practices", price: 39.95, category: "books", stockAvailability: 25, dateOfCreation: "2026-02-11", image:"/pictures/book2.png" },
    { id: 10, name: "Clean Code", description: "A Handbook of Agile Software Craftsmanship", price: 42.00, category: "books", stockAvailability: 8, dateOfCreation: "2026-02-12", image:"/pictures/book3.png" },
    { id: 11, name: "Insulated Tumbler", description: "30oz stainless steel water bottle", price: 18.50, category: "home_and_kitchen", stockAvailability: 75, dateOfCreation: "2026-02-15", image:"/pictures/tumbler.png" },
    { id: 12, name: "Cold Brew Maker", description: "1L glass cold brew coffee pitcher", price: 29.99, category: "home_and_kitchen", stockAvailability: 40, dateOfCreation: "2026-02-16", image:"/pictures/brew.png" },
    { id: 13, name: "Yoga Mat", description: "Non-slip extra thick exercise mat", price: 34.50, category: "fitness", stockAvailability: 60, dateOfCreation: "2026-02-20", image:"/pictures/mat.png" },
    { id: 14, name: "Adjustable Dumbbell", description: "Single 50lb adjustable weight", price: 249.00, category: "fitness", stockAvailability: 10, dateOfCreation: "2026-02-21", image:"/pictures/dumbell.png" },
    { id: 15, name: "Wireless Controller", description: "Gamepad for PC and Console", price: 59.99, category: "gaming", stockAvailability: 35, dateOfCreation: "2026-03-01", image:"/pictures/controller.png" },
    { id: 16, name: "Gaming Mouse Pad", description: "XL extended desk pad", price: 22.00, category: "gaming", stockAvailability: 85, dateOfCreation: "2026-03-02", image:"/pictures/pad.png" },
    { id: 17, name: "Ergonomic Chair", description: "Mesh office chair with lumbar support", price: 185.00, category: "office_supplies", stockAvailability: 14, dateOfCreation: "2026-03-05", image:"/pictures/chair.png" },
    { id: 18, name: "Laptop Stand", description: "Aluminum adjustable laptop riser", price: 27.99, category: "office_supplies", stockAvailability: 50, dateOfCreation: "2026-03-06", image:"/pictures/stand.png" },
    { id: 19, name: "Camping Hammock", description: "Portable double hammock with straps", price: 38.00, category: "outdoor", stockAvailability: 28, dateOfCreation: "2026-03-10", image:"/pictures/hammock.png" },
    { id: 20, name: "Garden Lanterns", description: "Solar powered outdoor lights pack", price: 31.50, category: "outdoor", stockAvailability: 42, dateOfCreation: "2026-03-11", image:"/pictures/lantern.png" }
  ]);

  await db.users.bulkAdd([
    {id: 1, name: "admin", password: "admin123", isAdmin: true},
    {id: 2, name: "mishel", password: "mi", isAdmin: false},
  ]);
});
