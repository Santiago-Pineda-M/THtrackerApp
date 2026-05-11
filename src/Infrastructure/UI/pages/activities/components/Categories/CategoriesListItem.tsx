import React from 'react'
import { Text } from '../../../../components'
import type { ApiCategoriesTypes } from '../../../../../../Domain'
import { CategoryEdit } from './CategoryEdit'
import { CategoryDelete } from './CategoryDelete'
import styles from './CategoriesListItem.module.scss'

type CategoryType = ApiCategoriesTypes['CategoryResponse']

interface CategoriesListItemProps {
  category: CategoryType
}

export const CategoriesListItem: React.FC<CategoriesListItemProps> = ({
  category,
}) => {
  if (!category.id) return null
  return (
    <li className={styles.item}>
      <div
        className={styles.colorBarContainer}
        style={{
          backgroundColor: category.color || 'var(--color-text-secondary)',
        }}
      ></div>
      <div className={styles.itemContent}>
        <Text>{category.name}</Text>
        <div className={styles.actions}>
          <CategoryEdit category={category} />
          <CategoryDelete category={category} />
        </div>
      </div>
    </li>
  )
}
