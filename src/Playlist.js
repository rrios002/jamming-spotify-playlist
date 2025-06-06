//Playlist
//Includes a 'Save to Spotify' Button
import React, { useEffect, useState } from 'react';
import Button from './Button';
import Track from "./Track";

function Playlist(props){
  
    const [playlistName, setPlaylistName]= useState("")

    const getPlaylistName = (event) =>{
        setPlaylistName(event.target.value);
    }
    return (
        <>
        <form class="Playlist_Form_1">
            <input type="text" name="Playlist_text_field_1" value={playlistName} onChange={getPlaylistName}></input>
        </form>
        <h3>Here is the current name of the playlist: {playlistName}</h3>
        <h2>Here are the tracks the user has selected:</h2>
        <ul><Track playlist={props.playlist} onClick={props.onClick}/></ul>
        <Button text="Save Playlist" onClick={props.onSubmit} value={playlistName} />
        </>
    )
};

export default Playlist;