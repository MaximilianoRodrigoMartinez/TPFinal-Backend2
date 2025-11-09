# Tests de Postman - TP Backend

## 📋 Resumen

Esta colección de Postman incluye tests completos para todos los endpoints de tu API, con especial énfasis en los casos de **eliminación** que fueron el problema reportado por tu profesor.

## 🔧 Correcciones Realizadas

### Problema Identificado
El problema era que cuando se intentaba eliminar un producto o carrito con un **ID inválido** (que no es un ObjectId válido de MongoDB), la aplicación no validaba el formato del ID antes de intentar la operación, lo que causaba errores.

### Solución Implementada
Se agregó validación de ObjectId en todos los métodos de los servicios:
- `productService.js`: Validación en `getProductById`, `updateProduct`, `deleteProduct`
- `cartService.js`: Validación en todos los métodos que reciben IDs

Ahora, cuando se intenta eliminar con un ID inválido, se retorna un error claro: **"ID de producto inválido"** o **"ID de carrito inválido"**.

## 📥 Cómo Importar la Colección

1. Abre Postman
2. Click en **Import** (botón arriba a la izquierda)
3. Selecciona el archivo `TP-Backend.postman_collection.json`
4. La colección se importará con todas las requests y tests

## ⚠️ IMPORTANTE: Problema con Localhost

Si ves el error: *"When testing an API locally, you need to use the Postman Desktop Agent"*, tienes dos opciones:

### Opción 1: Usar Postman Desktop App (Recomendado)
1. Descarga e instala **Postman Desktop** desde: https://www.postman.com/downloads/
2. Abre la aplicación de escritorio
3. Importa la colección en la app de escritorio
4. Listo, podrás hacer requests a localhost sin problemas

### Opción 2: Instalar Postman Desktop Agent
Si prefieres usar Postman Web:
1. En Postman Web, verás un banner en la parte superior sobre el Desktop Agent
2. Click en **Download Agent** o **Install Agent**
3. Descarga e instala el agente en tu computadora
4. El agente se ejecutará en segundo plano y permitirá requests a localhost
5. Verifica que el agente esté activo (debería aparecer un indicador verde en Postman)

## ⚙️ Configuración

### Variables de Entorno

La colección usa una variable `baseUrl` que por defecto está configurada como:
```
http://localhost:8080
```

Si tu servidor corre en otro puerto, puedes:
1. Click derecho en la colección → **Edit**
2. Ir a la pestaña **Variables**
3. Cambiar el valor de `baseUrl`

O crear un Environment en Postman con la variable `baseUrl`.

## 🧪 Estructura de Tests

### Productos
- ✅ **1. Listar productos** - GET básico
- ✅ **1.1. Listar con paginación** - Con limit y page
- ✅ **1.2. Listar con filtros** - Por categoría y ordenamiento
- ✅ **2. Obtener producto por ID** - Caso exitoso
- ✅ **2.1. Obtener con ID inválido** - Test de validación
- ✅ **2.2. Obtener con ID inexistente** - Test de error 404
- ✅ **3. Crear producto** - POST exitoso
- ✅ **3.1. Crear sin campos requeridos** - Test de validación
- ✅ **4. Actualizar producto** - PUT exitoso
- ✅ **4.1. Actualizar con ID inválido** - Test de validación
- ✅ **5. ELIMINAR producto** - DELETE exitoso ⭐
- ✅ **5.1. ELIMINAR con ID inválido** - **TEST CRÍTICO** ⚠️
- ✅ **5.2. ELIMINAR con ID inexistente** - Test de error
- ✅ **5.3. ELIMINAR con ID vacío** - Edge case

### Carritos
- ✅ **1. Crear carrito** - POST exitoso
- ✅ **2. Obtener carrito por ID** - GET exitoso
- ✅ **2.1. Obtener con ID inválido** - Test de validación
- ✅ **3. Agregar producto al carrito** - POST exitoso
- ✅ **3.1. Agregar con IDs inválidos** - Test de validación
- ✅ **4. Eliminar producto del carrito** - DELETE exitoso
- ✅ **4.1. Eliminar con IDs inválidos** - Test de validación
- ✅ **5. Actualizar cantidad** - PUT exitoso
- ✅ **6. Actualizar todos los productos** - PUT exitoso
- ✅ **7. ELIMINAR todos los productos** - DELETE exitoso ⭐
- ✅ **7.1. ELIMINAR con ID inválido** - **TEST CRÍTICO** ⚠️
- ✅ **7.2. ELIMINAR con ID inexistente** - Test de error

## 🎯 Tests Críticos para el Problema Reportado

Los tests marcados con ⚠️ son los que **probablemente fallaron** cuando tu profesor intentó borrar algo:

1. **5.1. ELIMINAR producto con ID inválido**
   - URL: `DELETE /api/products/123`
   - Debe retornar error 500 con mensaje "ID de producto inválido"

2. **7.1. ELIMINAR productos del carrito con ID inválido**
   - URL: `DELETE /api/carts/123`
   - Debe retornar error 500 con mensaje "ID de carrito inválido"

## 🚀 Cómo Ejecutar los Tests

### Opción 1: Ejecutar Individualmente
1. Selecciona cualquier request
2. Click en **Send**
3. Ve a la pestaña **Test Results** para ver los resultados

### Opción 2: Ejecutar Todos los Tests
1. Click derecho en la colección
2. Selecciona **Run collection**
3. Se abrirá el **Collection Runner**
4. Click en **Run TP Backend - Tests Completos**
5. Verás todos los tests ejecutándose y sus resultados

### Opción 3: Ejecutar una Carpeta Completa
1. Click derecho en la carpeta "Productos" o "Carritos"
2. Selecciona **Run folder**
3. Se ejecutarán solo los tests de esa carpeta

## ✅ Qué Esperar

### Tests Exitosos
- Status code correcto (200, 201, 404, 500 según corresponda)
- Mensajes de error claros y descriptivos
- Validación de estructura de respuesta

### Tests que Deben Pasar Ahora (después de las correcciones)
- ✅ **5.1. ELIMINAR producto con ID inválido** - Ahora retorna error claro
- ✅ **7.1. ELIMINAR productos del carrito con ID inválido** - Ahora retorna error claro
- ✅ Todos los demás tests de validación de IDs

## 📝 Notas Importantes

1. **Variables Automáticas**: Algunos tests guardan IDs automáticamente en variables de entorno:
   - `productId`: Se guarda del primer producto listado
   - `createdProductId`: Se guarda del producto creado en el test 3
   - `cartId`: Se guarda del carrito creado

2. **Orden de Ejecución**: Algunos tests dependen de otros:
   - El test "5. ELIMINAR producto" elimina el producto creado en el test "3. Crear producto"
   - Si ejecutas tests individuales, asegúrate de tener datos en la BD

3. **Base de Datos**: Asegúrate de que:
   - Tu servidor esté corriendo
   - MongoDB esté conectado
   - Tengas algunos productos en la base de datos para los tests de listado

## 🐛 Troubleshooting

### Error: "Cannot GET /api/products"
- Verifica que el servidor esté corriendo
- Verifica que `baseUrl` esté configurado correctamente

### Tests fallan con "productId is not defined"
- Ejecuta primero el test "1. Listar productos" para que se guarde el `productId`
- O crea manualmente un producto y actualiza la variable

### Tests de eliminación fallan
- Verifica que hayas importado los cambios en los servicios
- Reinicia el servidor después de los cambios

## 📊 Resultados Esperados

Después de ejecutar todos los tests, deberías ver:
- ✅ Tests exitosos: ~90%
- ⚠️ Tests con errores esperados (404, 500): ~10% (estos son correctos, prueban casos de error)

Los tests marcados como críticos (5.1 y 7.1) ahora deberían pasar correctamente, retornando errores descriptivos en lugar de fallar silenciosamente.

---

**¡Buena suerte con tu TP! 🎓**

