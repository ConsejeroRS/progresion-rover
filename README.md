# Progresión Rover — Cartilla 2.0

App para seguimiento de progresión rover con Firebase como base de datos en la nube.

## Estructura de archivos

```
progresion-rover/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx              ← Controla modo admin/lectura
    ├── firebase.js          ← Credenciales de Firebase
    └── RoverDashboard.jsx   ← Componente principal
```

## Modo Admin vs Modo Lectura

- **Visitantes**: solo pueden ver el progreso (sin editar)
- **Admin (tú)**: para activar modo admin, abre la URL con `?admin=rover2024`
  - Ejemplo: `https://tu-app.vercel.app/?admin=rover2024`
  - Una vez activado, se guarda en la sesión del navegador

Para cambiar la contraseña, edita `ADMIN_PASSWORD` en `src/App.jsx`.

## Despliegue en Vercel

1. Subir esta carpeta a GitHub
2. Conectar repo en vercel.com
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`

## Desarrollo local

```bash
npm install
npm run dev
```
