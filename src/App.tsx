import './App.css';
import Landing from './components/Landing/Landing';
import Visor from './components/Visor/Visor';
import AppContextProvider from "./context/AppContext"
import { Provider } from './components/ui/provider';

function App() {

  return (
    <Provider>
      <AppContextProvider>
        <Landing></Landing>
        <Visor></Visor>
      </AppContextProvider>
    </Provider>
  )
}

export default App
