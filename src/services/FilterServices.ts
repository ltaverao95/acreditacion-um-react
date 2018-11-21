import axios, { AxiosPromise } from 'axios';

import { KeyValue } from "../models";

export class FilterServices {

    private _yearsList: Array<KeyValue>;
    private _periodsList: Array<KeyValue>;
    private _universitiesList: Array<KeyValue>;

    constructor() {
        this._yearsList = [
            { value: 'select_all', label: 'Seleccionar Todo' },
            { value: 'a2014', label: '2014' },
            { value: 'a2015', label: '2015' },
            { value: 'a2016', label: '2016' }
        ];

        this._periodsList = [
            { value: 'select_all', label: 'Seleccionar Todo' },
            { value: 'p1', label: '1' },
            { value: 'p2', label: '2' }
        ];

        this._universitiesList = [
            { value: 'select_all', label: 'Seleccionar Todo' },
            { value: 'u_manizales', label: 'U. Manizales' },
            { value: 'u_autonoma', label: 'U. Autónoma' },
            { value: 'u_caldas', label: 'U. Caldas' }
        ];
    }

    getFilterYears() {
        return this._yearsList;
    }

    getFilterPeriods() {
        return this._periodsList;
    }

    getFilterUniversities(): AxiosPromise {
        return axios.get("http://localhost:81/acreditacion-um-react/src/server/api/GetInstituciones.php");
    }
}