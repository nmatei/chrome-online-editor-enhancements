/**
 *
 * @param {String} selector
 * @param {Number} timeout
 * @param {Number} retryInterval
 * @returns {Promise<null | HTMLElement>}
 */
function waitElement(selector, timeout = 30000, retryInterval = 100) {
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
    }, retryInterval);
  });
}

async function sleep(timeout = 5000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout);
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

function maskElement(element) {
  element.classList.add("extension-loading-mask");
}
function unmaskElement(element) {
  element.classList.remove("extension-loading-mask");
}
