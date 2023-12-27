// jsonToHtmlTable.js

function jsonToHtmlTable(jsonData) {
    var table = document.createElement('table');

    // Assuming the first element in the array contains the necessary attributes
    var headerRow = table.insertRow(0);

    for (var key in jsonData[0].part) {
        var headerCell = headerRow.insertCell(-1);
        headerCell.innerHTML = key;
    }

    for (var i = 0; i < jsonData.length; i++) {
        var dataRow = table.insertRow(-1);

        for (var key in jsonData[i].part) {
            var cell = dataRow.insertCell(-1);
            cell.innerHTML = jsonData[i].part[key].displayValue || jsonData[i].part[key];
        }
    }

    return table.outerHTML;
}
