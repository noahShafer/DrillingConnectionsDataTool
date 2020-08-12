// Dependencies
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format'); // adds durations formatting to moment library

// Container to hold helper functions
let helpers = {};

// Finds the amount of time passed between two dates
helpers.calcTimePassed = function(startingTime, endingTime) {
    let isoFormatedStartTime = helpers.convertToIsoFormat(startingTime);
    let isoFormatedEndTime = helpers.convertToIsoFormat(endingTime);
    let parsedStartTime = moment(isoFormatedStartTime);
    let parsedEndTime = moment(isoFormatedEndTime);
    return moment.duration(parsedEndTime.diff(parsedStartTime)).format('HH:mm:ss', {
      trim: false
    });
  }

  // Convert date(MM/DD/YYYY HH:MM:SS) to iso-format(2016-01-01 12:25:32)
helpers.convertToIsoFormat = function(time) {
    let isoFormatedTime = '';
    if(time.split('/')[0].length != 4 ) {
        time.split(' ').forEach(time => {
            if(time.split('/').length == 3) {
              let splitTime = time.split('/')
              isoFormatedTime += splitTime[2].length == 2 ? '20'+splitTime[2]+'-' : splitTime[2]+'-';
              isoFormatedTime += splitTime[0].length == 1 ? '0'+splitTime[0]+'-' : splitTime[0]+'-';
              isoFormatedTime += splitTime[1].length == 1 ? '0'+splitTime[1] : splitTime[1];
            } else {
              isoFormatedTime+= ' '+time
            }
          });
          return isoFormatedTime
    }
    return time;
}

// gets the last five feet of drilling pressure from a given index
helpers.getIndexAtFiveFeetUp = function(data, startingIndex) {
    let index = startingIndex;
    let depth = data[index].bitPosition;
    let fiveFeetUp = depth-5;
    let startingDepth = 0;
    while(depth > fiveFeetUp && index != 0) {
      depth = data[index].bitPosition;
      if(depth < fiveFeetUp || index == 0) {
        startingDepth = index;
      }
      index--;
    }
    return startingDepth;
  }

// Finds the next connection in the data starting from a given index: totco
helpers.getNextConnectionIndexTotco = function(data, lastConnectionCompletedIndex) {
    let index = lastConnectionCompletedIndex;
    let set = data[index];
    let nextConnectionIndex = 0;
    for(let i = index; i < data.length; i++) {
      set = data[i];
      if(set.bitStatus == 0 && set.blockHeight < 10) {
        nextConnectionIndex = i;
        break;
      }
    }
    return nextConnectionIndex;
  }

// Finds the next connection in the data starting from a given index: pason
helpers.getNextConnectionIndexPason= function(data, lastConnectionCompletedIndex) {
  let index = lastConnectionCompletedIndex;
  let set = data[index];
  let nextConnectionIndex = 0;
  for(let i = index; i < data.length; i++) {
    set = data[i];
    if(set.bitPosition == set.holeDepth && set.blockHeight < 10) {
      nextConnectionIndex = i;
      break;
    }
  }
  return nextConnectionIndex;
}

// Finds the amount of seconds in H:M:S
helpers.timeToSeconds = function(time) {
    let hrsMinsSecs = time.split(':');
    let hrs = parseInt(hrsMinsSecs[0]);
    let mins = parseInt(hrsMinsSecs[1]);
    let secs = parseInt(hrsMinsSecs[2]);
    let totalSeconds = secs;
    totalSeconds += (hrs * 60) * 60;
    totalSeconds += mins * 60;
    return totalSeconds;
}



module.exports = helpers;