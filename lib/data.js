// Dependencies
const parse = require('csv-parse');
const stringify = require('csv-stringify');
const fs = require('fs');

// Data functions container
let data = {};

// parseCsvFunction
// required data: file.csv(must be a csv file)
data.parseCSVFile = function(file, callback) {
    file = file.split('.')[1] == 'csv' ? file : false;

    if(file) {
        fs.readFile(file, (err, data) => {
            if(!err && data) {
                parse(data, (err, parsedCsv) => {
                    if(!err && parsedCsv) {
                        // Determine the drill data type: pason or totco.  so that it can be parsed accordingly, and to notify other functions of the data type
                        let drillingDataType = '';
                        let rows = [];
                        let columnTitles = parsedCsv[0].map(item => item.toLowerCase().replace(/\s/g, ''));
                        // Determine if the column titles contain holedepth or bitdepth, if so this is pason data
                        if(columnTitles.indexOf('holedepth') == -1 && columnTitles.indexOf('bitdepth') == -1) { 
                            // Find the column indexes that contain the data we need
                             let dateTimeIndex = columnTitles.indexOf('datetime');
                             let pumpPressureIndex = columnTitles.indexOf('pumppressure(psi)');
                             let bitStatusIndex = columnTitles.indexOf('bitstatus(bottom)');
                             let bitPositionIndex = columnTitles.indexOf('bitposition(ft)');
                             let blockHeightIndex = columnTitles.indexOf('blockheight(ft)');

                             drillingDataType = 'totco';
                             parsedCsv.shift(); // Remove column titles from csv
                             parsedCsv.forEach(row => {
                                let csvRowAsObject = {
                                    dateTime: row[dateTimeIndex],
                                    pumpPressure: parseFloat(row[pumpPressureIndex]),
                                    bitStatus: parseFloat(row[bitStatusIndex]),
                                    bitPosition: parseFloat(row[bitPositionIndex]),
                                    blockHeight: parseFloat(row[blockHeightIndex])
                                };
                                rows.push(csvRowAsObject);
                            });
                        } else {
                            // Find the column index that contain the data we need
                            let holeDepthIndex = columnTitles.indexOf('holedepth');
                            let bitPositionIndex = columnTitles.indexOf('bitdepth');
                            let pumpPressureIndex = columnTitles.indexOf('standpipe(psi)');
                            let blockHeightIndex = columnTitles.indexOf('blockheight');
                            let yearMonthDayIndex = columnTitles.indexOf('yyyy/mm/dd');
                            let hourMinSecsIndex = columnTitles.indexOf('hh:mm:ss');

                            drillingDataType = 'pason';
                            parsedCsv.shift(); // Remove column titles from csv
                            parsedCsv.forEach(row => {
                                let csvRowAsObject = {
                                    dateTime: row[yearMonthDayIndex]+' '+row[hourMinSecsIndex],
                                    pumpPressure: parseFloat(row[pumpPressureIndex]),
                                    bitPosition: parseFloat(row[bitPositionIndex]),
                                    holeDepth: parseFloat(row[holeDepthIndex]),
                                    blockHeight: parseFloat(row[blockHeightIndex])
                                };
                                rows.push(csvRowAsObject);
                            });
                        }
                        callback(false, rows, drillingDataType);
                    } else {
                        callback("Error parsing csv file: "+err)
                    }
                });
            } else {
                callback("Error reading csv file: "+err);
            }
        });
    } else {
        callback("Error: File is not a csv file");
    }
}

// Converts connections array of objects to a csv string
data.convertArrayOfObjectsToCsv = function(array, callback) {
    let inputData = [];
    // Add column titles to input data
    inputData.push(['connection #', 'Connection Depth(ft)', 'Off Bottom Time', 'On Bottom Time', 'Connection Duration(hour/mins/secs)', 'Operating Pressure(psi)', 'Pressure Up Time(hour/min/sec)', 'Pressure Increase Start Time', 'Pressure Reached Operating Pessure Time']);
  
    array.forEach(set => {
      let row = [];
      row.push(set.connection.toString());
      row.push(set.connectionDepth.toString());
      row.push(set.offBottomTime);
      row.push(set.onBottomTime);
      row.push(set.connectionDuration);
      row.push(set.averagePressure);
      row.push(set.pressureUpTime);
      row.push(set.pressureStartsIncreasingTime);
      row.push(set.pressureReachedOperatingPressureTime);
      inputData.push(row);
    });
  
    stringify(inputData, function(err, output){
      if(!err) {
        callback(false, output);
      } else {
        callback('Error converting data to CSV: '+err);
      }
    });
}


  // Saves a csv string as a csv file
  data.saveCsvFile = function(filePath, csvString, callback) {
            fs.writeFile(filePath+'.csv', csvString, err => {
                if(!err) {
                    callback(false);
                } else {
                    callback("Error saving csv file"+err);
                }
            });
  }

module.exports = data;
