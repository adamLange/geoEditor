define(function(){
    var EventListener = function(query,callback){
 
        // Methods
        this.eval = function(eventNotification){
            if (this.queryFn(eventNotification)) {
                this.callback(eventNotification);
            }
        };

        // Initialization
        this.queryFn = query;
        this.callback = callback;

        var a = new Uint32Array(1);
        crypto.getRandomValues(a);
        this.id = a[0];

        // IDEA: make a syntax for defining query functions so
        // that queryFunctions can be serializable.

    };
    return EventListener;
});
