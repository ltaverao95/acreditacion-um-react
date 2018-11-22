import * as React from "react";
import { AxiosResponse } from 'axios';

import {
    KeyValue,
    IUMChartProps,
    IUMChartState,
    IFilterState
} from "../../models";
import { FilterServices } from '../../services/FilterServices';
import { ChartServices } from '../../services/ChartServices';
import { FilterComponent } from '../filter/Filter';

declare let Chart: any;

let filterService = new FilterServices();
let chartServices = new ChartServices();

interface OwnState{
    promisesCount?: number;
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
                years: [],
                periods: [],
                universities: []
            },
            promisesCount: 0
        };

        this.onYearsFilterChange = this.onYearsFilterChange.bind(this);
        this.onPeriodsFilterChange = this.onPeriodsFilterChange.bind(this);
        this.onUniversitiesFilterChange = this.onUniversitiesFilterChange.bind(this);
    }

    renderChartAjax(){

        if(this.state.promisesCount < 2){
            return;
        }

        this.setState({
            promisesCount: 0
        });

        let data: any = {
            universities: this.state.filterData.universities.filter(x => x.value != 'select_all').map(x => x.value),
            years: this.state.filterData.years.filter(x => x.value != 'select_all').map(x => x.value),
            periods: this.state.filterData.periods.filter(x => x.value != 'select_all').map(x => x.value)
        }

        chartServices.GetPyramidChartDataByYearPeriodUniversityCode(data).then(
            (res: AxiosResponse) => {
                console.log(res.data);
            }
        );
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
                        years: years
                    },
                    promisesCount: (this.state.promisesCount + 1)
                });

                this.renderChartAjax();
            }
        );
    }

    renderChart() {
        let ctx = document.getElementById("cone-chart-" + this.props.indexKey);
        let config = {
            type: 'funnel',
            data: {
                datasets: [{
                    data: [30, 60, 90],
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ],
                    hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56"
                    ]
                }],
                labels: [
                    "Red",
                    "Blue",
                    "Yellow"
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
                    enabled: true
                },
                sort: 'desc',
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
        };

        new Chart(ctx, config);
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
                        <FilterComponent label="Años" selectedData={this.state.selectedData.years} indexKey={this.props.indexKey == 2 ? 4 : 1} data={this.state.filterData.years} onChange={this.onYearsFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Periodos" selectedData={this.state.selectedData.periods} indexKey={this.props.indexKey == 2 ? 5 : 2} data={this.state.filterData.periods} onChange={this.onPeriodsFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Universidades" selectedData={this.state.selectedData.universities} indexKey={this.props.indexKey == 2 ? 6 : 3} data={this.state.filterData.universities} onChange={this.onUniversitiesFilterChange} />
                    </div>
                </div>

                <br />

                <canvas id={"cone-chart-" + this.props.indexKey} className="chart"></canvas>
            </div>
        );
    }

}