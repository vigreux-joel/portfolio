import React, {useEffect, useMemo, useRef, useState} from "react";
import {CircleComponent} from "@components/CircleComponent.tsx";
import {useStore} from "@nanostores/react";
import {themeStore} from "@/stores/themeStore.ts";


const getColorHex = (colorSource: number[]): string => {
    return `#${Math.round(colorSource[0]).toString(16).padStart(2, '0')}${Math.round(colorSource[1]).toString(16).padStart(2, '0')}${Math.round(colorSource[2]).toString(16).padStart(2, '0')}`;
};

function hexToRgb(hex) {
    // Supprimer le # si présent
    hex = hex.replace(/^#/, '');

    // Cas des hex courts (#fff → #ffffff)
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    // Convertir en valeurs R, G, B
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
}

function getCSSVariableColor(variableName: string): [number, number, number] {
    const style = getComputedStyle(document.documentElement); // Récupère les styles de `:root`
    const color = style.getPropertyValue('--color-' + variableName).trim(); // Récupère la valeur de la variable

    // Convertir la couleur CSS hexadécimale (par ex. #ff6347) en [r, g, b]
    const rgbMatch = hexToRgb(color)

    if (rgbMatch) {
        return rgbMatch
    }
    console.warn(`La variable CSS '${variableName}' contient une valeur non valide : '${color}'`);
    return [1, 1, 1]; // Retourne blanc par défaut en cas d'erreur
}


export const BackgroundColor = ({count = 10, size = "75%", className, speed}: {
    count?: number,
    size?: string,
    className?: string
    speed?: number
}) => {
    const $theme = useStore(themeStore)


    // const mouse = useMouse(document.querySelector("body")!, {
    //     fps: 10,
    //     enterDelay: 100,
    //     leaveDelay: 100,
    // })

    const [colorSurface, setColorSurface] = useState<[x: number, y: number, z: number]>([18, 19, 24]);
    useEffect(() => {
        setColorSurface(getCSSVariableColor('surface'))
    }, [])


    // Génération des données pour les positions, couleurs et tailles
    const {positions} = useMemo(() => {
        const numPoints = count; // Nombre total de points
        const positions: { x: number, y: number }[] = [] // x, y, z pour chaque point


        for (let i = 0; i < numPoints; i++) {
            // Position aléatoire dans l'espace 3D (-5 à 5 pour chaque coordonnée)
            const x = (Math.random());
            const y = (Math.random());


            positions[i] = {
                x, y
            };


            // Couleur en utilisant la variable CSS 'primary' convertie en valeur hexadécimale

// Usage:
            // Couleur aléatoire

            // Taille aléatoire (0.1 à 1.0)
        }

        return {positions};
    }, []);

    const [colors, setColors] = useState<string[] | null>()

    useEffect(() => {
        const numPoints = count; // Nombre total de points
        const colors: string[] = []


        for (let i = 0; i < numPoints; i++) {
            colors[i] = i % 3 === 0 ? 'var(--color-tertiary-container)' : 'var(--color-primary-container)';
        }


        setColors(colors)
    }, [$theme]);


    const updatedPositions = useRef(positions);
    const [animatedPositions, setAnimatedPositions] = useState<{ x: number, y: number }[]>(positions);

    return (

        <div className={className + " pointer-events-none"}>

            {Array.from({length: count}, (_, i) => {
                return (
                    <CircleComponent
                        speed={speed}
                        width={size}
                        key={i} // Une clé unique pour chaque élément
                        position={positions[i]} color={colors ? colors[i] : "#000000"}
                    />
                )
            })}
        </div>
    );

};

interface BackgroundColorProps {
    count?: number;
    circleRadius?: number;
    className?: string;
}
