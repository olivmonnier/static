const libraries = {
  vue: "https://unpkg.com/vue@3/dist/vue.global.js",
  router: "https://unpkg.com/vue-router@4",
  i18n: "https://unpkg.com/vue-i18n@8",
};

(async () => {
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
  
  async function initialize(scriptNames = []) {
    const list = new Set(['vue', ...scriptNames])
    const eventReady = new CustomEvent('static-ready')
  
    try {
      for(const scriptName of list) {
        await createScript(scriptName)
      }
      document.dispatchEvent(eventReady);
    } catch(err) {
      console.error(err)
    }
  }

  const attrs = document.currentScript.getAttribute("data-dependencies");
  const dependencies = attrs.split(',').map(d => d.trim())
  await initialize(dependencies);
})()