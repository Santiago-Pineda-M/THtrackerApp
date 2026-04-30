import { useMemo, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ILoginState } from '../../../../../../Domain/IStates'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import { Input, Button, Text, Icon } from '../../../../components'
import { FormField } from '../../../../components'
import styles from './LoginForm.module.scss'

type LoginFormProps = React.HTMLAttributes<HTMLFormElement>

export const LoginForm: React.FC<LoginFormProps> = ({
  className,
  ...props
}) => {
  const { providerLoginPloc } = useDependencies()
  const state = usePlocState<ILoginState>(providerLoginPloc)
  const navigate = useNavigate()
  const hasNavigated = useRef(false)

  const deviceInfo = useMemo(
    () => `THtracker-Web-${navigator.userAgent}-${new Date().getFullYear()}`,
    []
  )

  const [showPassword, setShowPassword] = useState(false)

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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const formClass = [styles.form, className].filter(Boolean).join(' ')

  return (
    <form
      className={formClass}
      onSubmit={(e) => e.preventDefault()}
      {...props}
    >
      {state.message && (
        <Text
          size='sm'
          className={state.success ? styles.success : styles.error}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            providerLoginPloc.updateEmail(e.target.value)
          }
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
        <div className={styles.passwordContainer}>
          <Input
            name='password'
            type={showPassword ? 'text' : 'password'}
            value={state.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              providerLoginPloc.updatePassword(e.target.value)
            }
            placeholder='••••••••'
            disabled={state.isLoading}
            className={styles.passwordInput} // 2. Clase para padding extra
          />
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className={styles.toggleButton}
            disabled={state.isLoading}
          >
            {showPassword ? <Icon name='Eye' /> : <Icon name='EyeClosed' />}
          </button>
        </div>
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
        className={styles.footer}
      >
        ¿No tienes cuenta? <Link to='/register'>Regístrate aquí</Link>
      </Text>
    </form>
  )
}

export type { LoginFormProps }
export default LoginForm
