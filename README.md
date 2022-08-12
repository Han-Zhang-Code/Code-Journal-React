# Code Journal React

A web application for coders who want to recored their code journal entries.

This project is a milestone for me to demonstrate what I have learnt so far in the final phase of boot camp, it accumated all necessary concepts of building a full stack website with React Library. 

[Link to the App](https://code-journal-react.herokuapp.com/)

## Technologies used:
  1. HTML
  2. CSS
  3. JavaScript 
  4. React.js
  5. Node.js
  6. Express.js
  7. PostgreSql
  8. Media Querry
  9. Babel
  10. Argon2
  11. Codemirror
  12. react-codemirror2
  13. Nodemon
  14. FrontAwesome
  15. Webpack
  16. Google Fronts
  17. Meta Tags for Social Media
  18. Hash Routing
  
  
## Features:
  1. User can code on HTML, CSS, and JavaScript sections and receive result
  2. User can save their code with title, picture, and description
  3. User can view their code entries
  4. User can view the detail of their code entries 
  5. User can edit their code entries 
  6. User can delete their code entries
  7. User can sign up 
  8. User can sign in
  9. User can sign out
  10. User can only view their own code entries
  11. User can share their code entry with other users and other users can only view the entry
  12. User can share their code entry with other users and other users can edit the entry 
  13. User can search their entries 
  14. User can sort their entries by Alphabet, Create Time or Size of the entry       
  15. User can post their comments
  16. User can view their comments

  
  
## Demo

![Aug-12-2022 10-51-44](https://user-images.githubusercontent.com/103379415/184417662-31a4b5f0-6c8b-4459-9399-269ea2c98208.gif)

![Aug-12-2022 11-03-45](https://user-images.githubusercontent.com/103379415/184417728-e743ef50-6838-45f4-aa60-ec8e81c9b013.gif)



## Stretch Features:
  1. User can change the app theme by one click


## Instruction:

### Gettting Started
  1. Read through the `dependencies` listed in `package.json` and install everything with `npm install`.
  2. Make a copy of the provided `.env.example` file. Name your copy `.env.`
  ```
      cp .env.example .env
  ``` 
### Database Setup
  1. make sure that `postgresql` is running
    Start the `postgresql`:
    
```
    sudo service postgresql start
```

    Check the `postgresql`:
    
```
    sudo service postgresql status
```

    Stop the `postgresql`:
    
```
    sudo service postgresql stop
```
  2. Create a new database named `codejournal`
```
    createdb codejournal
```
  3. Read the code in the provided `database/schema.sql` and `database/data.sql`, as well as the commands in the provided `databse/db-import.bash` file. Then import the database schema and test data using the provided `"db:import"` script in `package.json`.
```
    npm run db:import
```
