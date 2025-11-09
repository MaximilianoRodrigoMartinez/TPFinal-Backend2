require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const exphbs = require("express-handlebars");
const path = require("path");
const connectDB = require("./config/database");

// Importar rutas
const viewsRouter = require("./routes/views");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");
const sessionsRouter = require("./routes/sessions");

// Configurar Passport
require("./config/passport.config");

// Importar servicios
const productService = require("./services/productService");

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 8080;

// Conectar a MongoDB
connectDB();

// Configurar Handlebars
app.engine("handlebars", exphbs.engine({
  defaultLayout: "main",
  helpers: {
    formatDate: function(date) {
      return new Date(date).toLocaleDateString("es-ES");
    },
    multiply: function(a, b) {
      return (a * b).toFixed(2);
    },
    calculateSubtotal: function(products) {
      return products.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0).toFixed(2);
    },
    eq: function(a, b) {
      return a === b;
    },
    concat: function(...args) {
      return args.slice(0, -1).join('');
    }
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para archivos est�ticos
app.use(express.static(path.join(__dirname, "public")));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);

// Middleware para manejar rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware para manejo de errores
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Configurar Socket.io
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Manejar creaci�n de productos
  socket.on("createProduct", async (productData) => {
    try {
      const newProduct = await productService.createProduct(productData);
      
      // Obtener todos los productos actualizados
      const result = await productService.getProducts({ limit: 100 });
      const allProducts = result.payload || [];
      
      // Emitir actualizaci�n a todos los clientes conectados
      io.emit("productsUpdated", allProducts);
      
      console.log("Producto creado:", newProduct.title);
    } catch (error) {
      console.error("Error creando producto:", error);
      socket.emit("error", { message: error.message });
    }
  });

  // Manejar eliminaci�n de productos
  socket.on("deleteProduct", async (productId) => {
    try {
      const deletedProduct = await productService.deleteProduct(productId);
      
      // Obtener todos los productos actualizados
      const result = await productService.getProducts({ limit: 100 });
      const allProducts = result.payload || [];
      
      // Emitir actualizaci�n a todos los clientes conectados
      io.emit("productsUpdated", allProducts);
      
      console.log("Producto eliminado:", deletedProduct.title);
    } catch (error) {
      console.error("Error eliminando producto:", error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto " + PORT);
  console.log("API disponible en: http://localhost:" + PORT + "/api");
  console.log("Vistas disponibles en: http://localhost:" + PORT);
});
