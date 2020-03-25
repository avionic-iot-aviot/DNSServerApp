import * as React from 'react';
import * as _ from 'lodash';
import Helpers from '../utils/helpers';
import BBPromise from 'bluebird';

export default class DNSBaseComponent<
    CompProps,
    CompState
    > extends React.Component<CompProps, CompState> {
    promises: BBPromise<any>[];

    constructor(props: any) {
        super(props);
        this.promises = [];
    }

    componentWillUnmount() {
        this.cancelPromises();
    }

    /**
     * This method registers a promise
     */
    registerPromise(p: BBPromise<any>) {
        Helpers.log(this.constructor.name + ' is registering a new  promise');
        p.finally(() => {
            this.purgePromises();
        });
        this.promises.push(p);
    }

    /**
     * Console.log of promises array
     */
    showPromises() {
    }

    /**
     * This method removes all non-pending promises (i.e. resolved, rejected or fulfilled)
     * from promises array
     */
    purgePromises() {
        Helpers.log(
            this.constructor.name +
            ' is purging promises (' +
            this.promises.length +
            ')'
        );
        this.showPromises();

        _.each(this.promises, (p: BBPromise<any>) => {
            if (p && !p.isPending()) {
                _.remove(this.promises, prom => {
                    return p === prom;
                });
            }
        });

        this.showPromises();
    }

    /**
     * This method cancel all promises
     */
    cancelPromises() {
        Helpers.log(
            this.constructor.name +
            ' is cancelling promises (' +
            this.promises.length +
            ')'
        );
        this.showPromises();

        _.each(this.promises, (p: BBPromise<any>) => {
            p.cancel();
        });

        this.showPromises();
    }
}
