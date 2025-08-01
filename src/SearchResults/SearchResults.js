//Search Results
import React, { useState, useEffect } from 'react';
import Button from '../Button/Button.js';
import * as styles from "./SearchResults.module.css";

//a function that will display search results as a list. The ID: 0 is at the top, going downward.
function SearchResults(props){

    //used to hold the current search results, whose format is an array of objects
    //will also change when a user moves track objects to the custom playlist column
    const [currentResults, setCurrentResults] = useState(props.list);

    useEffect(() => {
        setCurrentResults(props.list);
        console.log(`Here is the currentResults array after UseEffect has been called on in searchResults`);
        console.log(currentResults);
        
    },[props.list])

   
    const sliceTrack = (event) => {
        let trackIndex = event.target.value;
        //let selectedTrack = [];
        console.log(`This is the value that will be searched for from setTrack ${trackIndex}`);
        const results = currentResults.findIndex((track) => track.id == trackIndex);
        console.log(`This is the value obtained by using findIndex: ${results}`);
        console.log(currentResults[results]);
        //we need the following to add to the custom user-made playlist
        props.getTrack(results);
        console.log(`Here is the track that corresponds to the index received: ${currentResults[results].name}`);
        //selectedTrack.push(currentResults[results]);
        //we're just verifying that we got the right track object
        //console.log(`This is the track that was extracted from the searchResults ${selectedTrack[0]["name"]}`);
        //console.log(`${selectedTrack[0]["id"]}`);
        //let getID = pickedTrack.id;
        //now we need to make sure that currentResults now only displays the rest of the tracks array, minus the one that was clicked by user
        /*setCurrentResults(() => {
            return currentResults.filter((track) => {
                return track.id !== selectedTrack[0]["id"] ;
            })
        });
        */

    };

    //a function that maps the search results to jsx.
        const mappedList = currentResults.map((track) =>{
        
        return <li key={track.id}>
            <div className={styles.trackContainer}>
                <div className={styles.imageContainer}>
                    <img src={track.img} className={styles.image}  />
                </div>
                <div className={styles.trackInfo}>
                    <p>{track.name}</p>
                    <p>{track.artist}</p>
                    <p>{track.album}</p>
                </div>
                <Button text="Add" value={track.id} onClick={sliceTrack} />
            </div>
        </li>;
       
        });

     
    


    //used to hold the page number which will affect which part of the list array gets rendered to the user
    const [pageNumber, setPageNumber] = useState(1);
    //functions to change the page number and therefore the current results displayed
    
    const nextPage = () => {
        setPageNumber(prev => prev + 1)
        console.log(`This is the current page number ${pageNumber}`);
    };
    const prevPage = () => {
        if (pageNumber === 1){
            console.log(`This is the current page number already at ${pageNumber}`);
            return;
        }
        setPageNumber(prev => prev - 1);
        console.log(`This is the current page number ${pageNumber}`);
    };

   

   
    //This function will only display the tracks that are pertinent to the page number selected
    //The number of tracks are divided by 10 which yields the number of pages. 
    const handleDisplay = (pageNumber) => {
        let displayArray = [];

        for (let i=((pageNumber * 10) - 10); i<(pageNumber * 10); i++){
            displayArray.push(mappedList[i]);
        }
        return displayArray;
    };
    
    return (
        <>
        <div className={styles.searchResults}>
            <h3 className={styles.h3}>Displaying Results For: {props.userTrack}</h3>
            <ul className={styles.ul}>{handleDisplay(pageNumber)}</ul>
            <div className={styles.pageButtons}>
                <Button text='Previous 10' onClick={prevPage}/>
                <Button text='Next 10' onClick={nextPage} />
            </div>
            <h3 className={styles.h3}>Page {pageNumber}</h3>
        </div>
        
        </>
    );

};

export default SearchResults;