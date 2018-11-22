import * as React from "react";
import { AxiosResponse } from 'axios';

import {
    KeyValue,
    IUMChartProps,
    IUMChartState
} from "../../models";
import {
    FilterServices
} from '../../services/FilterServices';
import { FilterComponent } from '../filter/Filter';

declare let Chart: any;

let filterService: FilterServices = new FilterServices();

export class UMConteoTotalMatriculadosChart extends React.Component<IUMChartProps, IUMChartState> {

    constructor(props: IUMChartProps) {

        super(props);

        this.state = {
            filterData: {
                years: [],
                periods: filterService.getFilterPeriods(),
                universities: []
            },
            selectedData: {
                years: [],
                periods: [],
                universities: []
            }
        };

        this.onYearsFilterChange = this.onYearsFilterChange.bind(this);
        this.onPeriodsFilterChange = this.onPeriodsFilterChange.bind(this);
        this.onUniversitiesFilterChange = this.onUniversitiesFilterChange.bind(this);
    }

    componentDidMount() {

        this.renderChart();

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
                    }
                });
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
                        years: years
                    }
                });
            }
        );
    }

    renderChart() {
        let barChartData = {
            labels: ['2014', '2015', '2016', '2017'],
            datasets: [
                {
                    label: 'Pregrado',
                    backgroundColor: "rgb(255, 99, 132)",
                    data: [
                        10,
                        20,
                        30,
                        40
                    ]
                },
                {
                    label: 'Posgrado',
                    backgroundColor: "rgb(54, 162, 235)",
                    data: [
                        90,
                        80,
                        70,
                        60
                    ]
                }
            ]
        };

        let ctx = document.getElementById("stacked-chart-" + this.props.indexKey);
        let chartTest = new Chart(ctx, {
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
            
                        this.data.datasets.forEach(function (dataset: any, i:any) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function (bar: any, index: any) {
                                var data = dataset.data[index];                            
                                ctx.fillText(data, bar._model.x, bar._model.y - 5);
                            });
                        });
                    }
                }
            }
        });
    }

    onYearsFilterChange(data: Array<KeyValue>) {
        this.setState({
            selectedData: {
                years: data,
                periods: this.state.selectedData.periods,
                universities: this.state.selectedData.universities
            }
        });

        let isSelectedAll = data.find(x => x.value == 'select_all');
        if (isSelectedAll) {
            data = this.state.filterData.years.filter(x => x.value != 'select_all');
            console.log(data);
            return;
        }
    }

    onPeriodsFilterChange(data: Array<KeyValue>) {
        this.setState({
            selectedData: {
                years: this.state.selectedData.years,
                periods: data,
                universities: this.state.selectedData.universities
            }
        });

        let isSelectedAll = data.find(x => x.value == 'select_all');
        if (isSelectedAll) {
            data = this.state.filterData.periods.filter(x => x.value != 'select_all');
            console.log(data);
            return;
        }
    }

    onUniversitiesFilterChange(data: Array<KeyValue>) {
        this.setState({
            selectedData: {
                years: this.state.selectedData.years,
                periods: this.state.selectedData.periods,
                universities: data
            }
        });

        let isSelectedAll = data.find(x => x.value == 'select_all');
        if (isSelectedAll) {
            data = this.state.filterData.universities.filter(x => x.value != 'select_all');
            console.log(data);
            return;
        }
    }

    render() {
        return (
            <div>
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

                <canvas id={"stacked-chart-" + this.props.indexKey} className="chart"></canvas>
            </div>
        );
    }

}