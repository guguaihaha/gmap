/*!
 * google-map JavaScript Library v1.0.0
 * zhangjinglin
 * http://www.wefashional.com/
 *
 */
(function( window, undefined ) {
    var
    // Use the correct document accordingly with window argument (sandbox)s
        document = window.document,
        location = window.location,
        navigator = window.navigator,
    // Save a reference to some core methods
        gmap_push = Array.prototype.push,
        gmap_slice = Array.prototype.slice,
        gmap_indexOf = Array.prototype.indexOf,
        gmap_toString = Object.prototype.toString,
        gmap_hasOwn = Object.prototype.hasOwnProperty,
        gmap_trim = String.prototype.trim,
        expando = "gmap" + ("1.0.0" + Math.random()).replace( /\D/g ,""),
        unitID = 201509892839182,
        baseUrl = "./",
    //init main
    //
        namespace = {
            mapName:"gmap_293781038948",
            mapFnName:"gmap_182731927391",
            mapMarkerArray:"gmap_38373619382"
        },
        con = [
        "plugin/infobubble.js",
        "plugin/html2canvas/build/html2canvas.js"
        ],
    //regex
        reg = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/;
    //method prototype test
    Function.prototype.method = function(name,func){
        if(!this.prototype[name]){
            this.prototype[name] = func;
            return this;
        }
    }
    //
    //
   var _gmap = {
       fn:{
           cache:{},
           // The number of elements contained in the matched element set
           toArray: function() {
               return gmap_slice.call( this );
           },
           // For internal use only.
           // Behaves like an Array's method
           push: gmap_push,
           sort: [].sort,
           splice: [].splice,
           extend:function(p,c){
               var i,
                   toStr = Object.prototype.toString,
                   astr = "[object Array]",
                   child = c || {},
                   parent = p || {};
               for(i in parent){
                   if(parent.hasOwnProperty(i)){
                       if(typeof parent[i] === "object"&&!child[i]){
                           child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                           _gmap.fn.extend(parent[i], child[i]);
                       }else if(!child[i]){
                           child[i] = parent[i];
                       }
                   }
               }
               return child
           },
           extendMine:function(parent,child){
               var child = child || {};
               var parent = parent || {};
               for(var i in child){
                   var copy = child[i];
                   if(parent === copy)continue;
                   if(Object.prototype.toString.call(copy) === "[object Object]"&&copy.length>0){
                       parent[i] = arguments.callee(parent[i] || {},copy);
                   }else if(Object.prototype.toString.call(copy) === "[object Array]"){
                       parent[i] = arguments.callee(parent[i] || [],copy);
                   }else{
                       parent[i] = copy;
                   }
               }
               return parent;
           },
           data:function(elem,key,value){
               if(!elem){
                   return;
               }
               if(!value&&typeof(name) === "object"){
                   for(var i in name){
                       this.data(elem,i,key[i]);
                   };
               }
               var el =  expando;
               var id = elem.uniqueNumber ? elem.uniqueNumber : elem[el];
               if(!id){
                   if(elem.uniqueNumber){
                       id = elem.uniqueNumber;
                   }else{
                       id = elem[el] = ++unitID;
                   }
               }
               if(key&&!_gmap.fn.cache[id]){
                   _gmap.fn.cache[id] = {};
               }
               if(value){
                   _gmap.fn.cache[id][key] = value;
               }
               return key ? _gmap.fn.cache[id][key] : id;
           },
           removeDate:function(elem,key){
               if(!elem){
                   return;
               }
               var id = elem[expando];
               if(key){
                   if(_gmap.fn.cache[id]){
                       delete _gmap.fn.cache[id][key];
                       key = "";
                       for(key in _gmap.fn.cache[id]){
                           break;
                       }
                       if(!key){
                           this.removeDate(elem,key);
                       }
                   }
               }else{
                   try{
                       delete elem[expando];
                   }catch(e){
                       elem.removeAttribute(expando);
                   }
                   delete _gmap.fn.cache[id];
               }
           },
           each:function(array,fn){
               var i = 0,l = array.length;
               for(;i<l;i++){
                   fn.call(array[i],i,array[i]);
               }
           }
       }
   }
    function gmap(options){
        var that  = this;
        this.moveOptions = {
            markerArray:[],
            infoWindowArray:[],
            infoBubbleArray:[]
        };
        //
        this.loadStatus = false;
        /*
         target:"",//HTMLElement;
         center:"39.9388838,116.3974589",//default in beijing
         zoom:8,
         draggable:true,
         draggableCursor:"auto",
         keyboardShortcuts:true,
         mapMaker:false,
         mapTypeId:google.maps.MapTypeId.ROADMAP,
         maxZoom:"",
         minZoom:"",
         overviewMapControl:true,
         panControl:true,
         rotateControl:true,
         scaleControl:true,
         scrollwheel:true,
         streetViewControl:true,
         styles:[],
         tilt:0,
         zoomControl:true,
         success:function(){}
         *
         * **/
        var defaults = {
            url:"http://maps.google.cn/maps/api/js",
            test:false,
            version:"3.exp",
            key:"",
            libraries:"places",
            success:function(){},
            sensor:false
        };
        var options = options || {};
        options  = _gmap.fn.extendMine(defaults,options);
        if(options.target&&options.center&&options.zoom){
            if("google" in window){
                that.moveOptions.mapName  = _gmap.fn.common.createMap(options);
                _gmap.fn.data(options.target,namespace.mapName,that.moveOptions.mapName);
                if(that.onMapLoad){
                    that.onMapLoad.call(that,that.moveOptions.mapName);
                }
                if(options.success){
                    options.success.call(that,that.moveOptions.mapName);
                }
                that.loadStatus = true;
            }else{
                var createMap = googleMap(options);
                createMap.requireJs(function(arg){
                    that.moveOptions.mapName  = _gmap.fn.common.createMap(options);
                    _gmap.fn.data(arg,namespace.mapName,that.moveOptions.mapName);
                    if(that.onMapLoad){
                        that.onMapLoad.call(that,that.moveOptions.mapName);
                    }
                    if(options.success){
                        options.success.call(that,that.moveOptions.mapName);
                    }
                    that.loadStatus = true;
                },options.target);
            }
        }
        this.moveOptions.options = options;
        this.moveOptions.target = options.target;
        //是否已经载入
        this.getLoadStatus = function(){
            return that.loadStatus;
        };
        //公共方法
        this.onMapLoad = function(mapname){

        }
        //设置中心点
        this.setCenter = function(string){
            var _this = this;
            var args = arguments[1] || "";
            if(string){
                try
                {
                    var geocoder = new google.maps.Geocoder;
                    geocoder.geocode({'address': string}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            var ln = results[0].geometry.location;
                            var stringCenter = ln.lat()+","+ln.lng();
                            var lag = _gmap.fn.common.makeGoogleLag(stringCenter);
                            _this.moveOptions.mapName.setCenter(lag);
                            _this.moveOptions.centerCoor = stringCenter;
                            if(args){
                                args.call(results,stringCenter);
                            }
                        } else {
                            //throw "No result";
                            args.call(results,"");
                        }
                    });
                }catch(e){

                }

            }
        }
        this.setZoom = function(number){
            this.moveOptions.mapName.setZoom(number);
        }
        this.version = "1.0.0";
        this.author = "zhangjinglin";
        this.getMap = function(){
            return this.moveOptions.mapName;
        }
        this.getTarget = function(){
            return this.moveOptions.target;
        }
        //坐标
        this.setMarker = function(markerArray){
            /*
             * each element of markerArray is:
             * position:{1231,12313}
             * icon:{
             *    url: 'images/beachflag.png',
             // This marker is 20 pixels wide by 32 pixels high.
             size: new google.maps.Size(20, 32),
             // The origin for this image is (0, 0).
             origin: new google.maps.Point(0, 0),
             // The anchor for this image is the base of the flagpole at (0, 32).
             anchor: new google.maps.Point(0, 32)

             }
             *shape:{
             coords: [1, 1, 1, 20, 18, 20, 18, 1],
             type: 'poly'
             }
             *title:"some text or html elements...",
             *zIndex:number,
             *draggable:false,
             *clickable:true,
             *cursor:default
             * label:"some description..."
             * success:function(){}
             * **/
            var i = 0;
            var mapname = this.moveOptions.mapName,
                target = this.moveOptions.target;
            var array = [];
            for(;i<markerArray.length;i++){
                var gmaplag = _gmap.fn.common.makeGoogleLag(markerArray[i].position);
                var options = {
                    position: gmaplag,
                    map: mapname
                };
                if(markerArray[i].icon){
                    options["icon"] = markerArray[i].icon;
                }
                if(markerArray[i].shape){
                    options["shape"] = markerArray[i].shape;
                }
                if(markerArray[i].title){
                    options["title"] = markerArray[i].title;
                }
                if(markerArray[i].zIndex){
                    options["zIndex"] = markerArray[i].zIndex;
                }
                if(markerArray[i].draggable){
                    options["draggable"] = markerArray[i].draggable;
                }
                if(markerArray[i].clickable){
                    options["clickable"] = markerArray[i].clickable;
                }
                if(markerArray[i].cursor){
                    options["cursor"] = markerArray[i].cursor;
                }
                if(markerArray[i].label){
                    options["label"] = markerArray[i].label;
                }
                var marker = new google.maps.Marker(options);
                array.push(marker);
                this.moveOptions.markerArray.push(marker);
                //call the recall
                if(markerArray[i].success){
                    markerArray[i].success.call(marker);
                }
            }
            _gmap.fn.data(target,namespace.mapMarkerArray,array);
            return array;
        }
        this.getMarker = function(){
            return this.moveOptions.markerArray;
        }
        this.setBounds = function(markersArray){
            //makers must be google map marker object
            var bounds = new google.maps.LatLngBounds();
            var markers = []
            if(markersArray){
                markers = markersArray;
            }else{
                markers = this.moveOptions.markerArray;
            }
            _gmap.fn.each(markers,function(i,n){
                bounds.extend(n.getPosition());
            })
            this.moveOptions.mapName.fitBounds(bounds);
            //this.moveOptions.mapName.setCenter(bounds.getCenter());
            this.moveOptions.mapName.panToBounds(bounds);

        }
        //
        this.removeMarker = function(markerArray){
            var newmarkerArray = markerArray || this.moveOptions.markerArray ||[];
            var i = 0;
            for(;i<newmarkerArray.length;i++){
                newmarkerArray[i].setMap(null);
                _gmap.fn.each(_markEvent,function(m,q){
                    google.maps.event.clearListeners(newmarkerArray[i], q);
                })

            }
            if(!markerArray){

                this.moveOptions.markerArray = [];
            }

        }
        //
        this.getConfig = function(){
            return this.moveOptions.options;
        }
        //
        this.clear = function(){
            var _this = this;
            if(_this.moveOptions.markerArray){
                _this.removeMarker();
            }
            if(_this.moveOptions.infoWindowArray.length>0){
                _this.removeInfo();
            }
            if(_this.moveOptions.infoBubbleArray.length>0){
                _this.removeInfoBubble();
            }
            if(_this.moveOptions.polylinesName){
                _this.clearPolylines();
            }

        },
        this.direction = function(options){
            var _this = this;
            if("google" in window){
                requireDirection.call(_this,options);
            }else{
                var createMap = googleMap({});
                createMap.requireJs(function(arg){
                    requireDirection.call(_this,options);
                });
                this.moveOptions.loadGoole = true;
            }

        }
        function requireDirection(options){
            var _this = this;
            var directionsDisplay = new google.maps.DirectionsRenderer,
                directionsService = new google.maps.DirectionsService;
            directionsDisplay.setMap(this.moveOptions.mapName);
            this.moveOptions.directionsDisplay = directionsDisplay;
            this.moveOptions.directionsService = directionsService;
            //
            var defaults = {
                origin:"",//required
                destination:"",//required
                travelMode:"",//required
                avoidFerries:"",
                avoidHighways:"",
                avoidTolls:"",
                durationInTraffic:"",
                optimizeWaypoints:"",
                provideRouteAlternatives:"",
                unitSystem:google.maps.UnitSystem.METRIC,//google.maps.UnitSystem.IMPERIAL
                waypoints:"",
                autoDraw:true,
                success:function(){}
            }
            var options = _gmap.fn.extendMine(defaults,options);
            _this.options = options;
            if(!directionsDisplay){
                throw"'DirectionsRenderer' load failed ,you must load function of 'Direction' first ";
            }
            if(!directionsService){
                throw"'directionsService' load failed,you must load function of 'Direction' first ";
            }
            if(!options.origin){
                throw "you must set the origin!";
                return;
            }
            if(!options.destination){
                throw "you must set the destination!";
                return;
            }
            if(!options.travelMode){
                throw "you must set the travelMode,include:\"driving,bicycling,transit,walking\"!";
                return;
            }
            var travelModeUp = options.travelMode.toUpperCase();
            options.travelMode = google.maps.TravelMode[travelModeUp];
            options.origin = _gmap.fn.common.makeGoogleLag(options.origin);
            options.destination = _gmap.fn.common.makeGoogleLag(options.destination);
            if(options.suppressMarkers === true || options.suppressMarkers === false){
                //register direction styles
                directionsDisplay.setOptions({
                    suppressMarkers:options.suppressMarkers
                });
            }
            if(options.strokeColor){
                //register direction styles
                directionsDisplay.setOptions({
                    polylineOptions:{
                        strokeColor:options.strokeColor
                    }
                });
            }
            var newOptions = {
                origin:options.origin ,//required
                destination:options.destination,//required
                travelMode:options.travelMode,//required
                provideRouteAlternatives:true
            };
            if(options.avoidFerries){
                newOptions.avoidFerries = options.avoidFerries;
            }
            if(options.avoidHighways){
                newOptions.avoidHighways = options.avoidHighways;
            }
            if(options.avoidTolls){
                newOptions.avoidTolls = options.avoidTolls;
            }
            if(options.durationInTraffic){
                newOptions.durationInTraffic = options.durationInTraffic;
            }
            if(options.optimizeWaypoints){
                newOptions.optimizeWaypoints = options.optimizeWaypoints;
            }
            if(options.provideRouteAlternatives){
                newOptions.provideRouteAlternatives = options.provideRouteAlternatives;
            }
            if(options.waypoints){
                newOptions.waypoints = options.waypoints;
            }
            newOptions.unitSystem = options.unitSystem;
            //draw the line by directionsService request and put on the area by directionsDisplay

            directionsService.route(newOptions,function(response,status){
                if (status == google.maps.DirectionsStatus.OK) {
                    if(_this.options.autoDraw){
                        directionsDisplay.setDirections(response);
                    }
                    if(!_this.moveOptions.response){
                        _this.moveOptions.response = response;
                    }
                    //route detail information
                    var routes = response.routes;
                    var routeArray = [];
                    _gmap.fn.each(routes, function (i, n) {
                        var stepArray = [];
                        _gmap.fn.each(n.legs[0].steps, function (m, q) {
                            stepArray.push(q.instructions);
                        });
                        var jsonObject = {
                            duration:n.legs[0].duration.text,
                            distance:n.legs[0].distance.text,
                            step:stepArray,
                            route:n,
                            type:newOptions.travelMode

                        }
                        routeArray.push(jsonObject);
                    });
                    //
                    _this.moveOptions.directionsInformation = routeArray;
                    options.success.call(this,_this.moveOptions.directionsInformation);
                } else {
                    throw "Directions request failed due to"+ status;
                }
            });
            //

        }
        this.getDirectionDisplay = function(){
            return this.moveOptions.directionsDisplay;
        }
        this.getDirectionsService = function(){
            return this.moveOptions.directionsService;
        }
        this.getDirectionResponse = function(){
            return this.moveOptions.response;
        }
        //
        this.setInfo = function(options){
            var that = this;
            /**
             * content:string or html element,
             * maxWidth:0~999,
             * pixelOffset:1~10,
             * position:"45,45",
             * zIndex:1~10
             * marker:markerobject
             * clickShow:true
             * clickEvent:"click"
             * success:fn --infowindow,mapname,marker
             *
             * ***/
            var clickShow = true;
            var clickEvent = "click";
            var clickFn = function(){};
            var defaults = {
            };
            if(options.content){
                defaults["content"] = options.content;
            }
            if(options.maxWidth){
                defaults["maxWidth"] = options.maxWidth;
            }
            if(options.pixelOffset){
                defaults["pixelOffset"] = options.pixelOffset;
            }
            if(options.position){
                defaults["position"] = _gmap.fn.common.makeGoogleLag(options.position);
            }
            if(options.zIndex){
                defaults["zIndex"] = options.zIndex;
            }
            if(options.clickShow){
                clickShow = options.clickShow;
            }
            if(options.clickEvent){
                clickEvent = options.clickEvent;
            }
            if(options.clickFn){
                clickFn = options.clickFn;
            }


            var infowindow = new google.maps.InfoWindow(defaults);
            if(!options.position&&!clickShow){
                infowindow.open(that.moveOptions.mapName,options.marker);
            }else{
                options.marker.addListener(clickEvent,function(){
                    clickFn.call(options.marker,that.moveOptions.mapName);
                    infowindow.open(that.moveOptions.mapName,options.marker);
                },false)
            }
            if(options.success){
                options.success.call(this,infowindow,that.moveOptions.mapName,options.marker);
            }
            that.moveOptions.infoWindowArray.push(infowindow);
            return infowindow;

        }
        this.getInfo = function(){
            return this.moveOptions.infoWindowArray;
        }
        this.removeInfo = function(infoObject){
            if(infoObject){
                infoObject.close()
            }else{
                _gmap.fn.each(this.moveOptions.infoWindowArray,function(i,n){
                    n.close();
                })
                this.moveOptions.infoWindowArray = [];
            }
        }
        //
        this.autoSearch = function(elem){
            if(!elem){
                throw "search area must be an elementHtml,better is input";
                return false;
            }
            new google.maps.places.Autocomplete(elem);
        }
        this.infoBubble = function(html,markArray,fn){
            var _this = this;
            var markArrays = arguments[1];
            var mark = _this.moveOptions.markerArray || [];
            var markFc = fn || function(){};
            var html = html || "";
            if(!html){
                throw "HTML elements required!";
                return;
            }
            if(gmap_toString.call(markArrays) === "[object Function]"){
                markFc = markArrays;
            }
            if(gmap_toString.call(markArrays) === "[object Array]"){
                mark = markArrays
            }
            if("InfoBubble" in window){
                loadinfor();
            }else{
                var re = googleMap();
                var src = baseUrl + "plugin/infobubble.js";
                re.requirePlugin(src,function(){
                    loadinfor();
                });

            }
            function loadinfor(){
                //
                _gmap.fn.each(mark,function(i,n){
                    var markObj = n;
                    //
                    google.maps.event.addListener(markObj, 'mouseup', function(){
                        _re();
                        var infoBubble = new InfoBubble({
                            map: _this.moveOptions.mapName,
                            content: html,
                            shadowStyle: 1,
                            padding: 0,
                            backgroundColor: '#f3f5f6',
                            borderRadius: 5,
                            arrowSize: 10,
                            borderWidth: 1,
                            borderColor: '#8f9aac',
                            disableAutoPan: false,
                            hideCloseButton: true,
                            arrowPosition: 30,
                            arrowStyle: 1
                        });
                        infoBubble.open(_this.moveOptions.mapName,markObj);
                        _this.moveOptions.infoBubbleArray.push(infoBubble);
                    });

                })
                google.maps.event.addListener(_this.moveOptions.mapName, 'mouseup', function(){
                    _re();
                });

                //
                function _re(){
                    if(_this.moveOptions.infoBubbleArray.length>0){
                        _gmap.fn.each(_this.moveOptions.infoBubbleArray,function(i,n){
                            this.close();
                        })
                        _this.moveOptions.infoBubbleArray = [];
                    }
                }
                markFc.call(this);
            }



        };
        this.setInfoBubble = function(options){
            var defaults = {
                html:"",//required
                mark:{},//required
                arrowStyle:3,
                borderRadius:0,
                borderWidth:1,
                borderColor:"#000000",
                padding:0,
                arrowPosition:30,
                success:function(){}
            }
            var options = _gmap.fn.extend(defaults,options)
            var _this = this;
            var markSingle = options.mark;
            var markFc = options.success || function(){};
            var html = options.html || "";
            if(!html){
                throw "HTML elements required!";
                return;
            }
            if("InfoBubble" in window){
                return loadinfor();
            }else{
                var re = googleMap();
                var src = baseUrl + "plugin/infobubble.js";
                re.requirePlugin(src,function(){
                    return loadinfor();
                });

            }
            //
            function loadinfor(){
                var infoBubble = new InfoBubble({
                    map: _this.moveOptions.mapName,
                    content: html,
                    shadowStyle: 1,
                    padding: options.padding,
                    backgroundColor: '#f3f5f6',
                    borderRadius: options.borderRadius,
                    arrowSize: 10,
                    borderWidth: options.borderWidth,
                    borderColor: options.borderColor,
                    disableAutoPan: false,
                    hideCloseButton: true,
                    arrowPosition: options.arrowPosition,
                    arrowStyle: options.arrowStyle
                });
                infoBubble.open(_this.moveOptions.mapName,markSingle);
                _this.moveOptions.infoBubbleArray.push(infoBubble);
                markFc.call(this,infoBubble,_this.moveOptions.mapName,markSingle);
                return infoBubble;
            }
        }
        this.getInfoBubble = function(){
            return this.moveOptions.infoBubbleArray;
        }
        this.removeInfoBubble = function(infoBubble){
            if(infoBubble){
                infoBubble.close();
            }else{
                $.each(this.moveOptions.infoBubbleArray,function(i,n){
                    n.close();
                })
                this.moveOptions.infoBubbleArray = [];
            }
        }
        //
        this.polylines = function(options){
            var _this = this;
            var defaults = {
                path: [],
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map:_this.moveOptions.mapName
            }
            var options = _gmap.fn.extendMine(defaults,options);
            //
            var path = [];
            for(var t = 0; t<options.path.length; t++){
                var n = options.path[t];
                var lang = _gmap.fn.common.makeGoogleLag(n);
                path.push(lang);
            }


            options.path = path;
            var flightPath = new google.maps.Polyline(options);
            _this.moveOptions.polylinesName = flightPath;
            return flightPath;
        }
        this.getPolyLines = function(){
            return this.moveOptions.polylinesName;
        }
        this.clearPolylines = function(){
            if(this.moveOptions.polylinesName){
                this.moveOptions.polylinesName.setMap(null);
                this.moveOptions.polylinesName = "";
            }
        }
        //
        this.print = function(elem,title){
            var _this = this;
            if("html2canvas" in window){
                printDitu(elem,title);
            }else{
                var re = googleMap();
                var src = baseUrl + "plugin/html2canvas/build/html2canvas.js";
                re.requirePlugin(src,function(){
                    printDitu(elem,title);
                });

            }
            function printDitu(element,title){
                var element = element || _this.moveOptions.options.target;
                var title = title || "打印地图"
                if(!element){
                    return false;
                }
                //
                var newWindow = window.open();
                newWindow.document.write("<html><head><title>title</title>");
                var links = document.querySelectorAll("link");
                for(var i = 0;i<links.length;i++){
                    if(links[i].getAttribute("rel") == "stylesheet"){
                        newWindow.document.write(links[i].outerHTML);
                    }
                }

                newWindow.document.write("<style>@media print{@page{size:landscape}*{box-shadow:none!important;}}</style></head><body><div id=\"mapWarp\"></div></body></html>");
                var $body = newWindow.document.body,
                    $warpMap = newWindow.document.querySelector("#mapWarp");
                $warpMap.style.width = element.offsetWidth;
                $warpMap.style.height = element.offsetHeight;
                //

                html2canvas(element, {
                    useCORS: true,
                    onrendered: function(canvas) {
                        //console.log(canvas.toDataURL("image/png"));
                        $warpMap.innerHTML = "<img src=\""+ canvas.toDataURL("image/png")+"\" />";
                        newWindow.print();
                        setTimeout(function(){
                            //延迟关闭,因为safari一些浏览器无法即使渲染无法预览的问题
                            newWindow.close();
                        },1000)
                    }
                });
                //html2canvas(element).then(function(canvas) {
                //    $warpMap.appendChild(canvas);
                //    newWindow.print();
                //    newWindow.close();
                //});

            }
        }
        this.dymPrint = function(elem){
            var _this = this;
            var $content = this.moveOptions.options.target;
            var newWindow = window.open();
            newWindow.document.write("<html><head><title>Map</title>");
            var links = document.querySelectorAll("link");
            for(var i = 0;i<links.length;i++){
                if(links[i].getAttribute("rel") == "stylesheet"){
                    newWindow.document.write(links[i].outerHTML);
                }
            }

            newWindow.document.write("<style>@media print{@page{size:landscape}*{box-shadow:none!important;}}</style></head><body><div id=\"mapWarp\"></div></body></html>");
            var $body = newWindow.document.body,
                $warpMap = newWindow.document.querySelector("#mapWarp");
            $warpMap.style.width = $content.offsetWidth;
            $warpMap.style.height = $content.offsetHeight;
            //
            var mapname = this.getMap();
            var center =this.getCenter();
            var pmap = gmap({
                target              : $warpMap,
                zoom			    : mapname.getZoom(),
                center			    : center,
                mapTypeId		    : mapname.getMapTypeId(),
                mapTypeControl	    : false,
                zoomControl         : false,
                scaleControl        : false,
                panControl          : false,
                overviewMapControl  : false,
                streetViewControl   : false,
                scrollwheel         : false,
                success:function(){
                    var markers = _this.getMarker();
                    var infoBubbles = _this.getInfoBubble();
                    var polyLines = _this.getPolyLines();
                    var infos = _this.getInfo();
                    var directionDisplay = this.getDirectionDisplay();
                    if(markers.length>0){
                        markers.forEach(function(marker){
                            marker.setMap(pmap.getMap())
                        })
                    }
                    //
                    if(infoBubbles.length>0){
                        infoBubbles.forEach(function(infoBubble){
                            infoBubble["infoBubble"].open(pmap.getMap(),infoBubble["marker"]);
                        })
                    }
                    //
                    if(polyLines){
                        polyLines.setMap(pmap.getMap())
                    }
                    //
                    if(infos.length>0){
                        infos.forEach(function(info){
                            info["infoWindow"].open(pmap.getMap(),info["marker"]);
                        })
                    }
                    //
                    if(directionDisplay){
                        var result =directionDisplay.getDirections();
                        directionDisplay.setMap(pmap.getMap());
                        directionDisplay.setDirections(result);
                    }
                    //
                }
            })
        }
        return this;
    }
   /*google map common methods*/
    _gmap.fn.common = {
        createMap:function(options){
            var defaults = {
                target:"",//HTMLElement;
                center:"39.9388838,116.3974589",//default in beijing
                zoom:8,
                draggable:true,
                draggableCursor:"auto",
                keyboardShortcuts:true,
                mapMaker:false,
                mapTypeId:google.maps.MapTypeId.ROADMAP,
                maxZoom:"",
                minZoom:"",
                overviewMapControl:true,
                panControl:true,
                rotateControl:true,
                scaleControl:true,
                scrollwheel:true,
                streetViewControl:true,
                styles:[],
                tilt:0,
                zoomControl:true
            };
            var options = options || {};
            options = _gmap.fn.extendMine(defaults,options);
            if(typeof(options.zoom) == "string"){
                options.zoom = parseInt(options.zoom);
            }
            if(options.target.length == 0){
                throw "the selector element is empty";
                return false;
            }
            var mapName = new google.maps.Map(options.target,{
                center:_gmap.fn.common.makeGoogleLag(options.center),
                zoom:options.zoom,
                draggable:options.draggable,
                draggableCursor:options.draggableCursor,
                keyboardShortcuts:options.keyboardShortcuts,
                mapTypeId:options.mapTypeId,
                maxZoom:options.maxZoom,
                minZoom:options.minZoom,
                overviewMapControl:options.overviewMapControl,
                panControl:options.panControl,
                rotateControl:options.rotateControl,
                scaleControl:options.scaleControl,
                scrollwheel:options.scrollwheel,
                streetViewControl:options.streetViewControl,
                styles:options.styles,
                tilt:options.tilt,
                zoomControl:options.zoomControl

            });
            //
            return mapName;

        },
        makeGoogleLag:function(stringLag){
            var stringLag = stringLag || "",
                stringLag = stringLag.split(",");
            if(!stringLag){
                throw "this lag or lng is not string";
                return;
            }
            var lat = parseFloat(stringLag[0]) || "",
                lng = parseFloat(stringLag[1]) || "";
            return{lat:lat,lng:lng};
        }
    }
   /**/
    //
    _gmap.fn.each(con,function(m,q){
        var src = baseUrl + q;
        required(src,function(){});
    })
    //
    var loadFirst = false;
    var loadEvent = [];
    //google map request
    function googleMap(options){
        var defaults = {
            url:"http://maps.google.cn/maps/api/js",
            test:false,
            version:"3.exp",
            key:"",
            libraries:"places",
            success:function(){},
            sensor:false
        }
        var options = _gmap.fn.extendMine(defaults,options);
        return {
            requireJs:function(fn,arg){
                loadEvent.push({"fn":fn,"arg":arg});
                if(loadFirst){
                    return false;
                }
                //create javascript dom element
                //you must recallback google map api
                window.recallback = function(){
                    while(loadEvent.length>0){
                        var shift = loadEvent.shift();
                        shift.fn.call(this,shift.arg);
                    }
                }
                //
                var url = options.url;
                if(options.version){
                    url += "?v=" + options.version + "&"
                }
                if(options.key){
                    url += "key=" + options.key + "&"
                }
                if(options.libraries){
                    url += "libraries=" + options.libraries + "&"
                }

                url += "sensor=" + options.sensor;
                url += "&callback=recallback"

                var eldom = document.createElement("script");
                eldom.type = "text/javascript";
                eldom.loaded = false;
                eldom.src = url;
                //
                //eldom.onload = function(){
                //	eldom.loaded = true;
                //   fn.call(this,arg);
                //	eldom.onload = eldom.onreadystatechange = null;
                //}
                //ie fix
                //eldom.onreadystatechange = function(){
                //	if((eldom.readyState === "loaded" || eldom.readyState === "complete")&&!eldom.loaded){
                //		fn.call(this,arg);
                //		eldom.onload = eldom.onreadystatechange = null;
                //	}
                //}
                document.getElementsByTagName("head")[0].appendChild(eldom);
                loadFirst = true;
            },
            requirePlugin:function(src,fn){
                required(src,fn);
            },
            register:function(){

            }

        }
    }
    //
    function required(src,fn){
        var eldom = document.createElement("script");
        eldom.type = "text/javascript";
        eldom.loaded = false;
        eldom.src = src;
        //
        eldom.onload = function(){
            eldom.loaded = true;
            fn.call(this);
            eldom.onload = eldom.onreadystatechange = null;
        }
        eldom.onreadystatechange = function(){
            if((eldom.readyState === "loaded" || eldom.readyState === "complete")&&!eldom.loaded){
                fn.call(this);
                eldom.onload = eldom.onreadystatechange = null;
            }
        }
        document.getElementsByTagName("head")[0].appendChild(eldom);
    }
    //
    window.gmap = gmap;
})( window );
