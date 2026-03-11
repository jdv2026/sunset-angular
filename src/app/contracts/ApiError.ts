export type ApiError<TPayload = any> = {
	message: string;
	status?: number;
	global_error?: boolean;
	payload?: TPayload;
	is_show_modal?: boolean;
	is_custom_message?: boolean;
	errors?: Array<string[]>,
};