var scrape = require('./scraper.js');
var scripts = require('./scripts.js');
var rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

var targetDate = scripts.date(Number(process.argv.slice(-1)[0]) || 0);
  
scrape(targetDate, function (err, data) {
  if ((new Date).getDay() === 0) {
    console.log('\nToday is Sunday, you goof!\n');
    rl.close();
  } else if (err) {
    console.error(err);
    rl.close();
  } else if (process.argv.includes('broadcast')) {
    console.clear();
    console.log(data);
    rl.question('\nAre you sure you want to send this e-mail? (Y/N) ',
    function (answer) {
      answer = answer.toUpperCase();
      if (answer === 'Y' || answer === 'YES') {
        // scripts.sendEmail(data);
        console.log('\nE-mail sent!\n\n');
        rl.close();
      } else {
        console.log('\nAborting...\n\n');
        rl.close();
      }
    });
  } else {
    console.log(data);
    console.log('');
    rl.close();
  }
});


