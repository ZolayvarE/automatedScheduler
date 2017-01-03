var scrape = require('./scraper.js');
var scripts = require('./scripts.js');

var targetDate = scripts.date(0);

if ((new Date).getDay() !== 0) {
  scrape(targetDate, function (err, data) {
    if (err) {
      console.err(err);
    } else {
      console.log(data);
      // scripts.sendEmail([]);
    }
  });
} else {
  console.err('Today is Sunday, you goof!');
}


