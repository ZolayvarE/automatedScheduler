var scripts = require('./scripts.js');
var Nightmare = require('nightmare');
var credentials = require('./credentials.js');
var browser = new Nightmare({
  show: true
});

var scraper = function (targetDate, callback) {

  browser
    .cookies.clearAll()
    .goto('https://accounts.google.com/ServiceLogin')
    .cookies.set([{
      name: 'username',
      value: credentials.username,
      secure: false
    }, {
      name: 'password',
      value: credentials.password,
      secure: false
    }])
    .evaluate(function () {
      var cookies = {};
      document.cookie
        .split('; ')
        .forEach(function (cookie) {
          let equalsIndex = cookie.indexOf('=');
          let key = cookie.slice(0, equalsIndex);
          let value = cookie.slice(equalsIndex + 1);
          cookies[key] = value;
        });

      (function login () {
        if (document.querySelector('#Email')) {
          document.querySelector('#Email').value = cookies.username;
          document.querySelector('#next').click();
        }

        if (document.querySelector('#Passwd')) {
          document.querySelector('#Passwd').value = cookies.password;
          document.querySelector('#next').click();
        }
        
        if (document.querySelector('#next')) {
          setTimeout(login, 500);
        }
      })();
    })
    .wait(function () {
      return location.hostname !== 'accounts.google.com';
    })
    .goto('https://calendar.google.com/calendar/render#main_7%7Csearch-1+' + 23943 + '+' + 23943 + '+' + 23943 + '-y++all+interview%20duty++++' + targetDate + '+' + targetDate + '+1+7')
    .wait('.lv-event-time')
    .evaluate(function () {
      localStorage.removeItem('slots');

      var elements = document.querySelectorAll('.lv-event-time');
      
      var times = [];
      for (var i = 0; i < elements.length; i++) {
        times.push(elements[i].innerHTML);
      }

      elements = document.querySelectorAll('.lv-event-title');
     
      var hackers = [];
      for (var i = 0; i < elements.length; i++) {
        var start = elements[i].title.lastIndexOf('hir.') || 0;
        hackers.push(elements[i].title.slice(start));
      }

      var slots = [];
      for (var i = 0; i < times.length; i++) {
        slots.push({
          time: times[i],
          hacker: hackers[i]
        });
      }

      localStorage.slots = JSON.stringify(slots);
    })
    .goto('https://calendar.google.com/calendar/render#main_7%7Csearch-1+23943+23943+23943-y++all+applicant%20interview++++' + targetDate + '+' + targetDate + '+1+7')
    .wait('.lv-event-time')
    .evaluate(function () {
      var elements = document.querySelectorAll('.lv-event-time');
      
      var times = [];
      for (var i = 0; i < elements.length; i++) {
        times.push(elements[i].innerHTML);
      }

      elements = document.querySelectorAll('.lv-event-title');
     
      var hackers = [];
      for (var i = 0; i < elements.length; i++) {
        var start = elements[i].title.lastIndexOf('hir.');
        hackers.push(elements[i].title.slice(start));
      }

      var bookings = [];
      for (var i = 0; i < times.length; i++) {
        bookings.push({
          time: times[i],
          hacker: hackers[i]
        });
      }

      return {
        bookings: bookings,
        slots: JSON.parse(localStorage.slots)
      };
    })
    .end()
    .then(function (data) {
      while (data.slots[0] && data.slots[0].time.slice(-2) === 'pm') {
        data.slots.shift();
      }

      data.bookings = data.bookings.map(function (item) {
        return JSON.stringify(item);
      });

      var openSlots = data.slots.filter(function (item) {
        return !data.bookings.includes(JSON.stringify(item));
      });

      openSlots.forEach(function (item) {
        item.hacker = scripts.nameOf(item.hacker);
      });

      callback(null, openSlots);
    })
    .catch(function (error) {
      // console.log(error);
      callback(error, null);
    });
    
};

module.exports = scraper;

