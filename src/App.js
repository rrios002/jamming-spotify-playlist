import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import exampleData from "./ExampleData";
import SearchResults from "./SearchResults";
import Playlist from "./Playlist";
import Button from "./Button";
import Track from "./Track";
import Authorize from "./Authorize";


const App = () =>{
   //this variable will obtain the track from SearchBar
   const [getSearchTracks, setGetSearchTracks] = useState();
   //a getUserTrack function that will be passed to SearchBar to obtain the user entered track request
   const clickHandler = (data) =>{
        const modData = <Track playlist={data}/>
        setGetSearchTracks(modData);
        console.log(`target obtained ${getSearchTracks}`);
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

   //this variable will hold the access token and other pertinent access tokens
   const [accessToken, setAccessToken] = useState("");
   //this accessToken function will obtain an access token to be used when adding a playlist to a user's Spotify account
   setTimeout(() =>{
    const access_token = localStorage.getItem("access_token");
    setAccessToken(access_token);
    console.log(`Here is the access token stored in state at App.js:`);
    console.log(accessToken);
   },1500);
   const refreshClickHandler = () => {
        const access_token = localStorage.getItem("access_token");
        console.log(`Here is the access_token after clicking on the refresh button at App.js:`);
        console.log(access_token);
        setAccessToken(access_token);
   };


    
    
    return (
        <div>
            <div>
                <header>
                    <Authorize  getRefresh={refreshClickHandler}/>
                    <h2>Here is the access token: ${accessToken}</h2>
                </header>
            </div>
            <SearchBar onClick={clickHandler} accessToken={accessToken}/>
            <h1>Here is the song name in App.js: {getSearchTracks}</h1>
            <div>
                <SearchResults list={exampleData} getTrack={userAddTrack} />
                <Playlist playlist={userPlaylist} onClick={cancelTrack} getName={getUserPlaylistName} onSubmit={getUserPlaylistName}/>
                <h3>Here is the name at the App level: {playlistName}</h3>
            </div>
        </div>
    );
};

export default App;
