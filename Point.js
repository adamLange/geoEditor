define(['GeoObject','THREE','verb','EventNotification'],function(GeoObject,THREE,verb,EventNotification){
    Point = function(geoEditor,params){

        // Initialization
        GeoObject.call(this,geoEditor,params);

        var params = params || {};

        this._.baseUpdate = this.update;

        Object.defineProperty(this,'type',{
            configurable:false
            ,enumerable:true
            ,writable:false
            ,value:'Point'
        });

        this._.position = [0.0,0.0,0.0];
        Object.defineProperty(this,'position',{
            get:function(){return this._.position;}
            ,set:function(newValue){
                this.update({position:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });

        this._.color = 0x00dd00;
        Object.defineProperty(this,'color',{
            get:function(){return this._.color;}
            ,set:function(newValue){
                this.update({color:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });

        this._.weight = 1.0;
        Object.defineProperty(this,'weight',{
            get:function(){return this._.weight;}
            ,set:function(newValue){
                this.update({weight:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });


        // init of private data members
        this._.W = new THREE.Vector3(0,0,0); // World position vector
        var mat = new THREE.PointCloudMaterial({color: 0x00ff00,size:2.0});
        var geo = new THREE.Geometry();
        geo.vertices.push(this._.W);
        this._.threeObject = new THREE.PointCloud(geo,mat);

        //Methods
        this.update = function(paramsIn){
            var paramsIn = paramsIn || {};
            if ('position' in paramsIn){
                this._.position = paramsIn.position;
                this._.W.x =this._.position[0];
                this._.W.y =this._.position[1];
                this._.W.z =this._.position[2];
            }
            if ('color' in paramsIn){
                this._.color = paramsIn.color;
                this._.threeObject.material.color.setHex(this._.color);
            }
            if ('weight' in paramsIn){
                this._.weight = paramsIn.weight;
            }
            this._.threeObject.geometry.vertices[0]=this._.W;
            this._.threeObject.geometry.verticesNeedUpdate=true;
            this._.baseUpdate(paramsIn);
        };

        // Initialization

        this.update(params);

    }; // Point
    return Point;
});
