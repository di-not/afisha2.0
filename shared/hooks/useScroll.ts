import { useEffect, useState } from "react";

export default function useScroll(height: number) {
    const [isScrolledToTarget, setIsScrolledToTarget] = useState(false);

    useEffect(() => {
        // Проверяем, что мы в браузерной среде
        if (typeof window === "undefined") {
            return ;
        }

        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsScrolledToTarget(scrollY >= height);
        };

        // Добавляем обработчик сразу, чтобы обработать начальную позицию
        handleScroll();
        
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []); 
	
    return isScrolledToTarget;
}