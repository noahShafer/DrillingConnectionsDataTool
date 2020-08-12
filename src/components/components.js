// Dependencies
const helpers = require('../../lib/helpers.js');

// Components container
let components = {};

// Upload CSV button component
components.button = function(textContent, id) {
  let button = `<div>
                  <button class="btn btn-outline-dark" id="${id}" type="button">${textContent}</button>
              </div>`;

  return button;
}

// Drilling connections data display table component
components.drillingConnectionsDataTable = function(connectionsData, filename) {
  let heading = `<div class="table-responsive">
                  <table class="table table-bordered table-striped table-sm">
                    <thead>
                      <tr>
                        <th>Connections #</th>
                        <th>Connection Depth</th>
                        <th>Off Bottom Time</th>
                        <th>On Bottom Time</th>
                        <th>Connection Duration</th>
                        <th>Operating Pressure(psi)</th>
                        <th>Pressure Up Time</th>
                        <th>Pressure Start Time</th>
                        <th>Pressure Reached Operating Pressure Time</th>
                      </tr>
                    </thead>
                    <tbodys>`;

  let title = `<h5>${filename}</h5>`

  let table = '';
  connectionsData.forEach(connection => {
    table+=`<tr>
              <td>${connection.connection}</td>
              <td>${connection.connectionDepth}</td>
              <td>${connection.offBottomTime}</td>
              <td>${connection.onBottomTime}</td>
              <td>${connection.connectionDuration}</td>
              <td>${connection.averagePressure}</td>
              <td>${connection.pressureUpTime}</td>
              <td>${connection.pressureStartsIncreasingTime}</td>
              <td>${connection.pressureReachedOperatingPressureTime}</td>
            </tr>`;
  });
  let tail = `</tbody>
            </table>
          </div>`;

  return title+heading+table+tail;
}

// Totco formatting table
components.totcoFormattingTable = function() {
  let table = `<div class="table-responsive">
                <table class="table table-bordered table-m">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>DateTime</th>
                      <th>Pump Pressure(psi)</th>
                      <th>Bit Status</th>
                      <th>Bit Position(ft)</th>
                      <th>Block Height(ft)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>5/26/2017 2:21:00</td>
                      <td>830.5</td>
                      <td>1</th>
                      <td>5336.89</td>
                      <td>-1.01</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>5/26/2017 2:21:10</td>
                      <td>830.92</td>
                      <td>1</th>
                      <td>5337.16</td>
                      <td>-1.27</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>5/26/2017 2:21:20</td>
                      <td>831.02</td>
                      <td>1</th>
                      <td>5337.42</td>
                      <td>-1.53</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>5/26/2017 2:21:30</td>
                      <td>835.97</td>
                      <td>1</th>
                      <td>5337.64</td>
                      <td>-1.75</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>5/26/2017 2:21:40</td>
                      <td>837.43</td>
                      <td>1</th>
                      <td>5337.64</td>
                      <td>-2</td>
                    </tr>
                  </tbody>
                </table>
              </div>`;
  return table;
}

// Pason formatting table
components.pasonFormattingTable = function() {
  let table = `<div class="table-responsive">
                <table class="table table-bordered table-m">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Hole Depth</th>
                      <th>Bit Depth</th>
                      <th>Standpipe(psi)</th>
                      <th>Block Height</th>
                      <th>yyyy/mm/dd</th>
                      <th>hh:mm:ss</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>4983.5</td>
                      <td>4983.5</td>
                      <td>774.43</td>
                      <td>27</td>
                      <td>2018/04/03</td>
                      <td>17:25:30</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>4983.9</td>
                      <td>4983.9</td>
                      <td>774.43</td>
                      <td>26.5</td>
                      <td>2018/04/03</td>
                      <td>17:25:40</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>4984.2</td>
                      <td>4984.2</td>
                      <td>775.06</td>
                      <td>26.1</td>
                      <td>2018/04/03</td>
                      <td>17:25:50</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>4984.7</td>
                      <td>4984.7</td>
                      <td>775.06</td>
                      <td>25.6</td>
                      <td>2018/04/03</td>
                      <td>17:25:60</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>4985.1</td>
                      <td>4985.1</td>
                      <td>775.06</td>
                      <td>25.3</td>
                      <td>2018/04/03</td>
                      <td>17:25:70</td>
                    </tr>
                  </tbody>
                </table>
              </div>`;
  return table;
}

// Table formatting instructions component
components.tableFormattingInstruct = function() {
  let htmlContent = `
        <h3>Input file formatting:</h3>
        <ol>
          <li>Your input file must be a CSV file</li>
          <li>These are the only time formats that are accepted: M/D/YYYY HH:MM and YYYY/MM/DD HH:MM:SS</li>
          <li>The column formatting of the csv files used to be very strict, but now you just have to have
            the column titles below as the titles for your columns for the corresponding data.  Case doesnt matter and the order your columns
            are in doesn't matter, as long as they are spelled exactly the way they are below
          </li>
        </ol>
        <h4>Example input file</h4>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button id="totco" type="button" class="btn btn-dark">Totco</button>
          <button id="pason" type="button" class="btn btn-dark">Pason</button>
        </div>
        <div class="formatting">
            <div class="table-responsive">
            <table class="table table-bordered table-m">
              <thead>
                <tr>
                  <th>#</th>
                  <th>DateTime</th>
                  <th>Pump Pressure(psi)</th>
                  <th>Bit Status</th>
                  <th>Bit Position(ft)</th>
                  <th>Block Height(ft)</th>
                </tr>
              </thead>
              <tbody>
                    <tr>
                      <td>1</td>
                      <td>5/26/2017 2:21:00</td>
                      <td>830.5</td>
                      <td>1</th>
                      <td>5336.89</td>
                      <td>-1.01</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>5/26/2017 2:21:10</td>
                      <td>830.92</td>
                      <td>1</th>
                      <td>5337.16</td>
                      <td>-1.27</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>5/26/2017 2:21:20</td>
                      <td>831.02</td>
                      <td>1</th>
                      <td>5337.42</td>
                      <td>-1.53</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>5/26/2017 2:21:30</td>
                      <td>835.97</td>
                      <td>1</th>
                      <td>5337.64</td>
                      <td>-1.75</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>5/26/2017 2:21:40</td>
                      <td>837.43</td>
                      <td>1</th>
                      <td>5337.64</td>
                      <td>-2</td>
                    </tr>
                  </tbody>
            </table>
          </div>
        </div>`;
        return htmlContent;
}

components.percentageInputField = function() {
  let htmlContent = `<div class="percentage-form">
                          <input type="number" maxlength="2" class="form-control"  id="percentageInput" pattern="^0[1-9]|[1-9]\d$" placeholder="enter %" min="1">
                          <button id="setPercentage" class="btn btn-dark">Set</button>
                     </div>`;
  return htmlContent;
}

components.percentageSettingLabel = function(percentage) {
  let htmlContent = `<div class="percentage-setting-label">
                      <span class="title"><strong>% of operating pressure setting: ${percentage}%</strong>  </span>
                     </div>`;
  return htmlContent;
}

components.fadeOut = function(element) {
  console.log(element.style);
  setInterval(() => {
    element.style.opacity -= 0.2;
    if(element.style.opacity == 0) {
      element.style.display = none;
    }
  }, 1000);
}

module.exports = components;

