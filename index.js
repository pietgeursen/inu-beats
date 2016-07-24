import { start, pull, html } from 'inu'
import Pushable from 'pull-pushable'
import Immutable from 'seamless-immutable'
import classnames from 'classnames'
import play from 'audio-play'

import Notes from './components/notes'

const app = {
  init: function () {
    return Immutable({
      model: {
        notes: [false, false, false, false],
        index: 0
      },
      effect: {type: 'SCHEDULE_TICK', payload: 300}
    })
  },
  update: function (model, action) {
    //console.log(model, action);
    var newModel = Immutable(model)
    switch(action.type){
      case 'TICK':
      newModel = Immutable(model).set('index', (model.index + 1) % model.notes.length) 
      break;
      case 'TIMER_CREATED':
      newModel = Immutable(model).set('timer', action.payload) 
      break;
      case 'TOGGLE_NOTE':
      newModel = Immutable(model).setIn(['notes', action.payload], !model.notes[action.payload] ) 
      break;
    }
    return {model: newModel.asMutable({deep: true})}
  },
  view: function (model, dispatch) {
    return html`<main>
      <div class='part'>
        ${Notes(model, dispatch)}
      </div>
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
