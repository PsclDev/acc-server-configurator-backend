This is a small SPA for the game Assetto Corsa Competizione. In it you can host your own servers and set the server settings via JSON files.

### Theoretical part:
This app simplifies the process and allows multiple people to change settings without needing direct access to the server.

Also, it is no longer necessary to know the structure of JSON files or to create an invalid JSON file due to manual editing.

It is possible to change all the settings that the game offers with this app and then activate them on the server.

It is also possible to change the entry list for the server or to distribute admin rights to users. As a small nice to have, a connection to the STEAM API was created to display the current user names from the user IDs.

As the last big area a result page was introduced. The game creates a Result JSON for each race session, this is visualized nicer and you can see all the information about the race.

### Technical part:
The project was realized with Vue3, VueX, Vue Router and Axios for the frontend and NestJS as REST API in the backend.
With the help of JWT a user authentication was created to not allow every user of the website to make server settings.
