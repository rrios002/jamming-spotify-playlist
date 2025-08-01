"use client";
import React, { useEffect } from "react";
import Button from "../Button/Button.js";
import * as styles from "./Authorize.module.css";



function Authorize (props) {
    //This component will be accessing the Spotify API using the Authentication Flow using PKCE method of authentication

    //the client ID from the Spotify developers page for your web app
    const clientID = "43b4315301e740c0804bf54d064f36f8";
    //the redirect URL when you are authenticated; must be https or a local URL
    const redirectURL = "http://[::1]:4000/";
    
    //The URLs that access the endpoints needed to get authorization to obtain resources
    const authorizationEndpoint = "https://accounts.spotify.com/authorize"; //Get an authorization grant
    const tokenEndpoint = "https://accounts.spotify.com/api/token"; //Get an access token

    //scopes allow you to access and change different areas of a User's account
    const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public';

    //the currentToken object manages a user's active token (access credentials)
    const currentToken = {
        //get methods for accessing tokens
        get accessToken() {
            return localStorage.getItem("access_token") || null;
        },
        get refreshToken() {
            return localStorage.getItem("refresh_token") || null;
        },
        get expiresIn() {
            return localStorage.getItem("refresh_in") || null;
        },
        get expires() {
            return localStorage.getItem("expires") || null;
        },

        //the following key-value pair is a function, and will store 
        //access tokens and the time values that keep track of a token's validity
        save: function (response) {
            console.log(`Here is the response at the save function`);
            console.log(response);
            const {access_token, refresh_token, expires_in} = response;
            //using the localStorage setItem method to store tokens and expiration information across browser sessions
            //its syntax is setItem(keyName, keyValue) where keyName and keyValue are both string types
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("expires_in", expires_in);
            
            //each token has valid credentials for one hour (3600 seconds). Using the current time (in ms)
            //and the expiresIn time, we can calculate when the token will expire and store that time value for later
            const now = new Date();//creates a new Date object; the time is expressed in milliseconds (ms)
            //takes the current time and adds 3600000 milliseconds to get the future expiration time of the token
            const expires = new Date(now.getTime() + (expires_in * 1000));
            //set the new expiration time in memory
            localStorage.setItem("expires", expires);
            setTimeout(() =>{
                refreshHandler();
            },3000*1000);


        }
    };

    //This code executes 2nd after redirectToSpotifyAuthorize()
    //On page load, try to extract the authorization code from the current browser URL
    const URLsearching = new URLSearchParams(window.location.search);
    //now we parse the URL to obtain the auth code:
    const code = URLsearching.get("code");

    //if statement checks to see if a code is present
    if (code) {
        
        async function getTokenFunction (code){
            console.log(`here is the code`);
            console.log(code);
            const token = await getToken(code);
            console.log(`Here is the token after using getToken`);
            console.log(token);
            return token;
        };

            
        //using the getToken function to obtain an access token from Spotify
        let tokenObject = {};
        getTokenFunction(code).then(response => {
            console.log(`Here is the token at the then promise`);
            console.log(response);
            currentToken.save(response);//saving the token object to currentToken for later use
            tokenObject = response;
            return;
         });
         //Adding a delay to allow time for the token object to obtain values
         setTimeout(() => {
            console.log(`Here is the token in its entirety`);
            console.log(tokenObject);
            console.log(`Let's obtain the access token directly from the token object`);
            console.log(tokenObject.access_token);
            console.log(`Here is the access token recieved by Spotify`);
            console.log(currentToken.accessToken);
            console.log(typeof currentToken.accessToken);

         },1000);
        
        //we need to clear 'code' from the URL so we can refresh the browser correctly
        const url = new URL(window.location.href);//window.location.href returns the current URL, it saves to url
        url.searchParams.delete("code");//searchParams searches for the "code" string and its value, then deletes it from the URL

        const updatedURL = url.search ? url.href : url.href.replace("?", ""); /*updatedURL checks to see if url has a query string.
        If it does, then updated url will be set to the full current URL. If it does not (false), then the "?" in the query string
        will be replaced with a "".*/
        
        window.history.replaceState( {}, document.title, updatedURL );//this helps prevent the browser from navigating to the URL that
        //previously had the "code" in it. the syntax for replaceState is: replaceState(state, unused, url).
    };

    //if statement checks to see if there is an access token in memory:
    /*
    if (currentToken.accessToken){
        const userData = await getUserData();
    };
    */
    
    //This code executes 1st to obtain an access code...
    //the following code comes directly from the Spotify webpage "Authorization Flow with PKCE" 
    async function redirectToSpotifyAuthorize(){
        //Code Verifier
        const possibleValues = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const randomValues = crypto.getRandomValues(new Uint8Array(64));//generates an array of random integers (0-256) 64 elements long

        /*The randomString variable will take the randomValues array of integers, and for each element, will perform modulo
        math on it. This calculation will determine which element in the possibleValues string to select. This selected
        character from possibleValues will get added to the end of randomString, forming a completely new string. */
        const randomString = randomValues.reduce((acc, ele) => acc + possibleValues[ele % possibleValues.length], "");
        console.log(`Here is randomString ${randomString}`);
        const codeVerifier = randomString;
        const data = new TextEncoder().encode(codeVerifier);//The TextEncoder will encode the codeVerifier string into UTF-8 binary
        const hashed = await crypto.subtle.digest("SHA-256", data);//hashed takes the UTF-8 bytes and converts it into a SHA-256 digest
        console.log(`Here is hashed: ${hashed}`);
        const codeChallenge_Base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))//btoa is a component of the Window interface. It converts base 64 to ASCII 
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        window.localStorage.setItem("code_verifier", codeVerifier);//saves the randomString from earlier for later use
        console.log(`Here is code_challenge: ${codeChallenge_Base64}`);
        /*From the Spotify API Documentation, we can now request User Authorization
        authURL is the Spotify API Authorization endpoint. The params object contains data required by Spotify to authenticate.
        */
        const authURL = new URL(authorizationEndpoint);
        const params = {
            response_type: "code",
            client_id: clientID,
            scope: scope,
            code_challenge_method: "S256",
            code_challenge: codeChallenge_Base64,
            redirect_uri: redirectURL
        };

        authURL.search = new URLSearchParams(params).toString();//takes the params object, and converts it into a query string and adds it to authURL
        window.location.href = authURL.toString();//the browser will now redirect to the Spotify authorization endpoint URL with the params query string for user login    
    };
    
    //This code executes 3rd after the 1st 'if' statement and directly inside the getTokenFunction() code
    /*Now making a call to the Spotify API at the token endpoint using the code supplied by the query string that was returned
     when we navigated to the authorization endpoint and logged it. This will return us an Access Token*/
    async function getToken(code){
        const codeVerifier = localStorage.getItem("code_verifier");
        console.log(`Here is the code Verifier at the getToken function`);
        console.log(codeVerifier);

        //Now doing an http request to Spotify Token endpoint
        const response = await fetch(tokenEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientID,
                grant_type: 'authorization_code', 
                code: code,
                redirect_uri: redirectURL,
                code_verifier: codeVerifier
            })
        });
        console.log(`Here is the response of getToken:`);
        console.log(response.ok);
        return await response.json();

    };

    //Here we can obtain a new token when the old one expires

    async function refreshToken (){
        const refreshToken = currentToken.refreshToken;
        console.log(`Here is the refresh token at refreshToken`);
        console.log(refreshToken);
        const tokenEndpointURL = tokenEndpoint;

        const refreshInfo = {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                    client_id: clientID
                  })
        };

        const request = await fetch(tokenEndpointURL, refreshInfo);
        const response = await request.json();
        return response;
 

    };

    //clickHander for logging in
    async function loginWithSpotifyClick() {
        await redirectToSpotifyAuthorize();
    };

    //clickHandler function for refreshToken
    async function refreshHandler(){
        const data = await refreshToken();
        currentToken.save(data);
        props.getRefresh();
    };

    async function logoutClick(){
        localStorage.clear();
        window.location.href = redirectURL;
    }

    
    return (
        <>
        <div className={styles.buttonContainer}>
            <Button text="Log In" onClick={loginWithSpotifyClick} />
            <Button text="Log Out" onClick={logoutClick} />
        </div>
        
        </>
    );


};

export default Authorize;