import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { IRegisterState } from '../../../../../Domain/IStates'
import { useDependencies } from '../../../../Context/useDependencies'
import { usePlocState } from '../../../../Hooks/usePlocState'
import { Card, Input, Button, Text } from '../../../components'
import FormField from '../../molecules/Form/FormField'
import s from './RegisterForm.module.css'

export const RegisterForm: React.FC = () => {
  const { providerRegisterPloc } = useDependencies()
  const state = usePlocState<IRegisterState>(providerRegisterPloc)
  const navigate = useNavigate()
  const hasNavigated = useRef(false)

  // Reset register state when component mounts
  useEffect(() => {
    providerRegisterPloc.reset()
    hasNavigated.current = false
  }, [providerRegisterPloc])

  // Redirect to login after successful registration
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

  return (
    <Card
      w={2}
      h={3}
      title='Crear Cuenta'
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
          label='Nombre Completo'
          required
          error={state.errors.name?.[0]}
        >
          <Input
            name='name'
            type='text'
            value={state.name}
            onChange={(e) => providerRegisterPloc.updateName(e.target.value)}
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
            onChange={(e) => providerRegisterPloc.updateEmail(e.target.value)}
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
            onChange={(e) =>
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
            onChange={(e) =>
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
          className={s.register}
        >
          ¿Ya tienes cuenta? <Link to='/login'>Inicia Sesión</Link>
        </Text>
      </div>
    </Card>
  )
}

export default RegisterForm
