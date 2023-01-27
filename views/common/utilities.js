/**
 *
 * @param {String} selector
 * @param {Number} timeout
 * @returns {Promise<null | HTMLElement>}
 */
function waitElement(selector, timeout = 30000) {
  return new Promise((resolve, reject) => {
    let el = document.querySelector(selector);
    if (el) {
      resolve(el);
      return;
    }
    const endTime = Date.now() + timeout;
    const refreshIntervalId = setInterval(() => {
      el = document.querySelector(selector);
      if (el) {
        clearInterval(refreshIntervalId);
        resolve(el);
      } else if (endTime < Date.now()) {
        clearInterval(refreshIntervalId);
        //reject("timeout");
        resolve(null);
      }
    }, 100);
  });
}

const TMP_DIV = document.createElement("div");
TMP_DIV.id = "cleanup-element";
document.body.appendChild(TMP_DIV);

function cleanUpText(html) {
  TMP_DIV.innerHTML = html;
  const text = TMP_DIV.innerText;
  TMP_DIV.innerHTML = "";
  return text;
}

function copyToClipboard(text) {
  const iframe = document.createElement("iframe");
  iframe.onload = function () {
    const doc = iframe.contentWindow.document;
    execCopy(text, doc);
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 100);
  };
  document.body.appendChild(iframe);
}

function execCopy(text, doc) {
  if (doc.queryCommandSupported && doc.queryCommandSupported("copy")) {
    const textarea = doc.createElement("textarea");
    textarea.textContent = text;
    // Prevent scrolling to bottom of page in MS Edge.
    textarea.style.position = "fixed";
    doc.body.appendChild(textarea);
    textarea.select();
    try {
      // Security exception may be thrown by some browsers.
      return doc.execCommand("copy");
    } catch (ex) {
      //<debug>
      console.warn("Copy to clipboard failed.", ex);
      //</debug>
      return false;
    } finally {
      doc.body.removeChild(textarea);
    }
  }
}
