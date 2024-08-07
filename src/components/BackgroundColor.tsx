import React, {useEffect, useRef, useState} from 'react';
import useMouse, {type MousePosition} from "@react-hook/mouse-position";
import classNames from "classnames";


export const CircleComponent: React.FC<{
    circleRadius: number,
    mouse: MousePosition,
    index: number
    canEscape?: boolean
}> = ({circleRadius, mouse, index, canEscape = true}) => {
    const [isMd, setIsMd] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const initialIsLg = window.innerWidth > 768;
            setIsMd(initialIsLg);
            const handleResize = () => {
                setIsMd(window.innerWidth > 768);
            }
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            }
        }
    }, []);

    const diameter = circleRadius * 2;

    const [delta, setDelta] = useState(Math.random() * (0.25 * 2) - 0.25);

    const diameterDelta = diameter * delta
    const height = diameter + diameterDelta
    const width = diameter - diameterDelta;


    const ref = React.useRef(null);
    const [isAngry, setIsAngry] = useState(false);
    const [top, setTop] = useState<string>(`${Math.random() * 100}%`);
    const [left, setLeft] = useState<string>(`${Math.random() * 100}%`);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [isVisible, setIsVisible] = useState(true)


    const updateRandomPosition = () => {
        setTop(`${Math.random() * 100}%`,)
        setLeft(`${Math.random() * 100}%`)
    }

    const firstUpdate = useRef(true);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        if (!isMd) return
        if (isAngry) {
            const now = new Date();
            setStartTime(now);

            const timerId = setTimeout(() => {
                setIsAngry(false);
                setStartTime(null);
            }, 1000);
        } else {
            updateRandomPosition()
        }
    }, [isAngry]);

    useEffect(() => {
        const checkIsVisible = () => {
            const maskInverses = document.querySelectorAll(".mask-inverse")
            const el = ref.current as unknown as HTMLElement
            const rect1 = el.getBoundingClientRect()
            const centerX = (rect1.left + rect1.right) / 2;
            const centerY = (rect1.top + rect1.bottom) / 2;
            let visible = true
            const blur = 0.7
            for (const maskInverse of maskInverses) {
                const rect2 = maskInverse.getBoundingClientRect();
                const overlap = !(
                    centerX + width / 2 * blur < rect2.left ||
                    centerX - width / 2 * blur > rect2.right ||
                    centerY + height / 2 * blur < rect2.top ||
                    centerY - height / 2 * blur > rect2.bottom
                )
                if (overlap) {
                    visible = false
                    break;
                }
            }
            setIsVisible(visible)
        };

        checkIsVisible()

        if (!isMd) {
            return;
        }
        const interval = setInterval(checkIsVisible, 300);

        return () => {
            clearInterval(interval);
        };
    }, [isMd]);


    useEffect(() => {
        if (!isMd) {
            return;
        }
        const updatePosition = () => {
            if (
                !isAngry
            ) {
                updateRandomPosition()
            }
        };

        setTimeout(() => updatePosition(), 200)

        const interval = setInterval(updatePosition, 8_000);

        return () => {
            clearInterval(interval);
        };
    }, [isMd]);


    useEffect(() => {
        if (!canEscape || !isMd) {
            return
        }
        const elapsedTimeInSeconds = startTime ? ((new Date().getTime() - startTime.getTime()) / 1000) : 0;
        if ((elapsedTimeInSeconds < 0.75 && isAngry) || !isVisible) {
            return
        }

        const rect = (ref.current as unknown as HTMLElement).getBoundingClientRect();
        const dy = rect.top + rect.height / 2 - mouse.clientY;
        const dx = rect.left + rect.width / 2 - mouse.clientX;
        const magnitude = Math.sqrt(dx * dx + dy * dy);


        if (magnitude < circleRadius * 0.5) {
            const dirX = dx / magnitude;
            const dirY = dy / magnitude;


            const distX = dirX * circleRadius * 1.5;
            const distY = dirY * circleRadius * 1.5;


            const newTopPixels = rect.top + distY;
            const newLeftPixels = rect.left + distX;

            const newTop = (newTopPixels / window.innerHeight) * 100;
            const newLeft = (newLeftPixels / window.innerWidth) * 100;

            if (newTop >= 0 && newTop <= 100 && newLeft >= 0 && newLeft <= 100) {
                setTop(`${newTop}%`);
                setLeft(`${newLeft}%`);
            } else {
                updateRandomPosition()
            }
            setIsAngry(true)
        }
    }, [mouse, isMd]);


    return <div
        ref={ref}
        key={index}
        style={
            {
                top: top, left: left, background: `radial-gradient(rgb(var(--colors-${
                    classNames({
                        "primary-container)/0.9": index % 2 !== 0,
                        "tertiary-container)/0.6": index % 2 === 0,
                    })
                }) 0,rgb(var(--colors-surface)/0) 50%) no-repeat`,
                height: isVisible && !isAngry ? height : 0,
                width: isVisible && !isAngry ? width : 0,
                transition: `top ${isAngry ? 1 : 8}s ${isAngry ? "ease-out" : "linear"},
                     left ${isAngry ? 1 : 8}s ${isAngry ? "ease-out" : "linear"},
                     background 2s,
                     height 1s,
                     width 1s`,
            }
        }
        className="absolute transition-all duration-2000 mix-blend-hue transform -translate-y-1/2 -translate-x-1/2"
    >
    </div>
}


export const BackgroundColor: React.FC<{
    count?: number, radius?: number, className?: string, canEscape?: boolean
}> = ({count = 20, radius = 600, className, canEscape}) => {


    const isClient = typeof window === 'object';

    const mouse = isClient ? useMouse(document.querySelector('body'), {
        fps: 4,
        enterDelay: 100,
        leaveDelay: 100,
    }) : null;


    const [circles, setCircles] = useState(
        Array.from({length: count}, () => {
            const ref = React.createRef();
            return {
                ref: ref,
                top: `${Math.random() * 100}vh`,
                left: `${Math.random() * 100}vw`,
                isAngry: false
            }
        })
    );


    return (
        <div className={"h-full w-full -z-10 absolute " + className}>
            <div
                style={{filter: "blur(40px)"}}
                className="gooey-spheres w-full h-full absolute">
                {circles.map((pos, i) => (
                        <CircleComponent key={i} index={i} circleRadius={radius} mouse={mouse} canEscape={canEscape}/>
                    )
                )}
            </div>
        </div>
    );
};