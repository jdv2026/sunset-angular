export type ApiResponse<TPayload = any> = {
	status: number;
	message: string;
	payload: TPayload;
};