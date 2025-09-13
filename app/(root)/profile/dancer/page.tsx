"use client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { StyleSelector } from "@/shared/components/ui/style-selector";

interface DanceStyle {
  id: string;
  name: string;
  description?: string;
}

interface DancerProfileFormData {
  mainStyle: string;
  additionalStyles: string[];
  about: string;
}

export default function DancerProfilePage() {
  const { data: session, update } = useSession();
  const [danceStyles, setDanceStyles] = useState<DanceStyle[]>([]);
  const [loading, setLoading] = useState(false);
  const [mainStyleSearch, setMainStyleSearch] = useState("");
  const [additionalStylesSearch, setAdditionalStylesSearch] = useState("");

  const form = useForm<DancerProfileFormData>({
    defaultValues: {
      mainStyle: "",
      additionalStyles: [],
      about: "",
    },
  });

  useEffect(() => {
    loadDanceStyles();
  }, []);

  // Обновляем форму при изменении сессии
  useEffect(() => {
    if (session?.user) {
      form.setValue("mainStyle", session.user.mainDanceStyle?.id || "");
      form.setValue("additionalStyles", session.user.additionalStyles?.map((s: any) => s.id) || []);
      form.setValue("about", session.user.about || "");
    }
  }, [session, form]);

  const loadDanceStyles = async () => {
    try {
      const response = await fetch("/api/dance-styles");
      if (response.ok) {
        const styles = await response.json();
        setDanceStyles(styles);
      }
    } catch (error) {
      console.error("Error loading dance styles:", error);
    }
  };

  const handleMainStyleSelect = (styleId: string) => {
    form.setValue("mainStyle", styleId);
  };

  const handleAdditionalStyleSelect = (styleId: string) => {
    const currentStyles = form.getValues("additionalStyles");
    if (!currentStyles.includes(styleId)) {
      form.setValue("additionalStyles", [...currentStyles, styleId]);
    }
  };

  const handleAdditionalStyleRemove = (styleId: string) => {
    const currentStyles = form.getValues("additionalStyles");
    form.setValue(
      "additionalStyles",
      currentStyles.filter((id) => id !== styleId)
    );
  };

  const onSubmit = async (data: DancerProfileFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("mainStyle", data.mainStyle);
      data.additionalStyles.forEach((styleId: string) => {
        formData.append("additionalStyles", styleId);
      });
      formData.append("about", data.about);

      const response = await fetch("/api/user/dancer-profile", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        // Обновляем сессию после успешного сохранения
        await update();
        alert("Профиль танцора обновлен!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Ошибка обновления профиля");
      }
    } catch (error) {
      console.error("Error updating dancer profile:", error);
      alert("Ошибка обновления профиля танцора");
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
          <label className="block text-sm font-medium text-gray-700 mb-3">Основной стиль танца *</label>
          <StyleSelector
            styles={danceStyles}
            selectedStyles={form.watch("mainStyle") ? [form.watch("mainStyle")] : []}
            onSelect={handleMainStyleSelect}
            onRemove={() => form.setValue("mainStyle", "")}
            placeholder="Поиск основного стиля..."
            multiple={false}
          />
          {form.watch("mainStyle") && (
            <p className="text-sm text-green-600 mt-2">
              Выбран: {danceStyles.find((s) => s.id === form.watch("mainStyle"))?.name}
            </p>
          )}
        </div>

        {/* Дополнительные стили */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Дополнительные стили танца</label>
          <StyleSelector
            styles={danceStyles}
            selectedStyles={form.watch("additionalStyles")}
            onSelect={handleAdditionalStyleSelect}
            onRemove={handleAdditionalStyleRemove}
            placeholder="Поиск дополнительных стилей..."
            multiple={true}
          />
          <p className="text-sm text-gray-500 mt-2">Выберите один или несколько дополнительных стилей</p>
          {form.watch("additionalStyles").length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-green-600">Выбраны:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {form.watch("additionalStyles").map((styleId) => {
                  const style = danceStyles.find((s) => s.id === styleId);
                  return (
                    <span key={styleId} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {style?.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* О себе */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">О себе</label>
          <textarea
            value={form.watch("about")}
            onChange={(e) => form.setValue("about", e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Расскажите о себе, своем танцевальном опыте и достижениях..."
          />
          <p className="text-sm text-gray-500 mt-2">{form.watch("about").length}/500 символов</p>
        </div>

        {/* Кнопка сохранения */}
        <button
          type="submit"
          disabled={loading}
          className="bgButton p-3 font-semibold px-5 mx-auto"
        >
          {loading ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </form>
    </div>
  );
}
