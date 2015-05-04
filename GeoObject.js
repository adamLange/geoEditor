define(['EventNotification'],function(EventNotification){

    var GeoObject = function(geoEditor,params){
        var scope = this;
        var params = params || {};
        Object.defineProperty(this,'_',{value:{},writable:true});

        this._.tags = [];
        Object.defineProperty(this,'tags',{
           enumerable:true
           ,configurable:false
           ,get:function(){return this._.tags;}
           ,set:function(newValue){
               this.update({tags:newValue});
           }
        });

        // Methods
        this.update = function(updateParams){

            var updateParams = updateParams || {};
            // TODO Make it so that this function is always called
            // directly and not overridden.  Catch any errors
            // that happen during an update and roll back any
            // changes that occured before the update.

            // TODO Currently, invalid stuff is silently dropped
            // if it's invalid.  Make it so an error is thrown,
            // but be carefull not to abandon the update process
            // without cleaning up any partial changes. (especially
            // where update routines are followed by calculate routines.

            if ('tags' in updateParams){
                scope._.tags = updateParams.tags;
            }

            var eventType = 'm';
            if (scope._.createEventSent === false) {
                scope._.createEventSent = true;
                var eventType = 'c';
            }

            geoEditor.eventDispatch(new EventNotification(
                {'seq':geoEditor.seq += 1,
                 'clientId':geoEditor.clientId,
                 'objId':scope.id,
                 'eventType':eventType,
                 'objectType':scope.type,
                 'tags':scope.tags
                }
            ));
        };

        this.geoEditorRegistration = function() {
            var a = new Uint32Array(1);
            do {
                crypto.getRandomValues(a);
            }
            while (a[0] in geoEditor.objects);
            Object.defineProperty(scope,'id',{
                enumerable:true
                ,configurable:false
                ,writable:false
                ,value:a[0]
            });
            geoEditor.objects[scope.id] = scope;

        };

        // Initialization
        if ('tags' in params){
            this._.tags = updateParams.tags;
        }
        this._.createEventSent = false;
        this.geoEditorRegistration();

    };
    return GeoObject;
});
