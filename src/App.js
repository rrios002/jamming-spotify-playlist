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
        console.log(track);
        console.log(`This is the track being added at the App level: ${track}`);
        console.log(`This is the track's ID: ${track.id}`);
        console.log(`Here is the userPlaylist's length so far: ${userPlaylist.length}`);
        console.log(typeof userPlaylist);
        //this if statement might break the code:
        /*
        if (userPlaylist.includes(track)){
            const selectedTrack = [];
            selectedTrack.push = track;
            setUserPlaylist((track) =>{
                userPlaylist.filter((track) =>{
                    return track["id"] !== userPlaylist["id"];
                })
            });
        };
        */
        if (userPlaylist.length > 0){
            if (userPlaylist.includes(track)) {
            console.log(`This track is already on the playlist!`);
            return;
            };
        };
        
        const testArray = [10,100,1000,10000,100000];
        console.log(testArray);
        setUserPlaylist(
            [...userPlaylist, track]
        );
        
   };

   //a function that will call setUserPlaylist to exclude entries in the custom playlist
   const cancelTrack = (track) =>{
        console.log(`Here is the track received by the cancelTrack function:`)
        console.log(track);
        //calling setUserPlaylist to filter out
        setUserPlaylist((track) => {
            userPlaylist.filter((track) => {
                return userPlaylist.id !== track;
            })
        });
   }

    
    
    return (
        <div>
            <SearchBar onClick={clickHandler} />
            <h1>Here is the song name in App.js: {getUserTrack}</h1>
            <div>
                <SearchResults list={exampleData} getTrack={userAddTrack} />
                <Playlist userList={userPlaylist} cancelTrack={cancelTrack} />
            </div>
        </div>
    );
};

export default App;
