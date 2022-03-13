import './App.css';
import BeatMyWordle from './pages/BeatMyWordle/BeatMyWordle';
import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";
import AdminPage from './pages/AdminPage/AdminPage';


function App() {
  return (
        <Router>
            <Routes>
                <Route path="/admin" element={ <AdminPage />} />
                <Route path="/" element={ <BeatMyWordle/> } />
            </Routes>
        </Router>
    
  );
}

export default App;
