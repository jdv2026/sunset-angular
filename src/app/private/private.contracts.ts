import { VexColorScheme } from "@vex/config/vex-config.interface";

export interface MetaDataResponse {
    dbVersions: { 
		version: string; 
		created_at: string; 
		updated_at: string; 
	};
	appVersion: string;
}

export type settingModify = {
	name: string;
	className: string;
	orientation: string;
	toolBar: boolean;
	footer: boolean;
	footerFixed: boolean,
	isDarkMode: VexColorScheme | boolean,
	updatedAt: string,
	updatedBy: {first_name: string, last_name: string}
}

export type navigation = {
	id: number;
	logo: string;
	name: string;
	link: string;
	header: string;
}

export type navResponse = {
	header: string;
	items: navigation[]
}

export type crumbs = {
	current: string;
	crumbs: Array<string>;
}

export type notification = {
	id: string;
	label: string;
	icon: string;
	color_class: string;
	datetime: string;
	read?: boolean;
	user_id: number;
}

export type backendPagination = {
	limit: number,
	pageIndex: number,
	sortMetaColumn: string,
	sortMetaDirection: string,
	search?: string,
}