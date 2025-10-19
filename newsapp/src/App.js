import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './starterPage/login.js';
import Signup from './starterPage/signup.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup/>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
