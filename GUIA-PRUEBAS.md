# 🧪 GUÍA COMPLETA DE PRUEBAS - TP FINAL

## 📋 PREPARACIÓN

### 1. Iniciar el servidor
```bash
npm run dev
# o
npm start
```

### 2. Verificar que MongoDB esté corriendo
- El servidor debe mostrar: `MongoDB conectado: localhost`

### 3. Importar colección de Postman
- Abre Postman
- Import → Selecciona `TP-Backend.postman_collection.json`
- Verifica que la variable `baseUrl` esté en `http://localhost:8080`

---

## 🔐 PASO 1: AUTENTICACIÓN Y SESIONES

### 1.1 Registrar Usuario (POST `/api/sessions/register`)

**Request:**
```json
POST http://localhost:8080/api/sessions/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "password123"
}
```

**✅ Verificar:**
- Status: 201
- Cookie `jwt` se guarda automáticamente (httpOnly)
- Response NO incluye el token en el body
- Usuario creado con `role: "user"` por defecto

### 1.2 Login (POST `/api/sessions/login`)

**Request:**
```json
POST http://localhost:8080/api/sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**✅ Verificar:**
- Status: 200
- Cookie `jwt` se actualiza
- Response NO incluye el token en el body

### 1.3 Current - Verificar DTO con JWT (GET `/api/sessions/current`)

**Request:**
```
GET http://localhost:8080/api/sessions/current
```

**✅ Verificar (CRÍTICO PARA EL PROFESOR):**
- Status: 200
- El **email está en MAYÚSCULAS** (ej: `JUAN@EXAMPLE.COM`)
- Los **nombres tienen primera letra mayúscula** (ej: `Juan`, `Pérez`)
- NO incluye el campo `password`
- Incluye: `_id`, `first_name`, `last_name`, `email`, `age`, `cart`, `role`, `createdAt`, `updatedAt`

**⚠️ Si no funciona:**
- Verifica que la cookie `jwt` esté presente
- O usa header: `Authorization: Bearer <token>`

### 1.4 Logout (POST `/api/sessions/logout`)

**Request:**
```
POST http://localhost:8080/api/sessions/logout
```

**✅ Verificar:**
- Status: 200
- Cookie `jwt` se elimina

---

## 📦 PASO 2: PRODUCTOS (REQUIERE ADMIN)

### 2.1 Crear Usuario Admin

**Opción A: Modificar en MongoDB directamente**
```javascript
// En MongoDB Compass o mongo shell
db.users.updateOne(
  { email: "juan@example.com" },
  { $set: { role: "admin" } }
)
```

**Opción B: Registrar nuevo usuario y cambiar role**
1. Registrar otro usuario
2. Cambiar role a "admin" en la base de datos

### 2.2 Login como Admin

**Request:**
```json
POST http://localhost:8080/api/sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",  // El que tiene role: "admin"
  "password": "password123"
}
```

### 2.3 Listar Productos (GET `/api/products`)

**Request:**
```
GET http://localhost:8080/api/products?limit=5&page=1&sort=asc
```

**✅ Verificar:**
- Status: 200
- Respuesta incluye paginación completa
- Filtros funcionan: `?query=category:Electrónicos`

### 2.4 Crear Producto (POST `/api/products`) - SOLO ADMIN

**Request:**
```json
POST http://localhost:8080/api/products
Content-Type: application/json
Cookie: jwt=<tu_cookie>

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

**✅ Verificar:**
- Status: 201
- Producto creado con `_id`
- **Si no eres admin:** Status 403 (Acceso denegado)

### 2.5 Actualizar Producto (PUT `/api/products/:pid`) - SOLO ADMIN

**Request:**
```json
PUT http://localhost:8080/api/products/<productId>
Content-Type: application/json
Cookie: jwt=<tu_cookie>

{
  "price": 1499.99,
  "stock": 45
}
```

**✅ Verificar:**
- Status: 200
- Producto actualizado

### 2.6 Eliminar Producto (DELETE `/api/products/:pid`) - SOLO ADMIN

**Request:**
```
DELETE http://localhost:8080/api/products/<productId>
Cookie: jwt=<tu_cookie>
```

**✅ Verificar:**
- Status: 200
- Producto eliminado

---

## 🛒 PASO 3: CARRITOS

### 3.1 Crear Carrito (POST `/api/carts`)

**Request:**
```json
POST http://localhost:8080/api/carts
```

**✅ Verificar:**
- Status: 201
- Carrito vacío creado
- Guarda el `_id` del carrito para los siguientes pasos

### 3.2 Ver Carrito (GET `/api/carts/:cid`)

**Request:**
```
GET http://localhost:8080/api/carts/<cartId>
```

**✅ Verificar:**
- Status: 200
- Carrito con productos populados (si tiene productos)

### 3.3 Agregar Producto al Carrito (POST `/api/carts/:cid/product/:pid`) - SOLO USUARIO

**⚠️ IMPORTANTE:** Debes estar logueado como usuario (no admin)

**Request:**
```json
POST http://localhost:8080/api/carts/<cartId>/product/<productId>
Content-Type: application/json
Cookie: jwt=<tu_cookie>

{
  "quantity": 2
}
```

**✅ Verificar:**
- Status: 200
- Producto agregado al carrito
- **Si no estás autenticado:** Status 401
- **Si eres admin pero no user:** Debería funcionar (depende de tu lógica)

### 3.4 Actualizar Cantidad (PUT `/api/carts/:cid/products/:pid`)

**Request:**
```json
PUT http://localhost:8080/api/carts/<cartId>/products/<productId>
Content-Type: application/json

{
  "quantity": 5
}
```

**✅ Verificar:**
- Status: 200
- Cantidad actualizada

### 3.5 Eliminar Producto del Carrito (DELETE `/api/carts/:cid/products/:pid`)

**Request:**
```
DELETE http://localhost:8080/api/carts/<cartId>/products/<productId>
```

**✅ Verificar:**
- Status: 200
- Producto eliminado del carrito

---

## 🎫 PASO 4: FINALIZAR COMPRA (PURCHASE) - CRÍTICO

### 4.1 Preparar Carrito con Productos

1. Asegúrate de tener productos en el carrito
2. Verifica que los productos tengan stock suficiente
3. El carrito debe pertenecer al usuario logueado

### 4.2 Finalizar Compra (POST `/api/carts/:cid/purchase`) - SOLO USUARIO

**Request:**
```json
POST http://localhost:8080/api/carts/<cartId>/purchase
Cookie: jwt=<tu_cookie>
```

**✅ Verificar (CRÍTICO PARA EL PROFESOR):**

**Si hay stock suficiente:**
- Status: 201
- **Ticket generado** con:
  - `code`: Código único (ej: `TKT-XXXX-XXXX`)
  - `amount`: Total calculado
  - `purchaser`: Email del usuario
  - `purchase_datetime`: Fecha/hora
- **Stock actualizado** en los productos
- **Carrito actualizado** con solo productos sin stock (si los hay)

**Si NO hay stock:**
- Status: 400
- `unprocessedProducts`: Array con IDs de productos sin stock
- Carrito mantiene productos sin procesar

**Ejemplo de respuesta exitosa:**
```json
{
  "status": "success",
  "message": "Compra procesada parcialmente",
  "payload": {
    "ticket": {
      "_id": "...",
      "code": "TKT-ABC123-4567",
      "purchase_datetime": "2024-01-15T10:30:00.000Z",
      "amount": 2599.98,
      "purchaser": "juan@example.com"
    },
    "unprocessedProducts": []
  }
}
```

---

## ✅ CHECKLIST DE VERIFICACIÓN PARA EL PROFESOR

### Autenticación
- [ ] Registro con `passport-local` funciona
- [ ] Login con `passport-local` funciona
- [ ] `/current` usa estrategia "current" y retorna DTO
- [ ] DTO muestra email en MAYÚSCULAS
- [ ] DTO muestra nombres con primera letra mayúscula
- [ ] JWT se guarda en cookie httpOnly (NO en body)

### Autorización
- [ ] Solo admin puede crear productos (POST `/api/products`)
- [ ] Solo admin puede actualizar productos (PUT `/api/products/:pid`)
- [ ] Solo admin puede eliminar productos (DELETE `/api/products/:pid`)
- [ ] Solo usuario puede agregar productos al carrito (POST `/api/carts/:cid/product/:pid`)
- [ ] Solo usuario puede finalizar compra (POST `/api/carts/:cid/purchase`)

### Compra y Tickets
- [ ] Ruta `/purchase` verifica stock
- [ ] Ruta `/purchase` genera ticket con código único
- [ ] Ruta `/purchase` calcula total correctamente
- [ ] Ruta `/purchase` actualiza stock de productos
- [ ] Ruta `/purchase` actualiza carrito con productos sin stock
- [ ] Ticket tiene todos los campos requeridos

### Arquitectura
- [ ] DAOs tienen solo 5 métodos (create, get, getById, update, delete)
- [ ] Managers están simplificados (sin lógica)
- [ ] Controllers separados de routes
- [ ] Factory pattern implementado
- [ ] Repository pattern usando DAOs
- [ ] DTO recibe token JWT y modifica datos

---

## 🐛 PROBLEMAS COMUNES Y SOLUCIONES

### Error: "Unknown authentication strategy 'current'"
- **Solución:** Reinicia el servidor después de los cambios

### Error: 401 en `/current`
- **Solución:** Verifica que tengas la cookie `jwt` o usa header `Authorization: Bearer <token>`

### Error: 403 al crear producto
- **Solución:** Asegúrate de estar logueado como admin (role: "admin")

### Error: 401 al agregar producto al carrito
- **Solución:** Debes estar logueado como usuario

### El DTO no muestra mayúsculas
- **Solución:** Verifica que el token JWT se esté pasando al DTO en `sessionsController.current()`

### El ticket no se genera
- **Solución:** Verifica que:
  1. El carrito tenga productos
  2. Los productos tengan stock suficiente
  3. Estés autenticado como usuario
  4. El carrito pertenezca al usuario logueado

---

## 📝 NOTAS FINALES

1. **Usa Postman** para todas las pruebas (el profesor lo usa)
2. **Guarda los IDs** de productos y carritos en variables de entorno de Postman
3. **Verifica las cookies** en Postman: View → Show Postman Console
4. **Prueba casos edge:**
   - Carrito vacío
   - Stock insuficiente
   - Productos no encontrados
   - Usuario no autenticado
   - Permisos incorrectos

**¡Éxito con las pruebas! 🚀**

