# FreeCodeCamp Exercise Tracker

> Fourth of five projects required to earn the **API and Microservices** certification @freeCodeCamp.

<!-- Link to the working pen for the UI of the application [right here](). -->

<!-- Link to the working glitch for the actual, functioning application [right here](). -->

## Preface

With this project I am tasked to create a full-stack JavaScript application, similar to the one [referenced by @freecodecamp](https://fuschia-custard.glitch.me/).

It is a simple application, which allows any visitor to:

1. create a new user;

1. register an exercise for an existing user;

1. retrieve a list of exercises for an existing user.

This last feature may not be obvious from the UI of the homepage, but it is connected to the back-end profile of the project. As a matter of fact, all features are tightly coupled with `Node.js`, as the forms produce `POST` request themselves, while the last mentioned features is based on a `GET` request, pinging the application at a specific endpoint.

Looking briefly at the application, it does not seem to far off from the previous project, the [**URL Shortener Microservice**](https://various-umbrella.glitch.me/). It is necessary to work with **MongoDB** and specifically **Mongoose**, perhaps with addditional care and consideration in the structure of the schema, models and documents for the database entries. 
