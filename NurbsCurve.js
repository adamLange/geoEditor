define(['GeoObject','THREE','verb','EventListener'],function(GeoObject,THREE,verb,EventListener){

    function asVector3(pts){
        return pts.map(function(x){
            return new THREE.Vector3(x[0],x[1],x[2]);
        });
    }

//TODO Fix it so that every time the knots go invalid you don't have to respecify null
// in order to get the default knots.

    NurbsCurve = function(geoEditor,params){

        var params = params || {};

        //Initialization

        GeoObject.call(this,geoEditor,params);
        this._.baseUpdate = this.update;
        var scope = this;
        Object.defineProperty(this,'type',{
            enumerable:true
            ,configurable:false
            ,writable:false
            ,value:'NurbsCurve'
        });

        this._.ctlPtRegId = null;
        this._.ctlPtReg = null;
        Object.defineProperty(this,'ctlPtRegId',{
            get:function(){return this._.ctlPtRegId;}
            ,set:function(newValue){
                this.update({ctlPtRegId:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });
        Object.defineProperty(this,'ctlPtReg',{
            get:function(){return this._.ctPtReg;}
            ,set:function(newValue){
                this.ctlPtRegId = newValue.id;
            }
            ,enumerable:false
            ,configurable:false
        });

        this._.knots = null;
        Object.defineProperty(this,'knots',{
            get:function(){return this._.knots;}
            ,set:function(newValue){
                this.update({knots:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });

        this._.degree = 3;
        Object.defineProperty(this,'degree',{
            get:function(){return this._.degree;}
            ,set:function(newValue){
                this.update({degree:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });

        this._.color = 0x4477ff;
        Object.defineProperty(this,'color',{
            get:function(){return this._.color;}
            ,set:function(newValue){
                this.update({color:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });

        this._.width = 1.0;
        Object.defineProperty(this,'width',{
            get:function(){return this._.width;}
            ,set:function(newValue){
                this.update({width:newValue});
            }
            ,enumerable:true
            ,configurable:false
        });

        this._.ctlPtEventQuery = function (evt) {
            if ( ( geoEditor.objects[scope.ctlPtRegId].array.indexOf(evt.objId) != -1)
                 || ( evt.id = scope.registerId )) {
                return true;
            }
            else {
                return false;
            }
        };

        this._.ctlPtEventListener = new EventListener(
             this._.ctlPtEventQuery,
             function(evt){
                 scope.update({});
             });
        geoEditor.addEventListener(this._.ctlPtEventListener);

        this._.threeMaterial = new THREE.LineBasicMaterial(
                 {color:this.color,linewidth:this.width});

        this._.threeObject = new THREE.Line(new THREE.Geometry(),this._.threeMaterial);

        //Methods

        this.update = function(updateParams){
            var updateParams = updateParams || {};
            if ('ctlPtRegId' in updateParams) {
                this._.ctlPtRegId = updateParams.ctlPtRegId;
                this._.ctlPtReg = geoEditor.objects[this._.ctlPtRegId];
            }
            if ('knots' in updateParams) {
                this._.knots = updateParams.knots;
            }
            if ('degree' in updateParams) {
                this._.degree = updateParams.degree;
            }
            if ('color' in updateParams) {
                this._.color = updateParams.color;
            }
            if ('width' in updateParams) {
                this._.width = updateParams.width;
            }
            try {
                this.calculate();
            }
            catch (e){
                console.log('Caught error when calculating NurbsCurve ' + scope.id+ ":\n" + e );
            }
            this._.baseUpdate(updateParams);
        };

        this.calculate = function() {

            // fetch ctl point / weights

            this._.ctlPts = [];
            this._.weights = [];
            var ra = this._.ctlPtReg.array; // register array
            //for (var i = 0; i<ra.length; i++) { // Iterate over points
            //    var point = geoEditor.objects[ra[i]];
            //    if (point.type != 'Point'){
            //        throw Error('An object in a Curve\'s control point register is not a Point.');
            //    }
            //    var p = point.position.slice(0,3);
            //    p.push(1.0);
            //    this._.ctlPts.push(p);
            //}
            for (var i = 0; i<ra.length; i++) { // Iterate over points
                var point = geoEditor.objects[ra[i]];
                if (point.type != 'Point'){
                    throw Error('An object in a Curve\'s control point register is not a Point.');
                }
                this._.ctlPts.push(point.position.slice(0,3));
                this._.weights.push(point.weight);
            }


            // generate knots or use supplied knots
            var nKnots = this._.ctlPts.length + this.degree + 1;
	    var knots = [];
            if (this.knots != null) {
                knots = this.knots;
            }
            else {
                var endMultiplicity = this.degree + 1;
                var deltaU = 1.0/((nKnots-2*endMultiplicity)+1);
                for (var i = 0; i < endMultiplicity; i++){
                    knots.push(0.0);
                }
                var q = 1;
                for(var i = endMultiplicity*2; i<nKnots; i++){
                    knots.push(deltaU * q);
                    q++;
                }
                for (var i = 0; i < endMultiplicity; i++){
                    knots.push(1.0);
                }
                this._.knots = knots;
            }

            // verb curve and three geometry construction
            //this._.verbCurve = new verb.geom.NurbsCurve(
            //    {degree:this.degree,
            //    controlPoints:this._.ctlPts,
            //    weights:this._.weights,
            //    knots:this.knots});

            this._.verbCurve = new verb.geom.NurbsCurve.byKnotsControlPointsWeights(
                this.degree
                ,this.knots
                ,this._.ctlPts
                ,this._.weights
            );

            this._.threeObject = new THREE.Line(new THREE.Geometry(),this._.threeMaterial);
            this._.threeObject.geometry.vertices = asVector3(
                    this._.verbCurve.tessellate()
            );
            //this._.threeObject.geometry.verticesNeedUpdate = true;
            geoEditor.showRegisterCallback();

            // update appearance
            this._.threeObject.material.color.setHex(this.color);
            this._.threeObject.material.linewidth = this.width;

        };

        this.update(params);


    }; // NurbsCurve

    return NurbsCurve;

});
