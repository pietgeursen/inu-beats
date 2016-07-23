import {start, pull, html} from 'inu'

const app = {

  init: function() {
   return {model: {greeting: 'hello, you are awesome!'}} 
  },
  update: function(model, action) {
   return {model} 
  },
  view: function(model, dispatch) {
    return html`<main>${model.greeting}</main>` 
  },
  run: function(effect, streams) {
    
  }
}

const {views} = start(app)

const main = document.querySelector('main')

pull(views(), pull.drain(function(view) {
  html.update(main, view)  
}))
