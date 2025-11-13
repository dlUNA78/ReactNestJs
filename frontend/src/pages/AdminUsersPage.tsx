import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// 1. Interfaz para los datos que esperamos
interface IAdminUser {
  id_usuario: number;
  nombre: string;
  username: string;
  rol: { // CORRECCIÓN: El objeto se llama 'rol' en la API, no 'role'
    // La API nos da el rol anidado
    nombre_rol: string;
  };
}

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<IAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Función para cargar los usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      // El endpoint 'usuarios-admin' ya oculta el hash
      const response = await axios.get('http://localhost:3000/usuarios-admin');
      setUsers(response.data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Cargar usuarios al montar
  useEffect(() => {
    fetchUsers();
  }, []);

  // 4. Función para Eliminar Usuario
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/usuarios-admin/${id}`);
      fetchUsers(); // Recarga la lista
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      alert('No se pudo eliminar el usuario.');
    }
  };

  // 5. Renderizado
  if (loading) {
    return <div className="p-8 text-center">Cargando usuarios...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Usuarios Admin</h1>
        <Link
          to="/admin/usuarios/nuevo"
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700"
        >
          + Crear Usuario
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id_usuario}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.id_usuario}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {user.rol?.nombre_rol || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/usuarios/editar/${user.id_usuario}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id_usuario)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};