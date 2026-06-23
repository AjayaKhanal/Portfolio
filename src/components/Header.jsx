import React, { useEffect,  useState, useRef } from "react";
import {Link, useLocation} from 'react-router-dom';
import '../styles/header.css'
import { ThemeSwitcher } from "../components/Themes";

const Header=()=>{
    const[menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const headerRef = useRef();

    const barToggle = () => {
        setMenuOpen(prev => !prev);
      };

    //close menu on outside click
    useEffect(()=>{
        const handleClickOutside = (event)=>{
            if(menuOpen && !headerRef.current.contains(event.target)){
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return()=>document.removeEventListener("mousedown", handleClickOutside)
    }, [menuOpen]);

    // lock scroll when menu is open
    useEffect(()=>{
        if (menuOpen) {
            document.body.style.overflow = "hidden";
          } else {
            document.body.style.overflow = "";
          }
          return () => {
            document.body.style.overflow = "";
          };
    }, [menuOpen])

    useEffect(()=>{
        setMenuOpen(false);
    },[location]);

    return(
        <header className="header" ref={headerRef}>
            <div className="header-left">
                <h1 className="logo">
                    <Link to="/home">AJ</Link>
                </h1>
            </div>

            <div className={`header-main ${menuOpen?"open":""}`}>
                <div className="header-center">
                    <nav className="nav">
                    <Link to="/home" className="link">Home</Link>
                    <Link to="/about" className="link">About</Link>
                    <Link to="/projects" className="link">Projects</Link>
                    <Link to="/contact" className="link">Contact</Link>
                    </nav>

                    <div className="theme-switcher-mobile">
                        <ThemeSwitcher />
                    </div>
                </div>

                <div className="header-right">
                    <button className="bars" id="bars" onClick={barToggle}
                    aria-label="Toogle navigation-menu">
                        <span className={`bar ${menuOpen ? "open" : ""}`}></span>
                    </button>

                    <div className="theme-switcher">
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </header>
    )
}
export default Header;