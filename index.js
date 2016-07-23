import { start, pull, html } from 'inu'
import Pushable from 'pull-pushable'
import Immutable from 'seamless-immutable'

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
      const newModel = Immutable(model).set('index', (model.index + 1) % model.notes.length) 
      return {model: newModel.asMutable({deep: true})}
    }
    return {model}
  },
  view: function (model, dispatch) {
    return html`<main>
      ${model.notes.map(function(note, index) {
       return html`<div class=${model.index === index ? 'playing' : ''}>note</div>` 
      })}
    </main>`
  },
  run: function (effect, sources) {
    console.log(effect);
    switch(effect.type){
      case 'SCHEDULE_TICK': 
        const p = Pushable()
        setInterval(() => p.push({type: 'TICK'}), effect.payload)
        return p
    } 
  }
}

const {views} = start(app)

const main = document.querySelector('main')

pull(views(), pull.drain(function (view) {
  html.update(main, view)
}))
