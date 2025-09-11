'use client'
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

interface DanceStyle {
  id: string;
  name: string;
  description?: string;
}

export default function DancerProfilePage() {
  const { data: session, update } = useSession();
  const [danceStyles, setDanceStyles] = useState<DanceStyle[]>([]);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);

  const form = useForm({
    defaultValues: {
      mainStyle: session?.user?.mainDanceStyle?.id || '',
      additionalStyles: session?.user?.additionalStyles?.map(s => s.id) || [],
      about: session?.user?.about || '',
      worksAtSchool: false,
    }
  });

  useEffect(() => {
    loadDanceStyles();
  }, []);

  const loadDanceStyles = async () => {
    try {
      const response = await fetch('/api/dance-styles');
      if (response.ok) {
        const styles = await response.json();
        setDanceStyles(styles);
      }
    } catch (error) {
      console.error('Error loading dance styles:', error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      if (avatar) {
        formData.append('avatar', avatar);
      }
      
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          data[key].forEach((value: string) => {
            formData.append(key, value);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await fetch('/api/user/dancer-profile', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        await update();
        alert('Профиль танцора обновлен!');
      }
    } catch (error) {
      console.error('Error updating dancer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Настройки профиля танцора</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            

        {/* Основной стиль */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Основной стиль танца
          </label>
          <select
            {...form.register("mainStyle")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Выберите основной стиль</option>
            {danceStyles.map(style => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
          </select>
        </div>

        {/* Дополнительные стили */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Дополнительные стили танца
          </label>
          <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
            {danceStyles.map(style => (
              <label key={style.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...form.register("additionalStyles")}
                  value={style.id}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{style.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Город */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Город
          </label>
          <input
            {...form.register("city")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Москва"
          />
        </div>

        {/* О себе */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            О себе
          </label>
          <textarea
            {...form.register("about")}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Расскажите о себе, своем танцевальном опыте и достижениях..."
          />
        </div>

        {/* Работа в школе */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...form.register("worksAtSchool")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Работаю в школе танцев
            </span>
          </label>
        </div>

        {/* Кнопка сохранения */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </form>

      {/* Модалка для школы танцев */}
      {form.watch("worksAtSchool") && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Информация о школе</h3>
            <div className="space-y-3">
              <input
                placeholder="Название школы"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                placeholder="Город"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <select className="w-full p-2 border border-gray-300 rounded">
                <option value="">Выберите стиль</option>
                {danceStyles.map(style => (
                  <option key={style.id} value={style.id}>{style.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-gray-300 text-gray-700 py-2 rounded">
                Отмена
              </button>
              <button className="flex-1 bg-blue-500 text-white py-2 rounded">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}