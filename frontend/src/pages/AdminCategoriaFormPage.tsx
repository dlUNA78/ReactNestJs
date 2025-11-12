import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// 1. Interfaz para el Formulario
interface IFormInput {
  nombre: string;
  descripcion: string;
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

  // 3. Cargar datos si estamos editando
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const loadCategoria = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/categorias/${id}`,
          );
          reset(response.data); // Rellena el formulario
        } catch (err) {
          setError(err + 'Error al cargar la categoría');
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
    try {
      if (isEditMode) {
        await axios.patch(`http://localhost:3000/categorias/${id}`, data);
      } else {
        await axios.post('http://localhost:3000/categorias', data);
      }
      navigate('/admin/categorias'); // Redirige a la lista
    } catch (err) {
      setError(err + 'Error al guardar la categoría. ¿Nombre duplicado?');
      console.error(err);
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

        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate('/admin/categorias')}
            className="mr-4 rounded-lg bg-gray-500 px-6 py-2 text-white shadow hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow hover:bg-blue-700"
          >
            {isEditMode ? 'Guardar Cambios' : 'Crear Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
};