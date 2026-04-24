import { Text, Card, Input, Button } from '../../../../components'

export const TaskFilterBar: React.FC = () => {
  return (
    <Card>
      <Text>busqueda de tareas</Text>
      <Input placeholder='Buscar tareas' />
      <Button variant='secondary'>Filtrar</Button>
    </Card>
  )
}
