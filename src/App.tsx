import './App.css';
import Landing from './components/Landing/Landing';
import Visor from './components/Visor/Visor';
import Equipo from './components/Landing/Equipo/Equipo';
import AppContextProvider from "./context/AppContext"
import { Provider } from './components/ui/provider';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from "./components/ui/toaster"


function App() {

  return (
    <Provider>
      <AppContextProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/visor" element={<Visor />} />
        <Route path="/equipo" element={<Equipo />} />
      </Routes>
      <Toaster />
      </AppContextProvider>
    </Provider>
  )
}

export default App
