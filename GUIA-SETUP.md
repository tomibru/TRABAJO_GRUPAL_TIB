# Guía: Cómo levantar SampleVault (DB + Backend + Frontend)

## Arquitectura en una línea

```
Browser → http://localhost:3000 → Express (backend/server.js) → MySQL
```

El frontend **no es un servidor separado** — Express lo sirve como archivos estáticos desde la carpeta `frontend/`. Solo hay que levantar el backend.

---

## PASO 1 — Instalar Node.js (si no lo tenés)

1. Ir a https://nodejs.org y descargar la versión **LTS** (la recomendada)
2. Instalar con las opciones por defecto
3. Verificar en la terminal:

```powershell
node --version   # debe mostrar v20.x o v22.x
npm --version    # debe mostrar 10.x
```

---

## PASO 2 — Instalar MySQL (la base de datos)

### Opción A — XAMPP (mas facil para estudiantes)

1. Descargar XAMPP desde https://www.apachefriends.org
2. Instalar y abrir el panel de control
3. Hacer clic en **Start** en la fila de **MySQL**
4. MySQL queda corriendo en el puerto **3306**

### Opción B — MySQL Community Server

1. Descargar MySQL Installer desde https://dev.mysql.com/downloads/installer/
2. Elegir "MySQL Server" en la instalación
3. Configurar contraseña de root durante el setup

---

## PASO 3 — Inicializar la base de datos

> Este paso crea la base de datos, el usuario de la app, las tablas y los stored procedures. **Solo se hace una vez.**

**Archivo:** `backend/config/init.sql`

### Con XAMPP (phpMyAdmin):

1. Panel de XAMPP → clic en **Admin** junto a MySQL (se abre phpMyAdmin en el browser)
2. Pestaña **SQL**
3. Copiar y pegar todo el contenido de `backend/config/init.sql`
4. Clic en **Ejecutar**

### Con la terminal:

```powershell
# Desde la raiz del proyecto
mysql -u root -p < backend/config/init.sql
```

**Resultado esperado:**

- Base de datos: `samplevaultest`
- Tablas: `users`, `roles`, `users_roles`, `samples`
- Usuario de la app creado: `samplevaultest` / `samplevaultest`
- Usuarios de prueba ya cargados:
  - `admin` con contraseña `12345` (rol Admin)
  - `pepe` con contraseña `12345` (rol Producer)

---

## PASO 4 — Crear el archivo .env

El backend necesita un archivo `.env` para conectarse a MySQL. Sin este archivo el servidor no arranca.

1. Dentro de la carpeta `backend/` crear un archivo llamado `.env` (con el punto adelante, sin extension)
2. Pegar este contenido exacto:

```
PORT=3000
DB_HOST=localhost
DB_USER=samplevaultest
DB_PASS=samplevaultest
DB_NAME=samplevaultest
JWT_SECRET=tu_clave_secreta_super_segura
NODE_ENV=testing
```

> **Nota:** `NODE_ENV=testing` sirve la interfaz de pruebas en `/`. Para la app de produccion cambiar a `NODE_ENV=production`.

---

## PASO 5 — Instalar dependencias del backend

```powershell
cd backend
npm install
```

Esto descarga todas las librerias de `backend/package.json`:

| Libreria | Para que sirve |
|----------|---------------|
| `express` | Servidor web |
| `mysql2` | Conectar con MySQL |
| `multer` | Subir archivos de audio |
| `jsonwebtoken` | Autenticacion con tokens JWT |
| `bcrypt` | Hashear contrasenas |
| `cors` | Permitir requests desde el browser |
| `dotenv` | Leer el archivo `.env` |

---

## PASO 6 — Levantar el servidor

```powershell
# Desde la carpeta backend/
node server.js
```

Salida esperada en la terminal:

```
==========================================
SampleVault listo en:
   Punto de entrada: http://localhost:3000
==========================================
```

---

## PASO 7 — Abrir la aplicacion

Abrir el browser en: **http://localhost:3000**

Con `NODE_ENV=testing` vas a ver la **interfaz de tests**:

- **Panel izquierdo:** botones para ejecutar tests (registro, login, subir sample, listar, borrar)
- **Panel derecho:** consola con las respuestas JSON en tiempo real (verde = exito, rojo = error)

**Usuarios de prueba:**

| Usuario | Contrasena | Rol |
|---------|-----------|-----|
| `admin` | `12345` | Admin |
| `pepe` | `12345` | Producer |

Para subir samples de prueba usar los archivos WAV de la carpeta `test-samples/`.

---

## Lista de verificacion

- [ ] MySQL corriendo en puerto 3306
- [ ] `backend/config/init.sql` ejecutado (base de datos creada)
- [ ] `backend/.env` creado con las variables
- [ ] `npm install` ejecutado en `backend/`
- [ ] `node server.js` arranca sin errores en la terminal
- [ ] Browser en `http://localhost:3000` muestra la interfaz
- [ ] Login con `admin` / `12345` devuelve un token JWT

---

## Archivos clave del proyecto

| Archivo | Rol |
|---------|-----|
| `backend/server.js` | Punto de entrada del servidor |
| `backend/config/db.js` | Configuracion de conexion a MySQL |
| `backend/config/init.sql` | Script de inicializacion de la DB |
| `backend/.env` | Variables de entorno (crear manualmente) |
| `backend/package.json` | Lista de dependencias npm |
| `frontend/html/tests.html` | Interfaz de tests (servida por Express) |
| `test-samples/` | Archivos WAV de prueba para subir |
