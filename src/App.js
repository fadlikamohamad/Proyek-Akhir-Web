import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/about';
import Info from './pages/info';
import Parent from './Parent';

function App() {
  return (
    <Router>
      <Parent>
        <Navbar />
        <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path='/about' element={<About/>} />
          <Route path='/info' element={<Info/>} />
        </Routes>
      </Parent>
    </Router>
  );
}
  
export default App;