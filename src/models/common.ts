class KeyValue {
    public value: string;
    public label: string;
}

interface ICommonProps {
    label: string;
    data?: Array<KeyValue>;
    onChange?: (data: Array<KeyValue>) => void;
}

interface IFilterState {
    years: Array<KeyValue>;
    periods: Array<KeyValue>;
    universities: Array<KeyValue>;
}

interface IUMChartProps{
    indexKey?: number;
}

interface IUMChartState{
    filterData?: IFilterState
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