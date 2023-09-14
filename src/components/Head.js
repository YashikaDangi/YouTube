import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../utils/appSlice";
import { YOUTUBE_SEARCH_API } from "../utils/constants";
import { cacheResults } from "../utils/searchSlice";

const Head = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchCache = useSelector((store) => store.search);
  const dispatch = useDispatch();
  useEffect(()=> {

   const timer = setTimeout(() => {
    if(searchCache[searchQuery]){
      setSuggestions(searchCache[searchQuery]);
    } else {
      getSearchSuggestions()
    }
   },200);
  
   return () => {
    clearTimeout(timer);
   };
  },[searchQuery]);

  const getSearchSuggestions = async () =>{
    const data = await fetch(YOUTUBE_SEARCH_API+ searchQuery );
    const json = await data.json();
    setSuggestions(json[1]);
    //console.log(json[1]);

    dispatch(
      cacheResults({
      [searchQuery] : json[1],
    }));

  }

    const toggleMenuHandler = () => {
        dispatch(toggleMenu());
    };

  return (
    <div className="grid grid-flow-col p-5 m-2 shadow-lg">
      <div className="flex col-span-1 justify-between">
        <img
          onClick={() => toggleMenuHandler()}
          className="h-8 cursor-pointer"
          alt="menu"
          src="https://cdn.iconscout.com/icon/free/png-256/free-hamburger-menu-462145.png?f=webp"
        ></img>
        <a href="/">
        <img
          className="h-8 mx-2"
          alt="youtube-logo"
          src="https://lh3.googleusercontent.com/3zkP2SYe7yYoKKe47bsNe44yTgb4Ukh__rBbwXwgkjNRe4PykGG409ozBxzxkrubV7zHKjfxq6y9ShogWtMBMPyB3jiNps91LoNH8A=s500"
        ></img>
        </a>
      </div>
      <div className="col-span-10 px-10">
      <div>
        <input className="w-1/2 border border-gray-400 p-2 rounded-l-full" 
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
         />
        <button className="border border-gray-400 px-5 py-2 rounded-r-full bg-gray-100">🔍</button>
        </div>
        {showSuggestions && (
        <div className="fixed bg-white py-2 px-5 w-96 shadow-lg rounded-lg border border-gray-100 absolute">
          <ul>
          {suggestions.map((s) => (
            <li key={s} className="py-2 px-3 shadow-sm hover:bg-gray-100">{s}</li>
            ))}
          </ul>
        </div>
        )}
      </div>
      <div className="col-span-1">
        <img
          className="h-8"
          alt="user"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8GK7YUtkIpzjmqsZkKJL7lso-nWmjdKWg-g&usqp=CAU"
        ></img>
      </div>
    </div>
  );
};

export default Head;
