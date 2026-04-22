import React, { useEffect } from 'react'
import { Card, Spinner, Text, Badge } from '../../../../components/atoms'
import {
  ValueDefinitionCreateForm,
  ValueDefinitionEditForm,
  ValueDefinitionDelete,
} from './'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import type { IActivityValueDefinitionsState } from '../../../../../../Domain/IStates'
import styles from './ActivityProperties.module.css'

interface ActivityPropertiesProps {
  activityId: string
}

export const ActivityProperties: React.FC<ActivityPropertiesProps> = ({
  activityId,
}) => {
  const { providerActivityValueDefinitionsListPloc } = useDependencies()
  const state = usePlocState<IActivityValueDefinitionsState>(
    providerActivityValueDefinitionsListPloc
  )

  useEffect(() => {
    providerActivityValueDefinitionsListPloc.loadDefinitions(activityId)
  }, [activityId, providerActivityValueDefinitionsListPloc])

  return (
    <Card
      title='Propiedades'
      h={2}
      w={2}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <ValueDefinitionCreateForm activityId={activityId} />
        </div>
        {state.isLoading ? (
          <Spinner size='sm' />
        ) : state.definitions.length > 0 ? (
          <ul className={styles.list}>
            {state.definitions.map((def) => (
              <li
                key={def.id}
                className={styles.item}
              >
                <div className={styles.info}>
                  <Text
                    weight='medium'
                    size='sm'
                  >
                    {def.name || 'Sin nombre'}
                  </Text>
                  <Text
                    size='xs'
                    color='secondary'
                  >
                    {def.valueType}
                  </Text>
                </div>
                <div className={styles.actions}>
                  {def.isRequired && (
                    <Badge variant='default'>Obligatorio</Badge>
                  )}
                  <div className={styles.buttons}>
                    <ValueDefinitionEditForm
                      activityId={activityId}
                      definitionId={def.id}
                    />
                    <ValueDefinitionDelete
                      activityId={activityId}
                      definitionId={def.id}
                      definitionName={def.name || 'Propiedad'}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Text
            size='sm'
            color='secondary'
          >
            No hay propiedades definidas.
          </Text>
        )}
      </div>
    </Card>
  )
}

export default ActivityProperties
