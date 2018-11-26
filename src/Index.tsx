import * as React from "react";
import * as ReactDOM from "react-dom";
import './assets/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/images/logo.png';
import './assets/images/logo-con-acreditación.png';

import { HomeComponent } from './components/home/Home';

require('chart.js/dist/Chart.min.js');
require('chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.js');

/*Chart.plugins.register({
    afterDatasetsDraw: function(chart: any) {
        var ctx = chart.ctx;

        chart.data.datasets.forEach(function(dataset: any, i: number) {
            var meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
                meta.data.forEach(function(element: any, index: number) {
                    // Draw the text in black, with the specified font
                    ctx.fillStyle = 'rgb(0, 0, 0)';

                    var fontSize = 16;
                    var fontStyle = 'normal';
                    var fontFamily = 'Helvetica Neue';
                    ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                    // Just naively convert to string for now
                    var dataString = dataset.data[index].toString();

                    // Make sure alignment settings are correct
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    var padding = 5;
                    var position = element.tooltipPosition();
                    ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                });
            }
        });
    }
});*/

require('chartjs-funnel/dist/chart.funnel.bundled.min.js');
declare let Chart: any;

Chart.defaults.global.defaultFontSize = 16;
Chart.Legend.prototype.afterFit = function() {
    this.height = this.height + 20;
};

const rootApp = document.getElementById("root-app");

ReactDOM.render(
    <HomeComponent />,
    rootApp
);