import * as React from "react";
import {
    Grid,
    Row,
    Col
} from 'react-bootstrap';

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
                    text: 'Acreditación UM'
                },
                tooltips: {
                    enabled: true
                },
                responsive: true
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
                <p>Matriculados por departamento</p>

                <Grid>
                    <Row className="show-grid">
                        <Col xs={12} md={12}>
                            <Row className="show-grid">
                                <Col xs={12} md={4}>
                                    <FilterComponent label="Años" data={this.state.filterData.years} onChange={this.onYearsFilterChange} />
                                </Col>
                                <Col xs={12} md={4}>
                                    <FilterComponent label="Periodos" data={this.state.filterData.periods} onChange={this.onPeriodsFilterChange} />
                                </Col>
                                <Col xs={12} md={4}>
                                    <FilterComponent label="Universidades" data={this.state.filterData.universities} onChange={this.onUniversitiesFilterChange} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>

                <br />

                <canvas id={"chart-pie-" + this.props.indexKey} className="chart"></canvas>
            </div>
        );
    }

}