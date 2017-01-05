console.log(process.argv)

var todaysDateToGoogleNumber = function (incrementBy) {
  if (typeof incrementBy !== typeof 7) {
    incrementBy = 0;
  }
  return Math.floor(Date.now() / 1000 / 60 / 60 / 24) + 6930 + incrementBy;
};


///////////////////////////////////////////////////////////////////////////


var hackersInResidence = {
  'hir.1@hackreactor.com': 'Jon Garrett',
  'hir.2@hackreactor.com': 'Eric Zolayvar',
  'hir.3@hackreactor.com': 'Chad Springer',
  'hir.4@hackreactor.com': 'Bill Zito',
  'hir.5@hackreactor.com': 'Robin Kuehn',
  'hir.7@hackreactor.com': 'Brian Kilrain',
  'hir.8@hackreactor.com': 'Jordan Taylor',
  'hir.9@hackreactor.com': 'Julie Truong',
  'hir.10@hackreactor.com': 'Dylan Larrabee',
  'hir.11@hackreactor.com': 'Hans Trautlein'
};

var nameOf = function (email) {
  if (hackersInResidence[email]) {
    return hackersInResidence[email];
  } else {
    throw new Error('That\'s not a valid email!');
  }
};


//////////////////////////////////////////////////////////////////////////

var credentials = require('./credentials.js');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('smtps://' + credentials.username + ':' + credentials.password + '@smtp.gmail.com');

var mailOptions = {
  from: '"Eric Zolayvar" <eric.zolayvar@hackreactor.com>',
  to: ['sfm.technical.mentors.team@hackreactor.com', 'sfm.counselors.team@hackreactor.com'],
  subject: 'HiR Free Hours',
};

var random = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var r = function (...input) {
  if (input.length === 1 && Array.isArray(input[0])) {
    input = input[0];
  }

  return random(input);
};

var generateEmailBody = function (array) {
  if (!array.length) {
    mailOptions.subject = 'No Free HiRs';
    mailOptions.text = 'All of our HiRs are all fully booked today.\n\nSorry!\nEric Zolayvar';
  } else if (array.length === 1) {
    mailOptions.text = [
      r('Good morning', 'Hello', 'Howdy', 'Salutations', 'Hi', 'Greetings') + ', ' + r('everybody', 'everyone', 'y\'all') + '!\n',
      '\n',
      r('Today', 'For all of today', 'For today') + ' ' + r('we only have', 'there is only', 'we\'ve only got') + ' one ' + r('open interview slot', 'unbooked interview', 'free interview slot') + '.\n',
      array[0].hacker + ' ' + r('will be free', 'will be available', 'has a free hour', 'will have a free hour') + ' during ' + array[0].time + '.\n',
      '\n',
      'Thanks!\n',
      'Eric Zolayvar'
    ].join('');
  } else if (array.length === 2 && array[0].hacker === array[1].hacker) {
    mailOptions.text = [
      r('Good morning', 'Hello', 'Howdy', 'Salutations', 'Hi', 'Greetings') + ', ' + r('everybody', 'everyone', 'y\'all') + '!\n',
      '\n',
      r('Today', 'For all of today', 'For today') + ' ' + r('we have', 'there are', 'we\'ve got') + ' two ' + r('open interview slots', 'unbooked interviews', 'free interview slots') + '.\n',
      array[0].hacker + ' ' + r('will be free', 'will be available', 'has a free hour', 'will have a free hour') + ' during ' + array[0].time + ' and ' + array[1].time + '.\n',
      '\n',
      'Thanks!\n',
      'Eric Zolayvar'
    ].join('');
  } else if (array.length === 2 && array[0].hacker !== array[1].hacker) {
    mailOptions.text = [
      r('Good morning', 'Hello', 'Howdy', 'Salutations', 'Hi', 'Greetings') + ', ' + r('everybody', 'everyone', 'y\'all') + '!\n',
      '\n',
      r('Today', 'For all of today', 'For today') + ' ' + r('we have', 'there are', 'we\'ve got') + ' two ' + r('open interview slots', 'unbooked interviews', 'free interview slots') + '.\n',
      array[0].hacker + ' ' + r('will be free', 'will be available', 'has a free hour', 'will have a free hour') + ' during ' + array[0].time + '.\n',
      array[1].hacker + ' ' + r('will also be free', 'will similarly be available', 'also has a free hour', 'will also have a free hour') + ' during ' + array[1].time + '.\n',
      '\n',
      'Thanks!\n',
      'Eric Zolayvar'
    ].join('');
  } else {
    mailOptions.text = [
      r('Good morning', 'Hello', 'Howdy', 'Salutations', 'Hi', 'Greetings') + ', ' + r('everybody', 'everyone', 'y\'all') + '!\n',
      '\n',
      r('Today', 'For all of today', 'For today') + ' ' + r('we have', 'there are', 'we\'ve got') + ' ' + r('some', 'a few') + ' ' + r('open interview slots', 'unbooked interviews', 'free interview slots') + '. ' + r('They are as follows', 'They are listed below') + ':\n',
      array.map(function (slot) {
        return slot.hacker + ': ' + slot.time;
      }).join(',\n'),
      '\n',
      'Thanks!\n',
      credentials.signature
    ].join('');
  }
};

var submitEmail = function () {
  transporter.sendMail(mailOptions, function (error, response) {
    if (error) {
      throw new Error(error);
    } else {
      console.log('\nE-mail sent!\n\n');
      // console.log(response);
    }
  });
}

var sendEmail = function (data) {
  generateEmailBody(data);

  console.clear();
  console.log(data);
  if (process.argv.includes('f')) {
    console.log('\nE-mail sent!\n\n');
    // submitEmail();
  } else {
    var rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('\nAre you sure you want to send this e-mail? (Y/N) ', function (answer) {
      answer = answer.toUpperCase();

      if (answer === 'Y' || answer === 'YES') {
        console.log('\nE-mail sent!\n\n');
        // submitEmail();
      } else {
        console.log('\nAborting...\n\n');
      }

      rl.close();
    });
  }

};


//////////////////////////////////////////////////////////////////////////

console.clear = function () {
  var whiteScreen = '';
  while (whiteScreen.length < 1000) {
    whiteScreen += '#';
  }
  console.log(whiteScreen);
  console.log('\033[2J');
};

//////////////////////////////////////////////////////////////////////////

module.exports = {
  date: todaysDateToGoogleNumber,
  nameOf: nameOf,
  sendEmail: sendEmail
};

