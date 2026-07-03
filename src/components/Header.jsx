import React, { useEffect,  useState, useRef } from "react";
import {Link, useLocation} from 'react-router-dom';
import { cn } from '../lib/utils';
import '../styles/header.css'
import { ThemeSwitcher } from "../components/Themes";
import DevModeToggle from "../components/DevModeToggle";

const Header=React.forwardRef(({ navLinks = [], className, ...rest }, ref)=>{
    const[menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const headerRef = useRef();
    // Merge the internal ref (used for outside-click detection) with a
    // forwarded ref so callers can also reach the <header> element.
    const setRefs = (node) => {
        headerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
    };

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
        <header className={cn("header", className)} ref={setRefs} {...rest}>
            <div className="header-left">
                <h1 className="logo">
                    <Link to="/home">AJ</Link>
                </h1>
            </div>

            <div className={`header-main ${menuOpen?"open":""}`}>
                <div className="header-center">
                    <nav className="nav">
                    {navLinks.map(({ to, label }) => (
                      <Link key={to} to={to} className="link">{label}</Link>
                    ))}
                    </nav>
                </div>

                <div className="header-right">
                    <DevModeToggle className="header-devmode" />

                    <div className="theme-switcher">
                        <ThemeSwitcher />
                    </div>

                    <button className="bars" id="bars" onClick={barToggle}
                    aria-label="Toogle navigation-menu">
                        <span className={`bar ${menuOpen ? "open" : ""}`}></span>
                    </button>
                </div>
            </div>
        </header>
    )
})

Header.displayName = 'Header';

export default Header;