function getSegmentByIndex(index, type = "source") {
  return document.querySelector(`div[data-segment-type="${type}"][data-segment-index="${index}"]`);
}

function getSegments(type = "source") {
  const editor = document.querySelector(".ue-container .editor-row");
  if (!editor) {
    console.warn("no editor!");
    return [];
  }
  return [...editor.children[type === "source" ? 0 : 1].querySelectorAll(".ue-segment")];
}
