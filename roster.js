const addPlayers = document.getElementById("addPlayers");
const addPlayerBtn = document.getElementById("addPlayer-btn");
const downloadBtn = document.getElementById("downloadBtn");
const rosterTable = document.getElementById("rosterTable");
const playerFields = addPlayers.querySelectorAll("input");
const rosterFields = rosterData.querySelectorAll("input");
const roster = [];

function addToRoster(e) {
  e.preventDefault();
  const newPlayer = {};
  playerFields.forEach(function(field) {
    const fieldName = field.name;
    const fieldValue = field.value;
    newPlayer[field.name] = field.value;
  }, this);
  roster.push(newPlayer);
  displayRoster(roster);
}

function removeFromRoster(e) {
  if (e.target.id === "removePlayer-btn") {
    const rowToDelete = e.target.parentNode.parentNode;
    const rowIndex = rowToDelete.id;
    rowToDelete.parentNode.removeChild(rowToDelete);
    roster.splice(rowIndex, 1);
    displayRoster(roster);
  }
  return;
}

function displayRoster(roster) {
  rosterTable.innerHTML = "";
  roster.forEach(function(player, index) {
    const newElement = document.createElement("tr");
    newElement.id = index;
    newElement.innerHTML = `
          <td>${player.firstName}</td>
          <td>${player.lastName}</td>
          <td>${player.jerseyNumber}</td>
          <td>${player.division}</td>
          <td class="collapsing">
            <button class="ui negative button" id="removePlayer-btn">x</button>
          </td>
      `;
    rosterTable.appendChild(newElement);
  });
}

function convertRosterToCSV(args) {
  let result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ",";
  lineDelimiter = args.lineDelimiter || "\n";

  keys = Object.keys(data[0]);

  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function(item) {
    ctr = 0;
    keys.forEach(function(key) {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

function downloadCSV(args) {
  var data, filename, link;
  var csv = convertRosterToCSV({
    data: roster
  });
  if (csv == null) return;

  filename = args.filename || "roster.csv";

  if (!csv.match(/^data:text\/csv/i)) {
    csv = "data:text/csv;charset=utf-8," + csv;
  }
  data = encodeURI(csv);

  link = document.createElement("a");
  link.setAttribute("href", data);
  link.setAttribute("download", filename);
  link.click();
}

downloadBtn.addEventListener("click", function() {
  const schoolName = rosterFields[0].value;
  const teamName = rosterFields[1].value;
  downloadCSV({ filename: `${schoolName}_${teamName}` });
});
addPlayerBtn.addEventListener("click", addToRoster);
rosterTable.addEventListener("click", removeFromRoster);
