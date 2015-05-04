define(['GeoObject','THREE','verb'],function(GeoObject,THREE,verb){
    NurbsSurface = function(){

        this.update(updateParams,op = 0b0){

            if ((op>>0)%2) { // verb surface construction

                var ctlPts = [];
                var weights = [];
                var ora = //outer register array
                    this.geoEditor.objects[this.ctl.ctlPtRegId].ctl.array;
                for (var i = 0; i<ora.length; i++) {
                    var innerRegId = ora[i];
                    var ira = //inner register array
                        this.geoEditor.objects[innerRegId].ctl.array;
                    var ctlPtRow = [];
                    var weightsRow = [];
                    for (var j = 0; j<ira.length; j++) {
                        var pointObject = this.geoEditor
                        var type = 
                        var 
                        ctlPtRow.push();
                        weightsRow.push();
                    }
                    ctlPts.push(ctlPtRow);
                    weights.push(weightsRow);
                }

                new NurbsSurface( degreeU, knotsU, degreeV, knotsV, controlPoints, weights )
            } // surface construction
        } // NurbsSurface.update

    }; //NurbsSurface
    return NurbsSurface;
});
