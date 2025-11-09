# 🔐 Sistema de Autenticación y Autorización

## 📋 Implementación Completa

Se ha implementado un sistema completo de autenticación y autorización con JWT y Passport siguiendo los requisitos del TP.

## 🚀 Instalación

Primero, instala las dependencias necesarias:

```bash
npm install
```

Esto instalará:
- `bcrypt` - Para encriptación de contraseñas
- `passport` - Framework de autenticación
- `passport-jwt` - Estrategia JWT para Passport
- `jsonwebtoken` - Para generar y verificar tokens JWT

## ⚙️ Configuración

### Variables de Entorno

Crea o actualiza tu archivo `.env` con la siguiente variable:

```env
JWT_SECRET=tu_secret_key_super_segura_cambiar_en_produccion
MONGODB_URI=mongodb://localhost:27017/tp-final-backend
PORT=8080
```

**⚠️ IMPORTANTE:** En producción, usa una clave secreta fuerte y segura para `JWT_SECRET`.

## 📁 Estructura Implementada

### Modelo de Usuario (`models/User.js`)

- ✅ `first_name`: String (requerido)
- ✅ `last_name`: String (requerido)
- ✅ `email`: String (requerido, único)
- ✅ `age`: Number (requerido, mínimo 0)
- ✅ `password`: String (requerido, mínimo 6 caracteres, encriptado con bcrypt)
- ✅ `cart`: ObjectId referencia a Cart (se crea automáticamente)
- ✅ `role`: String (default: "user", puede ser "user" o "admin")

**Características:**
- Encriptación automática de contraseña con `bcrypt.hashSync` en el pre-save hook
- Método `comparePassword` para validar contraseñas
- Validación de email con regex
- Timestamps automáticos (createdAt, updatedAt)

### Servicio de Usuarios (`services/userService.js`)

Métodos implementados:
- `createUser(userData)` - Crea usuario y su carrito asociado
- `getUserByEmail(email)` - Obtiene usuario por email
- `getUserById(id)` - Obtiene usuario por ID (sin contraseña)
- `validatePassword(email, password)` - Valida credenciales

### Configuración de Passport (`config/passport.config.js`)

Estrategias implementadas:
- ✅ **Estrategia "jwt"**: Para autenticación general
- ✅ **Estrategia "current"**: Para validar usuario actual en `/api/sessions/current`

### Rutas de Autenticación (`routes/sessions.js`)

#### POST `/api/sessions/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "password123"
}
```

**Respuesta exitosa (201):**
```json
{
  "status": "success",
  "message": "Usuario registrado exitosamente",
  "payload": {
    "_id": "...",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "cart": "...",
    "role": "user"
  }
}
```

#### POST `/api/sessions/login`
Inicia sesión y genera token JWT.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "message": "Login exitoso",
  "payload": {
    "user": {
      "_id": "...",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@example.com",
      "age": 25,
      "cart": "...",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET `/api/sessions/current` ⭐
Valida el usuario logueado y devuelve sus datos.

**Headers requeridos:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa (200):**
```json
{
  "status": "success",
  "payload": {
    "_id": "...",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "cart": "...",
    "role": "user"
  }
}
```

**Respuesta con token inválido (401):**
```json
{
  "status": "error",
  "error": "Unauthorized"
}
```

#### POST `/api/sessions/logout`
Cierra sesión (limpia cookie JWT).

## 🧪 Pruebas con Postman

### 1. Registrar Usuario
```
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

### 2. Login
```
POST http://localhost:8080/api/sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Guarda el token de la respuesta para el siguiente paso.**

### 3. Obtener Usuario Actual
```
GET http://localhost:8080/api/sessions/current
Authorization: Bearer <token_obtenido_en_login>
```

## 🔒 Proteger Rutas

Para proteger una ruta y requerir autenticación, usa el middleware:

```javascript
const { authenticate } = require("../middlewares/auth.middleware");

router.get("/ruta-protegida", authenticate, (req, res) => {
  // req.user contiene los datos del usuario autenticado
  res.json({ user: req.user });
});
```

Para requerir permisos de admin:

```javascript
const { authenticate, isAdmin } = require("../middlewares/auth.middleware");

router.delete("/admin-only", authenticate, isAdmin, (req, res) => {
  // Solo usuarios con role "admin" pueden acceder
  res.json({ message: "Acceso de admin" });
});
```

## ✅ Criterios de Evaluación Cumplidos

### ✅ Modelo de Usuario y Encriptación
- [x] Modelo User con todos los campos requeridos
- [x] Encriptación de contraseña con `bcrypt.hashSync`
- [x] Contraseña almacenada de forma segura

### ✅ Estrategias de Passport
- [x] Estrategias configuradas correctamente
- [x] Estrategia JWT implementada
- [x] Estrategia "current" para validación

### ✅ Sistema de Login y JWT
- [x] Login funcional con generación de token JWT
- [x] Token JWT válido y utilizable
- [x] Token expira en 24 horas

### ✅ Endpoint /api/sessions/current
- [x] Estrategia "current" implementada
- [x] Validación de usuario mediante JWT
- [x] Retorna datos del usuario
- [x] Manejo de errores para tokens inválidos

## 📝 Notas Importantes

1. **Seguridad:**
   - La contraseña nunca se retorna en las respuestas
   - Los tokens JWT tienen expiración (24h)
   - Se recomienda usar HTTPS en producción

2. **Carrito:**
   - Cada usuario tiene un carrito asociado que se crea automáticamente al registrarse

3. **Roles:**
   - Por defecto todos los usuarios tienen role "user"
   - Puedes cambiar manualmente en la BD a "admin" si necesitas

4. **Validaciones:**
   - Email debe ser único
   - Contraseña mínimo 6 caracteres
   - Edad debe ser un número positivo

## 🐛 Troubleshooting

### Error: "JWT_SECRET is not defined"
- Asegúrate de tener la variable `JWT_SECRET` en tu archivo `.env`

### Error: "Unauthorized" al usar /current
- Verifica que estés enviando el header `Authorization: Bearer <token>`
- Asegúrate de que el token no haya expirado (24h)
- Verifica que el token sea el correcto

### Error: "El email ya está registrado"
- El email debe ser único en la base de datos
- Intenta con otro email o elimina el usuario existente

---

**¡Sistema de autenticación completo y listo para usar! 🚀**

