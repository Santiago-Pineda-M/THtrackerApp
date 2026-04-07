import React, { useState } from 'react'
import Card from '../../../atoms/Card/Card'
import { Input } from '../../../atoms/Input/Input'
import { ToggleSwitch } from '../../../atoms/ToggleSwitch/ToggleSwitch'
import FormField from '../../../molecules/Form/FormField'
import s from './InputsControlsExample.module.css'

export const InputsControlsExample: React.FC = () => {
  const [nombre, setNombre] = useState('')
  const [notificationsOn, setNotificationsOn] = useState(true)

  return (
    <Card
      title='Inputs & Controls'
      w={2}
      h={2}
    >
      <div className={s.root}>
        <FormField
          label='Nombre'
          required
          helper='Este es un ejemplo de campo con helper.'
        >
          <Input
            name='nombre'
            placeholder='Tu nombre'
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </FormField>

        <FormField
          label='Estado'
          error='Ejemplo de mensaje de error.'
        >
          <Input
            name='estado'
            placeholder='Con error'
          />
        </FormField>

        <FormField
          label='Éxito'
          helper='Estado success'
        >
          <Input
            name='success'
            placeholder='Correcto'
            state='success' // ✅ permitido porque NO hay error
          />
        </FormField>

        <div className={s.controls}>
          <ToggleSwitch
            label='Notificaciones'
            checked={notificationsOn}
            onChange={setNotificationsOn}
          />

          <ToggleSwitch
            label='Modo solo lectura'
            checked={false}
            onChange={() => undefined}
            disabled
          />
        </div>
      </div>
    </Card>
  )
}

export default InputsControlsExample
