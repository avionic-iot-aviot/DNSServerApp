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
    is_gw?: boolean;
    gw_id?: number;
    mac_address?: string;
    tenant_id?: number;
    updated_at?: string;
}

export interface IResultRequest {
    body?: any;
    error?: any;
    success: boolean;
}

export interface IRole {
    id?: number;
    name?: string;
}

export interface ISearchOpt {
    count?: number;
    needle?: string;
    itemsPerPage?: number;
    activePage?: number;
    totalPages?: number;
  }

export interface ITenant {
    id?: number;
    description?: string;
    edge_interface_name?: string;
    updated_at?: string;
}

export interface IUser {
    id?: number;
    email?: string;
    password?: string;
    role_id?: number;
    username?: string;
    created_at?: string;
    updated_at?: string;
}
