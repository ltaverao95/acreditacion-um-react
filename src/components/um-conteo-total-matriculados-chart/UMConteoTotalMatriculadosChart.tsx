import * as React from "react";

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
                years: filterService.getFilterYears(),
                periods: filterService.getFilterPeriods(),
                universities: filterService.getFilterUniversities()
            }
        };

        this.onYearsFilterChange = this.onYearsFilterChange.bind(this);
        this.onPeriodsFilterChange = this.onPeriodsFilterChange.bind(this);
        this.onUniversitiesFilterChange = this.onUniversitiesFilterChange.bind(this);
    }

    componentDidMount() {

        this.renderChart();
    }

    renderChart() {
        let barChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'Dataset 1',
                backgroundColor: "rgb(255, 99, 132)",
                data: [
                    -49,
                    23,
                    85,
                    -76,
                    54,
                    26,
                    74
                ]
            }, {
                label: 'Dataset 2',
                backgroundColor: "rgb(54, 162, 235)",
                data: [
                    89
                    - 67,
                    84,
                    12,
                    90,
                    39,
                    -92
                ]
            }, {
                label: 'Dataset 3',
                backgroundColor: "rgb(75, 192, 192)",
                data: [
                    -20,
                    21,
                    58,
                    85,
                    -86,
                    -53,
                    91
                ]
            }]

        }

        let ctx = document.getElementById("stacked-chart-" + this.props.indexKey);
        new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                title: {
                    display: true,
                    text: 'Acreditación UM'
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
                }
            }
        });
    }

    onYearsFilterChange(data: Array<KeyValue>) {
        console.log(data);
    }

    onPeriodsFilterChange(data: Array<KeyValue>) {
        console.log(data);
    }

    onUniversitiesFilterChange(data: Array<KeyValue>) {
        console.log(data);
    }

    render() {
        return (
            <div>
                <p>Conteo total matriculados</p>

                <div className="filter-container">
                    <div className="filter-item">
                        <FilterComponent label="Años" indexKey={this.props.indexKey == 2 ? 10 : 7} data={this.state.filterData.years} onChange={this.onYearsFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Periodos" indexKey={this.props.indexKey == 2 ? 11 : 8} data={this.state.filterData.periods} onChange={this.onPeriodsFilterChange} />
                    </div>
                    <div className="filter-item">
                        <FilterComponent label="Universidades" indexKey={this.props.indexKey == 2 ? 12 : 9} data={this.state.filterData.universities} onChange={this.onUniversitiesFilterChange} />
                    </div>
                </div>

                <br />

                <canvas id={"stacked-chart-" + this.props.indexKey} className="chart"></canvas>
            </div>
        );
    }

}