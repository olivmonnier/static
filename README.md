## Examples
### Vue3

```html
<div id="app">{{ message }}</div>
<script src="https://cdn.statically.io/gh/olivmonnier/static/master/index.js?vue@3&vue-router@4&vue-i18n@8"></script>
<script type="module">
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