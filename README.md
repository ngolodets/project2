# Project 2
## National Park Trip Planner

For this project, express authentication template using Passport + flash messages + custom middleware was used as a starting point.

## Project Description:

The purpose of this app is to help user plan a trip to the national parks located within the US.  After logging in or signing up, the user may select a state that they would like to visit and search through all the national parks located in that selected state.  

The user may add any (and as many as they desire) parks from the list pulled from the National Parks API.  Additionally, the user may have many trips (note: the trips are categorized by state).  Moreover, the user can view and edit all the potential trips -- they may delete the trip destination and/or delete the parks from a particular trip.

## Used in the Project:
HTML, CSS, JavaScript, Postgress, external API, Heroku.

## Planning Details
### Models:
This project utilizes three models - user, trip, and park. User can have many trips, but the trips belong to one user.  Additionally, there can be many parks in one trip and the same park can belong on different trips. 
![Models](public/img/models.jpg) 

### Wireframe:
![Main_Index_and_Auth](public/img/main_index_and_auth.jpg)
![Profile_and_Parks_Index](public/img/profile_and_parks_index.jpg)
![Parks_and_Trips_Index](public/img/parks_and_trips_index.jpg)
![Parks_and_Trips_Show](public/img/parks_and_trips_show.jpg)

#### Scaffold w/tests (see `master` branch)

