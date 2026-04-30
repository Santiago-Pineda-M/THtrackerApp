import React, { useEffect } from 'react'
import { Card, Divider } from '../../../../components'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { ICategoriesListState } from '../../../../../../Domain'
import { CategoriesListItem } from './CategoriesListItem'
import { CategoryCreate } from './CategoryCreate'
import styles from './CategoriesList.module.scss'

export const CategoriesList: React.FC = () => {
  const { providerCategoriesListPloc } = useDependencies()
  const categoriesListState = usePlocState<ICategoriesListState>(
    providerCategoriesListPloc
  )

  useEffect(() => {
    providerCategoriesListPloc.loadCategories()
  }, [categoriesListState.categories.length, providerCategoriesListPloc])

  return (
    <Card
      h={2}
      w={2}
      title='Categorías'
      className={styles.card}
    >
      <Divider spacing='none' />
      <ul className={styles.list}>
        {categoriesListState.categories.map((category) => (
          <CategoriesListItem
            key={category.id}
            category={category}
          />
        ))}
      </ul>
      <Divider spacing='none' />
      <div className={styles.footerActions}>
        <CategoryCreate />
      </div>
    </Card>
  )
}
