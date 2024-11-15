import './App.css';
import Authentication, { AuthenticationMode } from './screens/authentication';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Authentication authenticationMode={AuthenticationMode.Login} />} />
        <Route path="/signup" element={<Authentication authenticationMode={AuthenticationMode.Register} />} />
      </Routes>
    </Router>
  );
}

export default App;
