(async () => {
  let libraries = [];
  const ESM_CDN = "https://esm.sh/";
  const UNPKG_CDN = "https://unpkg.com/";
  const src = new URL(document.currentScript.src);
  for (const [key] of src.searchParams) {
    libraries.push(key);
  }
  const mode = document.currentScript.getAttribute("data-mode") ?? "javascript";
  const cdn = document.currentScript.getAttribute("data-cdn");
  await initialize(libraries, mode, cdn);

  /**
   * Create Script element with the script name declared
   * @param {string} scriptName - library name
   * @param {string} cdn - cdn address
   */
  function createScript(scriptName, cdn) {
    return new Promise((resolve, reject) => {
      const host = cdn ?? UNPKG_CDN;
      const script = document.createElement("script");
      script.src = `${host}${scriptName}`;
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
   * @param {string} cdn - cdn address
   */
  function createImportMap(scriptNames, cdn) {
    const importMaps = {};
    const host = cdn ?? ESM_CDN;
    for (let imp of scriptNames) {
      importMaps[imp.split("@")[0]] = `${host}${imp}`;
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
   * @param {string} cdn - change cdn address
   */
  async function initialize(scriptNames = [], mode = "javascript", cdn = null) {
    let host = cdn
    const list = new Set([...scriptNames]);
    const eventReady = new CustomEvent("static-ready");

    if (typeof host === "string") {
      host = host.slice(-1) !== "/" ? host + "/" : host
    }

    if (mode === "module") {
      createImportMap(list, host);
    } else {
      try {
        for (const scriptName of list) {
          await createScript(scriptName, host);
        }
        document.dispatchEvent(eventReady);
      } catch (err) {
        console.error(err);
      }
    }
  }
})()