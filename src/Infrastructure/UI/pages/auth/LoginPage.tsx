import { LoginForm } from '../../components/organisms/LoginForm/LoginForm'
import { AuthLayout } from '../../components/layouts'

export const LoginPage = () => {
  return (
    <AuthLayout
      title='Iniciar Sesión'
      subtitle='Bienvenido de nuevo. Ingresa tus credenciales para continuar.'
    >
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
