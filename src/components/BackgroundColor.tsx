import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import useMouse, {type MousePosition} from "@react-hook/mouse-position";
import classNames from "classnames";


export const CircleComponent: React.FC<{
    circleRadius: number,
    mouse: MousePosition,
    index: number
}> = ({circleRadius, mouse, index}) => {
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


    useEffect(() => {
        if (isAngry) {
            const now = new Date();
            setStartTime(now);

            const timerId = setTimeout(() => {
                setIsAngry(false);
                setStartTime(null);
            }, 3000);
        } else {
            updateRandomPosition()
        }
    }, [isAngry]);

    useEffect(() => {
        const checkIsVisible = () => {
            const maskInverses = document.querySelectorAll(".mask-inverse")
            const el = ref.current as unknown as HTMLElement
            const blur = 1.1
            const rect1 = {
                top: el.getBoundingClientRect().top - circleRadius * blur,
                right: el.getBoundingClientRect().left + circleRadius * blur,
                bottom: el.getBoundingClientRect().top + circleRadius * blur,
                left: el.getBoundingClientRect().left - circleRadius * blur
            };
            let visible = true
            for (const maskInverse of maskInverses) {
                const rect2 = maskInverse.getBoundingClientRect();
                const overlap = !(rect1.right < rect2.left ||
                    rect1.left > rect2.right ||
                    rect1.bottom < rect2.top ||
                    rect1.top > rect2.bottom)
                if (overlap) {
                    visible = false
                    break;
                }
            }
            setIsVisible(visible)

        };

        checkIsVisible()

        const interval = setInterval(checkIsVisible, 300);

        return () => {
            clearInterval(interval);
        };
    }, []);


    useEffect(() => {
        const updatePosition = () => {
            if (
                !isAngry
            ) {
                updateRandomPosition()
            }
        };

        setTimeout(() => updatePosition, 200)

        const interval = setInterval(updatePosition, 8_000);

        return () => {
            clearInterval(interval);
        };
    }, []);


    useEffect(() => {

        const rect = (ref.current as unknown as HTMLElement).getBoundingClientRect();
        const dy = rect.top - mouse.clientY;
        const dx = rect.left - mouse.clientX;
        const magnitude = Math.sqrt(dx * dx + dy * dy);

        const elapsedTimeInSeconds = startTime ? ((new Date().getTime() - startTime.getTime()) / 1000) : 0;
        if (magnitude < circleRadius * 1.5 && (elapsedTimeInSeconds > 1 || !isAngry) && isVisible) {
            const dirX = dx / magnitude;
            const dirY = dy / magnitude;


            const distX = dirX * circleRadius * 2;
            const distY = dirY * circleRadius * 2;


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
    }, [mouse]);


    return <motion.div
        ref={ref}
        key={index}
        layout={"position"}
        transition={isAngry ? {duration: 3, ease: "easeInOut"} : {duration: 8, ease: "easeInOut"}
        }
        className="absolute mix-blend-hard-light"
        style={{
            top: top, left: left,
        }}
    >
        <div
            style={{
                background: `radial-gradient(circle at center,rgb(var(--colors-${
                    classNames({
                        "primary-container)/0.9": !isAngry,
                        "tertiary-container)/0.9": isAngry
                    })
                }) 0,rgb(var(--colors-primary-container)/0) 50%) no-repeat`,
                height: isVisible ? circleRadius * 2 : 0, width: isVisible ? circleRadius * 2 : 0,
                transition: ".3s, height 2s, width 2s"
            }}
            className={classNames("absolute mix-blend-hard-light rounded-full transform -translate-y-1/2 -translate-x-1/2 ",
            )}></div>

    </motion.div>
}


export const BackgroundColor: React.FC<{
    count?: number, radius?: number
}> = ({count = 5, radius = 400}) => {


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
        <div className={"h-full w-full -z-10 absolute"}>
            <svg style={{visibility: "hidden", position: "absolute"}} width="0" height="0"
                 xmlns="http://www.w3.org/2000/svg">
                <filter id="gooey">
                    <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation="10"
                        result="blur"
                    />
                    <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                        result="goo"
                    />
                    <feBlend in="SourceGraphic" in2="goo"/>
                </filter>
            </svg>
            <div
                style={{filter: "url(#gooey) blur(40px)"}}
                className="gooey-spheres w-full h-full absolute">
                {circles.map((pos, i) => (
                        <CircleComponent key={i} index={i} circleRadius={radius} mouse={mouse}/>
                    )
                )}
            </div>
        </div>
    );
};