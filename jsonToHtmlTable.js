// jsonToHtmlTable.js

function jsonToHtmlTable(jsonData) {
    var table = document.createElement('table');

    // Extracting the first element to gather header information
    var firstElement = jsonData[0].part;

    // Create header row
    var headerRow = table.insertRow(0);
    for (var key in firstElement) {
        var headerCell = headerRow.insertCell(-1);
        headerCell.innerHTML = key;
    }

    // Populate data rows
    for (var i = 0; i < jsonData.length; i++) {
        var dataRow = table.insertRow(-1);
        var part = jsonData[i].part;

        for (var key in firstElement) {
            var cell = dataRow.insertCell(-1);

            if (key === 'manufacturer') {
                cell.innerHTML = part[key].name || part[key];
            } else if (key === 'specs') {
                // Handling the 'specs' attribute which is an array of objects
                var specsArray = part[key];
                var specsString = specsArray.map(spec => spec.attribute.name + ": " + spec.displayValue).join(", ");
                cell.innerHTML = specsString;
            } else {
                cell.innerHTML = part[key];
            }
        }
    }

    return table.outerHTML;
}
