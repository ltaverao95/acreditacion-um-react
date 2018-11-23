import * as React from "react";
import Select from 'react-select';
import {
    Glyphicon
} from "react-bootstrap";
import {
    Button,
    Popover,
    PopoverHeader,
    PopoverBody
} from 'reactstrap';

import {
    KeyValue,
    ICommonProps
} from "../../models";

interface Ownstate {
    popoverOpen: boolean;
}

export class FilterComponent extends React.Component<ICommonProps, Ownstate> {

    constructor(props: ICommonProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onFilterClick = this.onFilterClick.bind(this);
        this.onFilterApply = this.onFilterApply.bind(this);

        this.state = {
            popoverOpen: false
        };
    }

    handleChange(selectedValues: Array<KeyValue>) {
        this.props.onChange(selectedValues);
    }

    onFilterClick() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    onFilterApply() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });

        this.props.onApplyFilter();
    }

    render() {
        return (
            <div>
                <button id={"Popover-" + this.props.indexKey} className="btn btn-default" onClick={this.onFilterClick}>
                    <Glyphicon glyph="filter" /> &nbsp;
                    {this.props.label}
                </button>

                <Popover placement="bottom"
                    isOpen={this.state.popoverOpen}
                    target={"Popover-" + this.props.indexKey}
                    toggle={this.onFilterClick}
                    className="popoverStyle">
                    <PopoverHeader className="popover-header">
                        <button className="btn btn-default" onClick={this.onFilterApply}>
                            <Glyphicon glyph="ok" /> &nbsp;
                            Aplicar Filtro
                        </button>
                    </PopoverHeader>
                    <PopoverBody>
                        <Select
                            defaultValue={this.props.selectedData}
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