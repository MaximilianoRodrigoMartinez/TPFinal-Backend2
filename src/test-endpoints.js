const axios = require("axios");

const BASE_URL = "http://localhost:8080/api";

async function testEndpoints() {
  console.log(" Iniciando pruebas de endpoints...\n");

  try {
    // Test 1: Crear un producto
    console.log("1. Creando producto...");
    const productData = {
      title: "Producto de Prueba",
      description: "Descripción del producto de prueba",
      code: "TEST001",
      price: 99.99,
      stock: 10,
      category: "Pruebas",
      status: true
    };

    const createProductResponse = await axios.post(`${BASE_URL}/products`, productData);
    console.log(" Producto creado:", createProductResponse.data.payload.title);
    const productId = createProductResponse.data.payload._id;

    // Test 2: Obtener productos con paginación
    console.log("\n2. Probando paginación...");
    const productsResponse = await axios.get(`${BASE_URL}/products?limit=5&page=1&sort=asc`);
    console.log(" Productos obtenidos:", productsResponse.data.payload.length);
    console.log("   Total páginas:", productsResponse.data.totalPages);
    console.log("   Página actual:", productsResponse.data.page);

    // Test 3: Filtrar por categoría
    console.log("\n3. Probando filtros...");
    const filterResponse = await axios.get(`${BASE_URL}/products?query=category:Pruebas`);
    console.log(" Productos filtrados:", filterResponse.data.payload.length);

    // Test 4: Crear un carrito
    console.log("\n4. Creando carrito...");
    const cartResponse = await axios.post(`${BASE_URL}/carts`);
    console.log(" Carrito creado:", cartResponse.data.payload._id);
    const cartId = cartResponse.data.payload._id;

    // Test 5: Agregar producto al carrito
    console.log("\n5. Agregando producto al carrito...");
    const addToCartResponse = await axios.post(`${BASE_URL}/carts/${cartId}/product/${productId}`, {
      quantity: 2
    });
    console.log(" Producto agregado al carrito");

    // Test 6: Obtener carrito con populate
    console.log("\n6. Obteniendo carrito con populate...");
    const getCartResponse = await axios.get(`${BASE_URL}/carts/${cartId}`);
    console.log(" Carrito obtenido con", getCartResponse.data.payload.products.length, "productos");

    // Test 7: Actualizar cantidad
    console.log("\n7. Actualizando cantidad...");
    const updateQuantityResponse = await axios.put(`${BASE_URL}/carts/${cartId}/products/${productId}`, {
      quantity: 5
    });
    console.log(" Cantidad actualizada");

    // Test 8: Eliminar producto del carrito
    console.log("\n8. Eliminando producto del carrito...");
    const removeFromCartResponse = await axios.delete(`${BASE_URL}/carts/${cartId}/products/${productId}`);
    console.log(" Producto eliminado del carrito");

    // Test 9: Limpiar carrito
    console.log("\n9. Limpiando carrito...");
    const clearCartResponse = await axios.delete(`${BASE_URL}/carts/${cartId}`);
    console.log(" Carrito limpiado");

    // Test 10: Eliminar producto
    console.log("\n10. Eliminando producto...");
    const deleteProductResponse = await axios.delete(`${BASE_URL}/products/${productId}`);
    console.log(" Producto eliminado");

    console.log("\n ¡Todas las pruebas pasaron exitosamente!");

  } catch (error) {
    console.error(" Error en las pruebas:", error.response?.data || error.message);
  }
}

// Ejecutar pruebas
testEndpoints();