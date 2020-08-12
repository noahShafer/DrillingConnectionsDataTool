// Dependencies
const components = require('./components/components.js');
const { dialog } = require('electron').remote;
const getConnectionsData = require('../lib/findConnectionsData.js');
const data = require('../lib/data.js');

// App div reference
let app = document.getElementById('app');

// Percentage to multiply operating pressure by when finding the pressure reached operating pressure time
let percentage = 85;

// Load homepage
displayHomepage();

let navbar = document.querySelector('.navbar-brand');
// Add event listener to navbar title
navbar.addEventListener('click', () => {
  // Render home page
  displayHomepage();
});


function displayHomepage() {
  // Clear app div
  app.innerHTML = '';

  // Holds html string to be added to app div
  let htmlString = '';

  // Create uplad csv button and formatting instructions from component library
  htmlString += `<div class="upload-csv-percentageInput-container">`;
  htmlString += components.button('Upload CSV', 'csvButton');
  htmlString += components.percentageInputField();
  htmlString += components.percentageSettingLabel(percentage);
  htmlString += `</div>`;
  htmlString += components.tableFormattingInstruct();
  app.innerHTML = htmlString;

  let setPercentageButton = document.getElementById('setPercentage');
  setPercentageButton.addEventListener('click', () => {
    let percentageToSet = document.getElementById('percentageInput').value;
    percentage = parseInt(percentageToSet) > 0 ? parseInt(percentageToSet) : 85;
    displayHomepage();
  });

  // Add event listener to upload csv button
  csvButton.addEventListener('click', () => {
    // Open dialog window to select file
    dialog.showOpenDialog((fileName) => {
        if(fileName != undefined) {
          // Parse the csv file and return each row of data as an object
          getConnectionsData(fileName[0], percentage, (err, connectionsData) => {
            if(!err && connectionsData) {
              // Render output
              let fileNameArr = fileName[0].split('\\');
              let filename = fileNameArr[fileNameArr.length-1].replace('.csv', '');
              displayData(connectionsData, filename);
            } else {
              console.log(err);
            }
          });
        } else {
          console.log('No files were selected');
        }
      });
    });

  // Add event listeners to totco and pason formatting buttons
  let pasonButton = document.getElementById('pason');
  let totcoButton = document.getElementById('totco');
  let formatting = document.querySelector('.formatting');

  pasonButton.addEventListener('click', () => {
    formatting.innerHTML = components.pasonFormattingTable(); 
  });
  totcoButton.addEventListener('click', () => {
    formatting.innerHTML = components.totcoFormattingTable(); 
  });
}

function displayData(connectionsData, filename) {
  // Clear app div
  app.innerHTML = '';

  // Holds html string to be added to app div
  let htmlString = '';

  // Create uplad csv button and formatting instructions from component library
  htmlString += '<div class="upload-and-download">'
  htmlString += components.button('Upload CSV', 'csvButton')
  htmlString += components.button('Download as CSV', 'downloadCsvButton');
  htmlString += components.percentageInputField();
  htmlString += components.percentageSettingLabel(percentage);
  htmlString += '</div>'; 
  htmlString += components.drillingConnectionsDataTable(connectionsData, filename);
  app.innerHTML = htmlString;

  let setPercentageButton = document.getElementById('setPercentage');
  setPercentageButton.addEventListener('click', () => {
    let percentageToSet = document.getElementById('percentageInput').value;
    percentage = parseInt(percentageToSet) > 0 ? parseInt(percentageToSet) : 85;
  });

  // Add event listeners to download button and upload button
  csvButton.addEventListener('click', () => {
    // Open dialog window to select file
    dialog.showOpenDialog((fileName) => {
        if(fileName != undefined) {
          // Parse the csv file and return each row of data as an object
          getConnectionsData(fileName[0], percentage, (err, connectionsData) => {
            if(!err && connectionsData) {
              // Render output
              let fileNameArr = fileName[0].split('\\');
              let filename = fileNameArr[fileNameArr.length-1].replace('.csv', '');
              displayData(connectionsData, filename);
            } else {
              console.log(err);
            }
          });
        } else {
          console.log('No files were selected');
        }
      });
    });

    

    downloadCsvButton.addEventListener('click', () => {
      dialog.showSaveDialog(fileName => {
        if(fileName != undefined) {
          // Convert data to csv string
          data.convertArrayOfObjectsToCsv(connectionsData, (err, csvString) => {
            if(!err) {
              data.saveCsvFile(fileName, csvString, err => {
                // TODO: add alert that displays success or error message
                let header = document.querySelector('.header'); 
                if(!err) {
                  console.log('File successfully saved');
                } else {
                  console.log('Error saving csv file: '+err);
                }
              });
            } else {
              console.log('Error converting connections data to csv-string');
            }
          });
          
        }
      });
    });
}
