import App from './classes/app'
import config from './appconfig.js'
(() => {
  const app = new App(config)
  app.getData()
  .then(data => data.json())
  .then(({ el }) => {
    console.log(app);
    app.calculateFeaturedMatches(el)
    app.renderMatches()
  })
})()
