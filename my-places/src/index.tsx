import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import the components
import MyPlaces from './pages/places';
import MyRecipes from './pages/recipes';
import Home from './pages/home';
import Layout from './pages/layout';
import NoPage from './pages/nopage';

export default function HomePage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Home />} /> */}
          <Route path="/*" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/places" element={<MyPlaces />} />
          <Route path="/recipes" element={<MyRecipes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<HomePage />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
