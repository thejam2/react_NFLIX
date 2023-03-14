import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from './Components/Header';
import Home from './Routes/Home';
import Search from './Routes/Search';
import Tv from './Routes/Tv';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/react_NFLIX.github.io" element={<Home />} />
        <Route path="/movies/:id" element={<Home />} />
        <Route path="/movies/nowPlaying/:id" element={<Home />} />
        <Route path="/movies/topRated/:id" element={<Home />} />
        <Route path="/movies/upcoming/:id" element={<Home />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/tvShow/airing/:id" element={<Tv />} />
        <Route path="/tvShow/topRated/:id" element={<Tv />} />
        <Route path="/tvShow/popular/:id" element={<Tv />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/:id" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
