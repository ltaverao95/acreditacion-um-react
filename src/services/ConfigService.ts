export class ConfigService{

    private _config = require('../config/config.json');

    public GetAttribute(attributeName: string){
        return this._config[attributeName];
    }

    public GetAllAttributes(){
        return this._config;
    }
}