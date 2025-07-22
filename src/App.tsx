import './App.css';
import Landing from './components/Landing/Landing';
import Visor from './components/Visor/Visor';
import AppContextProvider from "./context/AppContext"
import ColoniasContextProvider from "./context/ColoniasContext"
import { Provider } from './components/ui/provider';
import { Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Provider>
      <AppContextProvider>
        <ColoniasContextProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/visor" element={<Visor />} />
        </Routes>
        </ColoniasContextProvider>
      </AppContextProvider>
    </Provider>
  )
}

export default App
