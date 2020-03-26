export interface IDevice {
    id?: number;
    dns_name_auto?: string;
    dns_name_manual?: string;
    is_gw?: boolean;
    gw_id?: number;
    mac_address?: string;
    tenant_id: number;
}
