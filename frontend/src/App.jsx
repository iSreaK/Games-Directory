import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Games from "./pages/Games";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jeux" element={<Games />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
