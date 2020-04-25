import React from 'react';
import ReactDOM from 'react-dom';
import {BreakpointProvider} from 'react-socks';

// Redux
import {Provider} from 'react-redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './vastuscomponents/redux/store';
import AWSConfig from "./AppConfig";
import {theme, ifCallLambdaAtStart} from "./Constants";
import Lambda from "./vastuscomponents/api/Lambda";
import SplashScreen from "./authscreens/SplashScreen";
import lightTheme from "./vastuscomponents/semantic/semantic-light-theme/dist/semantic.min.css";

// switch (theme) {
//   case "light":
//     require('./vastuscomponents/semantic/semantic-light-theme/dist/semantic.min.css');
//     break;
//   case "dark":
//     require('./vastuscomponents/semantic/semantic-dark-theme/dist/semantic.min.css');
//     break;
//   default:
//     require('./vastuscomponents/semantic/semantic-light-theme/dist/semantic.min.css');
//     break;
// }

// window.LOG_LEVEL='DEBUG';

require('./vastuscomponents/api/Ably');

AWSConfig();

if (ifCallLambdaAtStart) {
  Lambda.ping();
}

ReactDOM.render(
  <BreakpointProvider>
    <Provider store={store}>
      <SplashScreen>
        <div style={lightTheme}>
          <App/>
        </div>
      </SplashScreen>
    </Provider>
  </BreakpointProvider>,
  document.getElementById('root')
);

registerServiceWorker();
