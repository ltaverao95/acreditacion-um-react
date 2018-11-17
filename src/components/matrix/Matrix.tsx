import * as React from "react";
import {
    Table
} from 'react-bootstrap';

import {
    KeyValue,
    CommonProps
} from "../../models";

interface MatrixProps {
    label: string;
    years: Array<KeyValue>;
    universities: Array<KeyValue>;
}

export class MatrixComponent extends React.Component<MatrixProps, undefined> {

    constructor(props: MatrixProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {


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
                                this.props.years.map((x: KeyValue, index: number) => {
                                    if (x.value != 'select_all') {
                                        return <th key={index}>{x.label}</th>
                                    }
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.universities.map((university: KeyValue, index: number) => {
                                if (university.value != 'select_all') {
                                    return (
                                        <tr key={index}>
                                            <td key={index}>{university.label}</td>
                                            {
                                                this.props.years.map((x, index) => {
                                                    if (x.value != 'select_all') {
                                                        return <td key={index}>{x.label}</td>
                                                    }
                                                })
                                            }
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