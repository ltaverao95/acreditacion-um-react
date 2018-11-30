import axios, { AxiosPromise } from 'axios';

import {
    ConfigService
} from './ConfigService';
import {
    UtilsConstants
} from '../utils/constants';

export class MatrixServices{
    
    private _configService = new ConfigService();
    private _serverURL: string;

    constructor() {
        this._serverURL = this._configService.GetAttribute(UtilsConstants.ConfigAttributes.BackendURL);
    }

    getMatrixData(): AxiosPromise{
        return axios.get(this._serverURL + "api/GetMatrixVariationData.php");
    }
}