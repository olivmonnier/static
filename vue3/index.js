const libraries = {
  vue: "https://unpkg.com/vue@3/dist/vue.global.js",
  "pinia:module": "https://unpkg.com/pinia/dist/pinia.iife.js",
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

function createScriptImport() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const scripts = Object.entries(libraries).filter(([key, _]) => key.endsWith(':module')).map(([key, value]) => [key.replace(':module', ''), value])
    script.type = "importmap";
    script.innerHTML = JSON.stringify({
      imports: Object.fromEntries(scripts)
    }, null, "  ")
    script.onload = function () {
      return resolve();
    };
    script.onerror = function () {
      return reject("Error occurred while loading script");
    };
    document.head.appendChild(script);
  })
}

export async function init(scriptNames = [], callback = null) {
  const list = new Set(['vue', ...scriptNames])

  try {
    await createScriptImport()
    for(const scriptName of list) {
      await createScript(scriptName)
    }
    if (typeof callback === "function") callback()
  } catch(err) {
    console.error(err)
  }
}