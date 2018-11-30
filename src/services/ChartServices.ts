import axios, { AxiosPromise } from 'axios';

import {
    ConfigService
} from './ConfigService';
import {
    UtilsConstants
} from '../utils/constants';

export class ChartServices{
    private _configService = new ConfigService();
    private _serverURL: string;

    constructor() {
        this._serverURL = this._configService.GetAttribute(UtilsConstants.ConfigAttributes.BackendURL);
    }

    public GetPyramidChartDataByYearPeriodUniversityCode(data: any): AxiosPromise{
        return axios.post(this._serverURL + "api/GetPyramidChartDataByYearPeriodUniversityCode.php", data);
    }

    public GetStackedChartDataByYearPeriodUniversityCode(data: any): AxiosPromise{
        return axios.post(this._serverURL + "api/GetStackedChartDataByYearPeriodUniversityCode.php", data);
    }

    public GetPieChartDataByYearDepartmentPeriodCode(data: any): AxiosPromise{
        return axios.post(this._serverURL + "api/GetPieChartDataByYearDepartmentPeriodCode.php", data);
    }
}