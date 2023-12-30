/*!
=========================================================
* HistoJS Demo - v1.0.0
=========================================================

* Github:  https://github.com/Mmasoud1
* Description:  A user interface for whole slide image channel design and analysis. 
*               It is based on DSA as backbone server
* 
*
* @author Mohamed Masoud <mmasoud2@outlook.com>

=========================================================



=========================================================
                      Design Mode
=========================================================*/


(function(){
   // "use strict";

  //-- Utilites --//

  /**
   * Search any dict or array e.g. Settings.dsaServers.
   *
   * @since 1.0.0
   * @param {Array} array|array of objects e.g. [{key1: val1, key2: val2, ..}, {}]
   * @param {String} key 
   * @param {number| String} value  
   * @param {String} returnType  i.e.  DATA or INDEX
   * @returns {object | number} 
   * @example
   *
   * dict = [{id: "1", value: "Girder", hostAPI: "http://dermannotator.org:8080/api/v1" },
             {id: "2", value: "Styx", hostAPI: "https://styx.neurology.emory.edu/girder/api/v1/"}]
   *
   * findObjectByKeyValue( dict, 'id', "2");
   * // => Object { id: "2", value: "Styx", hostAPI: "https://styx.neurology.emory.edu/girder/api/v1/" }
   *
   *
   * findObjectByKeyValue( dict, 'id', "2", 'INDEX');
   * // => 1
   *
   */ 

    findObjectByKeyValue = (array, key, value, returnType='DATA') => {   
        const obj = array.filter( entry => entry[key] === value)[0];
        return obj ? ( returnType === 'DATA' ? obj : ( returnType === 'INDEX' ? array.indexOf(obj) : null )) : null;
    }    

     
  /**
   * Remove element or record from array
   *
   * @since 1.0.0
   * @category Array
   * @param {Array} array The array to process.
   * @param {*} element The value to inspect and remove.
   * @returns {Array} 
   * @example
   *
   * removeArrayElem(['a', 'b', 'c', 'd'], 'c')
   * // => ['a', 'b', 'd']
   *
   */    

    removeArrayElem = (array, element) => { 
        const index = array.indexOf(element);
        if(index >= 0 ) {
            array.splice(index, 1);
        }
    }


 /**
   * Insert element or record into array at specific index
   *
   * @since 1.0.0
   * @category Array
   * @param {Array} array- The array to process.
   * @param {*} element- The value to insert.
   * @param {number} index- The element position to insert in.   
   * @returns {Array} 
   * @example
   *
   * insertArrayElem(['b', 'c', 'd'], 'a', 0)
   * // => ['a', 'b', 'c', 'd']
   *
   */  

    insertArrayElem = (array, element, index) => { 
          array.splice(index, 0, element);
    }


/**
   * Set all object values (e.g. currentItemInfo) to certain value (e.g null, true, "") 
   *
   * @since 1.0.0
   * @param {object} 
   * @param {*} element- The value to insert.
   * @returns {object} 
   * @example
   *
   * setObjectValues({id: "1", value: "val1"}, null)
   * // =>  Object { id: null, value: null }
   *
   */ 

    setObjectValues = (obj, val) => {
       Object.keys(obj).forEach(key => obj[key] = val);
    }

  
  /**
   * Merge two arrays of objects by common key e.g. allTileFeatures and  cellBasicClassification
   *
   * @since 1.0.0
   * @category Array
   * @param {string} objKey- The object key to match both arrays e.g. "id".
   * @param {Array} arrOfObj1 - The first array of objects to be merged.
   * @returns {Array} arrOfObj2 - The second array of objects to be merged.
   * @example
   *
   * mergeArrayOfObjByKey( "id", [ {id:"spx-1", Type:"Tumor"}, 
   *                               {id:"spx-7", Type:"Immune"} ], 
   *                                                            [{id : "spx-1", area: 250,  solidity: 0.95}, 
   *                                                             {id : "spx-3", area: 150,  solidity: 0.85}, 
   *                                                             {id : "spx-7", area: 100,  solidity: 0.80} ])
   * // => [{ id: "spx-1", Type:"Tumor", area: 250, solidity: 0.95 }, 
   *        { id: "spx-7", Type: "immune", area: 100, solidity: 0.80 }]
   *
   */ 

    mergeArrayOfObjByKey = (objKey, arrOfObj1, arrOfObj2) => {
        let largerArrayOfObjs, smallerArrayOfObjs;

        if( arrOfObj1.length < arrOfObj2.length) {
            largerArrayOfObjs = arrOfObj2;
            smallerArrayOfObjs = arrOfObj1;
        } else {
            largerArrayOfObjs = arrOfObj1;
            smallerArrayOfObjs = arrOfObj2;            
        }

        //create hash for the larger array
        let largerArrHashByKey = {};

        largerArrayOfObjs.forEach((object, idx) => { 
             largerArrHashByKey[ object[objKey] ] = object; 
        });     

        // Merge both arrays of objects
        let mergedArrayOfObjs = [];

        smallerArrayOfObjs.forEach((object, idx) => { 
           mergedArrayOfObjs.push({ ...object, ...largerArrHashByKey[ object[objKey] ]});
        });   

        return     mergedArrayOfObjs; 
    }

  /**
   * Convert array of objects to object with hashing key  
   *
   * @since 1.0.0
   * @category Array
   * @param {string} hashKey- The object key to use as hash e.g. "id".
   * @param {Array} arrayOfObjs - The array of objects to be converted.
   * @returns {object} convertedObject
   * @example
   *
   * array2ObjWithHashKey( "id", [ {id:"spx-1", Type:"Tumor"}, 
   *                               {id:"spx-7", Type:"Immune"} ])
   *
   * // => Object { "spx-1": {id: "spx-1", Type: "Tumor"}, "spx-7": {id: "spx-7", Type: "Immune"} }
   */ 

    array2ObjWithHashKey = (hashKey, arrayOfObjs) => {
        if(Object.keys(arrayOfObjs).length) {
            //create hash folarger arrayr the 
            let convertedObject = {};

            arrayOfObjs.forEach((object, idx) => { 
                 convertedObject[ object[hashKey] ] = object; 
            });  

            return   convertedObject;  
        } else {
            triggerHint("Not a valid array of objects .. ") 
            return null; 
        }          
    }


  /**
   * Find unique values of array and return as new array. This is helpful for heatmapColor scale function  
   *
   * @since 1.0.0
   * @category Array
   * @param {Array} array - The array of values.
   * @returns {Array} array of unique values
   * @example
   *
   * arrayUniqueValues( [1, 1, 2, 3, 2, 5])
   *
   * // => [1, 2, 3, 5]
   */ 

    arrayUniqueValues = (array) => {

        return array.filter((value, index, self) => {
          return self.indexOf(value) === index;
        });     
        
    }


  /**
   * Fast arrays concatenation 
   *
   * @since 1.0.0
   * @category Array
   * @param {Array} array1 - The array of values.
   * @param {Array} array2 - The array of values.
   * @returns {Array} array of concatenation
   * @example
   *
   * fastArraysConcat( [1, 1, 2, 3], [5, 2, 5])
   *
   * // => [1, 1, 2, 3, 5, 2, 5]
   */ 

    fastArraysConcat = (array1, array2) => {
        return [...array1, ... array2];
    }


  /**
   * Find  if two arrays are identical. 
   *
   * @since 1.0.0
   * @category Array
   * @param {Array} array1 - The array of values.
   * @param {Array} array2 - The array of values.   
   * @returns {boolean} 
   * @example
   *
   * areArraysEquals( [1, 1, 2, 3], [1, 1, 2, 5])
   *
   * // => false
   */ 

    areArraysEquals = (array1, array2) => {
        return JSON.stringify(array1) === JSON.stringify(array2) ? true : false;
    }



  /**
   * Partion array into number of  chunks
   * This is useful for progress bar to show
   *
   * @since 1.0.0
   * @category Array
   * @param {Array} array  - The array of values.
   * @param {number} numOfchunks - The number of chunks.   
   * @returns {Array} 
   * @example
   *
   * chunkArray( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 3 )
   *
   * // => [ [ 1, 2, 3, 4, 5, 6 ], [ 7, 8, 9, 10, 11, 12 ], [ 13, 14, 15, 16, 17 ] ]
   */ 

 chunkArray = (array, numOfchunks) => {
    
    if (numOfchunks <= 1) {
        return [array];
    }

    if (numOfchunks > array.length) {
        console.assert(numOfchunks > array.length, {chunks:numOfchunks, errorMsg: " Number of chuncks > array length "})
        return null;
    }

    let arrayOfChunks = [];
    let chunkSize;
    let index = 0;

    if (array.length % numOfchunks === 0) {
        chunkSize = Math.floor(array.length / numOfchunks);
        while (index < array.length) {
            arrayOfChunks.push(array.slice(index, index += chunkSize));
        }

    } else  {
        while (index < array.length) {
            chunkSize = Math.ceil((array.length - index) / numOfchunks--);
            arrayOfChunks.push(array.slice(index, index += chunkSize));
        }
    }

    return arrayOfChunks;
}


/**
* Function to use with checking output file name, it must start with letter a-z or A-Z
*
* @since 1.0.0
* @param {*} ch - character to check
* @returns {boolean} Returns - true or false
* @example
*
* isLetter(3)
* // => false
*
* isLetter("A")
* // => true
*
* isLetter("$")
* // => false
*/
 
  isLetter = (ch) => {
      return (/[a-zA-Z]/).test(ch)
  }  

  
    ///////---------------------------------------///////

    /**
    * Give function name to be called
    * @since 1.0.0
    *
    */

    callFunctionByName = (funName, param) => { 
         return Array.isArray(param) ? window[funName].apply(null, param) : window[funName](param); 
    }   


    /**
    * Progress bar -- For future use 
    * @since 1.0.0
    *
    */    
    openProgressBar = () => {
        document.getElementById("progressBarDiv").style.display = 'block';
        document.getElementById("progressBarDiv").style.marginRight = "0vw";
        document.getElementById("progressBarDiv").style.width= "17vw";
    }   

    closeProgressBar = () => {
        // document.getElementById("progressBarDiv").style.marginRight= "-18vw";
        document.getElementById("progressBarDiv").style.display = 'none';
    }   

    testProgressBar = () => {
          let allBatches = new Array(1000);
          let index = 0;

          openProgressBar();

          let intervalId = window.setInterval(function() {

                          //-- code here 
                         
                          document.getElementById("progressBar").style.width=  (index+1)*100/allBatches.length + "%";                      

                          if( index == allBatches.length-1 ) {
                               window.clearInterval( intervalId );
                               document.getElementById("progressBar").style.width = 0;  

                               //-- remain code till the end of original function 
                               closeProgressBar();
                          }

                          index++;                      
                          
          }, 0);
    }   

    progressBarExample = () => {
          let arrayOfSomeValues = new Array(1000);
          let chunkIdx = 0;
          let allChunks = [];

          openProgressBar();

          let numOfPrgBarJumps = 5; 

          allChunks = chunkArray(arrayOfSomeValues, numOfPrgBarJumps);

          // if arrayOfSomeValues.length < numOfPrgBarJumps
          if(allChunks == null) {
            triggerHint("Progress bar settings are Invalid due to small data to partition, try please to decrease numOfPrgBarJumps");
            allChunks = [arrayOfSomeValues]; //So allChunks[0] is applicable
          }


          let intervalId = window.setInterval(function() {

                          // process(allChunks[chunkIdx])
                         
                          document.getElementById("progressBar").style.width=  (chunkIdx+1)*100/allChunks.length + "%";                      

                          if( chunkIdx == allChunks.length-1 ) {
                               window.clearInterval( intervalId );
                               document.getElementById("progressBar").style.width = 0;  

                               // remain code till the end of original function 
                               closeProgressBar();
                          }

                          chunkIdx++;                      
                          
          }, 0);


    } 


    /**
    * hint message functions  
    * @since 1.0.0
    *
    */     

    openHint = () => {
        var defer = $.Deferred();

        if(document.getElementById("chartOperationSettings").innerHTML != "" ) {
           document.getElementById("hint").style.marginRight = "19vw";
        } else {
           document.getElementById("hint").style.marginRight = "0vw";
        }

        document.getElementById("hint").style.width= "17vw";
        // To close hint of number of events defined at Opts.numOfMouseEventToCloseHint
        // Opts.curMouseEventCount = 0;

        setTimeout(function() {
            defer.resolve(); // When this fires, the code in a().then(/..../); is executed.
        }, 100);  

        return defer; 

    }   

    /**
    * hint message function  
    * @since 1.0.0
    *
    */        

    closeHint = () => {
        document.getElementById("hint").style.marginRight= "-18vw";
        if(Opts.isHintCloseOnMouseEvent) {        
           Opts.isFirstClickEventAfterTrigger = true;
        }        
    }

    /**
    * hint message function  
    * @since 1.0.0
    *
    */        

    triggerHint = ( hintMessage = "", messageType = 'info', expire = Opts.defaultOpeningTime) => { // if expire = 0 means no time expiration. Open always. 
        
       switch(messageType) {
          case 'info':
          {
             document.getElementById("hintParagraph").innerHTML = '<i style="font-size:1.4vw"  class="fa fa-info-circle" ></i> <font style="font-size:0.77vw" >&nbsp&nbsp'+ hintMessage +' </font> '
             break;             
          }
          case 'error':
          {
             document.getElementById("hintParagraph").innerHTML = '<i style="font-size:1.4vw"  class="fa fa-exclamation-triangle" ></i> <font style="font-size:0.77vw" >&nbsp&nbsp'+ hintMessage +' </font> '
             break;             
          }          
       }

       openHint().then( result => {

           if(! Opts.isHintCloseOnMouseEvent) {
             if(Opts.isHintAutoClosable) {  
                setTimeout(() => { closeHint(); }, expire );           
             }
           }

       });

       // else {
                 
       //    document.getElementById("hintParagraph").innerHTML += '<a href="javascript:void(0)" onclick="closeHint()"><i style="font-size:0.7vw"  class="fa fa-chevron-circle-right" ></i></a>'
       // }


        // var defer = $.Deferred();
        // // Time out for defer to synch events such as showLoadingIcon to run after hint show up
        // setTimeout(function() {
        //     defer.resolve(); // When this fires, the code in a().then(/..../); is executed.
        // }, 100);

        // return defer;        
    }

    /**
    * hint message function  
    * @since 1.0.0
    *
    */    

    enforcedTriggerHint = ( hintMessage = "", messageType = 'info') => { 
       var defer = $.Deferred();

       switch(messageType) {
          case 'info':
          {
             document.getElementById("hintParagraph").innerHTML = '<i style="font-size:1.4vw"  class="fa fa-info-circle" ></i> <font style="font-size:0.77vw" >&nbsp&nbsp'+ hintMessage +' </font> '
             break;             
          }
          case 'error':
          {
             document.getElementById("hintParagraph").innerHTML = '<i style="font-size:1.4vw"  class="fa fa-exclamation-triangle" ></i> <font style="font-size:0.77vw" >&nbsp&nbsp'+ hintMessage +' </font> '
             break;             
          }          
       }

       openHint();

       setTimeout(function() {
            defer.resolve(); // When this fires, the code in a().then(/..../); is executed.
       }, 300);

       return defer;        
       
    }

    /**
    * hint message function  
    * @since 1.0.0
    *
    */        

    TriggerPermanentHint = ( hintMessage = "", messageType = 'info') => { 

       switch(messageType) {
          case 'info':
          {
             document.getElementById("hintParagraph").innerHTML = '<i style="font-size:1.4vw"  class="fa fa-info-circle" ></i> <font style="font-size:0.77vw" >&nbsp&nbsp'+ hintMessage +' </font> '
             break;             
          }
          case 'error':
          {
             document.getElementById("hintParagraph").innerHTML = '<i style="font-size:1.4vw"  class="fa fa-exclamation-triangle" ></i> <font style="font-size:0.77vw" >&nbsp&nbsp'+ hintMessage +' </font> '
             break;             
          }          
       }
       
       openHint();

       setTimeout(function() {
          console.log("open hint activated");
       }, 100);
       
       
    }



   /**
   * Function to use with checking Flask RestAPI availability
   *
   * @since 1.0.0
   * @returns {boolean} Returns - true or false
   *
   */    

   isRestApiAvailable = () =>{ // Check if Flask is running
      let response;
      try{
          webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort + "/appready", (result) => {
            response = JSON.parse(result)
          });
      } catch(err) {
             console.log("err.message :", err.message);
             triggerHint("Flask app not running", "error", 5000);
             response = false;
      } 

      return response ? true : false;
   }

   /**
   * Function to check if JS ES6 Version supported
   *
   * @since 1.0.0
   * @returns {boolean} Returns - true or false
   *
   */    

   isJsES6VerSupported = () =>{ 
      let response = true;
      try { 
             eval('"use strict"; class foo {};'); 

          } catch (err) { 
             console.log("err.message :", err.message);
             triggerHint("Current browser does not support JS ES6 version, for supported browsers please refer to https://caniuse.com/es6", "error", 10000);
             response = false;   
          }

      return response;
   }

   /**
   * Function to get screen width
   *
   * @since 1.0.0
   * @returns {number}  
   *
   */   
    getScreenWidth = () => {
        // return screen.availWidth; 
        return window.innerWidth; 
    }


   /**
   * Function to get screen width
   *
   * @since 1.0.0
   * @returns {number}  
   *
   */      
    getScreenHeight = () => {
        return screen.availHeight; 
        //-- return window.innerHeight;
    }


   /**
   * Function to get screen width ratio
   *
   * @since 1.0.0
   * @returns {number}  
   *
   */      

    getScreenWidthRatio = () => {
        return getScreenWidth()/screenStatus.bestScreenDim.availWidth; 
    }    


   /**
   * Function to get screen height ratio
   *
   * @since 1.0.0
   * @returns {number}  
   *
   */  
    getScreenHeightRatio = () => {
        return getScreenHeight()/screenStatus.bestScreenDim.availHeight; 
    }  


   /**
   * Function to get screen center
   *
   * @since 1.0.0
   * @returns {number}  
   *
   */  
    getScreenCenter = () => {
        return [screen.width/2, screen.height/2]; 
    }  


    /**
    * element center on screen  
    * @since 1.0.0
    *
    */    
    getElementCenterOnScreen = (el) => {
        elemCoord = el.getBoundingClientRect();
        el.style.marginLeft = (getScreenWidth() - elemCoord.width)/2 +"px";
        el.style.marginTop  = (getScreenHeight() - elemCoord.height)/3 +"px";
    }    

    /**
    * element on top middle of screen  
    * @since 1.0.0
    *
    */   
    getElementTopMiddleOnScreen = (el) => {
        elemCoord = el.getBoundingClientRect();
        el.style.marginLeft = (getScreenWidth() - elemCoord.width)/2 +"px";
        el.style.marginTop  = (getScreenHeight() - elemCoord.height)/6 +"px";
    }       


    /**
    * For style   
    * @since 1.0.0
    *
    */  
    getH = (height) => {
        return getScreenHeightRatio() * height; 
    }  


    /**
    * For style  
    * @since 1.0.0
    *
    */  
    getW = (width) => {
        return getScreenWidthRatio() * width; 
    }     


    /**
    * For style   
    * @since 1.0.0
    *
    */  
    getVW = (size) => {
        return size/20;
    } 


    /**
    * For future use 
    * @since 1.0.0
    *
    */  
    adjustScreenElementsDim = () => {
     // document.documentElement.style.setProperty('--div-font-color', 'red');
     // getComputedStyle(element).getPropertyValue("--my-var"); 
    }    


    /**
    * Screen Logo
    * @since 1.0.0
    *
    */     
    initScreenLogo = () => {
        let screenLogoElem = document.getElementById("screenLogoContainer");
        let nodes = "";

        nodes +=  '<div id="screenLogo" class="screen-logo animate__animated animate__zoomIn" >';
        nodes +=    '<img src="css/logo/HistoJS-logo.png"  alt="logo" width="40%" height="40%" />';
        nodes +=    '<h1 style="color: white; font-size: 2vw">HistoJS Demo</h1>';
        nodes +=    '<p class="lead" style="color: white; font-size: 0.9vw">';
        nodes +=        'A user interface for design and analysis highly multiplexed immunofluorescence images<br>';
        nodes +=        'It is based on DSA as backbone server.</p>';
        nodes +=  '</div>';

        screenLogoElem.innerHTML = nodes;
        getElementCenterOnScreen(screenLogoElem);
    }


    /**
    * Show Screen Logo
    * @since 1.0.0
    *
    */  
    showScreenLogo = () => {
        screenLogoElem =  document.getElementById("screenLogo");
        screenLogoElem.className = "screen-logo";
        screenLogoElem.style.display = 'block';
    }


    /**
    * Hide Screen Logo
    * @since 1.0.0
    *
    */     
    hideScreenLogo = () => {
         document.getElementById("screenLogo").style.display = "none";
    }

    /**
    * Check if Screen Logo is active
    * @since 1.0.0
    *
    */      

    isScreenLogoActiveOnScreen = () => {
         return document.getElementById("screenLogo") ? true : false;
    }


    /**
    * Remove Screen Logo
    * @since 1.0.0
    *
    */ 
    removeScreenLogo = () => {
        screenLogoElem =  document.getElementById("screenLogo");

        if(screenLogoElem) { // if it is not removed before 
           screenLogoElem.parentNode.removeChild(screenLogo);
        }      
    }


    //------ Left Channel Bar options ----------//

    /**
    * OpenSeaDragon zooming
    * @since 1.0.0
    *
    */     

    viewerZoomTo = (zoomValue) => {
         viewer.viewport.zoomTo( zoomValue);
    }   

    /**
    * OpenSeaDragon zooming
    * @since 1.0.0
    *
    */      

    viewerZoomIn = () => {
         var zoomValue = viewer.viewport.getZoom();

         if((zoomValue*2) < viewer.viewport.getMaxZoom()) {
            viewerZoomTo(zoomValue * 2);
         } else { 
            viewerZoomTo(viewer.viewport.getMaxZoom());             
         }   
    }

    /**
    * OpenSeaDragon zooming
    * @since 1.0.0
    *
    */     

    viewerZoomOut = () => {
         var zoomValue= viewer.viewport.getZoom();

         if((zoomValue / 2) > viewer.viewport.getMinZoom() ) {
            viewerZoomTo(zoomValue / 2);
         } else {
            viewerZoomTo( viewer.viewport.getMinZoom() );
         }
    }


    /**
    * OpenSeaDragon zooming
    * @since 1.0.0
    *
    */     

    viewerZoomHome = () => {
         viewerZoomTo( viewer.viewport.getHomeZoom() );
         viewer.viewport.panTo( viewer.viewport.getCenter() );
         // callback();
    }  


    /**
    * OpenSeaDragon zooming
    * @since 1.0.0
    *
    */ 

    initialZoom = () => {
         var zoomValue= viewer.viewport.getHomeZoom();

         if((zoomValue * 2) < viewer.viewport.getMaxZoom() ) {
            viewerZoomTo( zoomValue * 2 );
         } else { 
            viewerZoomTo( viewer.viewport.getMaxZoom() );
         }   
    }  

     // ----------- Info panel ----------- //

    /**
    * Post TileSource Info to right Info Panel 
    * @since 1.0.0
    *
    */     
    parseMetadataInfo = (tileInfo, itemBasicName, type = "ome" ) => {
        var nodes = "";
        var itemNameExt = type === "ome" ? "-OME Meta" : "-Meta" ;
        document.getElementById("infoTitle").innerHTML = '&nbsp&nbsp' + itemBasicName + itemNameExt;
        document.getElementById("imageInfoTitle").innerHTML = "Image Info:";
        document.getElementById("infoList").innerHTML = "";

        nodes +=    '<li >'+'Width :           '+ tileInfo.width                                             +'</li>'
                   +'<li >'+'Height :          '+ tileInfo.height                                            +'</li>'
                   +'<li >'+'MaxLevel :        '+ tileInfo.maxLevel                                          +'</li>'
                   +'<li >'+'TileSize :        '+ tileInfo.tileWidth                                         +'</li>'

        if(type === "ome") {                 
            nodes +=    '<li >'+'Num Channels :    '+ tileInfo.numChannels                                       +'</li>'                    
                       +'<li >'+'Num Groups :      '+ tileInfo.numGroups                                         +'</li>'  
                       +'<li >'+'Num Stories :     '+ tileInfo.numStories                                        +'</li>'
        }                                                                         
        document.getElementById("infoList").innerHTML += nodes;
        if(!screenStatus.infoPanelFirstEnter) {
             showPanel("infoPanel", true); 
             screenStatus.infoPanelFirstEnter =true;
        }     
    } 

    /**
    * Open selected item(e.g. tile) on DSA server 
    * @since 1.0.0
    *
    */ 
    goToRemoteItem = () => {
        var hostUrl = getHostUrl();
        var item = getSelectedItem();
        window.open(hostUrl + "/#item/" + item._id); 
    }


    /**
    * Create new group of channels in the design phase 
    * @since 1.0.0
    *
    */     
    createNewGroup = () => {
        if( !getActiveForm() ) {
            if(tempSceneSelections.length) {
              document.getElementById("grpName").value  = suggestNewGrplabel(tempSceneSelections); 
              var grpForm = document.getElementById("grpLabelForm");
              grpForm.classList.remove("formflashanimation");
              grpForm.style.display = "block";
              getElementCenterOnScreen(grpForm);
              setActiveForm(grpForm);
            }else {
                  triggerHint("Please select channels");
            }
       }else {
             getActiveForm().classList.toggle("formflashanimation"); 
       } 
    }


    /**
    * Reset selected channels variable
    * @since 1.0.0
    *
    */   
    resetTempSceneSelections = () => {
        tempSceneSelections = [];      
    }


    /**
    * Reset channel checkboxes function 
    * @since 1.0.0
    *
    */      

    resetChannelCheckboxes = () => {
        resetTempSceneSelections();
        var allCheckbox = document.getElementsByClassName("channelCheckboxClass");

        for (let i = 0; i < allCheckbox.length; i++) {
             allCheckbox[i].innerHTML = '<i class="fa fa-square" >&nbsp&nbsp</i>';
        }
    }

   // ----------- right channel bar labeling ------- //

    /**
    * Refine channel name
    * @since 1.0.0
    *
    */      
   refineChannelName = (channelName) => {
      var refinedLabel = channelName;

      if(channelName.includes(" ")) {
          if(channelName.split(" ")[1].length > 2) {
            if (!channelName.split(" ")[1].slice(0,1).match(/\d+/g)) { //Is first char after white space not integer
                   refinedLabel = channelName.split(" ")[0];
            }
          }
       }
      
       return refinedLabel;
   }     

   // ----------- right panel for group list------- //

   /**
   * Refine group channel name
   * @since 1.0.0
   * @param {String} channelName  
   * @returns {String}
   * @example
   *
   * refineGrpChName("A488 background")
   *
   * // => "A488.ba"
   */   

   refineGrpChName = (channelName) => {
      var refinedLabel = channelName;

      if(channelName.includes(" ")) {
          if(channelName.split(" ")[1].length > 2) {
            if (!channelName.split(" ")[1].slice(0,1).match(/\d+/g)) { //Is first char after white space not integer
                   var secondLabel = channelName.split(" ")[1].slice(0,2)  // secondLabel is the label after the space
                   refinedLabel = channelName.split(" ")[0] + " " + secondLabel;
            }
          }
          refinedLabel = refinedLabel.replace(" ", ".");
       }

       return refinedLabel;
   } 



   /**
   * Used by add new group and suggest automatically a group name 
   * @since 1.0.0
   * @param {Array} selectedChannels  - Array of objects each represents a channel
   * @returns {String}
   * @example
   *
   * suggestNewGrplabel([{ channel_name: "DNA 1", channel_number: 0},{channel_name: "A488 background", channel_number: 0}])
   *
   * // => "DNA.1_A488.ba"
   */    
    suggestNewGrplabel = (selectedChannels) => {
        var grplabel = "";

        for (var index = 0; index < selectedChannels.length; index++)
          {
             if( (grplabel.length + refineGrpChName(selectedChannels[index].channel_name).length )< currentItemInfo.maxGroupLabelLen) {
                 grplabel = grplabel + refineGrpChName(selectedChannels[index].channel_name);
                 if(index < (selectedChannels.length-1)) {
                   if ( (grplabel.length + refineGrpChName(selectedChannels[index+1].channel_name).length + "_".length) < currentItemInfo.maxGroupLabelLen) {
                     grplabel = grplabel + "_";
                   } else {
                     grplabel = grplabel + "...";
                   }
                 }  
              }    
          }

        return grplabel;
    }  



   /**
   * Get array of objects key values for a specific key
   * @since 1.0.0
   * @param {Array} arr  - Array of objects  
   * @param {String} key     
   * @returns {Array}
   * @example
   *
   * getArrayKeyValues([{ color: "FFFFFF", contrast_Max: 35000},{color: "FF0000", contrast_Max: 25000}], "color")
   *
   * // => [ "FFFFFF", "FF0000"]
   */ 

    getArrayKeyValues = (arr, key) => {
        return arr.map(obj =>  obj[key]);
    }    



   /**
   * Get new group of channels path. 
   * @since 1.0.0
   * @param {Array} selectedChannels  - Array of objects each represents a channel
   * @returns {String}
   * @example
   *
   * getNewGrpPath([{ channel_name: "DNA 1", channel_number: 0},{channel_name: "A488 background", channel_number: 0}])
   *
   * // => "0___DNA 1---1___A488 background"
   */  
    getNewGrpPath = (grpChannels) => {
        let path = "";
        for (let index = 0; index < grpChannels.length; index++) {
             path = path + grpChannels[index].channel_number + "___" + grpChannels[index].channel_name;
             if(index < (grpChannels.length-1)) { 
                path = path + "---";
             }   
          }

        return path;
    }    


   /**
   * Add new group of channels to right panel of the design UI. 
   * @since 1.0.0
   *
   */ 

    addNewGrpBtn = () => {
        if( document.getElementById("grpName").value != "") {
            document.getElementById("grpLabelForm").style.display = "none";
            let grpEntryColorArray = tempSceneSelections.length<=colorContrastMap.length? getArrayKeyValues(colorContrastMap, "color").splice(0, tempSceneSelections.length ) : createGrpColorsArray(tempSceneSelections.length);

            let grpEntryContrastMax = tempSceneSelections.length<=colorContrastMap.length? getArrayKeyValues(colorContrastMap, "contrast_Max").splice(0, tempSceneSelections.length ) : createContrastMaxArray(grpEntryColorArray);

            let grpEntryContrastMin = tempSceneSelections.length<=colorContrastMap.length? getArrayKeyValues(colorContrastMap, "contrast_Min").splice(0, tempSceneSelections.length ) : createContrastMinArray(grpEntryColorArray) ;
       
            let grpEntryMaxContrastMax = Array(tempSceneSelections.length).fill( document.getElementById("maxContrastRange").max );

            let grpEntryMaxContrastMin = Array(tempSceneSelections.length).fill( document.getElementById("minContrastRange").max );                       

            let grpEntry = ({ 
              Format: "jpg", 
              Name:  document.getElementById("grpName").value,
              Path: getNewGrpPath(tempSceneSelections),
              Channels: getArrayKeyValues(tempSceneSelections, "channel_name"),
              Colors: grpEntryColorArray,
              Contrast_Max: grpEntryContrastMax,
              Contrast_Min: grpEntryContrastMin,
              Max_Contrast_Max: grpEntryMaxContrastMax,
              Max_Contrast_Min: grpEntryMaxContrastMin,              
              Numbers: getArrayKeyValues(tempSceneSelections, "channel_number")
            });

            currentItemInfo.omeDataset.Groups.push( grpEntry );
            initItemGroupsList();
            resetChannelCheckboxes();
            resetActiveFormState();

            if(Opts.designModeAutoUpload) {
                uploadGrpChanges();
            }
        }
    }


   /**
   * Select dapi channel for cell segmentation 
   * @since 1.0.0
   *
   */ 

    confirmDAPIChannelSelection = () => {
        if( document.getElementById("DAPIChannelName").value !== "" ) {
            document.getElementById("DAPIChConfirmForm").style.display = "none";
            // onSelectedChannel will change the DAPI channel index auto
            let dapiChannelObj = getChannelObjByName(document.getElementById("DAPIChannelName").value);

            if(dapiChannelObj && ( dapiChannelObj.length <= 1) ) {
               setSelectedDAPIChannelIndex(dapiChannelObj[0].channel_number);
               currentItemInfo.omeDataset.DapiChannel = dapiChannelObj;
               if(Opts.designModeAutoUpload) {
                    uploadGrpChanges();
               }               

            } else {
                if( dapiChannelObj.length > 1 ){
                   triggerHint("More than channel has same label","error", 7000);
                }  

                if(dapiChannelObj == null) {
                    triggerHint("No index found for the channel, please report this bug.. ","error", 7000);                  
                } 
            }
            resetActiveFormState();
        } else {
                  triggerHint("Please click on DAPI channel from Channel list");
        }
    }


   
   /**
   * Open DAPI channel seletion form to choose DAPI channel form Channel list
   * @since 1.0.0
   *
   */     
    openDAPIForm = () => {
        if( !getActiveForm() ) {
            // if( isDAPIChannelSelected() ) {

              if( isDAPIChannelSelected() ) {
                 document.getElementById("DAPIChannelName").value  = getSelectedDAPIChannelName();
              } else {
                 document.getElementById("DAPIChannelName").value  = "" 
              }

              var dapiForm = document.getElementById("DAPIChConfirmForm");
              dapiForm.classList.remove("formflashanimation");
              dapiForm.style.display = "block";
              getElementTopMiddleOnScreen(dapiForm);
              setActiveForm(dapiForm);
            // } else {
            //       triggerHint("Please click on DAPI channel from Channel list");
            // }
       }else {
             getActiveForm().classList.toggle("formflashanimation"); 
       } 
    }

   /**
   * Close DAPI channel confirmation form 
   * @since 1.0.0
   *
   */  
  closeDAPIChannelConfirmForm = () => {
      let dapiForm = document.getElementById("DAPIChConfirmForm");
      dapiForm.style.display = "none";      
      // resetSelectedDAPIChannelIndex();        
      resetActiveFormState();

      if( isScreenLogoActive() ) { 
          showScreenLogo();
      }         
  }


   //------------ Channel bar left---------------//

   /**
   * Show/hide group selected channel
   * @since 1.0.0
   *
   */   

   onCurGrpChOsdShowHide = ( grpChannelIndex) => {
      if ((curChColorContrastStates.chIndex === undefined) || curChColorContrastStates.changesCanceled || curChColorContrastStates.changesConfirmed){
          if (document.getElementById("eyeIcon." + grpChannelIndex).className === "fa fa-eye") {
                document.getElementById("eyeIcon." + grpChannelIndex).className = "fa fa-eye-slash";
                viewer.world.getItemAt(grpChannelIndex).setOpacity(0);
          } else {
                 document.getElementById("eyeIcon." + grpChannelIndex).className = "fa fa-eye";
                 viewer.world.getItemAt(grpChannelIndex).setOpacity(1);
          }
          showPanel("chColorContrastPanel", false);
      } else {
          triggerHint("Confirm or Cancel CHNL Settings");
      }
   }

   //------------ Channel Settings Panel ---------------//

    resetChColorContrastStates = () => {
      // to be coded 
    }

   /**
   * Hide all channels except one
   * @since 1.0.0
   *
   */  

    hideAllChExcept = (groupIndex, grpChannelIndex) => {
        let curGroup = currentItemInfo.omeDataset.Groups[groupIndex];

        curGroup.Colors.forEach((clr, idx) => {
           if(idx == grpChannelIndex) {
                  if (document.getElementById("eyeIcon." + grpChannelIndex).className === "fa fa-eye-slash") {
                       document.getElementById("eyeIcon." + grpChannelIndex).className = "fa fa-eye";
                  }
                  viewer.world.getItemAt(grpChannelIndex).setOpacity(1);   
          } else {
                  document.getElementById("eyeIcon." + idx).className = "fa fa-eye-slash";
                  viewer.world.getItemAt(idx).setOpacity(0);
          } 
       });
     }

   /**
   * Adjust channel settings 
   * @since 1.0.0
   *
   */ 
    onChSettingsAdjust = (groupIndex, grpChannelIndex, min, max, color = null) => {
        let curGroup = currentItemInfo.omeDataset.Groups[groupIndex];
        let curChannelName = curGroup.Channels[grpChannelIndex];
        let channelColor = null;
        if (color == null) {
            channelColor = curGroup.Colors[grpChannelIndex];
        } else {
            channelColor = color;
        }    

        let omeChannelIndex = curGroup.Numbers[grpChannelIndex];
        let hostAPI = getHostApi();
        let item = getSelectedItem();
          
        let palette1 = "rgb(0,0,0)";
        let palette2 = rgbObj2Str(hexToRgb(channelColor));
        let tileToReplace = viewer.world.getItemAt(grpChannelIndex);

        viewer.addTiledImage({
          tileSource: getOMETileSourceColored(hostAPI, item._id, omeChannelIndex, palette1, palette2, min, max),
          opacity: 1,
          index: grpChannelIndex,
          width: currentItemInfo.width,          
          success: (obj) => {
            viewer.world.removeItem(tileToReplace)
          }
        });
   }

  
 
   /**
   * Show list of values for contrast sliders maximum value
   * @since 1.0.0
   *
   */    
  showSlidersMaxList = () => {
        document.getElementById("maxContrastSliderMax").style.visibility = "visible";
        document.getElementById("minContrastSliderMax").style.visibility = "visible";
  }

  hideSlidersMaxList = () => {
        document.getElementById("maxContrastSliderMax").style.visibility = "collapse";
        document.getElementById("minContrastSliderMax").style.visibility = "collapse";
  }

  onMaxContrastSliderMaxListChanged = () => {
        //maxContrastRange
        let newSliderListVal = parseInt(document.getElementById("maxContrastSliderMaxList").value);
        if(newSliderListVal > 0) {
           document.getElementById("maxContrastRange").max = newSliderListVal;
           document.getElementById("maxContrastRange").value = Math.round(document.getElementById("maxContrastRange").max / 2);
        }
  }

  onMinContrastSliderMaxListChanged = () => {
       //minContrastRange
        let newSliderListVal = parseInt(document.getElementById("minContrastSliderMaxList").value);
        if(newSliderListVal > 0) {       
           document.getElementById("minContrastRange").max = newSliderListVal;
           document.getElementById("minContrastRange").value = Math.round(document.getElementById("minContrastRange").max / 2);
        }   
  }  


   getColorValue = (elemId) => {
       let colorValue = document.getElementById(elemId).value;

       if(colorValue.includes("#")) {
          colorValue = colorValue.split("#")[1]; // exclude # sign 
       }

       return colorValue;
   }

   getSlideContrastMax = () => {
       let maxValue = document.getElementById("maxContrastRange").value;
       return maxValue;
   }

   getSlideContrastMin = () => {
       let minValue = document.getElementById("minContrastRange").value;
       return minValue;
   }

   
   confirmChColorContrastChanges = () => {
       let groupIndex = curChColorContrastStates.grpIndex;
       let grpChannelIndex = curChColorContrastStates.chIndex;

       //-- maxContrastRange slider maximum value 
       currentItemInfo.omeDataset.Groups[groupIndex].Max_Contrast_Max[grpChannelIndex] = document.getElementById("maxContrastRange").max;
       //-- minContrastRange slider maximum value 
       currentItemInfo.omeDataset.Groups[groupIndex].Max_Contrast_Min[grpChannelIndex] = document.getElementById("minContrastRange").max; 

       currentItemInfo.omeDataset.Groups[groupIndex].Contrast_Max[grpChannelIndex] = curChColorContrastStates.newContrastMax;
       currentItemInfo.omeDataset.Groups[groupIndex].Contrast_Min[grpChannelIndex] = curChColorContrastStates.newContrastMin;
       currentItemInfo.omeDataset.Groups[groupIndex].Colors[grpChannelIndex] = curChColorContrastStates.newColor;

       curChColorContrastStates.changesConfirmed = true;
       curChColorContrastStates.lastCommand = "Confirm";
       showPanel("chColorContrastPanel", false);
       // Hide sliders max values lists 
       hideSlidersMaxList();
       onItemSelectedGroup(groupIndex, true); // Group refresh = true 

       if(Opts.designModeAutoUpload) {
            uploadGrpChanges();
       }       
   }
   
   cancelChColorContrastChanges = () => {
       resetChColorContrastChanges();
       curChColorContrastStates.changesCanceled = true;  
       curChColorContrastStates.lastCommand = "Cancel"; 
       showPanel("chColorContrastPanel", false); 
       // Hide sliders max values lists        
       hideSlidersMaxList();
   }

   
   resetChColorContrastChanges = () => {
       let grpChannelIndex = curChColorContrastStates.chIndex; 
       document.getElementById("maxContrastRange").value =  curChColorContrastStates.originalContrastMax;
       document.getElementById("minContrastRange").value =  curChColorContrastStates.originalContrastMin;
       document.getElementById("chColorInputId").value  = curChColorContrastStates.originalColor;

       $("#chColorInputId").spectrum({ color: curChColorContrastStates.originalColor });       

       curChColorContrastStates.newContrastMax = curChColorContrastStates.originalContrastMax;
       curChColorContrastStates.newContrastMin = curChColorContrastStates.originalContrastMin;
       curChColorContrastStates.newColor = curChColorContrastStates.originalColor;
       document.getElementById("contrastMaxValueTooltip").innerHTML = curChColorContrastStates.originalContrastMax;
       document.getElementById("contrastMinValueTooltip").innerHTML = curChColorContrastStates.originalContrastMin;  
       document.getElementById("chColorInputTooltip").innerHTML = curChColorContrastStates.originalColor;  
       
       contrastChanged();
       changeChSpanColor(grpChannelIndex, curChColorContrastStates.originalColor);
       changeContrastSliderThumbColor(curChColorContrastStates.originalColor);
       curChColorContrastStates.lastCommand = "Reset";
   } 

   onColorPickerMouseover = () => {
       document.getElementById("chColorInputTooltip").innerHTML = getColorValue("chColorInputId");  

   }

   onContrastMaxSliderMouseover = () => {
       document.getElementById("contrastMaxValueTooltip").innerHTML = getSlideContrastMax();
   } 

   onContrastMinSliderMouseover = () => {
       document.getElementById("contrastMinValueTooltip").innerHTML = getSlideContrastMin();
   } 

   chColorChanged = () => {
        let groupIndex = curChColorContrastStates.grpIndex;
        let grpChannelIndex = curChColorContrastStates.chIndex;  
        curChColorContrastStates.newColor = getColorValue("chColorInputId");
        document.getElementById("chColorInputTooltip").innerHTML = getColorValue("chColorInputId");  
        onChSettingsAdjust(groupIndex, grpChannelIndex, getSlideContrastMin(), getSlideContrastMax(), getColorValue("chColorInputId") );
        changeChSpanColor(grpChannelIndex, getColorValue("chColorInputId") );
        changeContrastSliderThumbColor( getColorValue("chColorInputId") );
  }

   contrastChanged = () => {    
       let groupIndex = curChColorContrastStates.grpIndex;
       let grpChannelIndex = curChColorContrastStates.chIndex;    
       curChColorContrastStates.newContrastMax = getSlideContrastMax();
       curChColorContrastStates.newContrastMin = getSlideContrastMin(); 
       onChSettingsAdjust(groupIndex, grpChannelIndex, getSlideContrastMin(), getSlideContrastMax(), getColorValue("chColorInputId") );
   }  

   changeChSpanColor = (grpChannelIndex, spanColor) => {
      if(spanColor.length == 6) {
         spanColor = '#'+spanColor; 
      }

      document.getElementById("chColorSpanId."+grpChannelIndex).style.backgroundColor = spanColor;
   }

   changeContrastSliderThumbColor = (thumbColor) => {
        if(thumbColor.length == 6) {
           thumbColor = '#'+thumbColor; 
        }

        let styleScript = document.createElement('style');
        styleScript.type = 'text/css';

        if(!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)) {
          styleScript.innerHTML = '.slider::-webkit-slider-thumb{width: 0.5vw;  height: 2.1vh; background:' +thumbColor + '; cursor: pointer;}';
        }

        if((navigator.userAgent.toLowerCase().indexOf('firefox') > -1)|| (typeof InstallTrigge !== 'undefined')) {
          styleScript.innerHTML = '.slider::-moz-range-thumb {width: 0.5vw;  height: 2.1vh; background:' +thumbColor + '; cursor: pointer;}';        
        }

        document.getElementsByTagName('head')[0].appendChild(styleScript);
        document.getElementById('maxContrastRange').className = 'slider';
   }
   
   customizeChColor = (groupIndex, grpChannelIndex) => {
        if ((curChColorContrastStates.chIndex === undefined)|| curChColorContrastStates.changesCanceled || curChColorContrastStates.changesConfirmed) {
              let curGroup = currentItemInfo.omeDataset.Groups[groupIndex];
              curChColorContrastStates = new chColorContrastStates();

              curGroup.Colors.forEach((clr, idx) => {
                 if(idx == grpChannelIndex){
                    if (document.getElementById("eyeIcon." + grpChannelIndex).className === "fa fa-eye-slash"){
                          document.getElementById("eyeIcon." + grpChannelIndex).className = "fa fa-eye";
                    }
                    viewer.world.getItemAt(grpChannelIndex).setOpacity(1);
                    changeContrastSliderThumbColor(clr)

                    document.getElementById("maxContrastRange").max = currentItemInfo.omeDataset.Groups[groupIndex].Max_Contrast_Max[idx];
                    document.getElementById('maxContrastSliderMaxList').value = document.getElementById("maxContrastRange").max;                  
                    document.getElementById("minContrastRange").max = currentItemInfo.omeDataset.Groups[groupIndex].Max_Contrast_Min[idx];  
                    document.getElementById('minContrastSliderMaxList').value = document.getElementById("minContrastRange").max;                                          
                    document.getElementById("maxContrastRange").value = currentItemInfo.omeDataset.Groups[groupIndex].Contrast_Max[idx];
                    document.getElementById("minContrastRange").value = currentItemInfo.omeDataset.Groups[groupIndex].Contrast_Min[idx];
                    document.getElementById("chColorInputId").value  = clr;

                    $("#chColorInputId").spectrum({ color: "#"+clr });

                    curChColorContrastStates.originalColor = curChColorContrastStates.newColor = clr; // color in Hex
                    curChColorContrastStates.originalContrastMax = curChColorContrastStates.newContrastMax = currentItemInfo.omeDataset.Groups[groupIndex].Contrast_Max[idx];
                    curChColorContrastStates.originalContrastMin = curChColorContrastStates.newContrastMin = currentItemInfo.omeDataset.Groups[groupIndex].Contrast_Min[idx];
                    curChColorContrastStates.chIndex = grpChannelIndex;
                    curChColorContrastStates.grpIndex = groupIndex;
                    showPanel("chColorContrastPanel", true);   

                  } else {
                       document.getElementById("eyeIcon." + idx).className = "fa fa-eye-slash";
                       viewer.world.getItemAt(idx).setOpacity(0);
                  } 
              })
        } else {
               document.getElementById("chColorContrastPanel").classList.toggle("formflashanimation");
               triggerHint("Confirm or Cancel CHNL Settings");
        } 
   }

    // getSelectedGrpIndex = () => {
    //     return lastItemSelectionStates.grpIndex ? lastItemSelectionStates.grpIndex : null;
    // }


   /**
   * Reset group selection
   * @since 1.0.0
   *
   */ 

    resetGrpSelection = () => {
        if(lastItemSelectionStates.grpIndex != null) {
            document.getElementById("itemGrpLi" + lastItemSelectionStates.grpIndex).style.backgroundColor = Opts.defaultElemBgColor;
            document.getElementById("itemGrpFont" + lastItemSelectionStates.grpIndex).style.color = Opts.defaultElemFontColor;
            lastItemSelectionStates.grpIndex = null;
        }
    }

   /**
   * Event fires when click on created group of channels
   * @since 1.0.0
   *
   */ 

    onItemSelectedGroup = (groupIndex, grpRefresh = false) => {
        //-- lastSelectionStates.tileChanged=0 means no change in the tileSource --//
        if((lastItemSelectionStates.grpIndex == groupIndex) && (grpRefresh == false)) {
            return 0;
        }
        if(lastItemSelectionStates.grpIndex != null) {
            document.getElementById("itemGrpLi"+lastItemSelectionStates.grpIndex).style.backgroundColor = Opts.defaultElemBgColor;
            document.getElementById("itemGrpFont"+ lastItemSelectionStates.grpIndex).style.color = Opts.defaultElemFontColor;
        }
        document.getElementById("itemGrpLi"+groupIndex).style.backgroundColor = Opts.selectedElemBgColor;
        document.getElementById("itemGrpFont"+groupIndex).style.color = Opts.selectedElemFontColor;
        lastItemSelectionStates.grpIndex= groupIndex;

        var curGroup = currentItemInfo.omeDataset.Groups[groupIndex];
        reloadOSD(curGroup);
        // //--Initialize annotation labels on right panel--//
        clearGrpBarRight();
        curGroup.Colors.forEach((clr, idx) => {
             document.getElementById("grpListViewBar").innerHTML += '<a href="javascript:void(0)" ><span id="chColorSpanId.'+ idx+'" style="background-color:'+'\#'+clr+';   padding-left:0.5vw;" onclick = "customizeChColor('+groupIndex+','+idx+')">&nbsp</span>&nbsp<i id="eyeIcon.'+idx+'" class="fa fa-eye" aria-hidden="true" onclick="onCurGrpChOsdShowHide('+ idx +')" style="font-size:0.6vw">'+'<font style = "font-family: Impact, Charcoal, sans-serif;" >&nbsp&nbsp'+ refineChannelName(curGroup.Channels[idx]) + '</font></i></a>';
        })
    }

   /**
   * Calculate max group label length
   * @since 1.0.0
   * @returns {number}
   *
   */ 

    getMaxGroupLabelLen = () => {
        var maxLabelLen = 0;

        if(currentItemInfo.omeDataset.Groups.length) { // if there is a preexistent groups
          currentItemInfo.omeDataset.Groups.forEach( group => {
               if (maxLabelLen < group.Name.length) {
                   maxLabelLen = group.Name.length;
               }
          });          
        } else {
            maxLabelLen = Opts.maxGrpLabelLen; 
        }

        return maxLabelLen;
    }

   /**
   * Upload groups created to DSA
   * @since 1.0.0
   *
   */ 

    uploadGrpChanges = () => {
        if(isLoggedIn()) {
            let item = getSelectedItem();
            let hostAPI = getHostApi();
            let itemMetadataObject = {};
            itemMetadataObject["omeDatasetUpdate"] = currentItemInfo.omeDataset;
            updateItemMetadata(hostAPI, item._id, itemMetadataObject, "Object");
         } else {
              triggerHint("Login before upload");
         }   
    }


   /**
   * DSA meta data 
   * @since 1.0.0
   *
   */ 

    setItemMetadataKeyValue = (metaKey, metaValue) => {
        if(isLoggedIn()) {
            let item = getSelectedItem();
            let hostAPI = getHostApi();
            let itemMetadataObject = {};
            itemMetadataObject[metaKey] = metaValue;
            updateItemMetadata(hostAPI, item._id, itemMetadataObject, "Object");
         } else {
            triggerHint("Login before upload");
         }   
    }


   /**
   * Get DSA meta data for the selected item
   * @since 1.0.0
   *
   */ 
    getItemMetadataKeyValue = (metaKey) => {
        if(isLoggedIn()) {
            let item = getSelectedItem();
            // -- item.meta e.g. : { omeDatasetUpdate: {…}, omeSceneDescription: (44) […], test: "ok" }            
            return item.meta[metaKey] ? item.meta[metaKey]: null;

         } else {
              triggerHint("Login before upload");
         }   
    }




    addGrpPanelShow = () => {
      // Button Add group:  To show channel panel on the left
    } 
                                                                                                                                    

   /**
   * Update item meta data
   * @since 1.0.0
   *
   */ 

    updateItemMetadata = (hostApi, itemId, metadataObject, uploadType = "Array") => {
        switch (uploadType){
               case 'Object':
                              {
                                var metadata = metadataObject ? { metadata: metadataObject } : {};
                                 break;             
                              }
                case 'Array':
                              {
                                var metadata = []
                                var metadataObjToUpload =  metadataObject ? { metadata: metadataObject } : {};
                                metadata.push(metadataObjToUpload);
                                //console.log("metadata", metadata)
                                break;             
                              }   
                }    

        return webix.ajax()
          .put(hostApi + "item/" + itemId + "/metadata", metadata)
          .fail(parseError)
          .then( result => { 
                            _parseData(result);
                             triggerHint("Uploaded Successfully");
                          });
    }


   /**
   * Undo if a group of channels deleted from the right group panel
   * @since 1.0.0
   *
   */                                             
   undoGrpListItemRemove = () => {
        if(tempGrpRemoved.length) {
          var grpToUndo = tempGrpRemoved.pop();
          insertArrayElem(currentItemInfo.omeDataset.Groups, grpToUndo.group, grpToUndo.grpIndex);
          onCurTileSourceClick();
          initItemGroupsList();

          if(Opts.designModeAutoUpload) {
              uploadGrpChanges();
          }           

          if(tempGrpRemoved.length) {
             document.getElementById("undoGrpRemove").className = "fa  fa-undo";
          }
        }
   }
  

   /**
   * Delete a group of channels deleted from the right group panel
   * @since 1.0.0
   *
   */  
   deleteGrpFromList = (groupIndex) => {
        onCurTileSourceClick();
        var groupToRemove = currentItemInfo.omeDataset.Groups[groupIndex];
        tempGrpRemoved.push({ grpIndex: groupIndex, group: groupToRemove});
        removeArrayElem(currentItemInfo.omeDataset.Groups, groupToRemove);
        initItemGroupsList();
        document.getElementById("undoGrpRemove").className = "fa  fa-undo";  

        if(Opts.designModeAutoUpload) {
            uploadGrpChanges();
        }        
    }


   // undoGrpListItemRemove = () => {
   //    if(tempGrpRemoved.length) {
   //      var grpToUndo = tempGrpRemoved.pop();
   //      insertArrayElem(currentItemInfo.omeDataset.Groups, grpToUndo.group, grpToUndo.grpIndex);
   //      initItemGroupsList();

   //      if( isGrpSelected() ) {
   //          document.getElementById("itemGrpLi"+ getSelectedGrpIndex()).style.backgroundColor = Opts.defaultElemBgColor;
   //          document.getElementById("itemGrpFont"+ getSelectedGrpIndex()).style.color = Opts.defaultElemFontColor;          
   //      }

   //      if(tempGrpRemoved.length) {
   //         document.getElementById("undoGrpRemove").className = "fa  fa-undo";  
   //      }
   //    }
   // }
  

   // deleteGrpFromList = (groupIndex) => {
   //      var groupToRemove = currentItemInfo.omeDataset.Groups[groupIndex];
   //      tempGrpRemoved.push({ grpIndex: groupIndex-1, group: groupToRemove});
   //      removeArrayElem(currentItemInfo.omeDataset.Groups, groupToRemove);

   //      if(lastItemSelectionStates.grpIndex == groupIndex){
   //         onCurTileSourceClick();
   //         initItemGroupsList();           
   //      } else {
   //            var grpEntryToRemove =  document.getElementById("itemGrpEntry" + groupIndex);
   //            grpEntryToRemove.parentNode.removeChild(grpEntryToRemove);
   //      }

   //      document.getElementById("undoGrpRemove").className = "fa  fa-undo";  
   //  }


 
   /**
   * Initiate the group panel on the right
   * @since 1.0.0
   *
   */  

    initItemGroupsList = () => { 
        var nodes = "";
        var grpHeaderNode = "";
 
        grpHeaderNode += '<table>';
        grpHeaderNode += '<colgroup> <col style="width:55%"> <col style="width:15%"><col style="width:15%"><col style="width:15%"></colgroup>';
        grpHeaderNode +=  '<tr>';
        grpHeaderNode +=    '<th style="text-align: left;">' + "Groups:" + '</th>';
        grpHeaderNode +=    '<th style="text-align: left;"><a href="javascript:void(0)" onclick="undoGrpListItemRemove()" title="Undo"><i id="undoGrpRemove"  style="font-size:0.7vw"  ></i></a></th>';
        grpHeaderNode +=    '<th style="text-align: left;"><a id="addGrp" href="javascript:void(0)" onclick="addGrpPanelShow()"><i style="font-size:0.7vw" class="fa  fa-plus-square" ></i></a></th>';
        grpHeaderNode +=    '<th style="text-align: left;"><a id="uploadGrpToDSA" href="javascript:void(0)" onclick="uploadGrpChanges()" title="Upload"><i style="font-size:0.7vw" class="fa  fa-upload" ></i></a></th>';
        grpHeaderNode +=  '</tr>'; 
        grpHeaderNode += '</table>'; 

        document.getElementById("itemGroupTitle").innerHTML = grpHeaderNode;

        nodes += '<table>';
        nodes += '<colgroup> <col style="width:85%"> <col style="width:15%"></colgroup>';
        document.getElementById("itemGroupsList").innerHTML=""; 

        currentItemInfo.omeDataset .Groups.forEach( (group, idx) => { 
          nodes +=  '<tr id="itemGrpEntry' + idx +'">';
          nodes +=    '<th style="text-align: left;">';
          nodes +=      '<li style="background-color: none" id="itemGrpLi' + idx + '">';
          nodes +=        ' <a href="javascript:void(0)" onclick="onItemSelectedGroup('+ idx +')"><font style="font-size:0.62vw"  id="itemGrpFont' + idx + '">'+ group.Name+'</font></a>';
          nodes +=      '</li>';
          nodes +=    '</th>';
          nodes +=    '<th style="text-align: left;">';
          nodes +=      '<a id="deleteGrp' + idx +'" href="javascript:void(0)" onclick="deleteGrpFromList(' + idx +')"><i style="font-size:0.7vw" class="fa fa-minus-circle" ></i></a>';
          nodes +=    '</th>';
          nodes +=  '</tr>';          
        });

        nodes += '</table>';

        document.getElementById("itemGroupsList").innerHTML +=nodes;
    }     


    
   /**
   * Close the "New Group" form
   * @since 1.0.0
   *
   */  

    closeGrpForm = () => {
        var grpForm = document.getElementById("grpLabelForm");

        if (grpForm.style.display === "block") {
           document.getElementById("grpName").value = "";
           grpForm.style.display = "none";
           resetActiveFormState();
        }
    }


   /**
   * Clear the right bar contents that contains channel names, colors, show/hide
   * @since 1.0.0
   *
   */  

    clearGrpBarRight = () => {
        if(!(document.getElementById("grpListViewBar").innerHTML === "")){
             var node = document.getElementById("grpListViewBarBtn");
             document.getElementById("grpListViewBar").innerHTML = ""
             document.getElementById("grpListViewBar").append(node)
             showPanel("chColorContrastPanel", false) 
        }

    }

    
   /**
   * Event fires when current tile source clicked in the "OME Group Set" right panel
   * @since 1.0.0
   *
   */  

     onCurTileSourceClick = () => {
          let item = getSelectedItem();
          let hostAPI = getHostApi();
          clearOSDViewer()
          clearGrpBarRight()
          resetGrpSelection()
          viewer.addTiledImage({
            tileSource: getTileSource(hostAPI, item._id),
            opacity: 1,
            width: currentItemInfo.width,            
            success: (obj) => {
                //-- Future use
            }
          });

      }


   /**
   * Create OME dataset to be pushed to DSA 
   * If no omeDataset then new groups need to be created and uploaded
   * @since 1.0.0
   *
   */ 
     createOmeDataset = () => {
          return {
                    "Groups": [],
                    "DapiChannel": [],
                    "Header": null,
                    "Images": [],
                    "Layout": {},
                    "Name": null,
                    "Stories": []
                 }   
     } 

   /**
   * Initiate current selected tile 
   * @since 1.0.0
   *
   */      

     initCurrentTileSource = () => { 
          let item = getSelectedItem();
          let tileSourceName = item.name.split(".")[0];
          let node =  '<li style="background-color: none" id="currentTS"><a href="javascript:void(0)" onclick="onCurTileSourceClick()"><font  style="font-size:0.62vw" id="curTSFont">'+tileSourceName+'</font></li>';
          document.getElementById("currentTileSource").innerHTML = node;
        //if (!(typeof currentHostCollectSelectionStates.item.meta.omeDataset[0] === "undefined")) {
          if ( item.meta.hasOwnProperty('omeDatasetUpdate') ) {
                    currentItemInfo.omeDataset = item.meta.omeDatasetUpdate;
                    currentItemInfo.dsaSourceExists = true;
                    currentItemInfo.dsaSourceNeedUpdate = false;

          } else  if( item.meta.hasOwnProperty('omeDatasetOriginal') ) {  
                    currentItemInfo.omeDataset = item.meta.omeDatasetOriginal;
                    currentItemInfo.dsaSourceExists = true;
                    currentItemInfo.dsaSourceNeedUpdate = false;

          } else {
             currentItemInfo.dsaSourceExists = false;
             currentItemInfo.dsaSourceNeedUpdate = true; // If no omeDataset then new groups need to be created and uploaded 
             currentItemInfo.omeDataset = createOmeDataset();
          }
          
          currentItemInfo.maxGroupLabelLen = getMaxGroupLabelLen();

          //-- let tsInfo =  getTileSourceInfo( getHostApi(), getSelectedItemId());


          initItemGroupsList();

      } 

//--------DSA functions ---------------//  

getCollectionsList = (hostApi) => {
  var hostCollectionsList = [];
  webix.ajax().sync().get(hostApi + "/collection", (result) => {
    hostCollectionsList = JSON.parse(result)
  })
   return hostCollectionsList;
}


getFoldersList = (hostApi, parentId, parentType="collection") => {
  var foldersList = [];
  webix.ajax().sync().get(hostApi + "/folder?parentType=" + parentType + "&parentId=" + parentId + "&sort=lowerName&sortdir=1", (result) => {
    foldersList = JSON.parse(result)
  })

   return foldersList;
}


getFolderDetails = (hostApi, folderId) => {
  var folderDetails = [];
  webix.ajax().sync().get(hostApi + "/folder/" + folderId+"/details", (result) => {
    folderDetails = JSON.parse(result)
  })

   return folderDetails;
}


getFolderItemsList = (hostApi, folderId) => {
  var itemsList = [];
  webix.ajax().sync().get(hostApi + "/item?folderId=" + folderId + "&sort=lowerName&sortdir=1", (result) => {
    itemsList = JSON.parse(result)
  })
   return itemsList;
}


getItemObject = (hostApi, itemId) => {
  var item = [];
  webix.ajax().sync().get(hostApi + "/item/" + itemId, (result) => {
    item = JSON.parse(result)
  })
   return item;
}

getTileSourceInfo = (hostApi, itemId, type = "ome") => {
    var tileInfo=[];
    webix.ajax().sync().get(hostApi + "/item/" + itemId + "/tiles", (data) => {
      tileInfo = JSON.parse(data);
      tileInfo['maxLevel'] = tileInfo['levels'] - 1;
      tileInfo['minLevel'] = 0;
      tileInfo['width'] = tileInfo['sizeX'];
      tileInfo['height'] = tileInfo['sizeY'];
      if(type === "ome"){
         tileInfo['numChannels'] = tileInfo['channels'].length;
        } 
    })
    return tileInfo;
  }

getTileSource = (hostApi, itemId) => {
    var tile=[];
    webix.ajax().sync().get(hostApi + "/item/" + itemId + "/tiles", (data) => {
      tile = JSON.parse(data);
      tile['maxLevel'] = tile['levels'] - 1;
      tile['minLevel'] = 0;
      tile['width'] = tile['sizeX'];
      tile['height'] = tile['sizeY'];
      tile['getTileUrl'] = (level, x, y) => {
        return hostApi + "/item/" + itemId + "/tiles/zxy/" + level + "/" + x + "/" + y + "?edge=crop";
      }
    })
    return tile;
  }


//------- Tree Selection Events ------------//

// function to center the viewport content on the screen, 
centerViewportContent = () => {
     //-- viewerZoomHome();
     viewer.viewport.fitVertically();
     //-- viewer.viewport.fitHorizontally();
}

enablePreserveViewport = () => {
     viewer.preserveViewport = true;
}

clearOSDViewer = () => {
  let allLayers = viewer.world.getItemCount();      
  
  if (allLayers > 0) { 
      viewer.world.removeAll(); 
  }
}

pastMetaToInfoPanel = (itemObj) => {
      let hostAPI = getHostApi();
      let itemBasicName = getItemRootName(itemObj.name.split(".")[0]);
      currentItemInfo.singlePlexMetaInfo = getTileSourceInfo(hostAPI, itemObj._id, "not-ome");
      parseMetadataInfo(currentItemInfo.singlePlexMetaInfo, itemBasicName, "not-ome");  
}

pastOmeMetaToInfoPanel = (itemObj) => {
      let hostAPI = getHostApi();
      let itemBasicName = getItemRootName(itemObj.name.split(".")[0]);
      let omeDataset = itemObj.meta.omeDatasetUpdate || itemObj.meta.omeDatasetOriginal?itemObj.meta.omeDatasetUpdate || itemObj.meta.omeDatasetOriginal :null;
      let numStories = omeDataset&&omeDataset.Stories.length&&omeDataset.Stories[0].Waypoints? omeDataset.Stories[0].Waypoints.length : 0;
      let numGroups  = omeDataset&&omeDataset.Groups? omeDataset.Groups.length : 0;      
      currentItemInfo.multiPlexMetaInfo = getTileSourceInfo(hostAPI, itemObj._id);
      currentItemInfo.multiPlexMetaInfo["numGroups"] = numGroups;
      currentItemInfo.multiPlexMetaInfo["numStories"] = numStories;
      currentItemInfo.multiPlexMetaInfo["Path"] = hostAPI;

      parseMetadataInfo(currentItemInfo.multiPlexMetaInfo, itemBasicName);  
}  

onSelectedTreeItem = (item) => {
  var hostAPI = getHostApi();
  // Next step is needed to avoid "SyntaxError: identifier starts immediately after numeric literal"
  var itemId = item.id.split('_')[1];
  let itemObj = getItemObject(hostAPI, itemId);

  if (itemObj.largeImage) {
      setSelectedItem(itemObj);
      document.getElementById("file_icon_" + itemId).className = "w3-small w3-spin fa fa-refresh";
      let lastSelectedItemId = getLastSelectedItemId();

       if(lastSelectedItemId !== itemId) {
          if(lastSelectedItemId != null) {
              document.getElementById("file_" + lastSelectedItemId).style.backgroundColor = Opts.defaultElemBgColor;
              document.getElementById("itemFont" + lastSelectedItemId).style.color = Opts.defaultElemFontColor;
              document.getElementById("itemFont" + lastSelectedItemId).style.fontWeight = Opts.defaultElemFontWeight; 
              setObjectValues(currentItemInfo, null); // reset currentItemInfo values to null
          }
          else {
           //  
          }
      document.getElementById("file_"+itemId).style.backgroundColor= Opts.selectedElemBgColor;
      document.getElementById("itemFont"+itemId).style.color = Opts.selectedElemFontColor;
      document.getElementById("itemFont"+itemId).style.fontWeight = Opts.selectedElemFontWeight
      setLastSelectedItemId(itemId);
      }

      // --- Show metadata panel for only OME files -- //
      // if((itemObj.name.includes(".ome.tif")) && (itemObj.meta.omeSceneDescription != null)) {
      //     pastOmeMetaToInfoPanel(itemObj);
      // } else if(!itemObj.name.includes(".ome.tif")) {
      //     pastMetaToInfoPanel(itemObj);
      // } 

      // check if selected item whether  is a multiplex or a singleplex
      if( isMultiPlexItem(itemObj) ) {
         if(hasOmeSceneDescription(itemObj)) {
                pastOmeMetaToInfoPanel(itemObj);
         } else {

                triggerHint(" No omeSceneDescription metadata", "error", 5000);
                let foundCsvData  = loadCsvChannelMetadata();
                if(foundCsvData) {
                     if( !foundCsvData[0].hasOwnProperty('channel_name') || !foundCsvData[0].hasOwnProperty('channel_number') ) {
                        // trigerWizard () // 
                        triggerHint("No 'channel_name' or 'channel_number' columns with " + getCsvChannelMetaDataFileName() + " file" , "error", 5000); 
                     } else {
                         itemObj.meta.omeSceneDescription = foundCsvData;
                         uploadChannelsMetadata("omeSceneDescription", foundCsvData);
                     }
                } else {
                    triggerHint("Error reading remote " + getCsvChannelMetaDataFileName() + " file, check if file exists" , "error", 5000); 
                }            

         } 
      } else {
          pastMetaToInfoPanel(itemObj);
      }



      clearOSDViewer();
      removeScreenLogo();

      /////////////////////////////////////////////
      // temp location for reset functions                                     <<<<<<<<<<<<<-------------  
      resetSelectedDAPIChannelIndex();
      //////////////////////////////////////////////

      let curTileSource = getTileSource(hostAPI, itemObj._id);

      // Get current item width and hight to set the width in addTiledImage function 
      currentItemInfo.width = curTileSource.width;
      currentItemInfo.height = curTileSource.height;  
      currentItemInfo.size = itemObj.size;       

      // console.log( " curTileSource.width ", curTileSource.width)
      viewer.addTiledImage({
        tileSource: curTileSource,
        opacity: 1,
        width: curTileSource.width,
        success: (obj) => {
                showBarExtension("itemTreeViewBar");
                centerViewportContent();
                //-- enablePreserveViewport();
                //-- Show scale bar  
                viewer.scalebar({
                                  //-- To calculate pixels per meter, given sample width is 0.02 meter
                                  pixelsPerMeter: curTileSource.width / Opts.tissuePhysicalWidthPerMeter  
                                });
                
        },
        error: (obj) => {
               triggerHint(" Image can not be added, check server", "error");
               showBarBasic("itemTreeViewBar");
        }
      });

      document.getElementById("file_icon_" + itemId).className = "fa fa-file-text-o";

  } else {
       triggerHint(" No large Image attribute ");
       } 
}

appendEmptyNode =(elem) => {
    var nodeUl = document.createElement("UL");
    nodeUl.classList.add("nested")
    var nodeLi = document.createElement("LI");
    var textnode = document.createTextNode("Empty");
    nodeLi.appendChild(textnode);
    nodeUl.appendChild(nodeLi);
    elem.appendChild(nodeUl); 
}

onTreeClickEvent = () => {
      let toggler = document.getElementsByClassName("caret");

      for (let i = 0; i < toggler.length; i++) {
          toggler[i].addEventListener("click", () => {

              if(this.parentElement.querySelector(".nested") == null){
                    appendEmptyNode(this)
               }

              this.parentElement.querySelector(".nested").classList.toggle("active");
              this.classList.toggle("caret-down");             
          });
      }
}

onSelectedTreeFolder = (curLiElem) => {
  var hostAPI = getHostApi();
  var folderId = curLiElem.id.split('_')[1];
  var nodes = "";
  var folderDetails = getFolderDetails(hostAPI, folderId);   // e.g  "nFolders": 0,  "nItems": 1

  if((folderDetails.nItems || folderDetails.nFolders)) {     
      nodes += '<ul class="nested">';

      if(folderDetails.nFolders) {
          var subFoldersList = getFoldersList(hostAPI, folderId, parentType = "folder");
          nodes += createTreeByBranchClick(subFoldersList);  // Recursive call till finish all subfolders within the parent folder/collection. 
      }

      if(folderDetails.nItems) {
          var subItemsList = getFolderItemsList(hostAPI, folderId);
          nodes += createTreeByBranchClick(subItemsList);  
      }

      nodes += '</ul>'; 
  
  } else {
      nodes += '<ul class="nested">';
      nodes += '<li>Empty</li>'; 
      nodes += '</ul>';         
  }


  if( ! document.getElementById("folder_" + folderId).innerHTML.includes(nodes)) {
            document.getElementById("folder_" + folderId).innerHTML += nodes;
  }          
  //  "this" is the span tag of caret.. parent is the Li, 
  document.getElementById("folder_" + folderId).querySelector(".nested").classList.toggle("active");      
  document.getElementById("folder_" + folderId).querySelector(".caret").classList.toggle("caret-down");
}


createTreeByBranchClick = (documentsList) => { // recursive call to build the tree 
      let hostAPI = getHostApi();
      let nodes="";

      // for(let i = 1; i <= documentsList.length; i++){
      documentsList.forEach( doc => {  
         let documentType = doc._modelType;

         if( ! documentType.localeCompare("folder")  ){
             let folderName = doc.name;   // documentName can be folder or item(file)
             let folderId   = doc._id;          
             nodes += '<li style="background-color: none" id="folder_'+folderId+'"><span class="caret" ><font style="font-size:0.77vw" onclick="onSelectedTreeFolder(folder_'+folderId+')"  id="folderFont_'+folderId+'">'+folderName+'</font></span>'
             nodes += '</li>'  
         } else  if( ! documentType.localeCompare("item")  ) {
                   let itemName = doc.name;  
                   let itemId   = doc._id;
                   nodes += '<li style="background-color: none" onclick="onSelectedTreeItem(file_'+itemId+')" id="file_'+itemId+'"><i style="font-size:0.62vw" class="fa fa-file-text-o" id="file_icon_'+itemId+'"></i><a href="javascript:void(0)" ><font  style="font-size:0.62vw"  id="itemFont'+itemId+'">'+'&nbsp&nbsp'+itemName+'</a></li>'  
         }
      });

      return nodes;
}

createTree = (foldersList) => { // recursive call to build the tree 
      var hostAPI = getHostApi();
      var nodes = "";
      foldersList.forEach( folder => {  
         var documentName = folder.name;   // documentName can be folder or item(file)
         var documentId = folder._id;
         var documentType = folder._modelType;
         if(! documentType.localeCompare("folder")) {
             nodes += '<li style="background-color: none" id="folder'+documentId+'"><span class="caret"><font  style="font-size:0.77vw"  id="folderFont'+documentId+'">'+documentName+'</font></span>'
             var folderDetails = getFolderDetails(hostAPI, documentId);   // e.g  "nFolders": 0,  "nItems": 1
             
             if(folderDetails.nFolders){
                var subFoldersList = getFoldersList(hostAPI, documentId, parentType="folder");
                nodes += '<ul class="nested">';
                nodes += createTree(subFoldersList);  // Recursive call till finish all subfolders with then the collection. 
                nodes += '</ul>'; 

              } else  if(folderDetails.nItems) {
                 var itemsList = getFolderItemsList(hostAPI, documentId);
                 nodes += '<ul class="nested">';

                 itemsList.forEach( item => {  
                   var itemName = item.name; 
                   var itemId = item._id;
                   nodes += '<li style="background-color: none" onclick="onSelectedTreeItem(file_'+ itemId +')" id="file_'+ itemId +'"><i class="fa fa-file-text-o" ></i><a href="javascript:void(0)" ><font  style="font-size:0.62vw"  id="itemFont'+itemId+'">'+'&nbsp&nbsp'+itemName+'</a></li>'  
                 });

                 nodes += '</ul>'; 
             }//end of else

            nodes += '</li>';

         }else if(! documentType.localeCompare("item")) {
               nodes +=  '<li style="background-color: none" id="file_'+ documentId +'"><a href="javascript:void(0)"  onclick="onSelectedTreeItem(file_'+documentId+')"><font  style="font-size:0.62vw"  id="itemFont'+documentId+'">'+'&nbsp&nbsp' + documentName+'</font></a>';
               nodes += '</li>';   
         }
      });

    return nodes;
}

clearTreeView = () => {
      document.getElementById("treeList").innerHTML = "";
      document.getElementById("collectionTreeName").innerHTML = '<i style="font-size:1.4vw"  class="fa fa-tree" ></i> '+ '&nbsp' + "Collection Tree";
}

renderTreeView = (collectionIndex) => {
      //-- change tree top label --//
      var collectList = currentHostCollectSelectionStates.collectionList;
      var collectionName = collectList[collectionIndex].name;

      if(!Opts.creatItemTreeByBranch) {
         document.getElementById("collectionTreeName").innerHTML = '<i style="font-size:1.4vw"  class="w3-xxlarge w3-spin fa fa-refresh" ></i> '+ '&nbsp&nbsp' + collectionName;
       }

      //-- Render the tree -- //
      var collectionFolders = currentHostCollectSelectionStates.foldersList;
      var nodes = "";

      if(Opts.creatItemTreeByBranch) {
         nodes = createTreeByBranchClick(collectionFolders);
      } else {
         nodes = createTree(collectionFolders);
      }   

      document.getElementById("treeList").innerHTML = nodes;
      document.getElementById("collectionTreeName").innerHTML = '<i style="font-size:1.4vw"  class="fa fa-tree" ></i> '+ '&nbsp' + collectionName;

      if( ! Opts.creatItemTreeByBranch) {
        //-- Add click event to tree view --//
        onTreeClickEvent(); 
      }  
}

resetLastTreeItemSelection = () => {
    // lastHostCollectSelectionStates.itemId = null;
     resetLastSelectedItemId();
     resetCurTreeItemSelection();
}

resetCurTreeItemSelection = () => {
   //  currentHostCollectSelectionStates.item = null;
     resetSelectedItem();
     clearTreeView();
}

//------- Host and Collection selections ----//
resetCurSelectedCollectiotFolders = () => {
      currentHostCollectSelectionStates.collectionFolders = null;
      resetLastTreeItemSelection();
}


resetCurCollectionList = () => {
      currentHostCollectSelectionStates.collectionList = null;
      resetCurSelectedCollectiotFolders();
}

onSelectedCollection = (hostIndex, collectionIndex) => {

  //-- lastHostCollectSelectionStates.hostChanged= false means no change in the host --//
  if((lastHostCollectSelectionStates.hostChanged == false) && (lastHostCollectSelectionStates.collectionIndex == collectionIndex)){
      return 0;
  }
  if((lastHostCollectSelectionStates.collectionIndex != null) && (lastHostCollectSelectionStates.hostIndex != null)){
      document.getElementById("colLi"+lastHostCollectSelectionStates.hostIndex +'-'+ lastHostCollectSelectionStates.collectionIndex).style.backgroundColor = Opts.defaultElemBgColor;
      document.getElementById("colFont"+lastHostCollectSelectionStates.hostIndex +'-'+ lastHostCollectSelectionStates.collectionIndex).style.color = Opts.defaultElemFontColor;
  }
  document.getElementById("colLi"+hostIndex+'-'+collectionIndex).style.backgroundColor = Opts.selectedElemBgColor;
  document.getElementById("colFont"+hostIndex+'-'+collectionIndex).style.color = Opts.selectedElemFontColor;
  lastHostCollectSelectionStates.collectionIndex= collectionIndex;
  lastHostCollectSelectionStates.hostChanged = false;


  var collectList = currentHostCollectSelectionStates.collectionList;
  var hostAPI = getHostApi();
  var collectionId = collectList[collectionIndex]._id;
  var collectionFolders = getFoldersList(hostAPI, collectionId)
  currentHostCollectSelectionStates.foldersList = collectionFolders
  resetLastTreeItemSelection()
  renderTreeView(collectionIndex)
}  

isHostAvailable = (hostApi) =>{ // check if host is not dowm
    let response;
    try{
        webix.ajax().sync().get(hostApi + "/system/check?mode=basic", (result) => {
          response = JSON.parse(result)
        });
    } catch(err) {
           console.log("err.message :", err.message);
           // triggerHint("Host not available", "error", 3000);
           response = false;
    } 

    return response ? true : false;
}

onSelectedHost = (hostIndex) => {
      let curHostObjEntry = findObjectByKeyValue(Settings.dsaServers, 'id', hostIndex.toString());
      setHostObjEntry(curHostObjEntry); // save current selected host info to currentHostCollectSelectionStates.hostObject
      var hostAPI = findObjectByKeyValue(Settings.dsaServers, 'id', hostIndex.toString()).hostAPI;
      setHostIndex(hostIndex);  
      if(lastHostCollectSelectionStates.hostIndex != hostIndex){
        if(lastHostCollectSelectionStates.hostIndex != null){
            lastHostCollectSelectionStates.hostChanged = true;
            document.getElementById("Host"+lastHostCollectSelectionStates.hostIndex).style.backgroundColor = Opts.defaultElemBgColor;
            document.getElementById("HostFont"+lastHostCollectSelectionStates.hostIndex).style.color = Opts.defaultElemFontColor;
            resetCurCollectionList(); 
        } else {
         //   To be added
        }
        document.getElementById("Host"+hostIndex).style.backgroundColor= Opts.selectedElemBgColor;
        document.getElementById("HostFont"+hostIndex).style.color = Opts.selectedElemFontColor;
        lastHostCollectSelectionStates.hostIndex = hostIndex;
        lastHostCollectSelectionStates.collectionIndex = null;
        if(isHostAvailable(hostAPI)){
            autoLogin(() => {
                               initCollectionsList(hostAPI, hostIndex)
                             })
        } else {
           triggerHint("Host not available", "error");
        }
       //   onSelectedCollection(hostIndex, 1)  // By default select first collection list of the tile
      }
} 

  /////////////////////////////////////////////
 // ---------- Channel Coloring ------------//
/////////////////////////////////////////////

RgbToHsl = (r,g,b) => {  // adopted from https://css-tricks.com/converting-color-spaces-in-javascript/
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    // Calculate hue
    // No difference
    if (delta == 0)
      h = 0;
    // Red is max
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
      h = (b - r) / delta + 2;
    // Blue is max
    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);
      
    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return "hsl(" + h + "," + s + "%," + l + "%)";  
}



HSLToRGB = (h,s,l) => {  // Adopted from https://css-tricks.com/converting-color-spaces-in-javascript/
  // e.g HSLToRGB(180,100,50)

    // convert s and l to fractions of 1
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "rgb(" + r + "," + g + "," + b + ")";
}

getRgbObject = (rgbString) => {
     var RGB={};

     if(rgbString.search('rgb')>=0){  
      // rgbArray ="#rgb(128,0,255)"      
      var rgbArray = rgbString;
      // rgbArray =[ "128", "0", "255" ]
      rgbArray = rgbArray.replace(/[^\d,]/g, '').split(',');
      var rgbKeys=["r","g","b"];
      // RGB={ r: 110, g: 255, b: 182 }      
      RGB=rgbKeys.reduce((obj, key, index) => ({ ...obj, [key]:parseInt(rgbArray[index]) }), {});
    }
    else{
        // RGB={ r: 110, g: 255, b: 182 }      
         RGB=hexToRgb(rgbString);
    }

    return RGB;
}

// Help:  To get hsl values:
getHslObject = (hslString) => {   // hsl is a string such that :  "hsl(180,100%,50%)"
    var HslObj={}
    hslArray = hslString.replace(/[^\d,]/g, '').split(',')
    // hslArray= [ "180", "100", "50" ]
    var hslKeys=["h","s","l"]
    HslObj=hslKeys.reduce((obj, key, index) => ({ ...obj, [key]:parseInt(hslArray[index]) }), {});

    return HslObj;    // HslObj= { h: "180", s: 1, l: 0.5 }
}

hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

RGBtoHEX = (rgb) => { //rgb(255,0,0)
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}


rgbObj2Str = (RGB) => {
    return "rgb("+RGB.r+","+RGB.g+","+RGB.b+")";
}

createContrastMaxArray = (grpColorArray) => {
    var contastMaxArray = [];
    grpColorArray.forEach( clr =>{ 
        var similarColorEntry = mapColorSimilarity(clr);
        contastMaxArray.push(similarColorEntry.contrast_Max);
    });

    return contastMaxArray;
}

createContrastMinArray = (grpColorArray) => {
    var contastMinArray = [];
    grpColorArray.forEach( clr =>{ 
        var similarColorEntry = mapColorSimilarity(clr);
        contastMinArray.push(similarColorEntry.contrast_Min);
    });

    return contastMinArray;
}


mapColorSimilarity = (curChColor) => { // Use this function to find closed color to current auto colored channel from colorContrastMap
    var similarity = Infinity;
    var similarColorIndex;
    var curChColorRgb = hexToRgb(curChColor);  
    colorContrastMap.forEach( (entry, index) => { 
        var colorMapRgb = hexToRgb(entry.color);
        var dist = rgbColorsDist(curChColorRgb, colorMapRgb);

        if(similarity > dist) { 
             similarity = dist;
             similarColorIndex = index;
          }
    });

    return colorContrastMap[similarColorIndex]
}

rgbColorsDist = (rgb1, rgb2) => {
   var dist = Math.sqrt(Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2));
   return dist;
 
}

createGrpColorsArray = (numOfFrames) => {
    var colorStep=Math.floor(360/numOfFrames); // 360 is HSL max hue
    var saturation=100;
    var lightness=50;
    var initHue=0;
    var colorsArray = [];
    for(let n = 0; n < numOfFrames; n++){
        var frameColorRgb = HSLToRGB(n * colorStep, saturation, lightness);
        colorsArray.push(RGBtoHEX(frameColorRgb));
    }

    return colorsArray;
}

// compositeFlag = false, shows layers without composite
reloadOSD = (curGroup, compositeFlag = true, compositeType = Opts.defaultCompositeOperation) => {
    let hostAPI = getHostApi();
    let item = getSelectedItem();
    let counter = 1;
    let min = 500; // default value
    let max = 30000; // default value  for contrast max
    clearOSDViewer();

    let numOfFrames = curGroup.Channels.length;

    for (let k = 0; k < numOfFrames; k++) {
      let frameNum = curGroup.Numbers[k];
      let palette1 = "rgb(0,0,0)";
      let palette2 = rgbObj2Str( hexToRgb(curGroup.Colors[k]) );
      //Check if the default of min/max are set... also want to add a dynamic widget here
      if (curGroup.Contrast_Min[k]) {
           min = curGroup.Contrast_Min[k];
      }
      // else { var min = 500; }
      if (curGroup.Contrast_Max[k]) {
           max = curGroup.Contrast_Max[k];
      }
      // else { max = 30000; }
      viewer.addTiledImage({
        tileSource: getOMETileSourceColored( hostAPI, item._id, frameNum, palette1, palette2, min, max),
        opacity: 1,
        width: currentItemInfo.width,
        success: (obj) => {
          if(compositeFlag){
              if ((counter == numOfFrames) && (numOfFrames > 1)) {
                   compositeFrames(curGroup, compositeType);
              }
              counter = counter + 1;
          }    
        }
      });
    }
}


compositeFrames = (curGroup, compositeType) => {
    let numOfFrames = curGroup.Channels.length;
    let topFrameIndex = numOfFrames - 1;

    if (numOfFrames > 1) {
      for (let i = topFrameIndex - numOfFrames + 1; i < topFrameIndex; i++) {
        let bottomFrameIndex = i;
        let topFrame = viewer.world.getItemAt(bottomFrameIndex + 1);
        topFrame.setCompositeOperation(compositeType);
      }
    } else {
           viewer.viewport.goHome();
    }
}

  ///////////////////////////////////////////////
 //------- Host and Collection initialion ----//
///////////////////////////////////////////////

initCollectionsList = (hostAPI, hostIndex) => { 
    var nodes="";
    document.getElementById("collectionsTitle").innerHTML="Collections:";    
    var collectList = getCollectionsList(hostAPI);
    currentHostCollectSelectionStates.collectionList = collectList;
    document.getElementById("collectionsList").innerHTML=""; 

    collectList.forEach( (collection, idx) => { 
       nodes +=  '<li style="background-color: none" id="colLi'+ hostIndex +'-'+ idx +'">';
       nodes +=      '<a href="javascript:void(0)" onclick="onSelectedCollection('+ hostIndex +','+ idx +')">';
       nodes +=         '<font style="font-size:0.77vw"  id="colFont'+ hostIndex +'-'+ idx +'">'+ collection.name +'</font>';
       nodes +=      '</a>';
       nodes +=  '</li>';
    });

    document.getElementById("collectionsList").innerHTML += nodes;
} 


initHostList = () => { 
    let nodes = "";
    document.getElementById("hostsList").innerHTML = ""; 

    Settings.dsaServers.forEach( server => {  
        let hostName = server.value; 
        let hostIndex = server.id;
        nodes +=  '<li style="background-color: none" id="Host'+ hostIndex +'">';
        nodes +=     '<a href="javascript:void(0)"  onclick="onSelectedHost('+ hostIndex +')">';
        nodes +=        '<font  style="font-size:0.77vw"  id="HostFont'+ hostIndex +'">'+ hostName +'</font>';
        nodes +=     '</a>';
        nodes +=  '</li>';
    });

    document.getElementById("hostsList").innerHTML += nodes;
}  

  //////////////////////////////////// 
 //------- Channel  initiation ----//
////////////////////////////////////

hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}



onChannelCheckboxClick = (channelIndex) => {
   let item =  getSelectedItem();
   var omeSceneDescription = item.meta.omeSceneDescription;
   console.log("channel index :", channelIndex);
   let channelEntry = findObjectByKeyValue(omeSceneDescription, 'channel_number', channelIndex)
   if(!tempSceneSelections.length) {
         tempSceneSelections.push( channelEntry);
         document.getElementById("ChannelCheckboxId"+channelIndex).innerHTML = '<i class="fa fa-check-square" >&nbsp&nbsp</i>';
   } else {
        var checkExistRecord = findObjectByKeyValue(tempSceneSelections, 'channel_number', channelIndex);

        if(checkExistRecord) {
          // if exist and clicked --> remove 
          tempSceneSelections.splice( tempSceneSelections.indexOf(checkExistRecord), 1 );
          document.getElementById("ChannelCheckboxId"+channelIndex).innerHTML = '<i class="fa fa-square" >&nbsp&nbsp</i>';

        } else {
          // if not exist and clicked --> add 
          tempSceneSelections.push( channelEntry );
          document.getElementById("ChannelCheckboxId"+channelIndex).innerHTML = '<i class="fa fa-check-square" >&nbsp&nbsp</i>';
        }
    }
}


 // e.g.:  https://styx.neurology.emory.edu/girder/api/v1/item/617866014874d4ffdf714700/tiles/zxy/0/0/0?edge=crop&frame=1&style={"min":1,"max":100,"palette":["rgb(0,0,0)","rgb(204,240,0)"]}
getOMETileSourceColored = (hostApi, _id, frame, palette1="rgb(0,0,0)", palette2="rgb(204,240,0)", min=100, max=65000) => {
   // palette1 format is  "%23000" or "rgb(0,0,0)"
    var tile = [];
    webix.ajax().sync().get(hostApi + "/item/" + _id + "/tiles", (data) => {
      tile = JSON.parse(data)
      tile['maxLevel'] = tile['levels'] - 1
      tile['minLevel'] = 0
      tile['width'] = tile['sizeX']
      tile['height'] = tile['sizeY']
      tile['getTileUrl'] = (level, x, y) => {
      return hostApi+"/item/" + _id + "/tiles/zxy/" + level + "/" + x + "/" + y + "?edge=crop&frame="+frame+"&style={%22min%22:"+min+",%22max%22:"+max+",%22palette%22:[%22"+palette1+"%22,%22"+palette2+"%22]}";
      }
    })

    return tile;
}


// function getOMETileSource(hostApi, _id, frame) {
//       var tile=[];
//       webix.ajax().sync().get(hostApi+"/item/" + _id + "/tiles", function(data) {
//             tile = JSON.parse(data)
//             tile['maxLevel'] = tile['levels'] - 1
//             tile['minLevel'] = 0
//             tile['width'] = tile['sizeX']
//             tile['height'] = tile['sizeY']
//             tile['getTileUrl'] = function(level, x, y) {
//             return hostApi+"/item/" + _id + "/tiles/fzxy/" + frame + "/" + level + "/" + x + "/" + y + "?redirect=false"
//              }
//       })
//     return tile
//  }

getOMETileSource = (hostApi, _id, frame) => {
      var tile=[];
      webix.ajax().sync().get(hostApi+"/item/" + _id + "/tiles", (data) => {
            tile = JSON.parse(data)
            tile['maxLevel'] = tile['levels'] - 1
            tile['minLevel'] = 0
            tile['width'] = tile['sizeX']
            tile['height'] = tile['sizeY']
            tile['getTileUrl'] = (level, x, y) => {
            return hostApi+"/item/" + _id + "/tiles/fzxy/" + frame + "/" + level + "/" + x + "/" + y + "?redirect=false"
             }
      })

    return tile;
 }




onSelectedChannel = (channelIndex) => {
           channelStates.currentIndex = channelIndex;  
           if(channelStates.lastIndex != channelIndex) {
              if(channelStates.lastIndex != null) {
                  channelStates.channelChanged = true;
                  document.getElementById("Channel" + channelStates.lastIndex).style.backgroundColor = Opts.defaultElemBgColor;
                  document.getElementById("ChannelFont" + channelStates.lastIndex).style.color = Opts.defaultElemFontColor;  
              }

          document.getElementById("Channel"+channelIndex).style.backgroundColor= Opts.selectedElemBgColor;
          document.getElementById("ChannelFont"+channelIndex).style.color = Opts.selectedElemFontColor;
          channelStates.lastIndex = channelIndex;

          // if tring to allocat DAPI channel 
          if( isActiveForm("DAPIChConfirmForm") ){
              // setSelectedDAPIChannelIndex(channelIndex);
              document.getElementById("DAPIChannelName").value = getChannelObjByIndex(channelIndex)[0].channel_name;
          }

          let hostAPI = getHostApi();
          let item = getSelectedItem();
          if (item.largeImage) {
              clearOSDViewer();
              viewer.addTiledImage({
                tileSource: getOMETileSource(hostAPI, item._id, channelIndex),
                opacity: 1,
                width: currentItemInfo.width, 
                success: (obj) => {
                     clearGrpBarRight();
                     resetGrpSelection();

                }
              });
           } 
      }
} 

getItemRootName = (itemName) => {
     let ItemRootName = itemName.split('.')[0];
     ItemRootName = ItemRootName.split('-')[0];
     ItemRootName = ItemRootName.split('_')[0];

     return ItemRootName;
}

initChannelList = (omeChannels, itemName) => { 
    let nodes = "";
    document.getElementById("channelList").innerHTML=""; 

    omeChannels.forEach( omeChannel => {
      let channelName = omeChannel.channel_name; 
      let channelNumber = omeChannel.channel_number;
      nodes +=  '<li style="background-color: none" id="Channel'+ channelNumber+'">';
      nodes +=    '<a href="javascript:void(0)" class="channelCheckboxClass" id="ChannelCheckboxId'+ channelNumber +'"  onclick="onChannelCheckboxClick('+ channelNumber +')">';
      nodes +=      '<i class="fa fa-square" >&nbsp&nbsp</i></a>';
      nodes +=    '<a href="javascript:void(0)"  onclick="onSelectedChannel('+ channelNumber +')">';
      nodes +=      '<font  style="font-size:0.77vw"  id="ChannelFont'+ channelNumber +'">'+ channelName +'</font></a>';
      nodes +=  '</li>';
    });

    document.getElementById("channelList").innerHTML += nodes;
    document.getElementById("channelsName").innerHTML = '<i style="font-size:1.4vw"  class="fa fa-th" ></i> &nbsp&nbsp' +getItemRootName(itemName) + " CHNL";
}  



  //---------- Detect Collision between divs --------//


  showBarExtension = (barId) => {
      let nodes = "";
      let panelId = barId.split("Bar")[0]; 
      let btnId = barId + "Btn";
      nodes += '<a href="javascript:void(0)" style ="font-size: 1.2vw; outline: none" id='+btnId+ ' onclick="togglePanel('+panelId+')"> <i class="fa fa-chevron-circle-left" aria-hidden="true"></i></a> '      


      nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="viewerZoomHome()"><i class="fa fa-home"></i></a>'
      nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="viewerZoomIn()"><i class="fa fa-search-plus"></i></a>'
      nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="viewerZoomOut()"><i class="fa fa-search-minus"></i></a>'
      nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="goToRemoteItem()"><i class="fa fa-cloud"></i></a>'

      if(barId === "itemTreeViewBar") {          
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="togglePanel('+"infoPanel"+')"><i class="fa fa-info-circle"></i></div></a>'
      }

      if(barId === "grpOptionsViewBar") {          
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="togglePanel('+"chPlotsPanel"+')"><i class="fa fa-bar-chart"></i></div></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="togglePanel('+"coordinates"+')"><i class="fa fa-map-marker"></i></div></a>'          
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="showHideAnalysisGrpChannels()"><i id="showHideAllGrpChls" class="fa fa-eye"></i></div></a>'                    
      }

      document.getElementById(barId).innerHTML = nodes;
  }
  
  showBarBasic = (barId) => {
      destroyBar(barId);
      showBar(barId);
  }
  
  initBar = (barId) => {
      let nodes = "";
      let panelId = barId.split("Bar")[0]; 
      let btnId = barId + "Btn";
      nodes += '<a href="javascript:void(0)" style ="font-size: 1.2vw; outline: none" id='+btnId+ ' onclick="togglePanel('+panelId+')"> <i class="fa fa-chevron-circle-left" aria-hidden="true"></i></a> '

      if(barId === "channelListViewBar") {
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="viewerZoomHome()"><i class="fa fa-home"></i></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="viewerZoomIn()"><i class="fa fa-search-plus"></i></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="viewerZoomOut()"><i class="fa fa-search-minus"></i></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="goToRemoteItem()"> <i class="fa fa-cloud"></i></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="openDAPIForm()"><div class="tooltip"><i class="fa fa-object-group"></i><span class="tooltiptext">Select</span></div></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="createNewGroup()"><div class="tooltip"><i class="fa fa-plus-circle"></i><span class="tooltiptext">Add</span></div></a>'
          nodes += '<a href="javascript:void(0)" style ="outline:none;" onclick="resetChannelCheckboxes()"><div class="tooltip"><i class="fa fa-undo"></i><span class="tooltiptext">Reset</span></div></a>'        
      }

      document.getElementById(barId).innerHTML = nodes;
  }

  //Function to toggle special bars such as  "channel plots" bars which has to show bars for specific operations e.g. Tumor-Immune-Stromal
  showSpecialBar = (panelId, showBarFlag = true) => {
      let specialBarId = panelId + "SpecialBar";

      if(document.getElementById(specialBarId)) { 
 
            if(showBarFlag) {
                        if(isElemRightSide(specialBarId)) {
                            document.getElementById(specialBarId).style.marginRight = "18.5vw";
                         } else {
                            document.getElementById(specialBarId).style.marginLeft = "15vw";
                         }   
            } else {
                       if(isElemRightSide(specialBarId)) {
                            document.getElementById(specialBarId).style.marginRight = "-18vw";
                        } else {
                            document.getElementById(specialBarId).style.marginLeft = "-18vw";
                        }  
            }  
       } 
  }  

  showBar = (panelId, showPanelFlag = true) => {
      let barId = panelId + "Bar";

      if(document.getElementById(barId)) { // Need this check because infoPanel and chColorContrastPanel have no Bars
            if(!document.getElementById(barId).children.length) { //If right Bar empty
                initBar(barId);
            }    
            if(showPanelFlag) {
                        if(isElemRightSide(panelId)) {
                            document.getElementById(barId).style.marginRight = "18.5vw";
                            document.getElementById(barId+"Btn").innerHTML = '<i class="fa fa-chevron-circle-right" aria-hidden="true"></i>'
                         } 
                        else {
                            document.getElementById(barId).style.marginLeft = "15vw";
                            document.getElementById(barId+"Btn").innerHTML = '<i class="fa fa-chevron-circle-left" aria-hidden="true"></i>'     
                            }   
            } else {
                       if(isElemRightSide(panelId)) {
                            document.getElementById(barId).style.marginRight = "0vw";
                            document.getElementById(barId+"Btn").innerHTML = '<i class="fa fa-chevron-circle-left" aria-hidden="true"></i>'
                        } 
                       else {
                            document.getElementById(barId).style.marginLeft = "0vw";
                            document.getElementById(barId+"Btn").innerHTML = '<i class="fa fa-chevron-circle-right" aria-hidden="true"></i>'     
                           }  
                 }  
       } 

                
  } 

  destroyBar = (barId) => {
      document.getElementById(barId).innerHTML = "";
  }    

 // showPanel V1 - old version - to be delected
  showPanel_V1 = (panelId, showPanelFlag = true) => {

      if(showPanelFlag) {
           if(isElemRightSide(panelId)) {
              document.getElementById(panelId).style.marginRight = "1vw";
           } else {
              document.getElementById(panelId).style.marginLeft = "1vw";          
           }
      } else {
           if(isElemRightSide(panelId)) {
              document.getElementById(panelId).style.marginRight = "-18vw";
           } else {
              document.getElementById(panelId).style.marginLeft = "-15.5vw";   
           }

           if(panelId === "chColorContrastPanel"){ 
                curChColorContrastStates = []; 
            }         
      }
      showBar(panelId, showPanelFlag);
  } 

 // showPanel V2
  showPanel = (panelId, showPanelFlag = true) => {

         if(showPanelFlag) {
             if(panelId === "coordinates" || panelId === "cellNavigator") { 
                  document.getElementById(panelId).style.display = "grid";
                  return 0;
              } 

             if(panelId === "chPlotsPanel") { 
                  // Hide special bar for channel plots panel, if panel need to hide
                  // Speical bar only show on specific operations such as Tumor-Immune-Stromal selection
                  
                  if(getSelectedChartOperation() === getActiveOperationOnScreen()) {
                     let activeOperationEntry = chartOperationsList.filter( operation => operation.type === getActiveOperationOnScreen())[0];

                     if(activeOperationEntry.hasSpecialBar) {
                         showSpecialBar(panelId, showPanelFlag);
                     }
                  }
              }                                  

             if(isElemRightSide(panelId)) {
                document.getElementById(panelId).style.marginRight = "1vw";
             } else {
                document.getElementById(panelId).style.marginLeft = "1vw";          
             }
         } else { // if hide panel

             if(panelId === "coordinates" || panelId === "cellNavigator") { 
                  document.getElementById(panelId).style.display = "none";
                  return 0;
              } 

             if(panelId === "chPlotsPanel") { 
                  // Hide special bar for channel plots panel, if panel need to hide
                  // Speical bar only show on specific operations such as Tumor-Immune-Stromal selection
                  showSpecialBar(panelId, showPanelFlag);
              }               

             if(isElemRightSide(panelId)) {
                document.getElementById(panelId).style.marginRight = "-18vw";
             } else {
                document.getElementById(panelId).style.marginLeft = "-15.5vw";   
             }

             if(panelId === "chColorContrastPanel") { 
                  curChColorContrastStates = []; 
             }         
        }

     showBar(panelId, showPanelFlag);
   
             
  }   

  // function isPanelRightSide(panelId){
  //     let panel = document.getElementById(panelId)
  //     let rightPos = parseInt(window.getComputedStyle(panel, null).getPropertyValue("right").split("vw")[0])
  //     let leftPos  = parseInt(window.getComputedStyle(panel, null).getPropertyValue("left").split("vw")[0])
  //     return  (rightPos < leftPos)||(leftPos>(screen.width/2))?  true : false; 
  //  }

  // For future use
  isElemMiddleOnScreen = (elemId) => {
      let elem = document.getElementById(elemId);
      let leftPos = elem.getBoundingClientRect().left;
      let rightPos  = elem.getBoundingClientRect().right;
      return ((leftPos+rightPos) / 2 > screen.width * 2 / 5) && ((leftPos+rightPos) / 2 < screen.width * 3 / 5) ?  true : false; 
   }

  isElemRightSide = (elemId) => {
      let elem = document.getElementById(elemId);
      let leftPos = elem.getBoundingClientRect().left;
      let rightPos  = elem.getBoundingClientRect().right;
      return ((leftPos+rightPos) / 2 > screen.width / 2) ?  true : false;

   }   



  // e.g. "coordinates" panel in Analysis layout      
  // isMiddlePanelActive = (panelId) => {
  //       return  document.getElementById(panelId).style.display != "none" ? true : false;
  // }      


  isPanelActive = (panelId) => {
      let panel = document.getElementById(panelId);

           if(panelId === "coordinates" || panelId === "cellNavigator") {  // "coordinates" panel is a middle panel in Analysis layout  
                return  document.getElementById(panelId).style.display == "grid" ? true : false;
            }   

           // For all left and right panels in all layouts
          if(isElemRightSide(panelId)) {
             let marginRightValue = parseInt(panel.style.marginRight.split("vw")[0]);
             return marginRightValue >= 0 ? true : false;
           } else {
             let marginLeftValue = parseInt(panel.style.marginLeft.split("vw")[0]);
             return marginLeftValue >= 0 ? true : false;
          }
  }

  togglePanel = (panel) => {
      if(isPanelActive(panel.id)) {
          showPanel(panel.id, false);
      } else {
          showPanel(panel.id, true);
      }

  }

  // toggleMiddlePanel = (panel) => {
  //     if(isMiddlePanelActive(panel.id)) {
  //         showPanel(panel.id, false);
  //     } else {
  //         showPanel(panel.id, true);
  //     }

  // }

  openBrowseLayout = () => {
       if( getSelectedItem() ){
            onCurTileSourceClick();
        }

        showPanel("itemTreeView");
        showPanel("hostCollectView");
        document.getElementById("onlineDemoBtn").style.color = "gray"; 
       if(getActiveLayout()){
         showBarExtension("itemTreeViewBar");
       }
       // check for flask restApi is running..
       if(! isRestApiAvailable() ){
            triggerHint("Flask app is not responding, try to restart it... ","info", 10000); 
       }

       // Check if JS ES6 Version supported..
       if(! isJsES6VerSupported() ){
            triggerHint("Browser does not support JS ES6 version, for supported browsers please refer to https://caniuse.com/es6", "info", 10000);
            // triggerHint("Flask app is not responding, try to restart it... ","info", 10000); 
       }       

       return  true;    
  }

  hideLayout = (layoutId) => {
        let allLayoutPanels = document.querySelectorAll('div[layout="'+layoutId+'"]');
        allLayoutPanels.forEach( panel => {
             showPanel(panel.id, false);
             if(document.getElementById(panel.id +"Bar")){ 
                destroyBar(panel.id +"Bar");
             }
         })

        let allLayoutForms =  document.querySelectorAll('div[layout="'+layoutId+ " Form" +'"]');
        allLayoutForms.forEach( form => {
             if( isActiveForm(form.id) ) {
                  document.getElementById(form.id).style.display = "none";
                  resetActiveFormState();
             }
         })        
        // if( getActiveForm() ) {
        //     let formId = getActiveForm().id;

        //     resetActiveFormState();
        // }
  }

  openLayout = (layoutId) => {
       if(!isLayoutActive(layoutId)) {
           let functionName = "open" + layoutId + "Layout"; 
           let param = null; 
           let returnValue = callFunctionByName(functionName, param);

           if(returnValue) {
               if( getActiveLayout() ) {
                       hideLayout(getActiveLayout());
               }              
               setActiveLayout(layoutId);
            }
       }    
  }


 //----------- Toolbar options --------------- //
    getLayoutRightPanelId = () => {
      switch(getActiveLayout()){
               case "Browse":
                     return "hostCollectView" ;
               case "Design":
                     return "grpListView";
               case "Analysis":
                     return "grpFeaturesView";                     
               default:
                     return  null;          
      }      

    }

    getLayoutLeftPanelId = () => {
      switch(getActiveLayout()){
               case "Browse":
                     return "itemTreeView" ;
               case "Design":
                     return "channelListView";
               case "Analysis":
                     return "grpOptionsView";                      
               default:
                     return  null;          
      }      

    }

    getElemTopPos = (id) => {
       return  document.getElementById(id).getBoundingClientRect().top;
    } 

    getElemLeftPos = (id) => {
       return  document.getElementById(id).getBoundingClientRect().left;
    }

    getElemBottomPos = (id) => {
       return  document.getElementById(id).getBoundingClientRect().bottom;
    }     

    getElemRightPos = (id) => {
       return  document.getElementById(id).getBoundingClientRect().right;
    } 



    isMenuPanelOverlap = (dropMenuId, panelId) => {
         var sideElemId    =  document.getElementById(panelId+"Bar") ? panelId+"Bar" : panelId ;
         var sideTopPos    =  getElemTopPos(sideElemId);  
         var menuBottomPos =  getElemBottomPos(dropMenuId); 

         if(isElemRightSide(dropMenuId)) {
               var sideLefttPos   =  getElemLeftPos(sideElemId);  
               var menuRighttPos  =  getElemRightPos(dropMenuId);     
               return (sideTopPos <= menuBottomPos) && (sideLefttPos <= menuRighttPos) ? true : false;             
         } else {
               var sideRightPos  =  getElemRightPos(sideElemId);  
               var menuLefttPos  =  getElemLeftPos(dropMenuId); 
               return (sideTopPos <= menuBottomPos) && (sideRightPos >= menuLefttPos) ? true : false;             
         }             

    }

    // function isElementsOverlap(el1, el2){
    //    return (getElemTopPos(el1)  <= getElemBottomPos(el2) ) && (getElemRightPos(el1) >= getElemLeftPos(el2) ) ? true : false;
    // }    

    navManuMouseOut = () => {
      var panelId = getLayoutLeftPanelId();
      if(panelId && !isPanelActive(panelId)){
          if(screenStatus.panelActiveState){
                showPanel(panelId);
          }      
       }    
   } 
   
   navMenuBtnClicked = (dropMenuId) => {
      if(isElemRightSide(dropMenuId)){
         var panelId = getLayoutRightPanelId();      
      }else{
         var panelId = getLayoutLeftPanelId(); 
      }
         
      if(panelId && isPanelActive(panelId) && isMenuPanelOverlap(dropMenuId, panelId)){ 
          screenStatus.panelActiveState = true;        
          showPanel(panelId, false);
      }else{
         screenStatus.panelActiveState = false;  
      } 
   }  


   //-----------View Manu -------//
     showHidePanels = () => {
       triggerHint("TO be coded")
     }
     showHideCoordinates = () => {
       triggerHint("TO be coded")
     }
    
    //----------Demo ------------//
     demoDesignLayout = () => {
      openLayout("Design")      
      document.getElementById("modeDropDownMenu").style.display=""
    }    
     demoModeMenuSelect = () => {
      document.getElementById("modeDropDownMenu").style.display="block"
    }

     demoItemSelect = () => {
      document.getElementById("file_5e361da534679044bda81b16").click();
    }

    demoFolderSelect = () => {
      document.getElementById("folderFont_5e361c5c34679044bda81b11").click();
    }

    runDemo = () => {
      if(!getActiveLayout()){
        var demo = [];
        var i=0;
        demo.push(
                 {fun: "onSelectedHost", param: 3, time: 2000},
                 {fun: "onSelectedCollection", param: [3, 3], time: 2000},
                 {fun: "demoFolderSelect", param: null, time: 2000},
                 {fun: "demoItemSelect", param: null, time: 2000},
                 {fun: "demoModeMenuSelect", param: null, time: 2000},
                 {fun: "demoDesignLayout", param: null, time: 2000},
                 {fun: "pageReload", param: null, time: 2000}
                 )
        openLayout("Browse");
        var repeater = setInterval(() => {
          try {
            callFunctionByName(demo[i].fun, demo[i].param); 
            i = i + 1;
            if(i == demo.length) clearInterval(repeater)
          }catch(err){
                 triggerHint(err.message, "error", 3000);
                 clearInterval(repeater)
          }     

        }, 2000);  

      }else{
            triggerHint(" Showing Demo needs page reload");
      }

    }



   advancedMode = () => {
       triggerHint("Will be available with Version 2.0.0");
   }

   goToDsaServerPage = () => {
       window.open("https://github.com/DigitalSlideArchive/digital_slide_archive/blob/master/ansible/README.rst"); 
   }

   initDemoFormContent = () => {
      var node = ""
      node += "<video width='100%'  controls>  <source src='Demo/offlineDemo.mp4' type='video/mp4'></video>"
      document.getElementById("demoContent").innerHTML = node;
   }

   closeDemoForm = () => {
        document.getElementById("demoForm").style.display = "none";
   }

   toggleOfflineDemoForm = () => {
       initDemoFormContent();
       var demoFormElem = document.getElementById("demoForm");
       if(demoFormElem.style.display === "block") {
             demoFormElem.style.display = "none";
        }     
       else{
             demoFormElem.style.display = "block";
             getElementCenterOnScreen(demoFormElem);
           }  
   }   


 // --------Toolbar Settings Form Tabs----------//
    pageReload = () => {
       window.location.reload();
    }


   openSettingsTab = (tabName, elm, color) => {
        var tabContent = document.getElementsByClassName("tabcontent");

        // for (let i = 0; i < tabcontent.length; i++) {
        for(let content of tabContent) { 
           content.style.display = "none";
        }

        var tabLinks = document.getElementsByClassName("tablink");

        // for (let i = 0; i < tablinks.length; i++) {
        for(let link of tabLinks){  
            link.style.backgroundColor = "";
        }

        document.getElementById(tabName).style.display = "block";
        elm.style.backgroundColor = color;
    }

    //--- Check Path  availability----------//
   UrlExists = (url, cb) =>{
      jQuery.ajax({
          url:      url,
          type:     'GET',
          dataType: 'jsonp',                   
          complete:  (xhr) =>{
              if(typeof cb === 'function')
                 cb.apply(this, [xhr.status]);
          }
      });
   }


   openSettingsForm = () => { 
       if(!getActiveForm()){
          var form = document.getElementById("settingsForm")
          form.classList.remove("formflashanimation"); 
          form.style.display = "block";
          initSettingsFormServerList();
          initSettingsFormOptionsList();  
          initSettingsFormInterfaceList();            
          initSettingsFormChangeStates();        
          getElementCenterOnScreen(form);
          document.getElementById("defaultOpenSettingsTab").click();
          setActiveForm(form);

          if(isScreenLogoActive()){
             hideScreenLogo();          
          }   
        } else {
            getActiveForm().classList.toggle("formflashanimation");
        }    
  }

  closeSettingsForm = () => {
      let settingsForm = document.getElementById("settingsForm");
      settingsForm.style.display = "none";      
      cancelSettingsFormChanges();        
      resetActiveFormState();

      if( isScreenLogoActive() ) { 
          showScreenLogo();
      }         
  }

  deleteServerFromSettings = (serverIndex) => {
        let serverToRemove = Settings.dsaServers[serverIndex];

        if(parseInt(serverToRemove.id) == getHostIndex()) {
          triggerHint("Removing current in use server will reload the page", "error", 3000);
        }

        tempServerRemoved.push({id: parseInt(serverToRemove.id), hostApi: serverToRemove.hostAPI })
        removeArrayElem(Settings.dsaServers, serverToRemove);
        initSettingsFormServerList();
        flagServerChanges();
   }

  checkAutoLoginToRemovedServer = (callback) => {
        if(tempServerRemoved.length) {

          tempServerRemoved.forEach( server => {
               removeHostCredentials(server.id , server.hostApi);
          });

        }

        callback();
  }

   maintainCurHostSelection = (hostIndex) => {
          document.getElementById("Host" + hostIndex).style.backgroundColor = Opts.selectedElemBgColor;
          document.getElementById("HostFont" + hostIndex).style.color = Opts.selectedElemFontColor;
   }

   highlightListSelection = (listId, fontId) => {
          document.getElementById(listId).style.backgroundColor = Opts.selectedElemBgColor;
          document.getElementById(fontId).style.color = Opts.selectedElemFontColor;
   } 

   resetListSelection = (listId, fontId) => {
         document.getElementById(listId).style.backgroundColor = Opts.defaultElemBgColor;
         document.getElementById(fontId).style.color = Opts.defaultElemFontColor; 
   } 

   confirmServerListChangesInSettings = () => {
         cacheServerListLocal();
         checkAutoLoginToRemovedServer(() => {
            let curServerIndex = findObjectByKeyValue(Settings.dsaServers, 'id', getHostIndex().toString(), 'INDEX');

            if( curServerIndex == null){
               pageReload();
             } else {
               initHostList( );
               maintainCurHostSelection(Settings.dsaServers[curServerIndex].id);
               resetActiveFormState();
               resetTempRemovedServerList();
             }
         })
    } 

    resetTempRemovedServerList = () => {
          tempServerRemoved = [];
    }

    restorDefaultServerListForSettings = () => {
         Settings.dsaServers = JSON.parse( JSON.stringify( DSA_SERVER_LIST ) ) ; // to copy obj without reference
         initSettingsFormServerList();
         resetTempRemovedServerList();
         flagServerChanges();
    }     

    cancelServerListChangesInSettings = () => {
         Settings.dsaServers = initServerList();
         initSettingsFormServerList();
         resetTempRemovedServerList();
    }   

    cacheServerListLocal = () => {
          webix.storage.local.put("serverList",Settings.dsaServers);
    }      

    fetchCachedServerList = () => {
          return webix.storage.local.get("serverList");
    }  

    checkServerDuplication = (newServerName, newServerPath) => {
         // if there is a duplication, and user want to rename server name, must delecte the old one first and then add new server name
         var duplicateNameIndex = findObjectByKeyValue(Settings.dsaServers, 'value', newServerName, 'INDEX');
         var duplicatePathIndex = findObjectByKeyValue(Settings.dsaServers, 'hostAPI', newServerPath, 'INDEX');

         if((duplicateNameIndex == null) && (duplicatePathIndex == null)) {
               return true;  // No duplication   
         } else {
               return false;  // There is a duplication 
         }
   } 

   getNewId = (idSeed, callback) => {
       // Help assigning new Id to a new server added to the server list with Settings.dsaServers.
       var newId = findObjectByKeyValue(Settings.dsaServers, 'id', idSeed.toString(), 'INDEX');

       if(newId == null){
             callback(idSeed.toString());  // No id duplication   
       } else {
             idSeed = idSeed +1;
             getNewId(idSeed, callback);  // There is a duplication 
       }
   }   

   addServerToSettings = () => {
       var newServerName = document.getElementById("newServerNameText").value.trim();
       var newServerPath = document.getElementById("newServerPathText").value.trim();

       if((newServerName !== "") && (newServerPath !== "")) {
          if(checkServerDuplication(newServerName, newServerPath)){
             webix.ajax()
              .get(`${newServerPath}/collection`)
              .fail(parseError)
              .then(result => {
                                 getNewId(1,  (newId) => {  
                                    Settings.dsaServers.push({id: newId, value: newServerName, hostAPI: newServerPath});
                                    initSettingsFormServerList()
                                    flagServerChanges();
                                 }) 
                            });
          }else{
               triggerHint("List Duplication Found","error", 3000)
          }
       }
   } 

   initServerList = () => {
        return fetchCachedServerList() !== null ? fetchCachedServerList(): JSON.parse( JSON.stringify( DSA_SERVER_LIST ) ) ; // to copy obj without reference
        
  }
 


    initSettingsFormServerList = () => { 
        var serverNode = "";
        serverNode += '<table style = "border-spacing: 0.25vw; font-size:0.7vw">'
        serverNode += '<colgroup> <col style="width:25%"><col style="width:70%"> <col style="width:5%"></colgroup>' 
        serverNode +=  '<tr >'
        serverNode +=    '<th style="text-align: center; border: 0vw solid black; padding: 0.45vh">' + "Server" + '</th>'      
        serverNode +=    '<th style="text-align: center; border: 0vw solid black; padding: 0.45vh">' + "Path" + '</th>' 
        serverNode +=    '<th style="text-align: center; border: 0vw solid black; padding: 0.45vh">'
        serverNode +=      '<a href="javascript:void(0)" onclick="restorDefaultServerListForSettings()"><i style="font-size:0.7vw" class="fa fa-undo" ></i></a>'
        serverNode +=    '</th>'           
        serverNode +=  '</tr>' 

        Settings.dsaServers.forEach((server, idx) => {
          var serverName = server.value; 
          var serverPath = server.hostAPI;           

          serverNode +=  '<tr >'
          serverNode +=    '<th style="text-align: left; border: 0.05vw solid black; padding: 0.45vh ">'
          serverNode +=        ' <font style="font-size:0.62vw"  >'+ serverName+'</font>'
          serverNode +=    '</th>'

          serverNode +=    '<th style="text-align: left; border: 0.05vw solid black; padding: 0.45vh">'
          serverNode +=        '<font style="font-size:0.62vw" >'+ serverPath+'</font>'
          serverNode +=    '</th>'

          serverNode +=    '<th style="text-align: center; border: 0.05vw solid black; padding: 0.45vh">'
          serverNode +=      '<a id="deleteServer'+ idx +'" href="javascript:void(0)" onclick="deleteServerFromSettings('+ idx +')"><i style="font-size:0.7vw" class="fa fa-minus-circle" ></i></a>'
          serverNode +=    '</th>'
          serverNode +=  '</tr>'          
        });

        if(Settings.dsaServers.length < Opts.maxhostListWithSettings){
          serverNode +=  '<tr >'
          serverNode +=    '<th style="margin-Left: 0vw; text-align: left; border: 0.05vw solid black; padding: 0.45vh ">'
          serverNode +=        '<input type="text" id="newServerNameText" style="margin-Left: 0vw; margin-Top: 0vh; width: 100%"  placeholder="Name...">'
          serverNode +=    '</th>'

          serverNode +=    '<th style="text-align: center; border: 0.05vw solid black; padding: 0.45vh">'
          serverNode +=        '  <input type="text" id="newServerPathText" style="margin-Left: 0vw; margin-Top: 0vh; width: 100%"  placeholder="Path...">'
          serverNode +=    '</th>'

          serverNode +=    '<th style="text-align: center; border: 0.05vw solid black; padding: 0.45vh">'
          serverNode +=      '<a  href="javascript:void(0)" onclick="addServerToSettings()"><i style="font-size:0.7vw" class="fa  fa-plus-square" ></i></a>'
          serverNode +=    '</th>'
          serverNode +=  '</tr>'         
         }
 
         serverNode += '</table>' 

         serverNode += '<table style=" position:absolute; bottom: 1.7vh;" >'    

         serverNode +=  '<tr >'  
         serverNode +=    '<td colspan="3">'
         serverNode +=       '<a  href="javascript:void(0)" onclick="confirmSettingsFormChanges()"><i style="font-size:1.4vw; padding: 2.1vh"    class="fa fa-check-circle"></i></a>'
         serverNode +=     '</td>'
         serverNode +=   '</tr>'   

         serverNode += '</table>' 

        document.getElementById("settingsFormServerList").innerHTML = serverNode;    
    }     

  optionsListDefaultValues = () => {
      var defaultOptions = [];
      defaultOptions.push({
                           optionId: "optionId.AutoLogin"  , optionValue: true}
                         );
      return defaultOptions;
  }

  confirmOptionsListChangesInSettings = () => {
       resetActiveFormState();
       cacheOptionsListLocal()
  }

  cancelOptionsListChangesInSettings = () => {
       Settings.options= initOptionsList()
       initSettingsFormOptionsList();
  } 

  queryElemValueAttribute = (elem) => {
       switch (elem.tagName){
             case "INPUT":
                switch (elem.type){
                    case 'checkbox':
                     return "checked";
                    case 'number':
                     return "value"; 
                    case 'radio':  
                     return "checked"; 
                    case 'range':
                     return "value"; 
                    case 'text':
                     return "value";                  
                }
             case "SELECT":
                     return "value";
             default:
                     return null;                    
       }   
  }    

  queryElemTypeValue = (elem) => {
       switch (elem.tagName){
             case "INPUT":
                switch (elem.type){
                    case 'checkbox':
                     return elem.checked;
                    case 'number':
                     return elem.value; 
                    case 'radio':
                     return elem.checked; 
                    case 'range':
                     return elem.value; 
                    case 'text':
                     return elem.value;                  
                }
             case "SELECT":
                     return elem.options[elem.selectedIndex].value;
             default:
                     return null;                    
       }   
  }  

  optionChanged = (id) => {
        var elem = document.getElementById(id);
        var elemTag = elem.tagName;
        var elemValue = queryElemTypeValue(elem);
      
        if ((elemValue != null) || (elemValue !== null)) {
           var elemIndex = findObjectByKeyValue(Settings.options, 'optionId', id, 'INDEX');

           if(elemIndex != null) {
                 var elemToRemove = Settings.options[elemIndex];
                 removeArrayElem(Settings.options, elemToRemove);
           } 

           if(elemTag === "INPUT"){
                Settings.options.push({optionId: id  , optionValue: elemValue});
           }     
           if(elemTag === "SELECT"){
                Settings.options.push({optionId: id  , optionValue: elemValue, selectedIndex: elem.selectedIndex});
           }     

           flagOptionChanges();               
        } else {
             // for debug mode 
             triggerHint(" Improper selection of option element", "error", 5000);
        }
  }

  isAutoLoginEnabled = () => {
           var elemIndex = findObjectByKeyValue(Settings.options, 'optionId', "optionId.AutoLogin", 'INDEX')
           return Settings.options[elemIndex].optionValue;
  }

  loadOptionListValues = () => {
    var elem;
    var elemValue;
    Settings.options.forEach( option => {
        elem = document.getElementById(option.optionId);
        elemValue = option.optionValue;
       
        if(elem.tagName === "INPUT"){
              elem[queryElemValueAttribute(elem)] = elemValue;
         }     
        if(elem.tagName === "SELECT"){
              elem.options[option.selectedIndex][queryElemValueAttribute(elem)] = elemValue;
         }     
    });

  }

  cacheOptionsListLocal = () => {
        webix.storage.local.put("optionsList",Settings.options);
  }    

  fetchCachedOptionsList = () => {
        return (webix.storage.local.get("optionsList")!= null) && Array.isArray(webix.storage.local.get("optionsList")) ? 
                           webix.storage.local.get("optionsList") : optionsListDefaultValues();
  }  


   initOptionsList = () => {
        return fetchCachedOptionsList();
  }


  initSettingsFormOptionsList = () => { 
        var optionsNode = "";
        optionsNode += '<fieldset> <legend>Account:</legend>'       
        optionsNode += '<table id="optionsListTable" style = "border-spacing: 0.25vw; font-size:0.7vw">'
        optionsNode += '<colgroup> <col style="width:10%"><col style="width:90%"> </colgroup>' 
        optionsNode +=  '<tr >'
        optionsNode +=    '<th style="text-align: center; border: 0vw solid black; padding: 0.42vh">'
        optionsNode +=      '<input type="checkbox" style="margin-Left: 0vw; margin-Top: 0vw; width: 100%"  id="optionId.AutoLogin" onchange="optionChanged(this.id)"> '
        optionsNode +=    '</th>'  
        optionsNode +=    '<th style="text-align: left; border: 0vw solid black; padding: 0.42vh">' + "Enable Auto-Login for hosts." + '</th>' 
        optionsNode +=  '</tr>' 
        optionsNode += '</table>' 
        optionsNode += '</fieldset>'         
        optionsNode += '<table style=" position:absolute; bottom: 1.7vh;" >'        
        optionsNode +=  '<tr >'  
        optionsNode +=    '<td colspan="2">'
        optionsNode +=       '<a  href="javascript:void(0)" onclick="confirmSettingsFormChanges()"><i style="font-size:1.4vw; padding: 2.1vh"    class="fa fa-check-circle"></i></a>'
        optionsNode +=     '</td>'
        optionsNode +=   '</tr>'   
        optionsNode += '</table>' 
        document.getElementById("settingsFormOptionsList").innerHTML = optionsNode;  
        loadOptionListValues()  
    }  


//-------------- Interface Tab ------------//
  interfaceListDefaultValues = () => {
          var defaultInterfaceListValues = [];
          defaultInterfaceListValues.push(
                                       {interfaceId: "interfaceId.PanelsOpacity"  , interfaceValue: 0.5, rootVar: '--div-opacity' },
                                       {interfaceId: "interfaceId.FormsOpacity"   , interfaceValue: 0.5, rootVar: '--form-opacity'}
                                     );
          return defaultInterfaceListValues; 
  }

  updateInterface = (id = null) => {
     if(id !== null) {
            let interfaceEntry =  Settings.interface.filter(entry => entry.interfaceId === id);
            document.documentElement.style.setProperty(interfaceEntry[0].rootVar, interfaceEntry[0].interfaceValue);
     } else {
            Settings.interface.forEach( entry => {
              document.documentElement.style.setProperty(entry.rootVar, entry.interfaceValue);              
            })

     }
  }    

  confirmInterfaceListChangesInSettings = () => {
       resetActiveFormState();
       cacheInterfaceListValuesLocal();
  }

  cancelInterfaceListChangesInSettings = () => {
       Settings.interface = initInterfaceList();
       initSettingsFormInterfaceList();
       updateInterface();
  } 


  interfaceChanged = (id) => {
        var elem = document.getElementById(id);
        var elemTag = elem.tagName;
        var elemValue = queryElemTypeValue(elem);
      
        if ((elemValue != null) || (elemValue !== null)) {
           Settings.interface.filter(entry => entry.interfaceId === id)[0]['interfaceValue'] = elemValue;
           flagInterfaceChanges();  
           updateInterface(id);             
        } else {
             // for debug mode 
             triggerHint(" Improper selection of interface element", "error", 5000)
        }
  }

  loadInterfaceListValues = () => {
        var elem;
        var elemValue;

        Settings.interface.forEach( interface => {
            elem = document.getElementById(interface.interfaceId);
            elemValue = interface.interfaceValue;
           
            if(elem.tagName === "INPUT"){
                  elem[queryElemValueAttribute(elem)] = elemValue;
             }     

            if(elem.tagName === "SELECT"){
                  elem.options[interface.selectedIndex][queryElemValueAttribute(elem)] = elemValue;
             }     
        });
  }

  cacheInterfaceListValuesLocal = () => {
        webix.storage.local.put("interfaceList",Settings.interface);
  }    

  fetchCachedInterfaceListValues = () => {
        return (webix.storage.local.get("interfaceList")!= null) && Array.isArray(webix.storage.local.get("interfaceList")) ? 
                           webix.storage.local.get("interfaceList") : interfaceListDefaultValues();
  }  


   initInterfaceList = () => {
        return fetchCachedInterfaceListValues();
  }



    initSettingsFormInterfaceList = () => { 
        var interfaceNode = "";
        interfaceNode += '<fieldset> <legend>Opacity:</legend>'       
        interfaceNode += '<table id="interfaceListTable" style = "border-spacing: 0.25vw; font-size:0.7vw">'
        interfaceNode += '<colgroup> <col style="width:15%"><col style="width:85%"> </colgroup>' 
        interfaceNode +=  '<tr >'
        interfaceNode +=    '<th style="text-align: center; border: 0vw solid black; padding: 0.42vh">'
        interfaceNode +=      '<input type="number" step="0.1" min ="0"  max="1" style="margin-Left: 0vw; margin-Top: 0vw; width: 100%"  id="interfaceId.PanelsOpacity" onchange="interfaceChanged(this.id)"> '
        interfaceNode +=    '</th>'  
        interfaceNode +=    '<th style="text-align: left; border: 0vw solid black; padding: 0.42vh">' + "Left and Right Panels Opacity" + '</th>' 
        interfaceNode +=  '</tr>' 

        interfaceNode +=  '<tr >'
        interfaceNode +=    '<th style="text-align: center; border: 0vw solid black; padding: 0.42vh">'
        interfaceNode +=      '<input type="number" step="0.1" min ="0"  max="1" style="margin-Left: 0vw; margin-Top: 0vw; width: 100%"  id="interfaceId.FormsOpacity" onchange="interfaceChanged(this.id)"> '
        interfaceNode +=    '</th>'  
        interfaceNode +=    '<th style="text-align: left; border: 0vw solid black; padding: 0.42vh">' + "Forms Opacity" + '</th>' 
        interfaceNode +=  '</tr>'         

        interfaceNode += '</table>' 
        interfaceNode += '</fieldset>'         

        interfaceNode += '<table style=" position:absolute; bottom: 1.7vh;" >'        
        interfaceNode +=  '<tr >'  
        interfaceNode +=    '<td colspan="2">'
        interfaceNode +=       '<a  href="javascript:void(0)" onclick="confirmSettingsFormChanges()"><i style="font-size:1.4vw; padding: 2.1vh""    class="fa fa-check-circle"></i></a>'
        interfaceNode +=     '</td>'
        interfaceNode +=   '</tr>'   

        interfaceNode += '</table>' 

        document.getElementById("settingsFormInterfaceList").innerHTML = interfaceNode;  
        loadInterfaceListValues()
    
    } 





  confirmSettingsFormChanges = () => {
     // var settingsForm = document.getElementById("settingsForm");
     // settingsForm.style.display = "none";
     if(isServerListChanged()) {      
        confirmServerListChangesInSettings();     
     } 

     if(isOptionsListChanged()) {  
        confirmOptionsListChangesInSettings();
     } 

     if(isInterfaceListChanged()) {  
        confirmInterfaceListChangesInSettings();      
     } 
     
     closeSettingsForm();
  }  
 
  cancelSettingsFormChanges = () => {
     if(isServerListChanged()) {    
        cancelServerListChangesInSettings();
     }   
     if(isOptionsListChanged()) {     
        cancelOptionsListChangesInSettings();
     }   
     if(isInterfaceListChanged()) {     
        cancelInterfaceListChangesInSettings();      
     }   
  }

  initSettingsFormChangeStates = () => {
           Settings.serverListChanges = false;
           Settings.optionsListChanges = false;
           Settings.interfaceListChanges = false;           
  }

  flagServerChanges = () =>{
      Settings.serverListChanges  = true;
  }
  
  isServerListChanged = () =>{
      return Settings.serverListChanges ;
  }

  flagOptionChanges = () =>{
      Settings.optionsListChanges = true;
  }
  
  isOptionsListChanged = () =>{
      return Settings.optionsListChanges;
  }

  flagInterfaceChanges = () =>{
      Settings.interfaceListChanges = true;
  }
  
  isInterfaceListChanged = () =>{
      return Settings.interfaceListChanges;
  }




  homeMenu = () => {
     triggerHint("To be coded later")
  }




  openDesignLayout = () => {
      if( getSelectedItem() ){  // item is loaded with OSD 
          let item = getSelectedItem();

          // if( (item.name.includes(".ome.tif") ) && (item.meta.omeSceneDescription != null)) {
          if( isMultiPlexItem(item) ) {            
              if(hasOmeSceneDescription(item)){
                  let itemName = item.name.split(".")[0];
                  initChannelList(item.meta.omeSceneDescription, itemName);   
                  initCurrentTileSource();
                  showPanel("channelListView",true);
                  showPanel("grpListView", true);

                  // if( ! isDAPIChannelSelected() ) {
                  if( typeof currentItemInfo.omeDataset.DapiChannel  === 'undefined' || 
                                     currentItemInfo.omeDataset.DapiChannel  == null || 
                                       !currentItemInfo.omeDataset.DapiChannel.length ) {  

                      // if DAPI before selected for same item, DAPI form will not show up
                      openDAPIForm();
                      triggerHint("Specify DAPI or DNA channel by clicking on channel list","info", 7000);
                  } else {
                      setSelectedDAPIChannelIndex(currentItemInfo.omeDataset.DapiChannel[0].channel_number)
                  }
                  return true;
              } else {
                 triggerHint(" No omeSceneDescription metadata", "error", 4000);
              } 
          } else {
            triggerHint("Select OME File");            
            return 0; 
          }
     } else {
          triggerHint("Select OME File");
          return 0;
     }
  }

 
  goToWikiDocs = () => {
      window.open("https://github.com/Mmasoud1/HistoJS/wiki");
  }

  openExtFeedbackForm = () => {
     // window.open("https://forms.gle/8ze2aamxJueWYQqV6"); 
     window.open("https://docs.google.com/forms/d/e/1FAIpQLSdHuO--mG00sKydQpJ7sPpDmhcJ4ECdj-wAB1kwXQExh_nUSg/viewform?usp=sf_link");
  }

  openExtIssueForm = () => {
     // --triggerHint("To be coded later")
     window.open("https://github.com/Mmasoud1/HistoJS/issues")
  }
  openContactUsForm = () => {
     triggerHint("To be coded later")
  }

  //------- Login/logout Toolbar Button ---------// 

   openLoginForm = () => { 
     if(!getActiveForm()){ // if another active form is opened then esc
        var hostIndex = getHostIndex();
        if(hostIndex){ 
          var loginForm = document.getElementById("loginForm")
          loginForm.classList.remove("formflashanimation"); 
          loginForm.style.display = "block";
          document.getElementById("userNameId").style.borderColor = "black"
          document.getElementById("passwordId").style.borderColor = "black"
          getElementCenterOnScreen(loginForm)
          setActiveForm(loginForm)
          if(isScreenLogoActive()) { 
              hideScreenLogo();
          }
        }else{ 
              triggerHint("Select Host First")
             } 
      }else{
            getActiveForm().classList.toggle("formflashanimation");
      }       
    }

  closeLoginForm = () => {
      var loginForm = document.getElementById("loginForm");
      if (loginForm.style.display === "block") 
      {
         document.getElementById("userNameId").value = null
         document.getElementById("passwordId").value = null
         loginForm.style.display = "none";
         resetActiveFormState();
          if(isScreenLogoActive()) { 
             showScreenLogo(); 
          }        
      }
    }

  confirmLogin = () => {
      var usr = document.getElementById("userNameId");

      if (!usr.value.length){ 
          usr.style.borderColor = "red";
      }
      
      var psw = document.getElementById("passwordId");

      if (!psw.value.length) { 
          psw.style.borderColor = "red";
      }

      if(usr.value.length && psw.value.length) {     
          const loginCredentials = { username: usr.value ,  password: psw.value };
          login(loginCredentials).then( data => { 
                                                   initLogoutToolbarBtn();
                                                   closeLoginForm(); 
                                                   triggerHint("Successfully login to " + getHostName(), "info", 5000);
                                                 }).catch(
                                                          err => {
                                                              usr.style.borderColor = "red";
                                                              psw.style.borderColor = "red";
                                                              triggerHint("Please check username and password", "error", 5000);
                                                           });
      }
  }  


  cancelLogin = () => {
     closeLoginForm();
  }

  initLogoutToolbarBtn = () => {
     var lastName  = getUserInfo().lastName;
     var logoutNode = ""; 
     logoutNode += '<a  style="position:absolute; right:4vw" href="javascript:void(0)" onclick="logoutCurHost()"><i style="font-size:0.7vw; padding: 0.42vh"    class="fa fa-sign-out"></i>' + lastName + '</a>'
     document.getElementById("login-out").innerHTML = logoutNode;        
  }

  initLoginToolbarBtn = () => {
     var loginNode = ""; 
     loginNode += '<a  style="position:absolute; right:4vw" href="javascript:void(0)" onclick="openLoginForm()"><i style="font-size:0.7vw; padding: 0.42vh"    class="fa fa-user-circle-o"></i>Login</a>'
     document.getElementById("login-out").innerHTML = loginNode;        
  }  

  logoutCurHost = () => {
      logout()
      initLoginToolbarBtn();
  }


  autoLogin = (callback) => {
     let hostIndex = getHostIndex();
     if(isAutoLoginEnabled()) {
         if(hostIndex){ 
            let hostApi = getHostApi();
            if(isLoggedIn()) {
                initLogoutToolbarBtn();             
            } else {
                initLoginToolbarBtn(); // In case host changed while last host was login
            }
         }
     } else {
           logoutCurHost();
     } 
     
     callback();        
  }    

  parseError = (xhr) => {
      let message ;
      switch (xhr.status) {
        case 404:
          {
            message = "Not found";
            break;
          }
        default:
          {
            try {
              let response = JSON.parse(xhr.response);
              message = response.message;
            } catch (e) {
              message = xhr.response;
              console.log(" xhr ", xhr)
              console.log(`No JSON response for request  ${message}`);
            }
            break;
          }
      }
      if(message !=="") {
         triggerHint(message,'info', 5000);    
      } else {
         triggerHint(`No response from server, xhr code:${xhr.status}`,'error', 5000);    
      }
      return Promise.reject(xhr);
  }


  _parseData = (data) => {
      return data ? data.json() : data;
  }  


  dsaLogin = (sourceParams, hostApi) => {
      const params = sourceParams ? {
        username: sourceParams.username || 0,
        password: sourceParams.password || 0
      } : {};
      const tok = `${params.username}:${params.password}`;
      let hash;
      try {
        hash = btoa(tok);
      }
      catch (e) {
        triggerHint("Invalid character in password or login");
      }
      return webix.ajax().headers({
                                   Authorization: `Basic ${hash}`
                                  })
                         .get(hostApi + `/user/authentication${setTokenIntoUrl(getToken(), "?")}`)
                         .then(result => _parseData(result));
                                      
                                        
  }


  dsaLogout = () => {
      var hostApi = getHostApi();

      return webix.ajax().del(hostApi + `/user/authentication`)
        .catch(parseError)
        .then( result => {
          _parseData(result);
          initCollectionsList(hostApi, getHostIndex());
          clearTreeView();
        });
  }

  webix.attachEvent("onBeforeAjax", (mode, url, data, request, headers, files, promise) => {
      let toSearchInUrl = "cdn.webix.com";
      let searchedInUrl = url.search(toSearchInUrl);

      if (searchedInUrl === -1) {
        headers["Girder-Token"] = getToken();
      }
  });                                            

   setTokenIntoUrl = (token, symbol) => {
       return token ? `${symbol}token=${token}` : "";
   }

   login = (params) => {
        var hostApi = getHostApi()
        return dsaLogin(params, hostApi).then( data => {
          webix.storage.local.put(`${"authToken" + "-"}${getHostIndex()}`, data.authToken);
          webix.storage.local.put(`${"user" + "-"}${getHostIndex()}`, data.user);
          initCollectionsList(hostApi, getHostIndex());
          clearTreeView()  
        });
  }

  logout = () => {
     dsaLogout().then(() => {
      webix.storage.local.remove(`${"user" + "-"}${getHostIndex()}`);
      webix.storage.local.remove(`${"authToken" + "-"}${getHostIndex()}`);
    });
  }

  getToken = () => {
    const authToken = webix.storage.local.get(`${"authToken" + "-"}${getHostIndex()}`);
    if (!authToken) {
      return null;
    }
    return authToken.token;
  }


  getUserInfo = () => {
    return webix.storage.local.get(`${"user" + "-"}${getHostIndex()}`);
  }

  getUserId = () => {
    let userInfo = getUserInfo();
    return userInfo ? userInfo._id : null;
  }

  isLoggedIn = () => {
    return getToken() && getUserInfo() ? true : false;
  } 
  

  removeHostCredentials = (hostIndex, hostApi) => {
     webix.ajax().del(hostApi + `/user/authentication`)
        .catch(parseError)
        .then( result => {});

      webix.storage.local.remove(`${"user" + "-"}${hostIndex}`);
      webix.storage.local.remove(`${"authToken" + "-"}${hostIndex}`);

  } 

//----------------- Get-Set Host functions  -----------------------------//
getHostApi = () => {
     return currentHostCollectSelectionStates.hostObject.hostAPI;
}

getHostObjEntry = () => {
     return currentHostCollectSelectionStates.hostObject;
}

setHostObjEntry = (hostEntry) => {
      currentHostCollectSelectionStates.hostObject = hostEntry;
}

getHostIndex = () => {
     return currentHostCollectSelectionStates.hostIndex;
}  


setHostIndex = ( hostIndex) => {
      currentHostCollectSelectionStates.hostIndex = hostIndex;
}

getHostName = () => {
      return currentHostCollectSelectionStates.hostObject.value;
}

getHostUrl = () => {
     return currentHostCollectSelectionStates.hostObject.hostAPI.split("/api")[0];
}


isLocalHost = () => {
     return location.hostname === "localhost" || location.hostname === "127.0.0.1" ? true : false;
}


//-----------------Item functions ----------------------------//

  isItemSelected = () => {
      return currentHostCollectSelectionStates.item != null ? true : false;
  } 
  getSelectedItem = () => {
      return isItemSelected() ? currentHostCollectSelectionStates.item : null;
  } 

  getSelectedItemFolderId = () => {
      return isItemSelected() ? currentHostCollectSelectionStates.item.folderId : null;
  } 

  setSelectedItem = (itemObj) => {
      currentHostCollectSelectionStates.item = itemObj;
  }  

  resetSelectedItem = () => {
      currentHostCollectSelectionStates.item = null;
  }  

  getSelectedItemId = () => {
      return isItemSelected() ? currentHostCollectSelectionStates.item._id : null;
  } 

  getLastSelectedItemId = () => {
      return lastHostCollectSelectionStates.itemId;  
  } 

  setLastSelectedItemId = (itemId) => {
      lastHostCollectSelectionStates.itemId = itemId;  
  } 

  resetLastSelectedItemId = () => {
      lastHostCollectSelectionStates.itemId = null;  
  }    

  getItemName = () => {
      return isItemSelected() ? currentHostCollectSelectionStates.item.name : null;
  } 


  isMultiPlexItem = (item) => {

         return item.name.includes(Opts.multiPlexFileExtension) ? true : false;

        // if((item.name.includes(Opts.multiPlexFileExtension)) && (item.meta.omeSceneDescription != null)) {
        //   return true;
        // } else if( !item.name.includes(Opts.multiPlexFileExtension) ) {
        //   return false;
        // } 
  }

  hasOmeSceneDescription = (item) => {
     if(item.name.includes(Opts.multiPlexFileExtension)){
        return item.meta.omeSceneDescription != null ? true : false;
     }
     return false;   
  }

//-----------------Screen Status--------------------------------// 
 isActiveForm = (elmId) => {
    return screenStatus.activeForm === document.getElementById(elmId)? true : false;
 }

 setActiveForm = (elm) => {
     screenStatus.activeForm = elm;
 } 

 getActiveForm = () => {
     return screenStatus.activeForm ;
 } 
 
 resetActiveFormState = () => {
     screenStatus.activeForm = null;
 }

 setActiveMode = (elm) => {
     screenStatus.activeMode = elm;
 } 

 getActiveMode = () => {
     return screenStatus.activeMode ;
 } 
 
 resetActiveModeState = () => {
     screenStatus.activeMode = null;
 }

 getActiveLayout = () => {
     return screenStatus.activeLayout ;
 }

 setActiveLayout = (layoutId) => {
     screenStatus.activeLayout = layoutId ;
 } 

 isLayoutActive = (layoutId) => {
    return screenStatus.activeLayout === layoutId? true : false;
 }

 resetActiveLayout = () => {
    return screenStatus.activeLayout = null;
 }


 // is screenLogo active in memory ( not removed)
 isScreenLogoActive = () => {
    return document.getElementById("screenLogo") ? true : false;
 }



//----------------------- Widget events ----------------------// 


//------------------------Preload Settings-------------------//

     docLoaded = () => {
         initScreenLogo();
     // alert(window.screen.availHeight)   
     // console.log(document.documentElement)
     //try 
     // window.innerHeight    // 1097  change with console change
     // document.body.offsetHeight
     // screen.height       // 1206
     // document.documentElement.clientHeight   == window.innerHeight 
     // document.body.clientHeight
     // window.screen.availHeight  // 1179
 
              // var allLayoutPanels = document.querySelectorAll('div[layout="'+layoutId+'"]')
              // allLayoutPanels.forEach(function(panel) {
       
              //      if(document.getElementById(panel.id +"Bar")){ 
              //         destroyBar(panel.id +"Bar")
              //      }
              //  })
       

    }

    docResized = () => {
         if(isScreenLogoActiveOnScreen()){
            docLoaded();
         }
    }

    window.addEventListener('load', (event) => {
        // alert(window.screen.availWidth);
        document.documentElement.style.setProperty('--screen-curAvailWidth', window.screen.availWidth);
        document.documentElement.style.setProperty('--screen-curAvailHeigth', window.screen.availHeight);      
    });

    window.addEventListener('resize', (event) => {
        if(getActiveForm())
           getElementCenterOnScreen(  getActiveForm()  )
          // getActiveForm()   
    });    

    // preloadFunc = () => {
    // 
    //     // alert(window.screen.availWidth);
    //     document.documentElement.style.setProperty('--screen-curAvailWidth', window.screen.availWidth);
    //     document.documentElement.style.setProperty('--screen-curAvailHeigth', window.screen.availHeight);
    // }
    // window.onpaint = preloadFunc();

    // windowResizeFunc = () => {
    // 
    //     // alert(window.screen.availWidth);

    // }
    // window.onresize = windResizeFunc();

  // document.getElementsByClassName("navbar")[0].addEventListener('click', (event) => {    
 document.onclick = (event) => {
     // console.log(" event target parentElement ", event.target.parentElement)
     if (event.target.matches('.dropbtn') ) {
         var dropdown = event.target.parentElement.querySelector(".dropdown-content") 
         if (dropdown.classList.contains('show')) {
               dropdown.classList.remove('show');
        }else{
             dropdown.classList.toggle("show");
             navMenuBtnClicked(dropdown.id)
        }
     } else if(event.target.parentElement && event.target.parentElement.matches('.dropdown-content') ) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        // var i;
         for(let openDropdown of dropdowns)  {
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
     } 

     if(Opts.isHintCloseOnMouseEvent) {
      
         if( (event.target.id != "hint") && 
             (event.target.parentElement.id != "hint") &&
             (event.target.id != "hintParagraph") && 
             (event.target.parentElement.id != "hintParagraph") ) {
                   // console.log("outside isPanelActive")    
                  if( isPanelActive("hint") ) {
                     if(Opts.isFirstClickEventAfterTrigger) {                      
                        setTimeout(() => { closeHint(); }, Opts.defaultOpeningTime ); 
                        Opts.isFirstClickEventAfterTrigger = false;  
                        // console.log("inside timer")                   
                     } else {  
                             closeHint(); 
                             //Opts.isFirstClickEventAfterTrigger = true;  
                            }
          
                  }

         }
      }
     // console.log(" clicked elem : ", event.target.id)
     // console.log(" clicked elem parent : ", event.target.parentElement.id)
     //else if(event.target.id != "hint")
     /*else {
          console.log("event.target.parentElement", event.target.parentElement)
          if(event.target.matches('svg') ){
            if(isScreenLogoActive()){
              console.log(" yes matches svg")
               event.stopPropagation();
            }
          }

     }   
     */
  }


  document.onmouseout = (event) => {
     if (event.target.matches('.dropbtn') || event.target.matches('.dropdown-content')) {
         var dropdown = event.target.parentElement.querySelector(".dropdown-content") 
         var dropbtn = event.target.parentElement.querySelector('.dropbtn')   
         if (dropdown && dropdown.classList.contains('show')) {
          $('#'+ dropdown.id ).mouseleave( () => {
              if (!($('#'+ dropbtn.id +':hover').length != 0)){ 
                  dropdown.classList.remove('show');
                  navManuMouseOut()
              }    
          })
          $('#'+ dropbtn.id ).mouseleave( () => {
              if (!($('#'+ dropdown.id +':hover').length != 0)) {
                  dropdown.classList.remove('show');
                  navManuMouseOut()
              }    
          })        
        }
     }
     //onmouseover="navMenuBtnClicked()" onmouseout="navManuMouseOut()"
  }

////---------------------------------------------------------------------------------//////
   // e.g. "boundaries/TONSIL-1_40X/"
   getCsvChannelMetaDataLocalPath = () => {
       return getItemName() ? ( Opts.dockerMountingDir  + 
                                  Opts.defaultBoundariesDir + "/" +
                                  getItemName().split(".")[0] + "/"
                                ) : null;  
   } 

   //  e.g "TONSIL-1_40X_channel_metadata.csv"
   getCsvChannelMetaDataFileName = () => {
        return  getItemName().split(".")[0]  + "_channel_metadata.csv"
   }  

  readRemoteCsvFile = (fileName) => { // fileName is the name on host  e.g "TONSIL-1_40X_cellMask.csv"
         let csvToJson = {};
         let apiUrl = getHostApi();
         let requestUrl = "item/" + getRemoteFileId(fileName) + "/download?contentDisposition=attachment";
         let apiKey = getApiKey();

         webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort + "/readRemoteCsvFile","baseUrl=" + apiUrl + "&apiKey=" + 
                                 apiKey + "&requestUrl=" + requestUrl, (result) => {
                                 csvToJson = JSON.parse(result);
                                              })
        // console.log("csvToJson : ",csvToJson)   
        return csvToJson ? csvToJson : null;
  }


  uploadChannelsMetadata = (channelMetaKey, channelMetadata) => {
      if( isLoggedIn() ) {
          let item = getSelectedItem();
          let hostAPI = getHostApi();
          let itemMetadataObject = {};
          itemMetadataObject[channelMetaKey] = channelMetadata;
          updateItemMetadata(hostAPI, item._id, itemMetadataObject, "Object");
       } else {
            triggerHint("Login before upload");
       }   
  }

 loadCsvChannelMetadata = () => {

          /// get remote boundary CSV file id from host is exist
          /// if Opts.searchEntirHostForResource is false, it will search for CSV file within the item remote folder only
          let returnObj = null;

          if ( isLoggedIn() ) {                
              let remoteFileId = getRemoteFileId( getCsvChannelMetaDataFileName() );
              if(remoteFileId != null) {

                         // check if the user has access to download the file
                         if( getApiKey() != null ) {
                              returnObj = readRemoteCsvFile( getCsvChannelMetaDataFileName() );
                              // if(returnObj) {
                              //      if( !returnObj[0].hasOwnProperty('channel_name') || !returnObj[0].hasOwnProperty('channel_number') ) {
                              //         // trigerWizard () // 
                              //      }
                              // } else {
                              //     triggerHint("Error reading remote " + getCsvChannelMetaDataFileName() + " CSV file" , "error", 5000); 
                              // }
                          } else {
                              createApiKey();
                              // recall the function 
                              loadCsvChannelMetadata();
                          }



              } else { // No remote CSV file with same collection
                  triggerHint("No " + getCsvChannelMetaDataFileName() + " remote CSV file found" , "error", 5000); 

                   // trigerWizard () // 
              } 
         } else {
           triggerHint("Login to access the remote channels metadata CSV file ", "error", 5000);                
         }   

         return returnObj;                 
   }


})();
