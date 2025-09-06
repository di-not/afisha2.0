import React, { useLayoutEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
export const cn = (...args: Parameters<typeof twMerge>) => {
  return twMerge(...args.filter(Boolean));
};


type Props<T> = {
  value?: T;
  tabs: { content: React.ReactNode; value: T; icon?: React.ReactNode }[];
  onChangeTab?: (value: T) => void;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const Tabs = <T,>({ tabs = [], value, onChangeTab, ...props }: Props<T>) => {
  const slidingRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(tabs.findIndex(tab => tab.value === value));
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];

    if (activeTabElement && slidingRef.current) {
      slidingRef.current.style.width = `${activeTabElement.offsetWidth}px`;
      slidingRef.current.style.transform = `translateX(${activeTabElement.offsetLeft}px)`;
    }
  }, [activeTab]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    onChangeTab?.(tabs[index].value);
  };

  useLayoutEffect(() => {
    const index = tabs.findIndex(tab => tab.value === value);
    if (value && index !== activeTab) {
      setActiveTab(index);
    }
  }, [value, tabs]);

  return (
    <div {...props} className={cn("relative w-full mx-auto", props.className)}>
      <div className="flex justify-between relative bg-[var(--Color-Grays-SystemGray4)]  border rounded-[10px]">
        {tabs.map((tab, index) => (
          <button
            type="button"
            key={index}
            ref={el => {
              if (!el) return;
              tabRefs.current[index] = el;
            }}
            className={cn(
              `flex-1 p-2 text-center z-10 text-sm transition-colors flex items-center gap-1 text-[var(--Color-Text-Secondary)] justify-center`,
              tab.value === value && "text-black"
            )}
            onClick={() => {
              handleTabClick(index);
            }}
          >
            {tab.icon ?? tab.icon}
            <p className={`text-nowrap ${activeTab === index ? "" : "max-md:hidden"}`}>{tab.content}</p>
          </button>
        ))}
      </div>

      <div
        ref={slidingRef}
        className="absolute top-px bottom-px left-px bg-white rounded-[10px] transition-all duration-300 ease-out"
      />
    </div>
  );
};

export { Tabs };
