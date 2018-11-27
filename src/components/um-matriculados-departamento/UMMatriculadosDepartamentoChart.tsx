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
    departmentsList?: Array<KeyValue>;
    yearsList?: Array<KeyValue>;
    periodsList?: Array<KeyValue>;
}

export class UMMatriculadosDepartamentoChart extends React.Component<IUMChartProps, IUMChartState & OwnState> {

    private pieChartData: any = {
        labels: new Array<any>(),
        datasets: [
            {
                label: 'Departamentos',
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
                departments: []
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
                departments: [
                    {
                        label: 'Seleccionar Todo',
                        value: 'select_all'
                    }
                ]
            },
            departmentsList: [],
            periodsList: [],
            yearsList: [],
            promisesCount: 0,
            showLoadingDialog: true
        };

        this.onYearsFilterChange = this.onYearsFilterChange.bind(this);
        this.onPeriodsFilterChange = this.onPeriodsFilterChange.bind(this);
        this.onDepartmentsFilterChange = this.onDepartmentsFilterChange.bind(this);
    }

    componentDidMount() {

        let ctx = document.getElementById("chart-pie-" + this.props.indexKey);
        this.setState({
            chart: new Chart(ctx, {
                type: 'pie',
                data: this.pieChartData,
                options: {
                    title: {
                        display: false,
                        text: 'Matriculados por departamento'
                    },
                    legend: {
                        display: false
                    },
                    tooltips: {
                        enabled: true
                    },
                    responsive: true,
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
            })
        });

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
                        departments: this.state.filterData.departments,
                        periods: this.state.filterData.periods,
                        years: years.sort((a, b) => a.label - b.label)
                    },
                    promisesCount: (this.state.promisesCount + 1)
                });

                this.renderChartAjax();
            }
        );

        filterService.getFilterDepartments().then(
            (res: AxiosResponse) => {

                if (!res.data ||
                    !res.data.ResultData) {
                    return;
                }

                let departments: Array<KeyValue> = res.data.ResultData.map((x: any) => {
                    return {
                        label: x.Nombre,
                        value: x.Codigo
                    }
                });

                departments.unshift({
                    label: 'Seleccionar Todo',
                    value: 'select_all'
                });

                this.setState({
                    filterData: {
                        departments: departments,
                        periods: this.state.filterData.periods,
                        years: this.state.filterData.years
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
            departments: this.state.filterData.departments.filter(x => x.value != 'select_all').map(x => x.value),
            years: this.state.filterData.years.filter(x => x.value != 'select_all').map(x => x.value),
            periods: this.state.filterData.periods.filter(x => x.value != 'select_all').map(x => x.value)
        }

        chartServices.GetPieChartDataByYearDepartmentPeriodCode(data).then(
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

    renderChart(data: any) {
        let chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };

        console.log(data);

        this.state.chart.options.title.display = true;
        this.state.chart.options.legend.display = true;

        this.state.chart.update();
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

    onDepartmentsFilterChange(data: Array<KeyValue>) {
        this.setState({
            selectedData: {
                years: this.state.selectedData.years,
                periods: this.state.selectedData.periods,
                departments: data
            }
        });

        let isSelectedAll = data.find(x => x.value == 'select_all');
        if (isSelectedAll) {
                data = this.state.filterData.departments.filter(x => x.value != 'select_all');
                console.log(data);
            return;
        }
    }

    onApplyFilters() {

        this.setState({
            showLoadingDialog: true
        });

        let dataRequest: any = {};

        if (this.state.departmentsList.length == 0 &&
            this.state.yearsList.length == 0 &&
            this.state.periodsList.length == 0) {

            let departmentsList = this.state.filterData.departments.filter(x => x.value != 'select_all').map(x => x.value);
            let periodsList = this.state.filterData.periods.filter(x => x.value != 'select_all').map(x => x.value);
            let yearsList = this.state.filterData.years.filter(x => x.value != 'select_all').map(x => x.value);

            dataRequest = {
                departmentsList: departmentsList,
                years: yearsList,
                periods: periodsList
            };
        }
        else {
            dataRequest = {
                departmentsList: this.state.departmentsList,
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
        if (this.state.selectedData.departments.length == 0) {
            this.setState({
                selectedData: {
                    departments: [
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
                        <FilterComponent label="Departamento" selectedData={this.state.selectedData.departments} onApplyFilter={this.onApplyFilters} indexKey={13} data={this.state.filterData.departments} onChange={this.onDepartmentsFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Año" selectedData={this.state.selectedData.years} indexKey={14} onApplyFilter={this.onApplyFilters} data={this.state.filterData.years} onChange={this.onYearsFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Periodo" selectedData={this.state.selectedData.periods} indexKey={15} onApplyFilter={this.onApplyFilters} data={this.state.filterData.periods} onChange={this.onPeriodsFilterChange} />
                    </div>
                </div>

                <br />

                <canvas id={"chart-pie-" + this.props.indexKey} className="chart"></canvas>
            </Loader>
        );
    }

}