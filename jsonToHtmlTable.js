// jsonToHtmlTable.js

function jsonToHtmlTable(jsonData) {
    var table = document.createElement('table');

    // Extracting the first element to gather header information
    var results = jsonData[0].part;

    // Create header row
    var headerRow = table.insertRow(0);
    var headerArr = [];

    for (var key in results) {
        var headerCell = headerRow.insertCell(-1);

        if (key === 'manufacturer') {
            headerCell.innerHTML = 'Manufacturer';
            headerArr.push('Manufacturer');
        } else if (key === 'mpn') {
            headerCell.innerHTML = 'MPN';
            headerArr.push('MPN');
        } else if (key === 'bestDatasheet') {
            // Handling the 'bestDatasheet' attribute which is an object
            headerCell.innerHTML = 'Datasheet';
            headerArr.push('Datasheet');
        } else if (key === 'shortDescription') {
            // Handling the 'shortDescription' attribute
            headerCell.innerHTML = 'Description';
            headerArr.push('Description');
        } else if (key === 'specs') {
            // Handling the 'specs' attribute
            headerCell.innerHTML = 'Specs';
            headerArr.push('Specs');
        } else {
            headerCell.innerHTML = key;
            headerArr.push(key);
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

    // Downloadable CSV file
    downloadCSV(jsonData, headerArr);

    return table.outerHTML;
}

function formatSpecs(specs) {
    // Format the 'specs' attribute as a string
    var formattedSpecs = specs.map(function (spec) {
        return `"${spec.attribute}":"${spec.displayValue}"`;
    }).join(',');

    return `{${formattedSpecs}}`;
}

function downloadCSV(jsonData, headers) {
    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(',') + '\n';

    jsonData.forEach(function (row) {
        var values = headers.map(function (header) {
            if (header === 'bestDatasheet') {
                return row.part[header].url;
            } else if (header === 'specs') {
                return formatSpecs(row.part[header]);
            } else if (header === 'manufacturer') {
                return row.part[header].name || row.part[header];
            } else {
                return row.part[header];
            }
        });
        csvContent += values.join(',') + '\n';
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
}
