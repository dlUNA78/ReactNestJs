import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// --- Interfaces (sin cambios) ---
interface ICategoria { id_categoria: number; nombre: string; }
interface IMarca { id_marca: number; nombre: string; }
interface ITalla { id_talla: number; nombre_talla: string; }
interface IVariante {
  id_variante: number;
  sku: string;
  stock_disponible: number;
  talla: ITalla;
  imagen_url?: string; // <-- Campo de imagen de la variante
}
interface IProductoCompleto {
  producto_id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  categoria: ICategoria;
  marca: IMarca;
  variantes: IVariante[];
  imagen_principal_url?: string; // <-- Nuevo campo de imagen principal
}

// --- Interfaces de Formularios (actualizadas) ---
interface IFormInput {
  nombre: string;
  descripcion?: string;
  precio: number;
  id_categoria_fk: number;
  id_marca_fk: number;
  // NUEVO: 'FileList' es el tipo que devuelve un input type="file"
  imagen_principal_url_file?: FileList; 
}
interface INuevaVarianteInput {
  id_talla_fk: number;
  sku: string;
  stock_disponible: number;
  // NUEVO: Campo para el archivo de la variante
  imagen_url_file?: FileList; 
}

export const AdminProductFormPage = () => {
  // --- Setup (sin cambios) ---
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const { 
    register: registerVariant, 
    handleSubmit: handleSubmitVariant, 
    reset: resetVariantForm 
  } = useForm<INuevaVarianteInput>();

  const [producto, setProducto] = useState<IProductoCompleto | null>(null);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [marcas, setMarcas] = useState<IMarca[]>([]);
  const [tallas, setTallas] = useState<ITalla[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Estado de carga

  // --- Función de Carga de Datos (sin cambios) ---
  const loadData = async () => {
    // ... (El código de 'loadData' que ya tenías es correcto)
    // ... (Carga categorías, marcas, tallas y el producto si 'isEditMode')
    try {
      setLoading(true);
      setError(null);
      const [catRes, marcaRes, tallaRes] = await Promise.all([
        axios.get('http://localhost:3000/categorias'),
        axios.get('http://localhost:3000/marcas'),
        axios.get('http://localhost:3000/tallas'),
      ]);
      setCategorias(catRes.data);
      setMarcas(marcaRes.data);
      setTallas(tallaRes.data);

      if (isEditMode) {
        const prodRes = await axios.get(`http://localhost:3000/productos/${id}`);
        setProducto(prodRes.data);
        const productData = {
          ...prodRes.data,
          precio: Number(prodRes.data.precio),
          id_categoria_fk: prodRes.data.categoria?.id_categoria,
          id_marca_fk: prodRes.data.marca?.id_marca,
        };
        reset(productData);
      }
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, [id, isEditMode, reset]);
  
  // --- NUEVA FUNCIÓN: Helper para Subir Archivos ---
  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file) return null;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file); // 'file' debe coincidir con tu FileInterceptor

    try {
      const response = await axios.post('http://localhost:3000/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url; // Devuelve la URL de la imagen
    } catch (err) {
      console.error('Error al subir el archivo:', err);
      setError('Error al subir la imagen.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };


  // --- FUNCIÓN onSubmit (Producto Base) ACTUALIZADA ---
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      setIsUploading(true);
      setError(null);
      
      let imageUrl = producto?.imagen_principal_url || null; // Mantiene la imagen existente por defecto

      // 1. Revisa si se subió un archivo nuevo
      if (data.imagen_principal_url_file && data.imagen_principal_url_file.length > 0) {
        imageUrl = await uploadFile(data.imagen_principal_url_file[0]);
        if (!imageUrl) return; // Detiene si la subida falló
      }
      
      const processedData = {
        ...data,
        precio_base: Number(data.precio),
        id_categoria_fk: Number(data.id_categoria_fk),
        id_marca_fk: Number(data.id_marca_fk),
        imagen_principal_url: imageUrl, // <-- Añade la URL al DTO
      };
      // Limpia el campo del archivo que no es parte del DTO
      delete (processedData as any).imagen_principal_url_file; 

      if (isEditMode) {
        await axios.patch(`http://localhost:3000/productos/${id}`, processedData);
        alert('Producto base guardado');
        loadData(); // Recarga
      } else {
        const response = await axios.post('http://localhost:3000/productos', processedData);
        alert('Producto creado. Ahora puedes añadir variantes.');
        navigate(`/admin/productos/editar/${response.data.producto_id}`);
      }
      
    } catch (err) {
      setError('Error al guardar el producto');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };
  
  // --- FUNCIÓN onAddVariant (Variantes) ACTUALIZADA ---
  const onAddVariant: SubmitHandler<INuevaVarianteInput> = async (data) => {
    try {
      setIsUploading(true);
      setError(null);
      let imageUrl = null;

      // 1. Revisa si se subió un archivo para la variante
      if (data.imagen_url_file && data.imagen_url_file.length > 0) {
        imageUrl = await uploadFile(data.imagen_url_file[0]);
        if (!imageUrl) return; // Detiene si la subida falló
      }

      const variantData = {
        stock_disponible: Number(data.stock_disponible),
        id_talla_fk: Number(data.id_talla_fk),
        sku: data.sku,
        producto_id: Number(id),
        imagen_url: imageUrl, // <-- Añade la URL de la variante
      };

      await axios.post('http://localhost:3000/variantes-producto', variantData);
      loadData(); // Recarga todo
      resetVariantForm(); // Limpia el formulario
    } catch (err) {
      alert('Error al añadir variante. ¿SKU duplicado?');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteVariant = async (idVariante: number) => {
    // ... (Sin cambios)
    if (!window.confirm('¿Eliminar esta variante?')) return;
    try {
      await axios.delete(`http://localhost:3000/variantes-producto/${idVariante}`);
      loadData();
    } catch (err) {
      alert('Error al eliminar variante.');
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  // --- Renderizado del Formulario (CON CAMPOS DE IMAGEN) ---
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? 'Editar Producto' : 'Crear Nuevo Producto'}
      </h1>
      
      {error && <p className="text-red-600 bg-red-100 p-4 rounded-md mb-6">{error}</p>}
      {isUploading && <p className="text-blue-600 bg-blue-100 p-4 rounded-md mb-6">Subiendo imagen...</p>}

      {/* --- FORMULARIO PRINCIPAL (PRODUCTO BASE) --- */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        {/* ... (Nombre, Descripción, Precio, Stock, Categoría, Marca) ... */}
        {/* (Campos existentes sin cambios) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
          <input {...register('nombre', { required: true })} className="mt-1 p-2 w-full border rounded-md"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea {...register('descripcion')} rows={4} className="mt-1 p-2 w-full border rounded-md"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input {...register('precio', { required: true, valueAsNumber: true })} type="number" step="0.01" className="mt-1 p-2 w-full border rounded-md"/>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select {...register('id_categoria_fk', { required: true, valueAsNumber: true })} className="mt-1 p-2 w-full border rounded-md bg-white">
              <option value="">-- Selecciona --</option>
              {categorias.map((cat) => ( <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option> ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Marca</label>
            <select {...register('id_marca_fk', { required: true, valueAsNumber: true })} className="mt-1 p-2 w-full border rounded-md bg-white">
              <option value="">-- Selecciona --</option>
              {marcas.map((marca) => ( <option key={marca.id_marca} value={marca.id_marca}>{marca.nombre}</option> ))}
            </select>
          </div>
        </div>

        {/* --- NUEVO CAMPO: IMAGEN PRINCIPAL --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Imagen Principal</label>
          <input 
            type="file"
            {...register('imagen_principal_url_file')}
            className="mt-1 p-2 w-full border rounded-md text-sm"
          />
          {/* Muestra la imagen actual si estamos editando */}
          {isEditMode && producto?.imagen_principal_url && (
            <img src={producto.imagen_principal_url} alt="Imagen principal" className="mt-4 w-32 h-32 object-cover rounded-md" />
          )}
        </div>
        
        <div className="text-right">
          <button type="button" onClick={() => navigate('/admin/productos')} disabled={isUploading} className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-600 mr-4 disabled:opacity-50">
            {isEditMode ? 'Volver' : 'Cancelar'}
          </button>
          <button type="submit" disabled={isUploading} className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50">
            {isUploading ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear y Continuar')}
          </button>
        </div>
      </form>

      {/* --- SECCIÓN DE GESTIÓN DE VARIANTES (Solo en Modo Edición) --- */}
      {isEditMode && (
        <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Gestionar Variantes (Tallas y Stock)</h2>
          
          {/* Tabla de Variantes Existentes (Actualizada para mostrar imagen) */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 mb-6">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Talla</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {producto?.variantes.map((v) => (
                  <tr key={v.id_variante}>
                    <td className="px-4 py-2">
                      <img 
                        src={v.imagen_url || producto.imagen_principal_url || 'https://via.placeholder.com/50'} 
                        alt={v.talla.nombre_talla} 
                        className="w-12 h-12 object-cover rounded-md" 
                      />
                    </td>
                    <td className="px-4 py-2 text-sm">{v.talla.nombre_talla}</td>
                    <td className="px-4 py-2 text-sm">{v.sku}</td>
                    <td className="px-4 py-2 text-sm">{v.stock_disponible}</td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => handleDeleteVariant(v.id_variante)} className="text-red-600 hover:text-red-900 text-sm">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formulario para Añadir Nueva Variante (Actualizado con imagen) */}
          <form onSubmit={handleSubmitVariant(onAddVariant)} className="grid grid-cols-1 md:grid-cols-5 gap-4 border-t pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Talla</label>
              <select {...registerVariant('id_talla_fk', { required: true, valueAsNumber: true })} className="mt-1 p-2 w-full border rounded-md bg-white">
                <option value="">-- Sel. --</option>
                {tallas.map((t) => ( <option key={t.id_talla} value={t.id_talla}>{t.nombre_talla}</option> ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input {...registerVariant('sku', { required: true })} className="mt-1 p-2 w-full border rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input {...registerVariant('stock_disponible', { required: true, valueAsNumber: true })} type="number" className="mt-1 p-2 w-full border rounded-md"/>
            </div>
            {/* NUEVO CAMPO: IMAGEN DE VARIANTE */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Imagen (Opcional)</label>
              <input 
                type="file"
                {...registerVariant('imagen_url_file')}
                className="mt-1 p-2 w-full border rounded-md text-sm"
              />
            </div>
            <div className="self-end">
              <button type="submit" disabled={isUploading} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 disabled:opacity-50">
                {isUploading ? '...' : '+ Añadir'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};