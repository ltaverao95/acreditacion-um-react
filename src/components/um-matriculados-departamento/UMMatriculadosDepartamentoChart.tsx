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
                data: new Array<any>(),
                backgroundColor: new Array<any>()
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
        this.onApplyFilters = this.onApplyFilters.bind(this);
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
                    responsive: true
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
                        departments,
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

                this.renderChart(res.data.ResultData);
            }
        );
    }

    renderChart(data: Array<any>) {

        console.log(data);

        this.pieChartData.labels = data.map(x => x.Nombre);

        this.pieChartData.datasets[0].data = [];
        this.pieChartData.datasets[0].backgroundColor = [];

        for (let i = 0; i < data.length; i++) {
            this.pieChartData.datasets[0].data.push(parseFloat(data[i].PorcentajeDato));
            this.pieChartData.datasets[0].backgroundColor.push(this.dynamicColors());
        }

        this.state.chart.options.title.display = true;
        //this.state.chart.options.legend.display = true;

        this.state.chart.update();
    }

    onYearsFilterChange(yearsData: Array<KeyValue>) {

        this.setState({
            selectedData: {
                years: yearsData,
                periods: this.state.selectedData.periods,
                departments: this.state.selectedData.departments
            }
        });

        let isSelectedAllYears = yearsData.find(x => x.value == 'select_all');
        let isSelectedAllDepartments = this.state.selectedData.departments.find(x => x.value == 'select_all');
        let isSelectedAllPeriods = this.state.selectedData.periods.find(x => x.value == 'select_all');
        let departmentsList = [];
        let periodsList = [];

        if (isSelectedAllDepartments ||
            this.state.selectedData.departments.length == 0) {
            departmentsList = this.state.filterData.departments.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            departmentsList = this.state.selectedData.departments.filter(x => x.value != 'select_all').map(x => x.value);
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
            departmentsList,
            periodsList,
            yearsList: yearsData
        });
    }

    onPeriodsFilterChange(periodsData: Array<KeyValue>) {
        this.setState({
            selectedData: {
                years: this.state.selectedData.years,
                periods: periodsData,
                departments: this.state.selectedData.departments
            }
        });

        let isSelectedAllYears = this.state.selectedData.years.find(x => x.value == 'select_all');
        let isSelectedAllDepartments = this.state.selectedData.departments.find(x => x.value == 'select_all');
        let isSelectedAllPeriods = periodsData.find(x => x.value == 'select_all');
        let departmentsList = [];
        let yearsList = [];

        if (isSelectedAllDepartments ||
            this.state.selectedData.departments.length == 0) {
            departmentsList = this.state.filterData.departments.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            departmentsList = this.state.selectedData.departments.filter(x => x.value != 'select_all').map(x => x.value);
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
            departmentsList,
            yearsList,
            periodsList: periodsData
        });
    }

    onDepartmentsFilterChange(departmentsData: Array<KeyValue>) {
        this.setState({
            selectedData: {
                years: this.state.selectedData.years,
                periods: this.state.selectedData.periods,
                departments: departmentsData
            }
        });

        let isSelectedAllYears = this.state.selectedData.years.find(x => x.value == 'select_all');
        let isSelectedAllDepartments = departmentsData.find(x => x.value == 'select_all');
        let isSelectedAllPeriods = this.state.selectedData.periods.find(x => x.value == 'select_all');
        let periodsList = [];
        let yearsList = [];

        if (isSelectedAllPeriods ||
            this.state.selectedData.periods.length == 0) {
            periodsList = this.state.filterData.periods.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            periodsList = this.state.selectedData.periods.filter(x => x.value != 'select_all').map(x => x.value);
        }

        if (isSelectedAllYears ||
            this.state.selectedData.years.length == 0) {
            yearsList = this.state.filterData.years.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            yearsList = this.state.selectedData.years.filter(x => x.value != 'select_all').map(x => x.value);
        }

        if (isSelectedAllDepartments ||
            departmentsData.length == 0) {
            departmentsData = this.state.filterData.periods.filter(x => x.value != 'select_all').map(x => x.value);
        }
        else {
            departmentsData = departmentsData.map(x => x.value);
        }

        this.setState({
            departmentsList: departmentsData,
            yearsList,
            periodsList
        });
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
                departments: departmentsList,
                years: yearsList,
                periods: periodsList
            };
        }
        else {
            dataRequest = {
                departments: this.state.departmentsList,
                years: this.state.yearsList,
                periods: this.state.periodsList
            };
        }

        this.validateFilterSelectedData();

        chartServices.GetPieChartDataByYearDepartmentPeriodCode(dataRequest).then(
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
                    departments: this.state.selectedData.departments,
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
                    departments: this.state.selectedData.departments,
                    periods: this.state.selectedData.periods
                }
            });
        }
    }

    dynamicColors() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
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

                <div className="chart">
                    <canvas id={"chart-pie-" + this.props.indexKey}></canvas>
                </div>

            </Loader>
        );
    }

}