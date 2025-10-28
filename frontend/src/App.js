import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Compare from './pages/Compare';
import BiasComparison from './pages/BiasComparison';
import Onboarding from './pages/Onboarding';
import Preferences from './pages/Preferences';
import Recommendations from './pages/Recommendations';
import Signup from './pages/signup';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/bias" element={<BiasComparison />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
