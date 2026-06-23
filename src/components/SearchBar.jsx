import '../styles/searchbar.css'
import {ReactComponent as SearchIcon} from '../assets/search-icon.svg'
import {ReactComponent as ClearIcon} from '../assets/clear-icon.svg'
import { useState, useRef, useEffect } from 'react'

const SearchBar = ({setSearchQuery})=>{
    const[query, setQuery] = useState('');
    const debounceTimer = useRef(null);

    //Debounced search on typing
    useEffect(()=>{
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setSearchQuery(query.trim());
        }, 500);
        return()=> clearTimeout(debounceTimer.current);
    },[query,setSearchQuery]);

    const handleSearch=()=>{
        if(query.trim()==='')return;
        setSearchQuery(query.trim());
    };

    const handlekeyDown = (e)=>{
        if(e.key === 'Enter' && query.trim()!==''){
            handleSearch();
        }
    }

    const handleClear = ()=>{
        setQuery('');
        setSearchQuery('');
    }

    return(
        <div className="search-bar-wrapper">
            
        <input type="text" className='search-bar' placeholder="Search projects..."
        value={query} 
        onChange={(e)=>setQuery(e.target.value)}
        onKeyDown={handlekeyDown}
        />

        {query && (
            <button className="clear-icon" onClick={handleClear} aria-label="Clear search">
            <ClearIcon className="clear-svg" />
            </button>
        )}

        <button 
        className='search-icon'
        onClick={handleSearch}
        disabled={query.trim()===''}
        aria-label='Search'>
            <SearchIcon className='search-svg'/>
        </button>
        </div>
    )
}

export default SearchBar;