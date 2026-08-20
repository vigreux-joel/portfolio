import {type RefObject, useEffect, useState} from 'react';

export function useIsPowered(ref: RefObject<HTMLElement | null>) {
    const [isPowered, setIsPowered] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsPowered(entry.isIntersecting);
        }, {
            // Déclenchement exactement aux 2/3 de l'écran
            // Reste vrai pour tout ce qui est au-dessus
            rootMargin: '10000px 0px -33.3% 0px'
        });

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, [ref]);

    return isPowered;
}
