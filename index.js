const ESM_CDN = "https://esm.sh";
const CJS_CDN = "https://unpkg.com";

function createScript(scriptName) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${CJS_CDN}/${scriptName}`
    script.onload = function() {
      return resolve()
    }
    script.onerror = function() {
      return reject("Error occurred while loading script");
    }
    document.body.appendChild(script)
  })
}

function createImportMap(libraries) {
  const importMaps = {}
  for (let imp of libraries) {
    importMaps[imp.split('@')[0]] = `${ESM_CDN}/${imp}`
  }
  const importMap = {
    imports: importMaps,
  };
  const im = document.createElement("script");
  im.type = "importmap";
  im.textContent = JSON.stringify(importMap);
  document.currentScript.after(im);
}

async function initialize(scriptNames = []) {
  const list = new Set([...scriptNames])
  const eventReady = new CustomEvent('static-ready')
  createImportMap(list)
  try {
    for(const scriptName of list) {
      await createScript(scriptName)
    }
    document.dispatchEvent(eventReady);
  } catch(err) {
    console.error(err)
  }
}

(async () => {
  let libraries = []
  const src = new URL(document.currentScript.src)
  for (const [key] of src.searchParams) {
    libraries.push(key)
  }

  await initialize(libraries);
})()