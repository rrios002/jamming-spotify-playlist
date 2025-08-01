import React, { useState, useEffect } from "react";
import * as styles from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar.js";
import SearchResults from "../SearchResults/SearchResults.js";
import Playlist from "../Playlist/Playlist.js";
import Authorize from "../Authorize/Authorize.js";
import logo from "../Images/Spotify_Primary_Logo_RGB_Green.png";




const App = () =>{
    //This variable will hold the search query entered by the user
   const[track, setTrack] = useState("");
   const getSearchQuery = (query) => {
    setTrack(query);
   };

   //this variable will obtain the tracks from SearchBar
   const [getSearchTracks, setGetSearchTracks] = useState([]);
   //a getUserTrack function that will be passed to SearchBar to obtain the user entered track request
   const clickHandler = (data) =>{
        console.log(`Here is the response object at App`);
        console.log(data);

        const mappedResults = data.map((result) => {
            return {
                "name": result.name,
                "artist": result.artists[0].name,
                "album": result.album.name,
                "id": result.id,
                "uri": result.uri,
                "img": result.album.images[0].url,
                "img-height": result.album.images.height,
                "img-width": result.album.images.width
            };
        });
        console.log(`Here is the mappedResults array`);
        console.log(mappedResults);
        //const modData = <Track playlist={data}/>;
        setGetSearchTracks(mappedResults);
        console.log(`This confirms that the mappedResults array was set into getSearchTracks`);
        console.log(getSearchTracks);
        return;
        //console.log(`target obtained ${getSearchTracks}`);
   };

   //this array will hold the tracks the user selects into a custom playlist
   const [userPlaylist, setUserPlaylist] = useState([]);
   //a userPlaylist function that will add a track to a user's custom playlist 
   const userAddTrack = (trackIndex) =>{
        
        console.log(`Here is the trackIndex once the track is added to the userPlaylist: ${trackIndex}`);
        console.log(getSearchTracks[trackIndex]);

        setUserPlaylist((prev) =>{
            if (prev.includes(getSearchTracks[trackIndex])){
                return prev;
            } else {
                return [...prev, getSearchTracks[trackIndex]];
            };
            
        });
        
   };

   //a userPlaylist function that will remove a track from the user's custom playlist
   const cancelTrack = (event) =>{
        const targetValue= event.target.value;
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
   useEffect(() => {
    const timer = setTimeout(() =>{
    const access_token = localStorage.getItem("access_token");
    setAccessToken(access_token);
    console.log(`Here is the access token stored in state at App.js:`);
    console.log(accessToken);
   },1500);
   return () => clearTimeout(timer);
   },[]);
   
   const refreshClickHandler = () => {
        const access_token = localStorage.getItem("access_token");
        console.log(`Here is the access_token after clicking on the refresh button at App.js:`);
        console.log(access_token);
        setAccessToken(access_token);
   };
   
    
    return (
        <>
        
        <div className={styles.appContainer}>
            <div>
                <header className={styles.header}>
                    <h1 className={styles.h1}>Jammming!</h1>
                    <Authorize  getRefresh={refreshClickHandler}/>
                </header>
            </div>
            <img src={logo} alt="Green Spotify Logo" className={styles.image}/>
            <SearchBar onClick={clickHandler} accessToken={accessToken} searchQuery={getSearchQuery} />
            
            <div className={styles.playlistsDiv}>
                <SearchResults list={getSearchTracks} getTrack={userAddTrack} userTrack={track} />
                <Playlist playlist={userPlaylist} onClick={cancelTrack} accessToken={accessToken} onSubmit={getUserPlaylistName}/>
            </div>
            <footer className={styles.footer}>
                <h3>&copy; 2025 Roman Rios</h3>
                <h3>All Rights Reserved</h3>
            </footer>
        </div>
        
        </>
    );
};

export default App;
