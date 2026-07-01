import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import ProjectDetail from './pages/ProjectDetail';
import Editor from "./pages/Editor";
import Components from "./pages/Components";
import ComponentDetail from "./pages/ComponentDetail";
import NotFound from "./pages/NotFound";

const RoutesList=()=>{
    return(
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/components" element={<Components />} />
        <Route path="/components/:id" element={<ComponentDetail />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
    )
};

export default RoutesList;