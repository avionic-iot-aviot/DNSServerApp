import _ from 'lodash';

import LoginPage from './components/pages/loginPage';
import DNSForm from './components/forms/DNSForm';
import DevicePage from './components/pages/devicePage';
import HomePage from './components/pages/homePage';
import TenantForm from './components/forms/tenantForm';

interface ApplicationRouteGroup {
    name: string;
    routes: ApplicationRoute[];
}

interface ApplicationRoute {
    path: string;
    name: string;
    restricted: boolean;
    exact?: boolean;
    component: any;
    menuLabel?: string;
    showTopbar?: boolean;
}

export const appRoutes: ApplicationRouteGroup[] = [
    {
        name: 'public',
        routes: [
            {
                path: '/',
                name: 'login',
                restricted: false,
                exact: true,
                component: LoginPage,
                menuLabel: 'Login',
                showTopbar: false
            },
            {
                path: '/devices',
                name: 'device',
                restricted: false,
                exact: true,
                component: DevicePage,
                menuLabel: 'device',
                showTopbar: true
            },
            {
                path: '/home',
                name: 'home',
                restricted: false,
                exact: true,
                component: HomePage,
                menuLabel: 'home',
                showTopbar: true
            },
            {
                path: '/tenant/new',
                name: 'tenant',
                restricted: false,
                exact: true,
                component: TenantForm,
                menuLabel: 'Tenant',
                showTopbar: true
            },
        ]
    },
    {
        name: 'private',
        routes: [
           
        ]
    }
];

export function getRoutesGroupByName(
    name: string,
    excludeRestricted: boolean = true
) {
    let result: any = _.find(appRoutes, { name }).routes;
    if (excludeRestricted) {
        result = _.filter(result, { restricted: !excludeRestricted });
    }

    return result;
}
