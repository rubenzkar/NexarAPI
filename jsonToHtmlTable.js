// jsonToHtmlTable.js

function jsonToHtmlTable(jsonData) {
    var table = document.createElement('table');

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
    // Format the 'specs' attribute as a string
    var formattedSpecs = specs.map(function (spec) {
        return `"${spec.attribute}":"${spec.displayValue}"`;
    }).join(',');

    return `{${formattedSpecs}}`;
}
