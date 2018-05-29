import React, {Component} from 'react'
import ReactDOM from 'react-dom'

class App extends Component {
  render() {
    return (
      <div className="body">
        НОВЫй ПРОЕКТ SUPERHO
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept(App, () => { render(App) });
}
