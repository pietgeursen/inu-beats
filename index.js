import { start, pull, html } from 'inu'
import Pushable from 'pull-pushable'
import Immutable from 'seamless-immutable'
import classnames from 'classnames'

const app = {
  init: function () {
    return Immutable({
      model: {
        notes: [true, false, false, false],
        index: 0
      },
      effect: {type: 'SCHEDULE_TICK', payload: 300}
    })
  },
  update: function (model, action) {
    //console.log(model, action);
    switch(action.type){
      case 'TICK':
      var newModel = Immutable(model).set('index', (model.index + 1) % model.notes.length) 
      return {model: newModel.asMutable({deep: true})}
      break;
      case 'TIMER_CREATED':
      var newModel = Immutable(model).set('timer', action.payload) 
      return {model: newModel.asMutable({deep: true})}
      break;
      
    }
    return {model}
  },
  view: function (model, dispatch) {
    return html`<main>
      ${model.notes.map(function(note, index) {
       return html`<div class=${classnames({playing: model.index === index, on: note})}>note</div>` 
      })}
    </main>`
  },
  run: function (effect, sources) {
    console.log(effect);
    switch(effect.type){
      case 'SCHEDULE_TICK': 
        const p = Pushable()
        const timer =  setInterval(() => p.push({type: 'TICK'}), effect.payload)
        p.push({type: 'TIMER_CREATED', payload: timer}) 
        return p
    } 
  }
}

const {views} = start(app)

const main = document.querySelector('main')

pull(views(), pull.drain(function (view) {
  html.update(main, view)
}))
