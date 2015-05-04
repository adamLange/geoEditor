define(['GeoObject'],function(GeoObject){
    var Register = function(geoEditor,params){

        var params = params || {};
        // Initialization
        GeoObject.call(this,geoEditor,params);

        this._.baseUpdate = this.update;

        Object.defineProperty(this,'type',{
            enumerable:true
            ,configurable:false
            ,writable:false
            ,value:'Register'
        });

        this._.array = [];
        Object.defineProperty(this,'array',{
            get:function(){return this._.array;}
            ,set:function(newValue){
                this.update({array:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });

        // Methods
        this.update = function(updateParams){
            var updateParams = updateParams || {};
            if ('array' in updateParams){
                this._.array = updateParams.array;
            }
            this._.baseUpdate(updateParams); 
        };

        this.push = function(newElement){
            var type = typeof(newElement);
            if ( (type === 'number') || (type === 'string') ) {
                var newArray = this.array.slice(0,this.array.length);
                newArray.push(newElement);
                this.array = newArray;
            }
            else if ( type === 'object' ) {
                if (newElement.id) {
                    var newArray = this.array.slice(0,this.array.length);
                    newArray.push(newElement.id);
                    this.array = newArray;
                }
                else {throw "Invalid type of object to push to a GeoRegister";}
            }
            else {
                throw "Invalid type to push to a Geo.Register";
            }
        };

        // Initialization
        this.update(params);

        this.apply = function(fn){
            var r = [];
            for (var i = 0; i < this._.array.length; i++) {
                var obj = geoEditor.objects[this._.array[i]];
                if (obj.type === 'Register') {
                    r.concat(obj.apply(fn));
                }
                else {
                    r.push(fn(obj));
                }
            }
            return r;
        };

    };
    return Register;
});
