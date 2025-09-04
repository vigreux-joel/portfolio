import {type FC, useRef, useState} from "react";
import {v4 as uuidv4} from 'uuid';

export const CircleComponent: FC<{
    width: string;
    color: string;
    position: {
        x: number; y: number
    }
    isVisible?: boolean;
}> = ({width, color, position, isVisible = true}) => {

    const [uuid, setUuid] = useState(uuidv4())

    const [delta, setDelta] = useState(Math.random() * (0.25 * 2) - 0.25);


    const ref = useRef(null);


    return (
        <svg
            ref={ref}
            style={{
                top: position.x + "%",
                left: position.y + "%",
                width,
                aspectRatio: 1,
                opacity: isVisible ? 1 : 0,
                transition: `top 8s linear,
                     left 8s linear,
                     background 2s,
                     `,
            }}
            className="absolute h-auto transition-all duration-2000 mix-blend-hue transform -translate-y-1/2 -translate-x-1/2"
            xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
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
            <circle cx="128" cy="128" r="128" fill={`url(#${"grad-" + uuid})`}/>
        </svg>

    );
};