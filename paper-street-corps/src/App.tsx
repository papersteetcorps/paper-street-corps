import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';

import Home from './pages/Home';
import TypologyTests from './pages/TypologyTests';
import TypologyTheories from './pages/TypologyTheories';
import SoftwareTools from './pages/SoftwareTools';
import About from './pages/About';
import Team from './pages/Team';
import TestDetail from './pages/TestDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        {/* Top-level pages */}
        <Route path="/" element={<Home />} />
        <Route path="/tests" element={<TypologyTests />} />
        <Route path="/theories" element={<TypologyTheories />} />
        <Route path="/tools" element={<SoftwareTools />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />

        {/* Dropdown item targets */}
        <Route path="/tests/:slug" element={<TestDetail />} />
        <Route path="/theories/:slug" element={<TestDetail />} />
        <Route path="/tools/:slug" element={<TestDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
