"use client";
import { useEffect } from "react";
import { useState, useMemo } from "react";
import { DanceStyle } from "@prisma/client";

interface StyleSelectorProps {
  styles: DanceStyle[];
  selectedStyles: string[];
  onSelect: (styleId: string) => void;
  onRemove: (styleId: string) => void;
  placeholder?: string;
  multiple?: boolean;
}

export function StyleSelector({
  styles,
  selectedStyles,
  onSelect,
  onRemove,
  placeholder = "Выберите стиль",
  multiple = false,
}: StyleSelectorProps) {
  const [localStyles, setLocalStyles] = useState<DanceStyle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredStyles = useMemo(() => {
    return styles.filter((style) => style.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [styles, searchTerm]);

  const handleSelect = (styleId: string) => {
    if (multiple) {
      if (selectedStyles.includes(styleId)) {
        onRemove(styleId);
      } else {
        onSelect(styleId);
      }
    } else {
      onSelect(styleId);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const getSelectedStyleName = () => {
    if (!multiple && selectedStyles[0]) {
      return styles.find((s) => s.id === selectedStyles[0])?.name || "";
    }
    return "";
  };
  useEffect(() => {
    const searchStyles = async () => {
      try {
        const response = await fetch(`/api/dance-styles/search?search=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setLocalStyles(data);
        }
      } catch (error) {
        console.error("Error searching styles:", error);
      }
    };

    if (searchTerm) {
      searchStyles();
    } else {
      setLocalStyles(styles);
    }
  }, [searchTerm, styles]);
  return (
    <div className="relative">
      {multiple ? (
        // Множественный выбор
        <div className="border border-gray-300 rounded-lg p-2 min-h-12">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedStyles.map((styleId) => {
              const style = styles.find((s) => s.id === styleId);
              return (
                <div
                  key={styleId}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {style?.name}
                  <button type="button" onClick={() => onRemove(styleId)} className="text-blue-600 hover:text-blue-800">
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full p-2 border-none outline-none bg-transparent"
          />
        </div>
      ) : (
        // Одиночный выбор
        <div className="border border-gray-300 rounded-lg p-3">
          <input
            type="text"
            placeholder={getSelectedStyleName() || placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full outline-none bg-transparent"
          />
        </div>
      )}

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
          {filteredStyles.length === 0 ? (
            <div className="p-3 text-gray-500 text-sm">Стили не найдены</div>
          ) : (
            filteredStyles.map((style) => (
              <div
                key={style.id}
                className={`p-3 cursor-pointer hover:bg-gray-100 ${
                  selectedStyles.includes(style.id) ? "bg-blue-50" : ""
                }`}
                onClick={() => handleSelect(style.id)}
              >
                {style.name}
                {style.description && <div className="text-sm text-gray-600">{style.description}</div>}
              </div>
            ))
          )}
        </div>
      )}

      {/* Закрытие при клике вне компонента */}
      {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
