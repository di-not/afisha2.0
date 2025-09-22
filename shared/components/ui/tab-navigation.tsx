import { ActiveTab } from "@/pages/event-page";
import React, { useLayoutEffect, useRef,} from "react";

export default function TabNavigation({
  tabs,
  setActiveTab,
  activeTab,
}: {
  setActiveTab: (activeTab: ActiveTab) => void;
  activeTab: ActiveTab;
  tabs: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
  }[];
}) {
  const slidingRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];

    if (activeTabElement && slidingRef.current) {
      slidingRef.current.style.width = `${activeTabElement.offsetWidth}px`;
      slidingRef.current.style.transform = `translateX(${activeTabElement.offsetLeft}px)`;
    }
  }, [activeTab]);

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
  };
  const setTabRef = (index: number) => (el: HTMLButtonElement | null) => {
    tabRefs.current[index] = el;
  };
  return (
    <nav className="">
      <div className="relative">
        <div className="flex relative bg-gray-200 rounded-full py-3 px-1 justify-between max-md:overflow-x-scroll shadow-gray-700 medium-inset-shadow ">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={setTabRef(index)}
              onClick={() => handleTabClick(tab.id)}
              className={`
                relative
                py-2
                px-4
                font-medium
                text-sm
                transition-colors
                duration-300
                ease-in-out
                rounded-xl
                z-10
                m-0!
                flex
                items-center
                justify-center
                whitespace-nowrap
                flex-col
                
              `}
            >
              {<span className={`m-auto z-10 ${activeTab === tab.id ? "text-white" : "text-black"}`}>{tab.icon}</span>}
              <span className={`z-10 m-auto max-[1150px]:hidden flex ${activeTab === tab.id ? "text-white" : "text-black"}`}>{tab.label}</span>
            </button>
          ))}

          {/* Скользящий индикатор с градиентом */}
          <div
            ref={slidingRef}
            className="absolute right-0 left-0 top-1 bottom-1 rounded-full transition-all duration-300 ease-out shadow-sm"
          >
            <div
              className="
              w-full
              h-full
              bg-gradient-to-br
              from-[#12aaff]
              to-[#0080f7]
              rounded-full
            "
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
