# Personal Portfolio Management

The application could easily cater to an individual (and a developer web developer :)) interested in
Indian stock market but doesn’t like clutter of free portfolio management services. Apart from running
locally on his own machine, user could choose to host it on Heroku (http://www.heroku.com) or AWS BeanStalk
(https://aws.amazon.com/elasticbeanstalk). 

Please follow the steps given on Heroku or AWS BeanStalk for Node.js stack to host the application.
Tip: On Heroku, one gets an app instance (called dyno) free which is sufficient to host the application.
Note that you would need a MongoDB Add-on (choose MongoLab & its sandbox edition) to provide database for
the app. For any issues you can refer to this blog: [Deploying a MEAN Stack Application to Heroku] (http://www.tilcode.com/deploying-a-mean-stack-app-to-heroku/).
An instance is running [here] (https://glacial-caverns-55839.herokuapp.com/)

The application is built to manage user's own portfolio, hence there is no authentication feature.

**Note: This application does not meant to buy or sell stocks.**

The application having pre-created lists with names as follows:

- Holdings
- Watch List
- Past Holdings

These pre-created lists could not be removed. The "Holdings" list will be selected by default.
User will be able to create their own lists and also remove user-created lists.

User could change exchange using drop down which have BSE and NSE options. The BSE is selected
by default. The application supports only BSE and NSE exchanges.

User will be able to search stocks and add them to selected list. The application is showing following
information about added stocks:

- Company Name
- Price
- Change in Points
- Day High
- Day Low
- Year High
- Year Low

The application is getting information about stock from Yahoo Finance webservice. User will also be
able to perform following actions:

- Remove stock from selected list
- Move stock from selected list to another list

Also, their are some special actions for "Holdings" and "Watch List" lists. The "Holdings" list
having "Sold" button, when user sell any stock (using any other application) and user wants to
update their portfolio. Then user will click on "Sold" button and that stock will be moved from "Holdings"
list to "Past Holdings" list.

Similarly, "Watch List" having "Bought" button. When user buy any stock (using any other application) and
user wants to update their portfolio. Then user will click on "Bought" button and that stock will be
moved form "Watch List" list to "Holdings" list.

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