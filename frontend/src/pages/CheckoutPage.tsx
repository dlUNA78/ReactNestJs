import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const GUEST_ID_KEY = 'guest_client_id';

// 1. Interfaz de Carrito (Actualizada para incluir imágenes)
interface ICarritoItem {
  id_carrito_item: number;
  cantidad: number;
  variante: {
    id_variante: number;
    imagen_url: string | null; // <-- Imagen de la variante
    talla: {
      nombre_talla: string;
    };
    producto: {
      nombre: string;
      precio: number;
      imagen_principal_url: string | null; // <-- Imagen principal
    };
  };
}

// Interfaz para los datos del formulario (sin cambios)
interface IFormInput {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  calle: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  pais: string;
}

export const CheckoutPage = () => {
  const [items, setItems] = useState<ICarritoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const guestId = localStorage.getItem(GUEST_ID_KEY);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  // 1. Cargar los items del carrito (sin cambios en la lógica)
  useEffect(() => {
    if (!guestId) {
      setError('Sesión no encontrada. Refresca la página.');
      setLoading(false);
      return;
    }

    const fetchCarritoItems = async () => {
      try {
        // La API ya devuelve todos los datos anidados que necesitamos
        const response = await axios.get(
          `http://localhost:3000/carrito-items?clienteId=${guestId}`,
        );
        setItems(response.data);
        
        const total = response.data.reduce((sum: number, item: ICarritoItem) => {
          return sum + item.cantidad * Number(item.variante.producto.precio);
        }, 0);
        setTotalPrice(total);
        
      } catch (err) {
        setError(err + 'No se pudo cargar tu carrito.');
      } finally {
        setLoading(false);
      }
    };
    fetchCarritoItems();
  }, [guestId]);

  // 2. Función de "Transacción" (sin cambios en la lógica)
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (!guestId || items.length === 0) {
      setError('Tu carrito está vacío o tu sesión expiró.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);

    try {
      // (Paso 1: Actualizar cliente)
      await axios.patch(`http://localhost:3000/clientes/${guestId}`, {
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.telefono,
      });

      // (Paso 2: Crear dirección)
      const direccionResponse = await axios.post(
        'http://localhost:3000/direcciones',
        {
          calle: data.calle,
          ciudad: data.ciudad,
          estado: data.estado,
          codigo_postal: data.codigo_postal,
          pais: data.pais,
          cliente_id: Number(guestId),
        },
      );
      const direccionId = direccionResponse.data.id_direccion;

      // (Paso 3: Crear Orden)
      const ordenResponse = await axios.post('http://localhost:3000/ordenes', {
        cliente_id: Number(guestId),
        direccion_envio_id: direccionId,
        total: totalPrice,
        estado: 'Pagada',
      });
      const ordenId = ordenResponse.data.id_orden;

      // (Paso 4: Crear Detalles de Orden)
      const detallesPromises = items.map((item) =>
        axios.post('http://localhost:3000/detalles-orden', {
          orden_id: ordenId,
          variante_id: item.variante.id_variante,
          cantidad: item.cantidad,
          precio_unitario_snapshot: Number(item.variante.producto.precio),
        }),
      );
      await Promise.all(detallesPromises);

      // (Paso 5: Limpiar Carrito)
      const deletePromises = items.map((item) =>
        axios.delete(`http://localhost:3000/carrito-items/${item.id_carrito_item}`),
      );
      await Promise.all(deletePromises);

      // (Paso 6: Redirigir)
      navigate('/orden-exitosa');

    } catch (err) {
      console.error('Error durante el checkout:', err);
      setError('Ocurrió un error al procesar tu orden. Intenta de nuevo.');
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="container p-8 text-center">Cargando...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna de Formulario (sin cambios) */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* (Sección Cliente) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Información de Contacto</h2>
              {/* ... (inputs de nombre, apellido, email, telefono) ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input {...register('nombre', { required: true })} placeholder="Nombre" className="p-2 border rounded"/>
                <input {...register('apellido', { required: true })} placeholder="Apellido" className="p-2 border rounded"/>
                <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} placeholder="Email" type="email" className="p-2 border rounded md:col-span-2"/>
                <input {...register('telefono')} placeholder="Teléfono (Opcional)" className="p-2 border rounded md:col-span-2"/>
              </div>
            </div>

            {/* (Sección Dirección) */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Dirección de Envío</h2>
              {/* ... (inputs de calle, ciudad, estado, cp, pais) ... */}
              <input {...register('calle', { required: true })} placeholder="Calle y Número" className="p-2 border rounded w-full mb-4"/>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input {...register('ciudad', { required: true })} placeholder="Ciudad" className="p-2 border rounded"/>
                <input {...register('estado', { required: true })} placeholder="Estado/Provincia" className="p-2 border rounded"/>
                <input {...register('codigo_postal', { required: true })} placeholder="Código Postal" className="p-2 border rounded"/>
              </div>
              <input {...register('pais', { required: true })} placeholder="País" className="p-2 border rounded w-full mt-4"/>
            </div>

            {/* (Botón de Pagar) */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50"
            >
              {isProcessing ? 'Procesando...' : 'Simular Pago'}
            </button>
            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
          </form>
        </div>

        {/* Columna de Resumen (ACTUALIZADA) */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Resumen de la Orden</h2>
            
            {/* --- 3. IMÁGENES AÑADIDAS AQUÍ --- */}
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id_carrito_item} className="flex items-center gap-3 text-sm">
                  <img 
                    src={
                      item.variante.imagen_url ||
                      item.variante.producto.imagen_principal_url ||
                      'https://via.placeholder.com/50'
                    }
                    alt={item.variante.producto.nombre}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <span>{item.variante.producto.nombre} (x{item.cantidad})</span>
                  </div>
                  <span className="font-medium">
                    ${(item.cantidad * Number(item.variante.producto.precio)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            {/* ---------------------------------- */}
            
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};