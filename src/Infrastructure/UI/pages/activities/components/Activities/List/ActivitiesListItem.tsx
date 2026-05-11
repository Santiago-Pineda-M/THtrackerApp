import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Text, Icon } from '../../../../../components'
import styles from './ActivitiesListItem.module.scss'

type ActivityType = {
  id: string
  name: string | null
  categoryId: string
  color: string | null
  allowOverlap: boolean
}

type CategoryType = {
  id: string
  userId: string
  name: string | null
  color: string | null
}

interface ActivitiesListItemProps {
  activity: ActivityType
  category: CategoryType
}

export const ActivitiesListItem: React.FC<ActivitiesListItemProps> = ({
  activity,
  category,
}) => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(`/activities/${activity.id}`)
  }

  return (
    <li
      className={styles.item}
      onClick={handleNavigate}
    >
      <div className={styles.colorBarContainer}>
        <div
          style={{
            backgroundColor: category.color ?? 'var(--color-text-secondary)',
          }}
        />
        <div
          style={{
            backgroundColor: activity.color || 'var(--color-text-secondary)',
          }}
        />
      </div>
      <div className={styles.itemContent}>
        <div className={styles.nameContainer}>
          <Text
            weight='medium'
            size='md'
          >
            {activity.name || 'Sin nombre'}
          </Text>
          <Text
            weight='normal'
            size='xs'
            muted
          >
            ( {category.name} )
          </Text>
        </div>
        <Icon
          name='ChevronRight'
          size={20}
        />
      </div>
    </li>
  )
}
