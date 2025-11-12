import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// 1. Interfaz para los datos
interface ICategoria {
  id_categoria: number;
  nombre: string;
  descripcion: string;
}

export const AdminCategoriasPage = () => {
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Función para cargar las categorías
  const fetchCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3000/categorias');
      setCategorias(response.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError('No se pudieron cargar las categorías.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Cargar datos al montar
  useEffect(() => {
    fetchCategorias();
  }, []);

  // 4. Función para Eliminar
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/categorias/${id}`);
      fetchCategorias(); // Recarga la lista
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      alert('No se pudo eliminar la categoría.');
    }
  };

  // 5. Renderizado
  if (loading) {
    return <div className="p-8 text-center">Cargando categorías...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
        <Link
          to="/admin/categorias/nuevo"
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700"
        >
          + Crear Categoría
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categorias.map((cat) => (
              <tr key={cat.id_categoria}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{cat.id_categoria}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{cat.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm truncate max-w-sm">{cat.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/categorias/editar/${cat.id_categoria}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(cat.id_categoria)}
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