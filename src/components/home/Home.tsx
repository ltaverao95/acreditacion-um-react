import * as React from "react";

import { KeyValue } from "../../models";
import { FilterComponent } from '../filter/Filter';

interface HomeState {
    label: string
    options: Array<KeyValue>;
}

export class HomeComponent extends React.Component<any, HomeState> {

    constructor(props: any) {

        super(props);

        this.state = {
            label: 'Años',
            options: [
                { value: 'select_all', label: 'Seleccionar Todo' },
                { value: 'a2014', label: '2014' },
                { value: 'a2015', label: '2015' },
                { value: 'a2016', label: '2016' }
            ]
        }
    }

    render() {
        return (
            <FilterComponent label={this.state.label} data={this.state.options} onFilterChange={this.onFilterChange.bind(this)} />
        );
    }

    onFilterChange(data: Array<KeyValue>) {
        console.log(data);
    }
}