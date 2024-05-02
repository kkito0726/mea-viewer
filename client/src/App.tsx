import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toppage } from "./pages/Toppage";
import { ShowAll } from "./pages/ShowAll";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Toppage />} />
          <Route path="/showAll" element={<ShowAll />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
