// Dependencies
const data = require('./data.js');
const helpers = require('./helpers.js');

// Algorithm for finding connections for totco drilling data
function connectionsAlgorithmTotco(drillingData, startingIndex, numberOfConnections, percentage) {
    // Validate inputed data
    percentage = typeof percentage == 'number' && percentage <= 100 && percentage >= 1 ? percentage : 85;

    // Connection object to store all connection data
    let connectionObject = {};
    let nextLoopStartIndex = 0; // next loop will start at this index which is the onBottomTime index
    
    // Add data that doesnt require calculation
    let { dateTime, bitPosition } = drillingData[startingIndex];
    connectionObject.connection = numberOfConnections;
    let offBottomTime = dateTime;
    let connectionDepth = bitPosition;

    // Find on bottom time
    let onBottomTime = function() {
        let index = startingIndex;
        let bitStatus = drillingData[index].bitStatus;
        while(bitStatus == 0  && index != drillingData.length - 1) {
            bitStatus = drillingData[index].bitStatus;
            if(bitStatus == 1) {
                nextLoopStartIndex = index;
                return drillingData[index].dateTime;
            }
            index++;
        }
        nextLoopStartIndex = index;
        return null;
    }()
    

    // Gets the amount of time passed between coming off bottom and going back on bottom
    let connectionDuration = offBottomTime != null && onBottomTime != null ? helpers.calcTimePassed(offBottomTime, onBottomTime) : null;

    // Get operating pressure
    let operatingPressure1 = function() {
        let index = startingIndex;
        let indexFiveFeetUp = helpers.getIndexAtFiveFeetUp(drillingData, startingIndex);
        let pressures = []; // stores all the pressures that we will average at the end
        for(let i = indexFiveFeetUp; i < index; i++) {
            let { pumpPressure } = drillingData[i];
            if(pumpPressure >= 0) {
                pressures.push(pumpPressure);
            }
        }
        // If pressures length doesnt equal zero, then calc average, else return 0
        let averagePressure = pressures.length != 0 ? pressures.reduce((first, second) => first+second)/pressures.length : 0;
        return Math.round(averagePressure * 100) / 100;
    }

    // Finds the time the pressure begins to increase
    let pressureStartedIncreaseingIndex = 0; // Used when finding the pressureReachedOperatingPressureTime
    let pressureStartsIncreasingTime = function() {
        let index = startingIndex;
        let { pumpPressure } = drillingData[index];
        let pressureCeiling = 1;
        let nextConnectionIndex = helpers.getNextConnectionIndexTotco(drillingData, nextLoopStartIndex);
        while(pumpPressure > pressureCeiling && index != drillingData.length - 1) {
          let { pumpPressure } = drillingData[index];
          if(pumpPressure < pressureCeiling && pumpPressure >= 0) {
            if(index + 1 != drillingData.length) {
                do {
                    index++;
                } while(drillingData[index].pumpPressure == drillingData[index+1].pumpPressure || drillingData[index+1].pumpPressure < 0);
                pressureStartedIncreaseingIndex = index;
                return drillingData[index].dateTime;
            }
          } else if(index == nextConnectionIndex) {
            index = startingIndex;
            pressureCeiling += 0.5;
          } else {
            index++;
          }
        }    
    }()

    let operatingPressure = function() {
        let index = pressureStartedIncreaseingIndex;
        let nextConnectionIndex = helpers.getNextConnectionIndexTotco(drillingData, nextLoopStartIndex);
        let pressures = []; // stores all the pressures that we will average at the end
        for(let i = index; i < nextConnectionIndex; i++) {
            let { pumpPressure } = drillingData[i];
            if(pumpPressure >= 0) {
                pressures.push(pumpPressure);
            }
        }
        // If pressures length doesnt equal zero, then calc average, else return 0
        let averagePressure = pressures.length != 0 ? pressures.reduce((first, second) => first+second)/pressures.length : 0;
        return Math.round(averagePressure * 100) / 100;
    }()

    // Find pressure reached operating pressure
    let pressureReachedOperatingPressureTime = function() {
        let nextConnectionIndex = helpers.getNextConnectionIndexTotco(drillingData, nextLoopStartIndex);
        let avgOperatingPressure = operatingPressure;
        let index = pressureStartedIncreaseingIndex;
        let percentageOfPressure = percentage / 100;
        let { pumpPressure } = drillingData[index];
        while(pumpPressure < avgOperatingPressure * percentageOfPressure && index != drillingData.length) {
          let { pumpPressure } = drillingData[index];
          if(pumpPressure > avgOperatingPressure * percentageOfPressure) {
            let time = drillingData[index].dateTime;
            return time;
          } else if(index == nextConnectionIndex) {
            index = pressureStartedIncreaseingIndex;
            percentageOfPressure -= 0.05;
          } else {
            index++;
          }
        }
    }()

    // calculate time it took to pressure up the drill, by finding the time passed between pressureIncreace time and pressureReachedOperating time
    let pressureUpTime = 
        pressureStartsIncreasingTime != undefined && 
        pressureReachedOperatingPressureTime !== undefined
        ? helpers.calcTimePassed(pressureStartsIncreasingTime, pressureReachedOperatingPressureTime)
        : null;

    // Create connection object
    connectionObject.connectionDepth = connectionDepth;
    connectionObject.offBottomTime = offBottomTime;
    connectionObject.onBottomTime = onBottomTime;
    connectionObject.connectionDuration = connectionDuration;
    connectionObject.averagePressure = operatingPressure;
    connectionObject.pressureStartsIncreasingTime = pressureStartsIncreasingTime;
    connectionObject.pressureReachedOperatingPressureTime = pressureReachedOperatingPressureTime;
    connectionObject.pressureUpTime = pressureUpTime;

    return {
        connectionObject: connectionObject,
        index: nextLoopStartIndex
    };
}

// Algorithm for finding connections for pason drilling data
function connectionsAlgorithmPason(drillingData, startingIndex, numberOfConnections, percentage) {
    // Validate inputed data
    percentage = typeof percentage == 'number' && percentage <= 100 && percentage >= 1 ? percentage : 85;

    let connectionObject = {};
    let nextLoopStartIndex = 0;

    let { dateTime, bitPosition } = drillingData[startingIndex];
    let offBottomTime = dateTime;
    let connectionDepth = bitPosition;

    let onBottomTime = function() {
        let index = startingIndex;
        let { bitPosition, holeDepth } = drillingData[index];
        while(bitPosition != holeDepth  && index != drillingData.length - 1) {
            let { bitPosition, holeDepth } = drillingData[index];
            if(bitPosition == holeDepth) {
                nextLoopStartIndex = index;
                return drillingData[index].dateTime;
            }
            index++;
        }
        nextLoopStartIndex = index;
        return null;
    }()

    // Gets the duration of the connection using library to find the duration between on and offbottom times
    let connectionDuration = offBottomTime != null && onBottomTime != null ? helpers.calcTimePassed(offBottomTime, onBottomTime) : null;

    // Finds the average operating pressure using the last 5 feet of pressures for reference
    let operatingPressure = function() {
        let index = startingIndex;
        let indexFiveFeetUp = helpers.getIndexAtFiveFeetUp(drillingData, startingIndex);
        let pressures = []; // stores all the pressures that we will average at the end
        for(let i = indexFiveFeetUp; i < startingIndex; i++) {
            let { pumpPressure } = drillingData[i];
            if(pumpPressure >= 0) {
                pressures.push(pumpPressure);
            }
        }
        // If pressures length doesnt equal zero, then calc average, else return 0
        let averagePressure = pressures.length != 0 ? pressures.reduce((first, second) => first+second)/pressures.length : 0;
        return Math.round(averagePressure * 100) / 100;
    }()

    // Finds the time the pressure begins to increase
    let pressureStartedIncreaseingIndex = 0; // Used when finding the pressureReachedOperatingPressureTime
    let pressureStartsIncreasingTime = function() {
        let index = startingIndex;
        let { pumpPressure } = drillingData[index];
        let pressureCeiling = 1;
        let nextConnectionIndex = helpers.getNextConnectionIndexPason(drillingData, nextLoopStartIndex);
        while(pumpPressure > pressureCeiling && index != drillingData.length - 1) {
          let { pumpPressure } = drillingData[index];
          if(pumpPressure < pressureCeiling) {
            pressureStartedIncreaseingIndex = index; // index used to find operating pressure time
            return drillingData[index].dateTime;
          } else if(index == nextConnectionIndex) {
            index = startingIndex;
            pressureCeiling += 0.5;
          } else {
            index++;
          }
        }    
    }()

    // Find pressure reached operating pressure
    let pressureReachedOperatingPressureTime = function() {
        let nextConnectionIndex = helpers.getNextConnectionIndexPason(drillingData, nextLoopStartIndex);
        let avgOperatingPressure = operatingPressure;
        let index = pressureStartedIncreaseingIndex;
        let percentageOfPressure = percentage / 100;
        let { pumpPressure } = drillingData[index];
        while(pumpPressure < avgOperatingPressure * percentageOfPressure && index != drillingData.length) {
          let { pumpPressure } = drillingData[index];
          if(pumpPressure > avgOperatingPressure * percentageOfPressure) {
            let time = drillingData[index].dateTime;
            return time;
          } else if(index == nextConnectionIndex) {
            index = pressureStartedIncreaseingIndex;
            percentageOfPressure -= 0.05;
          } else {
            index++;
          }
        }
    }()

    // Finds the duration between pressure started increasing time and pressure reached operating pressure time
    let pressureUpTime = 
        pressureStartsIncreasingTime != undefined && 
        pressureReachedOperatingPressureTime !== undefined
        ? helpers.calcTimePassed(pressureStartsIncreasingTime, pressureReachedOperatingPressureTime)
        : null;

    connectionObject.connection = numberOfConnections;
    connectionObject.connectionDepth = connectionDepth;
    connectionObject.offBottomTime = offBottomTime;
    connectionObject.onBottomTime = onBottomTime;
    connectionObject.connectionDuration = connectionDuration;
    connectionObject.averagePressure = operatingPressure;
    connectionObject.pressureStartsIncreasingTime = pressureStartsIncreasingTime;
    connectionObject.pressureReachedOperatingPressureTime = pressureReachedOperatingPressureTime;
    connectionObject.pressureUpTime = pressureUpTime;

    return {
        connectionObject: connectionObject,
        index: nextLoopStartIndex
    }
}
function getConnectionsData(filePath, percentage, callback) {
    data.parseCSVFile(filePath, (err, drillingData, drillingDataType) => {
        if(!err && drillingData) {
            let connections = []; // container to hold each connection object
            let numberOfConnections = 0;
            if(drillingDataType == 'totco') {
                // Route to totco algorithm
                for(let i = 0; i < drillingData.length; i++) {
                    let { blockHeight, bitStatus } = drillingData[i];
                    if(bitStatus == 0 && blockHeight < 10) {
                        numberOfConnections++;
                        let { connectionObject, index } = connectionsAlgorithmTotco(drillingData, i, numberOfConnections, percentage);
                        // Next loop starts on the onBottomTime of the last connection
                        i = index;
                        // Only push connection onto array if it has a pressureUpTim, if it doesnt, it more than likely isn't a connection
                        let totalSeconds = connectionObject.connectionDuration != null ? helpers.timeToSeconds(connectionObject.connectionDuration) : null;
                        if(connectionObject.pressureUpTime != null && totalSeconds < 18000) {
                            connections.push(connectionObject);
                        } else {
                            numberOfConnections--;
                        }
                    }
                }
                console.log(connections);
                callback(false, connections);
            } else {
                // Route to pason algorithm
                for(let i = 0; i < drillingData.length; i++) {
                    let { bitPosition, holeDepth, blockHeight } = drillingData[i];
                    if(bitPosition != holeDepth && blockHeight < 10) {
                        numberOfConnections++;
                        let { connectionObject, index } = connectionsAlgorithmPason(drillingData, i, numberOfConnections, percentage);
                        // Start next loop at onBottomTime of this connection
                        i = index;
                        // Remove any connection that is longer than 30 mins, less than 30 seconds, or pressure up time is null
                        let totalSeconds = connectionObject.connectionDuration != null ? helpers.timeToSeconds(connectionObject.connectionDuration) : null;
                        if(connectionObject.pressureUpTime != null && totalSeconds > 30 && totalSeconds < 18000) {
                            connections.push(connectionObject);
                        } else {
                            numberOfConnections--;
                        }
                    }
                }
                callback(false, connections);
            }  
        } else {
            callback(err);
        }
    });
}

module.exports = getConnectionsData;

getConnectionsData('C:/development/DrillingData/pasonData.csv', 85, (err, data) => {
    console.log(err, data);
});