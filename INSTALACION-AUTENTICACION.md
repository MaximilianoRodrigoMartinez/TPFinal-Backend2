# 🚀 Guía de Instalación - Sistema de Autenticación

## Paso 1: Instalar Dependencias

Ejecuta el siguiente comando para instalar todas las dependencias necesarias:

```bash
npm install
```

Esto instalará:
- `bcrypt` - Encriptación de contraseñas
- `passport` - Framework de autenticación
- `passport-jwt` - Estrategia JWT
- `jsonwebtoken` - Generación de tokens

## Paso 2: Configurar Variables de Entorno

Crea o actualiza tu archivo `.env` en la raíz del proyecto:

```env
JWT_SECRET=tu_secret_key_super_segura_cambiar_en_produccion
MONGODB_URI=mongodb://localhost:27017/tp-final-backend
PORT=8080
```

**⚠️ IMPORTANTE:** 
- Cambia `JWT_SECRET` por una clave secreta fuerte y única
- En producción, usa una clave diferente y más segura
- Nunca subas el archivo `.env` a GitHub

## Paso 3: Reiniciar el Servidor

```bash
npm start
```

O en modo desarrollo:

```bash
npm run dev
```

## Paso 4: Probar el Sistema

### Registrar un Usuario

```bash
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

### Hacer Login

```bash
POST http://localhost:8080/api/sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Guarda el token de la respuesta.**

### Obtener Usuario Actual

```bash
GET http://localhost:8080/api/sessions/current
Authorization: Bearer <token_obtenido>
```

## ✅ Verificación

Si todo está correcto, deberías poder:
1. ✅ Registrar usuarios
2. ✅ Hacer login y obtener un token JWT
3. ✅ Usar el token para acceder a `/api/sessions/current`
4. ✅ Ver tus datos de usuario en la respuesta

## 📚 Documentación Completa

Lee `AUTENTICACION-README.md` para más detalles sobre:
- Estructura del sistema
- Cómo proteger rutas
- Manejo de errores
- Troubleshooting

---

**¡Listo para usar! 🎉**

