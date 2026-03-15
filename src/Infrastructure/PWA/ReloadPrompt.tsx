import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button, Card } from '../UI/components/shared'

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

    if (!offlineReady && !needRefresh) return null;

    return (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000 }}>
            <Card className="max-w-md glass" style={{ padding: '1.25rem' }}>
                <div className="mb-4">
                    {offlineReady ? (
                        <p className="font-medium">App lista para trabajar sin conexión</p>
                    ) : (
                        <p className="font-medium">Nuevo contenido disponible, haz clic en recargar para actualizar.</p>
                    )}
                </div>
                <div className="flex gap-6">
                    {needRefresh && (
                        <Button
                            onClick={() => updateServiceWorker(true)}
                        >
                            Recargar
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => close()}
                    >
                        Cerrar
                    </Button>
                </div>
            </Card>
        </div>
    )
}
