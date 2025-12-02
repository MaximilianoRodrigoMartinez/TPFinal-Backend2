# 🎯 MACHETE DE RUTAS PARA POSTMAN - TP FINAL

## 📋 BASE URL
```
http://localhost:8080
```

---

## 🔐 SESIONES (Sessions) - `/api/sessions`

### 1. **POST** `/api/sessions/register` - Registrar Usuario
- **Autenticación:** No requiere
- **Body (JSON):**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "password123"
}
```
- **Respuesta:** Cookie `jwt` (httpOnly) + usuario sin password
- **Status:** 201

### 2. **POST** `/api/sessions/login` - Login
- **Autenticación:** No requiere
- **Body (JSON):**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```
- **Respuesta:** Cookie `jwt` (httpOnly) + usuario sin password
- **Status:** 200

### 3. **GET** `/api/sessions/current` - Usuario Actual
- **Autenticación:** ✅ SÍ (JWT en cookie o header)
- **Headers:** `Authorization: Bearer <token>` (opcional si no hay cookie)
- **Respuesta:** DTO del usuario (email en mayúsculas, nombres capitalizados)
- **Status:** 200

### 4. **POST** `/api/sessions/logout` - Logout
- **Autenticación:** No requiere
- **Respuesta:** Mensaje de éxito
- **Status:** 200

---

## 📦 PRODUCTOS (Products) - `/api/products`

### 5. **GET** `/api/products` - Listar Productos
- **Autenticación:** No requiere
- **Query Params (opcionales):**
  - `limit=10` (cantidad por página)
  - `page=1` (número de página)
  - `sort=asc` o `sort=desc` (ordenar por precio)
  - `query=category:Electrónicos` (filtrar por categoría)
  - `query=status:true` (filtrar por disponibilidad)
- **Ejemplo:** `/api/products?limit=5&page=1&sort=asc&query=category:Electrónicos`
- **Status:** 200

### 6. **GET** `/api/products/:pid` - Obtener Producto por ID
- **Autenticación:** No requiere
- **Ejemplo:** `/api/products/507f1f77bcf86cd799439011`
- **Status:** 200

### 7. **POST** `/api/products` - Crear Producto
- **Autenticación:** ✅ SÍ (Solo Admin)
- **Body (JSON):**
```json
{
  "title": "Laptop Gaming",
  "description": "Laptop de alto rendimiento",
  "code": "LAP001",
  "price": 1299.99,
  "stock": 50,
  "category": "Electrónicos",
  "status": true,
  "thumbnails": ["laptop1.jpg"]
}
```
- **Status:** 201

### 8. **PUT** `/api/products/:pid` - Actualizar Producto
- **Autenticación:** ✅ SÍ (Solo Admin)
- **Ejemplo:** `/api/products/507f1f77bcf86cd799439011`
- **Body (JSON):**
```json
{
  "title": "Laptop Gaming Pro",
  "price": 1499.99,
  "stock": 45
}
```
- **Status:** 200

### 9. **DELETE** `/api/products/:pid` - Eliminar Producto
- **Autenticación:** ✅ SÍ (Solo Admin)
- **Ejemplo:** `/api/products/507f1f77bcf86cd799439011`
- **Status:** 200

---

## 🛒 CARRITOS (Carts) - `/api/carts`

### 10. **POST** `/api/carts` - Crear Carrito
- **Autenticación:** No requiere
- **Body:** Vacío o `{}`
- **Respuesta:** Carrito vacío con `_id`
- **Status:** 201

### 11. **GET** `/api/carts/:cid` - Ver Carrito
- **Autenticación:** No requiere
- **Ejemplo:** `/api/carts/507f1f77bcf86cd799439011`
- **Respuesta:** Carrito con productos populados
- **Status:** 200

### 12. **POST** `/api/carts/:cid/product/:pid` - Agregar Producto al Carrito
- **Autenticación:** ✅ SÍ (Solo Usuario)
- **Ejemplo:** `/api/carts/507f1f77bcf86cd799439011/product/507f1f77bcf86cd799439012`
- **Body (JSON):**
```json
{
  "quantity": 2
}
```
- **Status:** 200

### 13. **DELETE** `/api/carts/:cid/products/:pid` - Eliminar Producto del Carrito
- **Autenticación:** No requiere
- **Ejemplo:** `/api/carts/507f1f77bcf86cd799439011/products/507f1f77bcf86cd799439012`
- **Status:** 200

### 14. **PUT** `/api/carts/:cid` - Actualizar Todos los Productos
- **Autenticación:** No requiere
- **Ejemplo:** `/api/carts/507f1f77bcf86cd799439011`
- **Body (JSON):**
```json
{
  "products": [
    {
      "product": "507f1f77bcf86cd799439012",
      "quantity": 3
    },
    {
      "product": "507f1f77bcf86cd799439013",
      "quantity": 1
    }
  ]
}
```
- **Status:** 200

### 15. **PUT** `/api/carts/:cid/products/:pid` - Actualizar Cantidad de Producto
- **Autenticación:** No requiere
- **Ejemplo:** `/api/carts/507f1f77bcf86cd799439011/products/507f1f77bcf86cd799439012`
- **Body (JSON):**
```json
{
  "quantity": 5
}
```
- **Status:** 200

### 16. **DELETE** `/api/carts/:cid` - Vaciar Carrito
- **Autenticación:** No requiere
- **Ejemplo:** `/api/carts/507f1f77bcf86cd799439011`
- **Status:** 200

### 17. **POST** `/api/carts/:cid/purchase` - Finalizar Compra (GENERAR TICKET)
- **Autenticación:** ✅ SÍ (Solo Usuario)
- **Ejemplo:** `/api/carts/507f1f77bcf86cd799439011/purchase`
- **Body:** Vacío
- **Respuesta:** 
  - Ticket generado con código único
  - Total calculado
  - Productos no procesados (sin stock)
  - Carrito actualizado con productos restantes
- **Status:** 201 (éxito) o 400 (sin stock)

---

## 🔑 NOTAS IMPORTANTES PARA POSTMAN

### Autenticación con Cookies (httpOnly)
1. **Registro/Login:** Automáticamente se guarda el JWT en una cookie `jwt` (httpOnly)
2. **Current/Purchase:** Postman enviará automáticamente la cookie si está configurado
3. **Si no funciona la cookie:** Usa el header `Authorization: Bearer <token>`

### Roles
- **Admin:** Puede crear, actualizar y eliminar productos
- **User:** Puede agregar productos al carrito y finalizar compras
- **Default:** Todos los usuarios nuevos son "user"

### Flujo Recomendado para Probar
1. ✅ Registrar usuario → `/api/sessions/register`
2. ✅ Login → `/api/sessions/login`
3. ✅ Ver usuario actual → `/api/sessions/current` (verificar DTO con mayúsculas)
4. ✅ Crear carrito → `/api/carts` (POST)
5. ✅ Agregar productos → `/api/carts/:cid/product/:pid` (POST)
6. ✅ Ver carrito → `/api/carts/:cid` (GET)
7. ✅ Finalizar compra → `/api/carts/:cid/purchase` (POST) ← **IMPORTANTE: Genera ticket**
8. ✅ Verificar ticket generado en la respuesta

### Headers Importantes
```
Content-Type: application/json
```

### Para Admin (crear productos)
1. Registrar usuario
2. Cambiar manualmente en DB el `role` a `"admin"` o crear usuario admin directamente
3. Login con ese usuario
4. Ahora puedes crear/actualizar/eliminar productos

---

## ✅ CHECKLIST PARA EL PROFESOR

- [x] Registro con passport-local
- [x] Login con passport-local  
- [x] Current con estrategia JWT y DTO (email mayúsculas, nombres capitalizados)
- [x] DAOs con solo 5 métodos (create, get, getById, update, delete)
- [x] Managers simplificados (sin lógica)
- [x] Controllers implementados
- [x] Factory pattern para servicios
- [x] Repository pattern usando DAOs
- [x] DTO recibe token JWT y modifica datos
- [x] Ruta `/purchase` genera ticket, verifica stock, actualiza carrito
- [x] Middleware de autorización (admin para productos, user para carrito)
- [x] JWT en cookie httpOnly (no en body)

---

**¡Éxito con la entrega! 🚀**

