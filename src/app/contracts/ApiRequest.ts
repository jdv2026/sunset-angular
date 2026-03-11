import { ApiMeta } from "./ParamsRequest";

export type ApiRequest<TPayload = any> = {
	params: ApiMeta;    
	payload: TPayload;   
	url: string;
};