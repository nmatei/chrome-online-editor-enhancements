async function getStorageOptions() {
  const storageData = await chrome.storage.sync.get("options");
  return storageData.options;
}
async function setStorageOptions(options) {
  await chrome.storage.sync.set({ options });
}

async function pegasusQuery(inputs = []) {
  // TODo tmp return simple object for test
  // return new Promise(resolve => {
  //   // resolve([{ generated_text: "The answer to the universe is" }]);
  //   resolve([{ generated_text: "The answer to the universe is" }, { generated_text: "Super new text" }]);
  // });

  const options = await getStorageOptions();
  const response = await fetch("https://api-inference.huggingface.co/models/tuner007/pegasus_paraphrase", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + options.authorization
    },
    body: JSON.stringify({
      inputs
    })
  });
  if (response.status === 400) {
    const authorization = prompt("Enter your Authorization Bearer for pegasus_paraphrase and try again");
    options.authorization = authorization;
    await setStorageOptions(options);
  }

  return await response.json();
}
