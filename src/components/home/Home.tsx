import * as React from "react";
import {
    Grid,
    Row,
    Col
} from 'react-bootstrap';

import {
    KeyValue,
    AppState
} from "../../models";
import { FilterComponent } from '../filter/Filter';
import { MatrixComponent } from '../matrix/Matrix';

declare let Chart: any;

export class HomeComponent extends React.Component<any, AppState> {

    constructor(props: any) {

        super(props);

        this.state = {
            years: [
                { value: 'select_all', label: 'Seleccionar Todo' },
                { value: 'a2014', label: '2014' },
                { value: 'a2015', label: '2015' },
                { value: 'a2016', label: '2016' }
            ],
            periods: [
                { value: 'select_all', label: 'Seleccionar Todo' },
                { value: 'p1', label: '1' },
                { value: 'p2', label: '2' }
            ],
            universities: [
                { value: 'select_all', label: 'Seleccionar Todo' },
                { value: 'u_manizales', label: 'U. Manizales' },
                { value: 'u_autonoma', label: 'U. Autónoma' },
                { value: 'u_caldas', label: 'U. Caldas' }
            ]
        }
    }

    chart() {

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

        let ctx = document.getElementsByClassName("myChart");
        for (let i = 0; i < ctx.length; i++) {
            new Chart(ctx[i], {
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
    }

    chart2() {
        let ctx = document.getElementsByClassName("chart-area");
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
                    text: 'Acreditación UM'
                },
                tooltips: {
                    enabled: true
                }
                ,
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        };

        for (let i = 0; i < ctx.length; i++) {
            new Chart(ctx[i], config);
        }
    }

    chart3() {

        let chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)'
        };

        let ctx = document.getElementById("chart-pie");
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

    componentDidMount() {
        this.chart();
        this.chart2();
        this.chart3();
    }

    render() {
        return (
            <div className="main-container">
                <div className="column1">

                    <p>Matriculados 1er curso</p>

                    <Grid>
                        <Row className="show-grid">
                            <Col xs={12} md={12}>
                                <Row className="show-grid">
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Años" data={this.state.years} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Periodos" data={this.state.periods} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Universidades" data={this.state.universities} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Grid>

                    <br />

                    <canvas className="cone-chart chart chart-area"></canvas>
                </div>
                <div className="column2">

                    <p>Matriculados 1er curso</p>

                    <Grid>
                        <Row className="show-grid">
                            <Col xs={12} md={12}>
                                <Row className="show-grid">
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Años" data={this.state.years} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Periodos" data={this.state.periods} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Universidades" data={this.state.universities} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Grid>

                    <br />

                    <canvas className="cone-chart chart chart-area"></canvas>
                </div>
                <div className="column3">

                    <p>Conteo total matriculados</p>

                    <Grid>
                        <Row className="show-grid">
                            <Col xs={12} md={12}>
                                <Row className="show-grid">
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Años" data={this.state.years} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Periodos" data={this.state.periods} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Universidades" data={this.state.universities} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Grid>

                    <br />

                    <canvas className="cone-chart chart myChart"></canvas>
                </div>
                <div className="column4">

                    <p>Conteo total matriculados</p>

                    <Grid>
                        <Row className="show-grid">
                            <Col xs={12} md={12}>
                                <Row className="show-grid">
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Años" data={this.state.years} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Periodos" data={this.state.periods} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Universidades" data={this.state.universities} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Grid>

                    <br />

                    <canvas className="cone-chart chart myChart"></canvas>
                </div>
                <div className="column5">

                    <p>Matriculados por departamento</p>

                    <Grid>
                        <Row className="show-grid">
                            <Col xs={12} md={12}>
                                <Row className="show-grid">
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Años" data={this.state.years} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Periodos" data={this.state.periods} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FilterComponent label="Universidades" data={this.state.universities} onChange={this.onFilterChange.bind(this)} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Grid>

                    <br />

                    <canvas id="chart-pie" className="cone-chart chart"></canvas>

                    <br />

                    <MatrixComponent label="Matriz de variación de matrículas"
                        universities={this.state.universities}
                        years={this.state.years} />

                    <br />

                    <MatrixComponent label="Matriz de totales matrículas"
                        universities={this.state.universities}
                        years={this.state.years} />
                </div>
            </div>
        );
    }

    onFilterChange(data: Array<KeyValue>) {
        console.log(data);
    }
}