import * as React from "react";
import * as ReactDOM from "react-dom";
import './assets/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/images/logo.png';
import './assets/images/logo-con-acreditación.png';

import { HomeComponent } from './components/home/Home';

require('chart.js/dist/Chart.min.js');
require('chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.js');
declare let Chart: any;

Chart.defaults.global.defaultFontSize = 16;

const rootApp = document.getElementById("root-app");

ReactDOM.render(
    <HomeComponent />,
    rootApp
);