import React, { useState } from "react";
import SearchBar from "./SearchBar";
import exampleData from "./ExampleData";
import SearchResults from "./SearchResults";
import Playlist from "./Playlist";
import Track from "./Track";


const App = () =>{
   //this variable will obtain the track from SearchBar
   const [getUserTrack, setGetUserTrack] = useState("");
   //a getUserTrack function that will be passed to SearchBar to obtain the user entered track request
   const clickHandler = (event) =>{
        setGetUserTrack(event.target.value);
        console.log(`target obtained ${getUserTrack}`);
   };

   //this array will hold the tracks the user selects into a custom playlist
   const [userPlaylist, setUserPlaylist] = useState([]);
   //a userPlaylist function that will add a track to a user's custom playlist 
   const userAddTrack = (trackIndex) =>{
        
        console.log(`Here is the trackIndex once the track is added to the userPlaylist: ${trackIndex}`);
        console.log(exampleData[trackIndex]);

        setUserPlaylist((prev) =>{
            if (prev.includes(exampleData[trackIndex])){
                return prev;
            } else {
                return [...prev, exampleData[trackIndex]];
            };
            
        });
        
   };

   //a userPlaylist function that will remove a track from the user's custom playlist
   const cancelTrack = (event) =>{
        const targetValue= parseInt(event.target.value);
        const results = userPlaylist.findIndex((track) => track.id == targetValue);
        const trackToBeRemoved = userPlaylist[results];
        //calling setUserPlaylist
        
        const returnPlaylist = userPlaylist.filter((track) => {
            return track !==trackToBeRemoved;
        });
        console.log(Array.isArray(returnPlaylist));
        console.log(`Here is the return playlist with the filtered track`);
        console.log(returnPlaylist);
        setUserPlaylist(returnPlaylist);        
        
   };

   //this variable will hold the name of the user's custom playlist
   const [playlistName, setPlaylistName] = useState("");
   //this playlistName function will obtain the user's custom playlist name
   const getUserPlaylistName = (event) =>{
        const newName = event.target.value;
        setPlaylistName(newName);
   };

    
    
    return (
        <div>
            <SearchBar onClick={clickHandler} />
            <h1>Here is the song name in App.js: {getUserTrack}</h1>
            <div>
                <SearchResults list={exampleData} getTrack={userAddTrack} />
                <Playlist playlist={userPlaylist} onClick={cancelTrack} getName={getUserPlaylistName} onSubmit={getUserPlaylistName}/>
                <h3>Here is the name at the App level: {playlistName}</h3>
            </div>
        </div>
    );
};

export default App;
