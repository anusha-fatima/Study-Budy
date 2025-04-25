import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Header from './components/Header';
import Features from './Pages/Features';
import QuizGenerator from './Pages/QuizGenerator';
import ResourceFinder from './Pages/ResourceFinder';
import Navbar from './components/Navbar';
import About from './Pages/About';
import Footer from './components/Footer';
function App() {
  return (
   <div>
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Header />} />
      <Route path="/features" element={<Features />} />
      <Route path="/About" element={<About />} />
      <Route path='/QuizGenerator' element={<QuizGenerator />} />
      <Route path='/ResourceFinder' element={<ResourceFinder />} />
      
    </Routes>
    
    </BrowserRouter>
    <Footer />
   </div>
  )
}

export default App
