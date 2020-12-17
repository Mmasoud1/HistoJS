/*!
=========================================================
* HistoJS Demo - v1.0.0
=========================================================

* Github:  https://github.com/Mmasoud1
* GitLab:  https://gitlab.com/mmasoud1
* Discription:  A user interface for whole slide image channel design, analysis and registration. 
*               It is based on DSA as backbone server
* 
*
* Coded by Mohamed Masoud ( mmasoud2@outlook.com )

=========================================================



=========================================================
                      Analysis Mode
=========================================================*/

(function(){

    //var curGroup = currentItemInfo.omeDataset.Groups[groupIndex];

    // "use strict";


    getSelectedGrpIndex = () => {
        return lastItemSelectionStates.grpIndex != null ? lastItemSelectionStates.grpIndex : null;
    }

    isGrpSelected = () => {
        return lastItemSelectionStates.grpIndex != null ? true : false;
    } 

        

    getSelectedGroup = () => {
        return isGrpSelected() ? currentItemInfo.omeDataset.Groups[ getSelectedGrpIndex() ] : null;
    }    

    getSelectedGroupName = () => {
        return isGrpSelected() ? getSelectedGroup().Name : null;
    }  

    updateInputTooltip = (tooltipId, getFunCallback) => {
    	return document.getElementById(tooltipId).innerHTML = getFunCallback();
    }

   // disable/enable input element
   freezeInput = (inputId, freezeFlag = true) => {
         document.getElementById(inputId).disabled = freezeFlag;
   } 


   //-- Files to load or create -- ---------------------------------------------------------//

   // e.g. "Structural Components_Grid_64_Feat.json"
   getGrpFeaturesFileName = () => { // get the proposed name of the featurs file 
           return isGrpSelected() ?  ( isSuperPixel() ? getSelectedGroupName()  + "_Spx_Feat.json" : 
                                                        getSelectedGroupName()  + "_Grid_"+ getGridSize() + "_Feat.json"
                                     ) : null;                  
   }


   // e.g "features/TONSIL-1_40X/Grid/TileSize_64/", for singlePlex slides
   getItemFeaturesLocalPath = () => {
       return isGrpSelected() ? ( Opts.dockerMountingDir  + 
                                  Opts.defaultFeaturesDir + "/" +
                                  getItemName().split(".")[0] + "/" +
                                  ( isSuperPixel() ? "Spx" + "/" : "Grid" + "/"  + "TileSize_" + getGridSize() + "/")
                                ) : null;  
   }

   // e.g "features/TONSIL-1_40X/Structural Components/Grid/TileSize_64/", for multiPlex slides
   getGrpFeaturesLocalPath = () => {
       return isGrpSelected() ? ( Opts.dockerMountingDir  + 
                                  Opts.defaultFeaturesDir + "/" +
                                  getItemName().split(".")[0] + "/" +
                                  getSelectedGroupName() + "/" + 
                                  ( isSuperPixel() ? "Spx" + "/" : "Grid" + "/"  + "TileSize_" + getGridSize() + "/")
                                ) : null;  
   }

   // e.g. "Structural Components_cellMask.json"
   getGrpBoundariesFileName = () => {
        return isGrpSelected() ? getSelectedGroupName()  + "_cellMask.json" : null;
   }

   
   // e.g. "boundaries/TONSIL-1_40X/"
   getBoundariesLocalPath = () => {
       return isGrpSelected() ? ( Opts.dockerMountingDir  + 
                                  Opts.defaultBoundariesDir + "/" +
                                  getItemName().split(".")[0] + "/"
                                ) : null;  
   }

   // This is for a generic mask   e.g "TONSIL-1_40X_cellMask.json"
   getItemBoundariesFileName = () => {
        return  getItemName().split(".")[0]  + "_cellMask.json"
   } 

   // e.g. "boundaries/"
   getBoundariesHomeDir = () => {
       return Opts.defaultBoundariesDir +"/"; 
   }


   //getItemRootName( getItemName().split(".")[0] )

      //     
      //    //  storageItemName = config_1['Cohort'] 
      //      classType='.gutmansSquare'
      //      strokeWidth=10
      //      tileType='Grid'
      //      storageItemName_Ext="_Size_"+$$("tileSize").getValue()+"_Grid"; 
      //      dirPath= docker_mounting_dir+featuresFolder+storageItemName+"/"+"Grid/"+"TileSize_"+($$("tileSize").getValue()).toString()+"/"           

      //  

      // fetchedFeatures = getFeatures(storageItemName+storageItemName_Ext+".feat",dirPath)

//---------------------------------------------------------------------------------------------

    // resetGrpSelection = () => {
    //     if(lastItemSelectionStates.grpIndex != null) {
    //         document.getElementById("itemGrpLi" + lastItemSelectionStates.grpIndex).style.backgroundColor = Opts.defaultElemBgColor;
    //         document.getElementById("itemGrpFont" + lastItemSelectionStates.grpIndex).style.color = Opts.defaultElemFontColor;
    //         lastItemSelectionStates.grpIndex = null;
    //     }
    // }    







	openAnalysisLayout = () => {
	      if( isGrpSelected() ){  // item is loaded with OSD 
	          // var item = currentHostCollectSelectionStates.item;
	             

	          // if( (item.name.includes(".ome.tif") ) && (item.meta.omeSceneDescription != null)) {
	              // var itemName = item.name.split(".")[0];
	              initGrpChannelOptionsList();   
	              initGrpFeaturesList();
	              // showPanel("channelListView",false);
	              // showPanel("grpListView", false);
	              showPanel("grpOptionsView", true);
	              showPanel("grpFeaturesView", true);
                showPanel("coordinates", true);
                showBarExtension("grpOptionsViewBar");
	              initAccordionClick();
	              return true;
	          // } else {
	          //   triggerHint("Select Group ");            
	          //   return 0; 
	          // }
	     } else {
	          triggerHint("Select Group ");
	          return 0;
	     }
	}


    onCurGrpClick = () => {
        //-- lastSelectionStates.tileChanged=0 means no change in the tileSource --//
        // if((lastItemSelectionStates.grpIndex == groupIndex) && (grpRefresh == false)) {
        //     return 0;
        // }
        // if(lastItemSelectionStates.grpIndex != null) {
        //     document.getElementById("itemGrpLi"+lastItemSelectionStates.grpIndex).style.backgroundColor = Opts.defaultElemBgColor;
        //     document.getElementById("itemGrpFont"+ lastItemSelectionStates.grpIndex).style.color = Opts.defaultElemFontColor;
        // }
        // document.getElementById("itemGrpLi"+groupIndex).style.backgroundColor = Opts.selectedElemBgColor;
        // document.getElementById("itemGrpFont"+groupIndex).style.color = Opts.selectedElemFontColor;
        // lastItemSelectionStates.grpIndex= groupIndex;

        // var curGroup = currentItemInfo.omeDataset.Groups[groupIndex];
        // reloadOSD(curGroup);
        // // //--Initialize annotation labels on right panel--//
        // clearGrpBarRight();
        // curGroup.Colors.forEach((clr, idx) => {
        //      document.getElementById("grpListViewBar").innerHTML+= '<a href="javascript:void(0)" ><span id="chColorSpanId.'+idx+'" style="background-color:'+'\#'+clr+';   padding-left:0.5vw;" onclick = "customizeChColor('+groupIndex+','+idx+')">&nbsp</span>&nbsp<i id="eyeIcon.'+idx+'" class="fa fa-eye" aria-hidden="true" onclick="onCurGrpChOsdShowHide('+ idx +')" style="font-size:0.6vw">'+'<font style = "font-family: Impact, Charcoal, sans-serif;" >&nbsp&nbsp'+ refineChannelName(curGroup.Channels[idx]) + '</font></i></a>';
        // })
    }

  // <p class="just" style="font-weight: bold;">Group:</p>
  //   <ul class="just" id="currentGroup" style="line-height: 30%; margin-left: 0.5vw">
  //      <!-- Loaded dynamically  -->
  //   </ul>

  // <p class="just" id="grpBoundaryTitle" style="font-weight: bold;">Boundary Options:</p>
  //   <ul class="just" id="grpBoundariesOption" style="line-height: 100%; margin-left: 0.5vw">
  //     <!--  Loaded dynamically -->
  //   </ul>

  // <p class="just" id="grpFeaturesTitle" style="font-weight: bold;">Feature Options:</p>
  //   <ul class="just" id="grpFeaturesOption" style="line-height: 100%; margin-left: 0.5vw">
  //     <!--  Loaded dynamically -->
  //   </ul>




   initGrpFeaturesList = () => { 
   	  initGrpInfo();
      initGrpBoundaryOptions();
      initGrpFeatureOptions();
      initGrpChnlDisplayOptions();

   	  // let node = "";
      // // let item = currentHostCollectSelectionStates.item;
      // // let tileSourceName = item.name.split(".")[0]
      // // node  +=  '<button class="accordion">';
      // node +=  '<button class="accordion">';          
      // node  +=     '<p class="just" style="font-weight: bold;">Group</p>';
      // // node +=  '</button>';
      // // node +=  '<div class="accordionpanel">';
      // node  +=        '<ul class="just" id="currentGroup" style="line-height: 30%; margin-left: 0.5vw">';
      // node  +=          '<li style="background-color: none" id="currentGrp">';
      // node  +=            '<a href="javascript:void(0)" onclick="onCurGrpClick()">';
      // node  +=              '<font  style="font-size:0.62vw" id="curGrpFont">'+ curGroup.Name +'</font>';
      // node  +=             '</a>';
      // node  +=    		 '</li>';   
      // node  +=         '</ul>';
      // // node +=  '</div>';	 

      // document.getElementById("grpFeaturesView").innerHTML += node;

  } 

      //  initGrpFeaturesList = () => { 
      //  	  let curGroup = getSelectedGroup();
      //     //return Object { Channels: (3) […], Colors: (3) […], Contrast_Max: (3) […], Contrast_Min: (3) […], Format: "jpg", Name: "Lymphocytes", Numbers: (3) […], Path: "0___DAPI 1---18___CD3D---35___CD20" }       	  

      //  	  let node = "";
      //     // let item = currentHostCollectSelectionStates.item;
      //     // let tileSourceName = item.name.split(".")[0]
      //     // node  +=  '<button class="accordion">';
      //     node +=  '<button class="accordion">';          
      //     node  +=     '<p class="just" style="font-weight: bold;">Group</p>';
      //     // node +=  '</button>';
      //     // node +=  '<div class="accordionpanel">';
      //     node  +=        '<ul class="just" id="currentGroup" style="line-height: 30%; margin-left: 0.5vw">';
      //     node  +=          '<li style="background-color: none" id="currentGrp">';
      //     node  +=            '<a href="javascript:void(0)" onclick="onCurGrpClick()">';
      //     node  +=              '<font  style="font-size:0.62vw" id="curGrpFont">'+ curGroup.Name +'</font>';
      //     node  +=             '</a>';
      //     node  +=    		 '</li>';   
      //     node  +=         '</ul>';
      //     // node +=  '</div>';	 



      //     // node  +=  '</button>';
      //     // node  +=  '<div class="panel">';
      //     // node  +=     '<p> test to be coded later </p>';
      //     // node  +=  '</div>';

      //     document.getElementById("grpFeaturesView").innerHTML += node;


      //     // initItemGroupsList()

      // }   

    // initTileInfo = () => { 
	   // 	  const curTileName= getSelectedItem();
	   //    //return Object { Channels: (3) […], Colors: (3) […], Contrast_Max: (3) […], Contrast_Min: (3) […], Format: "jpg", Name: "Lymphocytes", Numbers: (3) […], Path: "0___DAPI 1---18___CD3D---35___CD20" }       	  
	   // 	  let node = "";
	   //    // let item = currentHostCollectSelectionStates.item;
	   //    // let tileSourceName = item.name.split(".")[0];
	   //    node  +=     '<li style="background-color: none" id="currentTS">';
	   //    // node  +=        '<a href="javascript:void(0)" onclick="onCurGrpClick()">';
	   //    node  +=          `<font  style="font-size:0.62vw" id="curTSFont">${curGroup.Name}</font>`;
	   //    // node  +=         '</a>';
	   //    node  +=     '</li>';   

	   //    document.getElementById("curAnalysisTileSource").innerHTML = node;
    // }       

    initGrpInfo = () => { 

	      document.getElementById("currentGrpTitle").innerHTML = getItemRootName( getItemName().split(".")[0] ) + " Group:";

	   	  const curGroup = getSelectedGroup();
	      //return Object { Channels: (3) […], Colors: (3) […], Contrast_Max: (3) […], Contrast_Min: (3) […], Format: "jpg", Name: "Lymphocytes", Numbers: (3) […], Path: "0___DAPI 1---18___CD3D---35___CD20" }       	  
	   	  let node = "";
	      let item = currentHostCollectSelectionStates.item;
	      let tileSourceName = item.name.split(".")[0];
	      node  +=     '<li style="background-color: none" id="currentGrp">';
	      node  +=        '<a href="javascript:void(0)" onclick="onCurGrpClick()">';
	      node  +=          `<font  style="font-size:0.62vw" id="curGrpFont">${curGroup.Name}</font>`;
	      node  +=         '</a>';
	      node  +=     '</li>';   

	      document.getElementById("currentGroup").innerHTML = node;

    } 


/*-----------------------------------------------------Left panel---------------------------------------------------*/
/*---------------------------------------------- Channel Option Section---------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------*/

  toggleOpacity = (elem) => {
     let id = elem.id.split('.')[1];
     if(elem.checked) {
       viewer.world.getItemAt(id).setOpacity(1);       
     }
     else {
       viewer.world.getItemAt(id).setOpacity(0);   
     }
  }

	onChOpacitySliderMouseover = (elem) => {

	}


	channelOpacityChanged = (elem) => {

	}

  
  cellFilterChanged = (elem) => {

	}

	initGrpChannelOptionsList = () => { 
	    let nodes="";
	    document.getElementById("channelOptionsList").innerHTML=""; 
	    const curGroup = getSelectedGroup();
	    // document.getElementById("grpName").innerHTML = '<i style="font-size:1.4vw"  class="fa fa-sliders" ></i> &nbsp&nbsp' + "CHNL" + " OPTIONS";	    

	    curGroup.Channels.forEach( (channel, idx) => {
  	      let channelName = channel; 
  	      let channelNumber = curGroup.Numbers[idx];
  	      let channelColor = curGroup.Colors[idx];
	      // viewer.world.getItemAt(idx).setOpacity(1);
          nodes +=  '<button class="accordion">';
	        nodes +=    `<li style="background-color: none" id="grpChannel${channelNumber}">`;
          nodes +=      `<span  style="background-color:\#${channelColor};   padding-left:0.5vw;">&nbsp</span>&nbsp`;	      
	      // nodes +=    '<a href="javascript:void(0)" class="channelCheckboxClass" id="ChannelCheckboxId'+ channelNumber +'"  onclick="onChannelCheckboxClick('+ channelNumber +')">';
	      // nodes +=      '<i class="fa fa-square" >&nbsp&nbsp</i></a>';
	      // nodes +=    '<a href="javascript:void(0)"  onclick="onSelectedChannelOption('+ channelNumber +')">';
	        nodes +=      `<font  style="font-size:0.77vw"  id="grpChannelFont${channelNumber}">${channelName}</font>`;
	      // nodes +=     '</a>';
	        nodes +=    '</li>';
          nodes +=  '</button>';
          nodes +=  '<div class="accordionpanel">';
          nodes +=     '<table>';
          nodes +=       '<colgroup> <col style="width:40%"> <col style="width:60%"></colgroup>';

          // nodes +=       '<tr><th></th>'          
          // nodes +=         '<th ><label class="switch"><input type="checkbox" id="togBtn"><div class="slider round"><span class="on">ON</span><span class="off">OFF</span></div></label>';
          // // nodes +=           '<input type="checkbox" checked>';
          // // nodes +=           '<span class="slider round"></span>';
          // nodes +=         '</th>';
          // nodes +=       '</tr>'          

          nodes +=       '<tr>';         
          nodes +=         '<th style="text-align: center"><p> Opacity </p></th>'; 
          nodes +=         '<th style="padding-left:15%;"><label class="switch switch-left-right">';
          nodes +=           `<input class="switch-input" type="checkbox" id="opacitySwitch.${idx}" onclick="toggleOpacity(this)" checked/>`;
          nodes +=           '<span class="switch-label" data-on="On" data-off="Off"></span> ';
          nodes +=           '<span class="switch-handle"></span>'; 
          nodes +=         '</label></th>';
          nodes +=       '</tr>';          

          // nodes +=       '<tr>'          
          // nodes +=         '<th ><label class="switch">';
          // nodes +=           '<input type="checkbox" checked>';
          // nodes +=           '<div class="slider round"></span>';
          // nodes +=         '</label></th>';
          // nodes +=       '</tr>'          


          nodes +=       '<tr>';
          nodes +=         '<th style="text-align: center"><p> Opacity </p></th>';      
          nodes +=         `<th style="vertical-align:middle;"><div class="tooltip"><input type="range" min="0" max="1" value="1" step="0.1" id="opacity.${idx}" onchange="chOpacityChanged(this)" onmouseover="onChOpacitySliderMouseover(this)"  ><span class="tooltiptext" style="width: 50%; left: 50%;" id="chOpacityValueTooltip"></span></div></th>`;
          nodes +=       '</tr>';          
          nodes +=       '<tr>';
          nodes +=         '<th style="text-align: center"><p> Cell Filter </p></th>';      
          nodes +=         `<th style="vertical-align:middle;"><div class="tooltip"><input type="range" min="1" max="255" value="1" step="50" id="cellFilter.${idx}" onchange="cellFilterChanged(this)" onmouseover="onCellFilterSliderMouseover(this)"  ><span class="tooltiptext" style="width: 50%; left: 50%;" id="cellFilterValueTooltip"></span></div></th>`;
          nodes +=       '</tr>';
          nodes +=      '</table>';  
          // nodes +=  ' <input type="range" min="1" max="100" value="50">';	            
          nodes +=  '</div>';	      
	    });

	    document.getElementById("channelOptionsList").innerHTML += nodes;
	}  


/*--------------------------------------------------Right Panel-----------------------------------------------------*/
/*---------------------------------------------- Boundary Section---------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------*/


   // check whether the ON/OFF button toggled to ON
   isBoundaryEnabled = () => {
        return document.getElementById("boundarySwitch").checked ? true : false;
   }

   // check whether Grid/Spx boundares loaded
   isBoundaryLoaded = () => {

   }

   // check whether button toggled to SPX
   isSuperPixel = () => {
       return document.getElementById("toggleBoundaries").checked ? true: false;
   }

   // enable sliders 
   enableBoundarySliders = (enableFlag) => {
        let allSliders = document.getElementById("boundaryOptionsTable").querySelectorAll('input[type="range"]');
        allSliders.forEach( slider => {
        	slider.disabled = !enableFlag;
        	if((slider.id === "gridSize") && ( isSuperPixel() ) ){
                slider.disabled = true;
        	}
        });
   }   

   freezeBoundaryControls = (freezeFlag = true) => {
          enableBoundarySliders(!freezeFlag); 
          freezeInput("toggleBoundaries", freezeFlag);
          freezeInput("createLoadFeaturesBtn", freezeFlag); 
          freezeInput("tileSearchBox", freezeFlag); 
          freezeInput("findTileBtn", freezeFlag); 
          // freezeInput("boundaryFillColor", freezeFlag); 
          // freezeInput("strokeColor", freezeFlag); 
   }

   //  ON-OFF Boundary Switch
   boundarySwitchClicked = () => {
         //  is switch ON
   	     if( isBoundaryEnabled() ) {
             initBoundaries();  
             freezeBoundaryControls(false);
         } else { 
            //   switch is OFF
            removeBoundaries();
            freezeBoundaryControls();
         }
   }

  // search entire current host for the item id
  //return object e.g. { _id: "5f3d8b53c0ac4ed1ea110f9b", _modelType: "item", size: 1496, baseParentId: "5da4e7f47bc2409bd20e1ff3", baseParentType: "collection", created: "2020-08-19T20:28:03.545000+00:00", creatorId: "5d9fd4e87bc2409bd20a359f", description: "", folderId: "5e361c5c34679044bda81b11", meta: {}, … }
  searchFileRemotely = (fileName) =>{
 //https://styx.neurology.emory.edu/girder/api/v1/resource/search?q=%22TONSIL-1_40X_channel_metadata.csv%22&mode=text&types=%5B%22item%22%5D&limit=10
         let searchResult = [];
         webix.ajax().sync().get(getHostApi() + "resource/search?q=%22" + fileName + "%22&mode=text&types=%5B%22item%22%5D&limit=10", (result) => {
              searchResult = JSON.parse(result)['item'][0];
            })
         return searchResult ? searchResult._id  : null;

  }

  isRemoteFileExist = (fileName) => {
        return getRemoteFileInfo(fileName) ? true : false;
  }

  // return object e.g. { _id: "5f3d8b53c0ac4ed1ea110f9b", _modelType: "item", folderId: "5e361c5c34679044bda81b11" ... 
  getRemoteFileInfo = (fileName) => {
         let remoteFileInfo ;
         webix.ajax().sync().get(getHostApi() + "item?folderId=" + getSelectedItemFolderId() + "&name=" + fileName + "&limit=50&sort=lowerName&sortdir=1", (result) => {
              remoteFileInfo = JSON.parse(result)[0];
            })
        
         return remoteFileInfo ? remoteFileInfo : null;
  } 

  // Get the id of the JSON or CSV file whether they are withing same ome folder or in any collection on the server
  getRemoteFileId = (fileName) => {
        // check ome folder first
        let remoteFileInfo = getRemoteFileInfo(fileName);

        if (remoteFileInfo){
           return remoteFileInfo._id;
        } else { // if not exist with same ome folder, search entire host
           let searchedFileId =  searchFileRemotely(fileName);
           return searchedFileId ? searchedFileId : null;
        }
  }    

  downloadRemoteFile = (fileName) => {
      let a = document.getElementById('downloadingLink');
      if(a == null) {
         const a = document.createElement("a");
         document.body.appendChild(a);
         a.style = "display: none";
         a.id = "downloadingLink";
      }
      const url = getHostApi() + "item/" + getRemoteFileId(fileName) + "/download?contentDisposition=attachment";
      a.href = url;
      a.click();

      //document.body.removeChild(a);
  } 

  // in case no api_key found on host, create one for use with restApi to download JSON files from host
  createApiKey = () => {
    if( isLoggedIn() ){
        webix.ajax().sync().post( getHostApi() + "api_key?name=" + getUserInfo().lastName + "&active=true");
    } else {
        triggerHint("Internal process needs host login to complete");
    }
  }


   getApiKey = () => {
       let apiKey = null;
       try {
           webix.ajax().sync().get(getHostApi() + "api_key?userId=" + getUserId() + "&limit=1&sort=name&sortdir=1", (result) => {
                // console.log(result)
                apiKey = JSON.parse(result);
              })
       }catch(err){
           console.log("Error : ", err);
           triggerHint(" No api_key found on host", "error", 3000);
           apiKey = null;
      }
      // console.log("apiKey : ", apiKey)
      return apiKey.length ? apiKey[0].key : null;      

   }

  downloadHostFile = (fileName, localDir) => { // fileName is the name on host  e.g "TONSIL-1_40X_cellMask.json"
         let remoteJSON = {};
         let apiUrl = getHostApi();
         let requestUrl = "item/" + getRemoteFileId(fileName) + "/download?contentDisposition=attachment";
         let apiKey = getApiKey();

         webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort + "/downloadFile","filename=" + fileName + "&outfolder=" + localDir + "&baseUrl=" + apiUrl + "&apiKey=" + apiKey + "&requestUrl=" + requestUrl, (result) => {

                                                // remoteJSON = JSON.parse(result);
                                                console.log(result)
                                              })
        
         // return remoteJSON ? remoteJSON : null;
  }   

 
// download user output to user selected  local folder
downloadUserData = (data, fileName) =>{
      // const data = 'a,b,c\n5,6,7',
      // fileName = "my-csv.csv";
      let a = document.getElementById('downloadUserData');
      if(a == null) {
         a = document.createElement("a");
         document.body.appendChild(a);
         a.style = "display: none";
         a.id = "downloadUserData";
      }
       const blob = new Blob([data], {type: "octet/stream"});
       const url = window.URL.createObjectURL(blob);   

       a.href = url;
       a.download = fileName;       
       a.click();
       window.URL.revokeObjectURL(url);  

       //document.body.removeChild(a);     
}

  // check if file exists locally within the project folder
  isLocalFileExist = (fileName, Dir) => {
     let isExist;
     webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort + "/checkFile","filename=" + fileName + "&outfolder=" + Dir, function(response) {
       isExist = JSON.parse(response);
     });

     return isExist   // true: exits, false: not exists
  }


   // isSpxBoundaryFileExist = () => {

   // 	 // return isLocalFileExist( getItemBoundariesFileName(), getBoundariesHomeDir()) ||
   //   //        // isLocalFileExist( getGrpBoundaryFileName(), getBoundariesLocalPath()) ||
   //   //      	isRemoteFileExist( getItemBoundariesFileName() )
   
   // }  

   // read boundaries from local JSON file at dir boundaries .. 
   getBoundaries = (fileName, boundaryFolder = Opts.defaultBoundariesDir) => {   // read boundaries file
      var results=[];
      webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort + "/readBoundaries","filename="+fileName+"&outfolder="+boundaryFolder, function(response) {
         results = response;
       });

      if(results != "notExist") {
          return results;
      } else { 
          return "[]";
      }    
  }

  initSpxOverlay = () =>{
    let boundaryData = getBoundaries( getItemBoundariesFileName(), getBoundariesLocalPath() )
    //*** later to be modified such that  : 
    //*** let boundarData = getBoundaries( getItemBoundariesFileName(), getBoundariesLocalPath() )
         
  } 

   loadSpxBoundaries = () => {
   		// To be coded..check for superpixel availability, otherwise create it
   		// need wizard to allocate the cellmask image or create it.
        if( isLocalFileExist( getItemBoundariesFileName(), getBoundariesLocalPath()) ){
               //to be coded
               initSpxOverlay();
               triggerHint(" to be coded ");
        } else  {
                /// get remote boundary JSON file id from host is exist
                let remoteFileId = getRemoteFileId( getItemBoundariesFileName() );
                if(remoteFileId != null){
                     // download it to boundaries folder
                     if ( isLoggedIn() ){
                           // check if the user has access to download the file
                           if( getApiKey() != null ){
                               downloadHostFile( getItemBoundariesFileName(), getBoundariesLocalPath() );
                               triggerHint(" to be coded ");

                            } else {
                                createApiKey();
                                // recall the function 
                                loadSpxBoundaries();
                            }

                     } else {
                       triggerHint("Login to access the remote boundaries JSON file ", "error", 5000);                
                     }

                } else {
                     triggerHint("No Superpixels info found.", "error", 3000);
                     // trigerWizard () // locate xxxx_cellMask.tiff to create boundaries
                } 
       }
   }

   loadGridBoundaries = () => {
   	   initGridOverlay();
   }

   // init Grid / Spx boundaries
   initBoundaries = () =>{
	   	if( isSuperPixel() ) {
	   		// if( isSpxBoundaryFileExist() ){
	   		     loadSpxBoundaries();
	   		// } else {
      //         triggerHint("No Superpixels info found.")		   		
	   		// }    
	   		// To be coded..check for superpixel availability, otherwise create it
	   		// need wizard to allocate the cellmask image or create it.
	   	} else {
	        loadGridBoundaries(); 
	   	} 
   }


    
    toggleGridSpxBoundaries = () => {
    	  removeBoundaries();
        resetTileValues();
        enableBoundarySliders(true); 
        initBoundaries();          
	}


    getGridSize = () => {
       return document.getElementById("gridSize").value;
    }

    gridSizeChanged = () => {
    //	reloadGrid();
         loadGridBoundaries();         
    	 updateInputTooltip("gridSizeValueTooltip", getGridSize);
	}			




    gridSizeSliderMouseOver = () => {
    	if( ! isSuperPixel() ) {
    		updateInputTooltip("gridSizeValueTooltip", getGridSize);
    	//    document.getElementById("gridSizeValueTooltip").innerHTML = getGridSize();
    	}    
	}


    getBoundaryFillOpacity = () => {
       return document.getElementById("boundaryFillOpacity").value;
    }
 
    boundaryFillOpacityChanged = () => {
    	updateInputTooltip("boundaryFillOpacityValueTooltip", getBoundaryFillOpacity);
        d3.selectAll("polygon").style("fill-opacity", getBoundaryFillOpacity());
	}

    getStrokeOpacity = () => {
       return document.getElementById("strokeOpacity").value;
    }

    strokeOpacityChanged = () => {
		updateInputTooltip("strokeOpacityValueTooltip", getStrokeOpacity);
        d3.selectAll("polygon").style("stroke-opacity", getStrokeOpacity());		
	}			


    boundaryFillOpacitySliderMouseOver = () => {
    	updateInputTooltip("boundaryFillOpacityValueTooltip", getBoundaryFillOpacity);
    //    document.getElementById("boundaryFillOpacityValueTooltip").innerHTML = getBoundaryFillOpacity();
	}

	strokeOpacitySliderMouseOver = () => {
		updateInputTooltip("strokeOpacityValueTooltip", getStrokeOpacity);
    //    document.getElementById("strokeOpacityValueTooltip").innerHTML = getStrokeOpacity();
	}





    getStrokeWidth = () => {
       return document.getElementById("strokeWidth").value;
    }

    strokeWidthChanged = () => {
		updateInputTooltip("strokeWidthValueTooltip", getStrokeWidth);
        d3.selectAll("polygon").style("stroke-width", getStrokeWidth());		
	}	

	strokeWidthSliderMouseOver = () => {
		updateInputTooltip("strokeWidthValueTooltip", getStrokeWidth);
    //    document.getElementById("strokeOpacityValueTooltip").innerHTML = getStrokeOpacity();
	}






	boundaryFillColorChanged = () => {
   	     if( isBoundaryEnabled() ) {
	          d3.selectAll("polygon").style("fill", getBoundaryFillColor());
   	     } 		

	}
	
	getStrokeColor = () => {
 	     return getColorValue("strokeColor") ? "#" + getColorValue("strokeColor") : Opts.defaultStrokeColor;
	}


	getBoundaryFillColor = () => {
 	     return getColorValue("boundaryFillColor") ? "#" + getColorValue("boundaryFillColor") : Opts.defaultBoundaryFillColor;
	}

	strokeColorChanged = () => {
   	     if( isBoundaryEnabled() ) {
	           d3.selectAll("polygon").style("stroke", getStrokeColor());   	     	
   	     }   		
	}


	initGrpBoundaryOptions = () => { 
	    let nodes="";
	    const sectionTitle = "Boundaries";
	    document.getElementById("grpBoundaryOptions").innerHTML = ""; 


		nodes +=  '<button class="accordion">';
		nodes +=    '<li style="background-color: none" id="grpBoundaryOptionsTitleLi">';
		nodes +=      `<font  style="font-size:0.65vw"  id="grpBoundaryOptionsTitle">${sectionTitle}</font>`;
		nodes +=    '</li>';
		nodes +=  '</button>';
		nodes +=  '<div class="accordionpanel">';
		nodes +=     '<table id="boundaryOptionsTable">';
		nodes +=       '<colgroup>  <col style="width:50%"><col style="width:40%"> <col style="width:10%"> </colgroup>';

		nodes +=       '<tr>';         
		nodes +=         '<th style="padding-left:10%;"><label class="switch ">';
		nodes +=           '<input class="switch-input" type="checkbox" id="boundarySwitch" onclick="boundarySwitchClicked()"/>';
		nodes +=           '<span class="switch-label" data-on="On" data-off="Off"></span> ';
		nodes +=           '<span class="switch-handle"></span>'; 
		nodes +=         '</label></th>';
		nodes +=         '<th style="padding-left:10%;"><label  class="switch ">';
		nodes +=           '<input class="switch-input" type="checkbox" id="toggleBoundaries" onclick="toggleGridSpxBoundaries()" disabled/>';
		nodes +=           '<span class="switch-label"  data-on="Spx" data-off="Grid"></span> ';
		nodes +=           '<span class="switch-handle"></span>'; 
		nodes +=         '</label></th>';
		nodes +=       '</tr>';    

    nodes +=       '<tr id="gridSizeRow">';
    nodes +=         '<th style="padding-left:10%;text-align: left"><p> Grid Size </p></th>';      
    nodes +=         '<th ><div class="tooltip">';
    nodes += 	    		'<input  type="range" disabled min="64"  step="64"  id="gridSize" onchange="gridSizeChanged()" onmouseover="gridSizeSliderMouseOver()" >';
    nodes += 	    		'<span class="tooltiptext" style="width: 50%; left: 50%;" id="gridSizeValueTooltip"></span>';
    nodes += 	          '</div>';
    nodes +=    	 '</th>';
    nodes +=       '</tr>'; 

    nodes +=       '<tr>';
    nodes +=         '<th style="padding-left:10%;text-align: left"><p> Fill Opacity </p></th>';      
    nodes +=         '<th ><div class="tooltip">';
    nodes +=        	    '<input type="range" disabled min="0" max="1"  step="0.25"  id="boundaryFillOpacity" onchange="boundaryFillOpacityChanged()" onmouseover="boundaryFillOpacitySliderMouseOver()">';
    nodes +=        	    '<span class="tooltiptext" style="width: 50%; left: 50%;" id="boundaryFillOpacityValueTooltip"></span>';
    nodes += 	          '</div>';
    nodes +=    	 '</th>';	
    nodes +=         '<th style="padding-left:0;text-align: left"><input  id="boundaryFillColor" onchange="boundaryFillColorChanged()" ></th>'; 
    nodes +=       '</tr>'; 	    

    nodes +=       '<tr>';
    nodes +=         '<th style="padding-left:10%;text-align: left"><p> Stroke Opacity </p></th>';      
    nodes +=         '<th ><div class="tooltip">';
    nodes +=        	    '<input type="range" disabled min="0" max="1" step="0.25" id="strokeOpacity" onchange="strokeOpacityChanged()" onmouseover="strokeOpacitySliderMouseOver()">';
    nodes +=        	    '<span class="tooltiptext" style="width: 50%; left: 50%;" id="strokeOpacityValueTooltip"></span>';
    nodes += 	          '</div>';
    nodes +=    	 '</th>';	 
    nodes +=         '<th style="padding-left:0;text-align: left"><input  id="strokeColor" onchange="strokeColorChanged()" ></th>'; 	       
    nodes +=       '</tr>';

    nodes +=       '<tr>';
    nodes +=         '<th style="padding-left:10%;text-align: left"><p> Stroke Width </p></th>';      
    nodes +=         '<th ><div class="tooltip">';
    nodes +=        	    '<input type="range" disabled min="1"  step="1" id="strokeWidth" onchange="strokeWidthChanged()" onmouseover="strokeWidthSliderMouseOver()">';
    nodes +=        	    '<span class="tooltiptext" style="width: 50%; left: 50%;" id="strokeWidthValueTooltip"></span>';
    nodes += 	          '</div>';
    nodes +=    	 '</th>';	 
    nodes +=       '</tr>';	

		nodes +=      '</table>';  

    nodes +=     '<table>';
    nodes +=       '<colgroup> <col style="width:20%"> <col style="width:20%"><col style="width:20%"><col style="width:20%"><col style="width:20%"></colgroup>';

    nodes +=       '<tr style="border: 3px solid grey">&nbsp</tr>';  

    nodes +=       '<tr>'         
    nodes +=         '<th colspan="1" style="text-align: center"><p> Tile Id </p></th>'; 
    nodes +=         '<th colspan="2">'
    nodes +=             '<input type ="text" id="tileSearchBox" style="color: white" disabled></button>'
    nodes +=         '</th>';   
    nodes +=         '<th colspan="2">'
    nodes +=             '<button onclick="findTile()" id="findTileBtn" disabled>Find</button>'
    nodes +=         '</th>';
    nodes +=       '</tr>' 
    nodes +=      '</table>';          
           
		nodes +=  '</div>';	      


    document.getElementById("grpBoundaryOptions").innerHTML += nodes;
    document.getElementById("boundaryFillOpacity").value = Opts.defaultBoundaryFillOpacity;
    document.getElementById("strokeWidth").max = Opts.maxStrokeWidth;
    document.getElementById("strokeWidth").value = Opts.defaultStrokeWidth;
    document.getElementById("strokeOpacity").value = Opts.defaultStrokeOpacity
    document.getElementById("gridSize").max = Opts.maxGridSizeRange;
    document.getElementById("gridSize").value = Opts.defaultGridSize;

		$("#boundaryFillColor").spectrum({
		    color: Opts.defaultBoundaryFillColor,
		    showAlpha: true
		});

		$("#strokeColor").spectrum({
		    color: Opts.defaultStrokeColor,
		    showAlpha: true
		});	    

	}  



/*--------------------------------------------------Right Panel-----------------------------------------------------*/
/*---------------------------------------------- Features Section---------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------*/



	// To create features checkboxes dynamically //
    toBeModifiedandCodedLater = () => {

		let chartLegendValues = [];
		let chartSeriesItems = [];
		let chartColors = ["#58dccd","#a7ee70", "#36abee"];

		   // To create features checkboxes dynamically //////  
		for(let n = 0; n < featureKeys.length; n++) {
		      if(n >= 3) { // means there is more than 3 different features 
		                randNum= Math.floor(Math.random() * 20);
		                randColor = d3.schemeCategory20[randNum % 20];
		                chartColors.push(randColor)
		      }
		       chartLegendValues[n] = {text:featureKeys[n],color:chartColors[n]}
		       chartSeriesItems[n] = { value: "#" + featureKeys[n] + "#", color: chartColors[n], tooltip:{template: "#" + featureKeys[n] + "#"}}
		}


        for(let n = 0; n < featureKeys.length; n++) {
          featuresSelection[n] = { view: "checkbox", id: "check" + featureKeys[n], label: featureKeys[n], labelPosition: "top", value: 1}
        }
    }



   // check whether the ON/OFF button toggled to ON
   isSimilarRegionBtnEnabled = () => {
        return document.getElementById("findSimilarTileBtn").checked ? true : false;
   }

   isFeaturesCreateBtnEnabled = () => {
      return document.getElementById("createLoadFeaturesBtn").disabled ? false : true;
   }   

   // disableSimilarTilesBtn = (disableFlag) => {
   //    document.getElementById("findSimilarTileBtn").disabled = disableFlag; 
   // }

    freezeFeaturesControls = (freezeFlag = true) => {
        freezeInput("nearestTileMatching", freezeFlag);
        freezeInput("similarityThreshold", freezeFlag); 
        freezeInput("heatmap", freezeFlag); 
   }

   //  ON-OFF Boundary Switch
   similarTilesSwitchClicked = () => {
         //  is switch ON
         if( isSimilarRegionBtnEnabled() ) {
                freezeFeaturesControls(false);
                findSimilarTiles(); 

         } else { 
            //   switch is OFF
                freezeFeaturesControls(true);
                initBoundaries();                
         }
   }

    findSimilarTiles = () => {
       triggerHint(" To be coded ..");
      // to be coded
    }


    // disableNearestTileSlider = (disableFlag) => {
    //   document.getElementById("nearestTileMatching").disabled = disableFlag; 
    // }
    getNumOfNearestTiles = () => {
       return document.getElementById("nearestTileMatching").value;
    }

    nearestTileMatchingMouseOver = () =>{
       updateInputTooltip("nearestTileMatchingTooltip", getNumOfNearestTiles); 
    }

    nearestTileMatchingChanged = () => {
       triggerHint(" To be coded ..");
      // to be coded
    }


    getSimilarityPercent = () => {
       return document.getElementById("similarityThreshold").value;
    }

    // strokeWidthChanged = () => {
    // updateInputTooltip("strokeWidthValueTooltip", getStrokeWidth);
    //     d3.selectAll("polygon").style("stroke-width", getStrokeWidth());    
    // } 

    // strokeWidthSliderMouseOver = () => {
    //   updateInputTooltip("strokeWidthValueTooltip", getStrokeWidth);
    //   //    document.getElementById("strokeOpacityValueTooltip").innerHTML = getStrokeOpacity();
    // }

    // disableSimilarityThresholdSlider = (disableFlag) => {
    //   document.getElementById("similarityThreshold").disabled = disableFlag; 
    // }

    similarityThresholdMouseOver = () => {
       updateInputTooltip("similarityThresholdTooltip", getSimilarityPercent);      
    }

    similarityThresholdChanged = () => {
       triggerHint(" To be coded ..");
      // to be coded
    }


  
  selectedFeature = (elem) => {

       if(elem.checked) {
        	console.log(" elem checked", elem);
    
       } else {
        	console.log(" elem unchecked", elem);
       }    	
  }


	initGrpFeatureOptions = () => { 
    let nodes="";
    let featureKeysCounter = 0;
    const sectionTitle = "Features";
    document.getElementById("grpFeatureOptions").innerHTML=""; 

		nodes +=  '<button class="accordion">';
		nodes +=    '<li style="background-color: none" id="grpFeatureOptionsTitleLi">';
		nodes +=      `<font  style="font-size:0.65vw"  id="grpFeatureOptionsTitle">${sectionTitle}</font>`;
		nodes +=    '</li>';
		nodes +=  '</button>';
		nodes +=  '<div class="accordionpanel">';
		nodes +=     '<table>';
		nodes +=       '<colgroup> <col style="width:20%"> <col style="width:20%"><col style="width:20%"><col style="width:20%"><col style="width:20%"></colgroup>';

    nodes +=       '<tr>'         
    nodes +=         '<th colspan="2" style="text-align: center"><p> Features </p></th>'; 
    nodes +=         '<th ></th>';     
    nodes +=         '<th colspan="2">'
    nodes +=             '<button onclick="createLoadFeatures()" id="createLoadFeaturesBtn" disabled>Load</button>'
    nodes +=         '</th>';
    nodes +=       '</tr>'  

    nodes +=       '<tr style="border: 3px solid grey">&nbsp</tr>'; 

    // nodes +=       '<tr>';



    featureKeys.forEach( (key, idx) => { // load mean, max, std etc..
        if(!(idx % 3)) { // 3 checkboxs in every row
           nodes +=      '<tr>';            
        }
    		// nodes +=       '<tr>';  
    		nodes +=         '<th>';
    		nodes +=   	       `<label class="inputcontainer"><p>${key}</p><input type="checkbox" name="${key}" value="${key}" onclick="selectedFeature(this)" checked><span class="checkmarkrect"></span></label>`;
    		nodes +=         '</th>';	
        nodes +=         '<th></th>'; 

        

        if ( !((idx + 1) % 3) || idx + 1 == featureKeys.length) {
           nodes +=       '</tr>'; 
        }
    		// nodes +=         '<th >';
    		// nodes +=   	       '<label class="inputcontainer"><p>max</p><input type="checkbox" name="max" value="max" onclick="selectedFeature(this)" checked><span class="checkmarkrect"></span></label>';
    		// nodes +=         '</th>';	
        // nodes +=         '<th ></th>'; 
    		// nodes +=         '<th >';
    		// nodes +=   	       '<label class="inputcontainer"><p>std</p><input type="checkbox" name="std" value="std" onclick="selectedFeature(this)" checked><span class="checkmarkrect"></span></label>';
    		// nodes +=         '</th>';	
    		// nodes +=       '</tr>';		
    })

    // nodes +=       '</tr>'; 

    nodes +=       '<tr style="border: 3px solid grey">&nbsp</tr>';  

		nodes +=       '<tr>'         
		nodes +=         '<th colspan="3" style="padding-left:10%;text-align: left"><p> Similar Regions </p></th>'; 
		nodes +=         '<th colspan="2"><label class="switch switch-left-right">';
		nodes +=           '<input class="switch-input" type="checkbox" id="findSimilarTileBtn" onclick="similarTilesSwitchClicked()" disabled />';
		nodes +=           '<span class="switch-label" data-on="On" data-off="Off"></span> ';
		nodes +=           '<span class="switch-handle"></span>' 
		nodes +=         '</label></th>';
		nodes +=       '</tr>'   

    nodes +=       '<tr>';
    nodes +=         '<th colspan="2" style="padding-left:10%;text-align: left"><p> Nearest Tile </p></th>';      
    nodes +=         '<th colspan="3"><div class="tooltip">';
    nodes +=              '<input type="range" disabled min="1"   value="1" step="1" id="nearestTileMatching" onchange="nearestTileMatchingChanged()" onmouseover="nearestTileMatchingMouseOver()">';
    nodes +=              '<span class="tooltiptext" style="width: 50%; left: 50%;" id="nearestTileMatchingTooltip"></span>';
    nodes +=            '</div>';
    nodes +=         '</th>';  
    nodes +=       '</tr>';  

    nodes +=       '<tr>';
    nodes +=         '<th colspan="2" style="padding-left:10%;text-align: left"><p> Similarity % </p></th>';      
    nodes +=         '<th colspan="3"><div class="tooltip">';
    nodes +=              '<input type="range" disabled min="1"   value="1" max="100" step="1" id="similarityThreshold" onchange="similarityThresholdChanged()" onmouseover="similarityThresholdMouseOver()">';
    nodes +=              '<span class="tooltiptext" style="width: 50%; left: 50%;" id="similarityThresholdTooltip"></span>';
    nodes +=            '</div>';
    nodes +=         '</th>';  
    nodes +=       '</tr>';

    nodes +=       '<tr style="border: 3px solid grey">&nbsp</tr>';  


    nodes +=       '<tr>'         
    nodes +=         '<th colspan="3" style="padding-left:10%;text-align: left"><p> Heatmap </p></th>'; 
    nodes +=         '<th colspan="2"><label class="switch switch-left-right">';
    nodes +=           '<input class="switch-input" type="checkbox" id="heatmap" onclick="roiHeatmap()" disabled />';
    nodes +=           '<span class="switch-label" data-on="On" data-off="Off"></span> ';
    nodes +=           '<span class="switch-handle"></span>' 
    nodes +=         '</label></th>';
    nodes +=       '</tr>'          


		nodes +=      '</table>'  
           
		nodes +=  '</div>';	      

	  document.getElementById("grpFeatureOptions").innerHTML += nodes;

	}  


/*--------------------------------------------------Right Panel-----------------------------------------------------*/
/*---------------------------------------------- Channels Display---------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------*/


  // <input type="radio" id="layerOption" name="renderMode" value="layer">
  // <label for="male">Layers</label><br>
  // <input type="radio" id="blendOption" name="renderMode" value="blend">
  // <label for="blend">Blend</label><br>
  // <input type="radio" id="compositeOption" name="renderMode" value="composite">
  // <label for="composite">Composite</label>


//   <label class="container">Layers
//   <input type="radio" checked="checked" name="renderMode">
//   <span class="checkmark"></span>
// </label>
// <label class="container">Blend
//   <input type="radio" name="renderMode">
//   <span class="checkmark"></span>
// </label>
// <label class="container">Composite
//   <input type="radio" name="renderMode">
//   <span class="checkmark"></span>
// </label>



   getSelectedCompositeOperation = () => {
   	   return currentGrpFeaturesSelectionStates.compositeOperation;
   }

   setCurCompositeOperation = () =>{
       let curCompositeOperation = document.getElementById("compositeOperations").value;
       currentGrpFeaturesSelectionStates.compositeOperation = curCompositeOperation;
   }

   getSelectedDisplayOption = () => {
   	   return currentGrpFeaturesSelectionStates.displayOption;

   }

   setCurDisplayOption = (curOption) =>{
        currentGrpFeaturesSelectionStates.displayOption = curOption.value;
        curOption.value !== "composite" ? document.getElementById("compositeOperations").disabled = true : 
                                          document.getElementById("compositeOperations").disabled = false; 
	}

	// compositeChanged = () =>{
 //        console.log( document.getElementById("compositeOperations").value )

	// }

	confirmDisplayChanges = () =>{
		let curGroup = getSelectedGroup();
		let curCompositeType = getSelectedCompositeOperation();
		if(lastGrpFeaturesSelectionStates.displayOption !== getSelectedDisplayOption()){

		        switch ( getSelectedDisplayOption()){
		               case 'layers':
		                              {
								        reloadOSD(curGroup, false);  // compositeFlag = false
		                                break;                 
		                              }
		                case 'blend':
		                              {
								      //  reloadOSD(curGroup, true, compositeType);
								        triggerHint("To be Coded ..");
		                                break;                
		                              }

		                case 'composite':
		                              {
								        reloadOSD(curGroup, true, curCompositeType);
		                                break;             
		                              }		                                 
		                }   

		        lastGrpFeaturesSelectionStates.displayOption = getSelectedDisplayOption();
       
        } else if(lastGrpFeaturesSelectionStates.compositeOperation !== curCompositeType){
				 reloadOSD(curGroup, true, curCompositeType);
                 lastGrpFeaturesSelectionStates.compositeOperation = curCompositeType;
        } else {
          triggerHint("No change in current view option", "error", 3000);
        }

	}
 
  requestOperationInfo = () =>{
    	let curOperationValue = document.getElementById("compositeOperations").value;
    	let operationEntry = compositeOperations.filter( operation => operation.type === curOperationValue);
        triggerHint(operationEntry[0].description, "info", 7000);
	}

	initGrpChnlDisplayOptions = () => { 
	    let nodes="";
	    let sectionTitle = 'Channels Display';
	    document.getElementById("grpChnlDisplyOptions").innerHTML=""; 

		nodes +=  '<button class="accordion">';
		nodes +=    '<li style="background-color: none" id="grpDisplayOptionsTitleLi">';
		nodes +=      `<font  style="font-size:0.65vw"  id="grpDisplayOptionsTitle">${sectionTitle}</font>`;
		nodes +=    '</li>';
		nodes +=  '</button>';
		nodes +=  '<div class="accordionpanel">';
		nodes +=     '<table>';
		nodes +=       '<colgroup> <col style="width:50%"> <col style="width:50%"></colgroup>';


		// nodes +=       '<colgroup> <col style="width:10%"> <col style="width:50%"> <col style="width:40%"></colgroup>';
		// nodes +=       '<tr>';  
		// nodes +=         '<th >';
		// nodes +=   		   '<input type="radio" id="layerOption" name="renderMode" value="layer">';
		// nodes +=         '</th>';	
		// nodes +=         '<th>';
		// nodes +=  	       '<label for="layerOption">Layers</label>';
		// nodes +=         '</th>';	
		// nodes +=       '</tr>'  

		// nodes +=       '<tr>';  
		// nodes +=         '<th >';
		// nodes +=   		   '<input type="radio" id="blendOption" name="renderMode" value="blend">';
		// nodes +=         '</th>';	
		// nodes +=         '<th>';		
		// nodes +=  	       '<label for="blendOption">Blend</label>';
		// nodes +=         '</th>';	
		// nodes +=       '</tr>';  

		// nodes +=       '<tr>';  
		// nodes +=         '<th >';
		// nodes +=   	       '<input type="radio" id="compositeOption" name="renderMode" value="composite" checked>';
		// nodes +=         '</th>';	
		// nodes +=         '<th>';			
		// nodes +=  	       '<label for="compositeOption">Composite</label>';
		// nodes +=         '</th>';	

		nodes +=       '<tr>';  
		nodes +=         '<th >';
		nodes +=   	       '<label class="inputcontainer"><p>Layers</p><input type="radio" name="renderMode" value="layers" onclick="setCurDisplayOption(this)"><span class="checkmark"></span></label>';
		nodes +=         '</th>';	
		nodes +=       '</tr>';			

		// nodes +=         '</th>';

		nodes +=       '<tr>';  
		nodes +=         '<th >';
		nodes +=   	       '<label class="inputcontainer"><p>Blend</p><input type="radio" name="renderMode" value="blend" onclick="setCurDisplayOption(this)"><span class="checkmark"></span></label>';
		nodes +=         '</th>';	
		nodes +=       '</tr>';			

		// nodes +=         '</th>';		


		nodes +=       '<tr>';  
		nodes +=         '<th >';
		nodes +=   	       '<label class="inputcontainer"><p>Composite</p><input type="radio" name="renderMode" value="composite" checked onclick="setCurDisplayOption(this)"><span class="checkmark"></span></label>';
		nodes +=         '</th>';	


		nodes +=         '<th>';			
		nodes +=    		'<select name="compositeOptions" id="compositeOperations" onchange="setCurCompositeOperation()">';

        compositeOperations.forEach((operation, idx) => {

        	if(operation.type === Opts.defaultCompositeOperation) {
    		   nodes +=    `<option value=${operation.type} selected>${operation.type}</option>`;        
    	    } else {
    		   nodes +=    `<option value=${operation.type}>${operation.type}</option>`;  
    	    }
        });

 		nodes +=  			 '</select>';
		nodes +=         '</th>';
		nodes +=       '</tr>'

		nodes +=       '<tr style="border: 3px solid grey">&nbsp</tr>'  

        nodes +=  		'<tr >'  
        nodes +=    		'<td >'
        nodes +=       		   '<a  href="javascript:void(0)" onclick="confirmDisplayChanges()"><i style="font-size:1vw;"    class="fa fa-check-circle"></i></a>'
        nodes +=     		'</td>'
        nodes +=    		'<td >'
        nodes +=       		   '<a  href="javascript:void(0)" onclick="requestOperationInfo()"><i style="font-size:1vw;"    class="fa fa-info-circle"></i></a>'
        nodes +=     		'</td>'        
        nodes +=   		'</tr>'  

		nodes +=      '</table>'  
           
		nodes +=  '</div>';	      

	    document.getElementById("grpChnlDisplyOptions").innerHTML += nodes;

	}  	

	initAccordionClick = () => { 

		for(let btn of document.getElementsByClassName("accordion")) {
		    btn.onclick = function() {
		        this.classList.toggle("active");
		        this.nextElementSibling.classList.toggle("show");
		    }
		};
	}	




/*------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------- TO be coded setion-------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------*/




   testme = () => {
   	      d3.selectAll(".grid").remove();

          
          let tileWidth = getGridSize();
          let tileIndex = 0;
       
          let imageWidth =  currentItemInfo.width;
          let imageHeight =  currentItemInfo.height;

          let totalTiles = Math.ceil(imageWidth/tileWidth) * Math.ceil(imageHeight/tileWidth);
          let tilesCounter = 0;
          let diffWidth, diffHeight;            

          let fgThreshold = 0 // out of 256

          for (let i = 0; i < imageWidth / tileWidth; i++) {
            for (let j = 0; j < imageHeight / tileWidth; j++) {

              if(((i + 1) * tileWidth) > imageWidth) {
                  diffWidth = ((i + 1) * tileWidth) - imageWidth;
              } else {
                  diffWidth = 0;
              }

              if(((j + 1) * tileWidth) > imageHeight) {   
                  diffHeight = ((j + 1) * tileWidth) - imageHeight;
              } else {
                  diffHeight = 0;                
              }

              let pointArray = i * tileWidth + "," + j * tileWidth + " " +
                i * tileWidth + "," + (((j + 1) * tileWidth) - diffHeight) + " " +
                (((i + 1) * tileWidth) - diffWidth) + "," + (((j + 1) * tileWidth) - diffHeight) + " " +
                (((i + 1) * tileWidth) - diffWidth) + "," + (j) * tileWidth + " " +
                i * tileWidth + "," + j * tileWidth;  
                        
                let randInt = Math.floor(Math.random() * 20);
                let fillColor = d3.schemeCategory20[ randInt % 20 ];
                // var tileStd = getTileStd( i* tileWidth,j * tileWidth,tileWidth,tileWidth) 
                let tileStd = 1;  // temproray till decide on using std or whatever to filter bg tiles
                tilesCounter += 1;

//                showHint("Grid completed :  " + Math.ceil((1- ((totalTiles-tilesCounter)/totalTiles) ) * 100) + "%");

                if(tileStd > fgThreshold){

                     d3.select(overlay.node()) 
		                .append("polygon")
		                .attr("Xcentroid", (i * tileWidth) + (tileWidth / 2))
		                .attr("Ycentroid", (j * tileWidth) + (tileWidth / 2))    
		                .attr("left", i * tileWidth)
		                .attr("top", j * tileWidth)
		                .attr('points', pointArray)
		                .style('fill', fillColor)
		  //              .style('fill-opacity', $$("SpxOpacity").getValue())
		                .attr('class', 'grid')
		                .style('stroke', 'green')
		                .attr('origStrokeColor', 'green')
		                .style('stroke-width', 1)
		//                .style('stroke-opacity', $$("strokeOpacity").getValue())
		                .attr('origStroke-width', 1)
		                .attr('id', 'grid-' + i + '-' + j)
		                .attr('index', i + '-' + j)
		                .attr('origColor', fillColor) //need this if I want to switch color back
              } //end of if
            }
          }
     

    //     }
    //   }
    // });


   }
//////////////////////////////////////////////////////////////////////////////

removeBoundaries = () => {
     d3.selectAll("polygon").remove();     // to make it independent of class type
  }

removeTile = (tileId) => {
     d3.select("#"+ tileId).remove();     // to make it independent of class type
  }  
  
//////////////////////////////////////////////////////////////////////////////////////
function loadTilesLabel(){
    let tileType =  "SPX";
    let tileSize =   64;
    let saveFileName = slideName + "." + currentIndex + "." + tileType + "." + tileSize.toString(); 

    let savedTileLabels = getFeatures(saveFileName);
    if((savedTileLabels == null)||(savedTileLabels == "Notexist")){
       webix.message("no saved labels");
    }else{
         if(tileType == "SPX")
            SPXTilesLabel = JSON.parse(savedTileLabels);

         webix.message("labels Loaded"); 

    }

  }
////////////////////////////////////////////////////
function plotProp(left_value, top_value, width_value, height_value, obj)
{
 
 if( allTilesFeatures.length == 0) 
  {
    let probDataToPlot = getTileProp(left_value, top_value, width_value, height_value);
    
     // for(let k=1; k <= numOfFrames; k++) {   //top frame has k=numOfFrames
     //   var config=eval("config_"+k)
     //    webix.ajax().sync().get("http://127.0.0.1:"+flaskPort+"/getTileProp","left="+left_value+"&top="+top_value+"&Width="+width_value+"&Height="+height_value+"&BaseUrl="+config['BASE_URL']+"&id="+config['ItemId']+"&Authentication="+ config['AUTHENTICATION']+"&DSA_User="+ config['DSA_USER']+"&Password="+ config['PASSWORD'], function(response) {
     //       var Hist=JSON.parse(response);
     //       temp={};
     //       for(var n=0; n< featuresKeys.length; n++)
     //       {
     //         if (Hist.hasOwnProperty(featuresKeys[n])) 
     //            {
     //             temp[featuresKeys[n]] = Hist[featuresKeys[n]][1];  // 1 as one of the equal values e.g (std=[250,250,250])
     //            }
     //       }
     //       temp["Frame"] = config.Channel_Name;
           probDataToPlot.push(temp)
          
  //         probDataToPlot.push({ "mean": Hist['rgb_means'][1], "max": Hist['max'][1], "std": Hist['stdev'][1], "Frame" :config.Channel_Name })

        // });
      // }
           $$("propChart2").clearAll();
           $$("propChart2").parse(probDataToPlot);
     

  } else {
           let tile = findObjectByKeyValue(allTilesFeatures, 'id', d3.select(obj).attr('id'));
           $$("propChart2").clearAll();
           $$("propChart2").parse(tile.features);
    
  }
        // tileProbData.push({ "OSDLayer": k-1, "mean": Hist['rgb_means'][1], "max": Hist['max'][1], "stdev": Hist['stdev'][1], "frame" :eval("config_"+k).Channel_Name})
         // curTileFeatures=getTileProp(bbox['left'],bbox['top'],bbox['width'],bbox['height']); 
         //curTileFeatures= { "OSDLayer": k-1, "mean": Hist['rgb_means'][1], "max": Hist['max'][1], "stdev": Hist['stdev'][1], "frame" :eval("config_"+k).Channel_Name}
         //allTilesFeatures.push({id:this.id, coordinates: this.points, features:curTileFeatures})
      //    obj.attributes.points.nodeValue.split(" ").forEach(function(ptData, i) {
        
      //      xpx.push(parseInt(ptData.split(",")[0]));
      //      ypx.push(parseInt(ptData.split(",")[1]));
           
      // })

}

/////////////////
function onSelectedTile (d, i) { // Add interactivity

    // setSelectedTile( d3.select(this).attr('id') );
    setSelectedTile(this);
    let curTile = d3.select(this);
  

    if(d3.select(this).attr('class') == "spx"){
         allSelection.push(this.id);  // to be used for undo ..
     }

    if(d3.select(this).attr('class') == "grid"){
         allGridSelection.push(this.id);  // to be used for undo ..
     }
     
    
  
    if( !isSuperPixel() ){
          let prevTileId = getLastSelectedTileId();
          let prevTile = d3.select("#" + prevTileId);
          // let strokeWidth = 10;
          if( (prevTileId != null) && (prevTileId != getSelectedTileId() )) {
                  let origTileColor = prevTile.attr('origColor');
                  prevTile.style('fill', origTileColor)
                  prevTile.style("fill-opacity", getBoundaryFillOpacity())
                  prevTile.style('stroke', 'blue');
                  prevTile.style('stroke-width', Opts.selectedTileStrokeWidth);
                  prevTile.style('stroke-opacity', 1);
                  // prevTileId= d3.select(this).attr('id');
         } 

         setLastSelectedTileId( curTile.attr('id') );
         
    }   
       
    
    curTile.style("fill-opacity", Opts.selectedTileFillOpacity);
    curTile.style("fill", Opts.selectedTileFillColor);
    // d3.select("#" + this.id).style("fill-opacity", 'none')
    // d3.select("#" + this.id).style('stroke-width', Opts.selectedTileStrokeWidth)
    // d3.select("#" + this.id).style('stroke', 'yellow')
    // d3.select("#" + this.id).style('stroke', 'yellow')

    let bbox = find_bbox(this);
    let entry = findObjectByKeyValue( Boundary_box, 'id', getSelectedTileId() ); // to check whether the entry exists or no..

    if (entry == null) { 
       Boundary_box.push({id: this.attributes.id.nodeValue, index: this.attributes.index.nodeValue,
                         xcent: this.attributes.Xcentroid.nodeValue, ycent:this.attributes.Ycentroid.nodeValue,
                         left: bbox['left'], top: bbox['top'], width: bbox['width'], height:bbox['height']});
    }

    //currentIndex = this.attributes.index.nodeValue;
    // loadCanvas(bbox['left'],bbox['top'],bbox['width'],bbox['height'],currentIndex.toString());

          
    // if ($$("Features").getValue()=="RGB")
    //       {
    //           PlotRGB(bbox['left'],bbox['top'],bbox['width'],bbox['height'],$$("NumOfBins").getValue());

    //                   sortedDeEnDistances=[];
    //                   HistFeatures1D=[];
    //                   var currentTileFeatures = findObjectByKeyValue(allTilesFeatures, 'id', d3.select(this).attr('id')); 
    //                   HistFeatures1D=getHistFeatures(bbox['left'],bbox['top'],bbox['width'],bbox['height'],$$("NumOfBins").getValue());
              
    //           if($$("findSimilarTiles").getValue()==1)
    //           {
    //                   lookupSimilars(HistFeatures1D);
                      
    //           } 

    //       }
          

/*-----------------------------------------------------------------------
    $$("findSimilarTiles").enable();                          <-------------------------------------------------
------------------------------------------------------------------------*/

} // end of onSelectedTile
/////////////////////////////////////////////////////
// when mouse leave OSD overlay
function handleMouseLeave  (d, i) { // Add interactivity
     document.getElementById("currentTile").innerHTML = "";
}
///////////////////////////////////////////////////
function handleMouseOver (d, i) { // Add interactivity

  let tileType  = getTileType();

  let index = findObjectByKeyValue(eval(tileType+"TilesLabel"), 'id', this.attributes.id.nodeValue, 'INDEX' ); // to check whether the entry exists or no..

  if(index == null) {
    if( isSuperPixel() ) {
        document.getElementById("currentTile").innerHTML = "SPX ID : " + this.attributes.index.nodeValue;
    }
    else {
        document.getElementById("currentTile").innerHTML = "Grid ID : " + this.attributes.index.nodeValue;
    }    
  }else{
    if( isSuperPixel() ) {
        document.getElementById("currentTile").innerHTML = "SPX ID : " + this.attributes.index.nodeValue  + ",      Label : " + eval(tileType+"TilesLabel")[index].tilelabel;
    }
    else {
        document.getElementById("currentTile").innerHTML = "Grid ID : " + this.attributes.index.nodeValue + ",      Label : " + eval(tileType+"TilesLabel")[index].tilelabel;
    }
  }


    // if( isSuperPixel() ){
    //      Opts.StrokeWidthOnHover = 10;
    // } else { 
    //      Opts.StrokeWidthOnHover = 10;
    // } 




    
    d3.select(this).style('stroke', Opts.StrokeColorOnHover);
    d3.select(this).style('stroke-width',   Opts.StrokeWidthOnHover);
    d3.select(this).style('stroke-opacity', Opts.StrokeOpacityOnHover);
    
    if( isPanelActive("chPlotsPanel") ){    
          let bbox = find_bbox(this);    // drawing is the shape flag 
          plotProp(bbox['left'], bbox['top'], bbox['width'], bbox['height'], this); 
     }

}

///////////////////////////////////////////////////
function handleTileMouseLeave (d, i){
        
         d3.select(this).style('stroke', getStrokeColor());
         d3.select(this).style('stroke-width', getStrokeWidth());
         d3.select(this).style('stroke-opacity', getStrokeOpacity());         

       /*  $$("propChart2").clearAll();            <--------------------------------*/

}

/////////////////////////////////////

function  handleMouseRightClick(){
    let currentRightClickedTile = this;
    setRightClickedTile(this);

    if( isSuperPixel() ) {
       menu1[0].title = "SPX " + currentRightClickedTile.attributes.index.nodeValue;
       menu2[0].title = "SPX " + currentRightClickedTile.attributes.index.nodeValue;
       menu3[0].title = "SPX " + currentRightClickedTile.attributes.index.nodeValue;
     } else {
       menu1[0].title = "Grid " + currentRightClickedTile.attributes.index.nodeValue;
       menu2[0].title = "Grid " + currentRightClickedTile.attributes.index.nodeValue;
       menu3[0].title = "Grid " + currentRightClickedTile.attributes.index.nodeValue;
    }
   
}


/////////////////////////////////////////////////////////////////////////////
// For future use
// function mark(elem, marker){

//  var tileType = "SPX";
//  var tileSize = 64 ;

//  var index = findObjectByKey(eval(tileType + "TilesLabel"), 'id', elem.id, 'INDEX' ); // to check whether the entry exists or no..


//  if(marker != "None") {

//     if(index == null) {
//        eval(tileType + "TilesLabel").push({id: element.id, index: element.attributes.index.nodeValue, size: tileSize, tileLabel: marker})

//      } else {
//          if(eval(tileType + "TilesLabel")[index].tilelabel != marker) {
//                 eval(tileType + "TilesLabel")[index].tilelabel = marker;
//          }
//      }
//   } else {
//        eval(tileType + "TilesLabel").splice(index, 1);
//        if(eval(tileType + "TilesLabel").length == 0) {
//           $$("saveLabels").disable();
//           $$("heatmap").disable();
//           $$("PrevAnnotated").disable();
//           $$("NextAnnotated").disable();
//         }
//    }
// }
function mark(elem, marker){
  
 let tileType = getTileType();
 let tileSize;
 if( isSuperPixel()){
     tileSize = null ;
 } else {
     tileSize = getGridSize();
 }

 var index = findObjectByKeyValue(eval(tileType + "TilesLabel"), 'id', elem.id, 'INDEX' ); // to check whether the entry exists or no..


 if(marker != "None") {

    if(index == null) {
       eval(tileType + "TilesLabel").push({id: element.id, index: element.attributes.index.nodeValue, size: tileSize, tileLabel: marker})

     } else {
         if(eval(tileType + "TilesLabel")[index].tilelabel != marker) {
                eval(tileType + "TilesLabel")[index].tilelabel = marker;
         }
     }
  } else {
       eval(tileType + "TilesLabel").splice(index, 1);
       if(eval(tileType + "TilesLabel").length == 0) {
          $$("saveLabels").disable();
          $$("heatmap").disable();
          $$("PrevAnnotated").disable();
          $$("NextAnnotated").disable();
        }
   }
}
//////////////////////////////////////////
 menu1 = [{
            title: '',
            action: function(elm, d, i) {

            }
         
         }]  


 menu2 = [{

            title: '',
            action: function(elm, d, i) {

            }
            }, {
            title: 'Show Tile',
            action: function(elm, d, i) {
              currentRightClickedTile = getRightClickedTile();
              rightClickedbbox = find_bbox(currentRightClickedTile);
              currentRightClickedIndex = currentRightClickedTile.attributes.index.nodeValue;
              loadCanvas(rightClickedbbox['left'],rightClickedbbox['top'],rightClickedbbox['width'],rightClickedbbox['height'],currentRightClickedIndex.toString());
            }
            
         }] 




menu3 = [{

      title: '',
      action: function(elm, d, i) {

      }
   
    },{

      title: 'Mark Positive',
      action: function(elm, d, i) {
        element =  getRightClickedTile();
        d3.selectAll("#" + element.id).style("fill", "green")
        d3.selectAll("#" + element.id).style("fill-opacity", "1")
        d3.selectAll("#" + element.id).style("stroke", "green")
        d3.selectAll("#" + element.id).style("stroke-opacity", "1")
        mark(element,"P");
      }
    },{

      title: 'Mark Negative',
      action: function(elm, d, i) {
        element =  getRightClickedTile();
        d3.selectAll("#" + element.id).style("fill", "red")
        d3.selectAll("#" + element.id).style("fill-opacity", "1")
        d3.selectAll("#" + element.id).style("stroke", "red")
        d3.selectAll("#" + element.id).style("stroke-opacity", "1")
        mark(element,"N");
      }

    }, {
      title: 'Remove Selection',
      action: function(elm, d, i) {
        element =  getRightClickedTile();
        OrigColor = d3.select("#" + element.id).attr('origColor')

        d3.selectAll("#" + element.id).style("fill", OrigColor)
        d3.selectAll("#" + element.id).style("fill-opacity", $$("SpxOpacity").getValue())
        d3.selectAll("#" + element.id).style("stroke", 'none')
        mark(element,"None");
     
      }
    }, {
      title: 'Show Tile',
      action: function(elm, d, i) {
        currentRightClickedTile = getRightClickedTile();
        rightClickedbbox = find_bbox(currentRightClickedTile);
        currentRightClickedIndex = currentRightClickedTile.attributes.index.nodeValue;
        loadCanvas(rightClickedbbox['left'],rightClickedbbox['top'],rightClickedbbox['width'],rightClickedbbox['height'],currentRightClickedIndex.toString());
       
      }
    }]

 
////////////////////////////////////
isBoundariesLoaded = () => {
    return d3.selectAll( getClassType() )[0].length ? true : false; 
}

getTotalTilesNum = () => {
    return  d3.selectAll( getClassType() )[0].length; 
}

zoomToTile = (obj) => {
    console.log(obj)
    var obj_bbox = find_bbox(obj);
    var zoomArea = viewer.viewport.imageToViewportRectangle(obj_bbox['left'],obj_bbox['top'],obj_bbox['width'],obj_bbox['height']);
    viewer.viewport.fitBounds(zoomArea);
}

///////////////////////////////////////////////
// function locateTile(spx_Class, bound_ID){   // locat SPX on WSI by its id
//     d3.selectAll(spx_Class).each(function(d) {   
//       if(d3.select(this).attr('id') == bound_ID) {
//            zoomToTile(this);
//       }
//     });
// }



findTile = () => {
     let tileToFind = document.getElementById("tileSearchBox").value;
     let tileId = isSuperPixel() ? 'boundaryLI' + tileToFind : 'grid-' + tileToFind;
     let tileClass = getClassType();

     if( isBoundariesLoaded() ) {
            let existFlag = 0;  
            d3.selectAll(tileClass).each(function(d) {
              if (d3.select(this).attr('id') == tileId){
                  existFlag = 1;
              }                 
            })

           if(existFlag) {
              let foundTile = document.getElementById(tileId);
              zoomToTile(foundTile);
             // locateTile(tileClass, tileId);
             // existFlag = 0;
           } else {
             triggerHint("Not a valid entry");
           }

     } else {
           triggerHint("No loaded tiles")
     }

  
}
///////////////////////////////////////////////////////////////////////////////////////
///////////////Grid initiaiton ///////////////////////////////

 initGridOverlay = () => {

          d3.selectAll(".grid").remove();

          let tileWidth = getGridSize();
          let tileIndex = 0;
       
          let imageWidth =  currentItemInfo.width;
          let imageHeight =  currentItemInfo.height;
//          reformat_Grid_StringToDSA=[];      
     
          allGridSelection = [];
          GridTilesLabel = [];
          allTilesFeatures = [];
          resetTileValues();
/*          $$("propChart2").clearAll();
          $$("SpxOpacity").enable()
          $$("createLoadFeatures").enable();
          $$("createLoadFeatures").enable();
          $$("findSPX").enable();      
*/              
          // $$("findSimilarTiles").enable();

          // updateStorageInfo();
          //if(isLocalFileExist(storageItemName + storageItemName_Ext + ".feat", dirPath) == "T"){

          if( isLocalFileExist( getGrpFeaturesFileName(), getGrpFeaturesLocalPath()) ){            
          //  $$("createLoadFeatures").setValue("Load");
             console.log(" features found ...")
         /*--->    createLoadFeatures();       */
             document.getElementById("createLoadFeaturesBtn").disabled = true;

          }else{
            document.getElementById("createLoadFeaturesBtn").innerHTML = "Create";
            triggerHint("No Grid features found, click Create features from Features menu", "info", 7000)
          }

          let totalTiles = Math.ceil(imageWidth / tileWidth) * Math.ceil(imageHeight / tileWidth);
          let tilesCounter = 0;
          let diffWidth = 0;
          let diffHeight = 0;            

          let fgThreshold = 0 // out of 256

          for (let i = 0; i < imageWidth / tileWidth; i++) {
            for (let j = 0; j < imageHeight / tileWidth; j++) {

              if(((i + 1) * tileWidth) > imageWidth) {
                  diffWidth = ((i + 1) * tileWidth) - imageWidth;
              } else {
                  diffWidth = 0;
              }

              if(((j + 1) * tileWidth) > imageHeight) {   
                  diffHeight = ((j + 1) * tileWidth) - imageHeight;
              } else {
                  diffHeight = 0;                
              }

              let pointArray = i * tileWidth + "," + j * tileWidth + " " +
                i * tileWidth + "," + (((j + 1) * tileWidth) - diffHeight) + " " +
                (((i + 1) * tileWidth) - diffWidth) + "," + (((j + 1) * tileWidth) - diffHeight) + " " +
                (((i + 1) * tileWidth) - diffWidth) + "," + (j) * tileWidth + " " +
                i * tileWidth + "," + j * tileWidth;
                 // for future use
                // if(fileToDownload == null){
                //   reformatGridString=[];
                //   reformatGridString.push([parseFloat(i * tileWidth ) , parseFloat(j * tileWidth ), 0])
                //   reformatGridString.push([parseFloat(i * tileWidth) , parseFloat(((j + 1) * tileWidth)-diffHeight), 0])
                //   reformatGridString.push([parseFloat(((i + 1) * tileWidth)-diffWidth) , parseFloat(((j + 1) * tileWidth)-diffHeight), 0])
                //   reformatGridString.push([parseFloat(((i + 1) * tileWidth)-diffWidth ) , parseFloat(j * tileWidth), 0])
                //   reformatGridString.push([parseFloat(i * tileWidth ) , parseFloat(j * tileWidth ), 0])   
                // }    

                let randInt = Math.floor(Math.random() * 20);
                // let fillColor = 'yellow';
                // let fillColor = d3.schemeCategory20[ randInt % 20 ];
                // let fillColor = d3.scaleOrdinal(d3.schemeCategory20);
                // var tileStd = getTileStd( i* tileWidth,j * tileWidth,tileWidth,tileWidth) 
                let tileStd = 1;  // temproray till decide on using std or whatever to filter bg tiles
                tilesCounter += 1;

                // showHint("Grid completed :  " + Math.ceil((1- ((totalTiles-tilesCounter)/totalTiles) ) * 100) + "%");

                if(tileStd > fgThreshold){
                // for future use
                // if(fileToDownload == null){                  
                //   reformat_Grid_StringToDSA.push({closed:true,id:'grid-' + i + '-' + j, extra:{features:{}}, points:reformatGridString, extra:{}, fillColor:"rgba(0,0,0,0)",lineColor:"rgb(255,0,0)",lineWidth:0.2, type:"polyline" }) 
                // }                  




	                d3.select(overlay.node()) 
		                .append("polygon")
		                .attr("Xcentroid", (i * tileWidth) + (tileWidth / 2))
		                .attr("Ycentroid", (j * tileWidth) + (tileWidth / 2))    
		                .attr("left", i * tileWidth)
		                .attr("top", j * tileWidth)
		                .attr('points', pointArray)
		                // .style('fill', function(d){ return fillColor(d)})
		                .style('fill', getBoundaryFillColor())		                
		                .style('fill-opacity', getBoundaryFillOpacity())		  
		                .attr('class', 'grid')
		                .style('stroke', getStrokeColor())
		                .attr('origStrokeColor', Opts.defaultStrokeColor)
		                .style('stroke-width', getStrokeWidth())
		//                .style('stroke-opacity', $$("strokeOpacity").getValue())
		                .style('stroke-opacity', getStrokeOpacity())		
		                .attr('origStroke-width', Opts.defaultStrokeWidth)
		                .attr('id', 'grid-' + i + '-' + j)
		                .attr('index', i + '-' + j)
		                .attr('origColor', Opts.defaultBoundaryFillColor) //need this if I want to switch color back		                
		                .on('dblclick',  onSelectedTile)
		                // // .attr('origColor', function(d){ return fillColor(d)}) //need this if I want to switch color back
		                .on('contextmenu', handleMouseRightClick)     
		                .on('mouseleave', handleTileMouseLeave) 
		                .on('mouseover', handleMouseOver);

	                d3.select(overlay.node()).on('mouseleave',handleMouseLeave)
	                .call(d3.behavior.zoom().on("zoom", function () { 
	                   d3.select('.d3-context-menu').style('display', 'none');
	                }))
	                .on('contextmenu', function(d, i){ 
	                    if( !isSuperPixel() ){ 
	                        contextMenu(menu1);
	                    }
	                 }); 
	                 
              } //end of if
            }
          }
     

    //     }
    //   }
    // });
  }



getFeatures = (fileName, featuresFolder) => {
    let results = [];
    webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort + "/readFeatures","filename="+fileName+"&outfolder="+featuresFolder, response => {
       results = response;
     });

     return results;
}

saveFeatures = (filename, Directory, featuresDic, writeMode = "w", lastChunkFlag = 0) => {
    webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +"/saveFeatures",
          "name=" + filename+"&Dir=" + Directory+"&featuresDicData="+featuresDic+"&lastChunkFlag="+lastChunkFlag+"&mode="+writeMode,
           function(response) {
              console.log(response)
           });
  }    


find_bbox = (obj, flag = "SPX/Grid") => {
       let xpx = [];
       let ypx = [];
       let box = [];

      if(flag == "SPX/Grid") {
         obj.attributes.points.nodeValue.split(" ").forEach(function(ptData, i) {
           xpx.push(parseInt(ptData.split(",")[0]));
           ypx.push(parseInt(ptData.split(",")[1]));
         })
      }

      if(flag == "freeDrawing") {
        obj.points.forEach(function(ptData, i) {
          xpx.push(ptData[0]);
          ypx.push(ptData[1]);
        })

      }
   
      xpx_sorted = xpx.sort();
      if(xpx_sorted[0] > xpx_sorted[xpx.length-1]) {
         xpx_sorted.reverse();
      }

      ypx_sorted = ypx.sort();
      if(ypx_sorted[0] > ypx_sorted[ypx.length-1]) {
         ypx_sorted.reverse();
      }

      xpx_min = xpx_sorted[0];
      xpx_max = xpx_sorted[xpx.length-1];
      ypx_min = ypx_sorted[0];
      ypx_max = ypx_sorted[ypx.length-1];
      xWidth = xpx_max-xpx_min;
      yHeight = ypx_max-ypx_min;

      box['left'] = xpx_min;
      box['top'] = ypx_min;
      box['width'] = xWidth;
      box['height'] = yHeight;

      return box
}

getTileProp = (left_value, top_value, width_value, height_value) => { // Need only the top tile to find the grids cover all stack
   let tileProbData=[]; 
   let curGroup = getSelectedGroup();
   let numOfFrames = curGroup.Channels.length;
   let apiUrl = getHostApi();
   let apiKey = getApiKey(); 
   let itemId = getSelectedItemId();
   

   for(let k = 0; k < numOfFrames; k++){  //top frame has k = numOfFrames
     let frameNum = curGroup.Numbers[k];
 
     webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort + 
      "/getTileProp","left=" + left_value + "&top=" + top_value + "&width=" + width_value + "&height=" + height_value +
      "&baseUrl=" + apiUrl + "&apiKey=" + apiKey + "&itemId=" + itemId + "&frameNum=" + frameNum , function(response) {

           let hist = JSON.parse(response);
           // console.log(" hist :", hist)
           let temp = {};
           temp["OSDLayer"] = k;
           for(let n = 0; n < featureKeys.length; n++) {
             if ( hist.hasOwnProperty(featureKeys[n]) ) {
                // Alternatively:  
                //  var keyIndex=  Object.keys(hist).indexOf( featureKeys[n] )   
                // var keyName =  Object.keys(hist)[  keyIndex ]  
                // var keyValue= hist[ keyName ][1] 
                //OR simply
                 temp[featureKeys[n]] = hist[featureKeys[n]];
                }
             // temp[featureKeys[0]] = hist['mean'][1];
             // temp[featureKeys[1]] = hist['max'][1];
             // temp[featureKeys[2]] = hist['stdev'][1];
           }

           temp["Frame"] = curGroup.Channels[k];
           tileProbData.push(temp)
       //   tileProbData.push({ "OSDLayer": k, "mean": hist['mean'], "max": hist['max'], "std": hist['stdev'], "Frame": curGroup.Channels[k])
            
    });

   }

   return tileProbData;

}

  // Get the class of selected boundary type
  getClassType = () =>{
      return isSuperPixel() ? ".spx" : ".grid";
  }

  // Get tile type 
  getTileType = () =>{
      return isSuperPixel() ? "SPX" : "Grid";
  }

 splitString = (string, size ) => {     // https://gist.github.com/hendriklammers/5231994
        let re = new RegExp('.{1,' + size + '}', 'g');
        return string.match(re);
  }  


  createLoadFeatures = () => {
        let fetchedFeatures = getFeatures( getGrpFeaturesFileName(), getGrpFeaturesLocalPath() );
        let currentTileId = getSelectedTileId();
        
        if((fetchedFeatures == null) || ( fetchedFeatures == "notExist")) { 
            //zoomSlideOut();
            viewerZoomHome();

            // backup plan in case it txt_allTilesFeatures failed to be created by json.strinify()
            triggerHint("Wait while creating mean, max, std features file","info", 5000);

            d3.selectAll(getClassType()).each(function(d) {
                let bbox = find_bbox(this);
                let curTileFeatures = getTileProp( bbox['left'], bbox['top'], bbox['width'], bbox['height']);
               

                if( isSuperPixel() ){
                  // need to have function to convert to DSA format
                   allTilesFeatures.push({id:this.id , coordinates: this.attributes.points, features: curTileFeatures})
               //  allTilesFeatures.push({id:this.id , Frames: numOfFrames, features:curTileFeatures})
                } else {

                // if($$("BoundarySelection").getValue()=="GridShow")
                  allTilesFeatures.push({id: this.id, coordinates: bbox, features: curTileFeatures})
                    // allTilesFeatures.push({id:this.id, gridSize:$$("tileSize").getValue(), Frames: numOfFrames, features:curTileFeatures})
                }
                

               if(this.id != currentTileId) {
                   d3.select(this).style('fill', 'white');
                   d3.select(this).style('fill-opacity', 0.8)
               }
            }) // end of loop

            // showHint("",false)
            alert("Scan is completed");
            let errorFlag = false;   

            try{
                txt_allTilesFeatures = JSON.stringify(allTilesFeatures);
                let maxFileSize = 500000;  // to send it to flask and avoid javascript syntaxerror "the url is malformed "

                if(txt_allTilesFeatures.length > maxFileSize)
                {
                    let fileChunks=splitString(txt_allTilesFeatures, maxFileSize);  // true means newline included

                    for(let k = 0; k < fileChunks.length; k++) {
                        console.log("Save file part " + (k + 1) + "/" + fileChunks.length);
                         
                        if(k == 0) {
                            saveFeatures( getGrpFeaturesFileName(), getGrpFeaturesLocalPath(), fileChunks[k],"a",-1); // First chunk                   
                          }

                        if( ((k + 1) < fileChunks.length) && (k > 0) ) {
                            saveFeatures( getGrpFeaturesFileName(), getGrpFeaturesLocalPath(), fileChunks[k],"a");
                          
                          }

                        if( (k + 1) == fileChunks.length ) { 
                            saveFeatures( getGrpFeaturesFileName(), getGrpFeaturesLocalPath(), fileChunks[k],"a", 1);  // Set lastChunkFlag to 1, this is last chunk
                          }

                    }
                 } else {
                   //    saveFeatures(StorageItemName,txt_allTilesFeatures)
                       saveFeatures( getGrpFeaturesFileName(), getGrpFeaturesLocalPath(), txt_allTilesFeatures);
                       triggerHint("Saving Features locally in progress... ");  
                 }

            } catch(err) {
                errorFlag = true;
                triggerHint("JSON.stringify can not convert big features file to string","error");
            }

            if(!errorFlag) {  
               triggerHint("Successfully saved ", "info", 5000); 
            } else { 
               triggerHint("Some or all features could not be saved ", "error", 10000); 
            }
            
            freezeInput("createLoadFeaturesBtn", true);  

        } else { // end of if(fetchedFeatures==null)
              // if features exists locally 
              allTilesFeatures = JSON.parse(fetchedFeatures);

              if(allTilesFeatures.length) {
                  webix.message(" local saved features loaded.. ");
                  triggerHint(" local saved features loaded.. ", "info");
                  freezeInput("createLoadFeaturesBtn", true);  // disable create button
                //  $$("featuresCheckBoxes").enable();                               <<<<<<<<<<<<<<<<<----------------------------
                 // $$("similarityOptions").enable();                                   
               //  disableSimilarTilesBtn(false);
                  freezeFeaturesControls(false);
              } 
        }   

} // end of function

// getSelectedTileObj = () => {
//     return currentTileObj;
// } 

// setSelectedTileObj = (obj) => {
//      currentTileObj = obj;
// } 
// getSelectedTileId = () => {
//     return currentTileId;
// } 

// setSelectedTile = (id) => {
//      currentTileId = id;
// } 



  // Tile is a grid or SPX cell
  isTileSelected = () => {
      return currentGrpFeaturesSelectionStates.tile != null ? true : false;
  } 
  getSelectedTile = () => {
      return isTileSelected() ? currentGrpFeaturesSelectionStates.tile : null;
  } 

  getSelectedTileId = () => {
      return isTileSelected() ? currentGrpFeaturesSelectionStates.tile.id : null;
  } 

  setSelectedTile = (tileObj) => {
      currentGrpFeaturesSelectionStates.tile = tileObj;
  }  

  resetSelectedTile = () => {
      currentGrpFeaturesSelectionStates.tile = null;
  }  


  getLastSelectedTileId = () => {
      return lastGrpFeaturesSelectionStates.tileId;  
  } 

  setLastSelectedTileId = (tileId) => {
      lastGrpFeaturesSelectionStates.tileId = tileId;  
  } 

  resetLastSelectedTileId = () => {
      lastGrpFeaturesSelectionStates.tileId = null;  
  }  

  getRightClickedTile= () => {
      return currentGrpFeaturesSelectionStates.rightClickedTile;  
  } 

  setRightClickedTile = (tile) => {
      currentGrpFeaturesSelectionStates.rightClickedTile = tile;  
  } 

  resetRightClickedTile = () => {
      currentGrpFeaturesSelectionStates.rightClickedTile = null;  
  } 

   resetTileValues = () => {
        resetSelectedTile();
        resetLastSelectedTileId();
        resetRightClickedTile();
   }

})();    