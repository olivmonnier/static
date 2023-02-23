(async () => {
  let libraries = [];
  const ESM_CDN = "https://esm.sh/";
  const UNPKG_CDN = "https://unpkg.com/";
  const src = new URL(document.currentScript.src);
  for (const [key] of src.searchParams) {
    libraries.push(key);
  }
  const mode = document.currentScript.getAttribute("data-mode") ?? "javascript";
  await initialize(libraries, mode);

  /**
   * Create Script element with the script name declared
   * @param {string} scriptName - library name
   */
  function createScript(scriptName) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${UNPKG_CDN}${scriptName}`;
      script.onload = function () {
        return resolve();
      };
      script.onerror = function () {
        return reject("Error occurred while loading script");
      };
      document.body.appendChild(script);
    });
  }
  /**
   * Create script element as importmap type
   * @param {string[]} scriptNames - library name list
   */
  function createImportMap(scriptNames) {
    const importMaps = {};
    for (let imp of scriptNames) {
      importMaps[imp.split("@")[0]] = `${ESM_CDN}${imp}`;
    }
    const importMap = {
      imports: importMaps,
    };
    const im = document.createElement("script");
    im.type = "importmap";
    im.textContent = JSON.stringify(importMap);
    document.currentScript.after(im);
  }
  /**
   * Initialize the library imports by mode type
   * @param {string[]} scriptNames - library name list
   * @param {"javascript" | "module"} mode - import type mode
   */
  async function initialize(scriptNames = [], mode = "javascript") {
    const list = new Set([...scriptNames]);
    const eventReady = new CustomEvent("static-ready");

    if (mode === "module") {
      createImportMap(list);
    } else {
      try {
        for (const scriptName of list) {
          await createScript(scriptName);
        }
        document.dispatchEvent(eventReady);
      } catch (err) {
        console.error(err);
      }
    }
  }
})()