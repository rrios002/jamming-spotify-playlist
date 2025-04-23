//Search Results
import React, { useState } from 'react';
import Button from './Button';

//a function that will display search results as a list. The ID: 0 is at the top, going downward.
function SearchResults(props){

    //used to hold the current search results, whose format is an array of objects
    //will also change when a user moves track objects to the custom playlist column
    const [currentResults, setCurrentResults] = useState(props.list);

     //a function to hold a given array in mapped form. A key for each individual element is included
     const mappedList = currentResults.map((track) =>{
        return <li key={track.id}>
            <div>
                <p>{track.name}</p>
                <p>{track.artist}</p>
                <p>{track.album}</p>
                <p>{track.id}</p>
                <Button text="=>" value={track.id} onClick={sliceTrack} />
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

    //a function that will slice a track off the currentResults array using the given track ID
    const sliceTrack = (event) => {
        const slicedTrackIndex = mappedList.indexOf(event.target.value);
        console.log(`This is the index of the button you pressed ${slicedTrackIndex}`);
    };

   

    const handleDisplay = (pageNumber) => {
        let displayArray = [];

        for (let i=((pageNumber * 10) - 10); i<(pageNumber * 10); i++){
            displayArray.push(mappedList[i]);
        }
        return displayArray;
    };
    
    return (
        <>
        <ul>{handleDisplay(pageNumber)}</ul>
        <div>
            <Button text='Previous 10' onClick={prevPage}/>
            <Button text='Next 10' onClick={nextPage} />
        </div>
        <h3>This is the current page number: {pageNumber}</h3>
        </>
    );

};

export default SearchResults;