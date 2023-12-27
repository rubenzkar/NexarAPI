// jsonToHtmlTable.js

function jsonToHtmlTable(jsonData) {
    var table = document.createElement('table');
    table.id = 'exportTable';

    // Extracting the first element to gather header information
    var results = jsonData[0].part;

    // Create header row
    var headerRow = table.insertRow(0);

    for (var key in results) {
        var headerCell = headerRow.insertCell(-1);

        if (key === 'manufacturer') {
            headerCell.innerHTML = 'Manufacturer';
        } else if (key === 'mpn') {
            headerCell.innerHTML = 'MPN';
        } else if (key === 'bestDatasheet') {
            // Handling the 'bestDatasheet' attribute which is an object
            headerCell.innerHTML = 'Datasheet';
        } else if (key === 'shortDescription') {
            // Handling the 'shortDescription' attribute
            headerCell.innerHTML = 'Description';
        } else if (key === 'specs') {
            // Handling the 'specs' attribute
            headerCell.innerHTML = 'Specs';
        } else {
            headerCell.innerHTML = key;
        }
    }

    // Populate data rows
    for (var i = 0; i < jsonData.length; i++) {
        var dataRow = table.insertRow(-1);
        var part = jsonData[i].part;

        for (var key in results) {
            var cell = dataRow.insertCell(-1);

            if (key === 'shortDescription') {
                // Handling the 'shortDescription' attribute
                cell.innerHTML = part[key];
            } else if (key === 'manufacturer') {
                cell.innerHTML = part[key].name || part[key];
            } else if (key === 'bestDatasheet') {
                // Handling the 'bestDatasheet' attribute which is an object
                cell.innerHTML = `<a href="${part[key].url}" target="_blank">${part[key].url}</a>`;
            } else if (key === 'specs') {
                // Handling the 'specs' attribute
                cell.innerHTML = formatSpecs(part[key]);
            } else {
                cell.innerHTML = part[key];
            }
        }
    }

    return table.outerHTML;
}

function formatSpecs(specs) {
    // Format the 'specs' attribute as a string, handling nested objects recursively
    var formattedSpecs = specs.map(function (spec) {
        var attributeName = spec.attribute.name || spec.attribute;
        if (typeof spec.displayValue === 'object') {
            // Recursively format nested objects
            return `"${attributeName}":${formatSpecs([spec.displayValue])}`;
        } else {
            return `"${attributeName}":"${spec.displayValue}"`;
        }
    }).join(',');

    return `{${formattedSpecs}}`;
}

// Function to download the CSV file
function downloadCSVFile(csv_data) {
  const csvFile = new Blob([csv_data], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.download = "table_data.csv";
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Append the link to the document body if available; otherwise, append it to the document head
  const parentElement = document.body || document.head;

  if (parentElement) {
    parentElement.appendChild(downloadLink);
    downloadLink.click();
    parentElement.removeChild(downloadLink); // Cleanup after click
  } else {
    console.error("Unable to find a valid parent element to append the download link.");
  }
}

// Function to export the HTML table data to a CSV file
function exportTableToCSV(tableId) {
  const rows = document.querySelectorAll(tableId + " tr");
  let csv_data = []; // Change from const to let

  // Iterate through rows and columns, extract text data from each cell, and convert it to a comma-separated value
  rows.forEach((row) => {
    const cols = row.querySelectorAll("td, th");
    const csvRow = [];
    cols.forEach((col) => {
      const textData = col.innerText;
      csvRow.push(`"${textData}"`); // Wrap each value in double quotes
    });
    csv_data.push(csvRow.join(","));
  });

  // Combine each row data with a new line character
  csv_data = csv_data.join("\n");

  // Call the downloadCSVFile function to download the CSV file
  downloadCSVFile(csv_data);
}

exportTableToCSV("exportTable");
