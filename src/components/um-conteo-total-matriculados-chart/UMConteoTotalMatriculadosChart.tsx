import * as React from "react";
import { AxiosResponse } from 'axios';
import { Button } from "reactstrap";
import {
    Glyphicon
} from "react-bootstrap";
import Loader from 'react-loader-advanced';

import {
    KeyValue,
    IUMChartProps,
    IUMChartState
} from "../../models";
import { FilterServices } from '../../services/FilterServices';
import { ChartServices } from '../../services/ChartServices';
import { FilterComponent } from '../filter/Filter';

require('chart.js/dist/Chart.min.js');
require('chartjs-funnel/dist/chart.funnel.bundled.min.js');
declare let Chart: any;

let filterService: FilterServices = new FilterServices();
let chartServices = new ChartServices();

interface OwnState {
    promisesCount?: number;
    showLoadingDialog?: boolean;
    universitiesList?: Array<KeyValue>;
    yearsList?: Array<KeyValue>;
    periodsList?: Array<KeyValue>;
}

export class UMConteoTotalMatriculadosChart extends React.Component<IUMChartProps, IUMChartState & OwnState> {

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
            promisesCount: 0,
            showLoadingDialog: true
        };

        this.onYearsFilterChange = this.onYearsFilterChange.bind(this);
        this.onPeriodsFilterChange = this.onPeriodsFilterChange.bind(this);
        this.onUniversitiesFilterChange = this.onUniversitiesFilterChange.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
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

        let barChartData = {
            labels: [...yearsFiltered],
            datasets: [
                {
                    label: 'Pregrado',
                    backgroundColor: "rgb(255, 99, 132)",
                    data: new Array<any>()
                },
                {
                    label: 'Posgrado',
                    backgroundColor: "rgb(54, 162, 235)",
                    data: new Array<any>()
                }
            ]
        };

        for (let i = 0; i < yearsFiltered.length; i++) {

            let dataByYear = data.filter(x => x.Anio == yearsFiltered[i]);

            let pregradoData: Array<any> = dataByYear.filter(x => x.Codigo == 1).map(x => parseFloat(x.PctDato));
            let posgradoData: Array<any> = dataByYear.filter(x => x.Codigo == 2).map(x => parseFloat(x.PctDato));

            barChartData.datasets[0].data.push(...pregradoData);
            barChartData.datasets[1].data.push(...posgradoData);
        }

        let ctx = document.getElementById("stacked-chart-" + this.props.indexKey);
        new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                title: {
                    display: true,
                    text: 'Conteo total matriculados'
                },
                tooltips: {
                    enabled: true
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

                        this.data.datasets.forEach(function (dataset: any, i: any) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function (bar: any, index: any) {
                                var data = dataset.data[index];
                                ctx.fillText(data + "%", bar._model.x, bar._model.y - 5);
                            });
                        });
                    }
                }
            }
        });
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

    applyFilters() {

        this.setState({
            showLoadingDialog: true
        });

        let dataRequest: any = {
            universities: this.state.universitiesList,
            years: this.state.yearsList,
            periods: this.state.periodsList
        }

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

    render() {
        return (
            <Loader show={this.state.showLoadingDialog} message={'Cargando...'}>
                <div className="filter-container">
                    <div className="filter-item">
                        <FilterComponent label="Años" selectedData={this.state.selectedData.years} indexKey={this.props.indexKey == 2 ? 10 : 7} data={this.state.filterData.years} onChange={this.onYearsFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Periodos" selectedData={this.state.selectedData.periods} indexKey={this.props.indexKey == 2 ? 11 : 8} data={this.state.filterData.periods} onChange={this.onPeriodsFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Universidades" selectedData={this.state.selectedData.universities} indexKey={this.props.indexKey == 2 ? 12 : 9} data={this.state.filterData.universities} onChange={this.onUniversitiesFilterChange} />
                    </div>
                </div>

                <br />

                <div className="applyfilterContainer">
                    <Button className="applyFilterButton" outline color="secondary" onClick={this.applyFilters}>
                        Aplicar Filtros
                        <Glyphicon glyph="filter" />
                    </Button>

                    <canvas id={"stacked-chart-" + this.props.indexKey} className="chart"></canvas>
                </div>
            </Loader>
        );
    }

}