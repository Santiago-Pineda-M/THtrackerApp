import styles from './MetricBlock.module.scss'
import { Text } from '../../atoms/Text/Text'
import { Badge } from '../../atoms/Badge/Badge'

interface MetricBlockProps {
  label: string
  value: string | number
  delta?: number
  trend?: 'up' | 'down' | 'neutral'
}

export const MetricBlock: React.FC<MetricBlockProps> = ({
  label,
  value,
  delta,
  trend = 'neutral',
}) => {
  return (
    <div className={styles.metric}>
      <Text
        size='xs'
        muted
      >
        {label}
      </Text>
      <Text
        size='xl'
        weight='bold'
      >
        {value}
      </Text>
      {delta !== undefined && <Badge data-trend={trend}>{delta}%</Badge>}
    </div>
  )
}

export default MetricBlock
