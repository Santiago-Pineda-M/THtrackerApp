import { DateProvider } from '../../../Application/Services/Date/DateProvider'
let _instance: DateProvider | null = null
export const getDateProvider = (): DateProvider => {
  if (!_instance) _instance = new DateProvider()
  return _instance
}
