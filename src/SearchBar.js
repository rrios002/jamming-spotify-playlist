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
    

    return (
        <>
            <h1>Enter a song name!</h1>
            <form>
                <label htmlFor='textInput'></label>
                <input id='textInput' type='text' onChange={handleChange} value={track}></input>
            </form>
            <Button text='Search' value={track} onClick={props.onClick}/>
            <h1>Here is the song name: {track}</h1>
        </>
        
    );
};

export default SearchBar;