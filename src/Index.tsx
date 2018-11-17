import * as React from "react";
import * as ReactDOM from "react-dom";

import { HomeComponent } from './components/home/Home';

const rootApp = document.getElementById("root-app");

declare const __DEV__: string; // from webpack
let ISDEV: boolean = false;
if (__DEV__ == "dev") {
    console.log("dev stage");
    ISDEV = true;
}

ReactDOM.render(
    <HomeComponent compiler="TypeScript" framework="React" />,
    rootApp
);