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
            headerCell.innerHTML = 'Datasheet';
        } else if (key === 'shortDescription') {
            headerCell.innerHTML = 'Description';
        } else if (key === 'specs') {
            headerCell.innerHTML = 'Specs';
        } else if (key === 'category') {
            headerCell.innerHTML = 'Category';
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
                cell.innerHTML = part[key];
            } else if (key === 'manufacturer') {
                cell.innerHTML = part[key].name || part[key];
            } else if (key === 'bestDatasheet') {
                cell.innerHTML = `<a href="${part[key].url}" target="_blank">${part[key].url}</a>`;
            } else if (key === 'specs') {
                cell.innerHTML = formatSpecs(part[key]);
            } else if (key === 'category') {
                cell.innerHTML = part[key].name || part[key];
            } else {
                cell.innerHTML = part[key];
            }
        }
    }

    return table.outerHTML;
    exportTableToCSV("exportTable");
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
