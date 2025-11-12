import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// 1. Interfaz
interface IMarca {
  id_marca: number;
  nombre: string;
}

export const AdminMarcasPage = () => {
  const [marcas, setMarcas] = useState<IMarca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Cargar Marcas
  const fetchMarcas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/marcas');
      setMarcas(response.data);
    } catch (err) {
      console.error('Error al cargar marcas:', err);
      setError('No se pudieron cargar las marcas.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Cargar al montar
  useEffect(() => {
    fetchMarcas();
  }, []);

  // 4. Eliminar
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/marcas/${id}`);
      fetchMarcas(); // Recarga la lista
    } catch (err) {
      console.error('Error al eliminar marca:', err);
      alert('No se pudo eliminar la marca.');
    }
  };

  // 5. Renderizado
  if (loading) {
    return <div className="p-8 text-center">Cargando marcas...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Marcas</h1>
        <Link
          to="/admin/marcas/nuevo"
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700"
        >
          + Crear Marca
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marcas.map((marca) => (
              <tr key={marca.id_marca}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{marca.id_marca}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{marca.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/marcas/editar/${marca.id_marca}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(marca.id_marca)}
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