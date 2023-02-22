const libraries = {
  vue: "https://unpkg.com/vue@3/dist/vue.global.js",
  pinia: "https://unpkg.com/pinia",
  router: "https://unpkg.com/vue-router@4",
  i18n: "https://unpkg.com/vue-i18n@8",
};

function createScript(scriptName) {
  return new Promise((resolve, reject) => {
    if (!(scriptName in libraries)) return reject(`${scriptName} is unknown`)
    const script = document.createElement('script');
    script.src = libraries[scriptName]
    script.onload = function() {
      return resolve()
    }
    script.onerror = function() {
      return reject("Error occurred while loading script");
    }
    document.body.appendChild(script)
  })
}

function handlePromiseResults(results) {
  const errors = results
    .filter((result) => result.status === "rejected")
    .map((result) => (result).reason);

  if (errors.length) {
    // Aggregate all errors into one
    throw new AggregateError(errors);
  }

  return results.map((result) => result.value);
}

export async function init(scriptNames = []) {
  const list = new Set(['vue', ...scriptNames])
  const promise = Promise.resolve();
  for (const scriptName of list) {
    promise.then(createScript(scriptName))
  }
  // const results = await Promise.allSettled(promises)
  // try {
  //   handlePromiseResults(results);
  // } catch(err) {
  //   for (const error of err.errors) {
  //     console.error(error);
  //   }
  // }
}