/*!
=========================================================
* HistoJS Demo - v1.0.0
=========================================================

* Github:  https://github.com/Mmasoud1
* Description:  A user interface for whole slide image channel design and analysis. 
*               It is based on DSA as backbone server.
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

////////////////Futur USE///////////////
    isDAPIChannelSelected = () => {
        return lastItemSelectionStates.DAPIChannelIndex != null ? true : false;
    }    

    setSelectedDAPIChannelIndex = (DAPIChannelIndex) => {
        lastItemSelectionStates.DAPIChannelIndex = DAPIChannelIndex;
    }

    getSelectedDAPIChannelIndex = () => {
        return lastItemSelectionStates.DAPIChannelIndex;
    }     

    getSelectedDAPIChannelName = () => {
        return isDAPIChannelSelected() ? getDAPIChannelObj()[0].channel_name :  null;
    }    

    resetSelectedDAPIChannelIndex = () => {
        lastItemSelectionStates.DAPIChannelIndex = null ;
    } 

    // return e.g. { channel_name: "DNA 1", channel_number: 0, cycle_number: 0, … }
    getChannelObjByIndex = (index) => {
        return getSelectedItem().meta.omeSceneDescription.length ? getSelectedItem().meta.omeSceneDescription.filter(obj => { 
                                                                                         return obj.channel_number == index;
                                                                                          }) : null;
    }

    getChannelObjByName = (channelName) => {
        return getSelectedItem().meta.omeSceneDescription.length ? getSelectedItem().meta.omeSceneDescription.filter(obj => { 
                                                                                         return obj.channel_name == channelName;
                                                                                          }) : null;
    }    

    getDAPIChannelObj = () => {
        return isDAPIChannelSelected() ? getSelectedItem().meta.omeSceneDescription.filter(obj => { 
                                                                                         return obj.channel_number == getSelectedDAPIChannelIndex();
                                                                                          }) : null;
    }
  
//////////////////////////////
    getSelectedGroup = () => {
        return isGrpSelected() ? currentItemInfo.omeDataset.Groups[ getSelectedGrpIndex() ] : null;
    }

    getCurGrpNumOfChannels = () => {
        return isGrpSelected() ? getSelectedGroup().Channels.length : null;
    }


    // return e.g. Array(5) [ "DAPI", "KERATIN", "ASMA", "CD45", "IBA1" ]
    getCurGrpChannelsName = () => {
        return isGrpSelected() ? getSelectedGroup().Channels : null;
    }    

    getSelectedGroupName = () => {
        return isGrpSelected() ? getSelectedGroup().Name : null;
    }  

    updateInputTooltip = (tooltipId, getFunCallback) => {
    	return document.getElementById(tooltipId).innerHTML = getFunCallback();
    }

    updateInputTooltip_V2 = (getFunCallback, tooltipId) => {
      console.log(" arguments ", arguments)
      return document.getElementById(tooltipId).innerHTML = getFunCallback(arguments[2]);
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

   // e.g. "Structural Components__markers_morphology.csv"
   getGrpMarkersMorphFileName = () => { // get the proposed name of the featurs file 
           return isGrpSelected() ?  ( isSuperPixel() ? getSelectedGroupName()  + "_markers_morphology.csv" : 
                                                        getSelectedGroupName()  + "_Grid_"+ getGridSize() + "_markers_morphology.csv"
                                     ) : null;                  
   }   

   // e.g. "Structural Components__Boxplot_Data.json"
   // Can be used to compare group channels with existing json file to validate the info
   getGrpBoxplotFileName = () => { // get the proposed name of the boxplot file 
           return isGrpSelected() ?   getSelectedGroupName()  + "_Boxplot_Data.json" : null;                  
   }   

   // e.g. "Incomplete_Structural Components_Grid_64_Feat.json"  Used to save features temp to 'Resume' in case of unexpected interruption 
   getGrpFeaturesTemporaryFileName = () => { // get the proposed name of the featurs file 
           return isGrpSelected() ?  ( isSuperPixel() ? "Incomplete_" + getSelectedGroupName()  + "_Spx_Feat.json" : 
                                                        "Incomplete_" + getSelectedGroupName()  + "_Grid_"+ getGridSize() + "_Feat.json"
                                     ) : null;                  
   }

   // e.g "features/TONSIL-1_40X/", for singlePlex slides
   // e.g "features/LUNG-3-PR_40X/"
   getItemFeaturesLocalPath = () => {
       return isGrpSelected() ? ( Opts.dockerMountingDir  + 
                                  Opts.defaultFeaturesDir + "/" +
                                  getItemName().split(".")[0] + "/") : null;  
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

   // e.g "features/TONSIL-1_40X/Structural Components/", for multiPlex slides
   getGrpBoxplotLocalPath = () => {
       return isGrpSelected() ? ( Opts.dockerMountingDir  + 
                                  Opts.defaultFeaturesDir + "/" +
                                  getItemName().split(".")[0] + "/" +
                                  getSelectedGroupName() + "/" ) : null;  
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

   // For Dapi cells/boundaries morphological statistical data e.g. "LUNG-3-PR_40X_Morph_Stat.json"
   getDapiMorphStatFileName = () => {
        return getItemName().split(".")[0]  + "_Morph_Stat.json"
   }

   

   // e.g. "boundaries/TONSIL-1_40X/"
   getCsvChannelMetaDataLocalPath = () => {
       return getItemName() ? ( Opts.dockerMountingDir  + 
                                  Opts.defaultBoundariesDir + "/" +
                                  getItemName().split(".")[0] + "/"
                                ) : null;  
   }   

   //  e.g "TONSIL-1_40X_cellMask.json"
   getItemBoundariesFileName = () => {
        return  getItemName().split(".")[0]  + "_cellMask.json"
   } 

   //  e.g "TONSIL-1_40X_channel_metadata.csv"
   getCsvChannelMetaDataFileName = () => {
        return  getItemName().split(".")[0]  + "_channel_metadata.csv"
   }    

   // This is for a generic mask   e.g "TONSIL-1_40X_cellMask.tiff"
   getItemCellMaskImageName = () => {
        return  getItemName().split(".")[0]  + "_cellMask.tif"
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

            if( isGrpSelected() ) {  // item is loaded with OSD 
                // var item = currentHostCollectSelectionStates.item;
                   
                if( isDAPIChannelSelected() ) {
                    // if( (item.name.includes(".ome.tif") ) && (item.meta.omeSceneDescription != null)) {
                        // var itemName = item.name.split(".")[0];
                        initGrpChannelOptionsList();   
                        initGrpFeaturesList();
                        initChartOperationsList();
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
                      triggerHint("Specify DAPI or DNA channel by clicking on channel list","info", 7000);
                      openDAPIForm();
                      return 0;

                } 
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

  toggleChannelOpacity = (elem) => {
     let index = elem.id.split('.')[1];

     if(elem.checked) {
       viewer.world.getItemAt(index).setOpacity(1);       
     }
     else {
       viewer.world.getItemAt(index).setOpacity(0);   
     }
  }

	onChOpacitySliderMouseover = (elem) => {

	}

  onCellFilterSliderMouseover = (elem) => {
    // console.log(" tooltipElem ", tooltipElem)
    let channelOrFeatureName = elem.id.split('.')[1];
    // console.log(" elem.id ", elem.id)
    // updateInputTooltip_V2(getCellFilterSliderValue, `cellFilterValueTooltip.${channelName}`,  elem.id);
    document.getElementById(`cellFilterValueTooltip.${channelOrFeatureName}`).innerHTML = getCellFilterSliderValue(elem.id);

  }

  getCellFilterSliderValue = (elemId) => {
    // console.log("elemId", elemId);
    //id="cellFilterSlider.${idx}"
     return document.getElementById(elemId).value;
  }

	channelOpacityChanged = (elem) => {

	}

 resetCellFilterDependencies = () => {
    allValideTiles = [];
    allValidePhenotypes = [];
    // let tileClass = getClassType();

 }

   getNavigatorValue = () => {
      return cellFiltersAndPhenotypesStates.navigatorPointer;
   }

   resetNavigatorValue = () => {
     cellFiltersAndPhenotypesStates.navigatorPointer = 0;
   }  

   setNavigatorValue = (val) => {
     cellFiltersAndPhenotypesStates.navigatorPointer = val;
   } 
 
  goToStartFilteredCell = (index = -1) => {
      let valideArray = null;

      if (index == -1) {
          valideArray = allValideTiles;
      } else {
          valideArray = allValidePhenotypes[index].valideCells
      }

      if( getNavigatorValue() ) {
          resetNavigatorValue();
          zoomToTile(document.getElementById(valideArray[getNavigatorValue()].id));
          document.getElementById("currentCell").innerHTML = (getNavigatorValue() + 1) + "/" + valideArray.length
      } else {
          triggerHint("Click forward button to navigate .. ", "info", 5000);
      }
  }

  prevFilteredCell = (index = -1) => {
      let valideArray = null;

      if (index == -1) {
          valideArray = allValideTiles;
      } else {
          valideArray = allValidePhenotypes[index].valideCells
      }   

      // if( getNavigatorValue() > 0 ) {
      //     setNavigatorValue(getNavigatorValue() - 1);
      //     zoomToTile(document.getElementById(valideArray[getNavigatorValue()].id));
      //     document.getElementById("currentCell").innerHTML = (getNavigatorValue() + 1) + "/" + valideArray.length     
      if( getNavigatorValue() > 0 ) {
          setNavigatorValue(getNavigatorValue() - 1);
          if( getNavigatorValue() ) {
             zoomToTile(document.getElementById(valideArray[getNavigatorValue()-1].id));
             document.getElementById("currentCell").innerHTML = (getNavigatorValue()) + "/" + valideArray.length  
          }
      } else {
          triggerHint("Click forward button to navigate .. ", "info", 5000);
      }
  }

  nextFilteredCell = (index = -1) => {
      let valideArray = null;

      if (index == -1) {
          valideArray = allValideTiles;
      } else {
          valideArray = allValidePhenotypes[index].valideCells
      }  

      // if( getNavigatorValue() < valideArray.length -1 ) {
      //     setNavigatorValue(getNavigatorValue() + 1);
      //     zoomToTile(document.getElementById(valideArray[getNavigatorValue()].id));
      //     document.getElementById("currentCell").innerHTML = (getNavigatorValue() + 1) + "/" + valideArray.length   
      if( getNavigatorValue() < valideArray.length ) {
          setNavigatorValue(getNavigatorValue() + 1);
          zoomToTile(document.getElementById(valideArray[getNavigatorValue()-1].id));
          document.getElementById("currentCell").innerHTML = (getNavigatorValue() ) + "/" + valideArray.length                    
      } else {
          triggerHint("Click backward button to navigate .. ", "info", 5000);
      }
  }

 isFilteredCellFound = () => {
    return allValideTiles.length ? true : false;
 } 

 // togglecellNavigator = () => {
 //              if(allValideTiles.length) {
 //                  showPanel("cellNavigator", true);    
 //              } else {
 //                  showPanel("cellNavigator", false); 
 //              }
 // }

 filterTiles = (callback) => {
          let tileClass = getClassType();
          allValideTiles = [];
          let numOfFrames = getSelectedGroup().Channels.length;  
          // For morphological features e.g. cell area, solidity..
          let morphFeatureNamesArr  = Object.keys(dapiMorphStatisticalData);          

          if( !isFeaturesLoaded() ) { // At least one feature should be selected from Features menu (.e.g mean, max, std)
              triggerHint(" Create/Load Features first from Features menu .. ");
              return 0;
          }

          // if (! isGrpChannelsStatisticalDataAvailable() ) {          
          //     return 0;
          // }  

          if( ! isSimilarRegionBtnEnabled() ) {  // <<<<<<<<<<<<<<<< --------- no need to "if" condition, findSimilarTiles by default can't be called if no tile selected

              // for(let k = 0; k < allTilesFeatures.length; k++) {
              //       let featuresDistance = computeDistance( currentTileData.features, allTilesFeatures[k].features, numOfFrames);
              //       allFeaturesDistance.push({id: allTilesFeatures[k].id, Distance: featuresDistance});
              // }
              
              if( isCellFiltersActive() ) { // check if there is at least channel filter slider with value > 0
                   // webix.message("Wait cell filter to apply");
                   // check right bar if empty 
                    if(! isViewBarEmpty("grpFeaturesViewBar") ) {
                         clearViewBar("grpFeaturesViewBar");
                    }                    

                    allTilesFeatures.forEach(tile => {
                          //let featuresDistance = computeDistance( currentTileData.features, tile.features, numOfFrames);
                          let valide = true;

                          // For morphological features e.g. cell area, solidity..
                          morphFeatureNamesArr.forEach( (morphFeatName, idx) => {
                              //if to check whether morphological value > zero 
                              if(parseFloat(document.getElementById("cellFilterSlider." + morphFeatName).value) > 0) {
                                    if(tile[morphFeatName]  < parseFloat(document.getElementById("cellFilterSlider." + morphFeatName).value) ) {
                                        valide = false;
                                      }
                              }    
                          }) 


                          for(let k = 0; k < numOfFrames; k++){
                              let currentFrameBoxplotData = findObjectByKeyValue(grpChannelsStatisticalData, 'Frame', tile.features[k].Frame);
                              if( isCellPositiveSwitchEnabled(tile.features[k].Frame) ) {

                                  let positiveThreshold = 0;

                                  // if (Opts.markerPositiveThreshold!== "0") {
                                  //    positiveThreshold = currentFrameBoxplotData[Opts.markerPositiveThreshold]; // e.g. currentFrameBoxplotData['q1']
                                  // }                                   

                                  if (getMarkerPositiveThresholdValue(tile.features[k].Frame)!== "0") {
                                     // positiveThreshold = currentFrameBoxplotData[Opts.markerPositiveThreshold]; // e.g. currentFrameBoxplotData['q1']
                                      positiveThreshold = currentFrameBoxplotData[getMarkerPositiveThresholdValue(tile.features[k].Frame)]                                     
                                  } 

                               

                                  if(positiveThreshold == 0){  
                                       // consider all cells greater than zero.                        
                                      if(tile.features[k].max <= positiveThreshold) {
                                          valide = false;
                                      }
                                  } else {
                                       // consider all cells greater than or equal positve threshold.                                      
                                      if(tile.features[k].max < positiveThreshold) {
                                          valide = false;
                                      }                                
                                  }  

                              } else if( isCellNegativeSwitchEnabled(tile.features[k].Frame) ) {
                                  let negativeThreshold = 0;

                                  // if (Opts.markerNegativeThreshold!== "0") {
                                  //     negativeThreshold = currentFrameBoxplotData[Opts.markerNegativeThreshold]; 
                                  // }                                   

                                  if (getMarkerNegativeThresholdValue(tile.features[k].Frame)!== "0") {
                                     negativeThreshold = currentFrameBoxplotData[getMarkerNegativeThresholdValue(tile.features[k].Frame)] 
                                  }
                                  

                                  if(negativeThreshold == 0){  
                                       // consider all cells equal to zero threshold at most.                        
                                      if(tile.features[k].max > negativeThreshold) {
                                          valide = false;
                                      }
                                  } else {
                                       // consider all cells less than threshold.                                      
                                      if(tile.features[k].max >= negativeThreshold) {
                                          valide = false;
                                      }                                
                                  }  
                              } else {
                                  if(tile.features[k].max < document.getElementById("cellFilterSlider." + tile.features[k].Frame).value) {
                                      valide = false;
                                  }
                              }

                          }

                          if(valide) {
                               //allValideTiles.push({id: tile.id, features: tile.features});      // <<<<<<<<<<< can be option 
                               allValideTiles.push({id: tile.id});
                          }
                    })              
                  
                    setBoundaryFillOpacity(1);

                    d3.selectAll(tileClass).style('fill', 'white');
                    d3.selectAll(tileClass).style('stroke', 'none');  
                    d3.selectAll(tileClass).style('fill-opacity', getBoundaryFillOpacity()); 

                    for(let i = 0; i < allValideTiles.length; i++) {
                           d3.select("#"+allValideTiles[i].id).style('fill', 'red');
                           // d3.select("#"+allValideTiles[i].id).attr('class', 'validTileClass'); 
                           d3.select("#"+allValideTiles[i].id).style('fill-opacity', getBoundaryFillOpacity());
                          // d3.select("#"+allValideTiles[i].id).transition().duration(1000).style("fill-opacity", 0);
                           d3.select("#"+allValideTiles[i].id).style('stroke', 'black');
                           d3.select("#"+allValideTiles[i].id).style('stroke-width', getStrokeWidth());
                           d3.select("#"+allValideTiles[i].id).style('stroke-opacity', 1);

                          // function animateTile() {
                          //     d3.select("#"+allValideTiles[i].id).transition().duration(1000).style("fill-opacity", 0)
                          //       .each("end", function() {
                          //         d3.select(this).transition().duration(1000).style("fill-opacity", 1)
                          //           .each("end", function() { animateTile(); });
                          //       });
                          // }
                           
                    }




 /*             d3.selectAll(".validTileClass").transition()            // <<<<<<<<<<<<<<<<<<<<<
                  //.delay(function(d, i) { return i * 50; })
                  .duration(1000)
                  .on("start", function repeat() {
                      d3.active(this)
                          .style("fill", "red")
                        .transition()
                          .style("fill", "orange")
                        .transition()
                        //   .style("fill", "blue")
                        // .transition()
                          .on("start", repeat);
                    });              
*/
              } else {
                    setBoundaryFillOpacity(Opts.defaultBoundaryFillOpacity);
                    d3.selectAll(tileClass).style('fill',  Opts.defaultBoundaryFillColor);
                    d3.selectAll(tileClass).style('stroke', Opts.defaultStrokeColor);  
                    d3.selectAll(tileClass).style('fill-opacity', getBoundaryFillOpacity());                    
              }    

              if(allValideTiles.length) {
                  initCellNavigator();
                  document.getElementById("cellTitle").innerHTML = "Cells:";                    
                  document.getElementById("currentCell").innerHTML =  "-/" + allValideTiles.length   
                  showPanel("cellNavigator", true);                   
              } else {
                  showPanel("cellNavigator", false); 
              }

          }

       callback();
    }

//  Generate all binary strings of n bits e.g. Array(8) [ "000", "001", "010", "011", "100", "101", "110", "111" ]
 getBinaryStringsOfNbits = (n) => {
        let binaryStrings = [];
        // get max number of possible strings
        let maxNumOfPossibleStrings = parseInt("1".repeat(n),2);

        for(let i = 0; i <= maxNumOfPossibleStrings; i++){
          binaryStrings.push(i.toString(2).padStart(n,'0'));
        }

        return binaryStrings;
}

 isCellPhenotypeActive = () => {
    return allValidePhenotypes.length ? true : false;
 } 

cellPhenotypes = (callback) => {
          let tileClass = getClassType();
          allValidePhenotypes = [];
          let numOfFrames = getSelectedGroup().Channels.length;  
          
          if(! isViewBarEmpty("grpFeaturesViewBar") ) {
               clearViewBar("grpFeaturesViewBar");
          }

          if( isCellFiltersActive() ) {
               resetAllCellFilters();
          }  
          ///////////////////////////////////////////
          let allBinaryMarkersString = getBinaryStringsOfNbits(numOfFrames);
          allBinaryMarkersString.forEach(binaryMarkersString => { // e.g. "01001" equivalent to CD45- IBA1+ Keratin- ASMA- DNA+
                let allValideCells = [];
                allTilesFeatures.forEach(tile => {
                      let valide = true;

                      for (let k = 0; k < binaryMarkersString.length; k++) { //e.g. "01001"
                          markerState = parseInt(binaryMarkersString.charAt(k)); // markerState is either 1 or 0

                          let currentFrameBoxplotData = findObjectByKeyValue(grpChannelsStatisticalData, 'Frame', tile.features[k].Frame);

                          if( markerState ) { // markerState is Postive  e.g. CD45 positive button is ON
                              let positiveThreshold = 0;

                              if (Opts.markerPositiveThreshold!== "0") {
                                 positiveThreshold = currentFrameBoxplotData[Opts.markerPositiveThreshold]; // e.g. currentFrameBoxplotData['q1']
                              } 


                              // if (getMarkerPositiveThresholdValue(tile.features[k].Frame)!== "0") {
                              //     positiveThreshold = currentFrameBoxplotData[getMarkerPositiveThresholdValue(tile.features[k].Frame)]                                     
                              // } 


                              if(positiveThreshold == 0){  
                                   // consider all cells greater than zero.                        
                                  if(tile.features[k].max <= positiveThreshold) {
                                      valide = false;
                                  }
                              } else {
                                   // consider all cells greater than or equal positve threshold.                                      
                                  if(tile.features[k].max < positiveThreshold) {
                                      valide = false;
                                  }                                
                              }  

                          } else { //markerState is Negative  e.g. CD45 negative button is ON, Negative can be q1 or min or 0 

                              let negativeThreshold = 0;

                              if (Opts.markerNegativeThreshold!== "0") {
                                  negativeThreshold = currentFrameBoxplotData[Opts.markerNegativeThreshold]; 
                              } 


                              // if (getMarkerNegativeThresholdValue(tile.features[k].Frame)!== "0") {
                              //    negativeThreshold = currentFrameBoxplotData[getMarkerNegativeThresholdValue(tile.features[k].Frame)] 
                              // }   


                              if(negativeThreshold == 0){  
                                   // consider all cells equal to zero threshold at most.                        
                                  if(tile.features[k].max > negativeThreshold) {
                                      valide = false;
                                  }
                              } else {
                                   // consider all cells less than threshold.                                      
                                  if(tile.features[k].max >= negativeThreshold) {
                                      valide = false;
                                  }                                
                              }  
                          } 
                      }

                      if(valide) {
                           //allValideTiles.push({id: tile.id, features: tile.features});      // <<<<<<<<<<< can be option 
                           allValideCells.push({id: tile.id});
                      }
                })

               if(allValideCells.length) { // Only consider valide phenotypes with a number of cells >  0 
                   allValidePhenotypes.push({binary: binaryMarkersString, valideCells: allValideCells, totalValideCellsNum: allValideCells.length, phenotypeColor: null });
               }

         }) 
         // Assign Color for each found cell phenotype 
         if(allValidePhenotypes.length) {
            // Turn all channels Opacity to zero for best visualization of cell phenotypes
            resetAllChannelsOpacity();
            let allPhenotypeColors = createCellPhenotypesColorsArray(allValidePhenotypes.length);
            // for(let i = 0; i < allValidePhenotypes.length; i++) {
            //       allValidePhenotypes[i]['phenotypeColor'] = allPhenotypeColors[i];
            // }

            allPhenotypeColors.forEach((clr, idx) => {
                 allValidePhenotypes[idx]['phenotypeColor'] = clr;
                 // let showPhenotypeBinaryAsSigns = allValidePhenotypes[idx].binary.replaceAll("1", "+").replaceAll("0", " - ");
                 let showPhenotypeBinary = allValidePhenotypes[idx].binary
                 document.getElementById("grpFeaturesViewBar").innerHTML += '<a href="javascript:void(0)" ><span id="phenotypeColorSpanId.' + idx+'" style="background-color:'+clr+';   padding-left:0.5vw;" onclick = "phenotypeNavigation('+idx+')">&nbsp</span>&nbsp<i id="phenotypeEyeIcon.'+idx+'" class="fa fa-eye" aria-hidden="true" onclick="onPhenotypeShowHide('+ idx +')" style="font-size:0.6vw">'+'<font style = "font-family: Impact, Charcoal, sans-serif;" >&nbsp&nbsp'+ showPhenotypeBinary + '</font></i></a>';
            })            

            setBoundaryFillOpacity(1);

            d3.selectAll(tileClass).style('fill', 'none');
            d3.selectAll(tileClass).style('stroke', 'none');  
            d3.selectAll(tileClass).style('fill-opacity', getBoundaryFillOpacity()); 

            // for(let i = 0; i < allValidePhenotypes.length; i++) {
            //     for(let j = 0; j < allValidePhenotypes[i].valideCells.length; j++) {
            allValidePhenotypes.forEach((cellPhenotype, idx) => {  
                cellPhenotype.valideCells.forEach((cell, idx) => {  
                       d3.select("#"+cell.id).style('fill', cellPhenotype.phenotypeColor);
                       // d3.select("#"+allValideTiles[i].id).attr('class', 'validTileClass'); 
                       d3.select("#"+cell.id).style('fill-opacity', getBoundaryFillOpacity());
                      // d3.select("#"+allValideTiles[i].id).transition().duration(1000).style("fill-opacity", 0);
                       d3.select("#"+cell.id).style('stroke', 'black');
                       d3.select("#"+cell.id).style('stroke-width', getStrokeWidth());
                       d3.select("#"+cell.id).style('stroke-opacity', 1);
                })
            })



         } else {
            triggerHint("No cell phenotypes found ...");
         }

     callback();    

 }    


  phenotypeNavigation = (phenotypeIndex) => {
      let clr =  allValidePhenotypes[phenotypeIndex]['phenotypeColor'];

      initCellNavigator(phenotypeIndex);

      document.getElementById("cellTitle").innerHTML =  '<span  style="background-color:'+clr+'; padding-left:0.5vw;">&nbsp</span>'+" Cells:";  
      document.getElementById("currentCell").innerHTML =  "-/" + allValidePhenotypes[phenotypeIndex].valideCells.length; 
      showPanel("cellNavigator", true); 
  }

  initCellNavigator = (index = -1) => {
      let nodes =  ""; 
      nodes += '<div class="navigator-item"><p class="just" style="font-weight: bold;" id="cellTitle">Cells:</p></div>';
      nodes += '<div class="navigator-item">';
      nodes +=    '<a href="javascript:void(0)" onclick="goToStartFilteredCell('+index+')">';
      nodes +=       '<i style="font-size:1vw; padding-top:1.2vh"  class="fa fa-fast-backward"></i>' ;
      nodes +=    '</a>';      
      nodes += '</div>';
      nodes += '<div class="navigator-item">';
      nodes +=    '<a href="javascript:void(0)" onclick="prevFilteredCell('+index+')">';
      nodes +=       '<i style="font-size:1vw; padding-top:1.2vh"  class="fa fa-step-backward"></i>';
      nodes +=    '</a>';     
      nodes += '</div>';   
      nodes += '<div class="navigator-item">';
      nodes +=    '<a href="javascript:void(0)" onclick="nextFilteredCell('+index+')">';
      nodes +=       '<i style="font-size:1vw; padding-top:1.2vh"  class="fa fa-step-forward"></i>';
      nodes +=    '</a>';            
      nodes += '</div>';  
      nodes += '<div class="navigator-item">';
      nodes +=    '<p class="just" style="font-weight: bold;" id="currentCell">-/-</p>';
      nodes += '</div>';        

      document.getElementById("cellNavigator").innerHTML = nodes;

  }

   onPhenotypeShowHide = (phenotypeIndex) => {
    
          if (document.getElementById("phenotypeEyeIcon." + phenotypeIndex).className === "fa fa-eye") {
                document.getElementById("phenotypeEyeIcon." + phenotypeIndex).className = "fa fa-eye-slash";

                allValidePhenotypes[phenotypeIndex].valideCells.forEach(cell => {  
                       d3.select("#"+cell.id).style('fill', "black");
                })
          } else {
                 document.getElementById("phenotypeEyeIcon." + phenotypeIndex).className = "fa fa-eye";

                 allValidePhenotypes[phenotypeIndex].valideCells.forEach(cell => {  
                       d3.select("#"+cell.id).style('fill', allValidePhenotypes[phenotypeIndex].phenotypeColor);
                })                 
          }
  }

// future use
 resetCellPhenotypeDependencies = () => {
      if(! isViewBarEmpty("grpFeaturesViewBar") ) {
           clearViewBar("grpFeaturesViewBar");
      }

      allValidePhenotypes = [];
      setAllChannelsOpacity(); 
 }

 isViewBarEmpty = (viewBarId) => {
    return document.getElementById(viewBarId).innerHTML === "" ? true : false;
 }
  
  clearViewBar = (viewBarId) => {
        if(!(isViewBarEmpty(viewBarId))){
             var node = document.getElementById(viewBarId + "Btn");
             document.getElementById(viewBarId).innerHTML = ""
             document.getElementById(viewBarId).append(node)
             // showPanel("chColorContrastPanel", false) 
        }
  }

createCellPhenotypesColorsArray = (numOfValidePhenotypes) => {
    let colorStep=Math.floor(360/numOfValidePhenotypes); // 360 is HSL max hue
    let saturation=100;
    let lightness=50;
    let initHue=0;
    let phenotypesColorsArray = [];
    for(let n = 0; n < numOfValidePhenotypes; n++){
        let phenotypeColorRgb = HSLToRGB(n * colorStep, saturation, lightness);
        phenotypesColorsArray.push('#'+ RGBtoHEX(phenotypeColorRgb));
    }

    return phenotypesColorsArray;
}

  // Turn Off all channels
  resetAllChannelsOpacity = () => {
     const curGroup = getSelectedGroup();
     curGroup.Channels.forEach((channelName,idx) => {
        viewer.world.getItemAt(idx).setOpacity(0);
     }) 
  }

  setAllChannelsOpacity = () => {
     const curGroup = getSelectedGroup();
     curGroup.Channels.forEach((channelName,idx) => {
        viewer.world.getItemAt(idx).setOpacity(1);
     }) 
  }  

  freezeAllCellFilters = (freezeFlag = true) => {
     resetAllCellFilters();
     const curGroup = getSelectedGroup();
     curGroup.Channels.forEach(channelName => {
        document.getElementById("cellFilterSlider." + channelName).disabled = freezeFlag;
        document.getElementById("cellPositiveSwitch." + channelName).disabled = freezeFlag;
        document.getElementById("cellNegativeSwitch." + channelName).disabled = freezeFlag;       
     })

  }


  resetAllCellFilters = () => {
     const curGroup = getSelectedGroup();
     curGroup.Channels.forEach(channelName => {
        document.getElementById("cellFilterSlider." + channelName).value = 0;
        document.getElementById("cellPositiveSwitch." + channelName).checked = false;
        document.getElementById("cellNegativeSwitch." + channelName).checked = false;
     }) 

     // For morphological features e.g. cell area, solidity..
    let morphFeatureNamesArr  = Object.keys(dapiMorphStatisticalData)
    morphFeatureNamesArr.forEach( (morphFeatureName, idx) => {
          if(document.getElementById("cellFilterSlider." + morphFeatureName)) {
               document.getElementById("cellFilterSlider." + morphFeatureName).value = 0;
          }
    }) 


     setBoundaryFillOpacity(Opts.defaultBoundaryFillOpacity);
     resetCellFilterDependencies();
     if( isPanelActive("cellNavigator") ) {
        showPanel("cellNavigator", false); 
     }

  }

  isCellFiltersActive = () => {
     const curGroup = getSelectedGroup();
     let isActive = false;
     curGroup.Channels.forEach(channelName => {
        if(parseInt(document.getElementById("cellFilterSlider." + channelName).value) ||
           isCellPositiveSwitchEnabled(channelName) || isCellNegativeSwitchEnabled(channelName) ) {
            isActive = true;
          }
     }) 

    // For morphological features e.g. cell area, solidity..
    let morphFeatureNamesArr  = Object.keys(dapiMorphStatisticalData);
    morphFeatureNamesArr.forEach( (morphFeatureName, idx) => {
          if(parseFloat(document.getElementById("cellFilterSlider." + morphFeatureName).value) ) {
              isActive = true;
          }
    })     

     return isActive? true : false;
  }  

  cellFilterSliderChanged = (elem) => {
     let channelName = elem.id.split('.')[1];
     showLoadingIcon(() => {  

         // Update tooltip value 
         document.getElementById(`cellFilterValueTooltip.${channelName}`).innerHTML = getCellFilterSliderValue(elem.id);

         if(parseInt(document.getElementById("cellFilterSlider." + channelName).value)){
            freezeInput("cellPositiveSwitch." + channelName, true);
            freezeInput("cellNegativeSwitch." + channelName, true);
         } else {
            freezeInput("cellPositiveSwitch." + channelName, false);
            freezeInput("cellNegativeSwitch." + channelName, false);
         }

         if( isCellFiltersActive() ) { // check if there is at least channel filter slider with value > 0
             webix.message("Filtering in progress");
         }      

         filterTiles(() => {
             hideLoadingIcon(); 
         });

     });

  }

  cellMorphFilterSliderChanged = (elem) => {
     let morphFeatureName = elem.id.split('.')[1];
     showLoadingIcon(() => {  

         // Update tooltip value 
         document.getElementById(`cellFilterValueTooltip.${morphFeatureName}`).innerHTML = getCellFilterSliderValue(elem.id);

         // if(parseFloat(document.getElementById("cellFilterSlider." + featureName).value)){
         // } else {
         // }

         if( isCellFiltersActive() ) { // check if there is at least channel filter slider with value > 0
             webix.message("Filtering in progress");

          
         } 

         filterTiles(() => {
             hideLoadingIcon(); 
         });   

       });     
    
	}

   // check whether the cell postive ON/OFF button toggled to ON
   isCellPositiveSwitchEnabled = (channelName) => {
        return document.getElementById("cellPositiveSwitch." + channelName).checked ? true : false;
   }

   resetCellPositiveSwitch = (channelName) => {
      document.getElementById("cellPositiveSwitch." + channelName).checked = false;
   }

  toggleChannelCellPositive = (elem) => {
     let channelName = elem.id.split('.')[1];

     if(isLocalFileExist( getGrpBoxplotFileName(), getGrpBoxplotLocalPath() )) {
           showLoadingIcon(() => {  

                if (! isGrpChannelsStatisticalDataAvailable() ) {
                    setGrpChannelsStatisticalData( readJsonFile(getGrpBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 
                }  

               if( isCellPositiveSwitchEnabled(channelName) ) {
                 //  is switch ON
                 freezeInput("cellNegativeSwitch." + channelName, true);
                 freezeInput("cellFilterSlider." + channelName, true); 
                 freezeInput("markerPositiveThresholds." + channelName, true);
                 freezeInput("markerNegativeThresholds." + channelName, true);  
              
               } else {
                 //   switch is OFF
                 freezeInput("cellNegativeSwitch." + channelName, false);
                 freezeInput("cellFilterSlider." + channelName, false); 
                 freezeInput("markerPositiveThresholds." + channelName, false);
                 freezeInput("markerNegativeThresholds." + channelName, false);             
               }
               
               filterTiles(() => {
                   hideLoadingIcon(); 
               });

           });




    } else {

      resetCellPositiveSwitch(channelName);
      triggerHint("Marker positive filtering needs calculating markers boxplot data first, do you want to calculate them?  " + 
        '<a href="javascript:void(0)" onclick="calculateMarkerBoxplots(false)">[<b><font color="green">Yes</font></b>]</a>' + 
        '<a href="javascript:void(0)" onclick="closeHint()">[<b><font color="red">No</font></b>]</a>', "error", 10000);
    }          

  }

   // check whether the cell postive ON/OFF button toggled to ON
   isCellNegativeSwitchEnabled = (channelName) => {
        return document.getElementById("cellNegativeSwitch." + channelName).checked ? true : false;
   }

   resetCellNegativeSwitch = (channelName) => {
      document.getElementById("cellNegativeSwitch." + channelName).checked = false;
   }

  toggleChannelCellNegative = (elem) => {
     let channelName = elem.id.split('.')[1];

     if(isLocalFileExist( getGrpBoxplotFileName(), getGrpBoxplotLocalPath() )) {
           showLoadingIcon(() => {  

                if (! isGrpChannelsStatisticalDataAvailable() ) {
                    setGrpChannelsStatisticalData( readJsonFile(getGrpBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 
                }      

               if( isCellNegativeSwitchEnabled(channelName) ) {
                   //  is switch ON         
                 freezeInput("cellPositiveSwitch." + channelName, true);
                 freezeInput("cellFilterSlider." + channelName, true);
                 freezeInput("markerPositiveThresholds." + channelName, true);
                 freezeInput("markerNegativeThresholds." + channelName, true);       
                 // filterTiles();
               } else {
                //   switch is OFF  
                 freezeInput("cellPositiveSwitch." + channelName, false);
                 freezeInput("cellFilterSlider." + channelName, false);    
                 freezeInput("markerPositiveThresholds." + channelName, false);
                 freezeInput("markerNegativeThresholds." + channelName, false);  
               }
               
               filterTiles(() => {
                   hideLoadingIcon(); 
               });

           });



    } else {
      resetCellNegativeSwitch(channelName);
      triggerHint("Marker negative filtering needs calculating markers boxplot data first, do you want to calculate them?  " + 
        '<a href="javascript:void(0)" onclick="calculateMarkerBoxplots(false)">[<b><font color="green">Yes</font></b>]</a>' + 
        '<a href="javascript:void(0)" onclick="closeHint()">[<b><font color="red">No</font></b>]</a>', "error", 10000);
    }         

  }


   // freezeBoundaryControls = (freezeFlag = true) => {
   //        freezeBoundaryDependentControls(freezeFlag);
   //        freezeInput("toggleBoundaries", freezeFlag);
   // }

   // resetBoundarySwitch = () => {
   //      document.getElementById("boundarySwitch").checked = false;
   //      boundarySwitchClicked();
   // } 
   getMarkerPositiveThresholdValue = (channelName) => {
        return document.getElementById("markerPositiveThresholds." + channelName).value;
   }

   getMarkerNegativeThresholdValue = (channelName) => {
        return document.getElementById("markerNegativeThresholds." + channelName).value;
   } 

   getMarkerPositiveThresholdIndex= (channelName) => {
        return cellPositiveThresholdOptions.indexOf(document.getElementById("markerPositiveThresholds." + channelName).value);
   }

   getMarkerNegativeThresholdIndex= (channelName) => {
        return cellNegativeThresholdOptions.indexOf(document.getElementById("markerNegativeThresholds." + channelName).value);
   }

   setMarkerPositiveThresholdValue = (channelName, value) => {
        document.getElementById("markerPositiveThresholds." + channelName).value = value;
   } 

   setMarkerNegativeThresholdValue = (channelName, value) => {
        document.getElementById("markerNegativeThresholds." + channelName).value = value;
   } 

   onChangeMarkerPositiveThreshold = (elem) => {
       // let channelName = elem.id.split('.')[1];
       // let curPositiveThreshold = document.getElementById(elem.id).value;

       // if( getMarkerPositiveThresholdIndex(channelName) > getMarkerNegativeThresholdIndex(channelName) ) {

       // }

       // curPositiveThresholdIndex = cellPositiveThresholdOptions.indexOf(curPositiveThreshold)
   }

  onChangeMarkerNegativeThreshold = () => {

  }    

  requestCellPositiveInfo = () => {
     triggerHint("To visualize all cells with marker value above or equal selected threshold .. ");
  } 

  requestCellMorphologicalInfo = (elem) => { // e.g. area, solidity etc
     let morphfeatureName = elem.id.split('.')[1];
     let featureEntry = cellMorphFeatureList.filter( entry => entry.morphFeature === morphfeatureName);
     triggerHint(featureEntry[0].description, "info", 7000);    
  }     

  requestCellNegativeInfo = () => {
     triggerHint("To visualize all cells with marker value below or equal selected threshold .. ");
  } 

  requestCellFilterInfo = () => {
     triggerHint("To visualize all cells with marker value above slider value .. ");
  }     



 

	initGrpChannelOptionsList = () => { 
	    let nodes = "";
	    document.getElementById("channelOptionsList").innerHTML = ""; 
	    const curGroup = getSelectedGroup();
	    // document.getElementById("grpName").innerHTML = '<i style="font-size:1.4vw"  class="fa fa-sliders" ></i> &nbsp&nbsp' + "CHNL" + " OPTIONS";	    

	    curGroup.Channels.forEach( (channelName, idx) => {
  	      // let channelName = channel; 
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
          nodes +=       '<colgroup> <col style="width:45%"> <col style="width:40%"><col style="width:15%"> </colgroup>';

          // nodes +=       '<tr><th></th>'          
          // nodes +=         '<th ><label class="switch"><input type="checkbox" id="togBtn"><div class="slider round"><span class="on">ON</span><span class="off">OFF</span></div></label>';
          // // nodes +=           '<input type="checkbox" checked>';
          // // nodes +=           '<span class="slider round"></span>';
          // nodes +=         '</th>';
          // nodes +=       '</tr>'          

          nodes +=       '<tr>';         
          nodes +=         '<th style="text-align: left"><p> Opacity </p></th>'; 
          nodes +=         '<th style="padding-left:5%;"><label class="switch switch-left-right">';
          nodes +=           `<input class="switch-input" type="checkbox" id="opacitySwitch.${idx}" onclick="toggleChannelOpacity(this)" checked/>`;
          nodes +=           '<span class="switch-label" data-on="On" data-off="Off"></span> ';
          nodes +=           '<span class="switch-handle"></span>'; 
          nodes +=         '</label></th>';
          nodes +=         '<th></th>';          
          nodes +=       '</tr>';  

          // nodes +=       '<tr>';         
          // nodes +=         '<th style="text-align: center"><p> Cell+ Thre </p></th>'; 
          // nodes +=         '<th style="padding-left:15%;">';
          // nodes +=         '<select name="markerPositiveThresholds" style="width:30%;" id="markerPositiveThresholds."'+ idx +'onchange="onChangeMarkerPositiveThreshold()" disabled>';

          //                   cellThresholdOptions.forEach((threshold, idx) => {

          //                       if(threshold === Opts.markerPositiveThreshold) {
          //                           nodes +=    `<option value=${threshold} selected>${threshold}</option>`;        
          //                       } else {
          //                           nodes +=    `<option value=${threshold}>${threshold}</option>`;  
          //                       }
          //                   });

          // nodes +=         '</select>'; 
          // nodes +=         '</th>';
          // nodes +=       '</tr>'; 


          nodes +=       '<tr>';         
          nodes +=         '<th style="text-align: left"><p> Cell (+) ';

          nodes +=           `<select name="markerPositiveThresholds.${channelName}" style="width:60%;" id="markerPositiveThresholds.${channelName}" onchange="onChangeMarkerPositiveThreshold(this)" >`;

          cellPositiveThresholdOptions.forEach((threshold, idx) => {

              if(threshold === Opts.markerPositiveThreshold) {
                  nodes +=    `<option value=${threshold} selected>${threshold}</option>`;        
              } else {
                  nodes +=    `<option value=${threshold}>${threshold}</option>`;  
              }
          });

          nodes +=           '</select>';
          nodes +=         '</p></th>'; 

          nodes +=         '<th style="padding-left:5%;"><label class="switch switch-left-right">';
          nodes +=           `<input class="switch-input" type="checkbox" id="cellPositiveSwitch.${channelName}" onclick="toggleChannelCellPositive(this)" />`;
          nodes +=           '<span class="switch-label" data-on="On" data-off="Off"></span> ';
          nodes +=           '<span class="switch-handle"></span>'; 
          nodes +=         '</label></th>';
          if (!idx) {          
             nodes +=         '<th><a  href="javascript:void(0)" onclick="requestCellPositiveInfo()"><i style="font-size:1vw;"    class="fa fa-info-circle"></i></a></th>';                  
          }
          nodes +=       '</tr>'; 

          nodes +=       '<tr>';         
          nodes +=         '<th style="text-align: left"><p> Cell (-) ';

          nodes +=           `<select name="markerNegativeThresholds.${channelName}" style="width:60%;" id="markerNegativeThresholds.${channelName}" onchange="onChangeMarkerNegativeThreshold(this)" >`;

          cellNegativeThresholdOptions.forEach((threshold, idx) => {

              if(threshold === Opts.markerNegativeThreshold) { 
                  nodes +=    `<option value=${threshold} selected>${threshold}</option>`;        
              } else {
                  nodes +=    `<option value=${threshold}>${threshold}</option>`;  
              }
          });

          nodes +=           '</select>';

          nodes +=        '</p></th>'; 
         
          nodes +=         '<th style="padding-left:5%;"><label class="switch switch-left-right">';
          nodes +=           `<input class="switch-input" type="checkbox" id="cellNegativeSwitch.${channelName}" onclick="toggleChannelCellNegative(this)" />`;
          nodes +=           '<span class="switch-label" data-on="On" data-off="Off"></span> ';
          nodes +=           '<span class="switch-handle"></span>'; 
          nodes +=         '</label></th>';
          
          if (!idx) {
             nodes +=         '<th><a  href="javascript:void(0)" onclick="requestCellNegativeInfo()"><i style="font-size:1vw;"    class="fa fa-info-circle"></i></a></th>';          
          }
             
          nodes +=       '</tr>';                     

          // nodes +=       '<tr>'          
          // nodes +=         '<th ><label class="switch">';
          // nodes +=           '<input type="checkbox" checked>';
          // nodes +=           '<div class="slider round"></span>';
          // nodes +=         '</label></th>';
          // nodes +=       '</tr>'          

/*        //// for future use ..
          nodes +=       '<tr>';
          nodes +=         '<th style="text-align: center"><p> Opacity </p></th>';      
          nodes +=         `<th style="vertical-align:middle;">`;
          nodes +=            `<div class="tooltip">`;
          nodes +=             `<input type="range" min="0" max="1" value="1" step="0.1" id="opacity.${idx}" onchange="chOpacityChanged(this)" onmouseover="onChOpacitySliderMouseover(this)"  >`;
          nodes +=             `<span class="tooltiptext" style="width: 50%; left: 50%;" id="chOpacityValueTooltip"></span></div></th>`;
          nodes +=       '</tr>';      
*/              
          nodes +=       '<tr>';
          nodes +=         '<th style="text-align: left"><p> Cell Filter </p></th>';      
          nodes +=         `<th ><div class="tooltip"><input  type="range" style="padding-left:5%; margin-left:10%; width:90%" min="0" max="255" value="0" step="20" id="cellFilterSlider.${channelName}" onchange="cellFilterSliderChanged(this)" onmouseover="onCellFilterSliderMouseover(this)" disabled ><span class="tooltiptext" style="width: 50%; left: 50%;" id="cellFilterValueTooltip.${channelName}"></span></div></th>`;
          if (!idx) {          
             nodes +=         '<th><a  href="javascript:void(0)" onclick="requestCellFilterInfo()"><i style="font-size:1vw;"    class="fa fa-info-circle"></i></a></th>';            
          }
          nodes +=       '</tr>';
          nodes +=      '</table>';  
          // nodes +=  ' <input type="range" min="1" max="100" value="50">';	            
          nodes +=  '</div>';	      
	    });


        //////---------------------------------------------------------------------//////
        //////-------------- Initiat Cell Morphological Options -------------------//////
        //////---------------------------------------------------------------------//////

        //let morphFeatureNamesArr  = Object.keys(dapiMorphStatisticalData);

        // morphFeatureNamesArr = [ "area", "eccentricity", "extent", "orientation", "solidity", "major_axis_length", "minor_axis_length" ]
        let morphFeatureNamesArr = cellMorphFeatureList.map(entry => {
                                        return entry.morphFeature
                                    })

        nodes +=  '<button class="accordion">';
        nodes +=    `<li style="background-color: none" id="DapiCellsMorphOptions">`;
        nodes +=      `<i style="font-size:1.2vw" class="fa fa-pie-chart"></i>&nbsp`;       
        nodes +=      `<font  style="font-size:0.77vw"  id="morphOptionsFont">CELL MORPHOLOGY</font>`;
        nodes +=    '</li>';
        nodes +=  '</button>';
        nodes +=  '<div class="accordionpanel">';
        nodes +=     '<table>';
        nodes +=       '<colgroup> <col style="width:45%"> <col style="width:40%"><col style="width:15%"> </colgroup>';

     
        morphFeatureNamesArr.forEach( (morphFeatureName, idx) => {
              // morphFeatureName e.g. area  
              // featureStates is object e.g. { mean: 389.9538807755854, std: 182.39338373199172, min: 133.5, "25%": 260.5, "50%": 363.5, "75%": 469.5, max: 1666 }
              // let morphFeatureStates = dapiMorphStatisticalData[morphFeatureName];
              let morphFeatMaxVal = 10; //dapiMorphStatisticalData[morphFeatureName].max;
              let morphFeatMinVal = 0 ; //dapiMorphStatisticalData[featureName].min;
              let stepVal = (morphFeatMaxVal - morphFeatMinVal)/10;
              // To make first letter at morphological feature name capital e.g. Area
              let capitalizeName =  morphFeatureName.charAt(0).toUpperCase() + morphFeatureName.slice(1);           

              nodes +=       '<tr>';
              nodes +=         `<th style="text-align: left"><p> ${capitalizeName} </p></th>`;      
              nodes +=         `<th ><div class="tooltip"><input  type="range" style="padding-left:5%; margin-left:10%; width:90%" min="${morphFeatMinVal}" max="${morphFeatMaxVal}" value="${morphFeatMinVal}" step="${stepVal}" id="cellFilterSlider.${morphFeatureName}" onchange="cellMorphFilterSliderChanged(this)" onmouseover="onCellFilterSliderMouseover(this)" disabled ><span class="tooltiptext" style="width: 50%; left: 50%;" id="cellFilterValueTooltip.${morphFeatureName}"></span></div></th>`;
              nodes +=         `<th><a  href="javascript:void(0)" id="info.${morphFeatureName}" onclick="requestCellMorphologicalInfo(this)"><i style="font-size:1vw;"    class="fa fa-info-circle"></i></a></th>`;            
              nodes +=       '</tr>'; 
        });

        nodes +=      '</table>';  
            
        nodes +=  '</div>';         


	    document.getElementById("channelOptionsList").innerHTML += nodes;
	}  



    activateDapiCellsMorphOptionsList = (dapiMorphStatisticalData) => { 

            //morphFeatureNamesArr = [ "area", "eccentricity", "extent", "orientation", "solidity", "major_axis_length", "minor_axis_length" ] 
            let morphFeatureNamesArr  = Object.keys(dapiMorphStatisticalData)

         
            morphFeatureNamesArr.forEach( (morphFeatureName, idx) => {
                  // morphFeatureName e.g. area  
                  // featureStates is object e.g. { mean: 389.9538807755854, std: 182.39338373199172, min: 133.5, "25%": 260.5, "50%": 363.5, "75%": 469.5, max: 1666 }
                  let morphFeatureStates = dapiMorphStatisticalData[morphFeatureName];
                  let morphFeatMaxVal = dapiMorphStatisticalData[morphFeatureName].max;
                  let morphFeatMinVal = 0 ; //dapiMorphStatisticalData[featureName].min;
                  let stepVal = (morphFeatMaxVal - morphFeatMinVal)/10;             

                  document.getElementById(`cellFilterSlider.${morphFeatureName}`).max = morphFeatMaxVal;
                  document.getElementById(`cellFilterSlider.${morphFeatureName}`).min = morphFeatMinVal;
                  document.getElementById(`cellFilterSlider.${morphFeatureName}`).step = stepVal;
                  document.getElementById(`cellFilterSlider.${morphFeatureName}`).disabled = false;

            });

    }  

/*--------------------------------------------------Right Panel-----------------------------------------------------*/
/*---------------------------------------------- Boundary Section---------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------*/


   // check whether the ON/OFF button toggled to ON
   isBoundarySwitchEnabled = () => {
        return document.getElementById("boundarySwitch").checked ? true : false;
   }

   // check whether Grid/Spx boundares loaded
   // isBoundaryLoaded = () => {

   // }

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


   freezeBoundaryDependentControls = (freezeFlag = true) => {  // Controls that depend on Boundary existence such as strock or fill
          enableBoundarySliders(!freezeFlag); 
          freezeInput("tileSearchBox", freezeFlag); 
          freezeInput("findTileBtn", freezeFlag); 
          // freezeInput("createLoadFeaturesBtn", freezeFlag);           
          // freezeInput("boundaryFillColor", freezeFlag); 
          // freezeInput("strokeColor", freezeFlag); 
   }   

   freezeBoundaryControls = (freezeFlag = true) => {
          freezeBoundaryDependentControls(freezeFlag);
          freezeInput("toggleBoundaries", freezeFlag);
   }

   resetBoundarySwitch = () => {
        document.getElementById("boundarySwitch").checked = false;
        boundarySwitchClicked();
   }   

   resetBoundarySwitchDependencies = () => {
        if( isSimilarRegionBtnEnabled() ) {
              resetSimilarTilesSwitch();
        } 
        freezeInput("findSimilarTileBtn", true);
        freezeAllCellFilters(true);
   } 

   //  ON-OFF Boundary Switch
   boundarySwitchClicked = () => {
         //  is switch ON
   	     if( isBoundarySwitchEnabled() ) {
             initBoundaries(); 
         } else { 
            //   switch is OFF
            removeBoundaries();

            freezeBoundaryControls();
            resetBoundarySwitchDependencies();        //    <<<<<<<<<<<-----------
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

        return remoteFileInfo ? remoteFileInfo._id : Opts.searchEntirHostForResource ?  searchFileRemotely(fileName)  :  null;

        // if(! searchEntireHost) {

        // } else {

        //       if (remoteFileInfo){
        //          return remoteFileInfo._id;
        //       } else { // if not exist with same ome folder, search entire host
        //          let searchedFileId =  searchFileRemotely(fileName);
        //          return searchedFileId ? searchedFileId : null;
        //       }
        // }
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

  removeLocalFile = (fileName, Dir) => {
     let isRemoved;
     webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort + "/removeFile","filename=" + fileName + "&outfolder=" + Dir, function(response) {
       isRemoved = JSON.parse(response);
     });

     return isRemoved   // true: exits, false: not exists
  }  

   // read  from local JSON file at dir  .. 
  readJsonFile = (fileName, Dir) => {
     let jsonContent;
     webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort + "/readJsonFile","filename=" + fileName + "&outfolder=" + Dir, function(response) {
       jsonContent = JSON.parse(response);
     });

     return jsonContent != "notExist" ?  jsonContent : [];   
  } 

   // isSpxBoundaryFileExist = () => {

   // 	 // return isLocalFileExist( getItemBoundariesFileName(), getBoundariesHomeDir()) ||
   //   //        // isLocalFileExist( getGrpBoundaryFileName(), getBoundariesLocalPath()) ||
   //   //      	isRemoteFileExist( getItemBoundariesFileName() )
   
   // }  

   // read boundaries from local JSON file at dir boundaries .. 
  //  getBoundaries = (fileName, boundaryFolder = Opts.defaultBoundariesDir) => {   // read boundaries file
  //     var results=[];
  //     webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort + "/readBoundaries","filename="+fileName+"&outfolder="+boundaryFolder, function(response) {
  //        results = response;
  //      });

  //     return results != "notExist" ?  results : "[]";
  // }

  // create boundaries from item mask e.g. "TONSIL-1_40X_cellMask.tiff"
  createBoundariesFromMask = (remoteCellMaskFileId) => {
      let fileName = getItemBoundariesFileName();
      let outFolder = getBoundariesLocalPath();
      let apiUrl = getHostApi();
      let apiKey = getApiKey(); 

      var results = [];
      webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort + 
        "/createBoundariesFromMask", "filename=" + fileName + "&outfolder=" + outFolder +
        "&baseUrl=" + apiUrl + "&apiKey=" + apiKey + "&itemId=" + remoteCellMaskFileId  + 
        "&contourApproxRequest=" + Opts.maskContourApproximation, function(response) {
         results = response;
       });
      
      return results;   
  }



  getTileBboxFormat = (spxBoundaries) => { 
    let bbox = find_bbox(spxBoundaries, "boundaryString");
    let bboxString = bbox['left'] + "," + bbox['top'] + " " + 
                     bbox['left'] + "," +  (parseInt(bbox['top']) + parseInt(bbox['height']))  + " " +
                     (parseInt(bbox['left']) + parseInt(bbox['width'])) + "," +  (parseInt(bbox['top']) + parseInt(bbox['height']))  + " " +
                     (parseInt(bbox['left']) + parseInt(bbox['width'])) + "," +  bbox['top']; 
    return    bboxString;  

  }  

  createBoundariesFromDapiChannel = () => {
  
      //  is_boundary_extraction_contours_based = request.args.get('isBoundaryExtractionContoursBased', 0, type=bool)
      //  print("Boundary extraction is contours based: ", is_boundary_extraction_contours_based)

      //  # if remove outliers is need
      //  is_remove_outliers_required = request.args.get('isRemoveOutliersRequired', 0, type=bool)
      //  print("Remove outliers is required: ", is_remove_outliers_required)

      //  # if removing all outliers of all morphologies  are need
      //  all_features_outliers_considered = request.args.get('allFeaturesOutliersConsidered', 0, type=bool)
      //  print("Remove all Features outliers is required: ", all_features_outliers_considered)  

      //  reset_boundaries_label_after_outlier_filter = request.args.get('resetBoundaryLabelAfterOutlierFilter', 0, type=bool)
      //  print("Reset boundaries label after outlier filter: ", reset_boundaries_label_after_outlier_filter)

      //  approximation_requested = request.args.get('contourApproxRequest', 0, type=bool)
      //  print("approximation_requested: ", approximation_requested)

      //  use_95_05_percentile = request.args.get('use95_05Percentile', 0, type=bool)
      //  percentile_lower = request.args.get('percentileLower', 0)
      //  percentile_upper = request.args.get('percentileUpper', 0)
      //  print("use_95_05_percentile requested: ", use_95_05_percentile)
      //  if use_95_05_percentile:
      //  print("percentile_lower requested: ", percentile_lower)
      //  print("percentile_upper requested: ", percentile_upper)

      // file_name = request.args.get('filename', 0)
      // out_folder = request.args.get('outfolder', 0)  
      // base_url = request.args.get('baseUrl', 0)
      // item_id = request.args.get('itemId', 0)
      // api_key = request.args.get('apiKey', 0)
      // dapi_ch_index = request.args.get('dapiChannelIdx', 0)
      // contour_scale_factor = request.args.get('contourScaleFactor', 0)

      let fileName = getItemBoundariesFileName();
      let outFolder = getBoundariesLocalPath();
      let apiUrl = getHostApi();
      let apiKey = getApiKey(); 
      let itemId = getSelectedItemId();
      let dapiChannelId = getSelectedDAPIChannelIndex()

      var results = [];

      // webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultCellBoundaryApiPort + 
      webix.ajax().sync().get("http://127.0.0.1:" +  Opts.defaultRestApiPort +
        "/createBoundariesFromDapiChannel", "filename=" + fileName + "&outfolder=" + outFolder +
        "&baseUrl=" + apiUrl + "&apiKey=" + apiKey + "&itemId=" + itemId  + 
        "&dapiChannelIdx=" + dapiChannelId + 
        "&contourScaleFactor=" + Opts.contourScaleFactor + 
        "&nuclContourApproxFactor=" + Opts.nuclContourApproxFactor + 
        "&contourApproxRequest=" + Opts.nuclContourApproximation +
        "&isBoundaryExtractionContoursBased=" + Opts.isBoundaryExtractionContoursBased +
        "&isRemoveOutliersRequired=" + Opts.isRemoveOutliersRequired +
        "&allFeaturesOutliersConsidered=" + Opts.allFeaturesOutliersConsidered +
        "&resetBoundaryLabelAfterOutlierFilter=" + Opts.resetBoundaryLabelAfterOutlierFilter +
        "&use95_05Percentile=" + Opts.use95_05Percentile +
        "&percentileLower=" + Opts.percentileLower +
        "&invalidNuclAreaThreshold=" + Opts.invalidNuclAreaThreshold +        
        "&percentileUpper=" + Opts.percentileUpper, function(response) {
         results = response;
       });
      
      return results;       
  }



  initSpxOverlay = ( /*allSpxBoundaryData = [] */) => {
     webix.message("Wait cell boundaries to load");
     triggerHint("Wait cell boundaries to load","info", 10000);
      // let allSpxBoundaryData = JSON.parse(getBoundaries( getItemBoundariesFileName(), getBoundariesLocalPath() ) );
      let allSpxBoundaryData = readJsonFile( getItemBoundariesFileName(), getBoundariesLocalPath() ) ;

     // $.getJSON( getBoundariesLocalPath() + getItemBoundariesFileName(), function(allSpxBoundaryData){
    
           if(! allSpxBoundaryData.length) {
              triggerHint("No cell mask data found ..","info", 5000);
              return 0;
           }
          
          allSelection = []; 
          //*** later to be modified such that  : 
          //*** let boundarData = readJsonFile getItemBoundariesFileName(), getBoundariesLocalPath() )
          //function addOverlay(tiles, overlayHandler) 
           $.each(allSpxBoundaryData, function(index, tile) {
                 let fillColor = d3.schemeCategory20[index % 20];
                 let spxPoints;

                 if(Opts.defaultSpxBoundaryShapes.polygon == true) {
                      spxPoints = tile.spxBoundaries;
                 } else {
                      spxPoints = getTileBboxFormat(tile.spxBoundaries);
                 }

                 d3.select(overlay.node())
                    .append("polygon")
                    // .attr("Xcentroid", tile.x_cent)
                    // .attr("Ycentroid", tile.y_cent)
                    .attr("points", spxPoints)
                    .style('fill', getBoundaryFillColor()) //was fillcolor
                    .attr('fill-opacity', getBoundaryFillOpacity())
                    .attr('class', 'spx')
                    .attr('id', 'spx-' + tile.label)      
                    .attr('index', tile.label)
                    .style('stroke', getStrokeColor())
                    .attr('origStrokeColor', Opts.defaultStrokeColor)
                    .style('stroke-width', getStrokeWidth())
                    // .style('stroke-opacity', $$("strokeOpacity").getValue())
                    .attr('origStroke-width', Opts.defaultStrokeWidth)  
                    .attr('origColor', Opts.defaultBoundaryFillColor)  //was fillcolor
                    .style('stroke-opacity', getStrokeOpacity())
                    // .on('.zoom',webix.message("zooming"))
                    .on('dblclick',  onSelectedTile)
                    .on('contextmenu', handleMouseRightClick) 
                    .on('mouseleave', handleTileMouseLeave)  
                    .on('mouseover', handleMouseOver);

           //       d3.select(overlay.node())
           //          .append("polygon")
           //          // .attr("Xcentroid", tile.x_cent)
           //          // .attr("Ycentroid", tile.y_cent)
           //          .attr("points", tile.spxBoundaries)
           //          .style('fill', "white") //was fillcolor
           //          .attr('fill-opacity', 1)
           //          .attr('class', 'spx')
           //          .attr('id', 'spx-' + tile.label)      
           //          .attr('index', tile.label)
           //          .style('stroke', getStrokeColor())
           //          .attr('origStrokeColor', Opts.defaultStrokeColor)
           //          .style('stroke-width', getStrokeWidth())
           //          // .style('stroke-opacity', $$("strokeOpacity").getValue())
           //          .attr('origStroke-width', Opts.defaultStrokeWidth)  
           //          .attr('origColor', Opts.defaultBoundaryFillColor)  //was fillcolor
           //          .style('stroke-opacity', 1)
           //          // .on('.zoom',webix.message("zooming"))
           //          .on('dblclick',  onSelectedTile)
           //          .on('contextmenu', handleMouseRightClick) 
           //          .on('mouseleave', handleTileMouseLeave)  
           //          .on('mouseover', handleMouseOver);                    

           });

              d3.select(overlay.node()).on('mouseleave',handleMouseLeave)
                .call(d3.behavior.zoom().on("zoom", function () { 
                          d3.select('.d3-context-menu').style('display', 'none');
                }))
                .on('contextmenu', function(d, i) { 
                    if( isSuperPixel() ){ 
                       contextMenu(menu1);
                    }
                 }); 

          webix.message("Boundaries loaded");    
          triggerHint("Boundaries loaded","info", 5000);      
     // });
     
     
  } 

   loadSpxBoundaries = () => {
   		// To be coded..check for superpixel availability, otherwise create it
   		// need wizard to allocate the cellmask image or create it.
        if( isLocalFileExist( getItemBoundariesFileName(), getBoundariesLocalPath()) ) {
               //to be coded
               // let allSpxBoundaryData = JSON.parse(getBoundaries( getItemBoundariesFileName(), getBoundariesLocalPath() ) );
               // initSpxOverlay(allSpxBoundaryData);
               initSpxOverlay();
               // triggerHint(" to be coded ");
        } else  {
                /// get remote boundary JSON file id from host is exist
                /// if Opts.searchEntirHostForResource is false, it will search for JSON file within the item remote folder only
                if ( isLoggedIn() ) {  

                    let remoteFileId = getRemoteFileId( getItemBoundariesFileName() );
                    if(remoteFileId != null) {
                         // download it to boundaries folder

                               // check if the user has access to download the file
                               if( getApiKey() != null ) {
                                   downloadHostFile( getItemBoundariesFileName(), getBoundariesLocalPath() );
                                   triggerHint(" to be coded ");

                                } else {
                                    createApiKey();
                                    // recall the function 
                                    loadSpxBoundaries();
                                }



                    } else { // Create cell boundaries from Dapi channel or cellMask image on host
                        
                         if ( isDAPIChannelSelected() ) {
                                 // related functions: getSelectedDAPIChannelName()
                                 // triggerHint("No SPX data found, create them from DAPI/DNA channel?  " + 
                                 //        '<a href="javascript:void(0)" onclick="createBoundariesFromDapiChannel()">[<b><font color="green">Yes</font></b>]</a>' + 
                                 //        '<a href="javascript:void(0)" onclick="closeHint()">[<b><font color="red">No</font></b>]</a>', "error", 10000);


                                triggerHint("No cell boundaries found, please wait while creating them from " + getSelectedDAPIChannelName() + " Channel" , "info", 10000);
                                let dapiBoundCreationStatus = createBoundariesFromDapiChannel();
                                
                                switch (dapiBoundCreationStatus) {
                                     case 'Created successfully':
                                                    {
                                                      triggerHint("Status of creating boundaries from channel: " + 
                                                                  '<b><font color="green">' + dapiBoundCreationStatus + '</font></b>', "info", Infinity )
                                                      // webix.message("Boundaries created and saved");
                                                      // setTimeout(() => { initSpxOverlay(); }, 5000 );  
                                                      initSpxOverlay();
                                                      break;                 
                                                    }
                                      // case 'Not a Valid Mask':
                                      //               {
                                      //             //  reloadOSD(curGroup, true, compositeType);
                                      //                 triggerHint("Status of creating boundaries from mask: " + 
                                      //                             '<b><font color="red">' + dapiBoundCreationStatus + '</font></b>', "error", 4000 )
                                      //                  break;                
                                      //               }

                                      case 'Failed':
                                                    {
                                                      triggerHint("Status of creating boundaries from channel: " + 
                                                                  '<b><font color="red">' + dapiBoundCreationStatus + '</font></b>', "error", 4000 )
                                                      break;             
                                                    }                                    
                                      }

                         
                         } else { // Create cell boundaries from cellMask image on host

                               let remoteCellMaskFileId = getRemoteFileId( getItemCellMaskImageName() ) ? getRemoteFileId( getItemCellMaskImageName() ) : getRemoteFileId( getItemCellMaskImageName() + "f" );
                               if(remoteCellMaskFileId != null) {
                                    triggerHint("No cell boundaries found, please wait while creating them from " + getItemCellMaskImageName() , "info", 10000);
                                    let boundariesCreationStatus = createBoundariesFromMask(remoteCellMaskFileId);
                                    
                                    switch (boundariesCreationStatus) {
                                         case 'Created successfully':
                                                        {
                                                          triggerHint("Status of creating boundaries from mask: " + 
                                                                      '<b><font color="green">' + boundariesCreationStatus + '</font></b>', "info", Infinity )
                                                          // webix.message("Boundaries created and saved");
                                                          // setTimeout(() => { initSpxOverlay(); }, 5000 );  
                                                          initSpxOverlay();
                                                          break;                 
                                                        }
                                          case 'Not a Valid Mask':
                                                        {
                                                      //  reloadOSD(curGroup, true, compositeType);
                                                          triggerHint("Status of creating boundaries from mask: " + 
                                                                      '<b><font color="red">' + boundariesCreationStatus + '</font></b>', "error", 4000 )
                                                           break;                
                                                        }

                                          case 'Failed':
                                                        {
                                                          triggerHint("Status of creating boundaries from mask: " + 
                                                                      '<b><font color="red">' + boundariesCreationStatus + '</font></b>', "error", 4000 )
                                                          break;             
                                                        }                                    
                                          }
                               } 
                         }
                    } 
               } else {
                 triggerHint("Login to access the remote boundaries JSON file or mask image  ", "error", 5000);                
               }                    
       }
   }

   // loadGridBoundaries = () => {
   // 	   initGridOverlay();
   // }

   // init Grid / Spx boundaries
   initBoundaries = () => {
       if( isRestApiAvailable() ) {     
    	   	 if( isSuperPixel() ) {
    	   		// if( isSpxBoundaryFileExist() ){
    	   		   loadSpxBoundaries();
    	   		// } else {
            //         triggerHint("No Superpixels info found.")		   		
    	   		// }    
    	   		// To be coded..check for superpixel availability, otherwise create it
    	   		// need wizard to allocate the cellmask image or create it.
    	   	 } else {
    	         initGridOverlay(); 
    	     } 

           resetTileValues(); 


           if( isBoundariesLoaded() ){
                freezeBoundaryControls(false);
                if( initBoundariesFeatures() ) {
                   freezeAllCellFilters(false);
                   freezeInput("chartOperations", false);
                }
               
           } else {
               freezeBoundaryDependentControls(true); 
               // triggerHint("No boundaries loaded ..","error", 4000 );
           }

           // setTimeout(() => { closeHint(); }, 4000 );  

       } else {
           triggerHint("Flask app is not responding, try to restart it... ","info", 7000); 
           setTimeout(() => { 
                              resetBoundarySwitch(); 
                            }, Opts.resetSwitchTimeOut );  
       }       
       

       // if( isFeaturesLoaded() ) {
       //     freezeInput("createLoadFeaturesBtn", true);    
       // } else {
       //     freezeInput("createLoadFeaturesBtn", false);  
       // }    
            
   }


    
    toggleGridSpxBoundaries = () => {
    	  removeBoundaries();
        // resetTileValues();          // <<<<<<<<<<<<<<<      also exist with initBoudaries() .. can be removed 
        // enableBoundarySliders(true); // will freeze gridSize if tileType is spx        
        initBoundaries();          
	}


    getGridSize = () => {
       return document.getElementById("gridSize").value;
    }

    gridSizeChanged = () => {
    //	reloadGrid();
       //loadGridBoundaries();  
       initBoundaries();       
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

    setBoundaryFillOpacity = (opacityValue) => {
        document.getElementById("boundaryFillOpacity").value = opacityValue;
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
   	     if( isBoundarySwitchEnabled() ) {
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
   	     if( isBoundarySwitchEnabled() ) {
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
    nodes += 	    		'<input  type="range" disabled   id="gridSize" onchange="gridSizeChanged()" onmouseover="gridSizeSliderMouseOver()" >';
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
    nodes +=             '<input type ="text" id="tileSearchBox" style="color: white; height:1vh;" disabled></button>'
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
    document.getElementById("gridSize").min = Opts.minGridSizeRange;
    document.getElementById("gridSize").step = Opts.gridSizeStep;
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







   // check whether the ON/OFF button toggled to ON
   isSimilarRegionBtnEnabled = () => {
        return document.getElementById("findSimilarTileBtn").checked ? true : false;
   }

   isFeaturesCreateBtnEnabled = () => {
      return document.getElementById("createLoadFeaturesBtn").disabled ? false : true;
   } 

   // Check if Heatmap switch is ON 
   isHeatmapBtnEnabled = () => {
      return document.getElementById("heatmap").checked ? true : false;
   }       

   // disableSimilarTilesBtn = (disableFlag) => {
   //    document.getElementById("findSimilarTileBtn").disabled = disableFlag; 
   // }

    freezeFeaturesControls = (freezeFlag = true) => {
        freezeInput("nearestTileMatching", freezeFlag);
        freezeInput("similarityThreshold", freezeFlag); 
        freezeInput("heatmap", freezeFlag); 
   }

   //  ON-OFF Similar Region Switch
   similarTilesSwitchClicked = () => {
         //  is switch ON
         if( isSimilarRegionBtnEnabled() ) {
                freezeFeaturesControls(false);
                findSimilarTiles(); 

         } else { 
            //   switch is OFF
                restoreBoundarySettings();
                resetSimilarTilesSwitchDependencies();    // <<<<<<<<<<<<<<<<<------
                freezeFeaturesControls(true);

               // initBoundaries();                
         }
   }

   resetSimilarTilesSwitchDependencies = () => {
          if( isHeatmapBtnEnabled() ) {
              resetHeatmapSwitch();
          }    

          resetNearTilesSlider();
          resetSimilaritySlider();
   }
 
   resetSimilarTilesSwitch = () => {
       if( isSimilarRegionBtnEnabled() ) {
          document.getElementById("findSimilarTileBtn").checked = false;

          // if( isBoundarySwitchEnabled() ) {           // <<<<<<<<<<<<<<<<<<<<<<
          similarTilesSwitchClicked();
          // }

          // resetSimilarTilesSwitchDependencies();
       }  
   }  


   resetHeatmapSwitch = () => {
     if( isHeatmapBtnEnabled() ) {
         document.getElementById("heatmap").checked = false;
        // if( isSimilarRegionBtnEnabled() ) {     // <<<<<<<<<<<<<<<
         roiHeatmapSwitchClicked();
        // }  
      }  
   }  
   //  ON-OFF Heatmap Switch
   // heatmapSwitchClicked = () => {
   //       //  is switch ON
   //       // if( isHeatmapBtnEnabled() ) {
   //              // freezeFeaturesControls(false);
   //              roiHeatmapSwitchClicked(); 

   //       // } else { 
   //       //    //   switch is OFF
   //       //        // freezeFeaturesControls(true);
   //       //       // initBoundaries();                

   //       // }
   // }   

////////////////////
function compare(dist1, dist2) {   // use this function to sort  allcolorFeatures
    return dist1.Distance < dist2.Distance ? 1 : -1;
}

/////////////////////////////////
// compute multiplexed tile distance with other tiles
function computeDistance(features1, features2, numOfFrames) {
     let dist = 0; 
     for (let n = 0; n < checkboxSelectedFeatures.length; n++) { // if unchecked, this feature Key will not selected
        for (let k = 0; k < numOfFrames; k++) {   // computer each key for all frames first
             dist = dist + math.pow(features1[k][checkboxSelectedFeatures[n]] - features2[k][checkboxSelectedFeatures[n]], 2);
        }
     }

     return dist;
 }

restoreBoundarySettings = () => {
            let currentTileId = getSelectedTileId();
            let tileClass = getClassType();


            d3.selectAll(tileClass).style('fill', getBoundaryFillColor());
            d3.selectAll(tileClass).style('stroke', getStrokeColor());  
            d3.selectAll(tileClass).style('fill-opacity', getBoundaryFillOpacity()); 

            d3.select("#"+currentTileId).style('fill', Opts.selectedTileFillColor);
            d3.select("#"+currentTileId).style('fill-opacity', Opts.selectedTileFillOpacity);            

}
////////////////////
addHeatmapAnnotations = () =>{
   triggerHint("To be coded");
}

removeHeatmapAnnotations = () =>{
   triggerHint("To be coded");
}

roiHeatmapSwitchClicked = () => {
  viewer.viewport.goHome();
  if( isHeatmapBtnEnabled() ){

      prevOpacity = getBoundaryFillOpacity();
  //    setBoundaryFillOpacity($$("SpxOpacity").config.max)          <<<<<<<<<<--------------
      setBoundaryFillOpacity(1);      
 //     findSimilarTiles();
      // removeFrameAnnotations();
      addHeatmapAnnotations();
      freezeInput("findSimilarTileBtn", true);
    } else {
      setBoundaryFillOpacity(prevOpacity);
      removeHeatmapAnnotations();
      // addFrameAnnotations()
      freezeInput("findSimilarTileBtn", false);

    }

    findSimilarTiles();
}

///////////////////
    findSimilarTiles = () => {
          let currentTileId = getSelectedTileId();
          let tileClass = getClassType();
          let sortedFeaturesDistance = [];

          if( !isFeaturesSelected() ){ // At least one feature should be selected from Features menu (.e.g mean, max, std)
              triggerHint("Select feature first");
              return 0;
          }

          if( isTileSelected() && isSimilarRegionBtnEnabled() ) {  // <<<<<<<<<<<<<<<< --------- no need to "if" condition, findSimilarTiles by default can't be called if no tile selected

              // currentTileData = findObjectByKeyValue(allTilesFeatures, 'id', d3.select(currentTileObj).attr('id')); 
              let currentTileData = findObjectByKeyValue(allTilesFeatures, 'id', currentTileId); 
              let numOfFrames = getSelectedGroup().Channels.length;              
              
              // let numOfFrames =  currentTileData.features.length;              
              // console.log("currentTileData :", currentTileData)

              let allFeaturesDistance = []; // tile features distance with other tiles

              // for(let k = 0; k < allTilesFeatures.length; k++) {
              //       let featuresDistance = computeDistance( currentTileData.features, allTilesFeatures[k].features, numOfFrames);
              //       allFeaturesDistance.push({id: allTilesFeatures[k].id, Distance: featuresDistance});
              // }

              allTilesFeatures.forEach(tile => {
                    let featuresDistance = computeDistance( currentTileData.features, tile.features, numOfFrames);
                    allFeaturesDistance.push({id: tile.id, Distance: featuresDistance});
              })              
            
              sortedFeaturesDistance = allFeaturesDistance.sort(compare);
              // sortedFeaturesDistance = allFeaturesDistance.sort((dist1, dist2) => dist1 - dist2);              
       
              if(sortedFeaturesDistance[0].Distance > sortedFeaturesDistance[sortedFeaturesDistance.length-1].Distance) {
                    sortedFeaturesDistance.reverse();
              }
              
              let domainSmallValue = sortedFeaturesDistance[0].Distance;
              let domainLargeValue = sortedFeaturesDistance[sortedFeaturesDistance.length-1].Distance;
              let domainMiddleValue = (domainSmallValue + domainLargeValue) / 2;

              let heatmapColor = d3.scaleLinear()
                                   .domain([domainSmallValue, (domainSmallValue + domainMiddleValue)/2,  domainMiddleValue, (domainMiddleValue + domainLargeValue)/2, domainLargeValue])
                                   .range(["red", "#FF9999", "#FFFFCC", "#66B2FF", "#004C99"]);

              document.getElementById("nearestTileMatching").max =  sortedFeaturesDistance.length - 1;
              // for future use  <<<<<<< ------
              let maxNearest = sortedFeaturesDistance.length - 1;
              let numOfNears = Math.max(getNearTilesSliderValue(), Math.floor(getSimilaritySliderValue() * maxNearest / 100));
        
              // if(numOfNears==0){
              //   $$("PrevSPX").setValue("Original");
              //   $$("PrevSPX").disable();
              //   $$("NextSPX").disable();
              //   var boundID
              //   boundID= sortedFeaturesDistance[0].id; 
              //   locatSPX(tileClass,boundID);
              //   }else{
              //      if(numOfNears< SPXNavigationPointer){
              //           SPXNavigationPointer=numOfNears;
              //           $$("PrevSPX").enable();
              //           $$("NextSPX").disable();
              //         }else{
              //           $$("PrevSPX").enable();
              //           $$("NextSPX").enable();                

              //         }

              //   }

              d3.selectAll(tileClass).style('fill', 'white');
              d3.selectAll(tileClass).style('stroke', 'none');  
              d3.selectAll(tileClass).style('fill-opacity', 0.1); 
             // d3.select("#"+sortedFeaturesDistance[0].id).style('fill', d3.rgb(HeatmapRange[0]));         //<<<<<<<<<<<<<<<<----
              d3.select("#"+sortedFeaturesDistance[0].id).style('fill', d3.rgb(heatmapColor(sortedFeaturesDistance[0].Distance)));  


              if( !isHeatmapBtnEnabled() ) { // heatmap switch is OFF
                    d3.select("#"+sortedFeaturesDistance[0].id).style('fill-opacity', 0.4);
              } else {
                    d3.select("#"+sortedFeaturesDistance[0].id).style('fill-opacity', getBoundaryFillOpacity());
              }
              
              // Original Selected Tile 
              d3.select("#"+sortedFeaturesDistance[0].id).style('stroke', Opts.originalTileStrokeColor);
              d3.select("#"+sortedFeaturesDistance[0].id).style('stroke-width', Opts.originalTileStrokeWidth);
              d3.select("#"+sortedFeaturesDistance[0].id).style('stroke-opacity', Opts.originalTileStrokeOpacity);


              if( !isHeatmapBtnEnabled() ) { // heatmap switch is OFF

                  if(getNearTilesSliderValue() > document.getElementById("nearestTileMatching").min) { // means Nearest slide changes 
                      for(let i = 1; i <= getNearTilesSliderValue(); i++) {
                               // Similar to Selected tile
                               d3.select("#"+sortedFeaturesDistance[i].id).style('fill', Opts.similarTileFillColor);
                               d3.select("#"+sortedFeaturesDistance[i].id).style('fill-opacity', 0.4);
                               d3.select("#"+sortedFeaturesDistance[i].id).style('stroke', Opts.similarTileStrokeColor);
                               d3.select("#"+sortedFeaturesDistance[i].id).style('stroke-width', getStrokeWidth());
                               d3.select("#"+sortedFeaturesDistance[i].id).style('stroke-opacity', 1);
                       }
                       // zoom to near tile
                       zoomToTile(document.getElementById(sortedFeaturesDistance[getNearTilesSliderValue()].id));
                   }  

                   if(getSimilaritySliderValue() > document.getElementById("similarityThreshold").min) { // means similarity threshold is selected and changes..
                        
                        for(let k = 1; k < sortedFeaturesDistance.length; k++) {
                           // to normalize-->  NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin 
                            // since oldMin and NewMin = 0 
                            // NewValue=OldValue*Newmax/oldMax 
                             document.getElementById("similarityThreshold").max = 100;
                             normDist= sortedFeaturesDistance[k].Distance * (document.getElementById("similarityThreshold").max) / sortedFeaturesDistance[sortedFeaturesDistance.length-1].Distance
                       
                             if (normDist <= getSimilaritySliderValue()) {
                                 d3.select("#"+sortedFeaturesDistance[k].id).style('fill', Opts.similarTileFillColor);
                                 d3.select("#"+sortedFeaturesDistance[k].id).style('fill-opacity', 0.4);
                                 d3.select("#"+sortedFeaturesDistance[k].id).style('stroke',  Opts.similarTileStrokeColor);
                                 d3.select("#"+sortedFeaturesDistance[k].id).style('stroke-width', getStrokeWidth());
                                 d3.select("#"+sortedFeaturesDistance[k].id).style('stroke-opacity', 1);
                              } 
                         }
                    }

               // for(var k=0;k<eval(tileType+"TilesLabel").length;k++)
               //    {
               //        if(eval(tileType+"TilesLabel")[k].tilelabel=='P'){
               //             d3.select("#"+eval(tileType+"TilesLabel")[k].id).style('fill', 'green');
               //             d3.select("#"+eval(tileType+"TilesLabel")[k].id).style('stroke', 'green');
               //         }
               //         else
               //         {
               //             d3.select("#"+eval(tileType+"TilesLabel")[k].id).style('fill', 'red');
               //             d3.select("#"+eval(tileType+"TilesLabel")[k].id).style('stroke', 'red');
               //         }

               //     }


               } else {  // heatmap switch is ON

                 //   if($$("HeatmapBasedTech").getValue()=="Dist"){ 
                     for(let k = 1 ; k < sortedFeaturesDistance.length; k++) {
                       // to normalize-->  NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin 
                        // since oldMin and NewMin = 0 
                        // NewValue=OldValue*Newmax/oldMax 
     //<<<<<<<<<<<<<<---- // hmapColorIndex = Math.round(sortedFeaturesDistance[k].Distance * (HeatmapRange.length-1) / sortedFeaturesDistance[sortedFeaturesDistance.length-1].Distance)
     //<<<<<<<<<<<<<<---- // d3.select("#" + sortedFeaturesDistance[k].id).style('fill', d3.rgb(HeatmapRange[hmapColorIndex]));
                          d3.select("#" + sortedFeaturesDistance[k].id).style('fill', d3.rgb(heatmapColor(sortedFeaturesDistance[k].Distance)));
                          d3.select("#" + sortedFeaturesDistance[k].id).style('fill-opacity', getBoundaryFillOpacity());
                     }
                     
                  //  }
                    // if($$("HeatmapBasedTech").getValue()=="FNN"){ 
                    //             fnnPrediction(allTilesFeatures);
                    // }

               }  
                
               freezeInput("nearestTileMatching", false);
               freezeInput("heatmap", false);
           // end if(currentTileId!=''){
          // } else {
          //        if( !isSimilarRegionBtnEnabled() ) {  
          //             freezeInput("heatmap", true);

          //             d3.selectAll(tileClass).style('fill', 'white');
          //             d3.selectAll(tileClass).style('stroke', 'none');  
          //             d3.selectAll(tileClass).style('fill-opacity', 0.1); 
          //             d3.select("#"+sortedFeaturesDistance[0].id).style('fill', "white");
          //             d3.select("#"+sortedFeaturesDistance[0].id).style('fill-opacity', 0.4);
          //           }

          }

    }


    // disableNearestTileSlider = (disableFlag) => {
    //   document.getElementById("nearestTileMatching").disabled = disableFlag; 
    // }
    getNearTilesSliderValue = () => {
       return document.getElementById("nearestTileMatching").value;
    }

    resetNearTilesSlider = () => {
        document.getElementById("nearestTileMatching").value = document.getElementById("nearestTileMatching").min ;
    }    

    nearestTileMatchingMouseOver = () => {
       updateInputTooltip("nearestTileMatchingTooltip", getNearTilesSliderValue); 
    }

    nearestTileMatchingChanged = () => {
       updateInputTooltip("nearestTileMatchingTooltip", getNearTilesSliderValue); 
       findSimilarTiles();

       if( getNearTilesSliderValue() > document.getElementById("nearestTileMatching").min ) {
            freezeInput("similarityThreshold", true);
       } else {
            freezeInput("similarityThreshold", false);
       }
    }


    getSimilaritySliderValue = () => {
       return document.getElementById("similarityThreshold").value;
    }

    resetSimilaritySlider = () => {
        document.getElementById("similarityThreshold").value = document.getElementById("similarityThreshold").min ;
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
       updateInputTooltip("similarityThresholdTooltip", getSimilaritySliderValue);      
    }

    similarityThresholdChanged = () => {
       updateInputTooltip("similarityThresholdTooltip", getSimilaritySliderValue);  
       findSimilarTiles();       

       if( getSimilaritySliderValue() > document.getElementById("similarityThreshold").min ){
            freezeInput("nearestTileMatching", true);
       } else {
            freezeInput("nearestTileMatching", false);
       }
    }


  
  // selectedFeature = (elem) => {

  //      if(elem.checked) {
  //       	// console.log(" elem checked", elem);
  //         insertArrayElem(checkboxSelectedFeatures, elem.value, checkboxSelectedFeatures.length)
  //      } else {
  //       	// console.log(" elem unchecked", elem);
  //         removeArrayElem(checkboxSelectedFeatures, elem.value);
  //      }    	
  // }
  
  isFeaturesSelected = () => {
       return checkboxSelectedFeatures.length ? true : false;
  }

  isFeatureElemChecked = (elem) => {
       return document.getElementById(elem.id).innerHTML == "<i class=\"fa fa-check-square\">&nbsp;</i>" ? true : false;
  }

  onFeatureCheckboxClick =  (elem) => {

       if( isFeatureElemChecked(elem) ) {
          removeArrayElem(checkboxSelectedFeatures, elem.id);
          document.getElementById(elem.id).innerHTML = '<i class="fa fa-square">&nbsp</i>';
       } else {
          insertArrayElem(checkboxSelectedFeatures, elem.id, checkboxSelectedFeatures.length)
          document.getElementById(elem.id).innerHTML = '<i class="fa fa-check-square">&nbsp</i>';
       }      
  }

  onCurRoiTitleClick = () => {
     if( isTileSelected() ) {
       let roiObj = getSelectedTile();
       zoomToTile(roiObj);
     }  
  }

  goToStartRoi = () => {
    // for future use  
  }

  prevRoi = () => {
    // for future use  
  }

  nextRoi = () => {
    // for future use  
  }


	
  initGrpFeatureOptions = () => { 
    let nodes="";
    let featureKeysCounter = 0;
    const sectionTitle = "Features";
    document.getElementById("grpFeatureOptions").innerHTML = ""; 

    nodes +=  '<button class="accordion">';
    nodes +=    '<li style="background-color: none" id="grpFeatureOptionsTitleLi">';
    nodes +=      `<font  style="font-size:0.65vw"  id="grpFeatureOptionsTitle">${sectionTitle}</font>`;
    nodes +=    '</li>';
    nodes +=  '</button>';
    nodes +=  '<div class="accordionpanel">';
    nodes +=     '<table>';
    nodes +=       '<colgroup> <col style="width:16.7%"> <col style="width:16.7%"> <col style="width:16.7%"><col style="width:16.7%"><col style="width:16.7%"><col style="width:16.5%"></colgroup>';

    nodes +=       '<tr>';         
    nodes +=         '<th colspan="2" style="text-align: center"><p> Features </p></th>'; 
    nodes +=         '<th colspan="1"></th>';     
    nodes +=         '<th colspan="2">';
    nodes +=             '<button onclick="createLoadFeatures()" id="createLoadFeaturesBtn" disabled>Load</button>';
    nodes +=         '</th>';
    nodes +=       '</tr>';  

    nodes +=       '<tr style="border: 3px solid grey">&nbsp</tr>'; 


    featureKeys.forEach( (key, idx) => { // load mean, max, std etc..
        if(!(idx % 3)) { // 3 checkboxs in every row
           nodes +=      '<tr>';            
        }
        // nodes +=       '<tr>';  
        nodes +=         '<th>';
        // nodes +=           `<label class="inputcontainer"><p>${key}</p><input type="checkbox" name="${key}" value="${key}" onclick="selectedFeature(this)" checked ><span class="checkmarkrect"></span></label>`;
        nodes +=            `<a href="javascript:void(0)" class="featuresCheckboxClass" id="${key}"  onclick="onFeatureCheckboxClick(this)">`;
        nodes +=              `<i class="fa fa-check-square">&nbsp</i></a>`;
        nodes +=         '</th>'; 
        nodes +=         `<th><font  style="font-size:0.77vw"  id="featureFont"${idx}">${key}</font></th>`; 

        if ( !((idx + 1) % 3) || idx + 1 == featureKeys.length) {
           nodes +=       '</tr>'; 
        }

    })  


    nodes +=       '<tr style="border: 3px solid grey">&nbsp</tr>';  

    nodes +=       '<tr>'         
    nodes +=         '<th colspan="3" style="padding-left:10%;text-align: left"><p> Roi : </p></th>'; 
    nodes +=         '<th colspan="2">';
    nodes  +=          '<li style="background-color: none" id="curRoi">';
    nodes  +=             '<a href="javascript:void(0)" onclick="onCurRoiTitleClick()">';
    nodes  +=               `<font  style="font-size:0.62vw" id="curRoiFont"></font>`;
    nodes  +=              '</a>';
    nodes  +=           '</li>';     
    nodes +=         '</th>';
    nodes +=       '</tr>'   



    nodes +=       '<tr>'         
    nodes +=         '<th colspan="3" style="padding-left:10%;text-align: left"><p> Similar Regions </p></th>'; 
    nodes +=         '<th colspan="2"><label class="switch switch-left-right">';
    nodes +=           '<input class="switch-input" type="checkbox" id="findSimilarTileBtn" onclick="similarTilesSwitchClicked()" disabled />';
    nodes +=           '<span class="switch-label" data-on="On" data-off="Off"></span> ';
    nodes +=           '<span class="switch-handle"></span>' 
    nodes +=         '</label></th>';
    nodes +=       '</tr>'   

    nodes +=       '<tr>';
    nodes +=         '<th colspan="2" style="padding-left:10%;text-align: left"><p> Near Tile </p></th>';      
    nodes +=         '<th colspan="3"><div class="tooltip">';
    nodes +=              '<input type="number" disabled min="0"   value="0" step="1" style="color: white; height:1.5vh;"  id="nearestTileMatching" onchange="nearestTileMatchingChanged()" onmouseover="nearestTileMatchingMouseOver()">';
    nodes +=              '<span class="tooltiptext" style="width: 50%; left: 50%;" id="nearestTileMatchingTooltip"></span>';
    nodes +=            '</div>';
    nodes +=         '</th>';  
    nodes +=       '</tr>';  

    // nodes +=       '<tr>'         
    // nodes +=         '<th colspan="2" style="padding-left:10%;text-align: left"><p> Navigate </p></th>'; 
    // nodes +=         '<th colspan="1">';
    // nodes +=             '<a href="javascript:void(0)" onclick="goToStartRoi()">';
    // nodes +=               '<i class="fa fa-fast-backward"></i>';
    // nodes +=              '</a>';
    // nodes +=         '</th>';
    // nodes +=         '<th colspan="1">';
    // nodes +=             '<a href="javascript:void(0)" onclick="prevRoi()">';
    // nodes +=               '<i class="fa fa-step-backward"></i>';
    // nodes +=              '</a>';
    // nodes +=         '</th>';
    // nodes +=         '<th colspan="1">';
    // nodes +=             '<a href="javascript:void(0)" onclick="nextRoi()">';
    // nodes +=               '<i class="fa fa-step-forward"></i>';
    // nodes +=              '</a>';
    // nodes +=         '</th>';
    // nodes +=       '</tr>'     

    nodes +=       '<tr>';
    nodes +=         '<th colspan="2" style="padding-left:10%;text-align: left"><p> Similar % </p></th>';      
    nodes +=         '<th colspan="3"><div class="tooltip">';
    nodes +=              '<input type="number" disabled min="0"   value="0" max="100" step="1" style="color: white; height:1.5vh;"  id="similarityThreshold" onchange="similarityThresholdChanged()" onmouseover="similarityThresholdMouseOver()">';
    nodes +=              '<span class="tooltiptext" style="width: 50%; left: 50%;" id="similarityThresholdTooltip"></span>';
    nodes +=            '</div>';
    nodes +=         '</th>';  
    nodes +=       '</tr>';

    // nodes +=       '<tr style="border: 3px solid grey">&nbsp</tr>';        //<<<<<<<<<<<<<<<<<<<---


    nodes +=       '<tr>'         
    nodes +=         '<th colspan="3" style="padding-left:10%;text-align: left"><p> Heatmap </p></th>'; 
    nodes +=         '<th colspan="2"><label class="switch switch-left-right">';
    nodes +=           '<input class="switch-input" type="checkbox" id="heatmap" onclick="roiHeatmapSwitchClicked()" disabled />';
    nodes +=           '<span class="switch-label" data-on="On" data-off="Off"></span> ';
    nodes +=           '<span class="switch-handle"></span>' 
    nodes +=         '</label></th>';
    nodes +=       '</tr>'          


    nodes +=      '</table>';  
           
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

   setCurCompositeOperation = () => {
       let curCompositeOperation = document.getElementById("compositeOperations").value;
       currentGrpFeaturesSelectionStates.compositeOperation = curCompositeOperation;
   }

   getSelectedDisplayOption = () => {
   	   return currentGrpFeaturesSelectionStates.displayOption;

   }

   setCurDisplayOption = (curOption) => {
        currentGrpFeaturesSelectionStates.displayOption = curOption.value;
        curOption.value !== "composite" ? document.getElementById("compositeOperations").disabled = true : 
                                          document.getElementById("compositeOperations").disabled = false; 
	}

	// compositeChanged = () =>{
 //        console.log( document.getElementById("compositeOperations").value )

	// }

	confirmDisplayChanges = () => {
		let curGroup = getSelectedGroup();
		let curCompositeType = getSelectedCompositeOperation();
		if(lastGrpFeaturesSelectionStates.displayOption !== getSelectedDisplayOption()) {

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
       
        } else if(lastGrpFeaturesSelectionStates.compositeOperation !== curCompositeType) {
				 reloadOSD(curGroup, true, curCompositeType);
                 lastGrpFeaturesSelectionStates.compositeOperation = curCompositeType;
        } else {
          triggerHint("No change in current view option", "error", 3000);
        }

	}
 
  requestOperationInfo = () => {
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
     resetTileValues();
     // if(! isViewBarEmpty("grpFeaturesViewBar") ) {               //<<<<<<<<<<<<<<<<<<<<<----------
     //       clearViewBar("grpFeaturesViewBar");
     // }       
  }

removeTile = (tileId) => {
     d3.select("#"+ tileId).remove();     // to make it independent of class type
  }  
  
//////////////////////////////////////////////////////////////////////////////////////
// function loadTilesLabel(){
//     let tileType =  "SPX";
//     let tileSize =   64;
//     let saveFileName = slideName + "." + currentIndex + "." + tileType + "." + tileSize.toString(); 

//     let savedTileLabels = getFeatures(saveFileName);
//     if((savedTileLabels == null)||(savedTileLabels == "Notexist")){
//        webix.message("no saved labels");
//     }else{
//          if(tileType == "SPX")
//             SPXTilesLabel = JSON.parse(savedTileLabels);

//          webix.message("labels Loaded"); 

//     }

//   }

////////////////////////// Features functions ////////////////////////////////////////

// getFeatures = (fileName, featuresFolder) => {            <<<<<<<<<<<<<-----------
//     let results = [];
//     webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort + "/readFeatures","filename=" + fileName + "&outfolder=" +featuresFolder, response => {
//        results = response;
//      });

//      return results;
// }

saveFeatures = (filename, Directory, featuresDic, writeMode = "w", lastChunkFlag = 0) => {
    webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +"/saveFeatures",
          "name=" + filename + "&Dir=" + Directory + "&featuresDicData=" + featuresDic + "&lastChunkFlag=" + lastChunkFlag + "&mode=" + writeMode,
           function(response) {
              console.log(response)
           });
  }   

// calculateFeatures = (filename, Directory, featuresDic, writeMode = "w", lastChunkFlag = 0) => {
//     webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +"/saveFeatures",
//           "name=" + filename + "&Dir=" + Directory + "&featuresDicData=" + featuresDic + "&lastChunkFlag=" + lastChunkFlag + "&mode=" + writeMode,
//            function(response) {
//               console.log(response)
//            });
//   }   


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

      if(flag == "boundaryString") { // for the case of draw cells bounding box
         obj.split(" ").forEach(function(ptData, i) {
             xpx.push(parseInt(ptData.split(",")[0]));
             ypx.push(parseInt(ptData.split(",")[1]));
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


//chnlNameType = [{"Frame": "CD45", "Type" : "Immune"}, {"Frame": "KERATIN", "Type" : "Tumor"}, 
//                {"Frame": "ASMA", "Type" : "Stroma"}]
getCellsClassification = (chnlNameType) => {  

       let groupData = []; 

       // e.g. "Structural Components__markers_morphology.csv" 
       let markersMorphFileName =  getGrpMarkersMorphFileName();
       let grpFeaturesFolder = getGrpFeaturesLocalPath();

       let allCellClassesResoponse = [];

       webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +  "/classifyCellsWithMaxIntensity", "&chnl_name_type=" + JSON.stringify(chnlNameType) +
        "&features_folder=" + grpFeaturesFolder + "&markers_morph_file=" + markersMorphFileName +
        "&cell_undefined_threshold_value=" + Opts.cellUndefinedThresholdValue + 
        "&cellFeatureToNormalize=" + Opts.cellFeatureToNormalize , function(response) {

             allCellClassesResoponse = JSON.parse(response);
      });

     return allCellClassesResoponse;
}

// Get Dapi cells statistical morphological data e.g. area,  solidity,  extent etc..
getDapiCellsMorphStatData = () => { 

       let dapiMorphStatFileName = getDapiMorphStatFileName();
       let itemFeaturesFolder = getItemFeaturesLocalPath();

       let boundariesFileName = getItemBoundariesFileName();
       let boundariesFolder = getBoundariesLocalPath();   

       let morphFeatureNamesArr = cellMorphFeatureList.map(entry => {
                            return entry.morphFeature
                        })

       let allMorphDataResoponse = [];
     
       webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +  "/createDapiCellsMorphStatData",
        "&dapi_morph_stats_file=" + dapiMorphStatFileName + "&item_features_folder=" + itemFeaturesFolder +
        "&morph_feature_names_arr=" + JSON.stringify(morphFeatureNamesArr) +
        "&boundaries_file=" + boundariesFileName+ "&boundaries_folder=" + boundariesFolder, function(response) {

             allMorphDataResoponse = JSON.parse(response);
      });

     return allMorphDataResoponse;
}


getAllSpxTilesFeature = () => { 

       let groupData = []; 
       let curGroup = getSelectedGroup();
       let numOfFrames = curGroup.Channels.length;
       let apiUrl = getHostApi();
       let apiKey = getApiKey(); 
       let itemId = getSelectedItemId();
 
       // e.g. "Structural Components__markers_morphology.csv" 
       let markersMorphFileName =  getGrpMarkersMorphFileName();
       let featuresFileName = getGrpFeaturesFileName();
       let featuresFolder = getGrpFeaturesLocalPath();

       // For boxplot data file and location
       // let boxplotFileName = getGrpBoxplotFileName();
       // let boxplotFolder = getGrpBoxplotLocalPath();

       let boundariesFileName = getItemBoundariesFileName();
       let boundariesFolder = getBoundariesLocalPath();       

       let allFeaturesResoponse = [];
       

       for(let k = 0; k < numOfFrames; k++) {  //top frame has k = numOfFrames-1
          groupData.push({ "OSDLayer": k, "frameName": curGroup.Channels[k], "frameNum": curGroup.Numbers[k]});
       }
     
       webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +  "/createAllSpxTilesFeature","baseUrl=" + apiUrl + 
        "&apiKey=" + apiKey + "&itemId=" + itemId + "&grp_data=" + JSON.stringify(groupData) +
        "&features_file=" + featuresFileName+ "&features_folder=" + featuresFolder + "&markers_morph_file=" + markersMorphFileName +
        "&cellFeatureToNormalize=" + Opts.cellFeatureToNormalize +  
        "&isChannelNormalizeRequired=" + Opts.isChannelNormalizeRequired + 
        // "&boxplot_file=" + boxplotFileName+ "&boxplot_folder=" + boxplotFolder + "&neglect_zero=" + Opts.boxplotForAboveZeroPixels + 
        "&boundaries_file=" + boundariesFileName+ "&boundaries_folder=" + boundariesFolder, function(response) {

             allFeaturesResoponse = JSON.parse(response);
      });

     return allFeaturesResoponse;

}

getAllGridTilesFeature = () => { 
       let groupData = []; 
       let curGroup = getSelectedGroup();
       let numOfFrames = curGroup.Channels.length;
       let apiUrl = getHostApi();
       let apiKey = getApiKey(); 
       let itemId = getSelectedItemId();

       let featuresFileName = getGrpFeaturesFileName();
       let featuresFolder = getGrpFeaturesLocalPath();

       // For boxplot data file and location
       let boxplotFileName = getGrpBoxplotFileName();
       let boxplotFolder = getGrpBoxplotLocalPath();
  
       let gridSize = getGridSize();


       let allFeaturesResoponse = [];
       

       for(let k = 0; k < numOfFrames; k++) {  //top frame has k = numOfFrames-1
          groupData.push({ "OSDLayer": k, "frameName": curGroup.Channels[k], "frameNum": curGroup.Numbers[k]});
       }
     
       webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +  "/createAllGridTilesFeature","baseUrl=" + apiUrl + 
        "&apiKey=" + apiKey + "&itemId=" + itemId + "&grp_data=" + JSON.stringify(groupData) +
        "&features_file=" + featuresFileName+ "&features_folder=" + featuresFolder + 
        // "&boxplot_file=" + boxplotFileName+ "&boxplot_folder=" + boxplotFolder + "&neglect_zero=" + Opts.boxplotForAboveZeroPixels + 
        "&gridSize=" + gridSize, function(response) {

             allFeaturesResoponse = JSON.parse(response);
      });

     return allFeaturesResoponse;

}

getTileProp = (left_value, top_value, width_value, height_value) => { // Need only the top tile to find the grids cover all stack
     let tileProbData = []; 
     let curGroup = getSelectedGroup();
     let numOfFrames = curGroup.Channels.length;
     let apiUrl = getHostApi();
     let apiKey = getApiKey(); 
     let itemId = getSelectedItemId();
     

     for(let k = 0; k < numOfFrames; k++) {  //>>>>>>>>>>>   Top frame has k = numOfFrames-1   <<<<<<<<<<<<<<
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
             //   tileProbData.push({ "OSDLayer": k, "mean": hist['mean'], "max": hist['max'], "std": hist['stdev'], "Frame": curGroup.Channels[k] }) 
                  
          });

     }

    return tileProbData;

}


  requestChartOperationInfo = () => {
      let curOperationValue = document.getElementById("chartOperations").value;
      let operationEntry = chartOperationsList.filter( operation => operation.type === curOperationValue);
      triggerHint(operationEntry[0].description, "info", 7000);
  }

   getSelectedChartOperation = () => {
       return chartOptions.currentOperation;
   }

   onChangeChartOperation = () => {
       let curChartOperation = document.getElementById("chartOperations").value;
       chartOptions.currentOperation = curChartOperation;
        switch ( curChartOperation){
             case 'Histogram':
                            {
                              // For future use
                              break;                 
                            }
             case 'Histogram-log1p(y)':
                            {
                              // For future use
                              break;                 
                            }                            
                           
             case 'Boxplot':
                            {
                              plotMarkersBoxPlots();
                              //triggerHint("To be Coded ..");
                              break;                
                            }
             case 'Phenotypes':
                            {
                              if( isSuperPixel() ) {

                                   if(isLocalFileExist( getGrpBoxplotFileName(), getGrpBoxplotLocalPath() )) {
                                        showLoadingIcon(() => {

                                                          if (! isGrpChannelsStatisticalDataAvailable() ) {
                                                              setGrpChannelsStatisticalData( readJsonFile(getGrpBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 
                                                          }

                                                          cellPhenotypes(() => {
                                                            hideLoadingIcon();  
                                                            if(allValidePhenotypes.length) {
                                                                  // drawCellPhenotypes3dCylinder(allValidePhenotypes); 
                                                                   drawCellPhenotypes3dColumnChart(allValidePhenotypes);  
                                                                 //  drawCellPhenotypesColumnChart(allValidePhenotypes);                                                            
                                                                 //drawCellPhenotypes3dPieChart(allValidePhenotypes);
                                                                 // drawCellPhenotypesPieGradientChart(allValidePhenotypes);
                                                            } 
                                                          });
                                                     
                                                        })                                        


 
                                   // }

                                   // if ( isGrpChannelsStatisticalDataAvailable() ) { // read it before with ploting Boxplot for example
                                   //      cellPhenotypes();
                                   // } else if(isLocalFileExist( getGrpBoxplotFileName(), getGrpBoxplotLocalPath() )) { 
                                   //             // load the data       
                                   //             setGrpChannelsStatisticalData( readJsonFile(getGrpBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 
                                   //             cellPhenotypes();
                                   } else {

                                    triggerHint("Cell phenotypes need calculating markers boxplot data first, do you want to calculate them?  " + 
                                        '<a href="javascript:void(0)" onclick="calculateMarkerBoxplots(false)">[<b><font color="green">Yes</font></b>]</a>' + 
                                        '<a href="javascript:void(0)" onclick="closeHint()">[<b><font color="red">No</font></b>]</a>', "error", 10000);
                                   }



                              } else {
                                 triggerHint(" Grid boundaries have not phenotypes, change boundaries to spx, ..");
                              }
                              break;
                            }  
              case 'Cluster':
                            {
                              triggerHint("To be Coded ..");
                              break;             
                            }                                    
        }  
   }


  //  chart operations e.g. Histogram, boxplot
  initChartOperationsList = () => { 
      let nodes =        '<select name="chartOperations" style="width:70%;" id="chartOperations" onchange="onChangeChartOperation()" disabled>';
      // nodes +=           '<optgroup style="font-size:0.32vw"">';

      chartOperationsList.forEach((operation, idx) => {

          if(operation.type === chartOptions.defaultOperation) {
              nodes +=    `<option value=${operation.type} selected>${operation.type}</option>`;        
          } else {
              nodes +=    `<option value=${operation.type}>${operation.type}</option>`;  
          }
      });

      // nodes +=         '</optgroup>'; 
      nodes +=         '</select>'; 
      nodes +=         '&nbsp&nbsp<a  href="javascript:void(0)" onclick="requestChartOperationInfo()"><i style="font-size:1vw;"    class="fa fa-info-circle"></i></a>'

      document.getElementById("chartOperationsTableSpace").innerHTML = nodes;

      if( isFeaturesLoaded() ) { 
         freezeInput("chartOperations", false);
      }       
  } 

 // To create features  dynamically //
  initBarChartSettings = () => {                       //<<<<<<<<<<<<-------------------  Future use
     // To create features checkboxes dynamically 
      for(let n = 0; n < featureKeys.length; n++) {
            if(n >= 3) { // means there is more than 3 different features 
                      let randNum= Math.floor(Math.random() * 20);
                      let randColor = d3.schemeCategory20[randNum % 20];
                      chartOptions.histogram.bgColor.push(randColor);
            }
      }

  }

 // clear the content of any drawing on the panel (e.g. tile histogram) 
 clearChPlotsPanelCanvas = () => {
    let canvas =  document.getElementById("chartDrawCanvas");
    let ctx =  canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 }

 resetChartFirstAppearFlag = () => {
    chartOptions.isFirstAppear = true;
 }

 // reset chart canvas when mouse move out 
 destroyChart = () => {

    if(chartOptions.defaultLibrary == "highcharts") {

        if(chartOptions.container){
            chartOptions.container.destroy();
            chartOptions.container = null;
         }
    }

    if(chartOptions.defaultLibrary == "chartjs") {

        if(chartOptions.canvas){
            chartOptions.canvas.destroy();
            chartOptions.canvas = null;
         }
    } 

    resetChartFirstAppearFlag(); 
 }

 resetChartPlottingData = () => {

    if(chartOptions.defaultLibrary == "highcharts") {
       let zeroArray = Array.apply(null, new Array( getCurGrpNumOfChannels() )).map(Number.prototype.valueOf,0);
       let updatedSeries = chartOptions.container.series.map( serie => {
            return {
                    name: serie.name,
                    color: serie.color,
                    data: zeroArray
            }
        })

      chartOptions.container.update({series: updatedSeries}); //true / false to redraw  
      chartOptions.container.redraw();   
        // for (let i = chartOptions.container.series.length-1; i >= 0; i--) {
        //     // chartOptions.container.series[i].remove();
        //     chartOptions.container.series[i].update({data: [0,0,0,0,0]});
        //     // chartOptions.container.series[i].update({data: []});
        // }      


    }   

    if(chartOptions.defaultLibrary == "chartjs") {
        chartOptions.canvas.data.datasets = chartOptions.canvas.data.datasets.map( dataset => {
            return {
                    label: dataset.label,
                    backgroundColor: dataset.backgroundColor,
                    data: []
            }
        })
        // chartOptions.canvas.data.datasets = noValueDatasets;
        chartOptions.canvas.update();
    }    
 } 


//---------------------- Phenotype Chart Column 3d  ----------------------------//
drawCellPhenotypes3dCylinder = (chartData) => {

    if(chartOptions.animation) {
      chartOptions.animation = {duration: chartOptions.animationDuration};
    } 

    if(chartOptions.defaultLibrary == "highcharts") {



            //e.g allValidePhenotypes.push({binary: binaryMarkersString, valideCells: allValideCells, 
            //                           totalValideCellsNum: allValideCells.length, phenotypeColor: null });

          let seriesToPlot = [];

          for(let i = 0; i < chartData.length; i++) {
               seriesToPlot.push({name: chartData[i].binary, data: [chartData[i].totalValideCellsNum*100/getTotalTilesNum()],  color: chartData[i].phenotypeColor});
          }     

 

           Highcharts.chart('chartContainer', {

                    chart: {
                        type: 'cylinder',

                        options3d: {
                            enabled: true,
                            alpha: 15,
                            beta: 15,
                            depth: 50,
                            viewDistance: 25
                        }
                    },
                    title: {
                        text: ''
                    },
                    plotOptions: {
                        series: {
                            depth: 25,
                            colorByPoint: true
                        }
                    },
                    series: [{
                        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                        name: 'Cylinders',
                        showInLegend: false
                    }]

        });          
    }  
}

//---------------------- Phenotype Chart Column 3d  ----------------------------//
drawCellPhenotypes3dColumnChart = (chartData) => {

    if(chartOptions.animation) {
      chartOptions.animation = {duration: chartOptions.animationDuration};
    } 

    if(chartOptions.defaultLibrary == "highcharts") {

          Highcharts.setOptions({
              plotOptions: {
                  series: {
                      animation: chartOptions.animation,
                      // borderColor: '#303030'
                      borderWidth: 0  // bar border, default is 1 and white
                  }
              }
          });   

            //e.g allValidePhenotypes.push({binary: binaryMarkersString, valideCells: allValideCells, 
            //                           totalValideCellsNum: allValideCells.length, phenotypeColor: null });

          let seriesToPlot = [];

          for(let i = 0; i < chartData.length; i++) {
               seriesToPlot.push({name: chartData[i].binary, data: [chartData[i].totalValideCellsNum*100/getTotalTilesNum()],  color: chartData[i].phenotypeColor});
          }     

          console.log( " series To plot : ", seriesToPlot)   

           Highcharts.chart('chartContainer', {

                    chart: {
                        type: 'column',
                        backgroundColor: chartOptions.backgroundColor,
                        height: '80%',
                        options3d: {
                            enabled: true,
                            alpha: 10,
                            beta: 25,
                            depth: 70
                        }                        
                    },
                    title: {
                        text: ''
                    },
                    legend: {
                        align: 'center',  // left, right
                        verticalAlign: 'top',  // top, middle or bottom
                        layout: 'horizontal',  //horizontal , proximate, vertical
                        enabled:false,
                        itemStyle: {
                            color: 'white',
                            fontWeight: 'bold'
                        }
                    },  

                    plotOptions: {
                        column: {
                            depth: 45
                        }
                    },  
                                        
                    xAxis: {
                        categories: ['Phenotypes'],
                        crosshair: true,
                        labels: {
                            skew3d: true,
                            style: {
                                color: chartOptions.xAxisTicksColor,
                                fontWeight: chartOptions.axisFontWeight,                              
                                fontSize: '16px'
                            }
                        }                        
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '(%)',
                           style: {
                              color: chartOptions.yAxisTicksColor,
                              fontWeight: chartOptions.axisFontWeight
                          }                            
                        },
                        labels: {
                            style: {
                                color: chartOptions.yAxisTicksColor,
                                fontWeight: chartOptions.axisFontWeight
                            }
                       }  
                    },
                    // tooltip: {
                    //     headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    //     pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    //         '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                    //     footerFormat: '</table>',
                    //     shared: true,
                    //     useHTML: true
                    // },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: seriesToPlot

        });          
    }  
}

//---------------------- Phenotype Chart Column  ----------------------------//
drawCellPhenotypesColumnChart = (chartData) => {

    if(chartOptions.animation) {
      chartOptions.animation = {duration: chartOptions.animationDuration};
    } 

    if(chartOptions.defaultLibrary == "highcharts") {

          Highcharts.setOptions({
              plotOptions: {
                  series: {
                      animation: chartOptions.animation,
                      // borderColor: '#303030'
                      borderWidth: 0  // bar border, default is 1 and white
                  }
              }
          });   

            //e.g allValidePhenotypes.push({binary: binaryMarkersString, valideCells: allValideCells, 
            //                           totalValideCellsNum: allValideCells.length, phenotypeColor: null });

          let seriesToPlot = [];

          for(let i = 0; i < chartData.length; i++) {
               seriesToPlot.push({name: chartData[i].binary, data: [chartData[i].totalValideCellsNum*100/getTotalTilesNum()],  color: chartData[i].phenotypeColor});
          }     

          console.log( " series To plot : ", seriesToPlot)   

          Highcharts.chart('chartContainer', {

                    chart: {
                        type: 'column',
                        backgroundColor: chartOptions.backgroundColor,
                        height: '70%',
                    },
                    title: {
                        text: ''
                    },
                    legend: {
                        align: 'center',  // left, right
                        verticalAlign: 'top',  // top, middle or bottom
                        layout: 'horizontal',  //horizontal , proximate, vertical
                        itemStyle: {
                            color: 'white',
                            fontWeight: 'bold'
                        }
                    },    
                    xAxis: {
                        categories: [
                            'Phenotypes'
                        ],
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '(%)'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: seriesToPlot

        });          
    }  
}

//---------------------- Phenotype Chart 3D Pie  ----------------------------//
drawCellPhenotypes3dPieChart = (chartData) => {

    if(chartOptions.animation) {
      chartOptions.animation = {duration: chartOptions.animationDuration};
    } 

    if(chartOptions.defaultLibrary == "highcharts") {

          // Highcharts.setOptions({
          //     plotOptions: {
          //         series: {
          //             animation: chartOptions.animation,
          //             // borderColor: '#303030'
          //             borderWidth: 0  // bar border, default is 1 and white
          //         }
          //     }
          // });   

//e.g allValidePhenotypes.push({binary: binaryMarkersString, valideCells: allValideCells, 
//                           totalValideCellsNum: allValideCells.length, phenotypeColor: null });

          let seriesToPlot = [];

          for(let i = 0; i < chartData.length; i++) {
               seriesToPlot.push({name: chartData[i].binary, y: chartData[i].totalValideCellsNum*100/getTotalTilesNum(),  color: chartData[i].phenotypeColor});
          }        

          Highcharts.chart('chartContainer', {

                             chart: {
                                    type: 'pie',
                                    backgroundColor: chartOptions.backgroundColor,
                                    height: '70%',
                                    options3d: {
                                        enabled: true,
                                        alpha: 45,
                                        beta: 0
                                    }
                                },
                                title: {
                                    text: ''
                                },
                                accessibility: {
                                    point: {
                                        valueSuffix: '%'
                                    }
                                },
                                tooltip: {
                                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                },
                                plotOptions: {
                                    pie: {
                                        allowPointSelect: true,
                                        cursor: 'pointer',
                                        depth: 25,
                                        dataLabels: {
                                            enabled: true,
                                            color: 'rgba(255,255,255)',
                                            format: '{point.name}'
                                        }
                                    }
                                },
                                series: [{
                                    type: 'pie',
                                    name: 'Browser share',
                                    data: seriesToPlot 
                                }]
        });          
    }  
}

//---------------------- Phenotype Chart Pie with gradient fill  ----------------------------//
drawCellPhenotypesPieGradientChart = (chartData) => {

    if(chartOptions.animation) {
      chartOptions.animation = {duration: chartOptions.animationDuration};
    } 

    if(chartOptions.defaultLibrary == "highcharts") {

          // Radialize the colors
          Highcharts.setOptions({
              colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
                  return {
                      radialGradient: {
                          cx: 0.5,
                          cy: 0.3,
                          r: 0.7
                      },
                      stops: [
                          [0, color],
                          [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
                      ]
                  };
              })
          });   

//e.g allValidePhenotypes.push({binary: binaryMarkersString, valideCells: allValideCells, 
//                           totalValideCellsNum: allValideCells.length, phenotypeColor: null });

          let seriesToPlot = [];

          for(let i = 0; i < chartData.length; i++) {
               seriesToPlot.push({name: chartData[i].binary, y: chartData[i].totalValideCellsNum*100/getTotalTilesNum(),  color: chartData[i].phenotypeColor});
          }        

          Highcharts.chart('chartContainer', {
                        chart: {
                            plotBackgroundColor: chartOptions.backgroundColor,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie',
                            height: '80%'
                        },
                        title: {
                            text: ''
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        accessibility: {
                            point: {
                                valueSuffix: '%'
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    color: 'rgba(255,255,255)',
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    connectorColor: 'silver'
                                }
                            }
                        },
                        series: [{
                            name: 'Share',
                            data: seriesToPlot
                        }]
                    });        
    }  
}



//---------------------- BoxPlot ----------------------------//
drawMarkersBoxPlotChart = (chartData) => {

    if(chartOptions.animation) {
      chartOptions.animation = {duration: chartOptions.animationDuration};
    } 

    if(chartOptions.defaultLibrary == "highcharts") {

          Highcharts.setOptions({
              plotOptions: {
                  series: {
                      animation: chartOptions.animation,
                      // borderColor: '#303030'
                      borderWidth: 0  // bar border, default is 1 and white
                  }
              }
          });   


          let seriesToPlot = [];

          for(let i = 0; i < chartOptions.histogram.keys.length; i++) {
              let feature = chartOptions.histogram.keys[i]; // feature: mean, max, std
              seriesToPlot.push({name: feature, color: chartOptions.histogram.bgColor[i], data: chartData[feature] });
          }        

          chartOptions.container = Highcharts.chart('chartContainer', {

                  chart: {
                      type: 'boxplot',
                      backgroundColor: chartOptions.backgroundColor,
                      height: '70%'
                  },

                  title: {
                      text: ''
                  },

                  legend: {
                      enabled: false
                  },              


                  xAxis: {
                      //lineColor: '#FF0000',
                      //categories: ['CD45', 'IBA1', 'KERATIN', 'ASMA', 'DNA'],
                      categories: chartData.channelNames,
                      labels: {
                          rotation: -45,
                          x: -10,
                          style: {
                              color: chartOptions.xAxisTicksColor,
                              fontWeight: chartOptions.axisFontWeight
                          }
                      }
                  },

                  yAxis: {
                      allowDecimals: false,
                      gridLineWidth: 0,
                      max: chartOptions.histogram.rangeValues.max,
                      min: chartOptions.histogram.rangeValues.min,
                      tickInterval: chartOptions.histogram.rangeValues.stepSize,
                      // lineColor: '#FF0000',
                      // lineWidth: 1,                  
                      title: {
                          text: 'Intensity' // null
                      },
                      labels: {
                          style: {
                              color: chartOptions.yAxisTicksColor,
                              fontWeight: chartOptions.axisFontWeight
                          } 
                      }  
                       // top: '0',
                       // height: '50px',
                      // tickInterval: 100,
                      // offset: 0                          
                  },

                  // series: seriesToPlot,
                  series: [
                   {
                      name: '',
                      data: chartData.boxplots,
                      tooltip: {
                               headerFormat: '<em>Marker {point.key}</em><br/>'
                              }
                   }],

                  exporting: { // to show/hide chart context menu on the right
                      enabled: true
                  },


                  responsive: {
                      rules: [{
                          condition: {
                              maxWidth: 500
                          },
                          chartOptions: {
                              yAxis: {

                                  labels: {
                                      align: 'left',

                                       x: 0
                                       // y: -5
                                  },
                                  title: {
                                      text: null
                                  }
                              }

                          }
                      }]
                  }
          });          

    }  

}



//---------------------------------------------------------//
//  chartData = { labels: [], mean: [], max: [], std: []};
 drawMarkersHistogramChart = (chartData, logFlag = false) => {

    if(chartOptions.animation) {
      chartOptions.animation = {duration: chartOptions.animationDuration};
    } 

    if(chartOptions.defaultLibrary == "highcharts") {

          Highcharts.setOptions({
              plotOptions: {
                  series: {
                      animation: chartOptions.animation,
                      // borderColor: '#303030'
                      borderWidth: 0  // bar border, default is 1 and white
                  }
              }
          });   


          let yMaxRange =  chartOptions.histogram.rangeValues.max;
          let yTickInterval = chartOptions.histogram.rangeValues.stepSize;
          let yAxisText =  'Not-log';
          // If yAxis values in log10 is true
          if(logFlag) {          
            yMaxRange = Math.ceil(Math.log1p(chartOptions.histogram.rangeValues.max));
            yTickInterval = Math.ceil( Math.log1p(chartOptions.histogram.rangeValues.stepSize));
            yAxisText = 'log';
          }  

          let seriesToPlot = [];

          for(let i = 0; i < chartOptions.histogram.keys.length; i++) {
              let feature = chartOptions.histogram.keys[i]; // feature: mean, max, std
              // if Y axis needs to be in log
              seriesToPlot.push({name: feature, color: chartOptions.histogram.bgColor[i], data: chartData[feature] });
          }        

          // console.log("series ", seriesToPlot);

          if(logFlag) { 
                seriesToPlot.forEach(entry =>{
                     entry.data = entry.data.map(value => { 
                            return Math.log1p(value); 
                      });
                })
          }
         
          // console.log("series ", seriesToPlot)


          chartOptions.container = Highcharts.chart('chartContainer', {

              chart: {
                  type: 'column',
                  backgroundColor: chartOptions.backgroundColor,
                  height: '70%'
              },

              title: {
                  text: ''
              },

              // subtitle: {
              //     text: 'Resize the frame or click buttons to change appearance'
              // },

              legend: {
                  align: 'center',  // left, right
                  verticalAlign: 'top',  // top, middle or bottom
                  layout: 'horizontal',  //horizontal , proximate, vertical
                  itemStyle: {
                      color: 'white',
                      fontWeight: 'bold'
                  }
              },

              xAxis: {
                  //lineColor: '#FF0000',
                  //categories: ['CD45', 'IBA1', 'KERATIN', 'ASMA', 'DNA'],
                  categories: chartData.channelNames,
                  labels: {
                      rotation: -45,
                      x: -10,
                      style: {
                          color: chartOptions.xAxisTicksColor,
                          fontWeight: chartOptions.axisFontWeight
                      }
                  }
              },

              yAxis: {
                  allowDecimals: false,
                  gridLineWidth: 0,
                  // max: chartOptions.histogram.rangeValues.max,
                  max: yMaxRange,
                  min: chartOptions.histogram.rangeValues.min,
                  tickInterval: yTickInterval,
                  // tickInterval: chartOptions.histogram.rangeValues.stepSize,
                  // lineColor: '#FF0000',
                  // lineWidth: 1,                  
                  title: {
                      text: yAxisText
                  },
                  labels: {
                      style: {
                          color: chartOptions.yAxisTicksColor,
                          fontWeight: chartOptions.axisFontWeight
                      } 
                  }  
                   // top: '0',
                   // height: '50px',
                  // tickInterval: 100,
                  // offset: 0                          
              },

              series: seriesToPlot,
              // series: [{
              //     name: chartOptions.histogram.keys[0],
              //     data: [10, 40, 30, 40, 30],
              //     color: chartOptions.histogram.bgColor[0]
              // }, {
              //     name: chartOptions.histogram.keys[1],
              //     data: [60, 40, 100, 40, 100],
              //     color: chartOptions.histogram.bgColor[1]
              // }, {
              //     name: chartOptions.histogram.keys[2],
              //     data: [80, 40, 30, 40, 30],
              //     color: chartOptions.histogram.bgColor[2]
              // }],

              exporting: { // to show/hide chart context menu on the right
                  enabled: true
              },


              responsive: {
                  rules: [{
                      condition: {
                          maxWidth: 500
                      },
                      chartOptions: {
                          legend: {
                              align: 'center',
                              verticalAlign: 'top',
                              layout: 'horizontal'
                          },
                          yAxis: {

                              labels: {
                                  align: 'left',

                                   x: 0
                                   // y: -5
                              },
                              title: {
                                  text: null
                              }
                          },
                          subtitle: {
                              text: null
                          },
                          credits: {
                              enabled: false
                          }
                      }
                  }]
              }
          });          



    }  

    if(chartOptions.defaultLibrary == "chartjs") {
            let ctx = document.getElementById("chartDrawCanvas").getContext("2d");
            // ctx.globalAlpha = 0.9;      
            let options = {
                barValueSpacing: 20,
                legend: {
                    labels: {  // Mean, Max and Std
                        fontColor: chartOptions.labelsColor
                        //fontSize: 18
                    }
                },  
                animation: chartOptions.animation,        
                // animation: { // in case true
                //     duration: 500,
                // },          
                scales: {
                  yAxes: [{
                    ticks: {
                      fontColor: chartOptions.yAxisTicksColor,
                      min: chartOptions.histogram.rangeValues.min,
                      max: chartOptions.histogram.rangeValues.max,
                      stepSize: chartOptions.histogram.rangeValues.stepSize
                    }
                  }],
                  xAxes: [{
                    ticks: {
                      fontColor: chartOptions.xAxisTicksColor
                    }
                  }]      
                }
              }

            let datasets = [];

            for(let i = 0; i < chartOptions.histogram.keys.length; i++) {
                let feature = chartOptions.histogram.keys[i]; // feature: mean, max, std
                datasets.push({label: feature, backgroundColor: chartOptions.histogram.bgColor[i], data: chartData[feature] });
                // chartOptions.noValuesDataset.push({label: feature, backgroundColor: chartOptions.histogram.bgColor[i], data: [] });
            }

            let data = {
              labels: chartData.channelNames,   //["DNA", "CD45", ..]
              datasets: datasets
              // datasets: [{
              //   label: "Mean",
              //   backgroundColor: 'rgba(42, 180, 192, 1)',
              //   data: chartData["mean"]
              // }, {
              //   label: "Max",
              //   backgroundColor: 'rgba(76, 135, 185, 1)',
              //   data: chartData["max"]
              // }, {
              //   label: "Std",
              //   backgroundColor: 'rgba(243, 82, 58, 1)',
              //   data: chartData["std"]
              // }]
            };

            if(!chartOptions.canvas){ // to fix chart bars disturbance when hover on CHNL PLOTS
                chartOptions.canvas = new Chart(ctx, {
                  type: 'bar',
                  data: data,
                  options: options
                });
            } else { 
               chartOptions.canvas.data = data;
               chartOptions.canvas.update();

            }
    }
}

plotTileMarkersHistogram = (left_value, top_value, width_value, height_value, obj, logFlag = false) => { //logFlag -> yAxis data log1p
     let features = [];
 
     if( isFeaturesLoaded() ) {
           let tile = findObjectByKeyValue(allTilesFeatures, 'id', d3.select(obj).attr('id'));
           features = tile.features;
           let chartData = {channelNames: []}; // channelNames will have frame names

           for(let i = 0; i < featureKeys.length; i++) {
               chartData[featureKeys[i]] = [];
            }

           //  chartData = { labels: [], mean: [], max: [], std: []};
           for(let n = 0; n < features.length; n++) {
                chartData.channelNames.push(features[n].Frame);

                for(let i = 0; i < featureKeys.length; i++) { 
                   chartData[featureKeys[i]].push(features[n][featureKeys[i]]);
                }
           }
           
           // console.log("chartData : ", chartData)
           drawMarkersHistogramChart(chartData, logFlag);

           if(! isPanelActive("chPlotsPanel") && chartOptions.isFirstAppear) {    
              togglePanel(chPlotsPanel);
              chartOptions.isFirstAppear = false;
           } 
           
      } else {

            if( isPanelActive("chPlotsPanel") ){    
                destroyChart();
                togglePanel(chPlotsPanel);
                triggerHint("No features found, create features from Features menu","info", 5000);
             }          

     }         
}


// plotTileMarkersHistogram_V0 = (left_value, top_value, width_value, height_value, obj) => {
 
//      if( allTilesFeatures.length == 0) 
//       {
//           let featureDataToPlot = getTileProp(left_value, top_value, width_value, height_value);
          
//           featureDataToPlot.push(temp)
              

//       } else {
//                let tile = findObjectByKeyValue(allTilesFeatures, 'id', d3.select(obj).attr('id'));
//                let chartData = {channelNames: []}; // channelNames will have frame names

//                for(let i = 0; i < featureKeys.length; i++){
//                    chartData[featureKeys[i]] = [];
//                 }

//                //  chartData = { labels: [], mean: [], max: [], std: []};
//                for(let n = 0; n < tile.features.length; n++){

//                     chartData.channelNames.push(tile.features[n].Frame);

//                     for(let i = 0; i < featureKeys.length; i++){
//                        chartData[featureKeys[i]].push(tile.features[n][featureKeys[i]]);
//                     }
                    
//                     // chartData.meanData.push(tile.features[n].mean);
//                     // chartData.maxData.push(tile.features[n].max);
//                     // chartData.stdData.push(tile.features[n].std);
//                }



//                drawMarkersHistogramChart(chartData);

//       }


// }

//  This function can be used with Boxplot option (plotFlag = true ) and Phenotypes option (plotFlag = false)
calculateMarkerBoxplots = (plotFlag = true) => {
    webix.message("Wait Markers boxplot data to be calculated");
    triggerHint("Wait Markers boxplot data to be calculated","info", 10000);
    
    let boxplotData = createChannelsStatisticalData();

    if(boxplotData == "Failed") {
         triggerHint("Calculate makers boxplots Failed, image channel can not covert to gray.. ", "error", 5000);
         return 0;
    }  

    if(boxplotData.length ) {
        setGrpChannelsStatisticalData(boxplotData);
        webix.message("Markers boxplot data calculated successfully");
        if(plotFlag){// if calculateMarkerBoxplots used with Phenotypes, the plotFlag will be false
           plotMarkersBoxPlots();
        }
    }

}

setGrpChannelsStatisticalData = (data) => {
       grpChannelsStatisticalData = data;
}

getGrpChannelsStatisticalData = () => {
     return  grpChannelsStatisticalData.length ? grpChannelsStatisticalData : null;
}

isGrpChannelsStatisticalDataAvailable =() => {
     return  grpChannelsStatisticalData.length ? true : false;

         
}

resetGrpChannelsStatisticalData = () => {
       grpChannelsStatisticalData = [];
}

// TEST = () => {                 <<<<<<<<<<<<<<<<<<<<<<-----------
//       let test = []
//        webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +  "/TEST", function(response) {
//              test = JSON.parse(response);
//       });
//      return test != "notExist" ? test : [] ;
// }

//  calculate channel mean, max, min, std, median, q1, q3 
createChannelsStatisticalData = () => {
       let groupData = []; 
       let curGroup = getSelectedGroup();
       let numOfFrames = curGroup.Channels.length;
       let apiUrl = getHostApi();
       let apiKey = getApiKey(); 
       let itemId = getSelectedItemId();

       // For boxplot data file and location
       let boxplotFileName = getGrpBoxplotFileName();
       let boxplotFolder = getGrpBoxplotLocalPath();

       let boxplotData = [];

       for(let k = 0; k < numOfFrames; k++) {  //top frame has k = numOfFrames-1
          groupData.push({ "OSDLayer": k, "frameName": curGroup.Channels[k], "frameNum": curGroup.Numbers[k]});
       }
     
       webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +  "/createChannelsStatisticalData","baseUrl=" + apiUrl + 
        "&apiKey=" + apiKey + "&itemId=" + itemId + "&grp_data=" + JSON.stringify(groupData) + 
        "&neglect_zero=" + Opts.boxplotForAboveZeroPixels + "&isChannelNormalizeRequired=" + Opts.isBoxplotChNormalizeRequired + 
        "&boxplot_file=" + boxplotFileName + "&boxplot_folder=" + boxplotFolder, function(response) {

             boxplotData = JSON.parse(response);
      });

    // boxplot sample data e.g. {Frame: 'CD45',   OSDLayer: 0,   channelNum: 22,   max: 255.0,   mean: 5.174311939678205, 
    //                           median: 3.0,   min: 0.0, q1: 1.0,   q3: 8.0,   std: 5.5190755543079115}

     return boxplotData;

}

//For each channel, plot the marker of this channel low, q1, median, q3 and high values
plotMarkersBoxPlots = () => {
      if( isLocalFileExist( getGrpBoxplotFileName(), getGrpBoxplotLocalPath() ) ) {     
           if (! isGrpChannelsStatisticalDataAvailable() ) {
           // load the data       
           grpChannelsStatisticalData = readJsonFile(getGrpBoxplotFileName(), getGrpBoxplotLocalPath() );  
           }
           
           let chartData = {channelNames: [], boxplots:[]}; // channelNames will have frame names

           chartData.boxplots = grpChannelsStatisticalData.map(chnlData => {
                    return [ chnlData.min, chnlData.q1, chnlData.median, chnlData.q3, chnlData.max]
           })

            //  e.g. chartData.channelNames = [ "CD45", "IBA1", "KERATIN", "ASMA", "DNA 1" ]
           chartData.channelNames = grpChannelsStatisticalData.map(chnlData => chnlData.Frame)                 


           drawMarkersBoxPlotChart(chartData);


      } else {
          // In case using createTilesFeature.allTilesAtOnce = false, to create tileByTile features
          triggerHint("No markers boxplot data found, do you want to calculate them?  " + 
              '<a href="javascript:void(0)" onclick="calculateMarkerBoxplots()">[<b><font color="green">Yes</font></b>]</a>' + 
              '<a href="javascript:void(0)" onclick="closeHint()">[<b><font color="red">No</font></b>]</a>', "error", 10000);
      }



}

/////////////////////////// Tile Mouse events  ///////////////////////////////////////

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
     
    
  
    // if( !isSuperPixel() ){
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
         } else if((prevTileId == null) && (! isFeaturesLoaded()) ){
                  triggerHint(" No features found for selected tile, create features from Features menu", "info", 5000);
         }

         setLastSelectedTileId( curTile.attr('id') );
         
    // }   
       
    
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
                         // xcent: this.attributes.Xcentroid.nodeValue, ycent:this.attributes.Ycentroid.nodeValue,
                         left: bbox['left'], top: bbox['top'], width: bbox['width'], height:bbox['height']});
    }

    if( isFeaturesLoaded() ){ 
       freezeInput("findSimilarTileBtn", false);
       document.getElementById("curRoiFont").innerHTML = getSelectedTileId();
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
    if( isBoundariesLoaded() ){
       document.getElementById("currentTile").innerHTML = "Total Tiles : " + getTotalTilesNum();
    } else {
       document.getElementById("currentTile").innerHTML = "";
    } 
    
    if( isFeaturesLoaded() ){ 
      resetChartPlottingData();
    }

}
///////////////////////////////////////////////////
function handleMouseOver (d, i) { // Add interactivity

  let tileType  = getTileType();

  let index = findObjectByKeyValue(eval(tileType + "TilesLabel"), 'id', this.attributes.id.nodeValue, 'INDEX' ); // to check whether the entry exists or no..

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
    
    if( getSelectedChartOperation() == "Histogram"){    
          let bbox = find_bbox(this);    // drawing is the shape flag 
          plotTileMarkersHistogram(bbox['left'], bbox['top'], bbox['width'], bbox['height'], this); 
     } else if(getSelectedChartOperation() == "Histogram-log1p(y)"){
          let bbox = find_bbox(this);    // drawing is the shape flag 
          plotTileMarkersHistogram(bbox['left'], bbox['top'], bbox['width'], bbox['height'], this, true); 

     }

}

///////////////////////////////////////////////////
function handleTileMouseLeave (d, i){

     if( isSimilarRegionBtnEnabled() ){      
         // d3.select(this).style('stroke', getStrokeColor());
         // d3.select(this).style('stroke-width', getStrokeWidth());
         // d3.select(this).style('stroke-opacity', getStrokeOpacity()); 
         if(d3.select(this).style('fill') == "rgb(255, 255, 255)") {
            d3.select(this).style('stroke', 'none');  
         } else {
            d3.select(this).style('stroke', Opts.similarTileStrokeColor);
         }

              // d3.selectAll(tileClass).style('fill', 'white');
              
              // d3.selectAll(tileClass).style('fill-opacity', 0.1); 

     } else {
         d3.select(this).style('stroke', getStrokeColor());
         d3.select(this).style('stroke-width', getStrokeWidth());
         d3.select(this).style('stroke-opacity', getStrokeOpacity());      

     }   

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
isFeaturesLoaded = () => {
   return allTilesFeatures.length ? true : false;
}

resetTileFeatures = () => {
    allTilesFeatures = [];
}

getGrpFeaturesData = () => {
 // to be coded    
}

isBoundariesLoaded = () => {
    return d3.selectAll( getClassType() )._groups[0].length ? true : false; 
}

getTotalTilesNum = () => {
    return  d3.selectAll( getClassType() )._groups[0].length; 
}

zoomToTile = (obj) => {
    // console.log(obj)
    var obj_bbox = find_bbox(obj);
    var zoomArea = viewer.viewport.imageToViewportRectangle(obj_bbox['left'], obj_bbox['top'], obj_bbox['width'], obj_bbox['height']);
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
     let tileId = isSuperPixel() ? 'spx-' + tileToFind : 'grid-' + tileToFind;
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
initBoundariesFeatures = () => {
      let featuresLoadedFlag = false;

      if( isLocalFileExist( getGrpFeaturesFileName(), getGrpFeaturesLocalPath()) ) {     
           // load the features       
           createLoadFeatures();       
         // document.getElementById("createLoadFeaturesBtn").disabled = true;
           if( isFeaturesLoaded() ) {
               freezeInput("createLoadFeaturesBtn", true); 
               featuresLoadedFlag = true;
           } else {
               freezeInput("createLoadFeaturesBtn", false);  
           }             

      } else { 
          if( isLocalFileExist( getGrpFeaturesTemporaryFileName(), getGrpFeaturesLocalPath()) ) { 
               document.getElementById("createLoadFeaturesBtn").innerHTML = "Resume";
               triggerHint("Incomplete features found, click Resume from Features menu", "info", 7000); // was 7000
          } else {           
              document.getElementById("createLoadFeaturesBtn").innerHTML = "Create";
              triggerHint("No features found, click Create features from Features menu", "info", 7000); // was 7000
          }
          
          // Enable features Create/Resume switch 
          if( !isFeaturesCreateBtnEnabled() ) {
             freezeInput("createLoadFeaturesBtn", false);
          }

      }

      return featuresLoadedFlag;
}
///////////////Grid initiaiton ///////////////////////////////

 initGridOverlay = () => {

          // d3.selectAll(".grid").remove();
          removeBoundaries();

          let tileWidth = getGridSize();
          let tileIndex = 0;
       
          let imageWidth =  currentItemInfo.width;
          let imageHeight =  currentItemInfo.height;
//          reformat_Grid_StringToDSA=[];      
     
          allGridSelection = [];
          GridTilesLabel = [];
          // allTilesFeatures = [];             <<<<<<<<<<<<<<<<<-----------
          // resetTileValues();
/*          $$("propChart2").clearAll();
          $$("SpxOpacity").enable()
          $$("createLoadFeatures").enable();
          $$("createLoadFeatures").enable();
          $$("findSPX").enable();      
*/              
          // $$("findSimilarTiles").enable();

          // updateStorageInfo();
          //if(isLocalFileExist(storageItemName + storageItemName_Ext + ".feat", dirPath) == "T"){

/*          if( isLocalFileExist( getGrpFeaturesFileName(), getGrpFeaturesLocalPath()) ){            
             createLoadFeatures();       
             // document.getElementById("createLoadFeaturesBtn").disabled = true;

          }else{
            document.getElementById("createLoadFeaturesBtn").innerHTML = "Create";
            triggerHint("No Grid features found, click Create features from Features menu", "info", 7000);

          }
*/
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
	                .on('contextmenu', function(d, i) { 
	                    if( !isSuperPixel() ) { 
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



  // Get the class of selected boundary type
  getClassType = () =>{
      return isSuperPixel() ? ".spx" : ".grid";
  }

  // Get tile type 
  getTileType = () =>{
      return isSuperPixel() ? "SPX" : "Grid";
  }

  getTileIdPrefix = () =>{
    return isSuperPixel() ? "spx-" : "grid-";
  }

 splitString = (string, size) => {     // https://gist.github.com/hendriklammers/5231994
        let re = new RegExp('.{1,' + size + '}', 'g');
        return string.match(re);
  }  

  estimateFeaturesCreationTime = () => {

  }

  saveFeatureDataLocally = (featuresData, fileName, dirLocalPath ) => {
       let saveSuccessFlag = true;   

        try {
            let jsonString_tilesFeatures = JSON.stringify(featuresData); // convet object to JSON string e.g. {id: 1} -> {"id": 1}
            let maxFileSize = 500000;  // to send it to flask and avoid javascript syntaxerror "the url is malformed "

            if(jsonString_tilesFeatures.length > maxFileSize) {
                let fileChunks = splitString(jsonString_tilesFeatures, maxFileSize);  // true means newline included

                for(let k = 0; k < fileChunks.length; k++) {
                    console.log("Save file part " + (k + 1) + "/" + fileChunks.length);
                     
                    if(k == 0) {
                        saveFeatures( fileName, dirLocalPath, fileChunks[k], "a", -1); // -1 flag for First chunk                   
                      }

                    if( ((k + 1) < fileChunks.length) && (k > 0) ) {
                        saveFeatures( fileName, dirLocalPath, fileChunks[k], "a", 0); // 0 flag for not First not last chunk  
                      
                      }

                    if( (k + 1) == fileChunks.length ) { 
                        saveFeatures( fileName, dirLocalPath, fileChunks[k], "a", 1);  // Set lastChunkFlag to 1, this is last chunk
                      }

                }
             } else {
               //    saveFeatures(StorageItemName,jsonString_tilesFeatures)
                   saveFeatures(fileName, dirLocalPath, jsonString_tilesFeatures);   // default writeMode = "w"
                   triggerHint("Saving Features locally in progress... ");  
             }

        } catch(err) {
            saveSuccessFlag = false;
            triggerHint("JSON.stringify can not convert big features file to string", "error");
        }

        return saveSuccessFlag;
  }

  isValidFeaturesData = (featuresData) =>{
      return (featuresData.length == getTotalTilesNum()) && featuresData.length ? true : false; 
  }


  createLoadFeatures = () => {
        //let fetchedFeatures = getFeatures( getGrpFeaturesFileName(), getGrpFeaturesLocalPath() );  <<<<<<<<<<--------
        allTilesFeatures = readJsonFile( getGrpFeaturesFileName(), getGrpFeaturesLocalPath() );

        
        // let currentTileId = getSelectedTileId();

        // resetTileFeatures();        <<<<<<<<<<<<<<<< ------------
        
        // if((fetchedFeatures == null) || ( fetchedFeatures == "notExist")) { 
        if(! allTilesFeatures.length ) {           
            //zoomSlideOut();
            viewerZoomHome(() => {                //  <<<<<<<<<<< ------------ enforce sync 
                               webix.message("Creating features in progress...")
                             })             

            // let isIncompleteFileExist = false;
            // let fetchedIncompletedFeatures = getFeatures( getGrpFeaturesTemporaryFileName(), getGrpFeaturesLocalPath() );
            allTilesFeatures = readJsonFile( getGrpFeaturesTemporaryFileName(), getGrpFeaturesLocalPath() );            
          
            // if((fetchedIncompletedFeatures != null) && ( fetchedIncompletedFeatures != "notExist")) { 
            //     allTilesFeatures = JSON.parse(fetchedIncompletedFeatures);
            //     isIncompleteFileExist = true;
            // }

            // backup plan in case it txt_allTilesFeatures failed to be created by json.strinify()
            triggerHint("Wait while creating channels mean, max, std, norm features file","info", 5000);
            let creationSuccessFlag = true;
            let fileChunksToSaveTemp = [];
            let maxFileSize = 500000;
            // let safeMargin = 2000;
            
            try {

                  if(Opts.createTilesFeature.allTilesAtOnce) {
                             
                                                // let bbox = find_bbox(this);
                                                // let curTileFeatures = getTileProp( bbox['left'], bbox['top'], bbox['width'], bbox['height']);

                                                if( isSuperPixel() ) {
                                                   allTilesFeatures = getAllSpxTilesFeature();
                                                } else {
                                                   allTilesFeatures = getAllGridTilesFeature();
                                                }

                                                if(allTilesFeatures == "Failed") {
                                                     triggerHint("Can not  convert image channels to gray image.. ", "error", 5000);
                                                     return 0;
                                                }
                  

                  } else { // create features tile by tile, time consuming and high time complexity
           
                      d3.selectAll(getClassType()).each(function(d) {

                          if( ! findObjectByKeyValue(allTilesFeatures, 'id', this.id) ) {  // check in case of resume features creation interrupted before
                                let bbox = find_bbox(this);
                                let curTileFeatures = getTileProp( bbox['left'], bbox['top'], bbox['width'], bbox['height']);


                                if( isSuperPixel() ) {
                                  // need to have function to convert to DSA format
                                   allTilesFeatures.push({id: this.id , coordinates: this.attributes.points, features: curTileFeatures});
                                   fileChunksToSaveTemp.push({id: this.id , coordinates: this.attributes.points, features: curTileFeatures});
                               //  allTilesFeatures.push({id:this.id , Frames: numOfFrames, features:curTileFeatures})
                                } else {
                                   allTilesFeatures.push({id: this.id, coordinates: bbox, features: curTileFeatures});
                                   fileChunksToSaveTemp.push({id: this.id, coordinates: bbox, features: curTileFeatures});
                                    // allTilesFeatures.push({id:this.id, gridSize:$$("tileSize").getValue(), Frames: numOfFrames, features:curTileFeatures})
                                }

                                // to save temp features file in case of interruption  
                                if(JSON.stringify(fileChunksToSaveTemp).length >= (maxFileSize - (JSON.stringify(fileChunksToSaveTemp[0]).length) * 2 ) ) {
                                   saveFeatures( getGrpFeaturesTemporaryFileName(), getGrpFeaturesLocalPath() , JSON.stringify(fileChunksToSaveTemp), "a", 0); 
                                   fileChunksToSaveTemp = [];
                                }



       

                              // if(isIncompleteFileExist) {
                              //   saveFeatures( getGrpFeaturesTemporaryFileName(), getGrpFeaturesLocalPath() , fileChunks[k], "a", 0); 

                              // } else if( allTilesFeatures.length == getTotalTilesNum() ){
                                  

                              // } else {
                              //   saveFeatures( fileName, dirLocalPath, fileChunks[k], "a", -1); 

                              // }
                          }

                       // if(this.id != currentTileId) {
                          d3.select(this).style('fill', Opts.defaultScanningFillColor);
                          d3.select(this).style('fill-opacity', Opts.defaultScanningFillOpacity);
                       // }

                      }) // end of d3.selectAll loop
                  
                    // Get All tiles at once //
              } 
          
          } catch(err) {
            creationSuccessFlag = false;
            console.error("Error during features creation:  ", err);
          }   

          // let isSavedLocally = false; 

          if(creationSuccessFlag) {
              let isSavedLocally = saveFeatureDataLocally(allTilesFeatures, getGrpFeaturesFileName(), getGrpFeaturesLocalPath() );
              alert("Features creation is completed");              

              if(isSavedLocally) {  

                  triggerHint("Successfully saved Features locally", "info", 5000); 
                  if( isLocalFileExist( getGrpFeaturesTemporaryFileName(), getGrpFeaturesLocalPath()) ) { 
                      removeLocalFile( getGrpFeaturesTemporaryFileName(), getGrpFeaturesLocalPath() );
                  }

              } else { 
                 triggerHint("Some or all features could not be saved, repeat create features ", "error", 10000); 
                 console.log("Some or all features could not be saved, repeat create features ");
                 // rmove corrupted file
                 removeLocalFile( getGrpFeaturesFileName(), getGrpFeaturesLocalPath() );
              }              

          } else {
              // saveFeatureDataLocally(allTilesFeatures, getGrpFeaturesTemporaryFileName(), getGrpFeaturesLocalPath() ); 
              if( isRestApiAvailable() ){
                  console.log("Try to resume features creation by clicking Create/Resume button again, ");
                  alert("Network error, check console (F12)."); 
                  triggerHint("Try to resume features creation by clicking Create/Resume button again","info", 5000); 
              } else {
                  console.log("RestApi flask is down, Try to restart it and resume features creation by clicking Create/Resume button again");
                  alert("Network error, check console (F12)."); 
                  triggerHint("RestApi flask is down, Try to restart it and resume features creation by clicking Create/Resume button again","info", 5000);
              }

              return 0; 
          } 




            // let errorFlag = false;   

            // try {
            //     txt_allTilesFeatures = JSON.stringify(allTilesFeatures);
            //     let maxFileSize = 500000;  // to send it to flask and avoid javascript syntaxerror "the url is malformed "

            //     if(txt_allTilesFeatures.length > maxFileSize)
            //     {
            //         let fileChunks = splitString(txt_allTilesFeatures, maxFileSize);  // true means newline included

            //         for(let k = 0; k < fileChunks.length; k++) {
            //             console.log("Save file part " + (k + 1) + "/" + fileChunks.length);
                         
            //             if(k == 0) {
            //                 saveFeatures( getGrpFeaturesFileName(), getGrpFeaturesLocalPath(), fileChunks[k], "a", -1); // First chunk                   
            //               }

            //             if( ((k + 1) < fileChunks.length) && (k > 0) ) {
            //                 saveFeatures( getGrpFeaturesFileName(), getGrpFeaturesLocalPath(), fileChunks[k], "a");
                          
            //               }

            //             if( (k + 1) == fileChunks.length ) { 
            //                 saveFeatures( getGrpFeaturesFileName(), getGrpFeaturesLocalPath(), fileChunks[k], "a", 1);  // Set lastChunkFlag to 1, this is last chunk
            //               }

            //         }
            //      } else {
            //        //    saveFeatures(StorageItemName,txt_allTilesFeatures)
            //            saveFeatures( getGrpFeaturesFileName(), getGrpFeaturesLocalPath(), txt_allTilesFeatures);
            //            triggerHint("Saving Features locally in progress... ");  
            //      }

            // } catch(err) {
            //     errorFlag = true;
            //     triggerHint("JSON.stringify can not convert big features file to string","error");
            // }


            
        //    freezeInput("createLoadFeaturesBtn", true);          <<<<<<<<<<<<----------

        } else { // end of if(fetchedFeatures==null)
              // if features exists locally 
              // allTilesFeatures = JSON.parse(fetchedFeatures);           <<<<<<<<<<< -------

              if(isValidFeaturesData(allTilesFeatures)) {
                  // webix.message(" local saved features loaded.. ");            <<<<<<<<<<<<<<<< ----------
                  triggerHint(" local saved features loaded.. ", "info");
         //         freezeInput("createLoadFeaturesBtn", true);  // disable create button         <<<<<<<<<<<<----------
                  
                //  $$("featuresCheckBoxes").enable();                               <<<<<<<<<<<<<<<<<----------------------------
                 // $$("similarityOptions").enable();                                   
               //  disableSimilarTilesBtn(false);
                  // freezeFeaturesControls(false);
              } 
        }  

        //check for dapi cells morphological statistical data e.g. area: min, max, "25%", "50%", "75%"
        dapiMorphStatisticalData = readJsonFile( getDapiMorphStatFileName(), getItemFeaturesLocalPath() );
        // dapiMorphStatisticalData is Object { area: {…}, eccentricity: {…}, extent: {…}, ..}
        //If dapi cells morphological statistical data file not exist, create them

        if(! Object.keys(dapiMorphStatisticalData).length) { 
             dapiMorphStatisticalData = getDapiCellsMorphStatData()
        } 

        // if loaded or created succesfully ...
        if(Object.keys(dapiMorphStatisticalData).length) {
             activateDapiCellsMorphOptionsList(dapiMorphStatisticalData);   
        }

} // end of function



showLoadingIcon = (callback) => {
     document.getElementById("loadingIcon").style.display = 'block';
     callback();
} 

hideLoadingIcon = () => {
     document.getElementById("loadingIcon").style.display = "none";
}


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
   
   resetTileValuesDependency = () => {
       document.getElementById("curRoiFont").innerHTML = "";
   }

   resetTileValues = () => {
        resetSelectedTile();
        resetLastSelectedTileId();
        resetRightClickedTile();
        resetTileValuesDependency();
        resetTileFeatures();
   }

})();    