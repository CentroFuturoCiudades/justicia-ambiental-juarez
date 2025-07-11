import './App.css';
import Landing from './components/Landing/Landing';
import Visor from './components/Visor/Visor';
import AppContextProvider from "./context/AppContext"


function App() {

  return (
    <AppContextProvider>
      <Landing></Landing>
      <Visor></Visor>
    </AppContextProvider>
  )
}

export default App
