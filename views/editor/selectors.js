function getDocTitle() {
  return document.querySelectorAll(".sdl-navbar .x-toolbar-text")[1].innerText;
}

function getFirstVisibleSegment(type = "source") {
  return document.querySelector(`div[data-segment-type="${type}"]`);
}

function getSegmentByIndexSelector(index, type = "source") {
  return `div[data-segment-type="${type}"][data-segment-index="${index}"]`;
}

/**
 * @param {HTMLElement} segment
 * @returns {number}
 */
function getSegmentIndex(segment) {
  return segment.dataset.segmentNumber * 1;
}

function getSegmentByIndex(index, type = "source") {
  return document.querySelector(getSegmentByIndexSelector(index, type));
}

function getSegments(type = "source") {
  const editor = document.querySelector(".ue-container .editor-row");
  if (!editor) {
    console.warn("no editor!");
    return [];
  }
  return [...editor.children[type === "source" ? 0 : 1].querySelectorAll(".ue-segment")];
}

async function editorScrollTop() {
  let index;
  let firstRow;
  do {
    firstRow = getFirstVisibleSegment("source");
    index = getSegmentIndex(firstRow);
    document.querySelector(".ue-editable").scrollIntoView();
    if (index > 1) {
      await sleep(300);
    }
    firstRow.scrollIntoView();
    if (index > 1) {
      await sleep(2500);
    }
  } while (index > 1);
  document.querySelector(".ue-editable").scrollIntoView();
  return firstRow;
}
