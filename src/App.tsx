import { AppRouter } from "./Infrastructure/UI/router/AppRouter";
import { ReloadPrompt } from "./Infrastructure/PWA/ReloadPrompt";
import { DebugPanel } from "./Infrastructure/UI/pages/debug";


const App = () => {
  return (
    <>
      <AppRouter />
      <ReloadPrompt />
      <DebugPanel />
    </>
  );
}

export default App;
