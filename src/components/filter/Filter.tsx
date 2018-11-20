import * as React from "react";
import Select from 'react-select';

import { 
    KeyValue, 
    ICommonProps
} from "../../models";

export class FilterComponent extends React.Component<ICommonProps, undefined> {

    constructor(props: ICommonProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(selectedValues: Array<KeyValue>) {

        let isSelectedAll = selectedValues.find(x => x.value == 'select_all');

        if (selectedValues.length == 0 ||
            isSelectedAll != undefined) {
            this.props.onChange(this.props.data.filter(x => x.value != 'select_all'));
            return;
        }

        this.props.onChange(selectedValues);
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