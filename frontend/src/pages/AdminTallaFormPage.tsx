import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// 1. Interfaz para el Formulario (nota el 'nombre_talla')
interface IFormInput {
  nombre_talla: string;
}

export const AdminTallaFormPage = () => {
  // 2. Setup
  const { id } = useParams<{ id: string }>();
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
      const loadTalla = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/tallas/${id}`,
          );
          reset(response.data); // Rellena el formulario
        } catch (err) {
          setError(err + 'Error al cargar la talla');
        } finally {
          setLoading(false);
        }
      };
      loadTalla();
    }
  }, [id, isEditMode, reset]);

  // 4. Función de envío
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError(null);
    try {
      if (isEditMode) {
        await axios.patch(`http://localhost:3000/tallas/${id}`, data);
      } else {
        await axios.post('http://localhost:3000/tallas', data);
      }
      navigate('/admin/tallas'); // Redirige a la lista
    } catch (err) {
      setError('Error al guardar la talla. ¿Nombre duplicado?');
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;

  // 5. Renderizado del Formulario
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? 'Editar Talla' : 'Crear Nueva Talla'}
      </h1>

      {error && (
        <p className="mb-4 rounded-md bg-red-100 p-4 text-red-600">{error}</p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg bg-white p-8 shadow-md"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de la Talla (ej. M, L, 42)</label>
          <input
            {...register('nombre_talla', { required: 'El nombre es requerido' })}
            className="mt-1 w-full rounded-md border p-2"
          />
          {errors.nombre_talla && <p className="mt-1 text-sm text-red-600">{errors.nombre_talla.message}</p>}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate('/admin/tallas')}
            className="mr-4 rounded-lg bg-gray-500 px-6 py-2 text-white shadow hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow hover:bg-blue-700"
          >
            {isEditMode ? 'Guardar Cambios' : 'Crear Talla'}
          </button>
        </div>
      </form>
    </div>
  );
};