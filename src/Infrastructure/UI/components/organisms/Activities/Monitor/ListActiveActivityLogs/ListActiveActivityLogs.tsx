import styles from './ListActiveActivityLogs.module.css'
import { Card } from '../../../..'

const ListActiveActivityLogs = () => {
  return (
    <Card
      title='Actividades'
      className={styles.card}
      h={1}
      w={2}
    ></Card>
  )
}

export default ListActiveActivityLogs
