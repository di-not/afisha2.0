import { ActiveTab } from "@/pages/event-page";
import { IconChevronDown } from "@/shared/icons/chevron-down";
import { useEffect, useRef, useState } from "react";

export default function DescriptionBlock({ description, activeTab }: { description: string; activeTab: ActiveTab }) {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [shouldShowToggle, setShouldShowToggle] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  // Проверяем, нужно ли показывать кнопку сворачивания
  useEffect(() => {
    if (descriptionRef.current && description) {
      const contentHeight = descriptionRef.current.scrollHeight;
      setShouldShowToggle(contentHeight > 100);
    }
  }, [description, activeTab]);
  return (
    <div className="relative">      
      <div
        ref={descriptionRef}
        className={`prose max-w-none overflow-hidden transition-all duration-300 ${
          !isDescriptionExpanded && shouldShowToggle ? "max-h-25" : "max-h-none"
        }`}
      >
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>

      {/* Градиентное затемнение в свернутом состоянии */}
      {!isDescriptionExpanded && shouldShowToggle && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}

      {/* Кнопка разворачивания/сворачивания */}
      {shouldShowToggle && (
        <div className="flex justify-center ">
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="flex items-center gap-2 z-100 text-[var(--primary)] transition-colors font-medium"
          >
            {isDescriptionExpanded ? (
              <>
                <IconChevronDown className={`size-5 ${isDescriptionExpanded ? "rotate-180" : ""}`} />
                Свернуть описание
              </>
            ) : (
              <>
                <IconChevronDown className={`size-5`} />
                Развернуть описание
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
