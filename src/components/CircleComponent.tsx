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


    const [transformPosition, setTransformPosition] = useState({x: 0, y: 0});

    useEffect(() => {
        if (speed === null) return;
        const mouve = () => {
            const parent = (resolvedRef.current as any).parentElement;
            if (parent) {
                const parentWidth = parent.clientWidth;
                const parentHeight = parent.clientHeight;
                const elemWidth = 50;
                const elemHeight = 50;

                // delta limité pour lisser le mouvement
                const maxStep = 1000; // distance max à parcourir par mouvement
                let newX = transformPosition.x + (Math.random() * 2 - 1) * maxStep;
                let newY = transformPosition.y + (Math.random() * 2 - 1) * maxStep;

                // clamp pour ne pas sortir du parent
                newX = Math.min(parentWidth - elemWidth, Math.max(0, newX));
                newY = Math.min(parentHeight - elemHeight, Math.max(0, newY));

                setTransformPosition({x: newX, y: newY});
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
    }, [speed]);

    return (
        <svg
            ref={resolvedRef}
            style={{
                top: position.y * 100 + "%",
                left: position.x * 100 + "%",
                width,
                aspectRatio: 1,
                opacity: isVisible ? 1 : 0,
                transform: `translate(${transformPosition.x}px, ${transformPosition.y}px) translate(-50%, -50%)`,
                transformOrigin: "center",
                transition: `top 8s linear,
                     left 8s linear,
                     background 2s,
                     transform ${(speed ?? 5000) / 1000}s linear
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