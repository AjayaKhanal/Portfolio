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
import { useDeveloperMode } from "./context/DeveloperModeContext";

// Blocks access to developer-only pages unless developer mode is on — including
// direct URL entry, which falls through to the Not Found page.
const RequireDevMode = ({ children }) => {
    const { devMode } = useDeveloperMode();
    return devMode ? children : <NotFound />;
};

const RoutesList=()=>{
    return(
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/editor" element={<RequireDevMode><Editor /></RequireDevMode>} />
        <Route path="/components" element={<RequireDevMode><Components /></RequireDevMode>} />
        <Route path="/components/:id" element={<RequireDevMode><ComponentDetail /></RequireDevMode>} />
        <Route path="*" element={<NotFound />} />
    </Routes>
    )
};

export default RoutesList;