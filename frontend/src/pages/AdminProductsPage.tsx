import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios'; // Importa AxiosError
import { Link } from 'react-router-dom';

// Interfaz para los productos (de tu API)
interface IProductoAdmin {
  producto_id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: { nombre: string };
  marca: { nombre: string };
}

export const AdminProductsPage = () => {
  const [productos, setProductos] = useState<IProductoAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar los productos
  const fetchProductos = async () => {
    try {
      // No reseteamos el error aquí para que se mantenga visible si falla
      setLoading(true);
      const response = await axios.get('http://localhost:3000/productos');
      setProductos(response.data);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      alert('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al montar
  useEffect(() => {
    fetchProductos();
  }, []);

  // --- Función para Eliminar Producto (Actualizada) ---
  const handleDelete = async (id: number) => {
    // Pide confirmación
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/productos/${id}`);
      fetchProductos(); // Recarga la lista
    } catch (err) {
      console.error('Error al eliminar producto:', err);

      // 1. Revisa si es un error de Axios
      if (err instanceof AxiosError && err.response) {
        // 2. Muestra el mensaje de error amigable que viene del backend (ej. 409 Conflict)
        alert(`Error: ${err.response.data.message}`);
      } else {
        // 3. Error genérico
        alert('No se pudo eliminar el producto.');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando productos...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <Link
          to="/admin/productos/nuevo" // Ruta para el formulario de creación
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700"
        >
          + Crear Producto
        </Link>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productos.map((producto) => (
              <tr key={producto.producto_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.producto_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{producto.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${Number(producto.precio).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{producto.categoria?.nombre || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{producto.marca?.nombre || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/productos/editar/${producto.producto_id}`} // Ruta para editar
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(producto.producto_id)}
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