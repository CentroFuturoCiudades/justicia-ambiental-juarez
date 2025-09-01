import './App.css';
import Landing from './components/Landing/Landing';
import Visor from './components/Visor/Visor';
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
      </Routes>
      <Toaster />
      </AppContextProvider>
    </Provider>
  )
}

export default App
