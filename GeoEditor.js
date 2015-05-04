define(["Content","THREE","KeyboardControls","GeoObject","EventListener","Register","EventNotification"],function(Content,THREE,KeyboardControls,GeoObject,EventListener,Register,EventNotification){

    GeoEditor = function(container){
        var scope = this;
        var container = container || null;

        // Methods

        this.showRegisterQuery = function(evt){
            if (evt.objId === scope.showRegister.id) {return true;}
            else {return false;}
        };

        this.showRegisterCallback = function(evt,registerId ){
            var registerId = registerId || 'showRegister';
            // recurse nested registers.
            // Throw any object out of the register that won't go into a THREE.Scene.
            // If the object is not in the scene already, add it.
            // If the object is not in the register but in the scene, remove it. 

            var objIdsToDelete = [];

            // Get an array of scene uuid's
            var uuidsToHide = [];
            for (var i = 0; i<scope.scene.children.length; i++){
                uuidsToHide.push(scope.scene.children[i].uuid);
            }

            var regArray = scope.showRegister.array;
            for (var i = 0; i<regArray.length; i++) { // Iterate over items in register

                if (scope.objects[regArray[i]].type === 'Register') { /*thisOnes a register*/
                    scope.showRegisterCallback(evt,scope.objects[regArray[i]]);
                }
                else if ('threeObject' in scope.objects[regArray[i]]._) { /*this ones a showable object*/
                    // knock the uuid out of uuidsToHide
                    var j = uuidsToHide.indexOf(scope.objects[regArray[i]]._.threeObject.uuid);
                    if (j !== -1) {
                        uuidsToHide.splice(j,1);
                    }
                    else {
                        scope.scene.add(scope.objects[regArray[i]]._.threeObject);
                    }
                }
                else { // this object is not supposed to be here
                    // mark it to be removed from the register
                    objIdsToDelete.push(regArray[i]);
                }
            }

            for (var i = 0; i<uuidsToHide.length; i++) { // Iterate over uuidsToHide
                for (var j = 0; j<scope.scene.children.length; j++) {
                    if (scope.scene.children[j].uuid === uuidsToHide[i]) { 
                        scope.scene.remove(scope.scene.children[j]); // Hide it
                        break;
                    }
                }
            }


            for (var i = 0; i < objIdsToDelete; i++) { // Iterate over the objIdsToDel
                var j = regArray.indexOf(objIdsToDelete[i]);
                regArray.splice(j,1);
            }
        };

        this.fillContainer=function(){
            this.renderer.setSize(this.container.containerElement.innerWidth, 
                this.container.containerElement.innerHeight);
            this.container.containerElement.appendChild(this.renderer.domElement);
            this.render();
        }; //fillContainer

        this.addEventListener = function(eventListener){
            if (eventListener.id in this.eventListeners){
                throw "eventListener.id is not unique";
            }
            else {
                this.eventListeners[eventListener.id] = eventListener;
            }
        };

        this.eventDispatch = function(evt){
            Object.keys(this.eventListeners).forEach(function(id){
                try {
                    scope.eventListeners[id].eval(evt);
                }
                catch (e) {
                    console.log("eventDispatch caught an error when evaluating eventListener["+id+"]:\n    "+e);
                }
            });
        };

        this.onWindowResize = function() {

            camera.aspect = this.container.containerElement.innerWidth / 
                this.container.containerElement.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );

        };

        this.render = function(){

            requestAnimationFrame(scope.render);
            var delta = scope.clock.getDelta();
            scope.controls.update(delta);
            scope.renderer.render(scope.scene,scope.camera);

            //raycaster.setFromCamera( mouse, camera );
            //var intersects = raycaster.intersectObject( actObj );
            //for ( var i = 0; i < intersects.length; i++ ) {
            //    var str = "";
            //    str += "x: " + intersects[ i ].point.x +
            //           " y: " + intersects[ i ].point.y +
            //           " z: " + intersects[ i ].point.z + "\n";
            //    console.log(str);
            //}

        }; // GeoEditor.render

        this.sceneAdderQuery = function(evt){
            if ((evt.eventType === 'c') && ('threeObject' in scope.objects[evt.objId]._)) {
                return true;
            }
            else {
                return false;
            }
        };
        this.sceneAdderCallback = function(evt){
            var regArray = scope.showRegister.array;
            var newArray = regArray.slice(0,regArray.length);
            newArray.push(evt.objId);
            scope.showRegister.array = newArray;
        };

        this.getUniqueId = function(json){
            var a = new Uint32Array(1);
            do {
                crypto.getRandomValues(a);
            }
            while (a[0] in this.objects);
            return a[0];
        };

        // The purpose of this function is to load serialized objects in.
        // 
        /*this.create = function(input){

            var preExistingIds = Object.keys(this.objects);
            var alias = {};
            var action = false;
            Object.keys(input).forEach(function(id){
                if (id in preExistingIds) {
                    alias[id] = this.getUniqueId;
                    console.log('Renaming duplicate: '+ id + ' renamed to '+ alias[id]);
                }
                try {
                    switch (input[id].type) {
                        case "Point": 
                        case "NurbsCurve":
                        case ""
                    }
                }
                catch (e) {
                }
            });
        };*/

        // Initialization

        Content.call(this,container);

        var a = new Uint32Array(1);
        crypto.getRandomValues(a);
        this.clientId = a[0];

        this.seq = 0; // Sequence number for events generated by this GeoEditor
        this.objects={};

        this.renderer = new THREE.WebGLRenderer();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75,this.container.containerElement.innerWidth / 
            this.container.containerElement.innerHeight,0.1,3000);
        this.clock = new THREE.Clock();


        this.eventListeners = {};
        this.showRegisterListener = new EventListener(this.showRegisterQuery,scope.showRegisterCallback);
        this.showRegister= new Register(this);
        this.addEventListener(this.showRegisterListener);
        this.sceneAdderListener = new EventListener(scope.sceneAdderQuery,scope.sceneAdderCallback);
        this.addEventListener(this.sceneAdderListener);

        this.controls = new KeyboardControls(this);

    }; //GeoEditor

    return GeoEditor;
});
