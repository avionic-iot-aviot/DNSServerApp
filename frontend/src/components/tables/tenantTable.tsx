import * as React from 'react';
import { connect } from 'react-redux';
import * as Constants from '../../constants';
import DNSBaseComponent from '../dnsBaseComponent';
import TenantApi from '../../api/tenantApi'
import { history } from '../../main';
import _ from 'lodash';
import './../../../public/css/tenant.css';
import { Table, Button, Icon, Container, Pagination, Popup, Input, Loader, Label, Grid } from 'semantic-ui-react';

import TenantForm from '../forms/tenantForm';
import { ITenant } from '../../../interfaces/tenant';
import { IPaginationOpts } from '../../../interfaces/rest';
import * as NotificationActions from '../../actions/notificationActions';

interface CompProps {
}

interface CompState {
    addTenant: boolean;
    loading: boolean;
    message: string;
    paginationOpts: IPaginationOpts;
    search: string;
    selectedTenant: ITenant;
    tenants: ITenant[];
    updateTenant: boolean;
}

class TenantTable extends DNSBaseComponent<CompProps | any, CompState> {
    state = {
        addTenant: false,
        loading: false,
        message: '',
        paginationOpts: {
            activePage: 1,
            totalPages: 1,
            itemPerPage: Constants.pagination.itemPerPage
        },
        search: '',
        selectedTenant: {},
        tenants: [],
        updateTenant: false,
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
        this.getTenants();
    }

    back() {
        this.getTenants();
        this.setState({ updateTenant: false, selectedTenant: {}, addTenant: false });
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
            this.getTenants();
        });
    }

    async handleRemoveTenant(tenant: ITenant) {
        this.setState({ loading: true });
        _.defer(async () => {
            const removeTenantPromise = TenantApi.delete(tenant.id);
            this.registerPromise(removeTenantPromise);
            const tenantResponse: any = await removeTenantPromise;
            if (tenantResponse && tenantResponse.data && tenantResponse.data.status == "success") {
                this.getTenants();
            } else {
                _.defer(() => {
                    this.setState({
                        message: "Error...."
                    });
                });
            }
        });
    }

    async getTenants(search: boolean = false) {
        this.setState({ loading: true });
        _.defer(async () => {
            const searchValue = search ? this.state.search : undefined;
            const options = search ? {
                activePage: 1,
                totalPages: 1,
                itemPerPage: Constants.pagination.itemPerPage
            } : this.state.paginationOpts;
            const getTenantsPromise = TenantApi.getAll(options, searchValue);
            this.registerPromise(getTenantsPromise);
            const tenantsResponse: any = await getTenantsPromise;
            const newSearch = search ? this.state.search : "";
            if (tenantsResponse && tenantsResponse.data && tenantsResponse.data.payload) {            
                _.defer(() => {
                    this.setState({
                        tenants: tenantsResponse.data.payload,
                        paginationOpts: tenantsResponse.data.payload.options,
                        search: newSearch,
                        loading: false
                    });
                });
            } else {
                _.defer(() => {
                    this.setState({
                        tenants: [],
                        paginationOpts: {
                            activePage: 1,
                            totalPages: 1,
                            itemPerPage: Constants.pagination.itemPerPage
                        },
                        search: newSearch,
                        loading: false
                    });
                });
            }
        });
    }

     renderTenants() {
        console.log("this.state.tenants", this.state.tenants);

        return _.map(this.state.tenants, (tenant: ITenant, idx) => {
            console.log("tenant", tenant);
            return (
                <Table.Row key={idx}  >
                    <Table.Cell
                        className="truncate cellTable"
                    >{tenant.edge_interface_name}
                    </Table.Cell>
                    <Table.Cell
                        className="truncate cellTable"
                    >{tenant.description}
                    </Table.Cell>
                </Table.Row>
            )
        })
    }

    onKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            this.getTenants(true);
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

                        {this.state.addTenant || this.state.updateTenant ?
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
                                            this.getTenants();
                                        }}>
                                            <Icon name='cancel' color='blue' />
                                        </Button>
                                    }
                                    onChange={(event: any) => {
                                        this.handleChange(event);
                                    }}
                                    onKeyPress={this.onKeyPress}
                                />
                                <h2>Tenants</h2>
                                <Table compact>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Edge Interface Name</Table.HeaderCell>
                                            <Table.HeaderCell>Description</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {this.renderTenants()}
                                    </Table.Body>
                                    <Table.Footer fullWidth>
                                        <Table.Row>
                                            <Table.HeaderCell colSpan='1'>
                                                {/* <Pagination
                                                    activePage={this.state.paginationOpts.activePage}
                                                    boundaryRange={1}
                                                    size='mini'
                                                    onPageChange={(event: any, { activePage }) => {
                                                        this.handlePaginationChange(event, { activePage });
                                                    }}
                                                    totalPages={this.state.paginationOpts.totalPages}
                                                /> */}
                                            </Table.HeaderCell>

                                            <Table.HeaderCell colSpan='1' className="buttonCell">
                                                <Icon
                                                    className='addIcon'
                                                    name='plus'
                                                    circular
                                                    color='blue'
                                                    floated='rigth'
                                                    onClick={() => {
                                                        history.push(`/tenant/new`)

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
