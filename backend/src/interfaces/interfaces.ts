export interface IResultRequest {
    body?: any;
    error?: any;
    success: boolean;
}

export interface ILeases {
    timestamp: string;
    mac: string;
    ip: string;
    host: string;
    id: string;
}

export interface IHostDevice {
    mac: string;
    ip: string;
    host: string;
}