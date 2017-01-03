var scripts = require('./scripts.js');
var Nightmare = require('nightmare');
var browser = new Nightmare({ 
  show: true 
});

var scraper = function (targetDate, callback) {

  browser
    .goto('https://calendar.google.com/calendar/render#main_7%7Csearch-1+' + 23943 + '+' + 23943 + '+' + 23943 + '-y++all+interview%20duty++++' + targetDate + '+' + targetDate + '+1+7')
    .wait(10000)
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
    .wait(10000)
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
      callback(error, null);
    });
    
};

module.exports = scraper;

