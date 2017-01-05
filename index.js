var scrape = require('./scraper.js');
var scripts = require('./scripts.js');


var targetDate = scripts.date(Number(process.argv.slice(-1)[0]) || 0);
  
scrape(targetDate, function (err, data) {
  if ((new Date).getDay() === 0) {
    console.log('\nToday is Sunday, you goof!\n');
  } else if (err) {
    console.error(err);
  } else if (process.argv.includes('broadcast')) {
    scripts.sendEmail(data);
  } else {
    console.log(data);
    console.log('');
  }
});


