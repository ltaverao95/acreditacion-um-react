import { KeyValue } from "../models";

export class MatrixServices{
    
    private _yearsList: Array<KeyValue>;
    private _universitiesList: Array<KeyValue>;
    private _dataList: Array<KeyValue>;

    constructor(){
        this._yearsList = [
            { value: 'select_all', label: 'Seleccionar Todo' },
            { value: 'a2014', label: '2014' },
            { value: 'a2015', label: '2015' },
            { value: 'a2016', label: '2016' }
        ];

        this._universitiesList = [
            { value: 'select_all', label: 'Seleccionar Todo' },
            { value: 'u_manizales', label: 'U. Manizales' },
            { value: 'u_autonoma', label: 'U. Autónoma' },
            { value: 'u_caldas', label: 'U. Caldas' }
        ];

        this._dataList = [
            { value: 'p1', label: '8%' },
            { value: 'p2', label: '9%' },
            { value: 'p3', label: '7%' }
        ];
    }

    getMatrixYears(){
        return this._yearsList;
    }

    getMatrixUniversities(){
        return this._universitiesList;
    }

    getMatrixData(){
        return this._dataList;
    }
}