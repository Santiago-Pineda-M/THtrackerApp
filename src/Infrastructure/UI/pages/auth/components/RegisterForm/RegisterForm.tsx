import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { IRegisterState } from '../../../../../../Domain/IStates'
import { useDependencies } from '../../../../../Context/useDependencies'
import { usePlocState } from '../../../../../Hooks/usePlocState'
import { Input, Button, Text, FormField } from '../../../../components'
import styles from './RegisterForm.module.scss'

type RegisterFormProps = React.HTMLAttributes<HTMLFormElement>

export const RegisterForm: React.FC<RegisterFormProps> = ({
  className,
  ...props
}) => {
  const { providerRegisterPloc } = useDependencies()
  const state = usePlocState<IRegisterState>(providerRegisterPloc)
  const navigate = useNavigate()
  const hasNavigated = useRef(false)

  useEffect(() => {
    providerRegisterPloc.reset()
    hasNavigated.current = false
  }, [providerRegisterPloc])

  useEffect(() => {
    if (state.success && !hasNavigated.current) {
      hasNavigated.current = true
      navigate('/login', { replace: true })
    }
  }, [state.success, navigate])

  const handleRegister = async () => {
    await providerRegisterPloc.register(
      state.name,
      state.email,
      state.password,
      state.confirmPassword
    )
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
        label='Nombre Completo'
        required
        error={state.errors.name?.[0]}
      >
        <Input
          name='name'
          type='text'
          value={state.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            providerRegisterPloc.updateName(e.target.value)
          }
          placeholder='Juan Pérez'
          disabled={state.isLoading}
        />
      </FormField>

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
            providerRegisterPloc.updateEmail(e.target.value)
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
        <Input
          name='password'
          type='password'
          value={state.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            providerRegisterPloc.updatePassword(e.target.value)
          }
          placeholder='••••••••'
          disabled={state.isLoading}
        />
      </FormField>

      <FormField
        label='Confirmar Contraseña'
        required
        error={state.errors.confirmPassword?.[0]}
      >
        <Input
          name='confirmPassword'
          type='password'
          value={state.confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            providerRegisterPloc.updateConfirmPassword(e.target.value)
          }
          placeholder='••••••••'
          disabled={state.isLoading}
        />
      </FormField>

      <Button
        type='button'
        variant='primary'
        onClick={handleRegister}
        disabled={state.isLoading || state.success}
        loading={state.isLoading}
        size='md'
      >
        {state.success ? 'Cuenta Creada' : 'Registrarse'}
      </Button>

      <Text
        size='xs'
        className={styles.footer}
      >
        ¿Ya tienes cuenta? <Link to='/login'>Inicia Sesión</Link>
      </Text>
    </form>
  )
}

export type { RegisterFormProps }
export default RegisterForm
