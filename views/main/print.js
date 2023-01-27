let sources = [];
let targets = [];
let rows = [];

function startPrint() {
  const firstRow = getSegmentByIndex(1);
  if (firstRow) {
    firstRow.scrollIntoView();
  } else {
    // TODO not top yet...  but better
    console.warn("scroll top");
    document.querySelector(".ue-editable").scrollIntoView();
  }

  sources = getSegments("source");
  targets = getSegments("target");
  rows = sources.map((s, i) => rowHtml(s.getAttribute("data-segment-index"), s.innerText, targets[i].innerText, s.firstChild.getAttribute("style")));

  loadNextPage();
}

/**
 *
 */
async function loadNextPage() {
  sources[sources.length - 1].scrollIntoView();

  await waitNextPage();

  const lastRowIndex = sources[sources.length - 1].getAttribute("data-segment-index");

  sources = getSegments("source");
  targets = getSegments("target");

  const lastRow = getSegmentByIndex(lastRowIndex);
  const lastIndex = sources.indexOf(lastRow) + 1;
  sources.splice(0, lastIndex);
  targets.splice(0, lastIndex);

  const pageRows = sources.map((s, i) => rowHtml(s.getAttribute("data-segment-index"), s.innerText, targets[i].innerText, s.firstChild.getAttribute("style")));
  rows = rows.concat(pageRows);

  //console.warn("pageRows", pageRows.length);

  if (pageRows.length === 0) {
    docReady(rows);
  } else {
    loadNextPage();
  }
}

async function waitNextPage() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
      // TODO decrease 5000 to 200 and wait until loading is removed
    }, 5000);
  });
}

function increaseFont(html) {
  [16, 15, 14, 13, 12, 11, 10, 9, 8].forEach(size => {
    html = html.replaceAll(`font-size: ${size}pt;`, `font-size: ${size + 3}pt;`);
  });
  return html;
}

/**
 *
 * @param rows
 */
function docReady(rows) {
  const docTitle = getDocTitle();
  let html = getPrintPage(rows, docTitle);
  html = increaseFont(html);

  download(html, docTitle + ".html", "text/plain");

  //var tab = window.open('', '_blank');
  //tab.document.write(page);
}

function rowHtml(line, source, target, style) {
  return `
  <tr>
    <td class="ue-gutter">${line}</td>
    <td style='${style}'>${source}</td>
    <td style='${style}'>${target}</td>
  </tr>`;
}

function getPrintPage(rows, docTitle) {
  let page = `<html>
  <head>
	<title>${docTitle}</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<style>
	  body { 
	    margin: 2px;
	    font-size: 1.5em;
	  }
	  h1 {
		  margin: 10px 2px 10px 10px;
		  font-size: 1.2em;
      color: #0b5394;
	  }
	  h1 a {
      text-decoration: none;
    }
	  table {
		  width: 100%;
		  /*border-collapse: collapse;*/
		  border-spacing: 0;
		  font-size: 1em;
	  }
	  th {
      background-color: #00aeef;
      color: white;
    }
    th,
    td {
      border: 1px solid #d0d0d0;
      padding: 4px;
		 transition: filter 0.3s ease;
    }
	  tr .ue-gutter {
		  border-left-width: 2px;
		  font-size: 0.8em;
		  color: #818a96;
	  }
	  tr td:last-of-type {
		  border-right-width: 2px;
	  }
	  tr {
		  background-color: #F6F6F6;
	  }
    tr:nth-child(even) {
      background-color: #ECEFF1;
    }
	  tr.selected,
	  tr:hover {
		  background-color: #ffffff;
		  cursor: pointer;
	  }
	  tr.selected td,
	  tr:hover td {
		  /* border-color: #00A89F; */
		  border-top: 1px solid #00A89F;
		  border-bottom: 1px solid #00A89F;
		  /* -webkit-box-shadow: inset 0 1px 0px 0 #00a89f, inset 0 -2px 0px -1px #00a89f;
		  box-shadow: inset 0 1px 0px 0 #00a89f, inset 0 -2px 0px -1px #00a89f; */
	  }
	  tr.selected .ue-gutter,
	  tr:hover .ue-gutter {
		  border-left-color: #00A89F;
		  background-color: #00A89F !important;
		  color: white;
	  }
	  tr:hover td:last-of-type {
		  border-right-color: #00A89F;
	  }
	  tr .ue-gutter {
		  text-align: center;  
	  }
	</style>
  </head>
  <body>
	<h1><a href="/">🏠 Home</a> | ${docTitle}</h1>
    <table>
	  ${rows.join("")}
	</table>
	<script>
    function addTableEvents(table, i) {
      var prefix = window.location.pathname.replace(/([\\/])|(%20)/gi, "").toLowerCase();
      var storageKey = prefix + "-selected-row-";
      var storageRow = localStorage.getItem(storageKey + i);
      var selectedLine = storageRow || "1";
      var row = table.querySelector("tr:nth-child(" + selectedLine + ")");
      if (row) {
        row.classList.toggle("selected");
        row.scrollIntoView();
      }
      table.querySelector("tbody").addEventListener("click", function(e) {
        if (e.target.matches("td")) {
          var selected = table.querySelector("tr.selected");
          if (selected) {
            selected.classList.remove("selected");
          }
          var tr = e.target.closest("tr");
          if (tr === selected) {
            localStorage.removeItem(storageKey + i);
          } else {
            tr.classList.toggle("selected");
            var line = tr.querySelector("td").innerText;
            localStorage.setItem(storageKey + i, line);
          }
        }
      });
    }
    setTimeout(function(){
      Array.from(document.querySelectorAll("table")).forEach(function(table, i) {
        addTableEvents(table, i + 1);
      });
    }, 200);
	</script>
  </body>
  </html>`;

  return page;
}

function download(text, name, type) {
  const anchor = document.createElement("a");
  anchor.className = "download-js-link";
  anchor.id = "download-html";
  anchor.innerHTML = "downloading...";
  anchor.style.display = "none";
  document.body.appendChild(anchor);

  const file = new Blob([text], { type: type });
  anchor.href = URL.createObjectURL(file);
  anchor.download = name;
  anchor.click();
  document.body.removeChild(anchor);
}
