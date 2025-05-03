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
   };
   //this array will hold the tracks the user selects into a custom playlist
   const [userPlaylist, setUserPlaylist] = useState([]);
   //a function that will add to the custom playlist array, to then be passed to the Playlist component
   const userAddTrack = (track) =>{
        console.log(`This is the track being added at the App level: ${track.name}`);
        const testArray = [10,100,1000,10000,100000];
        console.log(testArray);
        setUserPlaylist((prev) => {
            console.log("Adding track...");
            console.log(...prev);
            return [...prev, track];
        });
   };

    
    
    return (
        <div>
        <SearchBar onClick={clickHandler} />
        <h1>Here is the song name in App.js: {getUserTrack}</h1>
        <div>
            <SearchResults list={exampleData} getTrack={userAddTrack} />
            <Playlist userList={userPlaylist} />
        </div>
        </div>
    );
};

export default App;
