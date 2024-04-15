//const shell = require("shelljs")
const schedule = require('node-schedule');

    schedule.scheduleJob('*/10 * * * * *', () => {
        console.log('List new item');
        //const command = `npm run createListing`
        //shell.exec(command)
      });
      


//main()