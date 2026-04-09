import { useMemo, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ILoginState } from '../../../../../Domain/IStates'
import { useDependencies } from '../../../../Context/useDependencies'
import { usePlocState } from '../../../../Hooks/usePlocState'
import { Card, Input, Button, Text } from '../../../components'
import FormField from '../../molecules/Form/FormField'
import s from './LoginForm.module.css'

export const LoginForm: React.FC = () => {
  const { providerLoginPloc } = useDependencies()
  const state = usePlocState<ILoginState>(providerLoginPloc)
  const navigate = useNavigate()
  const hasNavigated = useRef(false)

  const deviceInfo = useMemo(
    () => `THtracker-Web-${navigator.userAgent}-${new Date().getFullYear()}`,
    []
  )

  // Reset login state when component mounts (handles returning after logout)
  useEffect(() => {
    providerLoginPloc.reset()
    hasNavigated.current = false
  }, [providerLoginPloc])

  // Redirect to dashboard after successful login
  useEffect(() => {
    if (state.success && !hasNavigated.current) {
      hasNavigated.current = true
      navigate('/dashboard', { replace: true })
    }
  }, [state.success, navigate])

  const handleLogin = async () => {
    await providerLoginPloc.login(state.email, state.password, deviceInfo)
  }

  return (
    <Card
      w={2}
      h={2}
      title='Iniciar Sesión'
    >
      <div className={s.form}>
        {state.message && (
          <Text
            size='sm'
            className={state.success ? s.success : s.error}
          >
            {state.message}
          </Text>
        )}

        <FormField
          label='Correo Electrónico'
          required
          error={state.errors.email?.[0]}
        >
          <Input
            name='email'
            type='email'
            value={state.email}
            onChange={(e) => providerLoginPloc.updateEmail(e.target.value)}
            placeholder='tu@correo.com'
            disabled={state.isLoading}
          />
        </FormField>

        <FormField
          label='Contraseña'
          required
          error={
            !state.errors.password?.length
              ? undefined
              : state.errors.password?.[0]
          }
        >
          <Input
            name='password'
            type='password'
            value={state.password}
            onChange={(e) => providerLoginPloc.updatePassword(e.target.value)}
            placeholder='••••••••'
            disabled={state.isLoading}
          />
        </FormField>

        <Button
          type='button'
          variant='primary'
          onClick={handleLogin}
          disabled={state.isLoading || state.success}
          loading={state.isLoading}
          size='md'
        >
          {state.success ? 'Sesión Iniciada' : 'Iniciar Sesión'}
        </Button>

        <Text
          size='xs'
          className={s.register}
        >
          ¿No tienes cuenta? <Link to='/register'>Regístrate aquí</Link>
        </Text>
      </div>
    </Card>
  )
}

export default LoginForm
