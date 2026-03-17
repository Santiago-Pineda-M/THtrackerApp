import React, { useState } from 'react';
import Card from '../../../atoms/Card/Card';
import { Input } from '../../../atoms/Input/Input';
import { ToggleSwitch } from '../../../atoms/ToggleSwitch/ToggleSwitch';
import { Form } from '../../../molecules/Form/Form';
import s from './InputsControlsExample.module.css';

export const InputsControlsExample: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [notificationsOn, setNotificationsOn] = useState(true);

  return (
    <Card title="Inputs & Controls" w={1} h={3}>
      <div className={s.root}>
        <Form label="Nombre" required helper="Este es un ejemplo de campo con helper.">
          <Input placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </Form>

        <Form label="Estado" error="Ejemplo de mensaje de error.">
          <Input placeholder="Con error" state="error" />
        </Form>

        <Form label="Éxito" helper="Estado success">
          <Input placeholder="Correcto" state="success" />
        </Form>

        <ToggleSwitch label="Notificaciones" checked={notificationsOn} onChange={setNotificationsOn} />
        <ToggleSwitch label="Modo solo lectura" checked={false} onChange={() => { }} disabled />
      </div>
    </Card>
  );
};

