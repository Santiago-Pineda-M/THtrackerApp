import { useEffect } from 'react'
import { Card, Divider, Text, Spinner } from '../../../../../components'
import { useDependencies } from '../../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../../Hooks/usePlocState'
import type { IActivitiesListState } from '../../../../../../../Domain/IStates'
import { ActivitiesListItem } from './ActivitiesListItem'
import { ActivityCreate } from '../Management/ActivityCreate'
import styles from './ActivitiesList.module.css'

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

      {listState.isLoading && listState.activities.length === 0 ? (
        <div className={styles.emptyState}>
          <Spinner size='lg' />
        </div>
      ) : listState.activities.length > 0 ? (
        <ul className={styles.list}>
          {listState.activities.map((activity) => (
            <ActivitiesListItem
              key={activity.id}
              activity={activity}
              category={
                categoriesState.categories.find(
                  (cat) => cat.id === activity.categoryId
                ) || {
                  userId: '',
                  id: '',
                  name: 'Sin categoría',
                  color: null,
                }
              }
            />
          ))}
        </ul>
      ) : (
        <div className={styles.emptyState}>
          <Text color='secondary'>
            No hay actividades. Crea una nueva para comenzar.
          </Text>
        </div>
      )}

      {listState.error && (
        <Text
          size='sm'
          className={styles.errorText}
        >
          {listState.error.title || 'Error al cargar actividades.'}
        </Text>
      )}
      <Divider spacing='none' />
      <div className={styles.footerActions}>
        <ActivityCreate />
      </div>
    </Card>
  )
}
