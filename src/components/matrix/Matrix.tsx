import * as React from "react";
import {
    Table
} from 'react-bootstrap';

import {
    KeyValue,
    IMatrixProps,
    IMatrixState
} from "../../models";
import { MatrixServices } from "../../services/MatrixServices";

let matrixService: MatrixServices = new MatrixServices();

export class MatrixComponent extends React.Component<IMatrixProps, IMatrixState> {

    constructor(props: IMatrixProps) {
        super(props);

        this.state = {
            universities: matrixService.getMatrixUniversities(),
            years: matrixService.getMatrixYears(),
            data: matrixService.getMatrixData()
        };
    }

    render() {
        return (
            <div>
                <p>{this.props.label}</p>

                <Table striped bordered condensed hover responsive>
                    <thead>
                        <tr>
                            <th>Universidad</th>
                            {
                                this.state.years.map((x: KeyValue, index: number) => {
                                    if (x.value != 'select_all') {
                                        return <th key={index}>{x.label}</th>
                                    }
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.universities.map((university: KeyValue, index: number) => {
                                if (university.value != 'select_all') {
                                    return (
                                        <tr key={index}>
                                            <td key={index}>{university.label}</td>
                                            {this.state.data.map((x: KeyValue, index: number) => <td key={index}>{x.label}</td>)}
                                        </tr>
                                    );
                                }
                            })
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}