import React from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export const ReloadPrompt: React.FC = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    })

    const close = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    return (
        <div className="fixed bottom-0 right-0 p-4 z-50">
            {(offlineReady || needRefresh) && (
                <div className="bg-white rounded-lg shadow-2xl p-4 border border-blue-100 max-w-xs animate-in slide-in-from-bottom-4">
                    <div className="mb-2">
                        {offlineReady ? (
                            <span className="text-gray-800 font-medium">App ready to work offline</span>
                        ) : (
                            <span className="text-gray-800 font-medium">New content available, click on reload button to update.</span>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        {needRefresh && (
                            <button
                                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                                onClick={() => updateServiceWorker(true)}
                            >
                                Reload
                            </button>
                        )}
                        <button
                            className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                            onClick={() => close()}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
