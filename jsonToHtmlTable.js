// jsonToHtmlTable.js

function jsonToHtmlTable(jsonData) {
    var table = document.createElement('table');

    // Extracting the first element to gather header information
    var firstElement = jsonData[0].part;

    // Create header row
    var headerRow = table.insertRow(0);
    for (var key in firstElement) {
        if (key === 'bestDatasheet') {
            // Handling the 'bestDatasheet' attribute which is an object
            var datasheetHeaderCell = headerRow.insertCell(-1);
            datasheetHeaderCell.innerHTML = key;
        } else {
            var headerCell = headerRow.insertCell(-1);
            headerCell.innerHTML = key;
        }
    }

    // Populate data rows
    for (var i = 0; i < jsonData.length; i++) {
        var dataRow = table.insertRow(-1);
        var part = jsonData[i].part;

        for (var key in firstElement) {
            var cell = dataRow.insertCell(-1);

            if (key === 'manufacturer') {
                cell.innerHTML = part[key].name || part[key];
            } else if (key === 'bestDatasheet') {
                // Handling the 'bestDatasheet' attribute which is an object
                var datasheet = part[key];
                var datasheetCell = dataRow.insertCell(-1);
                datasheetCell.innerHTML = `<a href="${datasheet.url}" target="_blank">Datasheet Link</a>`;
            } else {
                cell.innerHTML = part[key];
            }
        }
    }

    return table.outerHTML;
}
