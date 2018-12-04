import * as React from "react";
import { AxiosResponse } from 'axios';
import Loader from 'react-loader-advanced';

import {
    KeyValue,
    IUMChartProps,
    IUMChartState
} from "../../models";
import { FilterServices } from '../../services/FilterServices';
import { ChartServices } from '../../services/ChartServices';
import { FilterComponent } from '../filter/Filter';

declare let Chart: any;

let filterService = new FilterServices();
let chartServices = new ChartServices();

interface OwnState {
    chart?: any;
    chartData?: any;
    promisesCount?: number;
    showLoadingDialog?: boolean;
    universitiesList?: Array<KeyValue>;
    yearsList?: Array<KeyValue>;
    periodsList?: Array<KeyValue>;
}

export class UMMatriculadosPrimerCursoChart extends React.Component<IUMChartProps, IUMChartState & OwnState> {

    constructor(props: IUMChartProps) {

        super(props);

        this.state = {
            filterData: {
                years: [],
                periods: filterService.getFilterPeriods(),
                universities: []
            },
            selectedData: {
                years: [
                    {
                        label: 'Seleccionar Todo',
                        value: 'select_all'
                    }
                ],
                periods: [
                    {
                        label: 'Seleccionar Todo',
                        value: 'select_all'
                    }
                ],
                universities: [
                    {
                        label: 'Seleccionar Todo',
                        value: 'select_all'
                    }
                ]
            },
            universitiesList: [],
            periodsList: [],
            yearsList: [],
            promisesCount: 0,
            showLoadingDialog: true
        };

        this.onYearsFilterChange = this.onYearsFilterChange.bind(this);
        this.onPeriodsFilterChange = this.onPeriodsFilterChange.bind(this);
        this.onUniversitiesFilterChange = this.onUniversitiesFilterChange.bind(this);
        this.onApplyFilters = this.onApplyFilters.bind(this);
    }

    renderChartAjax() {

        if (this.state.promisesCount < 2) {
            return;
        }

        this.setState({
            promisesCount: 0,
            showLoadingDialog: true
        });

        let data: any = {
            universities: this.state.filterData.universities.filter(x => x.value != 'select_all').map(x => x.value),
            years: this.state.filterData.years.filter(x => x.value != 'select_all').map(x => x.value),
            periods: this.state.filterData.periods.filter(x => x.value != 'select_all').map(x => x.value)
        }

        chartServices.GetPyramidChartDataByYearPeriodUniversityCode(data).then(
            (res: AxiosResponse) => {

                this.setState({
                    showLoadingDialog: false
                });

                if (!res.data ||
                    !res.data.ResultData) {
                    return;
                }

                this.renderChart(res.data.ResultData);
            }
        );
    }

    renderChart(data: any) {

        this.setState({
            chartData: data
        });

        let objData = data;
        objData = {
            data: [
                parseInt(objData.Inscritos),
                parseInt(objData.Admitidos),
                parseInt(objData.Matriculados)
            ],
            labels: [
                "Inscritos",
                "Admitidos",
                "Matriculados"
            ]
        };

        let funnelChart = require('chartjs-funnel/dist/chart.funnel.bundled.min.js');

        let ctx = document.getElementById("cone-chart-" + this.props.indexKey);
        let config = {
            type: 'funnel',
            data: {
                datasets: [{
                    data: objData.data,
                    backgroundColor: [
                        "#A8CF45",
                        "#36A2EB",
                        "#FFCE56"
                    ],
                    hoverBackgroundColor: [
                        "#A8CF45",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }],
                labels: [
                    ...objData.labels
                ]
            },
            options: {
                responsive: true,
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Matriculados 1er curso'
                },
                tooltips: {
                    enabled: false
                    /*callbacks: {
                        title: function (tooltipItem: any, data: any) {
                            return data['labels'][tooltipItem[0]['index']];
                        },
                        label: (tooltipItem: any, data: any) => {
                            var dataset = data['datasets'][0];
                            return this.getFullPercentagesLabelsFromData(dataset['data'][tooltipItem['index']]);
                        }
                    },
                    backgroundColor: 'black',
                    titleFontSize: 18,
                    titleFontColor: '#0066ff',
                    titleFontStyle: 'bold',
                    bodyFontColor: '#fff',
                    bodyFontSize: 16,
                    bodyFontStyle: 'bold',
                    bodySpacing: 2*/
                },
                sort: 'desc',
                events: ['click'],
                hover: {
                    animationDuration: 0
                },
                animation: {
                    duration: 1,
                    onComplete: () => {

                        var chartInstance = this.state.chart,
                            ctx = chartInstance.chart.ctx;

                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'top';
                        ctx.fillStyle = "#fff";
                        ctx.fontSize = 16;

                        chartInstance.data.datasets.map(
                            (dataset: any, i: number) => {
                                var meta = chartInstance.chart.controller.getDatasetMeta(i);
                                meta.data.map(
                                    (bar: any, index: number) => {
                                        var data = dataset.data[index];

                                        let currentPercentage = this.getPercentagesFromData(data);

                                        if (!currentPercentage) {
                                            return;
                                        }

                                        /*if (chartInstance.tooltipActive != undefined) {
                                            if (chartInstance.tooltipActive.length > 0) {
                                                ctx.fillStyle = "transparent";
                                            }
                                        }*/

                                        ctx.fillText(currentPercentage + "%", bar._model.x, bar._model.y + 30);
                                    }
                                );
                            }
                        );
                    }
                }
            }
        };

        this.setState({
            chart: new funnelChart.Chart(ctx, config)
        });
    }

    componentDidMount() {

        filterService.getFilterUniversities().then(
            (res: AxiosResponse) => {

                if (!res.data ||
                    !res.data.ResultData) {
                    return;
                }

                let universities: Array<KeyValue> = res.data.ResultData.map((x: any) => {
                    return {
                        label: x.Nombre,
                        value: x.Codigo
                    }
                });

                universities.unshift({
                    label: 'Seleccionar Todo',
                    value: 'select_all'
                });

                this.setState({
                    filterData: {
                        universities: universities,
                        periods: this.state.filterData.periods,
                        years: this.state.filterData.years
                    },
                    promisesCount: (this.state.promisesCount + 1)
                });

                this.renderChartAjax();
            }
        );

        filterService.getFilterYears().then(
            (res: AxiosResponse) => {

                if (!res.data ||
                    !res.data.ResultData) {
                    return;
                }

                let years: Array<KeyValue> = res.data.ResultData.map((x: any) => {
                    return {
                        label: x.Value,
                        value: x.Value
                    }
                });

                years.unshift({
                    label: 'Seleccionar Todo',
                    value: 'select_all'
                });

                this.setState({
                    filterData: {
                        universities: this.state.filterData.universities,
                        periods: this.state.filterData.periods,
                        years: years.sort((a, b) => a.label - b.label)
                    },
                    promisesCount: (this.state.promisesCount + 1)
                });

                this.renderChartAjax();
            }
        );
    }

    onYearsFilterChange(yearsData: Array<KeyValue>) {

        this.setState({
            selectedData: {
                years: yearsData,
                periods: this.state.selectedData.periods,
                universities: this.state.selectedData.universities
            }
        });

        let isSelectedAllYears = yearsData.find(x => x.value == 'select_all');
        let isSelectedAllUniversities = this.state.selectedData.universities.find(x => x.value == 'select_all');
        let isSelectedAllPeriods = this.state.selectedData.periods.find(x => x.value == 'select_all');
        let universitiesList = [];
        let periodsList = [];

        if (isSelectedAllUniversities ||
            this.state.selectedData.universities.length == 0) {
            universitiesList = this.state.filterData.universities.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            universitiesList = this.state.selectedData.universities.filter(x => x.value != 'select_all').map(x => x.value);
        }

        if (isSelectedAllPeriods ||
            this.state.selectedData.periods.length == 0) {
            periodsList = this.state.filterData.periods.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            periodsList = this.state.selectedData.periods.filter(x => x.value != 'select_all').map(x => x.value);
        }

        if (isSelectedAllYears ||
            yearsData.length == 0) {
            yearsData = this.state.filterData.years.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            yearsData = yearsData.map(x => x.value);
        }

        this.setState({
            universitiesList,
            periodsList,
            yearsList: yearsData
        });
    }

    onPeriodsFilterChange(periodsData: Array<KeyValue>) {
        this.setState({
            selectedData: {
                years: this.state.selectedData.years,
                periods: periodsData,
                universities: this.state.selectedData.universities
            }
        });

        let isSelectedAllYears = this.state.selectedData.years.find(x => x.value == 'select_all');
        let isSelectedAllUniversities = this.state.selectedData.universities.find(x => x.value == 'select_all');
        let isSelectedAllPeriods = periodsData.find(x => x.value == 'select_all');
        let universitiesList = [];
        let yearsList = [];

        if (isSelectedAllUniversities ||
            this.state.selectedData.universities.length == 0) {
            universitiesList = this.state.filterData.universities.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            universitiesList = this.state.selectedData.universities.filter(x => x.value != 'select_all').map(x => x.value);
        }

        if (isSelectedAllYears ||
            this.state.selectedData.years.length == 0) {
            yearsList = this.state.filterData.years.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            yearsList = this.state.selectedData.years.filter(x => x.value != 'select_all').map(x => x.value);
        }

        if (isSelectedAllPeriods ||
            periodsData.length == 0) {
            periodsData = this.state.filterData.periods.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            periodsData = periodsData.map(x => x.value);
        }

        this.setState({
            universitiesList,
            yearsList,
            periodsList: periodsData
        });
    }

    onUniversitiesFilterChange(universitiesData: Array<KeyValue>) {
        this.setState({
            selectedData: {
                years: this.state.selectedData.years,
                periods: this.state.selectedData.periods,
                universities: universitiesData
            }
        });

        let isSelectedAllYears = this.state.selectedData.years.find(x => x.value == 'select_all');
        let isSelectedAllUniversities = universitiesData.find(x => x.value == 'select_all');
        let isSelectedAllPeriods = this.state.selectedData.periods.find(x => x.value == 'select_all');
        let periodsList = [];
        let yearsList = [];

        if (isSelectedAllUniversities ||
            universitiesData.length == 0) {
            universitiesData = this.state.filterData.universities.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            universitiesData = universitiesData.map(x => x.value);
        }

        if (isSelectedAllYears ||
            this.state.selectedData.years.length == 0) {
            yearsList = this.state.filterData.years.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            yearsList = this.state.selectedData.years.filter(x => x.value != 'select_all').map(x => x.value);
        }

        if (isSelectedAllPeriods ||
            this.state.selectedData.periods.length == 0) {
            periodsList = this.state.filterData.periods.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            periodsList = this.state.selectedData.periods.filter(x => x.value != 'select_all').map(x => x.value);
        }

        this.setState({
            universitiesList: universitiesData,
            yearsList,
            periodsList
        });
    }

    onApplyFilters() {

        this.setState({
            showLoadingDialog: true
        });

        let dataRequest: any = {};

        if (this.state.universitiesList.length == 0 &&
            this.state.yearsList.length == 0 &&
            this.state.periodsList.length == 0) {

            let universitiesList = this.state.filterData.universities.filter(x => x.value != 'select_all').map(x => x.value);
            let periodsList = this.state.filterData.periods.filter(x => x.value != 'select_all').map(x => x.value);
            let yearsList = this.state.filterData.years.filter(x => x.value != 'select_all').map(x => x.value);

            dataRequest = {
                universities: universitiesList,
                years: yearsList,
                periods: periodsList
            };
        }
        else {
            dataRequest = {
                universities: this.state.universitiesList,
                years: this.state.yearsList,
                periods: this.state.periodsList
            };
        }

        this.validateFilterSelectedData();

        chartServices.GetPyramidChartDataByYearPeriodUniversityCode(dataRequest).then(
            (res: AxiosResponse) => {

                this.setState({
                    showLoadingDialog: false
                });

                if (!res.data ||
                    !res.data.ResultData) {
                    return;
                }

                this.renderChart(res.data.ResultData);
            }
        );
    }

    validateFilterSelectedData() {
        if (this.state.selectedData.universities.length == 0) {
            this.setState({
                selectedData: {
                    universities: [
                        {
                            label: 'Seleccionar Todo',
                            value: 'select_all'
                        }
                    ],
                    periods: this.state.selectedData.periods,
                    years: this.state.selectedData.years
                }
            });
        }

        if (this.state.selectedData.periods.length == 0) {
            this.setState({
                selectedData: {
                    periods: [
                        {
                            label: 'Seleccionar Todo',
                            value: 'select_all'
                        }
                    ],
                    universities: this.state.selectedData.universities,
                    years: this.state.selectedData.years
                }
            });
        }

        if (this.state.selectedData.years.length == 0) {
            this.setState({
                selectedData: {
                    years: [
                        {
                            label: 'Seleccionar Todo',
                            value: 'select_all'
                        }
                    ],
                    universities: this.state.selectedData.universities,
                    periods: this.state.selectedData.periods
                }
            });
        }
    }

    getPercentagesFromData(data: any) {
        let currentPercentage = null;

        for (let item in this.state.chartData) {
            if (this.state.chartData[item] == data) {
                switch (item) {
                    case "Inscritos":
                        {
                            currentPercentage = this.state.chartData.PorcentajeInscritos
                            break;
                        }
                    case "Admitidos":
                        {
                            currentPercentage = this.state.chartData.PorcentajeAdmitidos
                            break;
                        }
                    case "Matriculados":
                        {
                            currentPercentage = this.state.chartData.PorcentajeMatriculados
                            break;
                        }
                }
            }
        }

        return currentPercentage;
    }

    getFullPercentagesLabelsFromData(data: any) {
        let currentPercentage = null;

        for (let item in this.state.chartData) {
            if (this.state.chartData[item] == data) {
                switch (item) {
                    case "Inscritos":
                        {
                            currentPercentage = "Inscritos: " + this.state.chartData.PorcentajeInscritos + "%";
                            break;
                        }
                    case "Admitidos":
                        {
                            currentPercentage = "Admitidos: " + this.state.chartData.PorcentajeAdmitidos + "%";
                            break;
                        }
                    case "Matriculados":
                        {
                            currentPercentage = "Matriculados: " + this.state.chartData.PorcentajeMatriculados + "%";
                            break;
                        }
                }
            }
        }

        return currentPercentage;
    }

    render() {
        return (
            <Loader show={this.state.showLoadingDialog} message={'Cargando...'}>
                <div className="filter-container">
                    <div className="filter-item">
                        <FilterComponent label="Universidad" selectedData={this.state.selectedData.universities} indexKey={this.props.indexKey == 2 ? 6 : 3} data={this.state.filterData.universities} onApplyFilter={this.onApplyFilters} onChange={this.onUniversitiesFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Año" selectedData={this.state.selectedData.years} indexKey={this.props.indexKey == 2 ? 4 : 1} data={this.state.filterData.years} onApplyFilter={this.onApplyFilters} onChange={this.onYearsFilterChange} />

                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Periodo" selectedData={this.state.selectedData.periods} indexKey={this.props.indexKey == 2 ? 5 : 2} data={this.state.filterData.periods} onApplyFilter={this.onApplyFilters} onChange={this.onPeriodsFilterChange} />
                    </div>
                </div>

                <div className="applyfilterContainer">
                    <canvas id={"cone-chart-" + this.props.indexKey} className="chart"></canvas>
                </div>
            </Loader>
        );
    }

}