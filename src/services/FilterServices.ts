import axios, { AxiosPromise } from 'axios';

import { KeyValue } from "../models";
import {
    ConfigService
} from './ConfigService';
import {
    UtilsConstants
} from '../utils/constants';

export class FilterServices {

    private _configService = new ConfigService();

    private _yearsList: Array<KeyValue>;
    private _periodsList: Array<KeyValue>;
    private _serverURL: string;

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

        this._serverURL = this._configService.GetAttribute(UtilsConstants.ConfigAttributes.BackendURL);
    }

    getFilterYears() {
        return this._yearsList;
    }

    getFilterPeriods() {
        return this._periodsList;
    }

    getFilterUniversities(): AxiosPromise {
        return axios.get(this._serverURL + "api/GetInstituciones.php");
    }
}