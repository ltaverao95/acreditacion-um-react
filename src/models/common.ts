class KeyValue {
    public value: any;
    public label: any;
}

interface ICommonProps {
    label: string;
    data?: Array<KeyValue>;
    selectedData?: Array<KeyValue>;
    indexKey?: number;
    onChange?: (data: Array<KeyValue>) => void;
    onApplyFilter?: () => void;
}

interface IFilterState {
    years?: Array<KeyValue>;
    periods?: Array<KeyValue>;
    universities?: Array<KeyValue>;
    departments?: Array<KeyValue>;
}

interface IUMChartProps{
    indexKey?: number;
}

interface IUMChartState{
    filterData?: IFilterState
    selectedData?: IFilterState
}

interface IMatrixProps {
    label: string;
}

interface IMatrixState {
    years: Array<KeyValue>;
    universities: Array<KeyValue>;
    data: Array<KeyValue>;
}

export {
    KeyValue,
    ICommonProps,
    IFilterState,
    IUMChartProps,
    IUMChartState,
    IMatrixProps,
    IMatrixState
}