
export class TrackingHelper {

    /*
    *
    *  DO NOT CALL FUNCTIONS WITH _functionName()
    *  THESE ARE PRIVATE FUNCTIONS
    *
    * */

    constructor(app, store, router) {
        this._router = router;
        this.app = app;
        this.store = store
        this._watchRouteChange();
        this.previousPage = '';
        this.websiteUrl = window.location.origin;
        
        
    }

    _watchRouteChange() {
        this._captureFirstRoute();
        // Captures the router updating
        this._router.beforeEach((to, from, next) => {

            // TODO: Send the route change to an external service for logging
            const nextRoute = to.path;
            const routeName = to.name;

            if (this.store.getCurrentUser) {
                if (this.store.getCurrentUser.telemetry) {
                    // eslint-disable-next-line no-undef
                    // analytics.page(routeName, {
                    //     path: nextRoute,
                    //     url: `${this.websiteUrl}${nextRoute}`,
                    //     search: '',
                    //     referrer: this.previousPage
                    // });
                }
            }

            this.previousPage = `${this.websiteUrl}${nextRoute}`;
            next();
        });
    }

    _captureFirstRoute() {
        // Captures the first route after the page has loaded
        // Event will not fire from Router so needs to be manually captured
        setTimeout(() => {
            const startRoute = this._router.currentRoute._value.path;
            this.previousPage = `${this.websiteUrl}${startRoute}`;
        }, 3000);
    }

    trackUser(userData) {
        // Check if the user has telemetry disabled
        if (!userData.telemetry) return;

        // eslint-disable-next-line no-undef
        // analytics.identify(userData.id, {
        //     name: userData.name,
        //     email: userData.email,
        //     company: userData.company,
        //     department: userData.department,
        //     function: userData.function,
        //     role: userData.role,
        //     license: userData.license,
        // });
    }

    resetUser() {
        // eslint-disable-next-line no-undef
        // analytics.reset();
    }

    // TODO: Send the event information to the backend or a service
    trackEvent(eventName, data) {
        // Check if the user has telemetry disabled
        if (!this.store.getCurrentUser) return;
        if (!this.store.getCurrentUser.telemetry) return;

        // eslint-disable-next-line no-undef
        // analytics.track(eventName, data);
    }

}
