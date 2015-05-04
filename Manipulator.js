define(['GeoObject','verb','THREE','Point','Register'],function(GeoObject,verb,THREE,Point,Register){

    var Manipulator = function (geoEditor,params) {

        var params = params || {};
        var scope = this;
        GeoObject.call(this,geoEditor,params);
        this.baseUpdate = this.update;

        this._.x = [1,0,0];
        this._.xy = [0,1,0];
        this._.z = [0,0,1];
        this._.y = [0,1,0];

        Object.defineProperty(this,'type',
            {value:"Manipulator"
             ,enumerable:true
             ,configurable:false
             ,writable:false
        });

        this._.originPtId = null;
        this._.originPt = null;
        Object.defineProperty(this,'originPtId',{
            get:function(){return scope._.originPtId;}
            ,set:function(newValue){
                this.update({originPtId:newValue});
            }
	    ,enumerable:true
	    ,configurable:false
        });
        Object.defineProperty(this,'originPt',{
            get:function(){return this._.originPt;}
            ,set:function(newValue){
                this.originPtId = newValue.id;
            }
            ,enumerable:false
            ,configurable:false
        });

        this._.xAxisPtId = null;
        this._.xAxisPt = null;
        Object.defineProperty(this,'xAxisPtId',{
            get:function(){return scope._.xAxisPtId;}
            ,set:function(newValue){
                this.update({xAxisPtId:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });
        Object.defineProperty(this,"xAxisPt",{
            get:function(){return this._.xAxisPt;}
            ,set:function(newValue){
                this.xAxisPtId = newValue.id;
            }
            ,enumerable:false
            ,configurable:false
        });

        this._.xyPlanePtId = null;
        this._.xyPlanePt = null;
        Object.defineProperty(this,'xyPlanePtId',{
            get:function(){return scope._.xyPlanePtId;}
            ,set:function(newValue){
                this.update({xyPlanePtId:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });
        Object.defineProperty(this,'xyPlanePt',{
            get:function(){return scope._.xyPlanePt;}
            ,set:function(newValue){
                this.xyPlanePtId = newValue.id;
            }
            ,enumerable:false
            ,configurable:false
        });

        this._.translationMode = "grounded";
        Object.defineProperty(this,'translationMode',{
            get:function(){return this._.translationMode}
            ,set:function(newValue){
                this.update({translationMode:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });

        this._.rotationMode = "grounded";
        Object.defineProperty(this,'rotationMode',{
            get:function(){return this._.rotationMode}
            ,set:function(newValue){
                this.update({rotationMode:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });

        this._.registerId = null;
        this._.register = null;
        Object.defineProperty(this,"registerId",{
            get:function(){return this._.registerId}
            ,set:function(newValue){
                this.update({registerId:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });
        Object.defineProperty(this,"register",{
            get:function(){return this._.register;}
            ,set:function(newValue){
                this.registerId = newValue.id;
            }
            ,enumerable:false
            ,configurable:false
        });

        this.update = function(params){
            console.log('Manipulator.update is running');
            console.log(Object.keys(params));
            var params = params || {};
            if ("originPtId" in params) {
                var typeOk = false;
                if (params.originPtId in geoEditor.objects){
                    if (geoEditor.objects[params.originPtId].type === "Point") {
                        typeOk = true;
                    }
                }
                if (typeOk){
                    this._.originPtId = params.originPtId;
                    this._.originPt = geoEditor.objects[params.originPtId];
                }
                else {throw "originPtId must be the Id of a Geo.Point registered in the same GeoEditor as this manipulator.";}
            }
            if ("xAxisPtId" in params) {
                var newValue = params.xAxisPtId;
                var typeOk = false;
                if (newValue in geoEditor.objects) {
                    if (geoEditor.objects[newValue] instanceof Point ) {
                        typeOk = true;
                    }
                }
                if (typeOk) {
                    this._.xAxisPtId = newValue;
                    this._.xAxisPt = geoEditor.objects[newValue];
                }
                else {throw "xAxisPtId must be the id of a Geo.Point registered in the same GeoEditor as this manipulator.";}
            }
            if ("xyPlanePtId" in params) {
                var newValue = params.xyPlanePtId;
                var typeOk = false;
                if (newValue in geoEditor.objects) {
                    if (geoEditor.objects[newValue] instanceof Point ) {
                        typeOk = true;
                    }
                }
                if (typeOk) {
                    this._.xyPlanePtId = newValue;
                    this._.xyPlanePt = newValue;
                }
                else {throw "xyPlanePtId must be the id of a Geo.Point registered in the same GeoEditor as this manipulator.";}

            }
            if ("translationMode" in params) {
                var newValue = params.translationMode;
                if ( (params.translationMode === "grounded")||
                     (params.translationMode === "hitched")||
                     (params.translationMode === "free")) {
                        this._.translationMode = newValue;
                    }
                    else {
                        throw "translationMode must be either \'grounded\', \'hitched\', or \'free\'";
                    }
            }
            if ("rotationMode" in params) {
                var newValue = params.rotationMode;
                if ( (params.rotationMode === "grounded")||
                     (params.rotationMode === "hitched")||
                     (params.rotationMode === "free")) {
                        this._.rotationMode = newValue;
                    }
                    else {
                        throw "rotationMode must be grounded, hitched, or free";
                    }
            }
            if ("registerId" in params) {
                var newValue = params.registerId;
                var obj = geoEditor.objects[newValue];
                if (true /*obj instanceof Register*/) {
                    this._.registerId = newValue;
                    this._.register = obj;
                }
                else {throw "id does not identify a Register registered with this manipulators GeoEditor.";}
            }
            this.calculate();
            this.baseUpdate(params);
        };

        this.calculate = function(){

            if ((this._.xAxisPtId !== null)&&(this._.xyPlanePtId !== null)) {

                this._.x = verb.core.Vec.normalized(verb.core.Vec.sub(
                    geoEditor.objects[this._.xAxisPtId].position
                    ,geoEditor.objects[this._.originPtId].position));  // manipulator x direction 

                this._.xy = verb.core.Vec.normalized(verb.core.Vec.sub(
                    geoEditor.objects[this._.xyPlanePtId].position
                    ,geoEditor.objects[this._.originPtId].position
                    ));  // manipulator xy direction

                this._.z = verb.core.Vec.normalized(
                    verb.core.Vec.cross(this._.x,this._.xy)); // manipulator z direction

                this._.y = verb.core.Vec.normalized(verb.core.Vec.cross(
                    this._.z,this._.x)); // manipulator y direction
            }

        };


        this.translateByVector = function(deltaVector) {

            if ( ( this.translationMode === "hitched" ) || ( this.translationMode === "grounded" ) ) {

                // move the points in the register
                this.register.apply(function(obj){
                    if ( obj.type === "Point" ){
                        var p = verb.core.Vec.add(obj.position,deltaVector);
                        obj.position = p;
                    }
                });
            }

            if ( (this.translationMode === "hitched") || (this.translationMode === "free") ) { 

                // move the control points
                var p = verb.core.Vec.add(geoEditor.objects[this.originPtId].position,deltaVector);
                geoEditor.objects[this.originPtId].position = p;

                var p = verb.core.Vec.add(geoEditor.objects[this.xAxisPtId].position,deltaVector);
                geoEditor.objects[this.xAxisPtId].position = p;

                var p = verb.core.Vec.add(geoEditor.objects[this.xyPlanePtId].position,deltaVector);
                geoEditor.objects[this.xyPlanePtId].position = p;

            }

        };

        this.rotateByVectorAngle = function(rotationAxisVector,theta) {
             var l = rotationAxisVector[0];
             var m = rotationAxisVector[1];
             var n = rotationAxisVector[2];
             var tx = 0;
             var ty = 0;
             var tz = 0;
             var M = new THREE.Matrix4();
             M.set( l*l*(1-Math.cos(theta))+Math.cos(theta), m*l*(1-Math.cos(theta))-n*Math.sin(theta),n*l*(1-Math.cos(theta))+m*Math.sin(theta),tx
                   ,l*m*(1-Math.cos(theta))+n*Math.sin(theta),m*m*(1-Math.cos(theta))+Math.cos(theta),n*m*(1-Math.cos(theta))-l*Math.sin(theta),ty
                   ,l*n*(1-Math.cos(theta))-m*Math.sin(theta),m*n*(1-Math.cos(theta))+l*Math.sin(theta),n*n*(1-Math.cos(theta))+Math.cos(theta),tz
                   ,0,0,0,1
                  );
             var originArr = geoEditor.objects[this.originPtId].position;
             var manipOrigin = new THREE.Vector3(originArr[0],originArr[1],originArr[2]);
             var canary = new THREE.Vector3();
             canary.copy(manipOrigin);
             canary.applyMatrix4(M);
             var delta = new THREE.Vector3();
             delta.subVectors(canary,manipOrigin);
             l = delta.x;
             m = delta.y;
             n = delta.z;
             M.set( l*l*(1-Math.cos(theta))+Math.cos(theta), m*l*(1-Math.cos(theta))-n*Math.sin(theta),n*l*(1-Math.cos(theta))+m*Math.sin(theta),tx
                   ,l*m*(1-Math.cos(theta))+n*Math.sin(theta),m*m*(1-Math.cos(theta))+Math.cos(theta),n*m*(1-Math.cos(theta))-l*Math.sin(theta),ty
                   ,l*n*(1-Math.cos(theta))-m*Math.sin(theta),m*n*(1-Math.cos(theta))+l*Math.sin(theta),n*n*(1-Math.cos(theta))+Math.cos(theta),tz
                   ,0,0,0,1
                  );

            if ( ( this.translationMode === "hitched" ) || ( this.translationMode === "grounded" ) ) {

                // Move the things in the register
                this.register.apply(function(obj){
                    if (obj.type === "Point"){
                       var a = obj.position;
                       var pos = new THREE.Vector3(a[0],a[1],a[2]);
                       pos.applyMatrix4(M);
                       obj.position = [pos.x,pos.y,pos.z];
                    }
                });

            }

            if ( (this.translationMode === "hitched") || (this.translationMode === "free") ) {

                // Move this manipulator's controlling points.
                var ctlPts = [this.originPt,this.xAxisPt,this.xyPlanePt];
                ctlPts.forEach(function(pt){
                    var pos = pt.position;
                    var vec = new THREE.Vector3(pos.x,pos.y,pos.z);
                    vec.applyMatrix4(M);
                    pt.position = [vec.x,vec.y,vec.z];
                });

            }

        };

        //this.scale
        //this.scaleRadial
        //this.scaleCylindrical
        //this.applyTransformationMatrix

        this.createControlPtEventListener = function(){
            var query = function(evt){
                if (    (evt.objectId === scope.positionPtId)
                     || (evt.objectId === scope.xAxisPtId)
                     || (evt.objectId === scope.xyPlanePtId)
                ) {
                    return true;
                }
                else {return false;}
            };
            var callback = function(evt){
                scope.calculate();
            };

            var id = new Uint32Array(1);
            crypto.getRandomValues(id);
            this.controlPointEventListener = new EventListener(query,callback);
            geoEditor.addEventListener(this.controlPointEventListener);
        };

        console.log('Here\'s where I think update should run.');
        this.update(params);

    };

    return Manipulator;

});
