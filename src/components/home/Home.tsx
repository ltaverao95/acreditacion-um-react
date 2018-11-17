import * as React from "react";
import {
    Grid,
    Row,
    Col,
    Table
} from 'react-bootstrap';

import {
    KeyValue,
    AppState
} from "../../models";
import { FilterComponent } from '../filter/Filter';
import { MatrixComponent } from '../matrix/Matrix';

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

                    <div className="cone-chart chart">Cone Chart</div>
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

                    <div className="cone-chart chart">Cone Chart</div>
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

                    <div className="stacked-chart chart">Stacked</div>
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

                    <div className="stacked-chart chart">Stacked</div>
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

                    <div className="pie-chart chart">Pie</div>

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