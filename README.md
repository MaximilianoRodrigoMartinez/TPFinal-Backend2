# TP Final - Backend con Node.js, Express y MongoDB

##  Descripción del Proyecto
Este es el **Trabajo Práctico Final** del curso de Backend, que implementa una API REST completa para gestionar productos y carritos de compra con persistencia en MongoDB.

##  Tecnologías Utilizadas
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Socket.IO** - WebSockets para tiempo real
- **Handlebars** - Motor de plantillas
- **Bootstrap** - Framework CSS

##  Estructura del Proyecto
```
 app.js                 # Servidor principal
 package.json           # Dependencias del proyecto
 .env                   # Variables de entorno
 migrate.js             # Script de migración de datos
 config/                # Configuración
    database.js        # Conexión a MongoDB
 models/                # Modelos de Mongoose
    Product.js         # Modelo de productos
    Cart.js            # Modelo de carritos
 services/              # Lógica de negocio
    productService.js  # Servicio de productos
    cartService.js     # Servicio de carritos
 routes/                # Definición de rutas
    products.js        # Endpoints de productos
    carts.js           # Endpoints de carritos
    views.js           # Rutas de vistas
 views/                 # Vistas Handlebars
    home.handlebars
    products.handlebars
    productDetail.handlebars
    cart.handlebars
    realTimeProducts.handlebars
    error.handlebars
    layouts/
 data/                  # Archivos de persistencia (legacy)
     products.json
     carts.json
```

##  Cómo Ejecutar el Proyecto

### 1. Instalación de Dependencias
```bash
npm install
```

### 2. Configurar MongoDB
Asegúrate de tener MongoDB ejecutándose en tu sistema:
```bash
# En Windows (si tienes MongoDB instalado)
mongod

# O usar MongoDB Atlas (recomendado para desarrollo)
```

### 3. Migrar Datos (Opcional)
Si tienes datos en los archivos JSON, puedes migrarlos a MongoDB:
```bash
npm run migrate
```

### 4. Iniciar el Servidor
```bash
npm start
```

### 5. Modo Desarrollo (con recarga automática)
```bash
npm run dev
```

El servidor estará disponible en: **http://localhost:8080**

##  Endpoints de la API

### Productos (`/api/products`)

#### GET `/api/products` - Listar productos con paginación, filtros y ordenamiento
**Query Parameters:**
- `limit` (opcional): Número de elementos por página (default: 10)
- `page` (opcional): Número de página (default: 1)
- `sort` (opcional): Ordenamiento por precio (`asc` o `desc`)
- `query` (opcional): Filtros (`category:Electrónicos` o `status:true`)

**Ejemplo:**
```
GET /api/products?limit=5&page=2&sort=asc&query=category:Electrónicos
```

**Respuesta:**
```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 3,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "/api/products?limit=5&page=1&sort=asc&query=category:Electrónicos",
  "nextLink": "/api/products?limit=5&page=3&sort=asc&query=category:Electrónicos"
}
```

#### Otros endpoints de productos:
- **GET** `/api/products/:pid` - Obtener producto por ID
- **POST** `/api/products` - Crear nuevo producto
- **PUT** `/api/products/:pid` - Actualizar producto
- **DELETE** `/api/products/:pid` - Eliminar producto

### Carritos (`/api/carts`)

#### Endpoints disponibles:
- **POST** `/api/carts` - Crear nuevo carrito
- **GET** `/api/carts/:cid` - Ver productos del carrito (con populate)
- **POST** `/api/carts/:cid/product/:pid` - Agregar producto al carrito
- **DELETE** `/api/carts/:cid/products/:pid` - Eliminar producto del carrito
- **PUT** `/api/carts/:cid` - Actualizar todos los productos del carrito
- **PUT** `/api/carts/:cid/products/:pid` - Actualizar cantidad de un producto
- **DELETE** `/api/carts/:cid` - Eliminar todos los productos del carrito

##  Vistas Disponibles

### Vistas principales:
- **GET** `/` - Página de inicio con todos los productos
- **GET** `/products` - Lista de productos con paginación y filtros
- **GET** `/products/:pid` - Detalle de producto individual
- **GET** `/carts/:cid` - Vista de carrito específico
- **GET** `/realtimeproducts` - Productos en tiempo real con WebSockets

##  Ejemplos de Uso

### Crear un Producto
```json
POST /api/products
{
  "title": "Laptop Gaming",
  "description": "Laptop de alto rendimiento para gaming",
  "code": "LAP001",
  "price": 1299.99,
  "stock": 50,
  "category": "Electrónicos",
  "status": true,
  "thumbnails": ["laptop1.jpg"]
}
```

### Crear un Carrito
```json
POST /api/carts
```

### Agregar Producto al Carrito
```json
POST /api/carts/507f1f77bcf86cd799439011/product/507f1f77bcf86cd799439012
{
  "quantity": 2
}
```

### Actualizar Cantidad en el Carrito
```json
PUT /api/carts/507f1f77bcf86cd799439011/products/507f1f77bcf86cd799439012
{
  "quantity": 5
}
```

##  Funcionalidades Implementadas

### Productos
-  CRUD completo de productos
-  Paginación con información completa
-  Filtros por categoría y disponibilidad
-  Ordenamiento ascendente/descendente por precio
-  Validaciones de datos
-  IDs únicos con MongoDB ObjectId
-  Índices para optimización de consultas

### Carritos
-  CRUD completo de carritos
-  Agregar/eliminar productos del carrito
-  Actualizar cantidades
-  Populate de productos para obtener datos completos
-  Validaciones de stock y disponibilidad
-  Limpiar carrito completo

### Vistas
-  Paginación funcional en vista de productos
-  Filtros y ordenamiento en la interfaz
-  Vista de detalle de producto
-  Vista de carrito con funcionalidad completa
-  Agregar productos al carrito desde las vistas
-  Diseño responsive con Bootstrap

### Tiempo Real
-  WebSockets para actualizaciones en tiempo real
-  Crear y eliminar productos en tiempo real
-  Sincronización automática entre clientes

##  Características Técnicas

- **Persistencia**: MongoDB con Mongoose ODM
- **Validaciones**: Esquemas de Mongoose con validaciones
- **Manejo de errores**: Middleware de errores robusto
- **Arquitectura**: Separación clara de responsabilidades
- **Async/Await**: Manejo moderno de operaciones asíncronas
- **Índices**: Optimización de consultas con índices de MongoDB
- **Populate**: Referencias entre colecciones con populate

##  Estado del Proyecto
-  **Completado**: Todas las funcionalidades requeridas
-  **Probado**: API funcionando correctamente
-  **Documentado**: README y comentarios completos
-  **Optimizado**: Servicios y modelos bien estructurados
-  **Migrado**: De archivos JSON a MongoDB

##  Funcionalidades del TP Final

###  Paginación Profesional
- Implementada en GET `/api/products` con todos los parámetros requeridos
- Respuesta incluye información completa de paginación
- Links de navegación automáticos

###  Filtros y Ordenamiento
- Filtros por categoría y disponibilidad
- Ordenamiento ascendente/descendente por precio
- Query parameters bien estructurados

###  Endpoints de Carrito Completos
- DELETE `/api/carts/:cid/products/:pid` - Eliminar producto
- PUT `/api/carts/:cid` - Actualizar todos los productos
- PUT `/api/carts/:cid/products/:pid` - Actualizar cantidad
- DELETE `/api/carts/:cid` - Limpiar carrito

###  Populate en Carritos
- Referencias a productos con ObjectId
- Populate automático para obtener datos completos
- Estructura de datos optimizada

###  Vistas con Paginación
- Vista `/products` con paginación funcional
- Vista `/products/:pid` para detalles
- Vista `/carts/:cid` para carritos específicos
- Botones de agregar al carrito funcionales

##  Soporte
Si tienes alguna pregunta o problema:
1. Revisa la documentación en este README
2. Verifica que MongoDB esté ejecutándose
3. Ejecuta `npm run migrate` si necesitas datos de ejemplo
4. Revisa los logs del servidor para errores

---

**¡El proyecto está listo para entregar! **
