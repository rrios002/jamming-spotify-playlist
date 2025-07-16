//Search Bar
//Includes a search button
import React, { useState } from "react";
import Button from './Button';

function SearchBar(props) {
    //state setter variable that will hold a user-entered search string
    const [track, setTrack] = useState("");
    //a function that will set the 'track' variable every time a user types in a track name
    const handleChange = (event) => {
        setTrack(event.target.value);
        console.log(`this is from the SearchBar ${track}`);
    };

    //will execute when the user clicks the 'search' button
    async function spotifySearch(){
        const accessToken = props.accessToken;
        const searchEndpoimt = "https://api.spotify.com/v1/search";
        const params = new URLSearchParams({
            q:track,
            type:'track',
            limit: 50
        });
        const paramsString = params.toString();
        const fetchInfo = {
            method: "GET",
            headers:{
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(`${searchEndpoimt}?${paramsString}`, fetchInfo);

        //throws an error is response.ok = 'false'
        if(!response.ok){
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        };

        const data = await response.json();
        console.log(data);
        console.log(data.tracks.items);

        const items = data.tracks.items;
        //returning the search results back to App:
        props.onClick(items);
        return;



        
    };
    

    return (
        <>
            <h1>Enter a song name!</h1>
            <form>
                <label htmlFor='textInput'></label>
                <input id='textInput' type='text' onChange={handleChange} value={track}></input>
            </form>
            <div>
                <Button text='Search' value={track} onClick={props.onClick}/>
                <Button text='Spotify Search' onClick={spotifySearch} />
            </div>
            
            <h1>Here is the song name: {track}</h1>
        </>
        
    );
};

export default SearchBar;