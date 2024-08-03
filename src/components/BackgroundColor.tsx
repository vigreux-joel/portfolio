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


    const updateRandomPosition = () => {
        setTop(`${Math.random() * 100}%`,)
        setLeft(`${Math.random() * 100}%`)
    }


    useEffect(() => {
        if (isAngry) {
            // Enregistrer le temps de début
            const now = new Date();
            setStartTime(now);

            const timerId = setTimeout(() => {
                setIsAngry(false);
                setStartTime(null); // Réinitialiser le temps de début
            }, 2000);
        } else {
            updateRandomPosition()
        }
    }, [isAngry]);

    useEffect(() => {
        const updatePosition = () => {
            if (
                !isAngry
            ) {
                updateRandomPosition()
            }
        };

        setTimeout(() => updatePosition, 200)

        const interval = setInterval(updatePosition, 10_000);

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
        if (magnitude < circleRadius * 2 && (elapsedTimeInSeconds > 1 || !isAngry)) {
            const dirX = dx / magnitude;
            const dirY = dy / magnitude;


            const distX = dirX * circleRadius * 2.5;
            const distY = dirY * circleRadius * 2.5;


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
        transition={isAngry ? {duration: 2, ease: "easeOut"} : {duration: 10, ease: "linear"}}
        className="absolute"
        style={{top: top, left: left}}
    >
        <div
            style={{height: circleRadius * 2, width: circleRadius * 2}}
            className={classNames("absolute transition-all duration-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 ",
                {
                    "bg-primary-container": !isAngry && index % 3 !== 0,
                    "bg-primary-container/50": !isAngry && index % 3 === 0,
                    "bg-tertiary-container": isAngry
                }
            )}></div>

    </motion.div>
}


export const BackgroundColor: React.FC<{
    count?: number, radius?: number
}> = ({count = 10, radius = 175}) => {


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
                    <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur"/>
                    <feColorMatrix mode="matrix" in="blur" result="gooey"
                                   values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"/>
                    <feComposite in="SourceGraphic" operator="atop" in2="gooey"/>
                </filter>
            </svg>

            {/*<div className={""}>*/}
            <div className={"blur-[150px] h-full relative"}>
                <div
                    style={{filter: "url(#gooey)"}}
                    className="gooey-spheres w-full h-full absolute">
                    {circles.map((pos, i) => (
                            <CircleComponent key={i} index={i} circleRadius={radius} mouse={mouse}/>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};