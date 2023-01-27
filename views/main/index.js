initEvents();

function initEvents() {
  document.addEventListener(
    "contextmenu",
    function (e) {
      const target = e.target;
      const segment = target.closest(".ue-segment");
      if (segment) {
        e.preventDefault();

        showContextMenu(segment, e);
      }
    },
    false
  );
}

function showContextMenu(segment, e) {
  let text = cleanUpText(segment.innerHTML);
  text = text.trim().replace("‌", "");
  const menu = getContextMenu([
    {
      text: text ? "✨ Rephrase segment" : "Nothing to Rephrase",
      itemId: "optimize",
      handler: () => {
        text && optimizeHandler(segment, text);
      }
    },
    {
      text: "📩 Save as HTML",
      itemId: "printable",
      handler: () => {
        startPrint();
      }
    }
  ]);
  showByCursor(menu, e);
}

async function optimizeHandler(segment, text) {
  const response = await pegasusQuery([text]);
  // console.warn("response", response);

  // add ue-selectable to allow selection
  const items = [
    `<div class="tooltip-toolbar">
        <h1>✨ Rephrased segment</h1>
        <span data-key="fill" class="fill"></span>
        <button type="button" class="action-btn" data-key="close">✖</button>
      </div>`,
    "<ul class='grid-items'>",
    ...response.map(
      (value, i) => `<li class="list-item" data-idx="${i}" data-qtip="Click to copy" data-anchor="bottom" >
        <i class="x-fa fa-copy"></i> 
        ${value.generated_text}
    </li>`
    ),
    "</ul>",
    "<div style='font-style: italic'>* Rephrased copied to clipboard</div>"
  ];

  const tip = getTooltip(items, "arrow-down");
  showBy(tip, segment, [10, -6], "top");

  tip.addEventListener("mousedown", e => {
    // console.warn("mousedown - who is the boss?");
    e.preventDefault();
    e.stopPropagation();
  });
  tip.addEventListener("mouseup", e => {
    // console.warn("mouseup - who is the boss?");
    e.preventDefault();
    e.stopPropagation();
  });

  tip.querySelector('button[data-key="close"]').addEventListener("click", () => {
    document.body.removeChild(tip);
  });

  tip.querySelector(".list-item").addEventListener("click", e => {
    // tip.addEventListener("click", e => {
    if (e.target.matches(".list-item")) {
      e.preventDefault();
      e.stopPropagation();
      const text = response[e.target.dataset.idx].generated_text;
      copyToClipboard(text);
    }
  });

  copyToClipboard(response[0].generated_text);
}
