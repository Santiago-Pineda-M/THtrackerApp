import React from 'react'
import { Text } from '../../../../components'
import type { ICategory } from '../../../../../../Domain'
import { CategoryEdit } from './CategoryEdit'
import { CategoryDelete } from './CategoryDelete'
import styles from './CategoriesListItem.module.css'

interface CategoriesListItemProps {
  category: ICategory
}

export const CategoriesListItem: React.FC<CategoriesListItemProps> = ({
  category,
}) => {
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
