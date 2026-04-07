import { RegisterForm } from '../../components/organisms/RegisterForm/RegisterForm'
import { AuthLayout } from '../../components/layouts'

export const RegisterPage = () => {
  return (
    <AuthLayout
      title='Crear Cuenta'
      subtitle='Regístrate para comenzar a usar THtracker.'
    >
      <RegisterForm />
    </AuthLayout>
  )
}

export default RegisterPage
