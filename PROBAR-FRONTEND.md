# 🎨 Cómo Probar el Frontend

## 📋 Pasos para Poblar la Base de Datos y Probar el Frontend

### 1. Poblar la Base de Datos con Productos de Prueba

Ya actualicé el archivo `data/products.json` con 20 productos variados. Para cargarlos en MongoDB:

```bash
npm run migrate
```

Este comando:
- ✅ Conecta a MongoDB
- ✅ Limpia los productos existentes
- ✅ Carga los 20 productos nuevos desde `data/products.json`

**Nota:** Asegúrate de que MongoDB esté corriendo antes de ejecutar este comando.

---

### 2. Iniciar el Servidor

```bash
npm start
```

O en modo desarrollo (con recarga automática):

```bash
npm run dev
```

El servidor estará disponible en: **http://localhost:8080**

---

### 3. Probar las Vistas del Frontend

Una vez que el servidor esté corriendo, abre tu navegador y visita:

#### 🏠 Página de Inicio
```
http://localhost:8080/
```
- Muestra todos los productos en una vista de cards
- Ideal para ver todos los productos de un vistazo

#### 📦 Lista de Productos con Paginación
```
http://localhost:8080/products
```
- Vista con paginación (10 productos por página)
- Filtros por categoría y disponibilidad
- Ordenamiento por precio (ascendente/descendente)
- Navegación entre páginas

**Parámetros disponibles:**
- `?limit=5` - Cambiar cantidad de productos por página
- `?page=2` - Ir a página específica
- `?sort=asc` o `?sort=desc` - Ordenar por precio
- `?query=category:Electrónicos` - Filtrar por categoría
- `?query=status:true` - Filtrar por disponibilidad

**Ejemplos:**
- `http://localhost:8080/products?limit=5&page=1&sort=asc`
- `http://localhost:8080/products?query=category:Audio`
- `http://localhost:8080/products?sort=desc&limit=20`

#### 🔍 Detalle de Producto
```
http://localhost:8080/products/:productId
```
- Reemplaza `:productId` con el ID de un producto
- Para obtener el ID, ve a la lista de productos y haz click en un producto
- O usa Postman para obtener un ID: `GET /api/products`

**Ejemplo:**
```
http://localhost:8080/products/507f1f77bcf86cd799439011
```

#### 🛒 Vista de Carrito
```
http://localhost:8080/carts/:cartId
```
- Primero necesitas crear un carrito con Postman: `POST /api/carts`
- Obtén el `cartId` de la respuesta
- Luego visita: `http://localhost:8080/carts/[cartId]`

**Ejemplo:**
```
http://localhost:8080/carts/507f1f77bcf86cd799439012
```

#### ⚡ Productos en Tiempo Real
```
http://localhost:8080/realtimeproducts
```
- Vista con WebSockets para actualizaciones en tiempo real
- Puedes crear y eliminar productos desde la interfaz
- Los cambios se reflejan automáticamente en todos los clientes conectados
- **¡Muy útil para probar!** Abre esta página en varias pestañas y verás las actualizaciones en tiempo real

---

## 🧪 Flujo de Prueba Recomendado

### Paso 1: Poblar la BD
```bash
npm run migrate
```

### Paso 2: Iniciar el servidor
```bash
npm start
```

### Paso 3: Probar las vistas
1. **Inicio:** `http://localhost:8080/` - Ver todos los productos
2. **Lista con paginación:** `http://localhost:8080/products` - Probar paginación y filtros
3. **Detalle:** Click en cualquier producto para ver su detalle
4. **Tiempo Real:** `http://localhost:8080/realtimeproducts` - Crear/eliminar productos

### Paso 4: Probar el carrito
1. Crear un carrito con Postman: `POST /api/carts`
2. Agregar productos: `POST /api/carts/:cartId/product/:productId`
3. Ver el carrito: `http://localhost:8080/carts/:cartId`

---

## 📊 Productos Incluidos

El archivo `data/products.json` ahora incluye 20 productos variados:

- **Electrónicos:** Laptops, tablets, monitores
- **Accesorios:** Mouse, teclados, webcams
- **Audio:** Auriculares, altavoces, micrófonos
- **Componentes:** GPU, RAM, SSD, fuentes
- **Fotografía:** Cámaras, drones
- **Wearables:** Smartwatches
- **Redes:** Routers
- **Oficina:** Impresoras
- **Streaming:** Stream Deck
- **Muebles:** Sillas gaming, escritorios

Todos con precios, stock, categorías y descripciones realistas.

---

## 🐛 Troubleshooting

### "No se muestran productos"
- Verifica que hayas ejecutado `npm run migrate`
- Verifica que MongoDB esté corriendo
- Revisa la consola del servidor por errores

### "Error al conectar a MongoDB"
- Asegúrate de que MongoDB esté instalado y corriendo
- Verifica la URI en tu archivo `.env` o que use la default: `mongodb://localhost:27017/tp-final-backend`

### "La página no carga"
- Verifica que el servidor esté corriendo (`npm start`)
- Revisa que el puerto 8080 no esté ocupado
- Revisa la consola del navegador (F12) por errores

### "No puedo ver el detalle de un producto"
- Asegúrate de usar un ID válido de MongoDB
- Puedes obtener IDs válidos desde: `GET /api/products` en Postman

---

## 💡 Tips

1. **Abre varias pestañas** de `/realtimeproducts` para ver las actualizaciones en tiempo real
2. **Usa Postman** para crear productos y luego verlos en el frontend
3. **Prueba los filtros** en `/products` con diferentes categorías
4. **Crea un carrito** y agrega varios productos para probar la funcionalidad completa

---

**¡Disfruta probando tu frontend! 🚀**

