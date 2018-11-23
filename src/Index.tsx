import * as React from "react";
import * as ReactDOM from "react-dom";
import './assets/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/images/logo.png';
import './assets/images/logo-con-acreditación.png';

import { HomeComponent } from './components/home/Home';

const rootApp = document.getElementById("root-app");

declare const __DEV__: string; // from webpack
let ISDEV: boolean = false;
if (__DEV__ == "dev") {
    console.log("dev stage");
    ISDEV = true;
}

ReactDOM.render(
    <HomeComponent />,
    rootApp
);