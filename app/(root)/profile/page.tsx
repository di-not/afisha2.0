"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ProfileFormData {
  phone: string;
  email: string;
  city: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(
    session?.user?.avatar || "https://i.pinimg.com/736x/82/40/7e/82407e8e0aaa33e0c7ec1c450c0d28a1.jpg"
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const form = useForm<ProfileFormData>({
    defaultValues: {
      phone: session?.user?.phone || "",
      email: session?.user?.email || "",
      city: session?.user?.city || "",
    },
  });

  // Обновляем форму при изменении сессии
  useEffect(() => {
    if (session?.user) {
      form.reset({
        phone: session.user.phone || "",
        email: session.user.email || "",
        city: session.user.city || "",
      });
      setAvatarPreview(
        session.user.avatar || "https://i.pinimg.com/736x/82/40/7e/82407e8e0aaa33e0c7ec1c450c0d28a1.jpg"
      );
    }
  }, [session, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      // Создаем превью для отображения
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatar) return null;

    try {
      const formData = new FormData();
      formData.append("avatar", avatar);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.avatarUrl;
      }
      return null;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return null;
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await uploadAvatar();
      }

      const updateData = {
        ...data,
        ...(avatarUrl && { avatar: avatarUrl }),
      };

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await update();
        setAvatar(null);
        alert("Данные успешно обновлены!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Ошибка обновления данных");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Ошибка обновления данных");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      alert("Новые пароли не совпадают");
      return;
    }

    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        setShowPasswordModal(false);
        alert("Пароль успешно изменен!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Ошибка смены пароля");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Ошибка смены пароля");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Личная информация</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Аватар и основная информация */}
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative size-32! flex-1/2">
              <img
                src={avatarPreview}
                alt="Аватар"
                className="size-32! rounded-full object-cover border-4 border-white shadow-lg"
              />
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                📷
              </label>
              {avatar && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  new
                </span>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{session?.user?.fullName}</h2>
              <p className="text-gray-600">{session?.user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                {session?.user?.role === "ORGANIZER" ? "Организатор" : "Танцор"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Безопасность</h3>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Сменить пароль
            </button>
          </div>
        </div>

        {/* Форма редактирования */}
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
              <input
                {...form.register("phone")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+7 (999) 999-99-99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                {...form.register("email")}
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Город</label>
              <input
                {...form.register("city")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Москва"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </form>
        </div>
      </div>

      {/* Модалка смены пароля */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Смена пароля</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Текущий пароль</label>
                <input
                  name="currentPassword"
                  type="password"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Новый пароль</label>
                <input
                  name="newPassword"
                  type="password"
                  required
                  minLength={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Подтвердите новый пароль</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg"
                >
                  Отмена
                </button>
                <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}