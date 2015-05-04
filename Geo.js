//requirejs.config({
//    paths: {
//        'THREE': 'THREE',
//        'verb': 'verb',
//        'Content':'js/Content',
//        'FlyControlsNoMouse':'js/FlyControlsNoMouse',
//    }
//});


define(["EventListener","EventNotification","GeoObject","NurbsCurve",
        "Point","Register","GeoEditor","Manipulator"],
    function(EventListener,EventNotification,GeoObject,NurbsCurve,Point,Register,GeoEditor,Manipulator){
    var Geo = {EventListener:EventListener,
               EventNotification:EventNotification,
               GeoEditor:GeoEditor,
               GeoObject:GeoObject,
               NurbsCurve:NurbsCurve,
               Point:Point,
               Register:Register,
               Manipulator:Manipulator};
    return Geo;
});


