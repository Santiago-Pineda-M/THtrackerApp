import React from "react"
import styles from './Card.module.css';


export interface CardProps {
    w?: number
    h?: number
    gridTopRight?: boolean
    title?: string
    children?: React.ReactNode
    className?: string
}

const Card = ({
    w = 1,
    h = 1,
    gridTopRight = false,
    title,
    children,
    className = "",
}: CardProps) => {
    const isTopRight = gridTopRight;
    return (
        <div
            className={`${styles.card} ${isTopRight ? styles.gridTopRight : ""} ${className}`}
            style={
                {
                    "--w": w,
                    "--h": h
                } as React.CSSProperties
            }
        >
            {title && <h2 className={styles.cardHeader}>{title}</h2>}
            {children}
        </div>
    )
}

export default Card