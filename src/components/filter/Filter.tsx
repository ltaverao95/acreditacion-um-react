import * as React from "react";
import Select from 'react-select';
import {
    ButtonToolbar,
    ButtonGroup,
    Glyphicon
} from "react-bootstrap";

import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

import {
    KeyValue,
    ICommonProps
} from "../../models";

interface State {
    popoverOpen: boolean;
}

export class FilterComponent extends React.Component<ICommonProps, State> {

    constructor(props: ICommonProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onFilterClick = this.onFilterClick.bind(this);

        this.state = {
            popoverOpen: false
        };
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

    onFilterClick() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    render() {
        return (
            <div>
                <Button id={"Popover-" + this.props.indexKey} onClick={this.onFilterClick}>
                    {this.props.label}
                    <Glyphicon glyph="filter" />
                </Button>

                <Popover placement="bottom" 
                         isOpen={this.state.popoverOpen} 
                         target={"Popover-" + this.props.indexKey} 
                         toggle={this.onFilterClick}
                         className="popoverStyle">
                    <PopoverHeader>{this.props.label}</PopoverHeader>
                    <PopoverBody>
                        <Select
                            onChange={this.handleChange}
                            options={this.props.data}
                            isMulti={true}
                            closeMenuOnSelect={false}
                        />
                    </PopoverBody>
                </Popover>
            </div>
        );
    }
}