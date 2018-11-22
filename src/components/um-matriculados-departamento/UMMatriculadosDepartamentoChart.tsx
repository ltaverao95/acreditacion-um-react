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

export class UMMatriculadosDepartamentoChart extends React.Component<IUMChartProps, IUMChartState> {

    constructor(props: IUMChartProps) {

        super(props);

        this.state = {
            filterData: {
                years: [],
                periods: filterService.getFilterPeriods(),
                departments: []
            },
            selectedData: {
                years: [],
                periods: [],
                departments: []
            }
        };

        this.onYearsFilterChange = this.onYearsFilterChange.bind(this);
        this.onPeriodsFilterChange = this.onPeriodsFilterChange.bind(this);
        this.onDepartmentsFilterChange = this.onDepartmentsFilterChange.bind(this);
    }

    componentDidMount() {

        this.renderChart();

        filterService.getFilterYears().then(
            (res: AxiosResponse) => {

                if (!res.data ||
                    !res.data.ResultData) {
                    return;
                }

                let years: Array<KeyValue> = res.data.ResultData.map((x: any, index: number) => {
                    return {
                        label: x.Value,
                        value: index
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
                        years: years
                    }
                });
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
                    }
                });
            }
        );
    }

    renderChart() {
        let chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };

        let ctx = document.getElementById("chart-pie-" + this.props.indexKey);
        new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{
                    data: [10, 20, 30],
                    backgroundColor: [
                        chartColors.red,
                        chartColors.orange,
                        chartColors.yellow,
                        chartColors.green,
                        chartColors.blue,
                    ],
                    label: 'Dataset 1'
                }],

                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: [
                    'Red',
                    'Yellow',
                    'Blue'
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Matriculados por departamento'
                },
                tooltips: {
                    enabled: true
                },
                responsive: true
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

    render() {
        return (
            <div>
                <div className="filter-container">
                    <div className="filter-item">
                        <FilterComponent label="Departamento" selectedData={this.state.selectedData.departments} indexKey={13} data={this.state.filterData.departments} onChange={this.onDepartmentsFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Año" selectedData={this.state.selectedData.years} indexKey={14} data={this.state.filterData.years} onChange={this.onYearsFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Periodo" selectedData={this.state.selectedData.periods} indexKey={15} data={this.state.filterData.periods} onChange={this.onPeriodsFilterChange} />
                    </div>
                </div>

                <br />

                <canvas id={"chart-pie-" + this.props.indexKey} className="chart"></canvas>
            </div>
        );
    }

}