class KeyValue {
    public value: string;
    public label: string;
}

interface CommonProps {
    label: string;
    data?: Array<KeyValue>;
    onChange?: (data: Array<KeyValue>) => void;
}

interface AppState {
    years: Array<KeyValue>;
    periods: Array<KeyValue>;
    universities: Array<KeyValue>;
}

export {
    KeyValue,
    CommonProps,
    AppState
}