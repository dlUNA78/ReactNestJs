import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// 1. Interfaz para el Formulario
interface IFormInput {
  nombre: string;
  descripcion: string;
  imagen_principal_url_file?: FileList;
}

export const AdminCategoriaFormPage = () => {
  // 2. Setup
  const { id } = useParams<{ id: string }>(); // Obtiene el ID de la URL
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [categoria, setCategoria] = useState<{ imagen_principal_url?: string } | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file) return null;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    } catch (err) {
      console.error('Error al subir el archivo:', err);
      setError('Error al subir la imagen.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // 3. Cargar datos si estamos editando
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const loadCategoria = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/categorias/${id}`,
          );
          setCategoria(response.data);
          reset(response.data); // Rellena el formulario
        } catch (err) {
          setError('Error al cargar la categoría');
        } finally {
          setLoading(false);
        }
      };
      loadCategoria();
    }
  }, [id, isEditMode, reset]);

  // 4. Función de envío
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError(null);
    setIsUploading(true);
    try {
      let imageUrl = categoria?.imagen_principal_url || null;

      if (data.imagen_principal_url_file && data.imagen_principal_url_file.length > 0) {
        imageUrl = await uploadFile(data.imagen_principal_url_file[0]);
        if (!imageUrl) return;
      }

      const processedData = {
        ...data,
        imagen_principal_url: imageUrl,
      };
      delete (processedData as any).imagen_principal_url_file;

      if (isEditMode) {
        await axios.patch(`http://localhost:3000/categorias/${id}`, processedData);
      } else {
        await axios.post('http://localhost:3000/categorias', processedData);
      }
      navigate('/admin/categorias'); // Redirige a la lista
    } catch (err) {
      setError('Error al guardar la categoría. ¿Nombre duplicado?');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  // 5. Renderizado del Formulario
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? 'Editar Categoría' : 'Crear Nueva Categoría'}
      </h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-100 p-4 text-red-600">{error}</p>
      )}
      {isUploading && <p className="text-blue-600 bg-blue-100 p-4 rounded-md mb-6">Subiendo imagen...</p>}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg bg-white p-8 shadow-md"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            {...register('nombre', { required: 'El nombre es requerido' })}
            className="mt-1 w-full rounded-md border p-2"
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            {...register('descripcion')}
            rows={4}
            className="mt-1 w-full rounded-md border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Imagen Principal</label>
          <input
            type="file"
            {...register('imagen_principal_url_file')}
            className="mt-1 p-2 w-full border rounded-md text-sm"
          />
          {isEditMode && categoria?.imagen_principal_url && (
            <img src={categoria.imagen_principal_url} alt="Imagen principal" className="mt-4 w-32 h-32 object-cover rounded-md" />
          )}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate('/admin/categorias')}
            disabled={isUploading}
            className="mr-4 rounded-lg bg-gray-500 px-6 py-2 text-white shadow hover:bg-gray-600 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Categoría')}
          </button>
        </div>
      </form>
    </div>
  );
};