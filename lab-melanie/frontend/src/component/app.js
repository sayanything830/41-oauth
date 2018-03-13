import React from 'react';
import {Provider} from 'react-redux';

import {BrowserRouter, Route, Redirect} from 'react-router-dom';



export default class App extends React.Component {
  // constructor(props) {
  //   super(props);
  // }


  render() {

    return (
      <main className="application">
        {/* <Provider>
          <BrowserRouter>
            <React.Fragment>

            </React.Fragment>
          </BrowserRouter>
        </Provider> */}
      </main>
    );
  }
}
