// The camera controls herewithin are based on FlyControls by James Baicoianu

define(['THREE','Register','Manipulator'],function(THREE,Register,Manipulator){

    var KeyboardControls = function(geoEditor){


        this.domElement = geoEditor.container.containerElement;
        //if ( this.domElement ) this.domElement.setAttribute( 'tabindex', -1 );

        // API

        this.movementSpeed = 100.0;
        this.rollSpeed = 0.5;

        this.dragToLook = false;
        this.autoForward = false;

        // disable default target object behavior

        // internals

        this.linearIncrement = 1;
        this.angularIncrement = 1;
        this.raycastTargetsRegister = new Register(geoEditor);
        this.activeManipulator = new Manipulator(geoEditor);
        this.manipulators = [this.activeManipulator];
        this.activeManipulatorIndex = 0;

        this.navMode = 'c'; // c for camera, m for manipulator
        this.incrementMode = 'l';
        this.camera = geoEditor.camera;
        this.activeRegister = geoEditor.showRegister;
        this.registers = [geoEditor.showRegister];

        this.tmpQuaternion = new THREE.Quaternion();

        this.mouseStatus = 0;

        this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
        this.moveVector = new THREE.Vector3( 0, 0, 0 );
        this.rotationVector = new THREE.Vector3( 0, 0, 0 );

        this.handleEvent = function ( event ) {

            if ( typeof this[ event.type ] == 'function' ) {
                this[ event.type ]( event );
            }
        };

        this.keydown = function( event ) {

            if ( event.altKey ) {

                return;

            }

            //event.preventDefault();

            switch ( event.key ) {

                case "Shift": /* shift */ this.movementSpeedMultiplier = .1; break;

                //case 87: /*W*/ this.moveState.forward = 1; break;
                //case 83: /*S*/ this.moveState.back = 1; break;
                case "e": this.translate_y_down(event); break;
                case "d": this.translate_y_down(event); break;

                //case 65: /*A*/ this.moveState.left = 1; break;
                //case 68: /*D*/ this.moveState.right = 1; break;
                case "s": this.translate_x_down(event); break;
                case "f": this.translate_x_down(event); break;

                //case 82: /*R*/ this.moveState.up = 1; break;
                //case 70: /*F*/ this.moveState.down = 1; break;
                case "q": this.translate_z_down(event); break;
                case "a": this.translate_z_down(event); break;

                //case 38: /*up*/ this.moveState.pitchUp = 1; break;
                //case 40: /*down*/ this.moveState.pitchDown = 1; break;
                case "ArrowUp": this.rotate_y_down(event); break;
                case "ArrowDown": this.rotate_y_down(event); break;
               

                //case 37: /*left*/ this.moveState.yawLeft = 1; break;
                //case 39: /*right*/ this.moveState.yawRight = 1; break;
                case "ArrowRight": this.rotate_x_down(event); break;
                case "ArrowLeft": this.rotate_x_down(event); break;

                //case 81: /*Q*/ this.moveState.rollLeft = 1; break;
                //case 69: /*E*/ this.moveState.rollRight = 1; break;
                case "r": this.rotate_z_down(event); break;
                case "w": this.rotate_z_down(event); break;

                case "z": this.toggleCameraManipulator(); break;
                case "x": this.cycleManipulatorTranslationMode(); break;
                case "c": this.cycleManipulatorRotationMode(); break;
                case "b": this.cycleScaleMode(); break;
                case "t": this.scaleUp(); break;
                case "g": this.scaleDown(); break;
                case "i": this.newPoint(); break;
                case "u": this.newCurve(); break;
                case "y": this.newSurface(); break;
                case "m": this.newMeasurement(); break;
                case ",": this.cycleActiveRegister(false); break;
                case ".": this.cycleActiveRegister(true); break;
                case "/": this.newRegister(); break;
                case "?": this.deleteRegister(); break;
                case "Delete": this.deleteObjects(); break;
                //case ")": this.roundSelectionToIncrement(); break;
                case "~": this.cycleIncrementMode(); break;
                case "`": this.setIncrement(event,0); break;
                case "1": this.setIncrement(event,1); break;
                case "2": this.setIncrement(event,2); break;
                case "3": this.setIncrement(event,3); break;
                case "4": this.setIncrement(event,4); break;
                case "5": this.setIncrement(event,5); break;
                case "6": this.setIncrement(event,6); break;
                case "7": this.setIncrement(event,7); break;
                case "8": this.setIncrement(event,8); break;
                case "9": this.setIncrement(event,9); break;
                case "0": this.setIncrement(event,10); break;
                case "!": this.setIncrement(event,-1); break; 
                case "@": this.setIncrement(event,-2); break; 
                case "#": this.setIncrement(event,-3); break; 
                case "$": this.setIncrement(event,-4); break; 
                case "%": this.setIncrement(event,-5); break; 
                case "^": this.setIncrement(event,-6); break; 
                case "&": this.setIncrement(event,-7); break; 
                case "*": this.setIncrement(event,-8); break; 
                case "(": this.setIncrement(event,-9); break; 
                case ")": this.setIncrement(event,-10); break;
                case "'": this.newManipulator(); break;
                case"\"": this.deleteManipulator(); break;
                case "[": this.cycleManipulator(false); break;
                case "]": this.cycleManipulator(true); break;
                case "\\": this.clone(); break;
            }

            this.updateMovementVector();
            this.updateRotationVector();

        };

        this.keyup = function( event ) {

            switch( event.key ) {

                case 16: /* shift */ this.movementSpeedMultiplier = 1; break;

                //case 87: /*W*/ this.moveState.forward = 0; break;
                //case 83: /*S*/ this.moveState.back = 0; break;
                case "e": this.translate_y_up(event); break;
                case "d": this.translate_y_up(event); break;

                //case 65: /*A*/ this.moveState.left = 0; break;
                //case 68: /*D*/ this.moveState.right = 0; break;
                case "s": this.translate_x_up(event); break;
                case "f": this.translate_x_up(event); break;

                //case 82: /*R*/ this.moveState.up = 0; break;
                //case 70: /*F*/ this.moveState.down = 0; break;
                case "q": this.translate_z_up(event); break;
                case "a": this.translate_z_up(event); break;

                //case 38: /*up*/ this.moveState.pitchUp = 0; break;
                //case 40: /*down*/ this.moveState.pitchDown = 0; break;
                case "ArrowUp": this.rotate_y_up(event); break;
                case "ArrowDown": this.rotate_y_up(event); break;

                //case 37: /*left*/ this.moveState.yawLeft = 0; break;
                //case 39: /*right*/ this.moveState.yawRight = 0; break;
                case "ArrowRight": this.rotate_x_up(event); break;
                case "ArrowLeft": this.rotate_x_up(event); break;

                //case 81: /*Q*/ this.moveState.rollLeft = 0; break;
                //case 69: /*E*/ this.moveState.rollRight = 0; break;
                case "r": this.rotate_z_up(event); break;
                case "w": this.rotate_z_up(event); break;

            }

            this.updateMovementVector();
            this.updateRotationVector();

        };

        this.mousedown = function( event ) {

            if ( this.domElement !== document ) {

                this.domElement.focus();

            }

            event.preventDefault();
            event.stopPropagation();

            if ( this.dragToLook ) {

                this.mouseStatus ++;

            } else {

                switch ( event.button ) {

                    case 0: this.moveState.forward = 1; break;
                    case 2: this.moveState.back = 1; break;

                }

                this.updateMovementVector();

            }

        };

        this.mousemove = function( event ) {

            if ( !this.dragToLook || this.mouseStatus > 0 ) {

                var container = this.getContainerDimensions();
                var halfWidth  = container.size[ 0 ] / 2;
                var halfHeight = container.size[ 1 ] / 2;

                this.moveState.yawLeft   = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
                this.moveState.pitchDown =   ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

                this.updateRotationVector();

            }

        };

        this.mouseup = function( event ) {

            event.preventDefault();
            event.stopPropagation();

            if ( this.dragToLook ) {

                this.mouseStatus --;

                this.moveState.yawLeft = this.moveState.pitchDown = 0;

            } else {

                switch ( event.button ) {

                    case 0: this.moveState.forward = 0; break;
                    case 2: this.moveState.back = 0; break;

                }

                this.updateMovementVector();

            }

            this.updateRotationVector();

        };

        this.update = function( delta ) {

            var moveMult = delta * this.movementSpeed;
            var rotMult = delta * this.rollSpeed;

            this.camera.translateX( this.moveVector.x * moveMult );
            this.camera.translateY( this.moveVector.y * moveMult );
            this.camera.translateZ( this.moveVector.z * moveMult );

            this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
            this.camera.quaternion.multiply( this.tmpQuaternion );

            // expose the rotation vector for convenience
            this.camera.rotation.setFromQuaternion( this.camera.quaternion, this.camera.rotation.order );


        };

        this.updateMovementVector = function() {

            var forward = ( this.moveState.forward || ( this.autoForward && !this.moveState.back ) ) ? 1 : 0;

            this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
            this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
            this.moveVector.z = ( -forward + this.moveState.back );

            //console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

        };

        this.updateRotationVector = function() {

            this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
            this.rotationVector.y = ( -this.moveState.yawRight  + this.moveState.yawLeft );
            this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

            //console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

        };

        this.getContainerDimensions = function() {

            if ( this.domElement != document ) {

                return {
                    size    : [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
                    offset    : [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
                };

            } else {

                return {
                    size    : [ window.innerWidth, window.innerHeight ],
                    offset    : [ 0, 0 ]
                };

            }

        };

        function bind( scope, fn ) {

            return function () {

                fn.apply( scope, arguments );

            };

        };

        //this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, 
        //    pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };

        this.translate_x_down = function(event){
            switch (this.navMode){
                case "c": this.translate_x_camera_down(event); break;
                case "m": this.translate_x_manipulator(event); break;
            }
        };

        this.translate_x_up = function(event){
            if (this.navMode === "c"){
                this.translate_x_camera_up(event);
            }
        };

        this.translate_x_camera_down = function(event){
            switch (event.key) {
                case "f": this.moveState.right = 1; break;
                case "s": this.moveState.left = 1; break;
            }
        };

        this.translate_x_camera_up = function(event){
            switch (event.key) {
                case "f": this.moveState.right = 0; break;
                case "s": this.moveState.left = 0; break;
            }
        };

        this.translate_x_manipulator = function(event){
            var sign = 0;
            switch (event.key) {
                case "f": sign =  1; break;
                case "s": sign = -1; break;
            }
            this.activeManipulator.translateByVector([sign*this.linearIncrement,0,0]);
        };

        this.rotate_x_down = function(event){
            switch (this.navMode) {
                case "c": this.rotate_x_camera_down(event); break;
                case "m": this.rotate_x_manipulator(event); break;
            }
        };

        this.rotate_x_up = function(event){
            switch (this.navMode) {
                case "c": this.rotate_x_camera_up(event); break;
            }
        };

        this.rotate_x_camera_down = function(event){
            switch (event.key) {
                case "ArrowRight": this.moveState.yawRight = 1; break;
                case "ArrowLeft": this.moveState.yawLeft = 1; break;
            }
        };
        this.rotate_x_camera_up = function(event){
            switch (event.key) {
                case "ArrowRight": this.moveState.yawRight = 0; break;
                case "ArrowLeft": this.moveState.yawLeft = 0; break;
            }
        };

        this.rotate_x_manipulator = function(event){
            var sign = 0;
            switch (event.key) {
                case "ArrowRight": sign =  1; break;
                case "ArrowLeft":  sign = -1; break;
            }
            this.activeManipulator.rotateByVectorAngle([1,0,0],sign*this.angluarIncrement);
        };

        this.translate_y_down = function(event){
            switch (this.navMode){
                case "c": this.translate_y_camera_down(event); break;
                case "m": this.translate_y_manipulator(event); break;
            }
        };

        this.translate_y_up = function(event){
            if (this.navMode === "c"){
                this.translate_y_camera_up(event);
            }
        };

        this.translate_y_camera_down = function(event){
            switch (event.key) {
                case "e": this.moveState.up = 1; break;
                case "d": this.moveState.down = 1; break;
            }
        };

        this.translate_y_camera_up = function(event){
            switch (event.key) {
                case "e": this.moveState.up = 0; break;
                case "d": this.moveState.down = 0; break;
            }
        };

        this.translate_y_manipulator = function(event){
            var sign = 0;
            switch (event.key) {
                case "e": sign =  1; break;
                case "d": sign = -1; break;
            }
            this.activeManipulator.translateByVector([0,sign*this.linearIncrement,0]);
        };

        this.rotate_y_down = function(event){
            switch (this.navMode) {
                case "c": this.rotate_y_camera_down(event); break;
                case "m": this.rotate_y_manipulator(event); break;
            }
        };

        this.rotate_y_up = function(event){
            switch (this.navMode) {
                case "c": this.rotate_y_camera_up(event); break;
            }
        };

        this.rotate_y_camera_down = function(event){
            switch (event.key) {
                case "ArrowUp": this.moveState.pitchDown = 1; break;
                case "ArrowDown": this.moveState.pitchUp = 1; break;
            }
        };
        this.rotate_y_camera_up = function(event){
            switch (event.key) {
                case "ArrowUp": this.moveState.pitchDown = 0; break;
                case "ArrowDown": this.moveState.pitchUp = 0; break;
            }
        };

        this.rotate_y_manipulator = function(){
            var sign = 0;
            switch (event.key) {
                case "ArrowUp": sign =  1; break;
                case "ArrowDown":  sign = -1; break;
            }
            this.activeManipulator.rotateByVectorAngle([0,1,0],sign*this.angluarIncrement);
        };

        this.translate_z_down = function(event){
            switch (this.navMode){
                case "c": this.translate_z_camera_down(event); break;
                case "m": this.translate_z_manipulator(event); break;
            }
        };

        this.translate_z_up = function(event){
            if (this.navMode === "c"){
                this.translate_z_camera_up(event);
            }
        };

        this.translate_z_camera_down = function(event){
            switch (event.key) {
                case "a": this.moveState.back = 1; break;
                case "q": this.moveState.forward = 1; break;
            }
        };

        this.translate_z_camera_up = function(event){
            switch (event.key) {
                case "a": this.moveState.back = 0; break;
                case "q": this.moveState.forward = 0; break;
            }
        };

        this.translate_z_manipulator = function(event){
            var sign = 0;
            switch (event.key) {
                case "q": sign =  1; break;
                case "a": sign = -1; break;
            }
            this.activeManipulator.translateByVector([0,0,sign*this.linearIncrement]);
        };

        this.rotate_z_down = function(event){
            switch (this.navMode) {
                case "c": this.rotate_z_camera_down(event); break;
                case "m": this.rotate_z_manipulator(event); break;
            }
        };

        this.rotate_z_up = function(event){
            switch (this.navMode) {
                case "c": this.rotate_z_camera_up(event); break;
            }
        };

        this.rotate_z_camera_down = function(event){
            switch (event.key) {
                case "r": this.moveState.rollRight = 1; break;
                case "w": this.moveState.rollLeft = 1; break;
            }
        };
        this.rotate_z_camera_up = function(event){
            switch (event.key) {
                case "r": this.moveState.rollRight = 0; break;
                case "w": this.moveState.rollLeft = 0; break;
            }
        };

        this.rotate_z_manipulator = function(event){
            var sign = 0;
            switch (event.key) {
                case "r": sign =  1; break;
                case "w":  sign = -1; break;
            }
            this.activeManipulator.rotateByVectorAngle([0,0,1],sign*this.angluarIncrement);
        };

        this.toggleCameraManipulator = function(){
            if (this.navMode === "c") {
                this.navMode = "m";
                console.log("navMode: Manipulator");
            }
            else {
                this.navMode = "c";
                console.log("navMode: Camera");
            }
        };

        this.cycleManipulatorTranslationMode = function(){
            var modes = ['grounded','hitched','free'];
            var currentMode = this.activeManipulator.translationMode;
            var i = modes.indexOf(currentMode);
            i++;
            var mode = modes[(i+modes.length)%(modes.length)];
            this.activeManipulator.translationMode = mode;
            console.log("Manipulator translation mode: "+mode);
        };

        this.cycleManipulatorRotationMode = function(){
            var modes = ['grounded','hitched','free'];
            var currentMode = this.activeManipulator.rotationMode;
            var i = modes.indexOf(currentMode);
            i++;
            var mode = modes[(i+modes.length)%(modes.length)];
            this.activeManipulator.rotationMode = mode;
            console.log("Manipulator rotation mode: "+mode);
        };

        this.cycleScaleMode = function(){
            console.log('not implemented');
        };
        this.scaleUp = function(){
            console.log('not implemented');
        };
        this.scaleDown = function(){
            console.log('not implemented');
        };
        this.newPoint = function(){
            console.log('not implemented');
            // get the intersection of the cursor and the nearest raycast target
            // create a point there and add it into the active register.
        };
        this.newCurve = function(){
            console.log('not implemented');
        };
        this.newSurface = function(){
            console.log('not implemented');
        };
        this.newMeasurement = function(){
            console.log('not implemented');
        };
        this.cycleActiveRegister = function(directionFlag){
            console.log('not implemented');
        };
        this.newRegister = function(){
            console.log('not implemented');
        };
        this.deleteRegister = function(){
            console.log('not implemented');
        };
        this.deleteObjects = function(){
            console.log('not implemented');
        };
        this.roundSelectionToIncrement = function(){
            console.log('not implemented');
        };
        this.cycleIncrementMode = function(){
            if (this.incrementMode === 'ad'){
                this.incrementMode = 'l';
                console.log("Increment mode: linear (Buttons ` and [0-9] and shift+[0-9] now modify the linear increment)");
            }
            else if (this.incrementMode === 'l'){
                this.incrementMode = 'af';
                console.log("Increment mode: angular fractional (Buttons ` and [0-9] and shift+[0-9] now modify the angular increment)");
            }
            else {
                this.incrementMode = 'ad';
                console.log("Increment mode: angular decimal (Buttons ` and [0-9] and shift+[0-9] now modify the angular increment)");
            }
        };
        this.setIncrement = function(event,number){
            if (this.incrementMode === 'l'){
                this.linearIncrement = Math.pow(10,number);
                console.log('Linear increment: ' + this.linearIncrement);
            }
            if (this.incrementMode ==='ad'){
                this.angularIncrement = Math.pow(10,number);
                console.log('Angular increment: '+this.angularIncrement+' deg');
            }
            if (this.incrementMode === 'af'){
                if (number < 0) {
                    this.angularIncrement = 360.0/(10.0 - number);
                    console.log('Angular increment: '+this.angularIncrement+' deg');
                }
                else if (number > 0){
                    this.angularIncrement = 360.0/(number);
                    console.log('Angular increment: '+this.angularIncrement+' deg');
                }
            }
        };
        this.newManipulator = function(){
            console.log('not implemented');
        };
        this.deleteManipulator = function(){
            console.log('not implemented');
        };

        this.cycleManipulator = function(directionFlag){
            if (directionFlag) {
                this.activeManipulatorIndex = (this.activeManipulatorIndex + 1 + this.manipulators.length)%(this.manipulators.length);
            }
            else {
                this.activeManipulatorIndex = (this.activeManipulatorIndex - 1 + this.manipulators.length)%(this.manipulators.length);
            }
            this.activeManipulator = this.manipulators[this.activeManipulatorIndex];
            console.log('active manipulator: '+this.activeManipulatorIndex);
        };

        this.clone = function(){
            console.log('not implemented');
        };

        this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

        //this.domElement.addEventListener( 'mousemove', bind( this, this.mousemove ), false );
        //this.domElement.addEventListener( 'mousedown', bind( this, this.mousedown ), false );
        //this.domElement.addEventListener( 'mouseup',   bind( this, this.mouseup ), false );

        window.addEventListener( 'keydown', bind( this, this.keydown ), false );
        window.addEventListener( 'keyup',   bind( this, this.keyup ), false );

        this.updateMovementVector();
        this.updateRotationVector();

    }; // KeyboardControls

    return KeyboardControls;

});
