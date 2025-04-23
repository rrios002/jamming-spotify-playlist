import React, { useState } from "react";
import SearchBar from "./SearchBar";
import exampleData from "./ExampleData";
import SearchResults from "./SearchResults";
import Playlist from "./Playlist";


const App = () =>{
   //this variable will obtain the track from SearchBar
   const [getUserTrack, setGetUserTrack] = useState("");
   //a function that will be passed to SearchBar to obtain the user entered track request
   const clickHandler = (event) =>{
        setGetUserTrack(event.target.value);
        console.log(`target obtained ${getUserTrack}`);
   }

    
    
    return (
        <div>
        <SearchBar onClick={clickHandler} />
        <h1>Here is the song name in App.js: {getUserTrack}</h1>
        <div>
            <SearchResults list={exampleData}/>
            <Playlist />
        </div>
        </div>
    );
};

export default App;
