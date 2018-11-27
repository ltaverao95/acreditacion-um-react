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

let filterService: FilterServices = new FilterServices();
let chartServices = new ChartServices();

declare let Chart: any;

interface OwnState {
    chart?: any;
    promisesCount?: number;
    showLoadingDialog?: boolean;
    universitiesList?: Array<KeyValue>;
    yearsList?: Array<KeyValue>;
    periodsList?: Array<KeyValue>;
}

export class UMConteoTotalMatriculadosChart extends React.Component<IUMChartProps, IUMChartState & OwnState> {

    private barChartData: any = {
        labels: new Array<any>(),
        datasets: [
            {
                label: 'Pregrado',
                backgroundColor: "#A8CF45",
                hoverBackgroundColor: "#A8CF45",
                data: new Array<any>()
            },
            {
                label: 'Posgrado',
                backgroundColor: "rgb(54, 162, 235)",
                hoverBackgroundColor: "rgb(54, 162, 235)",
                data: new Array<any>()
            }
        ]
    };

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

    componentDidMount() {

        let ctx = document.getElementById("stacked-chart-" + this.props.indexKey);
        this.setState({
            chart: new Chart(ctx, {
                type: 'bar',
                data: this.barChartData,
                options: {
                    title: {
                        display: false,
                        text: 'Conteo total matriculados'
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: false
                    },
                    responsive: true,
                    scales: {
                        xAxes: [{
                            stacked: true,
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    },
                    hover: {
                        animationDuration: 0
                    },
                    animation: {
                        duration: 1,
                        onComplete: function () {
                            var chartInstance = this.chart,
                                ctx = chartInstance.ctx;
                            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillStyle = "#fff";
    
                            this.data.datasets.forEach(function (dataset: any, i: any) {
                                var meta = chartInstance.controller.getDatasetMeta(i);
                                meta.data.forEach(function (bar: any, index: any) {
                                    var data = dataset.data[index];
                                    ctx.fillText(parseInt(data).toLocaleString(), bar._model.x, bar._model.y);
                                });
                            });
                        }
                    }
                }
            })
        });

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

        chartServices.GetStackedChartDataByYearPeriodUniversityCode(data).then(
            (res: AxiosResponse) => {
                this.setState({
                    showLoadingDialog: false
                });

                if (!res.data ||
                    !res.data.ResultData) {
                    return;
                }

                let data = res.data.ResultData;

                this.renderChart(data);
            }
        );
    }

    renderChart(data: Array<any>) {

        let years = data.map(x => x.Anio);
        let yearsFiltered = new Array<any>();

        for (let i = 0; i < years.length; i++) {
            let currentYear: any = yearsFiltered.find(x => x == years[i]);
            if (currentYear) {
                continue;
            }

            yearsFiltered.push(years[i]);
        }

        yearsFiltered = yearsFiltered.sort();

        this.barChartData.labels = [...yearsFiltered];

        let pregradoData: Array<any> = [];
        let posgradoData: Array<any> = [];

        for (let i = 0; i < yearsFiltered.length; i++) {

            let dataByYear: Array<any> = data.filter(x => x.Anio == yearsFiltered[i]);

            pregradoData.push(...dataByYear.filter(x => x.Codigo == 1).map(x => parseInt(x.Dato)));
            posgradoData.push(...dataByYear.filter(x => x.Codigo == 2).map(x => parseInt(x.Dato)));
        }

        this.barChartData.datasets[0].data = pregradoData;
        this.barChartData.datasets[1].data = posgradoData;

        this.state.chart.options.title.display = true;
        this.state.chart.options.legend.display = true;

        this.state.chart.update();
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

        chartServices.GetStackedChartDataByYearPeriodUniversityCode(dataRequest).then(
            (res: AxiosResponse) => {
                this.setState({
                    showLoadingDialog: false
                });

                if (!res.data ||
                    !res.data.ResultData) {
                    return;
                }

                let data = res.data.ResultData;

                this.renderChart(data);
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

    render() {
        return (
            <Loader show={this.state.showLoadingDialog} message={'Cargando...'}>
                <div className="filter-container">
                    <div className="filter-item">
                        <FilterComponent label="Universidad" selectedData={this.state.selectedData.universities} onApplyFilter={this.onApplyFilters} indexKey={this.props.indexKey == 2 ? 12 : 9} data={this.state.filterData.universities} onChange={this.onUniversitiesFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Año" selectedData={this.state.selectedData.years} onApplyFilter={this.onApplyFilters} indexKey={this.props.indexKey == 2 ? 10 : 7} data={this.state.filterData.years} onChange={this.onYearsFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Periodo" selectedData={this.state.selectedData.periods} onApplyFilter={this.onApplyFilters} indexKey={this.props.indexKey == 2 ? 11 : 8} data={this.state.filterData.periods} onChange={this.onPeriodsFilterChange} />
                    </div>
                </div>

                <div className="applyfilterContainer">
                    <canvas id={"stacked-chart-" + this.props.indexKey} className="chart"></canvas>
                </div>
            </Loader>
        );
    }

}