// jsonToHtmlTable.js

function jsonToHtmlTable(jsonData) {
    var table = document.createElement('table');

    var headerRow = table.insertRow(0);

    for (var key in jsonData[0]) {
        var headerCell = headerRow.insertCell(-1);
        headerCell.innerHTML = key;
    }

    for (var i = 0; i < jsonData.length; i++) {
        var dataRow = table.insertRow(-1);

        for (var key in jsonData[i]) {
            var cell = dataRow.insertCell(-1);
            cell.innerHTML = jsonData[i][key];
        }
    }

    return table.outerHTML;
}
