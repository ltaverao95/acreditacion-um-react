import * as React from "react";
import Select from 'react-select';

import { KeyValue } from "../../models";

export interface FilterProps {
    label: string;
    data: Array<KeyValue>;
    onFilterChange: (data: Array<KeyValue>) => void;
}

export class FilterComponent extends React.Component<FilterProps, undefined> {

    constructor(props: FilterProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(selectedValues: Array<KeyValue>) {

        let isSelectedAll = selectedValues.find(x => x.value == 'select_all');

        if (selectedValues.length == 0 ||
            isSelectedAll != undefined) {
            this.props.onFilterChange(this.props.data.filter(x => x.value != 'select_all'));
            return;
        }

        this.props.onFilterChange(selectedValues);
    }

    render() {
        return (
            <div>
                <label>{this.props.label}</label>
                <Select
                    onChange={this.handleChange}
                    options={this.props.data}
                    isMulti={true}
                    closeMenuOnSelect={false}
                />
            </div>
        );
    }
}