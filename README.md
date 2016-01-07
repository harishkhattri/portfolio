# Personal Portfolio
This is a personal porfolio management application in which user could add and remove stocks.
The application is showing following information about added stocks:

- Company Name
- Price
- Change in Points
- Day High
- Day Low
- Year High
- Year Low

The application is getting information about stock from Yahoo Finance webservice. The application
currently have only one hard-coded list named "Watch List". In future application will have
multiple lists and also user will be able to create list.

The user could change exchange using drop down which have BSE and NSE options. The BSE is selected
by default.

**Note: This application does not meant to buy or sell stocks.**

## Prerequisites
As this application is using MEAN stack (MongoDB, ExpressJs, AngularJs and Node.js), user needs to
install Node.js, npm and MongoDB on his local machine.

* User could install Node.js [from here] (https://nodejs.org/en/download/package-manager/).
* User could install MongoDB [from here] (https://docs.mongodb.org/manual/installation/).

## Running Application
After installing prerequisites, first user needs to start MongoDB using following steps:

* Start command prompt
* Go to location where MongoDB installed e.g. "c:\Program Files\MongoDB\Server\3.2\bin"
* Run `mongod --dbpath <path to \data\db directory>` command

Now user needs to start application using following steps:

1. Clone the code
2. Start another command propmt
3. Go to projects root directory
4. Run `npm install` command to install npm modules required for this application
5. Run `bower install` command to install bower components
6. Run `node server.js` command to start server
7. Visit the application in your browser at *http://localhost:8080*

**Note: Enable CORS (cross-origin resource sharing) settings in your browser**