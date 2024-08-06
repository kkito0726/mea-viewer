import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toppage } from "./pages/Toppage";
import { ShowAll } from "./pages/ShowAll";
import { ShowSingle } from "./pages/ShowSingle";
import { RasterPlot } from "./pages/RasterPlot";
import { ShowDetection } from "./pages/ShowDetection";
import { Draw2D } from "./pages/Draw2d";
import { Draw3D } from "./pages/Draw3d";
import { PagePath } from "./enum/PagePath";
import { SharedMeaProvider } from "./components/SharedMEA";
import { PlotPeaks } from "./pages/PlotPeaks";

function App() {
  return (
    <div>
      <SharedMeaProvider>
        <Router>
          <Routes>
            <Route path={PagePath.ROOT} element={<Toppage />} />
            <Route path={PagePath.SHOW_ALL} element={<ShowAll />} />
            <Route path={PagePath.SHOW_SINGLE} element={<ShowSingle />} />
            <Route path={PagePath.SHOW_DETECTION} element={<ShowDetection />} />
            <Route path={PagePath.RASTER_PLOT} element={<RasterPlot />} />
            <Route path={PagePath.DRAW_2D} element={<Draw2D />} />
            <Route path={PagePath.DRAW_3D} element={<Draw3D />} />
            <Route path={PagePath.PlotPeaks} element={<PlotPeaks />} />
          </Routes>
        </Router>
      </SharedMeaProvider>
    </div>
  );
}

export default App;
