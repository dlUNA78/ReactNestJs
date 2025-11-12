import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

// 1. Interfaz para los datos que esperamos de la API
interface IAdminOrden {
  id_orden: number;
  fecha_orden: string;
  total: number;
  estado: string;
  cliente: {
    // Asumimos que la API devuelve el cliente anidado
    nombre: string;
    email: string;
  };
}

// Opciones de estado que puede tener una orden
const ESTADOS_ORDEN = ['Pendiente', 'Pagada', 'Enviada', 'Cancelada'];

export const AdminOrdersPage = () => {
  const [ordenes, setOrdenes] = useState<IAdminOrden[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Función para cargar las órdenes
  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      setError(null);
      // Tu API de 'ordenes' ya incluye al 'cliente'
      const response = await axios.get('http://localhost:3000/ordenes');
      // Ordenamos por fecha, las más nuevas primero
      const sortedOrdenes = response.data.sort(
        (a: IAdminOrden, b: IAdminOrden) =>
          new Date(b.fecha_orden).getTime() - new Date(a.fecha_orden).getTime(),
      );
      setOrdenes(sortedOrdenes);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError('No se pudieron cargar las órdenes.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Cargar órdenes al montar la página
  useEffect(() => {
    fetchOrdenes();
  }, []);

  // 4. Función para "Simular" el cambio de estado
  const handleUpdateStatus = async (
    orderId: number,
    nuevoEstado: string,
  ) => {
    try {
      // Llamamos al endpoint PATCH que ya creamos en el backend
      await axios.patch(`http://localhost:3000/ordenes/${orderId}`, {
        estado: nuevoEstado,
      });
      // Recargamos la lista para ver el cambio
      fetchOrdenes();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar el estado de la orden.');
    }
  };

  // 5. Función para Eliminar Orden
  const handleDelete = async (id: number) => {
    if (!window.confirm(
      '¿ELIMINAR ORDEN? Esto borrará permanentemente la orden y sus detalles. Esta acción no se puede deshacer.'
    )) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:3000/ordenes/${id}`);
      fetchOrdenes(); // Recarga la lista
    } catch (err) {
      console.error('Error al eliminar orden:', err);
      if (err instanceof AxiosError && err.response) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert('No se pudo eliminar la orden.');
      }
    }
  };

  // 6. Renderizado
  if (loading) {
    return <div className="p-8 text-center">Cargando órdenes...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestión de Órdenes</h1>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Orden</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordenes.map((orden) => (
              <tr key={orden.id_orden}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{orden.id_orden}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(orden.fecha_orden).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {orden.cliente?.nombre || 'N/A'} ({orden.cliente?.email || 'N/A'})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  ${Number(orden.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                  {/* Colorea el estado */}
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      orden.estado === 'Pagada' ? 'bg-green-100 text-green-800' :
                      orden.estado === 'Enviada' ? 'bg-blue-100 text-blue-800' :
                      orden.estado === 'Cancelada' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800' // Pendiente
                    }`}
                  >
                    {orden.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* Dropdown para cambiar el estado */}
                  <select
                    value={orden.estado}
                    onChange={(e) => handleUpdateStatus(orden.id_orden, e.target.value)}
                    className="p-1 border rounded-md bg-white text-sm mr-4"
                  >
                    {ESTADOS_ORDEN.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                  
                  {/* Botón de Eliminar Orden */}
                  <button
                    onClick={() => handleDelete(orden.id_orden)}
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