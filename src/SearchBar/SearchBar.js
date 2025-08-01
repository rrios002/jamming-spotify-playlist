//Search Bar
//Includes a search button
import React, { useState } from "react";
import * as styles from "./SearchBar.module.css";
import Button from '../Button/Button.js';

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

        if(!track){
            return;
        }
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
        props.searchQuery(track);
        props.onClick(items);
        return;



        
    };
    

    return (
        <>
            <div className={styles.searchBarContainer}>
                <div className={styles.contentContainer}>
                    <h2 className={styles.h2}>Enter a song name!</h2>
                    <form>
                        <label htmlFor='textInput'></label>
                        <input id='textInput' type='text' onChange={handleChange} value={track} placeholder="Enter a track" className={styles.input}></input>
                    </form>
                    <div className={styles.button}>
                        <Button text='Spotify Search' onClick={spotifySearch} />
                    </div>
                </div>
                
            </div>
            
        </>
        
    );
};

export default SearchBar;