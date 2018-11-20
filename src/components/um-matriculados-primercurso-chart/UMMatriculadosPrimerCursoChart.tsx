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

export class UMMatriculadosPrimerCursoChart extends React.Component<IUMChartProps, IUMChartState> {

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
                    text: 'Acreditación UM'
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
                <p>Matriculados 1er curso</p>

                <Grid>
                    <Row className="show-grid">
                        <Col xs={12} md={12}>
                            <Row className="show-grid">
                                <Col xs={12} md={4}>
                                    <FilterComponent label="Años" indexKey={this.props.indexKey == 2 ? 4 : 1} data={this.state.filterData.years} onChange={this.onYearsFilterChange} />
                                </Col>
                                <Col xs={12} md={4}>
                                    <FilterComponent label="Periodos" indexKey={this.props.indexKey == 2 ? 5 : 2} data={this.state.filterData.periods} onChange={this.onPeriodsFilterChange} />
                                </Col>
                                <Col xs={12} md={4}>
                                    <FilterComponent label="Universidades" indexKey={this.props.indexKey == 2 ? 6 : 3} data={this.state.filterData.universities} onChange={this.onUniversitiesFilterChange} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>

                <br />

                <canvas id={"cone-chart-" + this.props.indexKey} className="chart"></canvas>
            </div>
        );
    }

}