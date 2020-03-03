export interface IDataResponse {
    status: 'success' | 'error';
    payload: {};
    error: any;
    message: string;
}

export interface IDeviceRegistration {
    id?: number;
    mac_address?: string;
    name?: string;
    tenant_id: number;
    updated_at?: string;
}

export interface IResultRequest {
    body?: any;
    error?: any;
    success: boolean;
}

export interface ITenant {
    id?: number;
    name?: string;
    updated_at?: string;
}
