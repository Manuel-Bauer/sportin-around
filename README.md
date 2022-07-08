[Sportin' around](https://sportin-around.web.app)

## About The Project

**Sportin' around** makes it easy and to plan sports tournaments among your friends and track the results. 

You are able to plan a tournament ahead of time and let your friends know about it. 
Once everyone is signed up, you can start the tournament and **Sportin' around** will automatically create a schedule for it. While playing, the app gives you the opportunity to enter the results as you go - and everyone else full transparency about the current live standings. When you are finished you are able to lock tournament results and finally get rid of endless discussions about who had won!

## Getting started

```
npm install
npm run dev (emulators)
or
npm run start (live server)
```

## Backend

This app runs on Firebase. To set it up follow the instructions at [Firebase](https://firebase.google.com/docs/guides).

## Environment Variables

The app uses [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) for the autocompletion of the location. Save the API as REACT_APP_MAPS_API_KEY=*APIKEY* at .env.local in the root folder.
