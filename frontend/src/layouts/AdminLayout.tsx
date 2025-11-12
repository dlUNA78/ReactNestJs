import { useEffect } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const adminUserJson = localStorage.getItem('admin_user');
  
  // 1. Lógica de "Ruta Protegida"
  useEffect(() => {
    if (!adminUserJson) {
      navigate('/admin/login'); // Si no hay usuario, patea al login
    }
  }, [adminUserJson, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  // Si no hay usuario, no renderiza nada (la redirección está en curso)
  if (!adminUserJson) {
    return null;
  }

  // 2. Renderizado del Layout
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/admin/dashboard" className="block p-2 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/productos" className="block p-2 rounded hover:bg-gray-700">
              Productos
            </Link>
          </li>
          <li>
            <Link to="/admin/ordenes" className="block p-2 rounded hover:bg-gray-700">
              Órdenes
            </Link>
          </li>
          <li>
            <Link to="/admin/usuarios" className="block p-2 rounded hover:bg-gray-700">
              Usuarios
            </Link>
          </li>
          <li>
            <Link to="/admin/categorias" className="block p-2 rounded hover:bg-gray-700">
              Categorías
            </Link>
          </li>
          <li>
            <Link to="/admin/marcas" className="block p-2 rounded hover:bg-gray-700">
              Marcas
            </Link>
          </li>
          <li>
            <Link to="/admin/tallas" className="block p-2 rounded hover:bg-gray-700">
              Tallas
            </Link>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 px-4 py-2 rounded shadow hover:bg-red-600 mt-10"
        >
          Cerrar Sesión
        </button>
      </nav>

      {/* Contenido de la Página */}
      <main className="flex-1 p-8 bg-gray-100">
        <Outlet /> {/* <-- Aquí se renderizan las páginas (Dashboard, Productos) */}
      </main>
    </div>
  );
};