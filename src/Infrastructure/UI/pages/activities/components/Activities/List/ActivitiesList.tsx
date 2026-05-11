import { useEffect } from 'react'
import { Card, Divider, Text, Spinner } from '../../../../../components'
import { useDependencies } from '../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../Hooks/usePlocState'
import type { IActivitiesListState } from '../../../../../../../Domain/IStates'
import { ActivitiesListItem } from './ActivitiesListItem'
import { ActivityCreate } from '../Management/ActivityCreate'
import styles from './ActivitiesList.module.scss'

export const ActivitiesList: React.FC = () => {
  const { providerActivitiesListPloc, providerCategoriesListPloc } =
    useDependencies()
  const listState = usePlocState<IActivitiesListState>(
    providerActivitiesListPloc
  )
  const categoriesState = usePlocState(providerCategoriesListPloc)

  useEffect(() => {
    providerActivitiesListPloc.loadActivities()
  }, [providerActivitiesListPloc])

  return (
    <Card
      h={2}
      w={2}
      title='Actividades'
      className={styles.card}
    >
      <Divider spacing='none' />

      {listState.isLoading ? (
        <div className={styles.emptyState}>
          <Spinner size='lg' />
        </div>
      ) : listState.activities?.items &&
        listState.activities.items.length > 0 ? (
        <ul className={styles.list}>
          {listState.activities.items.map((activity) => {
            if (!activity.id || !activity.categoryId) return null

            const safeActivity = {
              id: activity.id,
              name: activity.name || null,
              categoryId: activity.categoryId,
              color: activity.color || null,
              allowOverlap: activity.allowOverlap || false,
            }

            const foundCategory = categoriesState.categories?.items?.find(
              (cat) => cat.id === activity.categoryId
            )
            const category = {
              id: foundCategory?.id || '',
              userId: foundCategory?.userId || '',
              name: foundCategory?.name || 'Sin categoría',
              color: foundCategory?.color || null,
            }

            return (
              <ActivitiesListItem
                key={activity.id}
                activity={safeActivity}
                category={category}
              />
            )
          })}
        </ul>
      ) : (
        <div className={styles.emptyState}>
          <Text color='secondary'>
            No hay actividades. Crea una nueva para comenzar.
          </Text>
        </div>
      )}

      {listState.errors && Object.keys(listState.errors).length > 0 && (
        <Text
          size='sm'
          className={styles.errorText}
        >
          {listState.errors?.[0] || 'Error al cargar actividades.'}
        </Text>
      )}
      <Divider spacing='none' />
      <div className={styles.footerActions}>
        <ActivityCreate />
      </div>
    </Card>
  )
}
