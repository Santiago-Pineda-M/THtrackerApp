import type React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '../UI/components/atoms'

export const ReloadPrompt: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <aside id='reload-prompt'>
      {offlineReady ? (
        <p>App lista para trabajar sin conexión</p>
      ) : (
        <p>Nuevo contenido disponible, haz clic en recargar para actualizar.</p>
      )}

      {needRefresh && (
        <Button onClick={() => updateServiceWorker(true)}>Recargar</Button>
      )}

      <Button onClick={close}>Cerrar</Button>
    </aside>
  )
}
