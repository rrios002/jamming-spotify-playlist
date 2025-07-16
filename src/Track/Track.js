//Track
import React, { useState, useEffect } from 'react';
import Button from "./Button";

function Track(props){

    if (Array.isArray(props.playlist)){
        console.log("Is an array!");
    } else {
        console.log("is not an array");
    };

    const objectList = props.playlist.map((track) =>{
            
            return (<li key={track.id}>
                <div>
                    <p>{track.name}</p>
                    <p>{track.artist}</p>
                    <p>{track.album}</p>
                    <p>{track.id}</p>
                    <Button text="=>" value={track.id} onClick={props.onClick} />
                </div>
            </li>)
        });
        
        console.log(objectList);
        return <ul>{objectList}</ul>;
    
    
    };
    

    

export default Track;