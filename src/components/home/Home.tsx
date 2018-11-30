import * as React from "react";

import { UMMatriculadosPrimerCursoChart } from '../um-matriculados-primercurso-chart/UMMatriculadosPrimerCursoChart';
import { UMConteoTotalMatriculadosChart } from '../um-conteo-total-matriculados-chart/UMConteoTotalMatriculadosChart';
import { UMMatriculadosDepartamentoChart } from '../um-matriculados-departamento/UMMatriculadosDepartamentoChart';
import { UMMatrizVariacionMatriculas } from '../um-matriz-variacion-matriculas/UMMatrizVariacionMatriculas';
import { UMMatrizTotalesMatriculas } from '../um-matriz-totales-matriculas/UMMatrizTotalesMatriculas';

export class HomeComponent extends React.Component<any, undefined> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="site">
                <header>
                    <div className="top">
                        <ul>
                            <li>
                                <a href="">Aspirantes</a>
                            </li>
                            <li>
                                <a href="">Estudiantes</a>
                            </li>
                            <li>
                                <a href="">Graduados</a>
                            </li>
                            <li>
                                <a href="">Profesores</a>
                            </li>
                            <li>
                                <a href="">Administrativos</a>
                            </li>
                            <li>
                                <a href="">PQR</a>
                            </li>
                            <li>
                                <a href="">Pagos en línea</a>
                            </li>
                        </ul>
                    </div>
                    <div className="main-nav">
                        <nav className="navbar navbar-inverse" role="navigation">
                            <div className="container">
                                <div className="navbar-header">
                                    <a className="logo" href="http://umanizales.edu.co" title="Programas de Pregrado - Universidad de Manizales">
                                        <img src="./dist/images/logo-con-acreditación.png" alt="Programas de Pregrado - Universidad de Manizales" />
                                    </a>
                                </div>
                            </div>
                        </nav>
                    </div>
                </header>
                <div className="main-container">
                    <div className="column1">
                        <UMMatriculadosPrimerCursoChart indexKey={1} />
                    </div>
                    <div className="column2">

                    </div>
                    <div className="column3">
                        <UMMatriculadosPrimerCursoChart indexKey={2} />
                    </div>
                    <div className="column4">
                        <UMConteoTotalMatriculadosChart indexKey={1} />
                    </div>
                    <div className="column5">

                    </div>
                    <div className="column6">
                        <UMConteoTotalMatriculadosChart indexKey={2} />
                    </div>
                    <div className="column7">

                        <UMMatriculadosDepartamentoChart indexKey={1} />

                        <br />

                        <UMMatrizTotalesMatriculas />

                        {/*<br />

                        <UMMatrizVariacionMatriculas />*/}

                    </div>
                    <div className="column8"></div>
                    <div className="column9"></div>
                </div>
                <footer>

                </footer>
            </div>
        );
    }
}