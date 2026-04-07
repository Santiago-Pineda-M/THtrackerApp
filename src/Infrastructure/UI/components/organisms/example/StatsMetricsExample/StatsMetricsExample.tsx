import React from 'react'
import Card from '../../../atoms/Card/Card'
import { Text } from '../../../atoms/Text/Text'
import { StatCard } from '../../../molecules/StatCard/StatCard'
import { MetricBlock } from '../../../molecules/MetricBlock/MetricBlock'
import s from './StatsMetricsExample.module.css'

export const StatsMetricsExample: React.FC = () => (
  <Card
    title='Estadísticas y Métricas'
    w={2}
    h={4}
  >
    <div className={s.container}>
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <Text
            as='h3'
            size='md'
            weight='bold'
          >
            Tarjetas de Estadísticas (StatCard)
          </Text>
          <Text
            size='sm'
            muted
          >
            Componente ideal para mostrar KPIs principales con icono y tendencia
            comparativa.
          </Text>
        </div>
        <div className={s.grid}>
          <StatCard
            label='Ingresos totales'
            value='$124,500'
            trend={12.5}
            trendLabel='vs mes pasado'
            icon='DollarSign'
          />
          <StatCard
            label='Usuarios activos'
            value='8,234'
            trend={-2.4}
            trendLabel='vs semana pasada'
            icon='Users'
          />
        </div>
      </div>

      <div className={s.divider} />

      <div className={s.section}>
        <div className={s.sectionHeader}>
          <Text
            as='h3'
            size='md'
            weight='bold'
          >
            Bloques de Métricas (MetricBlock)
          </Text>
          <Text
            size='sm'
            muted
          >
            Componente compacto para métricas secundarias o de detalle, utiliza
            un Badge para la variación.
          </Text>
        </div>
        <div className={s.gridCompact}>
          <MetricBlock
            label='Retención 30d'
            value='87%'
            delta={4.2}
            trend='up'
          />
          <MetricBlock
            label='Churn'
            value='3.1%'
            delta={1.1}
            trend='down'
          />
          <MetricBlock
            label='Usuarios Nuevos'
            value='1,200'
            delta={0}
            trend='neutral'
          />
          <MetricBlock
            label='Tasa de rebote'
            value='45%'
            delta={-2.5}
            trend='down'
          />
        </div>
      </div>
    </div>
  </Card>
)
