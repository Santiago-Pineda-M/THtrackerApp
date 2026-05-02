import type { FC } from 'react'
import { LayoutDashboard, Timer, CloudSync, ShieldCheck } from 'lucide-react'
import styles from './AuthInfo.module.scss'

export const AuthInfo: FC = () => {
  return (
    <div className={styles.infoContainer}>
      <div className={styles.glowDecoration} />
      
      <div className={styles.brand}>
        THtracker
      </div>

      <h1 className={styles.title}>
        Domina tu <span>productividad</span>
      </h1>
      
      <p className={styles.description}>
        La plataforma definitiva para gestionar tus tareas, hacer seguimiento de tu tiempo y mantener el control total de tus proyectos con una experiencia premium.
      </p>

      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIconWrapper}>
            <LayoutDashboard size={24} />
          </div>
          <div className={styles.featureText}>
            <span className={styles.featureTitle}>Gestión Inteligente</span>
            <span className={styles.featureDesc}>
              Organiza tus tareas diarias con interfaces intuitivas y un flujo de trabajo optimizado para la máxima eficiencia.
            </span>
          </div>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIconWrapper}>
            <Timer size={24} />
          </div>
          <div className={styles.featureText}>
            <span className={styles.featureTitle}>Seguimiento de Tiempo</span>
            <span className={styles.featureDesc}>
              Registra cada minuto invertido en tus actividades y obtén reportes detallados de tu rendimiento.
            </span>
          </div>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIconWrapper}>
            <CloudSync size={24} />
          </div>
          <div className={styles.featureText}>
            <span className={styles.featureTitle}>Sincronización Total</span>
            <span className={styles.featureDesc}>
              Accede a tus datos desde cualquier dispositivo. Tu información siempre actualizada y disponible cuando la necesites.
            </span>
          </div>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIconWrapper}>
            <ShieldCheck size={24} />
          </div>
          <div className={styles.featureText}>
            <span className={styles.featureTitle}>Privacidad y Seguridad</span>
            <span className={styles.featureDesc}>
              Diseñado con arquitectura limpia y los más altos estándares para proteger tu información personal.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthInfo
