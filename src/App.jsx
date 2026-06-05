import RoverDashboard from './RoverDashboard.jsx'

// Para activar modo admin, abre la URL con ?admin=rover2024
// Ej: https://tu-app.vercel.app/?admin=rover2024
const ADMIN_PASSWORD = "rover2024";

function isAdmin() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  const pwd = params.get("admin");
  if (pwd === ADMIN_PASSWORD) {
    sessionStorage.setItem("rv_admin", "1");
    return true;
  }
  return sessionStorage.getItem("rv_admin") === "1";
}

export default function App() {
  return <RoverDashboard isAdmin={isAdmin()} />;
}
