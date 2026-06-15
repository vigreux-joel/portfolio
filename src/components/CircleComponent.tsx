import {type FC, useEffect, useRef, useState} from "react";
import {v4 as uuidv4} from 'uuid';


export const CircleComponent: FC<{
    width: string;
    color: string;
    position: {
        x: number; y: number
    }
    className?: string
    speed?: number | null;
    isVisible?: boolean;
    ref?: any
}> = ({width, color, position, isVisible = true, speed = 5_000, className, ref: defaultRef, ...restProps}) => {


    const [uuid, setUuid] = useState(uuidv4())

    const [delta, setDelta] = useState(Math.random() * (0.25 * 2) - 0.25);


    const resolvedRef = defaultRef ?? useRef(null);


    const [currentPos, setCurrentPos] = useState<{x: number | string, y: number | string}>({
        x: position.x * 100 + "%",
        y: position.y * 100 + "%"
    });

    useEffect(() => {
        if (speed === null) return;
        const mouve = () => {
            const parent = (resolvedRef.current as any).parentElement;
            if (parent) {
                const parentWidth = parent.clientWidth;
                const parentHeight = parent.clientHeight;
                const elemWidth = 50;
                const elemHeight = 50;

                // position actuelle en pixels
                const currentX = typeof currentPos.x === "string" ? parentWidth * position.x : currentPos.x;
                const currentY = typeof currentPos.y === "string" ? parentHeight * position.y : currentPos.y;

                // delta limité pour lisser le mouvement
                const maxStep = 1000; // distance max à parcourir par mouvement
                
                // On calcule la nouvelle position absolue souhaitée
                let absoluteX = currentX + (Math.random() * 2 - 1) * maxStep;
                let absoluteY = currentY + (Math.random() * 2 - 1) * maxStep;

                // clamp pour ne pas sortir du parent
                absoluteX = Math.min(parentWidth - elemWidth / 2, Math.max(elemWidth / 2, absoluteX));
                absoluteY = Math.min(parentHeight - elemHeight / 2, Math.max(elemHeight / 2, absoluteY));

                // on met à jour la position top/left directement
                setCurrentPos({
                    x: absoluteX, 
                    y: absoluteY
                });
            }
        };

        const initialDelay = Math.random() * speed;

        const timeout = setTimeout(() => {
            mouve(); // premier mouvement décalé

            const interval = setInterval(() => {
                mouve();
            }, speed); // ensuite, bouge toutes les 5s

            // cleanup
            return () => clearInterval(interval);
        }, initialDelay);
    }, [speed, position, currentPos]);

    return (
        <svg
            ref={resolvedRef}
            style={{
                top: typeof currentPos.y === 'number' ? `${currentPos.y}px` : currentPos.y,
                left: typeof currentPos.x === 'number' ? `${currentPos.x}px` : currentPos.x,
                width,
                aspectRatio: 1,
                opacity: isVisible ? 1 : 0,
                // Utilisation de la propriété CSS "translate" moderne (indépendante de "transform")
                // pour le centrage, ce qui permet à top/left de gérer tout le déplacement.
                translate: "-50% -50%",
                transformOrigin: "center",
                willChange: "top, left",
                transition: `top ${(speed ?? 5000) / 1000}s linear,
                     left ${(speed ?? 5000) / 1000}s linear,
                     background 2s
                     `,
            }}
            className={"absolute mix-blend-hue h-auto transition-all duration-2000 " + className}
            xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"
            {...restProps}

        >
            <defs>
                <radialGradient id={"grad-" + uuid} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop
                        offset="0%"
                        style={{
                            stopColor: color,
                            stopOpacity: 1,
                            transition: "1s"
                        }}
                    />

                    <stop
                        offset="100%"
                        style={{
                            stopColor: `var(--color-surface)`,
                            stopOpacity: 0
                        }}
                    />
                </radialGradient>
            </defs>
            <circle cx="128" cy="128" r="128" fill={`url(#${"grad-" + uuid})`}/>
        </svg>

    );
};