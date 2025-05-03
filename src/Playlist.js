//Playlist
//Includes a 'Save to Spotify' Button
import React, { useState } from 'react';
import Button from './Button';

function Playlist(props){
    //this will hold the current list as displayed to the user:
    const [userList, setUserList] = useState(props.userList);

    if(userList){
        console.log(`List is here: ${userList.name}`);
    };

    const mappedUserList = userList.map((track) => {
        console.log(`Here is the track at the Playlist component: ${track.name}`);
        return <li key={track.id}>
        <div>
            <p>{track.name}</p>
            <p>{track.artist}</p>
            <p>{track.album}</p>
            <p>{track.id}</p>
            <Button text="X" value={track.id} onClick={setUserList}/>
        </div>
    </li>;
    });

    
    return (
        <>
        <h2>Here are the tracks the user has selected:</h2>
        <ul>{mappedUserList}</ul>
        </>
    )
};

export default Playlist;