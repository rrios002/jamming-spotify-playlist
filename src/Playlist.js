//Playlist
//Includes a 'Save to Spotify' Button
import React, { useEffect, useState } from 'react';
import Button from './Button';

function Playlist(props){
    //this will hold the current list as displayed to the user:
    const [userMadeList, setUserMadeList] = useState(props.userList);
    //useEffect will synchronize changes in the userPlaylist state variable located in App.js
    useEffect(() =>{
        setUserMadeList(props.userList);
    }, [props.userList]);

    //a clickhandler function that will remove the selected track from the custom playlist
    const clickHandler = (event) => {
       
        const trackIndex = event.target.value;
        const selectedTrack = [];
        const results = userMadeList.findIndex((track) => (track.id == trackIndex));
        console.log(`here is the index deom cusome lplaylit arrea`)
        selectedTrack.push(userMadeList[results]);
        //props.cancelTrack(trackIndex);
        
        setUserMadeList(() =>{
            return userMadeList.filter((track) =>{
                return track["id"] !== selectedTrack[0]["id"];
            });
        })
         
    };

    //mapping the custom playlist to jsx tags that will be displayed back to App
    const mappedUserList = userMadeList.map((track) => {

        console.log(`Here is the track at the Playlist component: ${track.name}`);
        return <li key={track.id}>
        <div>
            <p>{track.name}</p>
            <p>{track.artist}</p>
            <p>{track.album}</p>
            <p>{track.id}</p>
            <Button text="X" value={track.id} onClick={clickHandler} />
        </div>;
    </li>
    });

    
    return (
        <>
        <h2>Here are the tracks the user has selected:</h2>
        <ul>{mappedUserList}</ul>
        </>
    )
};

export default Playlist;