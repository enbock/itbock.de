function registerServiceWorker(): void {
    if (window.location.host.indexOf('localhost') > -1) {
        console.log('Service Worker on localhost disabled.');
        return;
    }
    if (('serviceWorker' in navigator) == false) {
        console.log('Service Worker not found.');
        return;
    }

    navigator.serviceWorker.register('./ServiceWorkerManager.js')
        .then(
            function (registration: ServiceWorkerRegistration): void {
                if (!registration) return;
                setInterval(
                    function (): void {
                        registration.update().then();
                    },
                    10000
                );
            }
        )
        .catch(function (): void {
            console.warn('Service worker can not be found.');
        })
    ;

    navigator.serviceWorker.addEventListener('controllerchange', function (): void {
        window.location.reload();
    });
}

window.addEventListener('load', function (): void {
    registerServiceWorker();
});
