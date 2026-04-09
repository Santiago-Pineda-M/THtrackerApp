import { AppRouter } from './Infrastructure/UI/router/AppRouter'
import { ReloadPrompt } from './Infrastructure/PWA/ReloadPrompt'
import { DependenciesProvider } from './Infrastructure/Context/DependenciesProvider'

const App = () => {
  return (
    <DependenciesProvider>
      <AppRouter />
      <ReloadPrompt />
    </DependenciesProvider>
  )
}

export default App
