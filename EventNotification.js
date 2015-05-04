define(function(){
    var EventNotification = function(params){
        /* Construct with params = {objId:__,clientId:__,type:____,seq:___,tags:_____}*/


        // Methods
        this.update = function(updateParams){

            if ('objId' in updateParams) {this.objId = updateParams.objId;}
            else {throw Error('EventNotification params must contain objId.');}
            if ('clientId' in updateParams) {this.clientId = updateParams.clientId;}
            else {throw Error('EventNotification params must contain clientId.');}
            if ('seq' in updateParams) {this.seq = updateParams.seq;}
            else {throw Error('EventNotification params must contain seq.');}
            if ('tags' in updateParams) {this.tags = updateParams.tags;}
            else {throw Error('EventNotification params must contain tags.');}
            if ('eventType' in updateParams) {this.eventType = updateParams.eventType;}
            else {throw Error('EventNotification params must contain eventType.');}
            if ('objectType' in updateParams) {this.objectType = updateParams.objectType;}
            else {throw Error('EventNotification params must contain objectType.');}

        };

        // Init
        this.update(params);

    };
    return EventNotification;
});
