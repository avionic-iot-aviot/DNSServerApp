import * as React from 'react';
import { connect } from 'react-redux';
import * as Constants from '../../constants';
import DNSBaseComponent from '../dnsBaseComponent';
import DeviceApi from '../../api/deviceApi'
import { history } from '../../main';
import _ from 'lodash';
// import './../../../public/css/device.css';
import { Table, Button, Icon, Container, Pagination, Popup, Input, Loader, Label, Grid } from 'semantic-ui-react';

import TenantForm from '../forms/tenantForm';
import { IDevice } from '../../../interfaces/device';
import { IPaginationOpts } from '../../../interfaces/rest';
import * as NotificationActions from '../../actions/notificationActions';

interface CompProps {
}

interface CompState {
    addDevice: boolean;
    loading: boolean;
    message: string;
    paginationOpts: IPaginationOpts;
    search: string;
    selectedDevice: IDevice;
    devices: IDevice[];
    updateDevice: boolean;
}

class TenantTable extends DNSBaseComponent<CompProps | any, CompState> {
    state = {
        addDevice: false,
        loading: false,
        message: '',
        paginationOpts: {
            activePage: 1,
            totalPages: 1,
            itemsPerPage: Constants.pagination.itemsPerPage
        },
        search: '',
        selectedDevice: {},
        devices: [],
        updateDevice: false,
    };

    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
    }
    componentDidMount() {
        this.init();
    }

    componentWillReceiveProps(nextProps: any) {

    }

    componentWillUnmount() {
        this.cancelPromises();
    }

    init() {
        this.getDevices();
    }

    back() {
        this.getDevices();
        this.setState({ updateDevice: false, selectedDevice: {}, addDevice: false });
    }

    handleChange(event: any) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handlePaginationChange(e: any, { activePage }) {
        let paginationOpts = this.state.paginationOpts;
        paginationOpts.activePage = activePage;
        this.setState({ paginationOpts });
        _.defer(() => {
            this.getDevices();
        });
    }

    async handleRemoveTenant(device: IDevice) {
        this.setState({ loading: true });
        _.defer(async () => {
            const removeTenantPromise = DeviceApi.delete(device.id);
            this.registerPromise(removeTenantPromise);
            const tenantResponse: any = await removeTenantPromise;
            if (tenantResponse && tenantResponse.data && tenantResponse.data.status == "success") {
                this.getDevices();
            } else {
                _.defer(() => {
                    this.setState({
                        message: "Error...."
                    });
                });
            }
        });
    }

    async getDevices(search: boolean = false) {
        this.setState({ loading: true });
        _.defer(async () => {
            const searchValue = search ? this.state.search : undefined;
            const options = search ? {
                activePage: 1,
                totalPages: 1,
                itemsPerPage: Constants.pagination.itemsPerPage
            } : this.state.paginationOpts;
            const getDevicesPromise = DeviceApi.getAll(options, searchValue);
            this.registerPromise(getDevicesPromise);
            const devicesResponse: any = await getDevicesPromise;
            const newSearch = search ? this.state.search : "";
            if (devicesResponse && devicesResponse.data && devicesResponse.data.payload.devices && devicesResponse.data.payload.options) {
                _.defer(() => {
                    this.setState({
                        devices: devicesResponse.data.payload.devices,
                        paginationOpts: devicesResponse.data.payload.options,
                        search: newSearch,
                        loading: false
                    });
                });
            } else {
                _.defer(() => {
                    this.setState({
                        devices: [],
                        paginationOpts: {
                            activePage: 1,
                            totalPages: 1,
                            itemsPerPage: Constants.pagination.itemsPerPage
                        },
                        search: newSearch,
                        loading: false
                    });
                });
            }
        });
    }

    renderTenants() {
        console.log("this.state.devices", this.state.devices);

        return _.map(this.state.devices, (device: IDevice, idx) => {
            console.log("device", device);
            return (
                <Table.Row key={idx}  >
                    <Table.Cell
                        className="truncate cellTable"
                    >{device.mac_address}
                    </Table.Cell>
                    <Table.Cell
                        className="truncate cellTable"
                    >{device.dns_name_manual}
                    </Table.Cell>
                    <Table.Cell
                        className="truncate cellTable"
                    >{device.dns_name_auto}
                    </Table.Cell><Table.Cell
                        className="truncate cellTable"
                    >{device.tenant_id}
                    </Table.Cell>
                    <Table.Cell
                        className="truncate cellTable"
                    >


                        <Icon
                            className='customIcon'
                            name='tag'
                            color='blue'
                            onClick={() => {
                                history.push({
                                    pathname: `/device/edit/${device.id}`,
                                    state: { device }
                                })

                            }}
                        ></Icon>

                    </Table.Cell>
                </Table.Row>
            )
        })
    }

    onKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            this.getDevices(true);
        }
    }

    render() {
        return (
            <>
                {/* {this.state.message && this.state.message != '' ?
                    <Label>{this.state.message}</Label>
                    :
                    null
                } */}

                {this.state.loading ? (
                    <Loader
                        inline="centered"
                        active={this.state.loading}
                        disabled={!this.state.loading}
                    >
                        Loading
                    </Loader>
                ) :
                    <>

                        {this.state.addDevice || this.state.updateDevice ?
                            null
                            :
                            <>
                                <Input
                                    name="search"
                                    icon="search"
                                    iconPosition="left"
                                    placeholder="Search"
                                    value={this.state.search}
                                    className="searchInput"
                                    action={
                                        <Button icon basic onClick={() => {
                                            this.getDevices();
                                        }}>
                                            <Icon name='cancel' color='blue' />
                                        </Button>
                                    }
                                    onChange={(event: any) => {
                                        this.handleChange(event);
                                    }}
                                    onKeyPress={this.onKeyPress}
                                />
                                <h2>Devices</h2>
                                <Table compact>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Mac Address</Table.HeaderCell>
                                            <Table.HeaderCell>DNS Name Manual</Table.HeaderCell>
                                            <Table.HeaderCell>DNS Name Auto</Table.HeaderCell>
                                            <Table.HeaderCell>Tenant ID</Table.HeaderCell>
                                            <Table.HeaderCell>Actions</Table.HeaderCell>

                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {this.renderTenants()}
                                    </Table.Body>
                                    <Table.Footer fullWidth>
                                        <Table.Row>
                                            <Table.HeaderCell colSpan='12'>
                                                <Pagination
                                                    activePage={this.state.paginationOpts.activePage}
                                                    boundaryRange={1}
                                                    size='mini'
                                                    onPageChange={(event: any, { activePage }) => {
                                                        this.handlePaginationChange(event, { activePage });
                                                    }}
                                                    totalPages={this.state.paginationOpts.totalPages}
                                                />
                                            </Table.HeaderCell>

                                            <Table.HeaderCell colSpan='1' className="buttonCell">
                                                <Icon
                                                    className='addIcon'
                                                    name='plus'
                                                    circular
                                                    color='blue'
                                                    floated='rigth'
                                                    onClick={() => {
                                                        history.push(`/device/new`)

                                                    }}></Icon>
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Footer>
                                </Table>
                            </>
                        }
                    </>
                }
            </>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatchNotification: (body: string, status: string, id: string) => {
            dispatch(NotificationActions.globalStatusChanged({ body, status, id }));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TenantTable);
