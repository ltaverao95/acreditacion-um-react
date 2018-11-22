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
    private _serverURL: string;
    private _periodsList: Array<KeyValue>;

    constructor() {
        this._periodsList = [
            { value: 'select_all', label: 'Seleccionar Todo' },
            { value: '1', label: '1' },
            { value: '2', label: '2' }
        ];

        this._serverURL = this._configService.GetAttribute(UtilsConstants.ConfigAttributes.BackendURL);
    }

    getFilterYears() {
        return axios.get(this._serverURL + "api/GetAnios.php");
    }

    getFilterPeriods() {
        return this._periodsList;
    }

    getFilterUniversities(): AxiosPromise {
        return axios.get(this._serverURL + "api/GetInstituciones.php");
    }

    getFilterDepartments(): AxiosPromise {
        return axios.get(this._serverURL + "api/GetDepartamentos.php");
    }
}