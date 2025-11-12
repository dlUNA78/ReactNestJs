import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// 1. Interfaz (nota el 'nombre_talla')
interface ITalla {
  id_talla: number;
  nombre_talla: string;
}

export const AdminTallasPage = () => {
  const [tallas, setTallas] = useState<ITalla[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Cargar Tallas
  const fetchTallas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/tallas');
      setTallas(response.data);
    } catch (err) {
      console.error('Error al cargar tallas:', err);
      setError('No se pudieron cargar las tallas.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Cargar al montar
  useEffect(() => {
    fetchTallas();
  }, []);

  // 4. Eliminar
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta talla?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/tallas/${id}`);
      fetchTallas(); // Recarga la lista
    } catch (err) {
      console.error('Error al eliminar talla:', err);
      alert('No se pudo eliminar la talla.');
    }
  };

  // 5. Renderizado
  if (loading) {
    return <div className="p-8 text-center">Cargando tallas...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Tallas</h1>
        <Link
          to="/admin/tallas/nuevo"
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700"
        >
          + Crear Talla
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre Talla (ej. M, L, XL)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tallas.map((talla) => (
              <tr key={talla.id_talla}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{talla.id_talla}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{talla.nombre_talla}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/tallas/editar/${talla.id_talla}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(talla.id_talla)}
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