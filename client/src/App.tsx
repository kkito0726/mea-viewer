import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toppage } from "./pages/Toppage";
import { ShowAll } from "./pages/ShowAll";
import { ShowSingle } from "./pages/ShowSingle";
import { RasterPlot } from "./pages/RasterPlot";
import { ShowDetection } from "./pages/ShowDetection";
import { Draw2D } from "./pages/Draw2d";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Toppage />} />
          <Route path="/showAll" element={<ShowAll />} />
          <Route path="/showSingle" element={<ShowSingle />} />
          <Route path="/showDetection" element={<ShowDetection />} />
          <Route path="/rasterPlot" element={<RasterPlot />} />
          <Route path="/draw2d" element={<Draw2D />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
