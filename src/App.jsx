import Pickup from "./Pickup";
import Roast from "./Roast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Pickup />} />
        <Route path="/roast" element={<Roast />} />
      </Routes>
    </Router>
    </>
  )
}
