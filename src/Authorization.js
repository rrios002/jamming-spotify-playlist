import React from "react";

async function Authorization (props){
  //Gaining access to the Spotify API using Authentication Flow with PKCE.

/*The client ID for your Spotify Application*/
const clientID = 'yourClientIDGoesHere'; // Your clientID from the Spotify Dev App page. 
const redirectURL = 'http://[::1]:4000/';        // your redirect URL - must be local URL and/or HTTPS

/*The URLs that access and receive authorization to get resources*/
const authorizationEndpoint = "https://accounts.spotify.com/authorize"; //Get an authorization grant
const tokenEndpoint = "https://accounts.spotify.com/api/token"; //Get an access token

/*Scopes can be changed by reading the Scopes Documentation*/
const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public';

// Data structure that manages the current active token, caching it in localStorage
/*currentToken is an object that manages the current active token.
It holds the credentials we need to access Spotify resources.
It uses get and set methods to access each variable respectively*/
const currentToken = {
    get access_token() { 
        return localStorage.getItem('access_token') || null; 
    },
    get refresh_token() { 
        return localStorage.getItem('refresh_token') || null; 
    },
    get expires_in() { 
        return localStorage.getItem('refresh_in') || null 
    },
    get expires() { 
        return localStorage.getItem('expires') || null 
    },
    
    //the "save" key accesses a function that saves a json response to localStorage and keeps track of the time that it remains valid
    save: function (response) {
      const { access_token, refresh_token, expires_in } = response;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expires_in);
      
      /*Each Token has valid credentials for 1 hour (3600 Seconds); the following functions and variables keep track of the token's age (t < 3600) */
      const now = new Date(); //Date object uses milliseconds (ms) since Epoch date
      const expiry = new Date(now.getTime() + (expires_in * 1000)); //expires_in === 3600
      localStorage.setItem('expires', expiry);
    }
  };


// On page load, try to fetch auth code from current browser search URL
const args = new URLSearchParams(window.location.search);
//Parses the URL
const code = args.get('code');

// If we find a code, we're in a callback, do a token exchange
if (code) {
    const token = await getToken(code); //waits for getToken to return a code
    currentToken.save(token); //saves the 'token' object to the currentToken object
  
    // Remove code from URL so we can refresh correctly.
    const url = new URL(window.location.href); //window.location.href returns the current URL, it saves to 'url'
    url.searchParams.delete("code"); //searchParams.delete searches for the 'code' string and its value,  and deletes it
  
    const updatedUrl = url.search ? url.href : url.href.replace('?', ''); /*checks if the current URL has a query string. if it does (true)
    then updatedURL will be set to the full current URL. If it does not have a query string, then updatedURL will replace the '?' with a
    blank space */
    window.history.replaceState({}, document.title, updatedUrl); //this helps prevent the browser from navigating back to the URL that has the 'code' string from earlier
  }

// If we have a token, we're logged in, so fetch user data and render logged in template
if (currentToken.access_token) {
    const userData = await getUserData(); //getUserData is a function defined below
    //renderTemplate("main", "logged-in-template", userData); //renderTemplate is a function defined below
    //renderTemplate("oauth", "oauth-template", currentToken);


  }

  //Call this if we're not logged in:
  if (!currentToken.access_token){

  };

/*The following code comes directly from the Spotify webpage 'Authorization flow with PKCE'*/
async function redirectToSpotifyAuthorize() {

    //Code Verifier
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64)); //generates an array of random integers (0-256) 64 elements long
  
    /*randomString will take the randomValues array of integers and for each index, will perform modulo math on the current value.
    This will determine which character in the 'possible' string to add to the randomString array */
    const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");
  
    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);//The TextEncoder interface is part of the Encoding API and takes an input string and outputs UTF-8 bytes.
    const hashed = await crypto.subtle.digest('SHA-256', data);//hashed takes the UTF-8 bytes from the 'data' variable and converts it into a SHA-256 digest
  
    const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))//btoa is a method of the Window interface that converts base64 to ASCII.
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  
    window.localStorage.setItem('code_verifier', code_verifier); //saves randonString from earlier in localStorage for later use
  
    /*From the Spotify API Documentation, this part is for requesting user authorization
    authURL is the Spotify API authorization endpoint. The params object contains information required by Spotify when
    requesting user authorization. Most of this is information that can be found on the webpage*/
    const authUrl = new URL(authorizationEndpoint)
    const params = {
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      code_challenge_method: 'S256',
      code_challenge: code_challenge_base64,
      redirect_uri: redirectUrl,
    };
  
    authUrl.search = new URLSearchParams(params).toString(); //takes the params object, and converts it to a a query string; also updates the window.location object value
    window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login; the new address being the endpoint URL + params query string
  }

// Spotify API Calls
async function getToken(code) {
    const code_verifier = localStorage.getItem('code_verifier');
  
    //http request from the Spotify API token endpoint:
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUrl,
        code_verifier: code_verifier,
      }),
    });
  
    return await response.json();
  }

//obtain a new token if more time is required
async function refreshToken() {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'refresh_token',
        refresh_token: currentToken.refresh_token
      }),
    });
  
    return await response.json();
  }

//Obtain user profile information
async function getUserData() {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
    });
  
    return await response.json();
  }
  
// Click Handler
async function loginWithSpotifyClick() {
    await redirectToSpotifyAuthorize();
  }
  
//Click Handler
async function logoutClick() {
    localStorage.clear();
    window.location.href = redirectUrl;
  }
  
//Click Handler
async function refreshTokenClick() {
    const token = await refreshToken();
    currentToken.save(token);
    renderTemplate("oauth", "oauth-template", currentToken);
  }
};

export default Authorization;

