import * as React from "react";
import { AxiosResponse } from "axios";
import {
    Table
} from 'react-bootstrap';
import Loader from 'react-loader-advanced';

import {
    IMatrixState
} from "../../models";
import { MatrixServices } from "../../services/MatrixServices";

interface OwnState {
    showLoadingDialog?: boolean;
}

export class UMMatrizVariacionMatriculas extends React.Component<any, IMatrixState & OwnState> {

    private matrixService: MatrixServices = new MatrixServices();

    constructor(props: any) {
        super(props);

        this.state = {
            matrixData: [],
            showLoadingDialog: true
        };
    }

    componentDidMount() {

        this.matrixService.getMatrixData().then(
            (res: AxiosResponse) => {
                if (!res.data ||
                    !res.data.ResultData) {
                    return;
                }

                this.setState({
                    matrixData: res.data.ResultData,
                    showLoadingDialog: false
                });
            }
        );
    }

    getUniversitiesList(): Array<any> {

        let universitiesList = this.state.matrixData.map(x => {
            return {
                Nombre: x.Nombre,
                Codigo: x.Codigo
            }
        });
        let universitiesListFiltered = new Array<any>();

        for (let i = 0; i < universitiesList.length; i++) {
            let currentUniversity: any = universitiesListFiltered.find(x => x.Codigo == universitiesList[i].Codigo);
            if (currentUniversity) {
                continue;
            }

            universitiesListFiltered.push({
                Codigo: universitiesList[i].Codigo,
                Nombre: universitiesList[i].Nombre
            });
        }

        return universitiesListFiltered;
    }

    getYearsList(): Array<any> {

        let yearsList = this.state.matrixData.map(x => x.Anio);
        let yearsListFiltered = new Array<any>();

        for (let i = 0; i < yearsList.length; i++) {
            let currentYear: any = yearsListFiltered.find(x => x == yearsList[i]);
            if (currentYear) {
                continue;
            }

            yearsListFiltered.push(yearsList[i]);
        }

        yearsListFiltered = yearsListFiltered.sort();

        return yearsListFiltered;
    }

    getDataList(universityCode: any, year: number): Array<any> {
        return this.state.matrixData.filter(x => x.Codigo == universityCode && x.Anio == year);
    }

    render() {
        return (
            <Loader show={this.state.showLoadingDialog} message={'Cargando...'}>
                {
                    this.state.matrixData.length == 0 ?
                        <span>&nbsp;</span> :
                        <div>
                            <p>Matriz de variación de matrículas</p>
                            <Table className="matrix-style" striped bordered condensed hover responsive>
                                <thead>
                                    <tr>
                                        <th>Universidad</th>
                                        {
                                            this.getYearsList().map((x: any, index: number) => {
                                                return <th key={index}>{x}</th>
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.getUniversitiesList().map((university: any, index: number) => {
                                            return (
                                                <tr key={index}>
                                                    <td key={index}>{university.Nombre}</td>
                                                    {
                                                        this.getYearsList().map((year: number) => {
                                                            return (
                                                                this.getDataList(university.Codigo, year).map((currentData: any, index: number) => {
                                                                    return (
                                                                        <td key={index}>{!currentData.Pct ? '' : parseFloat(currentData.Pct).toFixed(2) + "%"}</td>
                                                                    );
                                                                })
                                                            );
                                                        })
                                                    }
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                }
            </Loader>
        );
    }
}