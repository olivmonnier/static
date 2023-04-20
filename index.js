// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs
(async () => {
  const src = new URL(document.currentScript.src);
  for (const [key] of src.searchParams) {
    if (key === "js") createScript(src.searchParams.get(key));
    if (key === "module") createScript(src.searchParams.get(key), true);
    if (key === "css" || key === "style") createStyle(src.searchParams.get(key));
  }
  /**
   * Create Script element with the content declared
   * @param {string} content 
   */
  function createScript(content, module = false) {
    const script = document.createElement("script");
    if (module) script.type = "module";
    script.textContent = content;
    document.body.appendChild(script);
  }

  /**
   * Create Style element with the content declared
   * @param {string} content
   */
  function createStyle(content) {
    const style = document.createElement("style");
    style.textContent = content;
    document.head.appendChild(style);
  }
})()