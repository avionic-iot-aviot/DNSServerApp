export interface IDataResponse {
    status: 'success' | 'error';
    payload: {};
    error: any;
    message: string;
}

export interface ILease {
    host: string;
    ip: string;
    mac: string;
    timestamp: string;
}

export interface IDevice {
    id?: number;
    dns_name_auto?: string;
    dns_name_manual?: string;
    mac_address?: string;
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
    description?: string;
    edge_interface_name?: string;
    updated_at?: string;
}
