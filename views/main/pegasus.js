async function pegasusQuery(inputs = []) {
  // TODo tmp return simple object for test
  // return new Promise(resolve => {
  //   // resolve([{ generated_text: "The answer to the universe is" }]);
  //   resolve([{ generated_text: "The answer to the universe is" }, { generated_text: "Super new text" }]);
  // });

  const response = await fetch("https://api-inference.huggingface.co/models/tuner007/pegasus_paraphrase", {
    method: "POST",
    headers: {
      Authorization: "Bearer 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"
    },
    body: JSON.stringify({
      inputs
    })
  });
  return await response.json();
}
