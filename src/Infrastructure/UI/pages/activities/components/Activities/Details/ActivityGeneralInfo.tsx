import React, { useEffect } from 'react'
import { Card, Text } from '../../../../../components/atoms'
import { ActivityEdit } from '../Management/ActivityEdit'
import { ActivityDelete } from '../Management/ActivityDelete'
import { useDependencies } from '../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../Hooks/usePlocState'
import type {
  IActivityDetailState,
  ICategoriesListState,
} from '../../../../../../../Domain/IStates'
import styles from './ActivityGeneralInfo.module.css'

interface ActivityGeneralInfoProps {
  activityId: string
}

export const ActivityGeneralInfo: React.FC<ActivityGeneralInfoProps> = ({
  activityId,
}) => {
  const { providerActivityDetailPloc, providerCategoriesListPloc } =
    useDependencies()
  const activityState = usePlocState<IActivityDetailState>(
    providerActivityDetailPloc
  )
  const categoriesState = usePlocState<ICategoriesListState>(
    providerCategoriesListPloc
  )

  useEffect(() => {
    providerActivityDetailPloc.loadActivity(activityId)
    if (categoriesState.categories.length === 0) {
      providerCategoriesListPloc.loadCategories()
    }
  }, [
    activityId,
    providerActivityDetailPloc,
    providerCategoriesListPloc,
    categoriesState.categories.length,
  ])

  const { activity } = activityState
  if (!activity) return null

  const category = categoriesState.categories.find(
    (c) => c.id === activity.categoryId
  )
  const activityColor = activity.color || 'var(--color-text-primary)'
  const categoryColor = category?.color || 'var(--color-text-primary)'

  return (
    <Card
      title='InformaciÃ³n General'
      h={3}
      w={3}
    >
      <div className={styles.Container}>
        <div className={styles.header}>
          <div
            className={styles.colorStrip}
            style={{ backgroundColor: activityColor }}
          />
          <div className={styles.infoContent}>
            <Text
              weight='bold'
              size='lg'
            >
              Nombre:
            </Text>
            <Text
              weight='normal'
              size='lg'
            >
              {activity.name || 'Sin nombre'}
            </Text>
          </div>
        </div>
        <div className={styles.body}>
          <div
            className={styles.colorStrip}
            style={{ backgroundColor: categoryColor }}
          />
          <div className={styles.infoContent}>
            <Text
              weight='bold'
              size='lg'
            >
              CategorÃ­a:
            </Text>
            {category ? (
              <Text
                weight='normal'
                size='lg'
              >
                {category.name}
              </Text>
            ) : (
              <Text
                weight='normal'
                size='lg'
                color='var(--color-text-primary)'
              >
                CategorÃ­a no encontrada
              </Text>
            )}
          </div>
        </div>
        <div className={styles.body}>
          <div
            className={styles.colorStrip}
            style={{ backgroundColor: 'var(--color-text-secondary)' }}
          />
          <div className={styles.infoContent}>
            <Text
              weight='bold'
              size='lg'
            >
              Solapamiento:
            </Text>
            <Text
              weight='normal'
              size='lg'
            >
              {activity.allowOverlap ? 'SÃ­' : 'No'}
            </Text>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <ActivityEdit activityId={activity.id} />
        <ActivityDelete
          activityId={activity.id}
          activityName={activity.name || 'Sin nombre'}
        />
      </div>
    </Card>
  )
}

export default ActivityGeneralInfo
