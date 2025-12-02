require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");
const Product = require("./models/Product");
const Cart = require("./models/Cart");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/tp-final-backend");
    console.log("MongoDB conectado para migración");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
};

const migrateProducts = async () => {
  try {
    const productsPath = path.join(__dirname, "data", "products.json");
    const productsData = await fs.readFile(productsPath, "utf-8");
    const products = JSON.parse(productsData);

    // Limpiar productos existentes
    await Product.deleteMany({});

    // Insertar productos
    for (const product of products) {
      const newProduct = new Product({
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        status: product.status,
        stock: product.stock,
        category: product.category,
        thumbnails: product.thumbnails || []
      });
      await newProduct.save();
    }

    console.log(`${products.length} productos migrados exitosamente`);
  } catch (error) {
    console.error("Error migrando productos:", error);
  }
};

const migrateCarts = async () => {
  try {
    const cartsPath = path.join(__dirname, "data", "carts.json");
    const cartsData = await fs.readFile(cartsPath, "utf-8");
    const carts = JSON.parse(cartsData);

    // Limpiar carritos existentes
    await Cart.deleteMany({});

    // Insertar carritos
    for (const cart of carts) {
      const newCart = new Cart({
        products: cart.products.map(item => ({
          product: item.product,
          quantity: item.quantity
        }))
      });
      await newCart.save();
    }

    console.log(`${carts.length} carritos migrados exitosamente`);
  } catch (error) {
    console.error("Error migrando carritos:", error);
  }
};

const migrate = async () => {
  await connectDB();
  await migrateProducts();
  await migrateCarts();
  console.log("Migración completada");
  process.exit(0);
};

migrate();