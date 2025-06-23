import './App.css';
import Landing from './components/Landing/Landing';
import AppContextProvider from "./context/AppContext"

function App() {

  return (
    <AppContextProvider>
      <Landing></Landing>
    </AppContextProvider>
  )
}

export default App
