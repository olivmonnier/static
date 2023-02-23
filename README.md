## Examples
### Vue3
#### With classic script:
```html
<div id="app">{{ message }}</div>
<script src="https://cdn.statically.io/gh/olivmonnier/static/master/index.js?vue@3&vue-router@4&vue-i18n@8"></script>
<script>
  document.addEventListener('static-ready', () => {
    const { createApp } = Vue
    createApp({
      data() {
        return {
          message: 'Hello Vue!'
        }
      }
    }).mount('#app')
  })
</script>
```
#### With Javascript module:
```html
<div id="app">{{ message }}</div>
<script src="https://cdn.statically.io/gh/olivmonnier/static/master/index.js?vue@3/dist/vue.esm-bundler.js&vue-router@4&vue-i18n@8" data-mode="module"></script>
<script type="module">
  import { createApp } from "vue"
  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```