# SGMI-MA • Sistema de Gestión de Mantenimiento e Inventario
### Manufacturas Andina S.A.

Este paquete contiene la aplicación completa (Frontend React + Backend Node.js Express) configurada y lista para ejecutar.

---

## 🚀 Instrucciones Rápidas de Ejecución

### 1. Iniciar el Backend (Servidor API)
1. Abre una terminal y navega a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor:
   ```bash
   npm start
   ```
   *(El servidor se ejecutará en `http://localhost:5000`)*.

---

### 2. Iniciar el Frontend (Cliente React + Vite)
1. Abre una **segunda terminal** y navega a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación React:
   ```bash
   npm run dev
   ```
4. Abre en tu navegador la dirección indicada (usualmente `http://localhost:5173`).

---

## 🔑 Credenciales de Prueba

La aplicación aplica las reglas estrictas del ERS:
- **Usuario/Email**: Mínimo 6 caracteres y debe contener `@` (ej. `admin@andina.cl`).
- **Contraseña**: Mínimo 6 caracteres (ej. `admin123`).

---

## 📁 Estructura del Proyecto

```
sistema-cmms/
├── backend/
│   ├── package.json
│   ├── server.js          # API REST con auth, inventario, auditoría y respaldos
│   └── schema.sql         # Esquema relacional PostgreSQL / SQLite
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        └── App.jsx        # Interfaz de usuario interactiva
```
