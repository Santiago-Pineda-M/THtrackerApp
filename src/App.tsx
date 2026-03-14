import { AppRouter } from "./Infrastructure/UI/router/AppRouter";
import { ReloadPrompt } from "./Infrastructure/PWA/ReloadPrompt";
import { DebugPanel } from "./Infrastructure/UI/components/debug";
import "./App.css";

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
