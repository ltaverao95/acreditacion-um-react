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

export class UMMatriculadosPrimerCursoChart extends React.Component<IUMChartProps, IUMChartState> {

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
                        universities: this.state.filterData.universities,
                        periods: this.state.filterData.periods,
                        years: years
                    }
                });
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
                animation: {
                    animateScale: true,
                    animateRotate: true
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