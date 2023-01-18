SnapExtensions.primitives.set(
    'dl_publish_and_wait(scope, event, data)',
    function (scope, event, data, proc) {
        proc.publishAndWait(scope, event, data);
    }
);

SnapExtensions.primitives.set(
    'dl_publish(scope, event, data)',
    function (scope, event, data, proc) {
        proc.publish(scope, event, data);
    }
);

SnapExtensions.primitives.set(
    'dl_get_card_prop(prop)',
    function (prop) {
        return this.getCardProperty(prop);
    }
);
