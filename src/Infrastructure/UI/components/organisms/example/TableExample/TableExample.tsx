import React from 'react'
import Card from '../../../atoms/Card/Card'
import { Table } from '../../../molecules/Table/Table'

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'role', label: 'Rol' },
  { key: 'status', label: 'Estado' },
]

const rows = [
  { name: 'Alice', role: 'Admin', status: 'Activo' },
  { name: 'Bob', role: 'Viewer', status: 'Pendiente' },
  { name: 'Charlie', role: 'Editor', status: 'Suspendido' },
]

export const TableExample: React.FC = () => (
  <Card
    title='Table'
    w={2}
    h={2}
  >
    <Table
      columns={columns}
      rows={rows}
    />
  </Card>
)
