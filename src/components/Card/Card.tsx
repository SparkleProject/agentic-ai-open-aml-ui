import React, { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  description, 
  className = '', 
  actions,
  glass = false
}) => {
  return (
    <div className={`${styles.card} ${glass ? 'glass' : ''} ${className}`}>
      {(title || description || actions) && (
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
