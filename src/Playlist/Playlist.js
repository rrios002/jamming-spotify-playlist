//Playlist
//Includes a 'Save to Spotify' Button
import React, { useEffect, useState } from 'react';
import Button from './Button';
import Track from "./Track";

function Playlist(props){
  
    const [playlistName, setPlaylistName]= useState("")

    const getPlaylistName = (event) =>{
        setPlaylistName(event.target.value);
    };

    /*this function will take the custom user playlist and custom playlist name and upload them to Spotify
    This action will occur in multiple steps due to the way Spotify handles playlist uploads.
    1st: We will need to request the user's Spotify ID from the 'Get Current User's Profile' endpoint
    2nd: We will use the user ID to create a new empty playlist with a custom name typed by the user. This will return a playlist ID in the response object
    3rd. We will use the playlist ID obtained from step two and use that to upload the track URIs to the newly created playlist
    */
    const submitHandler = async () =>{
        //we will use the uri's from each track to upload the user playlist to Spotify
        const userUris = props.playlist.map((track) => {
            return track.uri;
        });
        console.log(`Here are the URIs`);
        console.log(userUris);
        //checks to see if the user has typed in a playlist name. If not, then the process stops here.
        if (!playlistName){
            alert(`Please enter a playlist name`);
            return;
        };

        //this endpoint will help us obtain the user's Spotify ID
        const userInfoEndpoint = "https://api.spotify.com/v1/me";
        //fetchInfo will contain the header object used to get the user ID
        const fetchInfo = {
            method: "GET",
            headers:{
                Authorization: `Bearer ${props.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const userResponse = await fetch(`${userInfoEndpoint}`, fetchInfo);
        if (!userResponse.ok){
            throw new Error(`Error : ${userResponse.status} - ${userResponse.statusText}`);
        };

        const userData = await userResponse.json();
        const userID = userData.id;
        console.log(`Here is the Spotify User ID: ${userID}`);

        //now using userID to create a new playlist and obtain a playlist ID
        const playlistEndpoint = `https://api.spotify.com/v1/users/${userID}/playlists`;
        const createFetchInfo = {
            method: "POST",
            headers:{
                Authorization: `Bearer ${props.accessToken}`,
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
            name: playlistName,
            public: false,
            collaborative: false,
            description: "Playlist creation to test if it uploads"
            })
        };

        const createResponse = await fetch(`${playlistEndpoint}`, createFetchInfo);

        if (!createResponse.ok){
            throw new Error (`Error: ${createResponse.status} - ${createResponse.statusText}`);
        };

        const createData = await createResponse.json();
        const playlistID = createData.id;
        console.log(`Here is the ID for the newly created playlist: ${playlistID}`);

        //now using the playlist ID returned from the new empty playlist to add songs to it
        const addToPlaylistEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
        const addTracksFetchInto = {
            method: "POST",
            headers:{
                Authorization: `Bearer ${props.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                playlist_id: playlistID,
                position: 0,
                uris: userUris
            })
        };

        const addResponse = await fetch(`${addToPlaylistEndpoint}`, addTracksFetchInto);

        if (!addResponse.ok){
            throw new Error (`Error: ${addResponse.status} - ${addResponse.statusText}`);
        };

        const addData = await addResponse.json();
        const snapshotID = addData.snapshot_id;
        console.log(`Here is the snapshot ID for the playlist: ${snapshotID}`);
        

        
    };
    return (
        <>
        <form className="Playlist_Form_1">
            <input type="text" name="Playlist_text_field_1" value={playlistName} onChange={getPlaylistName}></input>
        </form>
        <h3>Here is the current name of the playlist: {playlistName}</h3>
        <h2>Here are the tracks the user has selected:</h2>
        <ul><Track playlist={props.playlist} onClick={props.onClick}/></ul>
        <Button text="Save Playlist" onClick={submitHandler} value={playlistName} />
        </>
    )
};

export default Playlist;