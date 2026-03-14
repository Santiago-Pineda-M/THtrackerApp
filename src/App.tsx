import { AppRouter } from "./Infrastructure/UI/router/AppRouter";
import { ReloadPrompt } from "./Infrastructure/PWA/ReloadPrompt";
import "./App.css";

const App = () => {
  return (
    <>
      <AppRouter />
      <ReloadPrompt />
    </>
  );
}

export default App;
