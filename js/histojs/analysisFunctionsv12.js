/*!
=========================================================
* HistoJS Demo - v1.0.0
=========================================================

* Github:  https://github.com/Mmasoud1
* Description:  A user interface for whole slide image channel design and analysis. 
*               It is based on DSA as backbone server.
* 
*
* @author Mohamed Masoud <mmasoud2@outlook.com>

=========================================================



=========================================================
                      Analysis Mode
=========================================================*/

(function(){

    //--var curGroup = currentItemInfo.omeDataset.Groups[groupIndex];

    // "use strict";


    /**
     * Get selected group index
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     */

    getSelectedGrpIndex = () => {
        return lastItemSelectionStates.grpIndex != null ? lastItemSelectionStates.grpIndex : null;
    }


    /**
     * check if a group selected to enter the analysis phase
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     * @returns {boolean}     
     */

    isGrpSelected = () => {
        return lastItemSelectionStates.grpIndex != null ? true : false;
    } 

    ////////////////-- For Chart Operations --///////////////
    //Check if a group saved its Tumor-immune-Stromal selected channels
    /**
     * Check if a group saved its Tumor-immune-Stromal selected channels
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     * @returns {boolean}
     */     
    isGrpChannelsNameTypeExist = (grpIndex) => {
        return currentItemInfo.omeDataset.Groups[grpIndex].Channel_Types ? 
               ( currentItemInfo.omeDataset.Groups[grpIndex].Channel_Types.length ? true : false ) : false;
    } 



    /**
     * Get the type of channel names  if they are Tumor/Immune/Stromal etc
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     * @returns {Array} array of Objects 
     *
     * @example
     *
     * getGrpChannelsNameType( 1)
     *
     * // => [{"channel_name": "CD45", "channel_type" : "Immune"}, ...]
     */      

    getGrpChannelsNameType = (grpIndex) => {
        return isGrpChannelsNameTypeExist(grpIndex) ? 
               currentItemInfo.omeDataset.Groups[grpIndex].Channel_Types : null;    
    }

    /**
     * Set a value to the variable
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     */     

    setGrpChannelsNameType = (grpIndex, chnlNameType) => {
        currentItemInfo.omeDataset.Groups[grpIndex].Channel_Types = chnlNameType;    
    } 

    /**
     * Set the variable to null
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     */ 

    resetGrpChannelsNameType = (grpIndex) => {
        currentItemInfo.omeDataset.Groups[grpIndex].Channel_Types = null;    
    }         

    ///////////////////////////////

    /**
     * Check if Dapi channel selected during the design phase (i.e., channel grouping) 
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     * @returns {boolean}
     */        
    isDAPIChannelSelected = () => {
        return lastItemSelectionStates.DAPIChannelIndex != null ? true : false;
    }           

    setSelectedDAPIChannelIndex = (DAPIChannelIndex) => {
        lastItemSelectionStates.DAPIChannelIndex = DAPIChannelIndex;
    }

    /**
     * Get Dapi channel index
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     * @returns {number}
     */      

    getSelectedDAPIChannelIndex = () => {
        return lastItemSelectionStates.DAPIChannelIndex;
    }     

    /**
     * Get Dapi channel name
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     * @returns {String}
     */ 

    getSelectedDAPIChannelName = () => {
        return isDAPIChannelSelected() ? getDAPIChannelObj()[0].channel_name :  null;
    }    

    /**
     * Set the variable to null
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     */ 

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


   // e.g. "Structural Components_MarkerCells_Boxplot_Data.json"
   // used when Boxplot Data is cell based not channel based according to Opts.isBoxplotChannelBased false flag
   getGrpMarkerCellsBoxplotFileName = () => { // get the proposed name of the boxplot file 
           return isGrpSelected() ?   getSelectedGroupName()  + "_MarkerCells_Boxplot_Data.json" : null;                  
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



/**
 * 
 * 
 * @function
 * @memberof HistoJS
 * @since 1.0.0
 * @version 1.0.0
 */



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
                triggerHint("Select Group from Design Mode");
                return 0;
           }

  }

/**
 * 
 * 
 * @function
 * @memberof HistoJS
 * @since 1.0.0
 * @version 1.0.0
 */
  onCurGrpClick = () => {
        var curGroup = getSelectedGroup();
        setAllChannelsOpacity();
        reloadOSD(curGroup);
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


/**
 * 
 * 
 * @function
 * @memberof HistoJS
 * @since 1.0.0
 * @version 1.0.0
 */

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

/**
 * 
 * 
 * @function
 * @memberof HistoJS
 * @since 1.0.0
 * @version 1.0.0
 */

    initGrpInfo = () => { 

	      document.getElementById("currentGrpTitle").innerHTML = getItemRootName( getItemName().split(".")[0] ) + " Group:";

	   	  const curGroup = getSelectedGroup();
          const curGroupIndex = getSelectedGrpIndex();          
	      //return Object { Channels: (3) […], Colors: (3) […], Contrast_Max: (3) […], Contrast_Min: (3) […], Format: "jpg", Name: "Lymphocytes", Numbers: (3) […], Path: "0___DAPI 1---18___CD3D---35___CD20" }       	  
	   	  let node = "";
	      let item = currentHostCollectSelectionStates.item;
	      let tileSourceName = item.name.split(".")[0];

	      node  +=     '<li style="background-color: none" id="currentGrp">';
	      node  +=        `<a href="javascript:void(0)" onclick="onCurGrpClick()">`;
	      node  +=          `<font  style="font-size:0.62vw" id="curGrpFont">${curGroup.Name}</font>`;
	      node  +=         '</a>';
	      node  +=     '</li>';   

	      document.getElementById("currentGroup").innerHTML = node;

    } 


/*-----------------------------------------------------Left panel---------------------------------------------------*/
/*---------------------------------------------- Channel Option Section---------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------*/

    /**
     * 
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     */

   showHideAnalysisGrpChannels = () => {

          //Hide all channels of the group 
          if (document.getElementById("showHideAllGrpChls").className === "fa fa-eye") {
              resetAllChannelsOpacity();
          } else { //show all channels of the group
              setAllChannelsOpacity();
          }
   }

    /**
     * 
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     */

      toggleChannelOpacity = (elem) => {
         let index = elem.id.split('.')[1];

         if(elem.checked) {
           viewer.world.getItemAt(index).setOpacity(1);       
         }
         else {
           viewer.world.getItemAt(index).setOpacity(0);   
         }
      }


    /**
     * Future use
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     */
     
     onChOpacitySliderMouseover = (elem) => {
           //-- to be coded
     }

    /**
     * 
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     */
      onCellFilterSliderMouseover = (elem) => {
        // console.log(" tooltipElem ", tooltipElem)
        let channelOrFeatureName = elem.id.split('.')[1];
        // console.log(" elem.id ", elem.id)
        // updateInputTooltip_V2(getCellFilterSliderValue, `cellFilterValueTooltip.${channelName}`,  elem.id);
        document.getElementById(`cellFilterValueTooltip.${channelOrFeatureName}`).innerHTML = getCellFilterSliderValue(elem.id);

      }

   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */

    getCellFilterSliderValue = (elemId) => {
        // console.log("elemId", elemId);
        //id="cellFilterSlider.${idx}"
        return document.getElementById(elemId).value;
    }

    /**
     * Future use
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     */

	channelOpacityChanged = (elem) => {
        //-- to be coded
	}

   /**
    * Set the variable to null
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */     

    resetCellFilterDependencies = () => {
        allValidTiles = [];
        allValidPhenotypes = [];
        filteredValidPhenotypes = [];
        resetNavigatorValidCells();

    }

   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */    

   getNavigatorValue = () => {
      return cellFiltersAndPhenotypesStates.navigatorPointer;
   }

   /**
    * Set the variable to zero
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */     

   resetNavigatorValue = () => {
     cellFiltersAndPhenotypesStates.navigatorPointer = 0;
   }  

    /**
     * 
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     */

   setNavigatorValue = (val) => {
     cellFiltersAndPhenotypesStates.navigatorPointer = val;
   } 

     /**
     * 
     * 
     * @function
     * @memberof HistoJS
     * @since 1.0.0
     * @version 1.0.0
     */  
 
    setNavigatorValidCells = (validCellsArray) => {
     cellFiltersAndPhenotypesStates.validCells = validCellsArray;
   } 

   /**
    * Set the variable to null
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */     

    resetNavigatorValidCells = () => {
     cellFiltersAndPhenotypesStates.validCells = null;
   }    

   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */

     getNavigatorValidCells = () => {
       return cellFiltersAndPhenotypesStates.validCells.length ? cellFiltersAndPhenotypesStates.validCells : null;
     } 

   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */
      goToStartFilteredCell = () => {
          const validArray = getNavigatorValidCells();
          if(validArray == null) {
              triggerHint("No valid cells");
              return 0;
          }
          // if (index == -1) {
          //     validArray = allValidTiles;
          // } else {
          //     validArray = allValidPhenotypes[index].validCells
          // }

          if( getNavigatorValue() ) {
              resetNavigatorValue();
              zoomToTile(document.getElementById(validArray[getNavigatorValue()].id));
              document.getElementById("currentCell").innerHTML = (getNavigatorValue() + 1) + "/" + validArray.length
          } else {
              triggerHint("Click forward button to navigate .. ", "info", 5000);
          }
      }


   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */

      prevFilteredCell = () => {
          const validArray = getNavigatorValidCells();
          if(validArray == null) {
              triggerHint("No valid cells");
              return 0;
          }      

          // if (index == -1) {
          //     validArray = allValidTiles;
          // } else {
          //     validArray = allValidPhenotypes[index].validCells
          // }   

          // if( getNavigatorValue() > 0 ) {
          //     setNavigatorValue(getNavigatorValue() - 1);
          //     zoomToTile(document.getElementById(validArray[getNavigatorValue()].id));
          //     document.getElementById("currentCell").innerHTML = (getNavigatorValue() + 1) + "/" + validArray.length     
          if( getNavigatorValue() > 0 ) {
              setNavigatorValue(getNavigatorValue() - 1);
              if( getNavigatorValue() ) {
                 zoomToTile(document.getElementById(validArray[getNavigatorValue()-1].id));
                 document.getElementById("currentCell").innerHTML = (getNavigatorValue()) + "/" + validArray.length  
              }
          } else {
              triggerHint("Click forward button to navigate .. ", "info", 5000);
          }
      }


   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */

      nextFilteredCell = () => {
          const validArray = getNavigatorValidCells();
          if(validArray == null) {
              triggerHint("No valid cells");
              return 0;
          }      

          // if (index == -1) {
          //     validArray = allValidTiles;
          // } else {
          //     validArray = allValidPhenotypes[index].validCells
          // }  

          // if( getNavigatorValue() < validArray.length -1 ) {
          //     setNavigatorValue(getNavigatorValue() + 1);
          //     zoomToTile(document.getElementById(validArray[getNavigatorValue()].id));
          //     document.getElementById("currentCell").innerHTML = (getNavigatorValue() + 1) + "/" + validArray.length   
          if( getNavigatorValue() < validArray.length ) {
              setNavigatorValue(getNavigatorValue() + 1);
              zoomToTile(document.getElementById(validArray[getNavigatorValue()-1].id));
              document.getElementById("currentCell").innerHTML = (getNavigatorValue() ) + "/" + validArray.length                    
          } else {
              triggerHint("Click backward button to navigate .. ", "info", 5000);
          }
      }


   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */

     isFilteredCellFound = () => {
        return allValidTiles.length ? true : false;
     } 

 // togglecellNavigator = () => {
 //              if(allValidTiles.length) {
 //                  showPanel("cellNavigator", true);    
 //              } else {
 //                  showPanel("cellNavigator", false); 
 //              }
 // }


   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */

 filterTiles = (callback) => {
          let tileClass = getClassType();
          allValidTiles = [];
          let numOfFrames = getCurGrpNumOfChannels();  
          // For morphological features e.g. cell area, solidity..
          let morphFeatureNamesArr  = Object.keys(dapiMorphStatisticalData); 

          // showPanel("cellNavigator", false);     

          // Check for current active operation e.g. Tumor-Immune-Stromal or Phenotypes
          let curActiveOperationOnScreen = getActiveOperationOnScreen();
          curActiveOperationOnScreen = validateActiveOperationOnScreen(curActiveOperationOnScreen);              

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
                

                    allTilesFeatures.forEach(tile => {
                          let valid = true;
                          // For morphological features e.g. cell area, solidity..
                          morphFeatureNamesArr.forEach( (morphFeatName, idx) => {
                              //if statement to check whether morphological value > zero or the slider active
                              if(parseFloat(document.getElementById("cellFilterSlider." + morphFeatName).value) > 0) {
                                    if(tile[morphFeatName]  < parseFloat(document.getElementById("cellFilterSlider." + morphFeatName).value) ) {
                                        valid = false;
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
                                       //  Opts.cellIntensityFeature can be [mean, max, nonzero_mean, norm]                       
                                      if(tile.features[k][Opts.cellIntensityFeature] <= positiveThreshold) {
                                          valid = false;
                                      }
                                  } else {
                                       // consider all cells greater than or equal positve threshold.                                      
                                      if(tile.features[k][Opts.cellIntensityFeature] < positiveThreshold) {
                                          valid = false;
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
                                      if(tile.features[k][Opts.cellIntensityFeature] > negativeThreshold) {
                                          valid = false;
                                      }
                                  } else {
                                       // consider all cells less than threshold.                                      
                                      if(tile.features[k][Opts.cellIntensityFeature] >= negativeThreshold) {
                                          valid = false;
                                      }                                
                                  }  
                              } else {
                                  if(tile.features[k][Opts.cellIntensityFeature] < document.getElementById("cellFilterSlider." + tile.features[k].Frame).value) {
                                      valid = false;
                                  }
                              }

                          }

                          if(valid) {
                               //allValidTiles.push({id: tile.id, features: tile.features});      // <<<<<<<<<<< can be option 
                               allValidTiles.push({id: tile.id});
                          }
                    })              
                  
                    setBoundaryFillOpacity(1);

                    // Make all cells fill with none 
                    d3.selectAll(tileClass).style('fill', 'none');
                    d3.selectAll(tileClass).style('stroke', 'none');  
                    d3.selectAll(tileClass).style('fill-opacity', getBoundaryFillOpacity()); 



                    // if there is an active operation on the screen, and active filter  for cell coloring according to that operation
                    if(curActiveOperationOnScreen != null) {
                           switch ( curActiveOperationOnScreen) {

                                     case 'Phenotypes':
                                                      {
                                                        // filter phenotype Neighbors 
                                                        if( getActiveSubOperationOnScreen() == "phenotypeNeighbors") {
                                                            
                                                            if (filteredNeighbors["validNeighbors"].length) {
                                                                // e.g.filteredNeighbors= { cellType: "10101", neighborsType: "10111", validNeighbors: (9163) […] }
                                                                // e.g filteredNeighbors["validNeighbors"][0] = { id: "spx-13238", cellType: "10101", neighborsType: "10111", neighbors: [14327, 14395] }  
                                                                let cellTypeColors = {}; 

                                                                allValidPhenotypes.forEach( subCellPhenotype => { 
                                                                          cellTypeColors[subCellPhenotype.binary] = subCellPhenotype.phenotypeColor;
                                                                }) 

                                                                let curSourceType = filteredNeighbors["cellType"];
                                                                let curNeighborType = filteredNeighbors["neighborsType"];                                                                 

                                                                let sourceCellClr = cellTypeColors[ curSourceType ];
                                                                let targetNeighborClr = cellTypeColors[ curNeighborType ];
                                                                let totalNumOfNeighbors = 0;

                                                                let allValidTilesObject = array2ObjWithHashKey("id", allValidTiles);

                                                                let allFilteredvalidNeighbors = [];
                                            
                                                                let filteredNeighborsLength = filteredNeighbors["validNeighbors"].length;   

                                                                 //--<<<< If a source cell has valid neighbors, draw both, otherwise remove both >>>>--//                                                          

                                                                for(let i = 0; i < filteredNeighborsLength; i++) {
                                                                       // Flag to draw only cell sources that have valid neigbors 
                                                                       let drawSourceCell = false;
                                                                       //  Neighbors filtering   
                                                                       filteredNeighbors["validNeighbors"][i].neighbors.forEach(neighborLabel => {
                                                                            // if  allValidTilesObject entry has value other than undefined
                                                                            if(allValidTilesObject[ "spx-" + neighborLabel ]) {

                                                                               d3.select("#" + "spx-" + neighborLabel).style('fill', targetNeighborClr);
                                                                               d3.select("#" + "spx-" + neighborLabel).style('fill-opacity', getBoundaryFillOpacity());
                                                                               d3.select("#" + "spx-" + neighborLabel).style('stroke', 'black');
                                                                               d3.select("#" + "spx-" + neighborLabel).style('stroke-width', getStrokeWidth());
                                                                               d3.select("#" + "spx-" + neighborLabel).style('stroke-opacity', 1);

                                                                               // sum the total of neighbor cells of certain type as curNeighborType
                                                                               totalNumOfNeighbors = totalNumOfNeighbors + 1;  
                                                                               drawSourceCell = true;
                                                                            }      

                                                                       })



                                                                      //--<<<< If a source cell has valid neighbors, draw both, otherwise remove both >>>>--//  
                                                                      if(Opts.applyCellFilterToNeighborsOnly) {
                                                                          if(drawSourceCell) {
                                                                             // Draw source cell 
                                                                             d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('fill', sourceCellClr); 
                                                                             //Create array of valide filtered cells
                                                                             allFilteredvalidNeighbors.push(filteredNeighbors["validNeighbors"][i]);  

                                                                             d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('fill-opacity', getBoundaryFillOpacity());
                                                                             d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke', 'black');
                                                                             d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke-width', getStrokeWidth());
                                                                             d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke-opacity', 1);
                                                                          }
                                                                      } else {

                                                                              // if  allValidTilesObject entry has value other than undefined
                                                                              if(allValidTilesObject[ filteredNeighbors["validNeighbors"][i].id ]) {
                                                                                 d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('fill', sourceCellClr);    
                                                                                 //Create array of valide filtered cells
                                                                                 allFilteredvalidNeighbors.push(filteredNeighbors["validNeighbors"][i]);                                                                    

                                                                                 d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('fill-opacity', getBoundaryFillOpacity());
                                                                                 d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke', 'black');
                                                                                 d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke-width', getStrokeWidth());
                                                                                 d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke-opacity', 1);                                                                                 
                                                                              }

                                                                      }


                                                                }
                                                            

                                                                let numOfcellsPerClass = {};
                                                                numOfcellsPerClass[curSourceType] = allFilteredvalidNeighbors.length;
                                                                numOfcellsPerClass[curNeighborType] = totalNumOfNeighbors;
                                                                //-- NumOfCellsPerClass Object { Tumor: 21104, Immune: 28816 }
                                                                //-- OR
                                                                //-- NumOfCellsPerClass Object e.g { 10011: 211, 10101: 288 } -- random number for illustratin purpose

                                                                drawCellTypesColumnChart(numOfcellsPerClass, cellTypeColors,  "Source-Neighbor" ); // Third param is for x axis Title          
                                                           
                                                                initCellNavigator(allFilteredvalidNeighbors);

                                                                if(Opts.isNeighborFilterHintFirstAppear ) {
                                                                    if(Opts.applyCellFilterToNeighborsOnly) {
                                                                        triggerHint("Filtering is applied only to " + curNeighborType + " neighbor cells, if " + curSourceType + " has invalid neighbors then both will be removed");
                                                                    } else {
                                                                        triggerHint("Filtering is applied for both" + curNeighborType + " neighbor cells and  " + curSourceType + " cells, if one is invalid then it will be removed");                                                                
                                                                    }                                                                   
                                                                    
                                                                    Opts.isNeighborFilterHintFirstAppear = false;
                                                                }

                                                            } // end of if 

                                                        // Filter phenotypes
                                                        } else { 
                                                                let cellPhenotypeColors = {}; 
                                                                let cellPhenotypeBinary = {};

                                                                // allValidPhenotypes = [{ binary: "10001", validCells: (6211) […], totalValidCellsNum: 6211, phenotypeColor: "#ffb300"}, ...]

                                                                allValidPhenotypes.forEach((cellPhenotype, idx) => {  
                                                                    cellPhenotype.validCells.forEach((cell, idx) => {  
                                                                           cellPhenotypeColors[cell.id] = cellPhenotype.phenotypeColor;
                                                                           cellPhenotypeBinary[cell.id] = cellPhenotype.binary;
                                                                           //cellPhenotypeColors { "spx-36": "#ff0000", "spx-103": "#ff5900", "spx-188": "#ff5900", ...}
                                                                           //cellPhenotypeBinary { "spx-36": "01010", "spx-103": "10101", "spx-188": "11001", ...}
                                                                    })
                                                                })                                                        
                                                                
                                                                let validTileLen =  allValidTiles.length; // for best practise

                                                                for(let i = 0; i < validTileLen ; i++) {
                                                                         let clr = cellPhenotypeColors[allValidTiles[i].id];
                                                                         allValidTiles[i]["binary"] = cellPhenotypeBinary[allValidTiles[i].id];
                                                                         allValidTiles[i]["color"] = clr;                                                            
                                                                         d3.select("#"+allValidTiles[i].id).style('fill', clr);
                                                                         // d3.select("#"+allValidTiles[i].id).attr('class', 'validTileClass'); 
                                                                         d3.select("#"+allValidTiles[i].id).style('fill-opacity', getBoundaryFillOpacity());
                                                                        // d3.select("#"+allValidTiles[i].id).transition().duration(1000).style("fill-opacity", 0);
                                                                         d3.select("#"+allValidTiles[i].id).style('stroke', 'black');
                                                                         d3.select("#"+allValidTiles[i].id).style('stroke-width', getStrokeWidth());
                                                                         d3.select("#"+allValidTiles[i].id).style('stroke-opacity', 1);
                                                                }    

                                                               filteredValidPhenotypes = [];
                                                               // filteredValidPhenotypes = [{ binary: "10001", validCells: (6211) […], totalValidCellsNum: 6211, phenotypeColor: "#ffb300"}, ...]
                                                               // let allBinaryMarkersString = getBinaryStringsOfNbits(numOfFrames);

                                                               let allFilteredvalidCells1Dim = [];
                                            
                                                               allValidPhenotypes.forEach(cellPhenotype => {
                                                                   let filteredValidCells = allValidTiles.filter(cell => cell.binary == cellPhenotype.binary);
                                                                   filteredValidPhenotypes.push({binary: cellPhenotype.binary, phenotypeName: cellPhenotype.phenotypeName, validCells: filteredValidCells, totalValidCellsNum: filteredValidCells.length, phenotypeColor: cellPhenotype.phenotypeColor });
                                                                   allFilteredvalidCells1Dim = fastArraysConcat(allFilteredvalidCells1Dim, filteredValidCells);
                                                               })

                                                               if(filteredValidPhenotypes.length) {

                                                                      let phenoBinaryName = {};
                                                                      filteredValidPhenotypes.forEach( subCellPhenotype => { 
                                                                                  if(subCellPhenotype.phenotypeName) {
                                                                                       phenoBinaryName[subCellPhenotype.binary] = subCellPhenotype.phenotypeName;
                                                                                  }                                      
                                                                      }) 

                                                                      let chartData = [];
                                                                      for(let i = 0; i < filteredValidPhenotypes.length; i++) {

                                                                           if(phenoBinaryName[filteredValidPhenotypes[i].binary]) { // if there is naming for binary
                                                                                chartData.push({name: phenoBinaryName[filteredValidPhenotypes[i].binary], data: [filteredValidPhenotypes[i].totalValidCellsNum*100/getTotalTilesNum()],  color: filteredValidPhenotypes[i].phenotypeColor});
                                                                           } else {
                                                                                chartData.push({name: filteredValidPhenotypes[i].binary, data: [filteredValidPhenotypes[i].totalValidCellsNum*100/getTotalTilesNum()],  color: filteredValidPhenotypes[i].phenotypeColor});
                                                                           }
                                                                      } 


                                                                     drawCellPhenotypes3dColumnChart(chartData); 

                                                                     initCellNavigator(allFilteredvalidCells1Dim);
                          
                                                                } else {
                                                                    showPanel("cellNavigator", false); 
                                                                }                                                       
                                                        
                                                        }
                                                        break;
                                                      }  
                           case 'Tumor-Immune-Stromal':
                                                      {  
                                                        if( getActiveSubOperationOnScreen() == "basicCellTypeNeighbors") {
                                                            if (filteredNeighbors["validNeighbors"].length) {

                                                                // e.g.filteredNeighbors= { cellType: "10101", neighborsType: "10111", validNeighbors: (9163) […] }
                                                                // e.g filteredNeighbors["validNeighbors"][0] = { id: "spx-13238", cellType: "10101", neighborsType: "10111", neighbors: [14327, 14395] }  

                                                                let chnlNameType =  getGrpChannelsNameType(getSelectedGrpIndex());
                                                                // chnlNameType is array of object: [{"channel_name": "CD45", "channel_type" : "Immune"}, ...]

                                                                let cellTypeColors = getCellTypeColorObj(chnlNameType);
                                                                // return cellTypeColors obj: { Tumor: "#ff4846", ... }  

                                                                let curSourceType = filteredNeighbors["cellType"];
                                                                let curNeighborType = filteredNeighbors["neighborsType"];                                                                 

                                                                let sourceCellClr = cellTypeColors[ curSourceType ];
                                                                let targetNeighborClr = cellTypeColors[ curNeighborType ];
                                                                let totalNumOfNeighbors = 0;

                                                                let allValidTilesObject = array2ObjWithHashKey("id", allValidTiles);

                                                                let allFilteredvalidNeighbors = [];
                                            
                                                                let filteredNeighborsLength = filteredNeighbors["validNeighbors"].length;   

                                                                 //--<<<< If a source cell has valid neighbors, draw both, otherwise remove both >>>>--//                                                          

                                                                for(let i = 0; i < filteredNeighborsLength; i++) {
                                                                       // Flag to draw only cell sources that have valid neigbors 
                                                                       let drawSourceCell = false;
                                                                       //  Neighbors filtering   
                                                                       filteredNeighbors["validNeighbors"][i].neighbors.forEach(neighborLabel => {
                                                                            // if  allValidTilesObject entry has value other than undefined
                                                                            if(allValidTilesObject[ "spx-" + neighborLabel ]) {

                                                                               d3.select("#" + "spx-" + neighborLabel).style('fill', targetNeighborClr);
                                                                               d3.select("#" + "spx-" + neighborLabel).style('fill-opacity', getBoundaryFillOpacity());
                                                                               d3.select("#" + "spx-" + neighborLabel).style('stroke', 'black');
                                                                               d3.select("#" + "spx-" + neighborLabel).style('stroke-width', getStrokeWidth());
                                                                               d3.select("#" + "spx-" + neighborLabel).style('stroke-opacity', 1);

                                                                               // sum the total of neighbor cells of certain type as curNeighborType
                                                                               totalNumOfNeighbors = totalNumOfNeighbors + 1;  
                                                                               drawSourceCell = true;
                                                                            }      

                                                                       })



                                                                      //--<<<< If a source cell has valid neighbors, draw both, otherwise remove both >>>>--//  
                                                                      if(Opts.applyCellFilterToNeighborsOnly) {
                                                                          if(drawSourceCell) {
                                                                             // Draw source cell 
                                                                             d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('fill', sourceCellClr); 
                                                                             //Create array of valide filtered cells
                                                                             allFilteredvalidNeighbors.push(filteredNeighbors["validNeighbors"][i]);  

                                                                             d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('fill-opacity', getBoundaryFillOpacity());
                                                                             d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke', 'black');
                                                                             d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke-width', getStrokeWidth());
                                                                             d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke-opacity', 1);
                                                                          }
                                                                      } else {

                                                                              // if  allValidTilesObject entry has value other than undefined
                                                                              if(allValidTilesObject[ filteredNeighbors["validNeighbors"][i].id ]) {
                                                                                 d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('fill', sourceCellClr);    
                                                                                 //Create array of valide filtered cells
                                                                                 allFilteredvalidNeighbors.push(filteredNeighbors["validNeighbors"][i]);                                                                    

                                                                                 d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('fill-opacity', getBoundaryFillOpacity());
                                                                                 d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke', 'black');
                                                                                 d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke-width', getStrokeWidth());
                                                                                 d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke-opacity', 1);                                                                                 
                                                                              }

                                                                      }


                                                                }
                                                            

                                                                let numOfcellsPerClass = {};
                                                                numOfcellsPerClass[curSourceType] = allFilteredvalidNeighbors.length;
                                                                numOfcellsPerClass[curNeighborType] = totalNumOfNeighbors;
                                                                //-- NumOfCellsPerClass Object { Tumor: 21104, Immune: 28816 }
                                                                //-- OR
                                                                //-- NumOfCellsPerClass Object e.g { 10011: 211, 10101: 288 } -- random number for illustratin purpose

                                                                drawCellTypesColumnChart(numOfcellsPerClass, cellTypeColors,  "Source-Neighbor" ); // Third param is for x axis Title          
                                                           
                                                                initCellNavigator(allFilteredvalidNeighbors);

                                                                if(Opts.isNeighborFilterHintFirstAppear ) {
                                                                    if(Opts.applyCellFilterToNeighborsOnly) {
                                                                        triggerHint("Filtering is applied only to " + curNeighborType + " neighbor cells, if " + curSourceType + " has invalid neighbors then both will be removed");
                                                                    } else {
                                                                        triggerHint("Filtering is applied for both" + curNeighborType + " neighbor cells and  " + curSourceType + " cells, if one is invalid then it will be removed");                                                                
                                                                    }                                                                   
                                                                    
                                                                    Opts.isNeighborFilterHintFirstAppear = false;
                                                                }  


                                                            }// end of if 

                                                        } else {  

                                                                let cellClassesObject = array2ObjWithHashKey("id", cellBasicClassification)
                                                                //cellClassesObject ={"spx-1": { id: "spx-3", KERATIN_norm: 1.627327085071684, CD45_norm: 7.001735334431132, ASMA_norm: 0.03491692141936298, Max: "CD45_norm", Type: "Others", label: 3 }, ...}
                                                                let chnlNameType =  getGrpChannelsNameType(getSelectedGrpIndex());
                                                                // chnlNameType is array of object: [{"channel_name": "CD45", "channel_type" : "Immune"}, ...]

                                                                let cellTypeColors = getCellTypeColorObj(chnlNameType);
                                                                // return cellTypeColors obj: { Tumor: "#ff4846", ... }  

                                                                let validTileLen =  allValidTiles.length; // for best practise                                                       

                                                                for(let i = 0; i < validTileLen; i++) {
                                                                       let clr = cellTypeColors[cellClassesObject[allValidTiles[i].id].Type];
                                                                       allValidTiles[i]["Type"] = cellClassesObject[allValidTiles[i].id].Type;
                                                                       allValidTiles[i]["color"] = clr;
                                                                       d3.select("#"+allValidTiles[i].id).style('fill', clr);
                                                                       // d3.select("#"+allValidTiles[i].id).attr('class', 'validTileClass'); 
                                                                       d3.select("#"+allValidTiles[i].id).style('fill-opacity', getBoundaryFillOpacity());
                                                                      // d3.select("#"+allValidTiles[i].id).transition().duration(1000).style("fill-opacity", 0);
                                                                       d3.select("#"+allValidTiles[i].id).style('stroke', 'black');
                                                                       d3.select("#"+allValidTiles[i].id).style('stroke-width', getStrokeWidth());
                                                                       d3.select("#"+allValidTiles[i].id).style('stroke-opacity', 1);
                                                                }

                                                                let numOfcellsPerClass = {};
                                                                let allFilteredvalidCells1Dim = [];
                                                                chnlNameType.forEach((chnlNameTypeEntry, idx) => { 
                                                                       let cellType = chnlNameTypeEntry.channel_type; // e.g. Tumor 
                                                                       numOfcellsPerClass[cellType] = allValidTiles.filter(cell => cell.Type == cellType).length;
                                                                       // To quantify 
                                                                       allFilteredvalidCells1Dim = fastArraysConcat(allFilteredvalidCells1Dim, allValidTiles.filter(cell => cell.Type == cellType));

                                                                });

                                                                numOfcellsPerClass["Others"] = allValidTiles.filter(cell => cell.Type == "Others").length;
                                                                // NumOfCellsPerClass Object { Tumor: 21104, Immune: 28816, Stromal: 28934, Others: 26460 }

                                                                drawCellTypesColumnChart(numOfcellsPerClass, cellTypeColors,  'Filtered Cells'); // second param is for x axis Title                                                              

                                                                initCellNavigator(allFilteredvalidCells1Dim);
                                                        } 
                                                        break;             
                                                      }   
                                case 'Proteomic-Analysis':
                                                      {
                                                        triggerHint("To be Coded ..");
                                                        break;             
                                                      }                                                                                   
                                        case 'Cluster':
                                                      {
                                                        triggerHint("To be Coded ..");
                                                        break;             
                                                      }  
                                        
                                  }  

                    } else { // if there is NOT an active operation on the screen, switch for cell coloring according to that operation

                        if(! isViewBarEmpty("grpFeaturesViewBar") ) {
                             clearViewBar("grpFeaturesViewBar");
                        }                            

                        let validTileLen = allValidTiles.length;
                           
                        for(let i = 0; i < validTileLen ; i++) {
                               d3.select("#"+allValidTiles[i].id).style('fill', 'red');
                               // d3.select("#"+allValidTiles[i].id).attr('class', 'validTileClass'); 
                               d3.select("#"+allValidTiles[i].id).style('fill-opacity', getBoundaryFillOpacity());
                              // d3.select("#"+allValidTiles[i].id).transition().duration(1000).style("fill-opacity", 0);
                               d3.select("#"+allValidTiles[i].id).style('stroke', 'black');
                               d3.select("#"+allValidTiles[i].id).style('stroke-width', getStrokeWidth());
                               d3.select("#"+allValidTiles[i].id).style('stroke-opacity', 1);

                              // function animateTile() {
                              //     d3.select("#"+allValidTiles[i].id).transition().duration(1000).style("fill-opacity", 0)
                              //       .each("end", function() {
                              //         d3.select(this).transition().duration(1000).style("fill-opacity", 1)
                              //           .each("end", function() { animateTile(); });
                              //       });
                              // }
                               
                        }
                    
                        if(allValidTiles.length) {
                            initCellNavigator(allValidTiles);
                            // document.getElementById("cellTitle").innerHTML = "Cells:";                    
                            // document.getElementById("currentCell").innerHTML =  "-/" + allValidTiles.length   
                            // showPanel("cellNavigator", true);                   
                        } else {
                            showPanel("cellNavigator", false); 
                        }




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
              } else { // When there is no cell filter switch  active  or on, return to previous status before filtering

                    if(curActiveOperationOnScreen != null) {
                           switch ( curActiveOperationOnScreen) {

                                     case 'Phenotypes':
                                                      {
                                                        // filter phenotype Neighbors 
                                                        if( getActiveSubOperationOnScreen() == "phenotypeNeighbors") {

                                                            if (filteredNeighbors["validNeighbors"].length) {
                                                                // e.g.filteredNeighbors= { cellType: "10101", neighborsType: "10111", validNeighbors: (9163) […] }
                                                                // e.g filteredNeighbors["validNeighbors"][0] = { id: "spx-13238", cellType: "10101", neighborsType: "10111", neighbors: [14327, 14395] }
                                                                let cellTypeColors = {}; 

                                                                allValidPhenotypes.forEach( subCellPhenotype => { 
                                                                          cellTypeColors[subCellPhenotype.binary] = subCellPhenotype.phenotypeColor;
                                                                }) 

                                                                // Draw all sources cells and thier neighbors 
                                                                drawAllSourcesAndNeighbors(cellTypeColors);
                                                            }                                                                  
                                                        
                                                        } else {                                                                 

                                                            if(allValidPhenotypes.length) {
                                                             // allValidPhenotypes = [{ binary: "10001", validCells: (6211) […], totalValidCellsNum: 6211, phenotypeColor: "#ffb300"}, ...]
                          
                                                                let allValidPhenotypesArray1Dim = [];
                                                                allValidPhenotypes.forEach((cellPhenotype, idx) => {  
                                                                    cellPhenotype.validCells.forEach((cell, idx) => {  
                                                                           d3.select("#"+cell.id).style('fill', cellPhenotype.phenotypeColor);
                                                                           // d3.select("#"+allValidTiles[i].id).attr('class', 'validTileClass'); 
                                                                           d3.select("#"+cell.id).style('fill-opacity', getBoundaryFillOpacity());
                                                                          // d3.select("#"+allValidTiles[i].id).transition().duration(1000).style("fill-opacity", 0);
                                                                           d3.select("#"+cell.id).style('stroke', 'black');
                                                                           d3.select("#"+cell.id).style('stroke-width', getStrokeWidth());
                                                                           d3.select("#"+cell.id).style('stroke-opacity', 1);
                                                                    })
                                                                     // use this for navigation bar with total valid cells found 
                                                                     allValidPhenotypesArray1Dim = fastArraysConcat(allValidPhenotypesArray1Dim, cellPhenotype.validCells);
                                                                })                                                                
                                                             
                                                                let phenoBinaryName = {};
                                                                allValidPhenotypes.forEach( subCellPhenotype => { 
                                                                              if(subCellPhenotype.phenotypeName) {
                                                                                   phenoBinaryName[subCellPhenotype.binary] = subCellPhenotype.phenotypeName;
                                                                              }                                      
                                                                }) 

                                                                let chartData = [];
                                                                for(let i = 0; i < allValidPhenotypes.length; i++) {

                                                                       if(phenoBinaryName[allValidPhenotypes[i].binary]) { // if there is naming for binary
                                                                            chartData.push({name: phenoBinaryName[allValidPhenotypes[i].binary], data: [allValidPhenotypes[i].totalValidCellsNum*100/getTotalTilesNum()],  color: allValidPhenotypes[i].phenotypeColor});
                                                                       } else {
                                                                            chartData.push({name: allValidPhenotypes[i].binary, data: [allValidPhenotypes[i].totalValidCellsNum*100/getTotalTilesNum()],  color: allValidPhenotypes[i].phenotypeColor});
                                                                       }
                                                                } 


                                                                drawCellPhenotypes3dColumnChart(chartData); 

                                                                if(allValidPhenotypesArray1Dim.length) {
                                                                    initCellNavigator(allValidPhenotypesArray1Dim);
                  
                                                                } else {
                                                                    showPanel("cellNavigator", false); 
                                                                }                                                            
                                                                  
                                                             } 
                                                        }
 
                                                         break;
                                                      }  
                                     case 'Tumor-Immune-Stromal':
                                                      {  

                                                        if( getActiveSubOperationOnScreen() == "basicCellTypeNeighbors" ) {
                                                            
                                                             if(filteredNeighbors["validNeighbors"].length) {
                                                                // e.g.filteredNeighbors= { cellType: "10101", neighborsType: "10111", validNeighbors: (9163) […] }
                                                                // e.g filteredNeighbors["validNeighbors"][0] = { id: "spx-13238", cellType: "10101", neighborsType: "10111", neighbors: [14327, 14395] }  

                                                                let chnlNameType =  getGrpChannelsNameType(getSelectedGrpIndex());
                                                                // chnlNameType is array of object: [{"channel_name": "CD45", "channel_type" : "Immune"}, ...]

                                                                let cellTypeColors = getCellTypeColorObj(chnlNameType);
                                                                // return cellTypeColors obj: { Tumor: "#ff4846", ... }  

                                                                // Draw all sources cells and thier neighbors 
                                                                drawAllSourcesAndNeighbors(cellTypeColors);

                                                              }
                                                                
                                                         } else {

                                                             plotCellClassifications(cellBasicClassification);
                                                             showPanel("cellNavigator", false); 
                                                             // initCellNavigator(cellBasicClassification)
                                                         }
                                                         break;             
                                                      }
                                    case 'Proteomic-Analysis':
                                                      {
                                                        triggerHint("To be Coded ..");
                                                        break;             
                                                      }                                                                                      
                                     case 'Cluster':
                                                      {
                                                        triggerHint("To be Coded ..");
                                                        break;             
                                                      }  
                                        
                            }                  

                    } else {
                        setBoundaryFillOpacity(Opts.defaultBoundaryFillOpacity);
                        d3.selectAll(tileClass).style('fill',  Opts.defaultBoundaryFillColor);
                        d3.selectAll(tileClass).style('stroke', Opts.defaultStrokeColor);  
                        d3.selectAll(tileClass).style('fill-opacity', getBoundaryFillOpacity());                    
                   }
              }    



          }

       callback();
    }



//----------------------------------------------------------------------------------------------------//
//----------------------------------- Cell Classifications -------------------------------------------//
//----------------------------------------------------------------------------------------------------//


   /**
    * Take channel types and return cell type colors
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    * @param {Array} chnlNameType: Array of objects
    * @returns {object}
    * @example
    *
    * cellTypeColors = getCellTypeColorObj (  [{"channel_name": "CD45", "channel_type" : "Immune"}, 
                                               {"channel_name": "KERATIN", "channel_type" : "Tumor"},
                                               {"channel_name": "ASMA", "channel_type" : "Stromal"}] )
    *
    * // => Object { Immune: "#61c346", Tumor: "#ff4846", Stromal: "#5dd1ff", Others: "#6244d9" }  
    */

getCellTypeColorObj = (chnlNameType) => {

    if(chnlNameType.length) {

        //-- let chnlNameType =  getGrpChannelsNameType(getSelectedGrpIndex());
        let cellTypeColors = {};  

        //-- let NumOfcellsPerClass = {}; 
        chnlNameType.forEach((chnlNameTypeEntry, idx) => { 
               let cellType = chnlNameTypeEntry.channel_type; // e.g. Tumor 
               let cellTypeColor = mainCellTypesList.filter(cell => cell.cellType == cellType)[0].cellTypeColor;
               cellTypeColors[cellType] = cellTypeColor;
        });
        //push cellType "Others" since it is normally excluding from chnlNameType array
        let cellTypeOthersColor = mainCellTypesList.filter(cell => cell.cellType == "Others")[0].cellTypeColor;
        cellTypeColors["Others"] = cellTypeOthersColor;
     
        return cellTypeColors;

    } else {
       return null;
    }

}


/**
* Classify cells into Tumor / Immune / Stromal / Others
* 
* @function
* @memberof HistoJS
* @since 1.0.0
* @version 1.0.0
*/

cellClassifications = (cellsWithTypes, callback) => {
          let tileClass = getClassType();

          
          if(! isViewBarEmpty("grpFeaturesViewBar") ) {
               clearViewBar("grpFeaturesViewBar");
          }

          // showPanel("cellNavigator", false);

          if( isCellFiltersActive() ) {
               resetAllCellFilters();
          }  


         //cellsWithTypes is array of  Objects [
         //{id: "spx-1", KERATIN_norm: 1.44, CD45_norm: 6.57, ASMA_norm: 0.56, Max: "CD45_norm", Type: "Others", label: 1 },..]
         if(cellsWithTypes.length) {

              // Turn all channels Opacity to zero for best visualization of cell types
              resetAllChannelsOpacity();

              let chnlNameType =  getGrpChannelsNameType(getSelectedGrpIndex());
              // chnlNameType is array of object: [{"channel_name": "CD45", "channel_type" : "Immune"}, ...]
         
       
              // create array of Types/Colors : [{ cellType: "Tumor", color: "#ff4846" }, ...]
              let cellTypeColorArr = [];

              // let NumOfcellsPerClass = {}; 
              chnlNameType.forEach((chnlNameTypeEntry, idx) => { 
                   let cellType = chnlNameTypeEntry.channel_type; // e.g. Tumor 
                   let cellTypeColor = mainCellTypesList.filter(cell => cell.cellType == cellType)[0].cellTypeColor;
                   cellTypeColorArr.push({cellType: cellType, color: cellTypeColor });

                   // NumOfcellsPerClass[cellType] = cellsWithTypes.filter(cell => cell.Type == cellType).length;
                   // cellTypeColors[cellType] = mainCellTypesList.filter(cell => cell.cellType == cellType)[0].cellTypeColor;

              });
              //push cellType "Others" since it is normally excluding from chnlNameType array
              let cellTypeOthersColor = mainCellTypesList.filter(cell => cell.cellType == "Others")[0].cellTypeColor;
              cellTypeColorArr.push({cellType: "Others", color: cellTypeOthersColor });


              let cellTypeColors = {};  // cellTypeColors { Tumor: "#ff4846", ... }       
              // Initiat right grpFeaturesViewBar 
              cellTypeColorArr.forEach((typeColorEntry, idx) => { 
                 let cellType = typeColorEntry.cellType;
                 let clr  = typeColorEntry.color;
                 cellTypeColors[cellType] = clr; // cellTypeColors { Tumor: "#ff4846", ... }
                 // let btoa_clr = btoa( clr);


                 document.getElementById("grpFeaturesViewBar").innerHTML += 
                 '<a href="javascript:void(0)" ><span id="cellTypeColorSpanId.'+ cellType + '" style="background-color:'+ clr +
                 ';   padding-left:0.5vw;" onclick = "cellTypeNavigation(this)">&nbsp</span>&nbsp<i id="cellTypeEyeIcon.' +
                 cellType +'" class="fa fa-eye" aria-hidden="true" onclick=onCellTypeShowHide(this) style="font-size:0.6vw">' +
                 '<font style = "font-family: Impact, Charcoal, sans-serif;" >&nbsp&nbsp'+ cellType + '</font></i></a>';
              
             });         


            setBoundaryFillOpacity(1);

            d3.selectAll(tileClass).style('fill', 'none');
            d3.selectAll(tileClass).style('stroke', 'none');  
            d3.selectAll(tileClass).style('fill-opacity', getBoundaryFillOpacity()); 

            //Fill cells with related Tumor/Immune/Stromal color  
            cellsWithTypes.forEach((cell, idx) => {  
                   d3.select("#"+cell.id).style('fill', cellTypeColors[cell.Type]);
                   // d3.select("#"+allValidTiles[i].id).attr('class', 'validTileClass'); 
                   d3.select("#"+cell.id).style('fill-opacity', getBoundaryFillOpacity());
                  // d3.select("#"+allValidTiles[i].id).transition().duration(1000).style("fill-opacity", 0);
                   d3.select("#"+cell.id).style('stroke', 'black');
                   d3.select("#"+cell.id).style('stroke-width', getStrokeWidth());
                   d3.select("#"+cell.id).style('stroke-opacity', 1);
            })

         } else {
            triggerHint("No cell classes found ...");
         }

     callback();    

 }   

  
/**
* 
* 
* @function
* @memberof HistoJS
* @since 1.0.0
* @version 1.0.0
*/


  cellTypeNavigation = (elem) => {
         // triggerHint(" To be coded.. ")
         let cellType = elem.id.split('.')[1];
         let clr =  elem.style.backgroundColor

         if( isCellFiltersActive() ) {

              if(allValidTiles.length) {
                  initCellNavigator(allValidTiles.filter(cell => cell.Type == cellType), clr);
                  // document.getElementById("cellTitle").innerHTML = '<span  style="background-color:'+clr+'; padding-left:0.5vw;">&nbsp</span>'+" Cells:";                     
                  // document.getElementById("currentCell").innerHTML =  "-/" + allValidTiles.filter(cell => cell.Type == cellType).length;   
                  // showPanel("cellNavigator", true);                   
              } else {
                  showPanel("cellNavigator", false); 
              }  

         } else {
              // triggerHint(" Currently available when filters switching with CHNL OPTIONS panel  ")
              if(cellBasicClassification.length) {
                  initCellNavigator(cellBasicClassification.filter(cell => cell.Type == cellType), clr);

                  // document.getElementById("cellTitle").innerHTML =  '<span  style="background-color:'+clr+'; padding-left:0.5vw;">&nbsp</span>'+" Cells:";  
                  // document.getElementById("currentCell").innerHTML =  "-/" + cellBasicClassification.filter(cell => cell.Type == cellType).length; 
                  // showPanel("cellNavigator", true); 

              } else {
                  showPanel("cellNavigator", false); 
              }                



         }

    }


/**
* 
* 
* @function
* @memberof HistoJS
* @since 1.0.0
* @version 1.0.0
*/

   onCellTypeShowHide = (elem) => {
          let cellType = elem.id.split('.')[1];

          let cellTypeColors = []; //cellTypeColors { Tumor: "#ff4846", ... }
            mainCellTypesList.forEach(typeColorEntry => {
              cellTypeColors[typeColorEntry.cellType] = typeColorEntry.cellTypeColor
          })          
    
          if (document.getElementById("cellTypeEyeIcon." + cellType).className === "fa fa-eye") {
                document.getElementById("cellTypeEyeIcon." + cellType).className = "fa fa-eye-slash";
                
                if( isCellFiltersActive() ) { // if filtering is used for the cells with for example morphological features switches
                    allValidTiles.filter(cell => cell.Type == cellType).forEach((cell, idx)  => {  
                           d3.select("#"+cell.id).style('fill', "none");
                           // d3.select("#"+cell.id).style('stroke', 'black');
                    })                    

                } else {
                    cellBasicClassification.filter(cell => cell.Type == cellType).forEach((cell, idx)  => {  
                           d3.select("#"+cell.id).style('fill', "none");
                           // d3.select("#"+cell.id).style('stroke', 'black');
                    })

                }

          } else {
                 document.getElementById("cellTypeEyeIcon." + cellType).className = "fa fa-eye";

                if( isCellFiltersActive() ) {// if filtering is used for the cells with for example morphological features switches
                     allValidTiles.filter(cell => cell.Type == cellType).forEach((cell, idx)  => {  
                           d3.select("#"+cell.id).style('fill', cellTypeColors[cellType]);
                           // d3.select("#"+cell.id).style('fill', atob(btoa_clr));
                    })                     

                } else {
                     cellBasicClassification.filter(cell => cell.Type == cellType).forEach((cell, idx)  => {  
                           d3.select("#"+cell.id).style('fill', cellTypeColors[cellType]);
                           // d3.select("#"+cell.id).style('fill', atob(btoa_clr));
                    }) 
                }                
          }
  }


   /**
    * Future use
    * Reset the variable  
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */    
     resetCellTypeDependencies = () => {
          if(! isViewBarEmpty("grpFeaturesViewBar") ) {
               clearViewBar("grpFeaturesViewBar");
          }

          cellBasicClassification = [];
          resetGrpChannelsNameType( getSelectedGrpIndex() );
          setAllChannelsOpacity(); 
     }


//----------------------------------------------------------------------------------------------------//
//------------------------------------Cell Phenotypes ------------------------------------------------//
//----------------------------------------------------------------------------------------------------//


/**
* Generate all binary strings of n bits e.g. Array(8) [ "000", "001", "010", "011", "100", "101", "110", "111" ]
* 
* @function
* @memberof HistoJS
* @since 1.0.0
* @version 1.0.0
* @param {number} n
* @returns {Array} 
* @example
*
*  getBinaryStringsOfNbits(n)
*
* //=> Array(8) [ "000", "001", "010", "011", "100", "101", "110", "111" ]
*/     
 getBinaryStringsOfNbits = (n) => {
        let binaryStrings = [];
        // get max number of possible strings
        let maxNumOfPossibleStrings = parseInt("1".repeat(n),2);

        for(let i = 0; i <= maxNumOfPossibleStrings; i++){
          binaryStrings.push(i.toString(2).padStart(n,'0'));
        }

        return binaryStrings;
}


 
/**
* For group such as [ "LAG3", "DAPI", "PDL1" ], remove 010 binary to remove dapi 
* 
* @function
* @memberof HistoJS
* @since 1.0.0
* @version 1.0.0
* @param {Array} binaryStrings
* @returns {Array} 
* @example
*
* curChannelsArr = [ "LAG3", "DAPI", "PDL1" ]
* dapiChName = "DAPI" 
* allBinaryMarkersString = [ "000", "001", "010", "011", "100", "101", "110", "111"]
*
* removeBinaryWithOnlyDapiChannel(allBinaryMarkersString)
*
* //=> [ "000", "001", "011", "100",  "101", "110", "111"]
*
*/
 removeBinaryWithOnlyDapiChannel = (binaryStrings) => {
        let curChannelsArr = getCurGrpChannelsName(); //-- curChannelsArr: [ "LAG3", "DAPI", "PDL1" ]
        let dapiChName = getSelectedDAPIChannelName(); // -- dapiChName : "DAPI"
        let dapiWithinGrpIdx = curChannelsArr.indexOf(dapiChName); //--dapiWithinGrpIdx: 1

        // Declare string function to replace char at index
        String.prototype.replaceAtIndex = function(_index, _newValue) {
            return this.substr(0, _index) + _newValue + this.substr(_index + _newValue.length)
        }   

        let binaryToRemove = Array(curChannelsArr.length + 1).join('0').replaceAtIndex(dapiWithinGrpIdx, "1" );
        // -- binaryToRemove : "010"      

        removeArrayElem(binaryStrings, binaryToRemove);
}

   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    * @returns {boolean}
    */  

 isCellPhenotypeActive = () => {
    return allValidPhenotypes.length ? true : false;
 } 

   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    * @returns {Array}
    */  

 getCellPhenotypesCurrentSettings = () => {

        let curSettings = [];
        getCurGrpChannelsName().forEach( (channelName, idx) => {
            curSettings.push(document.getElementById("markerPositiveThresholds." + channelName ).value)
            // -- curSettings.push(document.getElementById("cellPositiveSwitch." + channelName ).value)
            curSettings.push(document.getElementById("markerNegativeThresholds." + channelName ).value)
            // -- curSettings.push(document.getElementById("cellNegativeSwitch." + channelName ).value)
        });   

        return  curSettings;
 }

   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    * @returns {Array}
    */  

 getCellPhenotypesLastSettings = () => {
      return cellFiltersAndPhenotypesStates.phenotypesLastSettings;
 } 

   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */  

 setCellPhenotypesLastSettings = (phentotypeSettings) => {
     cellFiltersAndPhenotypesStates.phenotypesLastSettings = phentotypeSettings;   
 } 

   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    * @returns {boolean}
    */   

 isCellPhenotypeSettingsChanged = ( curSettings) => {
    return !areArraysEquals(curSettings, getCellPhenotypesLastSettings() );
 }

   /**
    * 
    * 
    * @function
    * @memberof HistoJS
    * @since 1.0.0
    * @version 1.0.0
    */  

cellPhenotypes = (callback) => {
          let tileClass = getClassType();
          filteredValidPhenotypes = [];
          
          let numOfFrames = getSelectedGroup().Channels.length;  
          
          if(! isViewBarEmpty("grpFeaturesViewBar") ) {
               clearViewBar("grpFeaturesViewBar");
          }

          

          if( isCellFiltersActive() ) {
               resetAllCellFilters();
          }  

          let curPhenotypeSettings =  getCellPhenotypesCurrentSettings(); //e.g. [ "q3", "min", "q3", "mean", "q3", "mean", "q3", "mean", "q3", "mean" ]
          let lastPhenotypeSettings = getCellPhenotypesLastSettings();
          // Check if there is a change happen in the settings after last call of the function
          // This condition save calculate phenotypes each time, and only do with changes then last time.
          if( isCellPhenotypeSettingsChanged(curPhenotypeSettings) || allValidPhenotypes.length == 0) {
              // If a change detected at settings, save make last as current one for next around check
              setCellPhenotypesLastSettings(curPhenotypeSettings);
              allValidPhenotypes = [];

              let allBinaryMarkersString = getBinaryStringsOfNbits(numOfFrames); // e.g. [ "0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", … ]
              
              if(Opts.isDapiBinaryStrNeedRemove) {
                  removeBinaryWithOnlyDapiChannel(allBinaryMarkersString);  //-- e.g. remove 10000 from allBinaryMarkersString
              }

              allBinaryMarkersString.forEach(binaryMarkersString => { // e.g. "01001" equivalent to CD45- IBA1+ Keratin- ASMA- DNA+
                    let allValidCells = [];
                    allTilesFeatures.forEach(tile => {
                          let valid = true;

                          for (let k = 0; k < binaryMarkersString.length; k++) { //e.g. "01001"
                              markerState = parseInt(binaryMarkersString.charAt(k)); // markerState is either 1 or 0

                              let currentFrameBoxplotData = findObjectByKeyValue(grpChannelsStatisticalData, 'Frame', tile.features[k].Frame);

                              if( markerState ) { // markerState is Postive  e.g. CD45 positive button is ON
                                  let positiveThreshold = 0;

                                  // if (Opts.markerPositiveThreshold!== "0") {
                                  //    positiveThreshold = currentFrameBoxplotData[Opts.markerPositiveThreshold]; // e.g. currentFrameBoxplotData['q1']
                                  // } 


                                  if (getMarkerPositiveThresholdValue(tile.features[k].Frame)!== "0") {
                                      positiveThreshold = currentFrameBoxplotData[getMarkerPositiveThresholdValue(tile.features[k].Frame)]                                     
                                  } 


                                  if(positiveThreshold == 0){  
                                       // consider all cells greater than zero.                        
                                      if(tile.features[k][Opts.cellIntensityFeature] <= positiveThreshold) {
                                          valid = false;
                                      }
                                  } else {
                                       // consider all cells greater than or equal positve threshold.                                      
                                      if(tile.features[k][Opts.cellIntensityFeature] < positiveThreshold) {
                                          valid = false;
                                      }                                
                                  }  

                              } else { //markerState is Negative  e.g. CD45 negative button is ON, Negative can be q1 or min or 0 

                                  let negativeThreshold = 0;

                                  // if (Opts.markerNegativeThreshold!== "0") {
                                  //     negativeThreshold = currentFrameBoxplotData[Opts.markerNegativeThreshold]; 
                                  // } 


                                  if (getMarkerNegativeThresholdValue(tile.features[k].Frame)!== "0") {
                                     negativeThreshold = currentFrameBoxplotData[getMarkerNegativeThresholdValue(tile.features[k].Frame)] 
                                  }   


                                  if(negativeThreshold == 0){  
                                       // consider all cells equal to zero threshold at most.                        
                                      if(tile.features[k][Opts.cellIntensityFeature] > negativeThreshold) {
                                          valid = false;
                                      }
                                  } else {
                                       // consider all cells less than threshold.                                      
                                      if(tile.features[k][Opts.cellIntensityFeature] >= negativeThreshold) {
                                          valid = false;
                                      }                                
                                  }  
                              } 
                          }

                          if(valid) {
                               //allValidTiles.push({id: tile.id, features: tile.features});      // <<<<<<<<<<< can be option 
                               allValidCells.push({id: tile.id});
                          }
                    })

                   if(allValidCells.length) { // Only consider valid phenotypes with a number of cells >  0 
                       allValidPhenotypes.push({binary: binaryMarkersString, phenotypeName: null, validCells: allValidCells, totalValidCellsNum: allValidCells.length, phenotypeColor: null });
                       // e.g. [{ binary: "10001", validCells: (6211) […], totalValidCellsNum: 6211, phenotypeColor: "#ffb300"}, ...]
                   }

             }) 
         }  
         // Assign Color for each found cell phenotype 
         if(allValidPhenotypes.length) {
            // Turn all channels Opacity to zero for best visualization of cell phenotypes
            resetAllChannelsOpacity();
            let allPhenotypeColors = createCellPhenotypesColorsArray(allValidPhenotypes.length);
            // for(let i = 0; i < allValidPhenotypes.length; i++) {
            //       allValidPhenotypes[i]['phenotypeColor'] = allPhenotypeColors[i];
            // }


            allPhenotypeColors.forEach((clr, idx) => {
                 allValidPhenotypes[idx]['phenotypeColor'] = clr;
                 // let showPhenotypeBinaryAsSigns = allValidPhenotypes[idx].binary.replaceAll("1", "+").replaceAll("0", " - ");

                 let phenotypeTxt = allValidPhenotypes[idx].binary
                  
                 // If there is a name replace binary code with it. 
                 if(allValidPhenotypes[idx].phenotypeName) {
                     phenotypeTxt = allValidPhenotypes[idx].phenotypeName;
                 }

                 document.getElementById("grpFeaturesViewBar").innerHTML += 
                 '<a href="javascript:void(0)" >'+
                 '<span id="phenotypeColorSpanId.' + idx +'" style="background-color:'+clr+'; padding-left:0.5vw;" onclick = "phenotypeNavigation('+idx+')">&nbsp</span>&nbsp'+
                 '<i id="phenotypeEyeIcon.'+ idx +'" class="fa fa-eye" aria-hidden="true" onclick="onPhenotypeShowHide('+ idx +')" style="font-size:0.6vw">'+
                 '<font id="phenotypeFontId.' + idx +'"style = "font-family: Impact, Charcoal, sans-serif;" >&nbsp&nbsp'+ phenotypeTxt + '</font></i></a>';

            })            

            setBoundaryFillOpacity(1);

            d3.selectAll(tileClass).style('fill', 'none');
            d3.selectAll(tileClass).style('stroke', 'none');  
            d3.selectAll(tileClass).style('fill-opacity', getBoundaryFillOpacity()); 

            // for(let i = 0; i < allValidPhenotypes.length; i++) {
            //     for(let j = 0; j < allValidPhenotypes[i].validCells.length; j++) {
            allValidPhenotypes.forEach((cellPhenotype, idx) => {  
                cellPhenotype.validCells.forEach((cell, idx) => {  
                       d3.select("#"+cell.id).style('fill', cellPhenotype.phenotypeColor);
                       // d3.select("#"+allValidTiles[i].id).attr('class', 'validTileClass'); 
                       d3.select("#"+cell.id).style('fill-opacity', getBoundaryFillOpacity());
                      // d3.select("#"+allValidTiles[i].id).transition().duration(1000).style("fill-opacity", 0);
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

         if( isCellFiltersActive() ) {

              if(filteredValidPhenotypes.length) {
                 // filteredValidPhenotypes = [{ binary: "10001", validCells: (6211) […], totalValidCellsNum: 6211, phenotypeColor: "#ffb300"}, ...]
                  let clr =  filteredValidPhenotypes[phenotypeIndex]['phenotypeColor'];
                  initCellNavigator(filteredValidPhenotypes[phenotypeIndex].validCells, clr);
                  // document.getElementById("cellTitle").innerHTML = '<span  style="background-color:'+clr+'; padding-left:0.5vw;">&nbsp</span>'+" Cells:";                     
                  // document.getElementById("currentCell").innerHTML =  "-/" + allValidTiles.filter(cell => cell.Type == cellType).length;   
                  // showPanel("cellNavigator", true);                   
              } else {
                  showPanel("cellNavigator", false); 
              }  

         } else {
              // triggerHint(" Currently available when filters switching with CHNL OPTIONS panel  ")
              if(allValidPhenotypes.length) {
                   // allValidPhenotypes [{ binary: "10001", validCells: (6211) […], totalValidCellsNum: 6211, phenotypeColor: "#ffb300"}, ...]
                  let clr =  allValidPhenotypes[phenotypeIndex]['phenotypeColor'];
                  initCellNavigator(allValidPhenotypes[phenotypeIndex].validCells, clr);

                  // document.getElementById("cellTitle").innerHTML =  '<span  style="background-color:'+clr+'; padding-left:0.5vw;">&nbsp</span>'+" Cells:";  
                  // document.getElementById("currentCell").innerHTML =  "-/" + cellBasicClassification.filter(cell => cell.Type == cellType).length; 
                  // showPanel("cellNavigator", true); 

              } else {
                  showPanel("cellNavigator", false); 
              }                



         }

  }            

    initCellNavigator = (validCellsArray,  clr = 'none') => {
      let nodes =  ""; 
      nodes += '<div class="navigator-item"><p class="just" style="font-weight: bold;" id="cellTitle">Cells:</p></div>';
      nodes += '<div class="navigator-item">';
      nodes +=    '<a href="javascript:void(0)" onclick="goToStartFilteredCell()">';
      nodes +=       '<i style="font-size:1vw; padding-top:1.2vh"  class="fa fa-fast-backward"></i>' ;
      nodes +=    '</a>';      
      nodes += '</div>';
      nodes += '<div class="navigator-item">';
      nodes +=    '<a href="javascript:void(0)" onclick="prevFilteredCell()">';
      nodes +=       '<i style="font-size:1vw; padding-top:1.2vh"  class="fa fa-step-backward"></i>';
      nodes +=    '</a>';     
      nodes += '</div>';   
      nodes += '<div class="navigator-item">';
      nodes +=    '<a href="javascript:void(0)" onclick="nextFilteredCell()">';
      nodes +=       '<i style="font-size:1vw; padding-top:1.2vh"  class="fa fa-step-forward"></i>';
      nodes +=    '</a>';            
      nodes += '</div>';  
      nodes += '<div class="navigator-item">';
      nodes +=    '<p class="just" style="font-weight: bold;" id="currentCell">-/-</p>';
      nodes += '</div>';        

      document.getElementById("cellNavigator").innerHTML = nodes;

      document.getElementById("cellTitle").innerHTML =  '<span  style="background-color:'+clr+'; padding-left:0.5vw;">&nbsp</span>'+" Cells:";  
      document.getElementById("currentCell").innerHTML =  "-/" + validCellsArray.length; 
      //Must set the valid cells array 
      setNavigatorValidCells(validCellsArray);
      resetNavigatorValue();
      showPanel("cellNavigator", true);       
  }

   onPhenotypeShowHide = (phenotypeIndex) => {
    
          if (document.getElementById("phenotypeEyeIcon." + phenotypeIndex).className === "fa fa-eye") {
                document.getElementById("phenotypeEyeIcon." + phenotypeIndex).className = "fa fa-eye-slash";

                allValidPhenotypes[phenotypeIndex].validCells.forEach(cell => {  
                       d3.select("#"+cell.id).style('fill', "black");
                })
          } else {
                 document.getElementById("phenotypeEyeIcon." + phenotypeIndex).className = "fa fa-eye";

                 allValidPhenotypes[phenotypeIndex].validCells.forEach(cell => {  
                       d3.select("#"+cell.id).style('fill', allValidPhenotypes[phenotypeIndex].phenotypeColor);
                })                 
          }
  }


removeAllSelectOptions = (SelectListId) => {
        document.getElementById(SelectListId).options.length = 0;
}


//<option value="10101"> "10101" </option>
addNewSelectOption = (SelectListId, newOptionTxt, newOptionValue) => {
        let newOption = new Option(newOptionTxt, newOptionValue);
        document.getElementById(SelectListId).add(newOption,undefined);
}

getPhenotypeBinaryIndex  = (binaryVal) => {
    return allValidPhenotypes.findIndex(entry => entry.binary === binaryVal);
}

updateSelectList = (SelectListId, oldOptionTxt, newOptionTxt) => {
     let selectListObj = document.getElementById(SelectListId);
     let totalListOptions = selectListObj.options.length;

     for(let optionIdx = 0; optionIdx < totalListOptions; optionIdx ++) {
                if(selectListObj.options[optionIdx].innerHTML == oldOptionTxt) {
                    selectListObj.options[optionIdx].innerHTML = newOptionTxt;
                }
     }

     // selectListObj.options.forEach(option => {
     //            if(option.innerHTML == oldOptionTxt) {
     //                option.innerHTML = newOptionTxt;
     //            }
     // })

}

saveClosePhenotypeName = () => {
      applyPhenotypeName();
      document.getElementById("chartContainer").innerHTML = chartOptions.lastContainerContent;
}

cancelPhenotypeName = () => {
      document.getElementById("chartContainer").innerHTML = chartOptions.lastContainerContent;
}

applyPhenotypeName = () => {
    let curOptionBinaryValue  =  document.getElementById("phenotypeList").value;
    let phenoName  =  document.getElementById("phenotypeName").value;
    // let phenoAbbrev  =  document.getElementById("phenotypeAbbreviation").value;
    let newOptionTxt;

    // if( !(phenoAbbrev.length || phenoName.length) ) {
    //       triggerHint(" Please enter a  phenotype Abbreviation or Name");
    //       return 0;
    // }    

    if(phenoName.length) {
          if( isLetter(phenoName.charAt(0)) ) {
                newOptionTxt = phenoName.trim();
                setPhenotypeName(curOptionBinaryValue, newOptionTxt);
          } else {
                triggerHint(" Phenotype added Name should start with a letter");
                return 0;
          }

    } else {
          triggerHint(" Please enter a  phenotype Abbreviation or Name");
          return 0;
    }

    // if(phenoAbbrev.length) {
    //       if( isLetter(phenoAbbrev.charAt(0)) ) {
    //             newOptionTxt = phenoAbbrev.trim();
    //             setPhenotypeAbbreviation(curOptionBinaryValue, newOptionTxt);
    //       } else {
    //             triggerHint(" Phenotype Abbreviation should start with a letter");
    //             return 0;
    //       }

    // } 


    updateSelectList("phenotypeList", curOptionBinaryValue, newOptionTxt);

    let idx = getPhenotypeBinaryIndex(curOptionBinaryValue);
    document.getElementById("phenotypeFontId."+ idx).innerHTML = "&nbsp&nbsp" + newOptionTxt;

    triggerHint("Phenotype list updated...")
}


requestPhenotypeInfo = (elem) => {

    switch (elem.id) {
                   case 'phenotypeInfo':  {
                                           triggerHint("List of all found phenotypes");
                                           break;
                                          }

        case 'phenotypeDescriptionInfo':  {
                                           triggerHint("Give a full description of the phenotype binary in terms of channels positivity/negativity");
                                          break;
                                          }

              case 'phenotypeBinaryInfo': {
                                           triggerHint("For current phenotype binary, where 0 for negative markers and 1 for positivity");
                                          break;
                                          }
                case 'phenotypeNameInfo': {
                                           triggerHint("For giving a name or an Abbreviation to the phenotype binary e.g. Dendritic or DCs");
                                          break;
                                          }

        // case 'phenotypeAbbreviationInfo': {
        //                                    triggerHint("For giving an Abbreviation for the phenotype binary or name e.g. Dendritic cells to DCs ");
        //                                   break;
        //                                   }                       
    }

}

// e.g.  10101   is DAPI+ KERATIN- ASMA+ CD45- IBA1+
// e.g. grpChnlNameArr  :  Array(5) [ "DAPI", "KERATIN", "ASMA", "CD45", "IBA1" ]
getphenoBinaryDescription = (phenotypeVal, grpChnlNameArr) => {
        let phenoDescription = '';   

        for(chIdx = 0; chIdx < phenotypeVal.length; chIdx ++ ) {
                    markerStatus = parseInt(phenotypeVal.charAt(chIdx));

                    if(markerStatus) { // -- if 1
                        phenoDescription += grpChnlNameArr[chIdx] + "+";

                    } else {  // -- if 0
                        phenoDescription += grpChnlNameArr[chIdx] + "-";

                    }

                    phenoDescription += ' ';
        }

        return phenoDescription;  //--e.g. DAPI+ KERATIN- ASMA- CD45+ IBA1+ 
}

getPhenotypeName = (binary) => {
      return allValidPhenotypes.filter( entry => entry.binary === binary)[0].phenotypeName;
}

setPhenotypeName = (binary, phenotypeName) => {

      allValidPhenotypes.forEach((phenotypeEntry, idx) => {   
          if(phenotypeEntry.binary == binary) {
              phenotypeEntry.phenotypeName = phenotypeName;
          } 
      });      

}

// getPhenotypeAbbreviation = (binary) => {
//       return allValidPhenotypes.filter( entry => entry.binary === binary)[0].nameAbbreviation;
// }

// setPhenotypeAbbreviation = (binary, nameAbbreviation) => {
//       allValidPhenotypes.forEach((phenotypeEntry, idx) => {   
//           if(phenotypeEntry.binary == binary) {
//              phenotypeEntry.nameAbbreviation =  nameAbbreviation;
//           } 
//       });      
// }

getPhenotypeBinaryColor = (binary) => {
      return allValidPhenotypes.filter( entry => entry.binary === binary)[0].phenotypeColor;
}

setPhenotypeNamesFormField = (fieldId, value) => {
        document.getElementById(fieldId).value = value;
}


getPhenotypeNamesFormField  = (fieldId) => {
        return document.getElementById(fieldId).value;
}

/**
* reset the variable  
* 
* @function
* @memberof HistoJS
* @since 1.0.0
* @version 1.0.0
*/  

resetPhenotypeNamesFormField = (fieldId) => {
        document.getElementById(fieldId).value = "";
}

// To show description of the phenotype binary e.g. 10101
onPhenotypeListChanged = () => {
        let phenotypeVal = document.getElementById("phenotypeList").value;
        let grpChnlNameArr = getCurGrpChannelsName();   
        // e.g.  Array(5) [ "DAPI", "KERATIN", "ASMA", "CD45", "IBA1" ] 
        loadPhenotypeNameFormFields(phenotypeVal, grpChnlNameArr);
}

initPhenotypeBinaryColor = (phenotypeVal) => {
    let clr = getPhenotypeBinaryColor(phenotypeVal);
    document.getElementById("phenotypeBinaryClr").style.backgroundColor =  clr;
}  



loadPhenotypeNameFormFields = (phenotypeVal, grpChnlNameArr) => {
        setPhenotypeNamesFormField("phenotypeDescription", getphenoBinaryDescription(phenotypeVal, grpChnlNameArr));
        setPhenotypeNamesFormField("phenotypeBinaryField", phenotypeVal);        
        setPhenotypeNamesFormField("phenotypeName", getPhenotypeName(phenotypeVal));
        // setPhenotypeNamesFormField("phenotypeAbbreviation", getPhenotypeAbbreviation(phenotypeVal));
        initPhenotypeBinaryColor(phenotypeVal);

}

// Give phenotype binary a name e.g. CD20+ which is for example ***1* name as B Cell
// allValidPhenotypes[0] e.g. { binary: "10001", phenotypeName: null, validCells: (32) […], totalValidCellsNum: 32, phenotypeColor: "#ff0000" }
initPhenotypeNamesForm = () => {

      if(! allValidPhenotypes.length) {
          triggerHint("No phenotypes data found ..."); 
          return 0;           
      } 
            

      chartOptions.lastContainerContent = document.getElementById("chartContainer").innerHTML;

      let nodes = ""; 

      nodes +=  '<table>';
      nodes +=    '<colgroup><col style="width:30%"><col style="width:60%"><col style="width:10%"></colgroup>';

     

      nodes +=    '<tr>';
      nodes +=      '<th style="text-align: left; margin-left: 0vw; ">';
      nodes +=         '<label style="margin-left: 0.69vw; margin-Top: 0vh">Phenotype</label>';
      nodes +=      '</th>';

      nodes +=      '<th style="text-align: left">'; 
      // Initiat list of phenotypes to choose from 
      nodes +=        `<select  id="phenotypeList"  style="width:40%; margin-left: 0vw; font-size: 0.62vw; -webkit-appearance: none;"  onchange="onPhenotypeListChanged()">`;
      // -- allValidPhenotypes[0] e.g. { binary: "10001", phenotypeName: null, validCells: (32) […], totalValidCellsNum: 32, phenotypeColor: "#ff0000" }      

      allValidPhenotypes.forEach((phenotypeEntry, idx) => {   
          let phenotypeBinary = phenotypeEntry.binary; // e.g. 10101   
          let clr  = phenotypeEntry.phenotypeColor;
          let phenotypeName  = phenotypeEntry.phenotypeName;     
          if(idx == 0) {
                 if(phenotypeName) {
                       nodes +=    `<option value=${phenotypeBinary} selected>${phenotypeName}</option>`;                         
                 } else {
                       nodes +=    `<option value=${phenotypeBinary} selected>${phenotypeBinary}</option>`; 
                 }

          } else {
                     if(phenotypeName) {
                           nodes +=    `<option value=${phenotypeBinary} >${phenotypeName}</option>`;                         
                     } else {
                           nodes +=    `<option value=${phenotypeBinary} >${phenotypeBinary}</option>`; 
                     }
          }

      });

      nodes +=         '</select>'; 
      nodes +=         `&nbsp&nbsp&nbsp<span id="phenotypeBinaryClr" style="padding-left:0.5vw;">&nbsp</span>&nbsp`;
      nodes +=      '</th>';

      nodes +=      '<th style="padding-left:0;">'; 
      nodes +=        `<a  href="javascript:void(0)" id="phenotypeInfo" onclick="requestPhenotypeInfo(this)"><i style="font-size:1vw;" class="fa fa-info-circle"></i></a>`    
      nodes +=      '</th>'; 
      nodes +=    '</tr>';  

      //-- Description Field
      nodes +=    '<tr style="margin-top: 1vh;">';                    
      nodes +=      '<th style="text-align: left; margin-left: 0vw; ">'
      nodes +=         '<label style="margin-left: 0.69vw; margin-Top: 0vh">Description</label>';
      nodes +=      '</th>';  

      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<input type="text" id="phenotypeDescription" value = "" style="background-color:white; margin-Left: 0vw; margin-Top: 0vh; font-size: 0.62vw; width: 100%; height:1vh;" readonly/>`      
      nodes +=      '</th>';      
      nodes +=      '<th style="padding-left:0;">'; 
      nodes +=        `<a  href="javascript:void(0)" id="phenotypeDescriptionInfo" onclick="requestPhenotypeInfo(this)"><i style="font-size:1vw;" class="fa fa-info-circle"></i></a>`    
      nodes +=      '</th>';
      nodes +=    '</tr>';  

      //-- Binary Field
      nodes +=    '<tr style="margin-top: 1vh;">';                      
      nodes +=      '<th style="text-align: left; margin-left: 0vw; ">'
      nodes +=         '<label style="margin-left: 0.69vw; margin-Top: 0vh">Binary</label>';
      nodes +=      '</th>';  

      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<input type="text" id="phenotypeBinaryField" value = "" maxlength="10" style="background-color:white; margin-Left: 0vw; margin-Top: 0vh; font-size: 0.62vw; width: 40%; height:1vh;" readonly/>`      
      nodes +=      '</th>';      
      nodes +=      '<th style="padding-left:0;">'; 
      nodes +=        `<a  href="javascript:void(0)" id="phenotypeBinaryInfo" onclick="requestPhenotypeInfo(this)"><i style="font-size:1vw;" class="fa fa-info-circle"></i></a>`    
      nodes +=      '</th>';
      nodes +=    '</tr>';      

      //-- Name Field
      nodes +=    '<tr style="margin-top: 1vh;">';                      
      nodes +=      '<th style="text-align: left; margin-left: 0vw; ">'
      nodes +=         '<label style="margin-left: 0.69vw; margin-Top: 0vh">Add Name</label>';
      nodes +=      '</th>';  

      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<input type="text" id="phenotypeName" value = "" style="background-color:white; margin-Left: 0vw; margin-Top: 0vh; font-size: 0.62vw; width: 40%; height:1vh;" />`      
      nodes +=      '</th>';      
      nodes +=      '<th style="padding-left:0;">'; 
      nodes +=        `<a  href="javascript:void(0)" id="phenotypeNameInfo" onclick="requestPhenotypeInfo(this)"><i style="font-size:1vw;" class="fa fa-info-circle"></i></a>`    
      nodes +=      '</th>';
      nodes +=    '</tr>';  

      //-- Abbreviation Field
      // nodes +=    '<tr style="margin-top: 1vh;">';                      
      // nodes +=      '<th style="text-align: left; margin-left: 0vw; ">'
      // nodes +=         '<label style="margin-left: 0.69vw; margin-Top: 0vh">Abbreviation</label>';
      // nodes +=      '</th>';  

      // nodes +=      '<th style="text-align: left">'; 
      // nodes +=        `<input type="text" id="phenotypeAbbreviation" value = ""  style="background-color:white; margin-Left: 0vw; margin-Top: 0vh; font-size: 0.62vw; width: 40%; height:1vh;" />`      
      // nodes +=      '</th>';      
      // nodes +=      '<th style="padding-left:0;">'; 
      // nodes +=        `<a  href="javascript:void(0)" id="phenotypeAbbreviationInfo" onclick="requestPhenotypeInfo(this)"><i style="font-size:1vw;" class="fa fa-info-circle"></i></a>`    
      // nodes +=      '</th>';

      // nodes +=    '</tr>';              
  

      nodes +=  '</table>';                

      nodes +=  '<hr style="margin-bottom: 1vh;">';
      nodes +=  '<table>';
      nodes +=    '<colgroup><col style="width:33%"><col style="width:34%"><col style="width:33%"></colgroup>';
      nodes +=    '<tr>';   
      nodes +=      '<th><i style="font-size:1vw"  onclick="saveClosePhenotypeName()"  class="fa fa-check-circle"></i></th>';
      nodes +=      '<th><i style="font-size:1vw"  onclick="applyPhenotypeName()"  class="fa fa-plus-circle"></i></th>';      
      nodes +=      '<th><i style="font-size:1vw"  onclick="cancelPhenotypeName()" class="fa fa-times-circle"></i></th>';      
      nodes +=    '</tr>';  
      nodes +=  '</table>';  

           

      document.getElementById("chartContainer").innerHTML  = nodes;

      document.getElementById("phenotypeName").maxLength = Opts.phenotypeNamingMaxLen;
      // document.getElementById("phenotypeAbbreviation").maxLength = Opts.phenotypeAbbrevMaxLen;
      


      let phenotypeVal = document.getElementById("phenotypeList").value;
      let grpChnlNameArr = getCurGrpChannelsName();   
      // e.g.  Array(5) [ "DAPI", "KERATIN", "ASMA", "CD45", "IBA1" ] 
         
      loadPhenotypeNameFormFields(phenotypeVal, grpChnlNameArr);      
     
  } 

/**
* Future use
* reset the variable  
* 
* @function
* @memberof HistoJS
* @since 1.0.0
* @version 1.0.0
*/ 
 resetCellPhenotypeDependencies = () => {
      if(! isViewBarEmpty("grpFeaturesViewBar") ) {
           clearViewBar("grpFeaturesViewBar");
      }

      allValidPhenotypes = [];
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

createCellPhenotypesColorsArray = (numOfValidPhenotypes) => {
    let colorStep=Math.floor(360/numOfValidPhenotypes); // 360 is HSL max hue
    let saturation=100;
    let lightness=50;
    let initHue=0;
    let phenotypesColorsArray = [];
    for(let n = 0; n < numOfValidPhenotypes; n++){
        let phenotypeColorRgb = HSLToRGB(n * colorStep, saturation, lightness);
        phenotypesColorsArray.push('#'+ RGBtoHEX(phenotypeColorRgb));
    }

    return phenotypesColorsArray;
}

 /**
 * Turn Off all channels 
 * 
 * @function
 * @memberof HistoJS
 * @since 1.0.0
 * @version 1.0.0
 */ 
  resetAllChannelsOpacity = () => {
     const curGroup = getSelectedGroup();
     curGroup.Channels.forEach((channelName,idx) => {
        viewer.world.getItemAt(idx).setOpacity(0);
        document.getElementById(`opacitySwitch.${idx}`).checked = false;
        document.getElementById("showHideAllGrpChls").className = "fa fa-eye-slash";
     }) 
  }

 /**
 * Turn On all channels 
 * 
 * @function
 * @memberof HistoJS
 * @since 1.0.0
 * @version 1.0.0
 */

  setAllChannelsOpacity = () => {
     const curGroup = getSelectedGroup();
     curGroup.Channels.forEach((channelName,idx) => {
        viewer.world.getItemAt(idx).setOpacity(1);
        document.getElementById(`opacitySwitch.${idx}`).checked = true;
        document.getElementById("showHideAllGrpChls").className = "fa fa-eye";
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

     // morphFeatureNamesArr = [ "area", "eccentricity", "extent", "orientation", "solidity", "major_axis_length", "minor_axis_length" ]
     const morphFeatureNamesArr = cellMorphFeatureList.map(entry => {
                                    return entry.morphFeature
                                })
      morphFeatureNamesArr.forEach( (morphFeatureName, idx) => {
             if(document.getElementById("cellFilterSlider." + morphFeatureName)) {
                   document.getElementById("cellFilterSlider." + morphFeatureName).disabled = freezeFlag;
             }
      })      

  }

 /**
 * Reset all cell filters  
 * 
 * @function
 * @memberof HistoJS
 * @since 1.0.0
 * @version 1.0.0
 */

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
     showLoadingIcon().then( result => {

         // Update tooltip value 
         document.getElementById(`cellFilterValueTooltip.${channelName}`).innerHTML = getCellFilterSliderValue(elem.id);

         if(parseInt(document.getElementById("cellFilterSlider." + channelName).value)) {
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
     showLoadingIcon().then( result => {

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

 /**
 * Turn off cell postive switch 
 * 
 * @function
 * @memberof HistoJS
 * @since 1.0.0
 * @version 1.0.0
 */
   resetCellPositiveSwitch = (channelName) => {
      document.getElementById("cellPositiveSwitch." + channelName).checked = false;
   }

  toggleChannelCellPositive = (elem) => {
     let channelName = elem.id.split('.')[1];

     if(isLocalFileExist( getGrpBoxplotFileName(), getGrpBoxplotLocalPath() )) {
           showLoadingIcon().then( result => {

                // if (! isGrpChannelsStatisticalDataAvailable() ) {
                //     setGrpChannelsStatisticalData( readJsonFile(getGrpBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 
                // } 

                if (! isGrpChannelsStatisticalDataAvailable() ) {
                    if(Opts.isBoxplotChannelBased) {
                       setGrpChannelsStatisticalData( readJsonFile(getGrpBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 

                    } else { // if it is cell based
                        setGrpChannelsStatisticalData( readJsonFile(getGrpMarkerCellsBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 
                    }
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

 /**
 * Turn off cell negative switch 
 * 
 * @function
 * @memberof HistoJS
 * @since 1.0.0
 * @version 1.0.0
 */   

   resetCellNegativeSwitch = (channelName) => {
      document.getElementById("cellNegativeSwitch." + channelName).checked = false;
   }

  toggleChannelCellNegative = (elem) => {
     let channelName = elem.id.split('.')[1];

     if(isLocalFileExist( getGrpBoxplotFileName(), getGrpBoxplotLocalPath() )) {
           showLoadingIcon().then( result => {

                // if (! isGrpChannelsStatisticalDataAvailable() ) {
                //     setGrpChannelsStatisticalData( readJsonFile(getGrpBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 
                // }      

                if (! isGrpChannelsStatisticalDataAvailable() ) {
                    if(Opts.isBoxplotChannelBased) {
                       setGrpChannelsStatisticalData( readJsonFile(getGrpBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 

                    } else { // if it is cell based
                        setGrpChannelsStatisticalData( readJsonFile(getGrpMarkerCellsBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 
                    }
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
          nodes +=           `<input class="switch-input" type="checkbox" id="cellPositiveSwitch.${channelName}" onclick="toggleChannelCellPositive(this)" disabled/>`;
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

              let defaultNegativeThreshold = Opts.markerNegativeThreshold;

              // For Dapi channel the negative threshold can be as low as "min", others can be "mean"
              if(channelName == getSelectedDAPIChannelName()) {
                  defaultNegativeThreshold = Opts.dapiDefaultNegativeThreshold;                
              }

              if(threshold === defaultNegativeThreshold) { 
                  nodes +=    `<option value=${threshold} selected>${threshold}</option>`;        
              } else {
                  nodes +=    `<option value=${threshold}>${threshold}</option>`;  
              }
          });

          nodes +=           '</select>';

          nodes +=        '</p></th>'; 
         
          nodes +=         '<th style="padding-left:5%;"><label class="switch switch-left-right">';
          nodes +=           `<input class="switch-input" type="checkbox" id="cellNegativeSwitch.${channelName}" onclick="toggleChannelCellNegative(this)" disabled/>`;
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
          nodes +=         `<th ><div class="tooltip"><input  type="range" style="padding-left:5%; margin-left:10%; width:90%" min="0" max="255" value="0" step="20" id="cellFilterSlider.${channelName}" onchange="cellFilterSliderChanged(this)" onmouseover="onCellFilterSliderMouseover(this)" disabled /><span class="tooltiptext" style="width: 50%; left: 50%;" id="cellFilterValueTooltip.${channelName}"></span></div></th>`;
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
              nodes +=         `<th ><div class="tooltip"><input  type="range" style="padding-left:5%; margin-left:10%; width:90%" min="${morphFeatMinVal}" max="${morphFeatMaxVal}" value="${morphFeatMinVal}" step="${stepVal}" id="cellFilterSlider.${morphFeatureName}" onchange="cellMorphFilterSliderChanged(this)" onmouseover="onCellFilterSliderMouseover(this)" disabled /><span class="tooltiptext" style="width: 50%; left: 50%;" id="cellFilterValueTooltip.${morphFeatureName}"></span></div></th>`;
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
    //   return document.getElementById("toggleBoundaries").checked ? true: false;
    // I removed grid option and kept only spx option 
         return true; 
   }

   // enable sliders 
   enableBoundarySliders = (enableFlag) => {
        let allSliders = document.getElementById("boundaryOptionsTable").querySelectorAll('input[type="range"]');
        allSliders.forEach( slider => {
        	slider.disabled = !enableFlag;
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
   }

 /**
 * Turn off boundary switch 
 * 
 * @function
 * @memberof HistoJS
 * @since 1.0.0
 * @version 1.0.0
 */  
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
          var defer = $.Deferred();
          triggerHint("Wait cell boundaries to load","info", 10000);
          openProgressBar();
          let allSpxBoundaryData = readJsonFile( getItemBoundariesFileName(), getBoundariesLocalPath() ) ;

          if(! allSpxBoundaryData.length) {
              triggerHint("No cell boundaries data found ..","info", 5000);
              closeProgressBar();
              return 0;
           }
          
          allSelection = []; 

          //To activate progress bar
          let chunkIdx = 0;
          let allSpxBoundaryDataChunks = [];

          allSpxBoundaryDataChunks = chunkArray(allSpxBoundaryData, Opts.numOfPrgBarJumps);

          // if arrayOfSomeValues.length < numOfPrgBarJumps
          if(allSpxBoundaryDataChunks == null) {
            triggerHint("Progress bar settings are Invalid due to small data to partition, try please to decrease numOfPrgBarJumps");
            allSpxBoundaryDataChunks = [allSpxBoundaryData]; //So allChunks[0] is applicable
          }


          let intervalId = window.setInterval(function() {

                           $.each(allSpxBoundaryDataChunks[chunkIdx], function(index, tile) {
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

                           });
                         
                          document.getElementById("progressBar").style.width=  (chunkIdx+1)*100/allSpxBoundaryDataChunks.length + "%";                      

                          if( chunkIdx == allSpxBoundaryDataChunks.length-1 ) {
                               window.clearInterval( intervalId );
                               document.getElementById("progressBar").style.width = 0;  


                              d3.select(overlay.node()).on('mouseleave',handleMouseLeave)
                                .call(d3.behavior.zoom().on("zoom", function () { 
                                          d3.select('.d3-context-menu').style('display', 'none');
                                }))
                                .on('contextmenu', function(d, i) { 
                                    if( isSuperPixel() ){ 
                                       contextMenu(menu1);
                                    }
                                }); 

                               triggerHint("Boundaries loaded","info", 5000);  

                               // remain code till the end of original function 
                               closeProgressBar();
                               defer.resolve(); // When this fires, the code in initSpxOverlay().then(/..../); is executed.
                          }

                          chunkIdx++;                      
          }, 0);

        return defer;        
}




  initSpxOverlay_v1 = ( /*allSpxBoundaryData = [] */) => {
     webix.message("Wait cell boundaries to load");
     triggerHint("Wait cell boundaries to load","info", 10000);
      // let allSpxBoundaryData = JSON.parse(getBoundaries( getItemBoundariesFileName(), getBoundariesLocalPath() ) );
      let allSpxBoundaryData = readJsonFile( getItemBoundariesFileName(), getBoundariesLocalPath() ) ;

     // $.getJSON( getBoundariesLocalPath() + getItemBoundariesFileName(), function(allSpxBoundaryData){
    
           if(! allSpxBoundaryData.length) {
              triggerHint("No cell boundaries data found ..","info", 5000);
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

         var defer = $.Deferred();
   		// To be coded..check for superpixel availability, otherwise create it
   		// need wizard to allocate the cellmask image or create it.
        if( isLocalFileExist( getItemBoundariesFileName(), getBoundariesLocalPath()) ) {
               //to be coded
               // let allSpxBoundaryData = JSON.parse(getBoundaries( getItemBoundariesFileName(), getBoundariesLocalPath() ) );
               // initSpxOverlay(allSpxBoundaryData);
               initSpxOverlay().then( result => {
                       defer.resolve(); // When this fires, the code in loadSpxBoundaries().then(/..../); is executed.
                });
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
                                                       initSpxOverlay().then( result => {
                                                               defer.resolve(); // When this fires, the code in loadSpxBoundaries().then(/..../); is executed.
                                                        });
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
                                                           initSpxOverlay().then( result => {
                                                                   defer.resolve(); // When this fires, the code in loadSpxBoundaries().then(/..../); is executed.
                                                            });
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

       return defer; 
   }

   // loadGridBoundaries = () => {
   // 	   initGridOverlay();
   // }

   // init Grid / Spx boundaries
   initBoundaries = () => {
       if( isRestApiAvailable() ) {     

   		   loadSpxBoundaries().then( result => {

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
           })

 

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
        nodes +=         '<th style="padding-left:10%;text-align: left"><p> Load / Create</p></th>'; 
		nodes +=         '<th style="padding-left:10%;"><label class="switch ">';
		nodes +=           '<input class="switch-input" type="checkbox" id="boundarySwitch" onclick="boundarySwitchClicked()"/>';
		nodes +=           '<span class="switch-label" data-on="On" data-off="Off"></span> ';
		nodes +=           '<span class="switch-handle"></span>'; 
		nodes +=         '</label></th>';
		nodes +=       '</tr>';    


        nodes +=       '<tr>';
        nodes +=         '<th style="padding-left:10%;text-align: left"><p> Fill_Opacity </p></th>';      
        nodes +=         '<th ><div class="tooltip">';
        nodes +=        	    '<input type="range" disabled min="0" max="1"  step="0.25"  id="boundaryFillOpacity" onchange="boundaryFillOpacityChanged()" onmouseover="boundaryFillOpacitySliderMouseOver()" />';
        nodes +=        	    '<span class="tooltiptext" style="width: 50%; left: 50%;" id="boundaryFillOpacityValueTooltip"></span>';
        nodes += 	          '</div>';
        nodes +=    	 '</th>';	
        nodes +=         '<th style="padding-left:0;text-align: left"><input  id="boundaryFillColor" onchange="boundaryFillColorChanged()" /></th>'; 
        nodes +=       '</tr>'; 	    

        nodes +=       '<tr>';
        nodes +=         '<th style="padding-left:10%;text-align: left"><p> Stroke_Opacity </p></th>';      
        nodes +=         '<th ><div class="tooltip">';
        nodes +=        	    '<input type="range" disabled min="0" max="1" step="0.25" id="strokeOpacity" onchange="strokeOpacityChanged()" onmouseover="strokeOpacitySliderMouseOver()" />';
        nodes +=        	    '<span class="tooltiptext" style="width: 50%; left: 50%;" id="strokeOpacityValueTooltip"></span>';
        nodes += 	          '</div>';
        nodes +=    	 '</th>';	 
        nodes +=         '<th style="padding-left:0;text-align: left"><input  id="strokeColor" onchange="strokeColorChanged()" /></th>'; 	       
        nodes +=       '</tr>';

        nodes +=       '<tr>';
        nodes +=         '<th style="padding-left:10%;text-align: left"><p> Stroke_Width </p></th>';      
        nodes +=         '<th ><div class="tooltip">';
        nodes +=        	    '<input type="range" disabled min="1"  step="1" id="strokeWidth" onchange="strokeWidthChanged()" onmouseover="strokeWidthSliderMouseOver()" />';
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
        nodes +=             '<input type ="text" id="tileSearchBox" style="color: white; height:1vh;" disabled />'
        nodes +=         '</th>';   
        nodes +=         '<th colspan="2">'
        nodes +=             '<button onclick="findTile()" style = "height:2.0vh; width:2.7vw; background-color: white" id="findTileBtn" disabled>Find</button>'
        nodes +=         '</th>';
        nodes +=       '</tr>' 
        nodes +=      '</table>';          
           
		nodes +=  '</div>';	      


    document.getElementById("grpBoundaryOptions").innerHTML += nodes;
    document.getElementById("boundaryFillOpacity").value = Opts.defaultBoundaryFillOpacity;
    document.getElementById("strokeWidth").max = Opts.maxStrokeWidth;
    document.getElementById("strokeWidth").value = Opts.defaultStrokeWidth;
    document.getElementById("strokeOpacity").value = Opts.defaultStrokeOpacity

		$("#boundaryFillColor").spectrum({
		    color: Opts.defaultBoundaryFillColor,
		    showAlpha: true
		});

		$("#strokeColor").spectrum({
		    color: Opts.defaultStrokeColor,
		    showAlpha: true
		});	    

	}  


/*------------------------------------------------------------------------------------------------------------------*/
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

                freezeAllCellFilters(true);


         } else { 
            //   switch is OFF
                restoreBoundarySettings();
                resetSimilarTilesSwitchDependencies();    // <<<<<<<<<<<<<<<<<------
                freezeFeaturesControls(true);
                freezeAllCellFilters(false);
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
      resetAllChannelsOpacity();      
 //     findSimilarTiles();
      // removeFrameAnnotations();
      addHeatmapAnnotations();
      freezeInput("findSimilarTileBtn", true);
    } else {
      setBoundaryFillOpacity(prevOpacity);
      removeHeatmapAnnotations();
      setAllChannelsOpacity(); 
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

              let heatmapColor;

              if(Opts.isHeatmapColorManual) {

                   d3.select("#"+sortedFeaturesDistance[0].id).style('fill', d3.rgb(HeatmapRange[0]));

              } else {

                  let domainSmallValue = sortedFeaturesDistance[0].Distance;
                  let domainLargeValue = sortedFeaturesDistance[sortedFeaturesDistance.length-1].Distance;
                  let domainMiddleValue = (domainSmallValue + domainLargeValue) / 2;

                  heatmapColor = d3.scaleLinear()
                                       .domain([domainSmallValue, (domainSmallValue + domainMiddleValue)/2,  domainMiddleValue, (domainMiddleValue + domainLargeValue)/2, domainLargeValue])
                                       .range(["red", "#FF9999", "#FFFFCC", "#66B2FF", "#004C99"]);

                  // heatmapColor is function  scale(x)               
                  d3.select("#"+sortedFeaturesDistance[0].id).style('fill', d3.rgb(heatmapColor(sortedFeaturesDistance[0].Distance)));               

              }


 


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
                        let sortedFeaturesDistanceLen = sortedFeaturesDistance.length; // for best practise

                        for(let k = 1; k < sortedFeaturesDistanceLen; k++) {
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

                     if(Opts.isHeatmapColorManual){

                          //if($$("HeatmapBasedTech").getValue()=="Dist") { 

                                 let sortedFeaturesDistanceLen = sortedFeaturesDistance.length;  // for best practise

                                 for(let k = 1 ; k < sortedFeaturesDistanceLen; k++) {
                                       // to normalize-->  NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin 
                                       // since oldMin and NewMin = 0 
                                       // NewValue=OldValue*Newmax/oldMax 
                                       let hmapColorIndex = Math.round(sortedFeaturesDistance[k].Distance * (HeatmapRange.length-1) / sortedFeaturesDistance[sortedFeaturesDistance.length-1].Distance)
                                       d3.select("#" + sortedFeaturesDistance[k].id).style('fill', d3.rgb(HeatmapRange[hmapColorIndex]));     
                                       d3.select("#" + sortedFeaturesDistance[k].id).style('fill-opacity', getBoundaryFillOpacity());
                                 }

                          //}
                          //if($$("HeatmapBasedTech").getValue()=="FNN"){ 
                          //       fnnPrediction(allTilesFeatures);
                          //}                         

                     } else { // heatmap auto with scale function
                     
                         // if($$("HeatmapBasedTech").getValue()=="Dist"){ 

                                 let sortedFeaturesDistanceLen = sortedFeaturesDistance.length; // for best practise;

                                 for(let k = 1 ; k < sortedFeaturesDistanceLen; k++) {
                                      d3.select("#" + sortedFeaturesDistance[k].id).style('fill', d3.rgb(heatmapColor(sortedFeaturesDistance[k].Distance)));
                                      d3.select("#" + sortedFeaturesDistance[k].id).style('fill-opacity', getBoundaryFillOpacity());

                                 }

                          //}
                          //if($$("HeatmapBasedTech").getValue()=="FNN"){ 
                          //       fnnPrediction(allTilesFeatures);
                          //}                           
                     }   

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
    nodes +=             '<button onclick="createLoadFeatures()" style = "height:2.0vh; width:2.7vw; background-color: white" id="createLoadFeaturesBtn" disabled>Load</button>';
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
    nodes +=              '<input type="number" disabled min="0"   value="0" step="1" style="color: white; height:1.5vh;"  id="nearestTileMatching" onchange="nearestTileMatchingChanged()" onmouseover="nearestTileMatchingMouseOver()" />';
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
    nodes +=              '<input type="number" disabled min="0"   value="0" max="100" step="1" style="color: white; height:1.5vh;"  id="similarityThreshold" onchange="similarityThresholdChanged()" onmouseover="similarityThresholdMouseOver()" />';
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
  		nodes +=   	       '<label class="inputcontainer"><p>Layers</p><input type="radio" name="renderMode" value="layers" onclick="setCurDisplayOption(this)" /><span class="checkmark"></span></label>';
  		nodes +=         '</th>';	
  		nodes +=       '</tr>';			

  		// nodes +=         '</th>';

  		nodes +=       '<tr>';  
  		nodes +=         '<th >';
  		nodes +=   	       '<label class="inputcontainer"><p>Blend</p><input type="radio" name="renderMode" value="blend" onclick="setCurDisplayOption(this)" /><span class="checkmark"></span></label>';
  		nodes +=         '</th>';	
  		nodes +=       '</tr>';			

  		// nodes +=         '</th>';		


  		nodes +=       '<tr>';  
  		nodes +=         '<th >';
  		nodes +=   	       '<label class="inputcontainer"><p>Composite</p><input type="radio" name="renderMode" value="composite" checked onclick="setCurDisplayOption(this)"><span class="checkmark" /></span></label>';
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


//chnlNameType = [{"channel_name": "CD45", "channel_type" : "Immune"}, {"channel_name": "KERATIN", "channel_type" : "Tumor"}, 
//                {"channel_name": "ASMA", "channel_type" : "Stroma"}]
getCellsClassification = (chnlNameType, clusterMethod, othersTypeThreshold) => {  

       let groupData = []; 

       // e.g. "Structural Components__markers_morphology.csv" 
       let markersMorphFileName =  getGrpMarkersMorphFileName();
       let grpFeaturesFolder = getGrpFeaturesLocalPath();

       let allCellClassesResoponse = [];

       webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +  
        "/classifyCellsWithMaxIntensity", "&chnl_name_type=" + JSON.stringify(chnlNameType) +
        "&features_folder=" + grpFeaturesFolder + "&markers_morph_file=" + markersMorphFileName +
        // "&cell_undefined_threshold_value=" + Opts.cellUndefinedThresholdValue + 
        "&cell_undefined_threshold_value=" + othersTypeThreshold +         
        // "&clusterMethod=" + clusterMethod +
        "&cellFeatureToNormalize=" + Opts.cellFeatureToNormalize , function(response) {
        

             allCellClassesResoponse = JSON.parse(response);
      });

     return allCellClassesResoponse;
}




// getRandomSampleTSNE = (sample, chnlNameType, tsneDim) => {  // tsneDim is 2 dim or 3 dim 

//       let sampleTSNE = [];

//        webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +  
//         "/calculateRandomSampleTSNE", "&sample=" + JSON.stringify(sample) + 
//         "&chnl_name_type=" + JSON.stringify(chnlNameType) + 
//         "&tsne_dim=" + tsneDim , function(response) {
//              sampleTSNE = JSON.parse(response);
//       });

//      return sampleTSNE;
// }




// sample  = [{ id: "spx-1", KERATIN_norm: 1.91, CD45_norm: 9.20, ASMA_norm: 1.12, Max: "CD45_norm", Type: "Others", label: 1}, ..]
// chnlNameType = [{"channel_name": "CD45"}, {"channel_name": "KERATIN"},..]
// e.g. dimReducer : t-SNE, PCA, LDA or UMAP
// plotDim e.g. 2D/3D
calculateDimReductionRandomSample = (dimReducer, randomSample, chnlNames, plotDim) => {  // tsneDim is 2 dim or 3 dim 

      let dimReducerResult = [];

       webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +  
        "/calculateDimReductionRandomSample", "&dimReducer=" + dimReducer + 
        "&sample=" + JSON.stringify(randomSample) + 
        "&chnl_names=" + JSON.stringify(chnlNames) + 
        "&plotDim=" + plotDim , function(response) {
             dimReducerResult = JSON.parse(response);
      });

     return dimReducerResult;
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

// Check whether doing normalize(image, 1,99.8, axis=axis_norm) is feasible and will not return with memory issue
//-- To avoid MemoryError: Unable to allocate 4.61 GiB for an array with shape (40320, 30720) and data type float32
isChnlImgDataNormFeasible = () => {
      //-- check for free memory first to avoid out or memory problem with image normalize function
      let memoryData  = checkSysMemoryInGB();
      //-- memoryData e.g.:  {'totalMemory': 15.540470123291016, 'availableMemory': 1.372650146484375}
      //-- memoryData are in Gigabytes
      let floatSize = 32; // normalize data needs 64 float
      let totalImageFrameSizeInGB = currentItemInfo.width * currentItemInfo.height * floatSize/(1024*1024*1024);

      let safetyFactor  = 1; // double needed free memory
 
      return  (safetyFactor * totalImageFrameSizeInGB) >  memoryData['availableMemory'] ? false : true;
}

//Check for system total and free memory in Giga bytes
checkSysMemoryInGB = () => { 
       let memoryData;
       webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +  "/checkMemoryInGB", function(response) {
             memoryData = JSON.parse(response);
      });
      return memoryData;
}       


// In case Image Normalization during getAllSpxTilesFeature failed, try bypass it
bypassImageNormalization = () => {
   Opts.isChannelNormalizeRequired = ""; //-- "" is equv to false
   let metaKey = "settings";
   let metaValue = {"imageNorm": false };
   setItemMetadataKeyValue(metaKey, metaValue);
   createLoadFeatures();
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

       // if(Opts.isChannelNormalizeRequired) { 
       //    //-- if true check for free memory first to avoid out or memory problem with image normalize function
       //    Opts.isChannelNormalizeRequired = isChnlImgDataNormFeasible();
       //    if(!Opts.isChannelNormalizeRequired) {
       //        triggerHint(" Channels normalization Required flag is set to false due to insufficient free memory")
       //    } 

       // }
       

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
    // helpful when click cancel buttons
    restoreLastChartOperation = () => {
         document.getElementById("chartOperations").value = chartOptions.lastOperation;
         chartOptions.currentOperation = chartOptions.lastOperation;
         document.getElementById("chartContainer").innerHTML = chartOptions.lastContainerContent;
    }
    
    resetChartOperations = () => {
        // set chartOperations to histogram
        document.getElementById("chartOperations").value = "Histogram";
        //fire onchange
        document.getElementById("chartOperations").onchange();

        if( isPanelActive("chPlotsPanel") ) {    
            destroyChart();
            togglePanel(chPlotsPanel);
        } 

        //resetChartPlottingData()
        resetChartFirstAppearFlag();
        removeChartBottomLists();
        freezeInput("chartOperations", true);

        setAllChannelsOpacity();
        // clear side view bar and initiat active operations to false such that { Phenotypes: false, "Tumor-Immune-Stromal": false, Cluster: false }
        resetActiveOperationsListOnScreen();

    }


     validateActiveOperationOnScreen = (curActiveOperation) => {
           switch ( curActiveOperation) {

                 case 'Phenotypes':
                                {
                                  if(allValidPhenotypes.length && isOperationActiveOnScreen[curActiveOperation]) {
                                      return  curActiveOperation;
                                  } else {
                                      return null; 
                                  }
                                  break;
                                }  
           case 'Tumor-Immune-Stromal':
                                {  
                                  if(cellBasicClassification.length && isOperationActiveOnScreen[curActiveOperation]) {
                                      return  curActiveOperation;
                                  } else {
                                      return null; 
                                  }
                                  break;             
                                }  
          case 'Proteomic-Analysis':
                                {
                                  triggerHint("To be Coded ..");
                                  break;             
                                }                                                              
                  case 'Cluster':
                                {
                                  triggerHint("To be Coded ..");
                                  break;             
                                }  
                        default:
                                {
                                 
                                  return null;            
                                }                              
            }  
     }


   // initiation of  isOperationActiveOnScreen obj such that { Phenotypes: false, "Tumor-Immune-Stromal": false, Cluster: false }
   initiatActiveOperationsListOnScreen = () => {
        chartOperationsList.forEach( operation => {
                    if(operation["isCellColorChanger"]) { 
                       isOperationActiveOnScreen[operation.type] = false;
                    }
        })
   }

    resetActiveOperationsListOnScreen = () => {
       initiatActiveOperationsListOnScreen();
       initiatActiveSubOperationsListOnScreen();
       clearViewBar("grpFeaturesViewBar");
   }

   // isOperationActiveOnScreen obj such that { Phenotypes: true, "Tumor-Immune-Stromal": false, Cluster: false }
   setActiveOperationOnScreen = (operationType) => {
        initiatActiveOperationsListOnScreen();
        initiatActiveSubOperationsListOnScreen();
        isOperationActiveOnScreen[operationType] = true;
   } 

   // return e.g "Phenotypes" or "Tumor-Immune-Stromal"
   getActiveOperationOnScreen = () => {
        let activeOperation = Object.keys(isOperationActiveOnScreen).filter( operation => isOperationActiveOnScreen[operation])[0];
        return activeOperation ? activeOperation : null;
   }

   //-------SubOperation ----------//
   // initiation of  isSubOperationActiveOnScreen obj such that { phenotypeNeighbors: false, "basicCellTypeNeighbors": false }
   initiatActiveSubOperationsListOnScreen = () => {
        subOperationsList.forEach( subOperation => {
                    if(subOperation["isCellColorChanger"]) { 
                       isSubOperationActiveOnScreen[subOperation.type] = false;
                    }
        })
   }


   // isSubOperationActiveOnScreen obj such that { phenotypeNeighbors: true, "basicCellTypeNeighbors": false }
   setActiveSubOperationOnScreen = (subOperationType) => {
        initiatActiveSubOperationsListOnScreen();
        if(subOperationType) { // if the subOperationType is not null or simply its parent has subOperation
           isSubOperationActiveOnScreen[subOperationType] = true;
        }
   } 

   // return e.g "phenotypeNeighbors" or "basicCellTypeNeighbors"
   getActiveSubOperationOnScreen = () => {
        let activeSubOperation = Object.keys(isSubOperationActiveOnScreen).filter( operation => isSubOperationActiveOnScreen[operation])[0];
        return activeSubOperation ? activeSubOperation : null;
   }


   // return e.g "phenotype" or "Tumor-Immune-Stromal"
   getActiveSubOperationParent = (subOperation) => {

      return  subOperationsList.filter( subOperationEntry => subOperationEntry["type"] == subOperation)
                               .map(entry => entry["parent"])[0]; 
   }

   // return e.g "phenotypeNeighbors" or "basicCellTypeNeighbors"
   getActiveSubOperationFromParent = (parentOperation) => {
        
        let subOptype = subOperationsList.filter( subOperationEntry => subOperationEntry["parent"] == parentOperation )
                                          .map(entry => entry["type"])[0];

        return subOptype ? subOptype : null ; // if the parent has no subOperation or filter with undefined, return null
   }   
 //---------------------------------//

  requestChartOperationInfo = () => {
      let curOperationValue = document.getElementById("chartOperations").value;
      let operationEntry = chartOperationsList.filter( operation => operation.type === curOperationValue);
      triggerHint(operationEntry[0].description, "info", 7000);
  }

   getSelectedChartOperation = () => {
       return chartOptions.currentOperation;
   }

   resetChangeChartOperationDependency = () => {
       showSpecialBar("chPlotsPanel", false); 
       removeChartBottomLists();// lists model celltype, feature, marker
       showPanel("cellNavigator", false);    
       filteredNeighbors = {}; 
   }

   onChangeChartOperation = () => {
       resetChangeChartOperationDependency();
       let curChartOperation = document.getElementById("chartOperations").value;
       chartOptions.lastOperation = chartOptions.currentOperation;
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

                                        showLoadingIcon().then( result => {

                                                              triggerHint("Please wait while finding phenotypes ..."); 

                                                              // if (! isGrpChannelsStatisticalDataAvailable() ) {
                                                              //     setGrpChannelsStatisticalData( readJsonFile(getGrpBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 
                                                              // }
                                                             if (! isGrpChannelsStatisticalDataAvailable() ) {
                                                                if(Opts.isBoxplotChannelBased) {
                                                                   setGrpChannelsStatisticalData( readJsonFile(getGrpBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 

                                                                } else { // if it is cell based
                                                                    setGrpChannelsStatisticalData( readJsonFile(getGrpMarkerCellsBoxplotFileName(), getGrpBoxplotLocalPath() ) ); 
                                                                }
                                                             }                                                                
                                                              
                                                              cellPhenotypes(() => {
                                                                hideLoadingIcon();  
                                                                if(allValidPhenotypes.length) {
                                                                      setActiveOperationOnScreen(curChartOperation);

                                                                      let phenoBinaryName = {};
                                                                      allValidPhenotypes.forEach( subCellPhenotype => { 
                                                                                  if(subCellPhenotype.phenotypeName) {
                                                                                       phenoBinaryName[subCellPhenotype.binary] = subCellPhenotype.phenotypeName;
                                                                                  }                                      
                                                                      }) 

                                                                      let chartData = [];
                                                                      for(let i = 0; i < allValidPhenotypes.length; i++) {

                                                                           if(phenoBinaryName[allValidPhenotypes[i].binary]) { // if there is naming for binary
                                                                                chartData.push({name: phenoBinaryName[allValidPhenotypes[i].binary], data: [allValidPhenotypes[i].totalValidCellsNum*100/getTotalTilesNum()],  color: allValidPhenotypes[i].phenotypeColor});
                                                                           } else {
                                                                                chartData.push({name: allValidPhenotypes[i].binary, data: [allValidPhenotypes[i].totalValidCellsNum*100/getTotalTilesNum()],  color: allValidPhenotypes[i].phenotypeColor});
                                                                           }
                                                                      } 


                                                                       // init neighbors analysis and etc
                                                                       initChartOperationSideSpecialBar(curChartOperation);

                                                                      // drawCellPhenotypes3dCylinder(allValidPhenotypes); 
                                                                       drawCellPhenotypes3dColumnChart(chartData);  
                                                                     //  drawCellPhenotypesColumnChart(allValidPhenotypes);                                                            
                                                                     //drawCellPhenotypes3dPieChart(allValidPhenotypes);
                                                                     // drawCellPhenotypesPieGradientChart(allValidPhenotypes);
                                                                } 
                                                              })

                                                         }); 
                                                     
                                                                                              


 
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
       case 'Tumor-Immune-Stromal':
                            {  
                               if(cellBasicClassification.length) {
                                  // if cell classes exists due to previous run. 
                                  plotCellClassifications(cellBasicClassification); 

                               // } else if( isGrpChannelsNameTypeExist( getSelectedGrpIndex() ) ) {
                               //     confirmCellClassifySettings();
                               } else {
                                   initChartClassifyCellsForm();
                               }

                               break;             
                            } 
        case 'Proteomic-Analysis':
                            {
                              triggerHint("To be Coded ..");
                              //resetChangeChartOperationDependency();   <<<<<<<<<<--------- Ok
                              //setActiveOperationOnScreen(curChartOperation); <<<<<<<<<<--------- Ok
                              break;             
                            }                                                         
              case 'Cluster':
                            {
                              triggerHint("To be Coded ..");
                              //resetChangeChartOperationDependency();   <<<<<<<<<<--------- Ok
                              //setActiveOperationOnScreen(curChartOperation); <<<<<<<<<<--------- Ok
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

      // initiation of  isOperationActiveOnScreen obj such that { Phenotypes: false, "Tumor-Immune-Stromal": false, Cluster: false }
      // initiatActiveOperationsListOnScreen();

      if( isFeaturesLoaded() ) { 
         freezeInput("chartOperations", false);
      }       
  } 



  requestCellClassifyInfo = (elem) => {
     let cellType = elem.id.split('.')[1];
     let cellTypeEntry = mainCellTypesList.filter( entry => entry.cellType === cellType);
     triggerHint(cellTypeEntry[0].description, "info", 7000);       
  }

 getCurClusterMethod = () => {
    return document.getElementById("clusterMethodsList").value;
 }

 getOthersTypeThresholdVal = () => {
    return document.getElementById("thresholdBasedMethodsList").value;
 } 
 
  requestClusterMethodInfo = () => {
     let clusterMethod = getCurClusterMethod();
     let clusterMethodEntry = mainClusterMethods.filter( entry => entry.method === clusterMethod);
     triggerHint(clusterMethodEntry[0].description, "info", 7000);       
  }


  onChangeClusterMethod = () => {
     if(getCurClusterMethod() == "Threshold") {
         showOthersTypeThresholdList();
     } else {
         hideOthersTypeThresholdList();
     }

  }

  requestThresholdBasedMethodInfo = () => {
        triggerHint(" Select a threshold value used for the (Others) type, default value is 'mean'", "info", 7000);  
  }


  // Show list of values for "Others" type threshold possible values to select from
  showOthersTypeThresholdList = () => {
        document.getElementById("OthersTypeThresholdTableEntry").style.visibility = "visible";
  }

  hideOthersTypeThresholdList = () => {
        document.getElementById("OthersTypeThresholdTableEntry").style.visibility = "collapse";
  }

  // Plot the ColumnChart, the cell colors and viewbar
  // cellBasicClassification is array of  Objects such that:
  //[{id: "spx-1", KERATIN_norm: 1.4, CD45_norm: 6.5, ASMA_norm: 0.56, Max: "CD45_norm", Type: "Others", label:1},...]  
  plotCellClassifications = (cellsWithTypes, xTitle = 'Cell Classes') => {
       showLoadingIcon().then( result => {
          cellClassifications(cellsWithTypes, () => {
                hideLoadingIcon();  
                if(cellsWithTypes.length) {
                      
                      let numOfcellsPerClass = {};
                      let chnlNameType =  getGrpChannelsNameType(getSelectedGrpIndex());

                      chnlNameType.forEach((chnlNameTypeEntry, idx) => { 
                           let cellType = chnlNameTypeEntry.channel_type; // e.g. Tumor 
                           numOfcellsPerClass[cellType] = cellsWithTypes.filter(cell => cell.Type == cellType).length;
                      });

                      numOfcellsPerClass["Others"] = cellsWithTypes.filter(cell => cell.Type == "Others").length;
                      // NumOfCellsPerClass Object { Tumor: 21104, Immune: 28816, Stromal: 28934, Others: 26460 }

                      let curChartOperation = document.getElementById("chartOperations").value;
                      setActiveOperationOnScreen(curChartOperation);
                      // init edit settings and reassign markers to Tumor-Immune-Stromal operation
                      initChartOperationSideSpecialBar(curChartOperation);
                      
                      let cellTypeColors = getCellTypeColorObj(chnlNameType);
                      // return cellTypeColors obj: { Tumor: "#ff4846", ... }  

                      drawCellTypesColumnChart(numOfcellsPerClass, cellTypeColors,  xTitle); // second param is for x axis Title                                                            
                      // drawCellTypes3dPieChart(numOfcellsPerClass);
                     // drawCellTypesPieGradientChart(cellsWithTypes);
                } 
          }); 
       });   
  }

  cancelCellClassifySettings = () => {
     restoreLastChartOperation();
  }  



  confirmCellClassifySettings = () => {
     triggerHint("Please wait while classify cells... ");
     let chnlNameType = []; // chnlNameType : [{"channel_name": "CD45", "channel_type" : "Immune"}, ...]

      mainCellTypesList.forEach((cellTypeEntry, idx) => {   
              let cellType = cellTypeEntry.cellType; // e.g. Tumor 
              //-- let clr  = cellTypeEntry.cellTypeColor;          
              if(cellType !== "Others") { 

                  let marker = document.getElementById("markerList."+ cellType).value;  // return e.g. KERATIN or ""
                  if ( marker !== "" ) {
                     chnlNameType.push({channel_name: marker, channel_type: cellType})
                  }
              }

     });   
       

     if(chnlNameType.length) {
          
           switch ( getCurClusterMethod()) {
                   
                    case 'Threshold':  { 
                                          // Find the "Others" type selected threshold value
                                          let othersTypeThreshold = getOthersTypeThresholdVal();
                                          //  cellBasicClassification has each cell classification as Tumor, Immune, Stromal or others
                                          cellBasicClassification = getCellsClassification (chnlNameType, getCurClusterMethod(), othersTypeThreshold);
                                          break;             
                                        }
                      case 'K-Means':
                                        {
                                          triggerHint("K-Means to be Coded ..");
                                          return 0;
                                          break;             
                                        }                                                                    
          }  

          //cellBasicClassification is array of  Objects such that:
          //[{id: "spx-1", KERATIN_norm: 1.4, CD45_norm: 6.5, ASMA_norm: 0.56, Max: "CD45_norm", Type: "Others", label:1},...]

          allTilesFeaturesAndClassification = mergeArrayOfObjByKey('id', cellBasicClassification, allTilesFeatures);

          // upload channel types to server 
          setGrpChannelsNameType(getSelectedGrpIndex(), chnlNameType);
          // Eqv: currentItemInfo.omeDataset.Groups[getSelectedGrpIndex()].Channel_Types = chnlNameType;
          
          if(Opts.analysisModeAutoUpload) {
                uploadGrpChanges();
          }

          plotCellClassifications(cellBasicClassification);

      } else {
         triggerHint("Select related markers from lists e.g. CD45 for Immune.. ");
      }
  }

  editChartOperationSettings = () => {

        let curChartOperation = document.getElementById("chartOperations").value;
        chartOptions.lastOperation = chartOptions.currentOperation;

        switch ( curChartOperation) {
               case 'Tumor-Immune-Stromal':
                                    { 
                                      initChartClassifyCellsForm();
                                      break;             
                                    }
                  case 'Proteomic-Analysis':
                                    {
                                      triggerHint("To be Coded ..");
                                      break;             
                                    }                                                                    
                      case 'Cluster':
                                    {
                                      triggerHint("To be Coded ..");
                                      break;             
                                    }
                             default:
                                    {
                                      triggerHint("No edit option for this operation ..");
                                      break;             
                                    }                                        
        }  

      //  document.getElementById("chartOperationSettings").innerHTML = "";
 
  } 

  removeChartBottomLists = () => {
      document.getElementById("chartOperationSettings").innerHTML  = "";
  }

   cancelAnalysisSelection = () => {
      removeChartBottomLists();
  }

  // enableBasicAnalysisLists = () => {
  //       let allAnalysisLists = document.querySelectorAll('select.basicAnalysisList ');

  //       allAnalysisLists.forEach( list => {

  //            if(list.id !== "analysisMethodList") { 
  //               list.disabled = false;
  //            }
  //        })    
  // }

  disableBasicAnalysisLists = ( disableFlag = true ) => {
        let allAnalysisLists = document.querySelectorAll('select.basicAnalysisList ');

        allAnalysisLists.forEach( list => {

             if(list.id !== "analysisMethodList") { 
                list.disabled = disableFlag;
             }
         })  
  }
  
  resetBasicAnalysisLists = () => {
        let allAnalysisLists = document.querySelectorAll('select.basicAnalysisList ');

        allAnalysisLists.forEach( list => {

               if(list.id !== "analysisMethodList") {
                  list.value = "";
               }
         }) 
  }

  // disableBasicAnalysisLists = (arrOfLists, disableFlag) => {
  //       arrOfLists.forEach (listId => document.getElementById(listId).disabled = disableFlag); 

  // }

  analysisMethodListChanged = () => {
        let curSelection = document.getElementById("analysisMethodList").value;

        if(curSelection == "" || curSelection == "Correlation") {
               resetBasicAnalysisLists();
               disableBasicAnalysisLists();
               // document.getElementById("analysisCellTypeList").disabled = true;
        } else {
               disableBasicAnalysisLists(false);
               // document.getElementById("analysisCellTypeList").disabled = false;
        }
  }

  analysisCellTypeListChanged = () => {
        let curSelection = document.getElementById("analysisCellTypeList").value;

        if(curSelection == "") {
               resetBasicAnalysisLists();
               document.getElementById("analysisMorphFeatureList").disabled = true;
               document.getElementById("analysisMarkerList").disabled = true;
        } else {
               document.getElementById("analysisMorphFeatureList").disabled = false; 
               document.getElementById("analysisMarkerList").disabled = false;
        }
  }

  analysisMorphFeatureListChanged = () => {
        let curSelection = document.getElementById("analysisMorphFeatureList").value;

        if(curSelection == "") {
               document.getElementById("analysisMarkerList").disabled = false;
        } else {
               document.getElementById("analysisMarkerList").disabled = true;
        }
  }

  // marker list with no selection enable feature list
  analysisMarkerListChanged = () => {
        let curSelection = document.getElementById("analysisMarkerList").value;

        if(curSelection == "") {
               document.getElementById("analysisMorphFeatureList").disabled = false;
        } else {
               document.getElementById("analysisMorphFeatureList").disabled = true;
        }
  }


   //   // Plot t-SNE for random samples 
   //   processBasicAnalysisTSNE = (analysisSelections, is3D = false) => {
   //      // let curCellTypes = analysisSelections["analysisCellTypeListValue"]; // e.g. [ "Tumor", "Immune", "Stromal" , "Others"]

   //      let filteredData = {};

        
   //      let chnlNameType =  getGrpChannelsNameType(getSelectedGrpIndex());
   //      // chnlNameType is array of object: [{"channel_name": "CD45", "channel_type" : "Immune"}, ...]    

   //      let selectedMarkers =  chnlNameType.map(entry => entry["channel_name"])
   //      //e.g. selectedChType: [ "KERATIN", "CD45", "ASMA" ]

   //      let selectedChTypes =  chnlNameType.map(entry => entry["channel_type"])
   //      selectedChTypes.push("Others");        
   //      //e.g. selectedChTypes: [ "Tumor", "Immune", "Stromal", "Others" ] or   [ "Tumor", "Others" ]     

   //      let cellTypeColors = getCellTypeColorObj(chnlNameType);
   //      // return cellTypeColors obj: { Tumor: "#ff4846", ... }  


   //      let filterByType = {};
   //      //e.g  filterByType { Tumor: [..], Immune: [..], ... }
   //      // where the array represent the seleted features values e.g. KERATIN_norm,  CD45_norm , ASMA_norm   

   //      selectedChTypes.forEach(type => {
   //          filterByType[type] = cellBasicClassification.filter(entry => entry.Type == type)
   //      })

   //      //-- e.g  filterByType { Tumor: [..], Immune: [..], ... }
   //      // Where the array represent the seleted features values e.g. KERATIN_norm,  CD45_norm , ASMA_norm         
       

   //      //-- e.g. numSamplesPerType : 1000
   //      let numSamplesPerType = Opts.numSamplePerType;

   //      let typeSamples = {};
   //      //-- filteredTypeSamples: { Tumor: (150) [[ 26.8, 9.6, 12.4 ], [..], ..], Immune: (150) […], Stromal: (150) […] }        

   //      selectedChTypes.forEach(type => {
   //              if(numSamplesPerType < filterByType[type].length) {
   //                 typeSamples[type] =  _.sample(filterByType[type], numSamplesPerType);  
   //              } else {
   //                  if(filterByType[type].length) { // if there is cells with this type
   //                      typeSamples[type] =  filterByType[type];
   //                  } else {
   //                      typeSamples[type] =  [];
   //                  }
   //              }
   //      });
   //      //-- typeSamples: { Tumor: (1000) [..], Immune: (1000) […], Stromal: (1000) […], .. }

   //      allTypeSamples = [];

   //      selectedChTypes.forEach(type => {
   //               allTypeSamples = fastArraysConcat(allTypeSamples, typeSamples[type]) 
   //      });   

   //      //--allTypeSamples: Array(600) [ {…}, {…}, {…}, {…} ]
   //      //--allTypeSamples[0] : { Type: "Tumor", ASMA_norm: 2.58, CD45_norm: 6.93, KERATIN_norm: 81.24, label: 87224, id: "spx-87224", eccentricity: 0.92, … }


   //      let jsonString_allTypeSamples = JSON.stringify(allTypeSamples); // convet object to JSON string e.g. {id: 1} -> {"id": 1}
   //      let maxFileSize = Opts.maxFileSize;  // default 500000 size to send it to flask and avoid javascript syntaxerror "the url is malformed "

   //      if(jsonString_allTypeSamples.length < maxFileSize) {

   //          try {
   //          // Calculate t-SNE for the sample
   //          triggerHint("Please wait while calculating TSNE for sample ");
   //          if(is3D) {
   //             allTypeSamples =  getRandomSampleTSNE(allTypeSamples, chnlNameType, 3);
   //          } else {
   //             // 2D t-SNE 
   //             allTypeSamples =  getRandomSampleTSNE(allTypeSamples, chnlNameType, 2);
   //          }
 
   //          //--{ id: "spx-25603", KERATIN_norm: 157.28, CD45_norm: 3.74, ASMA_norm: 2.07, Max: "KERATIN_norm", Type: "Tumor", label: 25603, tsne_x: -28.05, tsne_y: -19.51 }


   //          } catch(err) {
   //                let rowSize = JSON.stringify(allTypeSamples[0]).length;
   //                let RecommendNumRows = Math.round(500000/rowSize);
   //                triggerHint("Sample size is too large for passing to RestApi "  + 
   //                            ",try to minimize total sample size to : " + RecommendNumRows, "info", 7000);  
                  
   //                return 0;
   //          }

   //          // File scatterData and plot
   //          let scatterData = [];
   //          //-- scatterData [{ name: Tumor, color: TumorCOlor, data: [[100, 161], [175, 122] .. ] }, {...}]  
 
   //          selectedChTypes.forEach(type => {
   //             let filterSampleByTypeAndTSNE; 

   //             if(is3D) {
   //                  filterSampleByTypeAndTSNE = allTypeSamples.filter(entry => entry.Type == type)
   //                                                               .map(entry => [entry["tsne_x"], entry["tsne_y"], entry["tsne_z"]]);
   //             } else {
   //               // is 2D
   //                  filterSampleByTypeAndTSNE = allTypeSamples.filter(entry => entry.Type == type)
   //                                                               .map(entry => [entry["tsne_x"], entry["tsne_y"]]);                 
   //             }                                            

   //             scatterData.push({name: type, color: cellTypeColors[type], data: filterSampleByTypeAndTSNE });
   //          });

   //          if(is3D) {
   //              //--For 2D  scatterData [{ name: Tumor, color: TumorCOlor, data: [[100, 161], [175, 122] .. ] }, {...}] 
   //              drawScatterChart3D(scatterData, "Random Sample " + allTypeSamples.length + " Cells" , "t-SNE-x", "t-SNE-y", "t-SNE-z"); 

   //          } else {
   //              //--For 2D  scatterData [{ name: Tumor, color: TumorCOlor, data: [[100, 161], [175, 122] .. ] }, {...}] 
   //              drawScatterChart(scatterData, "Random Sample " + allTypeSamples.length + " Cells" , "t-SNE-x" + "( Sample #" + allTypeSamples.length+")", "t-SNE-y"); 
   //          }    


   //      } else {
   //            let rowSize = JSON.stringify(allTypeSamples[0]).length;
   //            let RecommendNumRows = Math.round(500000/rowSize);
   //            triggerHint("Sample size is too large for passing to RestApi "  + 
   //                        ",try to minimize total sample size to : " + RecommendNumRows, "info", 7000);  
              
   //            return 0;         
   //      }

   // }


    //-- curCellType  e.g. [ "Tumor", "Immune", "Stromal" ] or [ "Tumor", "Immune", "Stromal" , "Others"]
    // e.g.  jStat.spearmancoeff([1, 2, 3, 4], [5, 6, 9, 7]) == 0.8;
    processBasicAnalysisCorrelation = (curCellType) => {
        let allMorphFeatures = cellMorphFeatureList.map(entry => {
                                        return entry.morphFeature
                                    });
        //-- allMorphFeatures = [ "area", "eccentricity", "extent", "orientation", "solidity", ... ]

        let allMarkers = getCurGrpChannelsName();
        //-- allMarkers e.g.:  [ "DAPI", "KERATIN", "ASMA", "CD45", "IBA1" ]

        // let filteredData = {};
        let corrDataToPlot = [];


        let extractedFeatures = [];

        let featToPlot =  "norm";

        allTilesFeaturesAndClassification.forEach(cellEntry => {
               let temp = {};
               cellEntry.features.forEach(featEntry => {
                      // temp[featEntry.Frame + "_" + featToPlot] = featEntry[featToPlot];
                      temp[featEntry.Frame] = featEntry[featToPlot];
               }) 
               // -- temp e.g. {DAPI_norm: 25.85, KERATIN_norm: 1.91, … }
               // --OR for simplicity:  temp e.g. {DAPI: 25.85, KERATIN: 1.91, … }
                
               allMorphFeatures.forEach(morphFeat => {
                   //-- Refine category names around heatmap chart
                   if(morphFeat === 'major_axis_length') {
                       temp['majorAxis'] = cellEntry[morphFeat];

                   } else if(morphFeat === 'minor_axis_length') {
                       temp['minorAxis'] = cellEntry[morphFeat];

                   } else {
                       temp[morphFeat] = cellEntry[morphFeat];
                   }                   
                   
               })
               // -- temp e.g. {DAPI: 25.85, KERATIN: 1.91, … , area: 807, eccentricity: 0.83, extent: 0.61, orientation: 130.7, solidity: 0.98, … }

               temp["id"] = cellEntry["id"];
               temp["Type"] = cellEntry["Type"];

               extractedFeatures.push(temp);
        })        

         
        //-- extractedFeatures e.g:  Object { id: "spx-1", area: 807, eccentricity: 0.83, extent: 0.61, orientation: 130.7, solidity: 0.98, major_axis_length: 43.77, minor_axis_length: 24.09, DAPI: 25.85, KERATIN: 1.91, … }

        if(extractedFeatures.length) {

            //--- _.sample(extractedFeatures, numSamplesPerType)

            enforcedTriggerHint("Please wait while calculating features correlation..").then( result => {

                let allFeatKeysArr = Object.keys(extractedFeatures[0]);
                removeArrayElem(allFeatKeysArr, 'id');
                removeArrayElem(allFeatKeysArr, 'Type');

                allFeatKeysArr.forEach((feat1Key, idx1) => { //--feat1Key e.g. 'area'
                    let feat1ValArr = extractedFeatures.map(entry => entry[feat1Key]);
                    //-- feat1ValArr e.g. [ 807, 746.5, 263, 137, 318.5, 1139.5, 226.5, 175, 321, 478, … ]

                    allFeatKeysArr.forEach((feat2Key, idx2) => {
                        let corrVal;
                        if(idx2 == idx1) {
                            //--Corr = 1 for same feature
                            corrVal = 1;

                        } else {
                            let feat2ValArr = extractedFeatures.map(entry => entry[feat2Key]);
                            //-- feat1ValArr e.g. [ 807, 746.5, 263, 137, 318.5, 1139.5, 226.5, 175, 321, 478, … ]
                            // find correlation
                            corrVal = jStat.spearmancoeff(feat1ValArr, feat2ValArr);
                            corrVal = corrVal.toFixed(2);
                        }
                        
                        corrDataToPlot.push([idx1, idx2, corrVal]);

                    }) 

                }) 
           
                drawCellTypesFeaturesCorrHeatmap(corrDataToPlot, allFeatKeysArr);
                closeHint();
            });    

        } else {
            triggerHint(" No data found for correlation ..");

        }


        // if(curCellType.length) {
        //     featureToPlot = curMorphFeature;

        //     curCellType.forEach(type => { // e.g. type : [ "Tumor", "Immune", "Stromal" ]
        //        filteredData[type] = allTilesFeaturesAndClassification.filter(entry => entry.Type == type)
        //                             .map(entry => entry[curMorphFeature]);
        //     })

        //     //** filteredData e.g. { Tumor: [ 163, 194, 195, … ] , Immune: [ 519, 316.5, 170, … ], ...}
        // }

        // if(curMarker) {
        //     featureToPlot = curMarker;
        //     // Remove first char "_" from feature name
        //     let markerValue = Opts.cellFeatureToNormalize.substring(1); // select from  _mean, _max, _std, _nonzero_mean

        //     curCellType.forEach(type => { // e.g. type : [ "Tumor", "Immune", "Stromal" ]
        //        filteredData[type] = allTilesFeaturesAndClassification.filter(entry => entry.Type == type)
        //                             .map(entry => entry.features.filter(entry => entry.Frame == curMarker))
        //                             .map(entry => entry[0][markerValue]);
        //     })
        // }        

        // // testCellTypeHistogramDraw();


    }



   processBasicAnalysisHistogram = (analysisSelections) => {
        let curMethod  = analysisSelections["analysisMethodListValue"];
        let curCellType = analysisSelections["analysisCellTypeListValue"]; // e.g. [ "Tumor", "Immune", "Stromal" ] or [ "Tumor", "Immune", "Stromal" , "Others"]
        let curMorphFeature = analysisSelections["analysisMorphFeatureListValue"];
        let curMarker = analysisSelections["analysisMarkerListValue"];
        let filteredData = {};
        let featureToPlot;


        if(curMorphFeature) {
            featureToPlot = curMorphFeature;

            curCellType.forEach(type => { // e.g. type : [ "Tumor", "Immune", "Stromal" ]
               filteredData[type] = allTilesFeaturesAndClassification.filter(entry => entry.Type == type)
                                    .map(entry => entry[curMorphFeature]);
            })

            //** filteredData e.g. { Tumor: [ 163, 194, 195, … ] , Immune: [ 519, 316.5, 170, … ], ...}
        }

        if(curMarker) {
            featureToPlot = curMarker;
            // Remove first char "_" from feature name
            let markerValue = Opts.cellFeatureToNormalize.substring(1); // select from  _mean, _max, _std, _nonzero_mean

            curCellType.forEach(type => { // e.g. type : [ "Tumor", "Immune", "Stromal" ]
               filteredData[type] = allTilesFeaturesAndClassification.filter(entry => entry.Type == type)
                                    .map(entry => entry.features.filter(entry => entry.Frame == curMarker))
                                    .map(entry => entry[0][markerValue]);
            })
        }        

        // testCellTypeHistogramDraw();
        drawCellTypesHistogramChart(filteredData, featureToPlot);

   }

   // Confirm basic cell classification analysis selection
   confirmBasicAnalysisSelection = () => {

         if(allTilesFeaturesAndClassification.length) {
            // initialize the obj ..
            let curAnalysisSelections = { analysisMethodListValue: null, 
                                          analysisCellTypeListValue: null, 
                                          analysisMorphFeatureListValue: null, 
                                          analysisMarkerListValue: null};

            let allAnalysisLists = document.querySelectorAll('select.basicAnalysisList ');

            allAnalysisLists.forEach( list => {

                 if(list.value !== "") { 
                    curAnalysisSelections[list.id + "Value"] = list.value;
                 } else {
                    curAnalysisSelections[list.id + "Value"] = null;
                 }
             })          
            
            // Get current selected method from method list e.g t-SNE
            let curMethod = curAnalysisSelections["analysisMethodListValue"];

            switch (curMethod ) {
                           
                          case 'Correlation':
                                        {
                                         //check to see if Others type is inluded with analysis or no  
                                         let excludeType = Opts.exclude_Others_TypeInAnalysis ? "Others" : null;

                                          curAnalysisSelections["analysisCellTypeListValue"] 
                                              =  mainCellTypesList.filter(entry => entry.cellType != excludeType).map(entry => entry.cellType);
                                                //should return  [ "Tumor", "Immune", "Stromal" ]
                                          
                                          processBasicAnalysisCorrelation(curAnalysisSelections["analysisCellTypeListValue"]);                 

                                          break;           
                                        }
                          case 'Heatmap':
                                        {
                                          triggerHint("To be Coded ..");
                                          break;             
                                        }                                     
                          // case 't-SNE':
                          //               {
                          //                 curAnalysisSelections["analysisCellTypeListValue"]= mainCellTypesList.map(entry => entry.cellType);                                            

                          //                 processBasicAnalysisTSNE(curAnalysisSelections); 
                          //                 break;             
                          //               }  
                          // case 't-SNE-3D':
                          //               {
                          //                 curAnalysisSelections["analysisCellTypeListValue"]= mainCellTypesList.map(entry => entry.cellType);                                            
                          //                 let enable3D = true; 
                          //                 processBasicAnalysisTSNE(curAnalysisSelections, enable3D); 
                          //                 break;             
                          //               }                                         
                          case 'Histogram':
                                        { 
                                          if( (curAnalysisSelections["analysisMethodListValue"] != null) && (curAnalysisSelections["analysisCellTypeListValue"] != null) &&
                                            ( (curAnalysisSelections["analysisMorphFeatureListValue"] != null) || (curAnalysisSelections["analysisMarkerListValue"] != null)) ) {

                                                 if(curAnalysisSelections["analysisCellTypeListValue"] === "All") {
                                                    //check to see if Others type is inluded with analysis or no  
                                                    let excludeType = Opts.exclude_Others_TypeInAnalysis ? "Others" : null;

                                                     curAnalysisSelections["analysisCellTypeListValue"] 
                                                      =  mainCellTypesList.filter(entry => entry.cellType != excludeType).map(entry => entry.cellType);
                                                        //should return  [ "Tumor", "Immune", "Stromal" ]
                                                 } else {
                                                     // if one cellType selected, make it an array of one element e.g. ["Tumor"] 
                                                     curAnalysisSelections["analysisCellTypeListValue"] = [ curAnalysisSelections["analysisCellTypeListValue"] ];
                                                 }

                                                 processBasicAnalysisHistogram(curAnalysisSelections);                 
                                             
                                          } else {
                                              triggerHint("Please select method, cell-Type and a feature (OR) marker..");
                                          }

                                          break;             
                                        }                                                                                 
            }  // END OF SWITCH() 

        } else {
            triggerHint("No classification data found.. ");
        }
  }


  // For Tumor-Immune-Stroml analysis mode
  initBasicCellClassificationAnalysisMode = (operationType) => {

      chartOptions.lastContainerContent = document.getElementById("chartContainer").innerHTML;

      let nodes = ""; 

      nodes +=  '<table>';
      nodes +=    '<colgroup><col style="width:25%"><col style="width:25%"><col style="width:25%"><col style="width:25%"></colgroup>';
      nodes +=    '<tr>';
      nodes +=      '<th style="text-align: left; margin-left: 0vw;"><label style="margin-left: 0.69vw">Method</label></th>';
      nodes +=      '<th style="text-align: left"><label style="margin-left: 0.69vw">Cell-Type</label></th>';
      nodes +=      '<th style="text-align: left"><label style="margin-left: 0.69vw">Feature</label></th>'
      nodes +=      '<th style="text-align: left"><label style="margin-left: 0.69vw">Marker</label></th>'    
      nodes +=    '</tr>';

      // Initiat list of methods to choose from 
      nodes +=    '<tr>';
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="analysisMethodList" class="basicAnalysisList" onChange = "analysisMethodListChanged()" style="width:70%; margin-left: 0.69vw; font-size: 0.52vw; -webkit-appearance: none;"  >`;

      analysisMethods.forEach((methodEntry, idx) => {   
            let method = methodEntry.method; // e.g. t-SNE   

            if(idx == 0) {
               // create empty entry with the select list 
               nodes +=    `<option value=""></option>`; 
            }  
                          
            nodes +=    `<option value=${method}>${method}</option>`; 
      })

      nodes +=         '</select>'; 
      nodes +=      '</th>';


      // Initiat list of cell-types to choose from 
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="analysisCellTypeList" class="basicAnalysisList" onChange = "analysisCellTypeListChanged()" style="width:70%; margin-left: 0.69vw; font-size: 0.52vw; -webkit-appearance: none;"  disabled>`;

      mainCellTypesList.forEach((cellTypeEntry, idx) => {   
          let cellType = cellTypeEntry.cellType; // e.g. Tumor   

            if(idx == 0) {
               // create empty entry with the select list 
               nodes +=    `<option value=""></option>`; 
            }  
            // Exclude "Others" from list 
            if(cellType !== "Others") {              
                  nodes +=    `<option value=${cellType}>${cellType}</option>`; 
            } 
      })
      
      nodes +=    `<option value=All>All</option>`; 
      nodes +=         '</select>'; 
      nodes +=      '</th>';   

      // Initiat list of morphological features to choose from 
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="analysisMorphFeatureList" class="basicAnalysisList" onChange = "analysisMorphFeatureListChanged()" style="width:70%; margin-left: 0.69vw; font-size: 0.52vw; -webkit-appearance: none;" disabled >`;

      cellMorphFeatureList.forEach((morphEntry, idx) => {   
          let morphFeature = morphEntry.morphFeature; // e.g. Tumor   

            if(idx == 0) {
               // create empty entry with the select list 
               nodes +=    `<option value=""></option>`; 
            }  
                          
            nodes +=    `<option value=${morphFeature}>${morphFeature}</option>`; 
      })
      
      // nodes +=    `<option value=All>All</option>`; // used for correlation
      nodes +=         '</select>'; 
      nodes +=      '</th>';  


      // Initiat list of markers to choose from 
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="analysisMarkerList" class="basicAnalysisList" onChange = "analysisMarkerListChanged()" style="width:70%; margin-left: 0.69vw; font-size: 0.52vw; -webkit-appearance: none;" disabled >`;

      getCurGrpChannelsName().forEach((marker, idx) => {
            if(idx == 0) {
               // create empty entry with the select list 
               nodes +=    `<option value=""></option>`; 
            }  
                          
            if(marker !== getSelectedDAPIChannelName()) {
                nodes +=    `<option value=${marker}>${marker}</option>`; 
            }
      });
      
      // nodes +=    `<option value=All>All</option>`; 
      nodes +=         '</select>'; 
      nodes +=      '</th>';   
      nodes +=  '</tr>';                       


      nodes +=  '</table>';                

      nodes +=  '<hr style="margin-bottom: 1vh;">';
      nodes +=  '<table>';
      nodes +=    '<colgroup><col style="width:50%"><col style="width:50%"></colgroup>';
      nodes +=    '<tr>';   
      nodes +=      '<th><i style="font-size:1vw"  onclick="confirmBasicAnalysisSelection()"  class="fa fa-check-circle"></i></th>';
      nodes +=      '<th><i style="font-size:1vw"  onclick="cancelAnalysisSelection()" class="fa fa-times-circle"></i></th>';      
      nodes +=    '</tr>';  
      nodes +=  '</table>';  

           
      document.getElementById("chartOperationSettings").innerHTML  = nodes;

  }

//----------------------------------------------------------------------------//
//--------------------------- Neighbor Analysis  -----------------------------//
//----------------------------------------------------------------------------//

  /**
   * Calculate Cells Distance in pixels or image coordinates
   *
   * @since 1.0.0
   * @category Object
   * @param {Object}  The source point e.g. cell1 = {x_cent: 2126, y_cent:313}
   * @param {Object}  The target point  e.g. cell2 = {x_cent: 2175, y_cent: 310}
   * @returns {number} Returns the distance between both centroids.
   * @example
   *
   * computeCellsDistance({x_cent: 2126, y_cent:313},{x_cent: 2175, y_cent: 310})
   * // => 49.092
   *
   */  

  computeCellsDistance = (cell1, cell2) => {
         return  Math.sqrt( Math.pow( (cell2.x_cent - cell1.x_cent), 2) + Math.pow( (cell2.y_cent - cell1.y_cent), 2) );
  }

  requestNeighborAnalysisInfo = () => {
      triggerHint("Find neighbor cells or target cells to the source selected "  + 
                  "cell-type within selected distance of pixels in image coordinates  ", "info", 7000);       
  }

  cancelNeighborSelection = () => {
       removeChartBottomLists();
  }  


  neighborSourceListChanged = () => {
        let curSourceType = document.getElementById("neighborSourceList").value;

        if(curSourceType !== "") {
            document.getElementById("targetNeighborList").disabled = false;
            document.getElementById("neighborDistanceList").disabled = false;
            document.getElementById("neighborNumList").disabled = false;
        } else {
            document.getElementById("targetNeighborList").disabled = true;
            document.getElementById("neighborDistanceList").disabled = true;
            document.getElementById("neighborNumList").disabled = true;
        }

  }  




  targetNeighborListChanged = () => {
        let curNeighbor = document.getElementById("targetNeighborList").value;

        if(curNeighbor !== "") {
           // to be coded
        }
  }

  neighborDistanceListChanged = () => {
        let cellsDistance = document.getElementById("neighborDistanceList").value;

        if(cellsDistance !== "") {
           // to be coded
        }
  } 

  requestNeighborFilterInfo = () => {
     triggerHint("To visualize selected cell-Type and its neighbors of selected neighbor types within a certain selected distance between both and a certain number of neighbors");
  }


    // For Tumor-Immune-Stromal/Phenotypes/etc  
    initCellTypesNeighborsAnalysis = (cellTypesList, curChartOperation) => { 

      chartOptions.lastContainerContent = document.getElementById("chartContainer").innerHTML;

      let nodes = ""; 

      nodes +=  '<table>';
      // nodes +=    '<tr>';
      // nodes +=      '<th style="text-align: left; margin-left: 0vw;"><label style="margin-left: 0.69vw">Neighbors Analysis</label></th>';   
      // nodes +=    '</tr>';        
      nodes +=    '<colgroup><col style="width:23%"><col style="width:23%"><col style="width:23%"><col style="width:23%"><col style="width:8%"></colgroup>';

      nodes +=    '<tr>';
      nodes +=      '<th style="text-align: left; margin-left: 0vw;"><label style="font-size:0.60vw; margin-left: 0.69vw">Cell-Type</label></th>';
      nodes +=      '<th style="text-align: left"><label style="font-size:0.60vw; margin-left: 0.69vw">Neighbor</label></th>';
      nodes +=      '<th style="text-align: left"><label style="font-size:0.60vw; margin-left: 0.69vw"># Neighbor</label></th>';      
      nodes +=      '<th style="text-align: left"><label style="font-size:0.60vw; margin-left: 0.69vw">Distance</label></th>'
      nodes +=      '<th style="text-align: left"><label style="font-size:0.60vw; margin-left: 0.69vw"></label></th>'      
      nodes +=    '</tr>';


      // Initiat list of cell-types to choose from  to find their neighbors
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="neighborSourceList" class="neighborList" onChange = "neighborSourceListChanged()" style="width:70%; margin-left: 0.69vw; font-size: 0.52vw; -webkit-appearance: none;" >`;

      cellTypesList.forEach((cellTypeEntry, idx) => {   
          let cellType = cellTypeEntry.cellType; // e.g. Tumor   

            if(idx == 0) {
               // create empty entry with the select list 
               nodes +=    `<option value=""></option>`; 
            }  
            // Exclude "Others" from list 
            if(cellType !== "Others") {     
                  if(cellTypeEntry.phenotypeName) {
                       nodes +=    `<option value=${cellType}>${cellTypeEntry.phenotypeName}</option>`; 
                  } else {
                       nodes +=    `<option value=${cellType}>${cellType}</option>`; 
                  }         

            } 
      })
      
      nodes +=         '</select>'; 
      nodes +=      '</th>';   

      // Initiat list of neighbors cells to choose from 
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="targetNeighborList" class="neighborList" onChange = "targetNeighborListChanged()" style="width:70%; margin-left: 0.69vw; font-size: 0.52vw; -webkit-appearance: none;" disabled >`;

      cellTypesList.forEach((cellTypeEntry, idx) => {   
          let cellType = cellTypeEntry.cellType; // e.g. Tumor   

            if(idx == 0) {
               // create empty entry with the select list 
               nodes +=    `<option value=""></option>`; 
            }  
            // Exclude "Others" from list 
            if(cellType !== "Others") {              
                  if(cellTypeEntry.phenotypeName) {
                       nodes +=    `<option value=${cellType}>${cellTypeEntry.phenotypeName}</option>`; 
                  } else {
                       nodes +=    `<option value=${cellType}>${cellType}</option>`; 
                  } 
            } 
      })

      // getCurGrpChannelsName().forEach((marker, idx) => {
      //       if(idx == 0) {
      //          // create empty entry with the select list 
      //          nodes +=    `<option value=""></option>`; 
      //       }  
                          
      //       if(marker !== getSelectedDAPIChannelName()) {
      //           nodes +=    `<option value=${marker}>${marker}</option>`; 
      //       }
      // });
      
      nodes +=         '</select>'; 
      nodes +=      '</th>';   


      // Initiat list of Neighbor numbers to choose from, e.g. find cell with 3 neighbors of immune type
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="neighborNumList" class="neighborList" onChange = "neighborNumListChanged()" style="width:70%; margin-left: 0.69vw; font-size: 0.52vw; -webkit-appearance: none;" disabled >`;

      for(let num = Opts.minNumOfCellNeighbors; num <= Opts.maxNumOfCellNeighbors; num++ ) {
          nodes +=          `<option value=${num} > = ${num} </option>`;   // zero neighbores for cells that has no neighbors of the type    
      }

      nodes +=          `<option value=-1 selected> Any</option>`;                 
      nodes +=        '</select>'; 
      nodes +=      '</th>';   



      // Initiat list of distances to choose from, distance in pixels or image coordinates. e.g. cell id =2  x-cent: 2126, y-cent: 313
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="neighborDistanceList" class="neighborList" onChange = "neighborDistanceListChanged()" style="width:70%; margin-left: 0.69vw; font-size: 0.52vw; -webkit-appearance: none;" disabled >`;
      nodes +=          `<option value=10 > < 10 (px)</option>`; 
      nodes +=          `<option value=20 > < 20</option>`; 
      nodes +=          `<option value=30 > < 30</option>`; 
      nodes +=          `<option value=40 > < 40</option>`;                         
      nodes +=          `<option value=50 > < 50</option>`; 
      nodes +=          `<option value=75 > < 75</option>`;       
      nodes +=          `<option value=100 > < 100</option>`;    
      nodes +=          `<option value=200 > < 200</option>`; 
      nodes +=          `<option value=0 selected> Any</option>`;                 
      nodes +=        '</select>'; 
      nodes +=      '</th>';   
                    


      // Initiat list of distances to choose from, distance in pixels or image coordinates. e.g. cell id =2  x-cent: 2126, y-cent: 313
      nodes +=      '<th style="text-align: left">'; 
      nodes +=          '<a href="javascript:void(0)" onclick="requestNeighborFilterInfo()"><i style="font-size:1vw;" class="fa fa-info-circle"></i></a>';
      nodes +=      '</th>';   
      nodes +=  '</tr>';   


      nodes +=  '</table>';                

      nodes +=  '<hr style="margin-bottom: 1vh;">';
      nodes +=  '<table>';
      nodes +=    '<colgroup><col style="width:50%"><col style="width:50%"></colgroup>';
      nodes +=    '<tr>';   
      nodes +=      '<th><i style="font-size:1vw" id="confirmNeighborSelectionId"   class="fa fa-check-circle"></i></th>';
      nodes +=      '<th><i style="font-size:1vw"  onclick="cancelNeighborSelection()" class="fa fa-times-circle"></i></th>';      
      nodes +=    '</tr>';  
      nodes +=  '</table>';  

           
      document.getElementById("chartOperationSettings").innerHTML  = nodes;

      document.getElementById("confirmNeighborSelectionId").addEventListener('click', function() {
            confirmNeighborSelection(curChartOperation);

      });   


    }


    cellTypesNeighborsAnalysis = () => {

        let curChartOperation = document.getElementById("chartOperations").value;
        chartOptions.lastOperation = chartOptions.currentOperation;

        switch ( curChartOperation) {
                    case 'Phenotypes':
                                     { 
                                      let cellTypeList = allValidPhenotypes.map(entry => ( {cellType: entry.binary, phenotypeName: entry.phenotypeName} ));
                                      //-- allValidPhenotypes is Obj: [{ binary: "00000", validCells: (1) […], totalValidCellsNum: 1, phenotypeColor: "#ff0000" }, ...]
                                      //-- Above map retuens new Obj: [ { cellType: "00000" }, { cellType: "10000" },  ... ]

                                      initCellTypesNeighborsAnalysis(cellTypeList, curChartOperation); // Send the dict and the curChartOperation
                                      break;             
                                     }             
               case 'Tumor-Immune-Stromal':
                                    { 
                                      initCellTypesNeighborsAnalysis(mainCellTypesList, curChartOperation); // Send the dict and the curChartOperation
                                      break;             
                                    }  
                  case 'Proteomic-Analysis':
                                    {
                                      triggerHint("To be Coded ..");
                                      break;             
                                    }                                                                
                      case 'Cluster':
                                    {
                                      triggerHint("To be Coded ..");
                                      break;             
                                    }
                             default:
                                    {
                                      triggerHint("No Neighbors Analysis option for this operation ..");
                                      break;             
                                    }                                        
        }  

    }

// Draw all sources cells and thier neighbors 
drawAllSourcesAndNeighbors = (cellTypeColors) => {

        let curSourceType = filteredNeighbors["cellType"];
        let curNeighborType = filteredNeighbors["neighborsType"];     

        let sourceCellClr = cellTypeColors[ curSourceType ];
        let targetNeighborClr = cellTypeColors[ curNeighborType ];
        let totalNumOfNeighbors = 0;

        for(let i = 0; i < filteredNeighbors["validNeighbors"].length; i++) {
               d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('fill', sourceCellClr);
               filteredNeighbors["validNeighbors"][i].neighbors.forEach(neighborLabel => {
                   d3.select("#" + "spx-" + neighborLabel).style('fill', targetNeighborClr);
                   d3.select("#" + "spx-" + neighborLabel).style('fill-opacity', getBoundaryFillOpacity());
                   d3.select("#" + "spx-" + neighborLabel).style('stroke', 'black');
                   d3.select("#" + "spx-" + neighborLabel).style('stroke-width', getStrokeWidth());
                   d3.select("#" + "spx-" + neighborLabel).style('stroke-opacity', 1);

                   // sum the total of neighbor cells of certain type as curNeighborType
                   totalNumOfNeighbors = totalNumOfNeighbors + 1;                       
               })

               d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('fill-opacity', getBoundaryFillOpacity());
               d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke', 'black');
               d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke-width', getStrokeWidth());
               d3.select("#"+filteredNeighbors["validNeighbors"][i].id).style('stroke-opacity', 1);
        }
    

        let numOfcellsPerClass = {};

        numOfcellsPerClass[curSourceType] = filteredNeighbors["validNeighbors"].length;
        numOfcellsPerClass[curNeighborType] = totalNumOfNeighbors
        //-- NumOfCellsPerClass Object { Tumor: 21104, Immune: 28816 }
        //-- OR
        //-- NumOfCellsPerClass Object e.g { 10011: 211, 10101: 288 } -- random number for illustratin purpose

        drawCellTypesColumnChart(numOfcellsPerClass, cellTypeColors,  "Source-Neighbor" ); // Third param is for x axis Title          
   
        initCellNavigator(filteredNeighbors["validNeighbors"]);

}

processNeighborAnalysis = (curSourceType, curNeighborType, numOfNeighbor, cellsDistance, curChartOperation ) => {
        // Global Var 
        filteredNeighbors = {}; 
        filteredNeighbors["cellType"]  = curSourceType;
        filteredNeighbors["neighborsType"]  = curNeighborType;        
        // e.g.filteredNeighbors= { cellType: "10101", neighborsType: "10111", validNeighbors: (9163) […] }
        // e.g filteredNeighbors["validNeighbors"][0] = { id: "spx-13238", cellType: "10101", neighborsType: "10111", neighbors: [14327, 14395] }   

        let featureToPlot;  
        let cellTypeColors = {};
        let tileClass = getClassType();
        

        switch ( curChartOperation) {
                    case 'Phenotypes':
                                     { 
                                      //-- e.g.:  allValidPhenotypes -> [{ binary: "10001", validCells: [ {id: "spx-3411"}, ..  ], totalValidCellsNum: 6211, phenotypeColor: "#ffb300"}, ...]

                                      // Extract needed columns and propse two new columns
                                      let  extractedFeatures =  allTilesFeatures.map( entry => (
                                                                        {
                                                                            id: entry.id,
                                                                            label: entry.label,
                                                                            neighbors: entry.neighbors,
                                                                            subCellType : null,
                                                                            cellPhenotypeColor: null,
                                                                            x_cent: entry.x_cent,
                                                                            y_cent: entry.y_cent
                                                                        }
                                                                  ))
                                      
                                      // Preprocessing by hashing the array of object..
                                      let allCellObjects = array2ObjWithHashKey("id", extractedFeatures); 
                                      // allCellObjects { "spx-1": {label: 1, neighbors: Array(5) [ 4084, 4981, 4569], …}, "spx-2": {…} .. }

                                      // Fill null columns with data
                                      allValidPhenotypes.forEach((cellPhenotype, idx) => {  
                                          cellPhenotype.validCells.forEach((cell, idx) => {  
                                               allCellObjects[cell.id].cellPhenotypeColor = cellPhenotype.phenotypeColor;
                                               allCellObjects[cell.id].subCellType = cellPhenotype.binary;
                                          })
                                      })  
                                      
                                      // Create color array of the phenotypes e.g. 
                                      // -- cellTypeColors Object { 10000: "#ff5900", 10001: "#ffb300", 10010: "#f2ff00", 10011: "#99ff00", … }
                                      allValidPhenotypes.forEach( subCellPhenotype => { 
                                              cellTypeColors[subCellPhenotype.binary] = subCellPhenotype.phenotypeColor;
                                      })    


                                      let curSourceTypeValidCells = allValidPhenotypes.filter(subCellPhenotype => subCellPhenotype.binary == curSourceType)[0].validCells;
                                      //-- e.g.: { binary: "10001", validCells: [ {id: "spx-3411"}, ..  ], totalValidCellsNum: 6211, phenotypeColor: "#ffb300"}
                                      //-- curSourceTypeValidCells : validCells: [ {id: "spx-3411"}, ..  ]

                                      filteredNeighbors["validNeighbors"] =  curSourceTypeValidCells
                                                                               .map(entry => (
                                                                                     { 
                                                                                        id: entry.id, 
                                                                                        cellType: curSourceType,
                                                                                        neighborsType: curNeighborType, 
                                                                                        neighbors: allCellObjects[entry.id].neighbors.filter(
                                                                                                           neighborLabel => (allCellObjects["spx-" + neighborLabel].subCellType == curNeighborType) &&
                                                                                                                            ( cellsDistance ? computeCellsDistance(allCellObjects["spx-" + neighborLabel], allCellObjects[entry.id]) < cellsDistance :
                                                                                                                                              computeCellsDistance(allCellObjects["spx-" + neighborLabel], allCellObjects[entry.id]) > cellsDistance 
                                                                                                                                              //-- if cellsDistance = 0 means select "All/Any" 
                                                                                                                            )  
                                                                                                                         ) 
                                                                                     }
                                                                                 )).filter(entry =>  (numOfNeighbor >= 0 ? entry.neighbors.length == numOfNeighbor : entry.neighbors.length > 0) )
                                                                                 // if  numOfNeighbor is "Any" with value =-1 then entry.neighbors.length > 0 will be selected  
                                      
                                      // e.g.filteredNeighbors= { cellType: "10101", neighborsType: "10111", validNeighbors: (9163) […] }
                                      // e.g filteredNeighbors["validNeighbors"][0] = { id: "spx-13238", cellType: "10101", neighborsType: "10111", neighbors: [14327, 14395] }   

                                      break;             
                                    }                
               case 'Tumor-Immune-Stromal':
                                    { 

                                     // To find neighbors 
                                     let allCellObjects = array2ObjWithHashKey("id", allTilesFeaturesAndClassification); 
                                     // allCellObjects { "spx-1": {…}, "spx-2": {…} .. }

                                     filteredNeighbors["validNeighbors"] = allTilesFeaturesAndClassification.filter(entry => entry.Type == curSourceType)
                                                                     .map(entry => (
                                                                                     { 
                                                                                        id: entry.id, 
                                                                                        cellType: curSourceType,
                                                                                        neighborsType: curNeighborType, 
                                                                                        neighbors: entry.neighbors.filter(
                                                                                                           neighborLabel => (allCellObjects["spx-" + neighborLabel].Type == curNeighborType) &&
                                                                                                                            ( cellsDistance ? computeCellsDistance(allCellObjects["spx-" + neighborLabel], allCellObjects[entry.id]) < cellsDistance :
                                                                                                                                              computeCellsDistance(allCellObjects["spx-" + neighborLabel], allCellObjects[entry.id]) > cellsDistance 
                                                                                                                                               //-- if cellsDistance = 0 means select "All/Any" 
                                                                                                                            ) 
                                                                                                                         ) 
                                                                                     }
                                                                                 )).filter(entry =>  (numOfNeighbor >= 0 ? entry.neighbors.length == numOfNeighbor : entry.neighbors.length > 0) )
                                                                                 // if  numOfNeighbor is "Any" with value =-1 then entry.neighbors.length > 0 will be selected  

                                      let chnlNameType =  getGrpChannelsNameType(getSelectedGrpIndex());
                                      // chnlNameType is array of object: [{"channel_name": "CD45", "channel_type" : "Immune"}, ...]

                                      cellTypeColors = getCellTypeColorObj(chnlNameType);
                                      // return cellTypeColors obj: { Tumor: "#ff4846", ... }  

                                      break;             
                                    }  
                  case 'Proteomic-Analysis':
                                    {
                                      triggerHint("To be Coded ..");
                                      break;             
                                    }                                                                
                      case 'Cluster':
                                    {
                                      triggerHint("To be Coded ..");
                                      break;             
                                    }
                             default:
                                    {
                                      triggerHint("No neighbors analysis option for this operation ..");
                                      break;             
                                    }                                        
        }  


        setBoundaryFillOpacity(1);
        // Make all cells fill with none 
        d3.selectAll(tileClass).style('fill', 'none');
        d3.selectAll(tileClass).style('stroke', 'none');  
        d3.selectAll(tileClass).style('fill-opacity', getBoundaryFillOpacity()); 


        if(! isViewBarEmpty("grpFeaturesViewBar") ) {
             clearViewBar("grpFeaturesViewBar");
        }     

        // Draw all sources cells and thier neighbors 
        drawAllSourcesAndNeighbors(cellTypeColors);

        let subOperation = getActiveSubOperationFromParent(curChartOperation);

        setActiveSubOperationOnScreen(subOperation);


  }
 


  confirmNeighborSelection = (curChartOperation) => {
        let featuresDictionayInUse; 

        switch ( curChartOperation) {
                    case 'Phenotypes':
                                     { 
                                      featuresDictionayInUse = allTilesFeatures;
                                      break;             
                                     }             
               case 'Tumor-Immune-Stromal':
                                    { 
                                      featuresDictionayInUse = allTilesFeaturesAndClassification;
                                      break;             
                                    }  
                  case 'Proteomic-Analysis':
                                    {
                                      triggerHint("To be Coded ..");
                                      break;             
                                    }                                                                
                      case 'Cluster':
                                    {
                                      triggerHint("To be Coded ..");
                                      break;             
                                    }
                             default:
                                    {
                                      triggerHint("No features dictionary for this operation ..");
                                      break;             
                                    }                                        
        }     

         if(featuresDictionayInUse.length) {

            let curSourceType = document.getElementById("neighborSourceList").value;
            let curNeighbor = document.getElementById("targetNeighborList").value;
            let numOfNeighbor = document.getElementById("neighborNumList").value; 
            let cellsDistance = document.getElementById("neighborDistanceList").value; 
            
        

             if( ( curSourceType !== "") && ( curNeighbor !== "") && (cellsDistance !== "") ) {

                   processNeighborAnalysis(curSourceType, curNeighbor, parseInt(numOfNeighbor), parseInt(cellsDistance), curChartOperation );                 
                 
             } else {
                  triggerHint("Please select cell-Type, Target Neighbor and a Distance of pixels..");
             }
 
 
        } else {
            triggerHint("No neighbor data found, please create features from Features menu above.. ");
        }        

    }



//----------------------------------------------------------------------------//
//---------------  Phenotype Sub-CellType Neighbor Dependency-----------------//
//----------------------------------------------------------------------------//

initPhenotypesNeighborDependency = (numOfNeighbor = -1 /*All*/, cellsDistance = 0 /*All*/) => {

    if(allTilesFeatures.length) {

          let phenotypeColors = [];
          let cellTypeColors = {};
          let allValidBinaries = [];
          let neighborsMatrix = null;
          let dependencyWheelData = [];
          let phenoBinaryName = {};
          //--e.g. phenoBinaryName { 10001: "TCell", 10100: "KillerT" }

          // Extract needed columns and propose two new columns
          let  extractedFeatures =  allTilesFeatures.map( entry => (
                                            {
                                                id: entry.id,
                                                label: entry.label,
                                                neighbors: entry.neighbors,
                                                subCellType : null,
                                                cellPhenotypeColor: null,
                                                x_cent: entry.x_cent,
                                                y_cent: entry.y_cent
                                            }
                                    ))
          
          // Preprocessing by hashing the array of object..
          let allCellObjects = array2ObjWithHashKey("id", extractedFeatures); 
          // allCellObjects { "spx-1": {label: 1, neighbors: Array(5) [ 4084, 4981, 4569], …}, "spx-2": {…} .. }

          // Fill null columns with data
          allValidPhenotypes.forEach((cellPhenotype, idx) => {  
              cellPhenotype.validCells.forEach((cell, idx) => {  
                   allCellObjects[cell.id].cellPhenotypeColor = cellPhenotype.phenotypeColor;
                   allCellObjects[cell.id].subCellType = cellPhenotype.binary;
              })
          })  
          
          // Create color array  and binary array of the phenotypes 
          allValidPhenotypes.forEach( subCellPhenotype => { 
                  cellTypeColors[subCellPhenotype.binary] = subCellPhenotype.phenotypeColor;
                  // -- cellTypeColors Object { 10000: "#ff5900", 10001: "#ffb300", 10010: "#f2ff00", 10011: "#99ff00", … }

                  allValidBinaries.push(subCellPhenotype.binary);     
                  //--allValidBinaries Array e.g: [ "10000", "10001", "10010", "10011", "10100", "10101", "10110", "10111", "11000", "11001", … ]                           

                  if(subCellPhenotype.phenotypeName) {
                       phenoBinaryName[subCellPhenotype.binary] = subCellPhenotype.phenotypeName;
                  }   
                  //--e.g. phenoBinaryName { 10001: "TCell", 10100: "KillerT" }


                  if(subCellPhenotype.phenotypeName) {
                       phenotypeColors.push({id: subCellPhenotype.phenotypeName, color: subCellPhenotype.phenotypeColor});
                  } else {
                       phenotypeColors.push({id: subCellPhenotype.binary, color: subCellPhenotype.phenotypeColor});
                  } 
                  //-- phenotypeColors array of objects e.g. : [{id: 10000, color: "#ff5900"}, ...]

          })    


        for(let i = 0; i < allValidBinaries.length; i++) {
           for(let j = i+1; j < allValidBinaries.length; j++) {

                  let curSourceType = allValidBinaries[i];
                  let curNeighborType = allValidBinaries[j];
          
                  let curSourceTypeValidCells = allValidPhenotypes.filter(subCellPhenotype => subCellPhenotype.binary == curSourceType)[0].validCells;
                  //-- e.g.: { binary: "10001", validCells: [ {id: "spx-3411"}, ..  ], totalValidCellsNum: 6211, phenotypeColor: "#ffb300"}
                  //-- curSourceTypeValidCells : validCells: [ {id: "spx-3411"}, ..  ]

                  neighborsMatrix =    curSourceTypeValidCells
                                               .map(entry => (
                                                     { 
                                                        id: entry.id, 
                                                        cellType: curSourceType,
                                                        neighborsType: curNeighborType, 
                                                        neighbors: allCellObjects[entry.id].neighbors.filter(
                                                                           neighborLabel => (allCellObjects["spx-" + neighborLabel].subCellType == curNeighborType) &&
                                                                                            ( cellsDistance ? computeCellsDistance(allCellObjects["spx-" + neighborLabel], allCellObjects[entry.id]) < cellsDistance :
                                                                                                              computeCellsDistance(allCellObjects["spx-" + neighborLabel], allCellObjects[entry.id]) > cellsDistance 
                                                                                                              //-- if cellsDistance = 0 means select "All/Any" 
                                                                                            ) 
                                                                                         ) 
                                                     }
                                                 )).filter(entry =>  (numOfNeighbor >= 0 ? entry.neighbors.length == numOfNeighbor : entry.neighbors.length > 0) )
                                                 // if  numOfNeighbor is "Any" with value =-1 then entry.neighbors.length > 0 will be selected 

                // e.g neighborsMatrix[0] =  { id: "spx-13238", cellType: "10101", neighborsType: "10111", neighbors: [14327, 14395] } 

                 // Total number of neighbors type e.g. 10111 per cellType e.g. 10101
                let totalNumOfNeighbors = 0;
                neighborsMatrix.forEach(entry => {
                   totalNumOfNeighbors = totalNumOfNeighbors + entry.neighbors.length;
                })

                if(totalNumOfNeighbors) {
                    let phenotype1 = phenoBinaryName[allValidBinaries[i]] ? phenoBinaryName[allValidBinaries[i]] : allValidBinaries[i];
                    let phenotype2 = phenoBinaryName[allValidBinaries[j]] ? phenoBinaryName[allValidBinaries[j]] : allValidBinaries[j];                    
                    //-- dependencyWheelData.push([ allValidBinaries[i], allValidBinaries[j], totalNumOfNeighbors ]);
                    dependencyWheelData.push([ phenotype1, phenotype2, totalNumOfNeighbors ]);
                    //--dependencyWheelData e.g. [["10011", "11011", 53], ["10011", "10101", 30], ... ]
                }

           }
        }   


        drawNeighborsDependencyWheelChart(dependencyWheelData, phenotypeColors);

    } else {
        triggerHint("No neighbor data found, please create features from Features menu above.. ");
    }  

}

//----------------------------------------------------------------------------//
//--------------------------- Dimensions Reduction ---------------------------//
//----------------------------------- & --------------------------------------//
//-----------------------------  Visualization -------------------------------//
//----------------------------------------------------------------------------//



  cancelDimReducerSelection = () => {
       removeChartBottomLists();
  }  


  // confirmNeighborSelection = (curChartOperation) => {
  //       let featuresDictionayInUse; 

  //       switch ( curChartOperation) {
  //                   case 'Phenotypes':
  //                                    { 
  //                                     featuresDictionayInUse = allTilesFeatures;
  //                                     break;             
  //                                    }             
  //              case 'Tumor-Immune-Stromal':
  //                                   { 
  //                                     featuresDictionayInUse = allTilesFeaturesAndClassification;
  //                                     break;             
  //                                   }  
  //                 case 'Proteomic-Analysis':
  //                                   {
  //                                     triggerHint("To be Coded ..");
  //                                     break;             
  //                                   }                                                                
  //                     case 'Cluster':
  //                                   {
  //                                     triggerHint("To be Coded ..");
  //                                     break;             
  //                                   }
  //                            default:
  //                                   {
  //                                     triggerHint("No features dictionary for this operation ..");
  //                                     break;             
  //                                   }                                        
  //       }     

  //        if(featuresDictionayInUse.length) {

  //           let curSourceType = document.getElementById("neighborSourceList").value;
  //           let curNeighbor = document.getElementById("targetNeighborList").value;
  //           let numOfNeighbor = document.getElementById("neighborNumList").value; 
  //           let cellsDistance = document.getElementById("neighborDistanceList").value; 
            
        

  //            if( ( curSourceType !== "") && ( curNeighbor !== "") && (cellsDistance !== "") ) {

  //                  processNeighborAnalysis(curSourceType, curNeighbor, parseInt(numOfNeighbor), parseInt(cellsDistance), curChartOperation );                 
                 
  //            } else {
  //                 triggerHint("Please select cell-Type, Target Neighbor and a Distance of pixels..");
  //            }
 
 
  //       } else {
  //           triggerHint("No neighbor data found, please create features from Features menu above.. ");
  //       }        

  //   }

  // neighborSourceListChanged = () => {
  //       let curSourceType = document.getElementById("neighborSourceList").value;

  //       if(curSourceType !== "") {
  //           document.getElementById("targetNeighborList").disabled = false;
  //           document.getElementById("neighborDistanceList").disabled = false;
  //           document.getElementById("neighborNumList").disabled = false;
  //       } else {
  //           document.getElementById("targetNeighborList").disabled = true;
  //           document.getElementById("neighborDistanceList").disabled = true;
  //           document.getElementById("neighborNumList").disabled = true;
  //       }

  // }  



     // Plot Dim reduction output for basic markers
     processDimReductionAndPlot = (curChartOperation) => {
         
        let dimReducer = getCurDimReducer(); //e.g. PCA or t-SNE
        let numCells = getCurDimReducerCellNum(); // 0 for sample or (-1) for allcells
        let plotDim = getCurDimReducerPlotDim();  // 2D or 3D     

        let filteredData = {};

        let cellTypeColors = {};

        //-- e.g. numSamplesPerType : 1000
        let numSamplesPerType; 

        let curCellTypes = []; 
        //e.g. curCellTypes: [ "Tumor", "Immune", "Stromal", "Others" ] or   [ "Tumor", "Others" ] 
        //-- For phenotypes
        //e.g. curCellTypes: [ "10001", "10010", "10011", "10100", "10101", "10110", "10111", "11000", "11001", "11010", … ]
        
        let filterByType = {};  
        // e.g  filterByType { Tumor: [..], Immune: [..], ... }  or
        // Where the array represent the seleted features values e.g. KERATIN_norm,  CD45_norm , ASMA_norm                   
        // filterByType["Immune"][0] : {ASMA_norm: 1.49, CD45_norm: 32.23, KERATIN_norm: 2.17, Max: "CD45_norm", Type: "Immune", id: "spx-59", label: 59}                        

        let chnlNames = [];
        //-- e.g. chnlNames : [{ channel_name: "CD45" }, { channel_name: "KERATIN" }]  

        let phenoBinaryName = {};
        //--e.g. phenoBinaryName { 10001: "TCell", 10100: "KillerT" }

        if(numCells < 0 ) {
           triggerHint("process all cells to be coded");
           return 0;
        }

        switch ( curChartOperation) {

            case 'Tumor-Immune-Stromal':
                            {

                            let chnlNameType =  getGrpChannelsNameType(getSelectedGrpIndex());
                            // chnlNameType is array of object: [{"channel_name": "CD45", "channel_type" : "Immune"}, ...]    

                            curCellTypes =  chnlNameType.map(entry => entry["channel_type"]);
                            curCellTypes.push("Others");        
                            //e.g. curCellTypes: [ "Tumor", "Immune", "Stromal", "Others" ] or   [ "Tumor", "Others" ]     

                            cellTypeColors = getCellTypeColorObj(chnlNameType);
                            // return cellTypeColors obj: { Tumor: "#ff4846", ... }  

                            curCellTypes.forEach(type => {
                                filterByType[type] = cellBasicClassification.filter(entry => entry.Type == type);
                            })

                            //-- e.g  filterByType { Tumor: [..], Immune: [..], ... }
                            // Where the array represent the seleted features values e.g. KERATIN_norm,  CD45_norm , ASMA_norm              
                            // filterByType["Immune"][0] : {ASMA_norm: 1.49, CD45_norm: 32.23, KERATIN_norm: 2.17, Max: "CD45_norm", Type: "Immune", id: "spx-59", label: 59}                
                      
                            
                            //-- e.g. numSamplesPerType : 1000
                            numSamplesPerType = Opts.numSamplePerType;    

                            chnlNames =  chnlNameType.map( entry => (
                                                                        {
                                                                            channel_name: entry.channel_name
                                                                        }
                                                                  ))
                            //-- e.g. chnlNames : [{ channel_name: "CD45" }, { channel_name: "KERATIN" }]  
                            break;                            

                        } 
            case 'Phenotypes':
                        {

                            allValidPhenotypes.forEach( subCellPhenotype => { 
                                      cellTypeColors[subCellPhenotype.binary] = subCellPhenotype.phenotypeColor;
                                      
                                      if(subCellPhenotype.phenotypeName) {
                                           phenoBinaryName[subCellPhenotype.binary] = subCellPhenotype.phenotypeName;
                                      }                                      
                            }) 
                            //-- return cellTypeColors obj: { "01010": "#ff4846", ... }  
                            // -- allValidPhenotypes[0] : { binary: "10001", validCells: (32) […], totalValidCellsNum: 32, phenotypeColor: "#ff0000" }
                            // -- allValidPhenotypes[9].validCells : [{ id: "spx-95281" }]

                            curCellTypes =  allValidPhenotypes.map(entry => entry["binary"]);
                            //-- e.g. curCellTypes: [ "10001", "10010", "10011", "10100", "10101", "10110", "10111", "11000", "11001", "11010", … ]

                            // let allCellObjects = array2ObjWithHashKey("id", allTilesFeaturesAndClassification); 
                            // // allCellObjects { "spx-1": {…}, "spx-2": {…} .. }

                            // let markerValue = Opts.cellFeatureToNormalize.substring(1); // select from  _mean, _max, _std, _nonzero_mean

                            curCellTypes.forEach(type => {

                                    filterByType[type] = allValidPhenotypes.filter(entry => entry.binary == type)[0].validCells;
                                    // filterByType["10001"][0] : {id: "spx-59"}  

                                    filterByType[type] = mergeArrayOfObjByKey( "id", filterByType[type], allTilesFeatures);
                                    //-- e.g  filterByType { "10001": [..], "10010": [..], ... }
                                    // filterByType["10001"][0] :{ id: "spx-2346", label: 2346, features: (5) […], area: 238,  … }  
                              

                                    // Extract needed columns and propse two new columns
                                    filterByType[type] =  filterByType[type].map( entry => (
                                                                        {
                                                                            id: entry.id,
                                                                            label: entry.label,
                                                                            Type: type, 
                                                                            features: entry.features
                                                                        }
                                                                  ))
                                    //-- e.g  filterByType { "10001": [..], "10010": [..], ... }
                                    // filterByType["10001"][3] :{ id: "spx-2346", label: 2346, type: "Tumor", 
                                    //                         features: [{ Frame: "DAPI", mean: 23.34, nonzero_mean: 32.49, norm: 25.85,.. }, {..},..] }     

                                    let featToPlot =  "norm";

                                    // Extract needed columns and propse two new columns
                                    filterByType[type].forEach( (cellEntry, idx) => {
                                                               cellEntry.features.forEach(featEntry => {
                                                                      filterByType[type][idx][featEntry.Frame + "_" + featToPlot] = featEntry[featToPlot];
                                                                                        })                                   
                                                               delete filterByType[type][idx]["features"];
                                                             })

                                    // filterByType["10001"][3] :{ id: "spx-2346", label: 2346, type: "Tumor", ASMA_norm: 2.91, CD45_norm: 3.96, 
                                    //                               DAPI_norm: 122.52, IBA1_norm: 35.56, KERATIN_norm: 1.04}     

                            })



                            // Clone current group array of channels
                            let curChannelsArr = [... getCurGrpChannelsName()];
                            // e.g. curChannelsArr :[ "DAPI", "KERATIN", "ASMA", "CD45", "IBA1" ]

                            // -- Remove dapi from feature calculations during reduction
                            if(Opts.excludeDapiChForPhenotypes) {
                                 let dapiChName = getSelectedDAPIChannelName();
                                 removeArrayElem(curChannelsArr, dapiChName);
                                 // e.g. curChannelsArr :[ "KERATIN", "ASMA", "CD45", "IBA1" ]                                 
                            }

 
                            chnlNames =  getCurGrpChannelsName().map( entry => (
                                                                        {
                                                                            channel_name: entry
                                                                        }
                                                                  ))
                            //-- e.g. chnlNames : [{ channel_name: "DAPI" }, { channel_name: "IBA1" }, { channel_name: "KERATIN" }, 
                            //                     { channel_name: "CD45" }, { channel_name: "ASMA" } ]


                               
                            //-- e.g. numSamplesPerType : 100
                            numSamplesPerType = math.floor(Opts.maxNumOfAllSamples/Object.keys(cellTypeColors).length);  

                           // let allValidTilesObject = array2ObjWithHashKey("id", allValidTiles);

                            break;  

                    }      

       }


        let typeSamples = {};
        //-- filteredTypeSamples: { Tumor: (150) [[ 26.8, 9.6, 12.4 ], [..], ..], Immune: (150) […], Stromal: (150) […] }        

        curCellTypes.forEach(type => {
                if(numSamplesPerType < filterByType[type].length) {
                   typeSamples[type] =  _.sample(filterByType[type], numSamplesPerType);  
                } else {
                    if(filterByType[type].length) { // if there is cells with this type
                        typeSamples[type] =  filterByType[type];
                    } else {
                        typeSamples[type] =  [];
                    }
                }
        });
        //-- typeSamples: { Tumor: (1000) [..], Immune: (1000) […], Stromal: (1000) […], .. }

        allTypeSamples = [];

        curCellTypes.forEach(type => {
                 allTypeSamples = fastArraysConcat(allTypeSamples, typeSamples[type]) 
        });   

        //--allTypeSamples: Array(600) [ {…}, {…}, {…}, {…} ]
        //--allTypeSamples[0] : { Type: "Tumor", ASMA_norm: 2.58, CD45_norm: 6.93, KERATIN_norm: 81.24, label: 87224, id: "spx-87224", eccentricity: 0.92, … }


        let jsonString_allTypeSamples = JSON.stringify(allTypeSamples); // convet object to JSON string e.g. {id: 1} -> {"id": 1}
        let maxFileSize = Opts.maxFileSize;  // default 500000 size to send it to flask and avoid javascript syntaxerror "the url is malformed "

        if(jsonString_allTypeSamples.length < maxFileSize) {

            try {
            // Calculate dimReducer e.g. t-SNE for the sample
            triggerHint("Please wait while calculating " + dimReducer + " for sample ");

            allTypeSamples =  calculateDimReductionRandomSample(dimReducer, allTypeSamples, chnlNames, plotDim);
            //--{ id: "spx-25603", KERATIN_norm: 157.28, CD45_norm: 3.74, ASMA_norm: 2.07, Max: "KERATIN_norm", Type: "Tumor", label: 25603, tsne_x: -28.05, tsne_y: -19.51 }

            } catch(err) {
                  let rowSize = JSON.stringify(allTypeSamples[0]).length;
                  let RecommendNumRows = Math.round(500000/rowSize);
                  triggerHint("Sample size is too large for passing to RestApi "  + 
                              ",try to minimize total sample size to : " + RecommendNumRows, "info", 7000);  
                  
                  return 0;
            }

            // File scatterData and plot
            let scatterData = [];
            //-- scatterData [{ name: Tumor, color: TumorColor, data: [[100, 161], [175, 122] .. ] }, {...}]  
 
            curCellTypes.forEach(type => {
               let filterSampleByTypeAndReducerOut; 

               if(plotDim == 3) {
                    filterSampleByTypeAndReducerOut = allTypeSamples.filter(entry => entry.Type == type)
                                                                 .map(entry => [entry[ dimReducer + "_x" ], entry[ dimReducer + "_y" ], entry[ dimReducer + "_z" ] ]);
               } else {
                 // is 2D
                    filterSampleByTypeAndReducerOut = allTypeSamples.filter(entry => entry.Type == type)
                                                                 .map(entry => [entry[ dimReducer + "_x" ], entry[ dimReducer + "_y" ]]);                 
               }   

               if(phenoBinaryName[type]) { // if there is naming for binary
                  scatterData.push({name: phenoBinaryName[type], color: cellTypeColors[type], data: filterSampleByTypeAndReducerOut });
               } else {
                  scatterData.push({name: type, color: cellTypeColors[type], data: filterSampleByTypeAndReducerOut });
               }                                         

            });

            if(plotDim == 3) {
                //--For 2D  scatterData [{ name: Tumor, color: TumorCOlor, data: [[100, 161], [175, 122] .. ] }, {...}] 
                drawScatterChart3D(scatterData, "Random Sample " + allTypeSamples.length + " Cells" , dimReducer + "-x", dimReducer + "-y", dimReducer + "-z"); 

            } else {
                //--For 2D  scatterData [{ name: Tumor, color: TumorCOlor, data: [[100, 161], [175, 122] .. ] }, {...}] 
                drawScatterChart(scatterData, "Random Sample " + allTypeSamples.length + " Cells" , dimReducer + "-x" + "( Sample #" + allTypeSamples.length+")", dimReducer + "-y"); 
            }    


        } else {
              let rowSize = JSON.stringify(allTypeSamples[0]).length;
              let RecommendNumRows = Math.round(500000/rowSize);
              triggerHint("Sample size is too large for passing to RestApi "  + 
                          ",try to minimize total sample size to : " + RecommendNumRows, "info", 7000);  
              
              return 0;         
        }

   }



     // Plot Dim reduction output for basic markers
     processDimReductionAndPlot_old = (curChartOperation) => {
         
        let dimReducer = getCurDimReducer(); //e.g. PCA or t-SNE
        let numCells = getCurDimReducerCellNum(); // 0 for sample or (-1) for allcells
        let plotDim = getCurDimReducerPlotDim();  // 2D or 3D     

        let filteredData = {};

        if(numCells < 0 ) {
           triggerHint("process all cells to be coded");
           return 0;
        }

        if(curChartOperation !== "Tumor-Immune-Stromal" ) {
           triggerHint(" To be coded  ");
           return 0;
        }        


        
        let chnlNameType =  getGrpChannelsNameType(getSelectedGrpIndex());
        // chnlNameType is array of object: [{"channel_name": "CD45", "channel_type" : "Immune"}, ...]    

        let selectedMarkers =  chnlNameType.map(entry => entry["channel_name"])
        //e.g. selectedChType: [ "KERATIN", "CD45", "ASMA" ]

        let selectedChTypes =  chnlNameType.map(entry => entry["channel_type"])
        selectedChTypes.push("Others");        
        //e.g. selectedChTypes: [ "Tumor", "Immune", "Stromal", "Others" ] or   [ "Tumor", "Others" ]     

        let cellTypeColors = getCellTypeColorObj(chnlNameType);
        // return cellTypeColors obj: { Tumor: "#ff4846", ... }  


        let chnlNames =  chnlNameType.map( entry => (
                                                {
                                                    channel_name: entry.channel_name
               
                                                }
                                          ))

        //e.g. chnlNames : [{ channel_name: "CD45" }, { channel_name: "KERATIN" }]


        let filterByType = {};
        // e.g  filterByType { Tumor: [..], Immune: [..], ... }
        // Where the array represent the seleted features values e.g. KERATIN_norm,  CD45_norm , ASMA_norm   

        selectedChTypes.forEach(type => {
            filterByType[type] = cellBasicClassification.filter(entry => entry.Type == type)
        })

        //-- e.g  filterByType { Tumor: [..], Immune: [..], ... }
        // Where the array represent the seleted features values e.g. KERATIN_norm,  CD45_norm , ASMA_norm         
       

        //-- e.g. numSamplesPerType : 1000
        let numSamplesPerType = Opts.numSamplePerType;

        let typeSamples = {};
        //-- filteredTypeSamples: { Tumor: (150) [[ 26.8, 9.6, 12.4 ], [..], ..], Immune: (150) […], Stromal: (150) […] }        

        selectedChTypes.forEach(type => {
                if(numSamplesPerType < filterByType[type].length) {
                   typeSamples[type] =  _.sample(filterByType[type], numSamplesPerType);  
                } else {
                    if(filterByType[type].length) { // if there is cells with this type
                        typeSamples[type] =  filterByType[type];
                    } else {
                        typeSamples[type] =  [];
                    }
                }
        });
        //-- typeSamples: { Tumor: (1000) [..], Immune: (1000) […], Stromal: (1000) […], .. }

        allTypeSamples = [];

        selectedChTypes.forEach(type => {
                 allTypeSamples = fastArraysConcat(allTypeSamples, typeSamples[type]) 
        });   

        //--allTypeSamples: Array(600) [ {…}, {…}, {…}, {…} ]
        //--allTypeSamples[0] : { Type: "Tumor", ASMA_norm: 2.58, CD45_norm: 6.93, KERATIN_norm: 81.24, label: 87224, id: "spx-87224", eccentricity: 0.92, … }


        let jsonString_allTypeSamples = JSON.stringify(allTypeSamples); // convet object to JSON string e.g. {id: 1} -> {"id": 1}
        let maxFileSize = Opts.maxFileSize;  // default 500000 size to send it to flask and avoid javascript syntaxerror "the url is malformed "

        if(jsonString_allTypeSamples.length < maxFileSize) {

            try {
            // Calculate dimReducer e.g. t-SNE for the sample
            triggerHint("Please wait while calculating " + dimReducer + " for sample ");

            allTypeSamples =  calculateDimReductionRandomSample(dimReducer, allTypeSamples, chnlNames, plotDim);
            //--{ id: "spx-25603", KERATIN_norm: 157.28, CD45_norm: 3.74, ASMA_norm: 2.07, Max: "KERATIN_norm", Type: "Tumor", label: 25603, tsne_x: -28.05, tsne_y: -19.51 }

            } catch(err) {
                  let rowSize = JSON.stringify(allTypeSamples[0]).length;
                  let RecommendNumRows = Math.round(500000/rowSize);
                  triggerHint("Sample size is too large for passing to RestApi "  + 
                              ",try to minimize total sample size to : " + RecommendNumRows, "info", 7000);  
                  
                  return 0;
            }

            // File scatterData and plot
            let scatterData = [];
            //-- scatterData [{ name: Tumor, color: TumorCOlor, data: [[100, 161], [175, 122] .. ] }, {...}]  
 
            selectedChTypes.forEach(type => {
               let filterSampleByTypeAndReducerOut; 

               if(plotDim == 3) {
                    filterSampleByTypeAndReducerOut = allTypeSamples.filter(entry => entry.Type == type)
                                                                 .map(entry => [entry[ dimReducer + "_x" ], entry[ dimReducer + "_y" ], entry[ dimReducer + "_z" ] ]);
               } else {
                 // is 2D
                    filterSampleByTypeAndReducerOut = allTypeSamples.filter(entry => entry.Type == type)
                                                                 .map(entry => [entry[ dimReducer + "_x" ], entry[ dimReducer + "_y" ]]);                 
               }                                            

               scatterData.push({name: type, color: cellTypeColors[type], data: filterSampleByTypeAndReducerOut });
            });

            if(plotDim == 3) {
                //--For 2D  scatterData [{ name: Tumor, color: TumorCOlor, data: [[100, 161], [175, 122] .. ] }, {...}] 
                drawScatterChart3D(scatterData, "Random Sample " + allTypeSamples.length + " Cells" , dimReducer + "-x", dimReducer + "-y", dimReducer + "-z"); 

            } else {
                //--For 2D  scatterData [{ name: Tumor, color: TumorCOlor, data: [[100, 161], [175, 122] .. ] }, {...}] 
                drawScatterChart(scatterData, "Random Sample " + allTypeSamples.length + " Cells" , dimReducer + "-x" + "( Sample #" + allTypeSamples.length+")", dimReducer + "-y"); 
            }    


        } else {
              let rowSize = JSON.stringify(allTypeSamples[0]).length;
              let RecommendNumRows = Math.round(500000/rowSize);
              triggerHint("Sample size is too large for passing to RestApi "  + 
                          ",try to minimize total sample size to : " + RecommendNumRows, "info", 7000);  
              
              return 0;         
        }

   }

 


   dimReducersListChanged = () => {
     // to be coded
  }

   dimReduceCellsNumListChanged = () => {
     // to be coded
  }

   dimReducerPlotListChanged = () => {
     // to be coded
  }    

  getCurDimReducerCellNum = () => {
      return document.getElementById("dimReduceCellsNumList").value;
  }


  getCurDimReducerPlotDim = () => {
      return document.getElementById("dimReducerPlotList").value;
  }  


  getCurDimReducer = () => {
      return document.getElementById("dimReducersList").value;
  }

  requestDimReducerInfo = () => {
     let dimReducer = getCurDimReducer();
     let dimReducerEntry = dimReductionMethods.filter( entry => entry.method === dimReducer);
     triggerHint(dimReducerEntry[0].description, "info", 10000);        
  }


    // For Tumor-Immune-Stromal/Phenotypes/etc  
    initCellTypesDimReductionMode = (curChartOperation) => { 

      // if(curChartOperation == "Phenotypes") {
      //     triggerHint("To be Coded");
      //     return 0;
      // }  

      chartOptions.lastContainerContent = document.getElementById("chartContainer").innerHTML;

      let nodes = ""; 

      nodes +=  '<table>';
      // nodes +=    '<tr>';
      // nodes +=      '<th style="text-align: left; margin-left: 0vw;"><label style="margin-left: 0.69vw">Neighbors Analysis</label></th>';   
      // nodes +=    '</tr>';        
      nodes +=    '<colgroup><col style="width:30%"><col style="width:30%"><col style="width:30%"><col style="width:10%"></colgroup>';

      nodes +=    '<tr>';
      nodes +=      '<th style="margin-left: 0vw;"><label style="font-size:0.70vw; margin-left: 0.69vw">Dim Reducer</label></th>';
      nodes +=      '<th ><label style="font-size:0.70vw; margin-left: 0.69vw"># Cells</label></th>';
      nodes +=      '<th ><label style="font-size:0.70vw; margin-left: 0.69vw">Plot Dim</label></th>'
      nodes +=      '<th ><label style="font-size:0.70vw; margin-left: 0.69vw"></label></th>'      
      nodes +=    '</tr>';


      // Initiat list of reducer methods to choose from  to visualize cells data in 2D/3D
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="dimReducersList" class="dimReducerClass" onChange = "dimReducersListChanged()" style="width:85%; margin-left: 0.69vw; font-size: 0.57vw; -webkit-appearance: none;" >`;

      dimReductionMethods.forEach((dimReducerEntry, idx) => {   
          let dimReducer = dimReducerEntry.method; // e.g. t-SNE   
               nodes +=    `<option value=${dimReducer}>${dimReducer}</option>`; 
      })
      
      nodes +=         '</select>'; 
      nodes +=      '</th>';   




      // Initiat list of cells numbers to choose from.
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="dimReduceCellsNumList" class="dimReducerClass" onChange = "dimReduceCellsNumListChanged()" style="width:85%; margin-left: 0.69vw; font-size: 0.57vw; -webkit-appearance: none;"  >`;

      // for(let num = 100; num <= Opts.numSamplePerType; num = num + 100 ) {
      //     nodes +=          `<option value=${num} > = ${num} </option>`;   // zero neighbores for cells that has no neighbors of the type    
      // }

      nodes +=          `<option value=0 selected> Random Sample</option>`;  
      nodes +=          `<option value=-1> All Cells</option>`;                 
      nodes +=        '</select>'; 
      nodes +=      '</th>';   



      // Initiat list of plot options e.g. 2D/3D
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="dimReducerPlotList" class="dimReducerClass" onChange = "dimReducerPlotListChanged()" style="width:85%; margin-left: 0.69vw; font-size: 0.57vw; -webkit-appearance: none;" >`;
      nodes +=          `<option value=2 > 2-D</option>`; 
      nodes +=          `<option value=3 > 3-D</option>`; 
      nodes +=        '</select>'; 
      nodes +=      '</th>';   
                    


      // Initiat Dim reducers info
      nodes +=      '<th>'; 
      nodes +=          '<a href="javascript:void(0)" onclick="requestDimReducerInfo()"><i style="font-size:1vw;" class="fa fa-info-circle"></i></a>';
      nodes +=      '</th>';   
      nodes +=  '</tr>';   


      nodes +=  '</table>';                

      nodes +=  '<hr style="margin-bottom: 1vh;">';
      nodes +=  '<table>';
      nodes +=    '<colgroup><col style="width:50%"><col style="width:50%"></colgroup>';
      nodes +=    '<tr>';   
      nodes +=      '<th><i style="font-size:1vw" id="confirmDimReducerSelectionId"   class="fa fa-check-circle"></i></th>';
      nodes +=      '<th><i style="font-size:1vw"  onclick="cancelDimReducerSelection()" class="fa fa-times-circle"></i></th>';      
      nodes +=    '</tr>';  
      nodes +=  '</table>';  

           
      document.getElementById("chartOperationSettings").innerHTML  = nodes;

      document.getElementById("confirmDimReducerSelectionId").addEventListener('click', function() {
            processDimReductionAndPlot(curChartOperation);

      });   


    }

//-------------------------------------------------------------------------------//
//-------------------------  Main CellType Analysis------------------------------//
//-------------------------------------------------------------------------------//
    
    //e.g. t-SNE UMAP, PCA, LDA 
    dimReductionOperation = () => { 

        let curChartOperation = document.getElementById("chartOperations").value;
        chartOptions.lastOperation = chartOptions.currentOperation;

        switch ( curChartOperation) {
                    case 'Phenotypes':
                                     { 
                                      initCellTypesDimReductionMode(curChartOperation);
                                      break;             
                                    }                
               case 'Tumor-Immune-Stromal':
                                    { 
                                      initCellTypesDimReductionMode(curChartOperation);
                                      break;             
                                    }  
                  case 'Proteomic-Analysis':
                                    {
                                      triggerHint("To be Coded ..");
                                      break;             
                                    }                                                                
                      case 'Cluster':
                                    {
                                      triggerHint("To be Coded ..");
                                      break;             
                                    }
                             default:
                                    {
                                      triggerHint("No dimensionality reduction option for this operation ..");
                                      break;             
                                    }                                        
        }  

      //  document.getElementById("chartOperationSettings").innerHTML = "";
 
  } 

    analysisChartOperation = () => {

        let curChartOperation = document.getElementById("chartOperations").value;
        chartOptions.lastOperation = chartOptions.currentOperation;

        switch ( curChartOperation) {
                    case 'Phenotypes':
                                     { 
                                      triggerHint("To be Coded ..");  
                                      // initPhenotypesAnalysisMode();
                                      break;             
                                    }                
               case 'Tumor-Immune-Stromal':
                                    { 
                                      initBasicCellClassificationAnalysisMode();
                                      break;             
                                    }  
                  case 'Proteomic-Analysis':
                                    {
                                      triggerHint("To be Coded ..");
                                      break;             
                                    }                                                                
                      case 'Cluster':
                                    {
                                      triggerHint("To be Coded ..");
                                      break;             
                                    }
                             default:
                                    {
                                      triggerHint("No analysis option for this operation ..");
                                      break;             
                                    }                                        
        }  

      //  document.getElementById("chartOperationSettings").innerHTML = "";
 
  } 

  initChartOperationSideSpecialBar = (operationType) => {


        switch ( operationType) {
               case 'Phenotypes':
                                    { 
                                      document.getElementById("chPlotsPanelSpecialBar").innerHTML = 
                                       `<a style="padding-left:0.5vw" href="javascript:void(0)" onclick="initPhenotypeNamesForm()">` + 
                                           '<div class="tooltip"><i style ="color: white;" class="fa fa-pencil-square-o" ></i>' + 
                                              '<span class="tooltiptext">Edit</span></div>' + 
                                       '</a>' +                                       
                                       `<a style="padding-left:0.5vw" href="javascript:void(0)" onclick="analysisChartOperation()">` + 
                                           '<div class="tooltip"><i style ="color: white;" class="fa fa-line-chart" ></i>' + 
                                              '<span class="tooltiptext">Analysis</span></div>' + 
                                       '</a>'  +
                                       `<a style="padding-left:0.5vw" href="javascript:void(0)" onclick="dimReductionOperation()">` + 
                                           '<div class="tooltip"><i style ="color: white;" class="fa fa-compress" ></i>' + 
                                              '<span class="tooltiptext">Dim_Reduction</span></div>' + 
                                       '</a>'  +                                        
                                       `<a style="padding-left:0.5vw" href="javascript:void(0)" onclick="cellTypesNeighborsAnalysis()">` + 
                                           '<div class="tooltip"><i style ="color: white;" class="fa fa-th" ></i>' + 
                                              '<span class="tooltiptext">Neighbors</span></div>' + 
                                       '</a>'  +
                                       `<a style="padding-left:0.5vw" href="javascript:void(0)" onclick="initPhenotypesNeighborDependency()">` + 
                                           '<div class="tooltip"><i style ="color: white;" class="fa fa-random" ></i>' + 
                                              '<span class="tooltiptext">Neighbors</span></div>' + 
                                       '</a>'  ;

                                      showSpecialBar("chPlotsPanel");
                                      break;             
                                    } 


               case 'Tumor-Immune-Stromal':
                                    { 
                                      document.getElementById("chPlotsPanelSpecialBar").innerHTML = 
                                       `<a style="padding-left:0.5vw" href="javascript:void(0)" onclick="editChartOperationSettings()">` + 
                                           '<div class="tooltip"><i style ="color: white;" class="fa fa-pencil-square-o" ></i>' + 
                                              '<span class="tooltiptext">Edit</span></div>' + 
                                       '</a>' + 
                                       `<a style="padding-left:0.5vw" href="javascript:void(0)" onclick="analysisChartOperation()">` + 
                                           '<div class="tooltip"><i style ="color: white;" class="fa fa-line-chart" ></i>' + 
                                              '<span class="tooltiptext">Analysis</span></div>' + 
                                       '</a>'  +
                                       `<a style="padding-left:0.5vw" href="javascript:void(0)" onclick="dimReductionOperation()">` + 
                                           '<div class="tooltip"><i style ="color: white;" class="fa fa-compress" ></i>' + 
                                              '<span class="tooltiptext">Dim_Reduction</span></div>' + 
                                       '</a>'  +                                       
                                       `<a style="padding-left:0.5vw" href="javascript:void(0)" onclick="cellTypesNeighborsAnalysis()">` + 
                                           '<div class="tooltip"><i style ="color: white;" class="fa fa-th" ></i>' + 
                                              '<span class="tooltiptext">Neighbors</span></div>' + 
                                       '</a>'  ;

                                      showSpecialBar("chPlotsPanel");
                                      break;             
                                    }   
                 case 'Proteomic-Analysis':
                                    {
                                       document.getElementById("chPlotsPanelSpecialBar").innerHTML = "";
                                       // `<a style="padding-left:0.5vw" href="javascript:void(0)" onclick="editChartOperationSettings()">` + 
                                       //     '<div class="tooltip"><i style ="color: white;" class="fa fa-pencil-square-o" ></i>' + 
                                       //        '<span class="tooltiptext">Edit</span></div>' + 
                                       // '</a>';

                                       showSpecialBar("chPlotsPanel");
                                      break;             
                                    }                                                               
                      case 'Cluster':
                                    {
                                       document.getElementById("chPlotsPanelSpecialBar").innerHTML = "";
                                       // `<a style="padding-left:0.5vw" href="javascript:void(0)" onclick="editChartOperationSettings()">` + 
                                       //     '<div class="tooltip"><i style ="color: white;" class="fa fa-pencil-square-o" ></i>' + 
                                       //        '<span class="tooltiptext">Edit</span></div>' + 
                                       // '</a>';

                                       showSpecialBar("chPlotsPanel");
                                      break;             
                                    }
                             default:
                                    {
                                      document.getElementById("chPlotsPanelSpecialBar").innerHTML = "";  
                                      triggerHint("No speical bar for this operation ..");
                                      break;             
                                    }                                        
        }     


  }





  // Classify cells as Tumor/Immune/Stromal/Others 
  initChartClassifyCellsForm = () => { 

      chartOptions.lastContainerContent = document.getElementById("chartContainer").innerHTML;

      // To init the markers list with pre selected values
      let chnlNameType = []; //  array of object: [{"channel_name": "CD45", "channel_type" : "Immune"}, ...]
     
      let cellTypeObj = {};   // cellTypeObj  Object { Tumor: "KERATIN" }

      if( isGrpChannelsNameTypeExist( getSelectedGrpIndex() ) ) {
          chnlNameType =  getGrpChannelsNameType(getSelectedGrpIndex());
          chnlNameType.forEach((chnlNameTypeEntry, idx) => { 
             let cellType = chnlNameTypeEntry.channel_type; // e.g. Tumor 
             let cellName = chnlNameTypeEntry.channel_name; // e.g. KERATIN 
              cellTypeObj[cellType] = cellName; // cellTypeObj  Object { Tumor: "KERATIN", ..}
          });         
      }


      let nodes = ""; 

      nodes +=  '<table>';
      nodes +=    '<colgroup><col style="width:40%"><col style="width:30%"><col style="width:20%"><col style="width:10%"></colgroup>';
      nodes +=    '<tr>';
      nodes +=      '<th style="text-align: left; margin-left: 0vw;"><label style="margin-left: 0.69vw">Select Marker</label></th>';
      nodes +=      '<th style="text-align: left"><label style="margin-left: 0.69vw">Cell-Type</label></th>';
      nodes +=      '<th style="text-align: left"><label style="margin-left: 0.69vw">Color</label></th>'
      nodes +=      '<th style="text-align: left"></th>'      
      nodes +=    '</tr>';

      mainCellTypesList.forEach((cellTypeEntry, idx) => {   
          let cellType = cellTypeEntry.cellType; // e.g. Tumor   
          let clr  = cellTypeEntry.cellTypeColor;

          // Initiat list of markers to choose from 
          nodes +=    '<tr>';
          nodes +=      '<th style="text-align: left">'; 
          // No selection list for "Others" cellType
          if(cellType !== "Others") {
              nodes +=        `<select  id="markerList.${cellType}"  style="width:70%; margin-left: 0.69vw; font-size: 0.52vw; -webkit-appearance: none;"  >`;
              getCurGrpChannelsName().forEach((marker, idx) => {
                    if(idx == 0) {
                       // create empty entry with the select list 
                       nodes +=    `<option value=""></option>`; 
                    }  
                                  
                    if(marker !== getSelectedDAPIChannelName()) {
                        if(marker === cellTypeObj[cellType]) {
                            nodes +=    `<option value=${marker} selected>${marker}</option>`; 
                        } else {
                            nodes +=    `<option value=${marker}>${marker}</option>`; 
                        }
                               
                    }
              });
              nodes +=         '</select>'; 
          }

          nodes +=      '</th>';

          // Initiat textbox to of cellType e.g. Tumor, Immune, Stromal, Others.
          nodes +=      '<th style="text-align: left">'; 
          nodes +=        `<input type="text" id="cellTypeText.${cellType}" value = ${cellType} style="background-color:white; margin-Left: 0vw; margin-Top: 0vh; width: 100%; height:1vh;"  disabled />`      
          nodes +=      '</th>';      


          nodes +=      '<th style="padding-left:0;">'; 
          // nodes +=        '<input  id="markerColorId.tumor" onchange="cellTypeColorChanged()" >';  
          nodes +=        `<a href="javascript:void(0)" ><span id="markerColor.${cellType}" style="background-color:${clr};   padding-left:0.5vw;">&nbsp</span>`    
          // nodes +=           `<input type='text' id="markerColor.${cellType}" />`
          nodes +=      '</th>';

          nodes +=      '<th style="padding-left:0;">'; 
          // nodes +=        '<input  id="markerColorId.tumor" onchange="cellTypeColorChanged()" >';  
          nodes +=        `<a  href="javascript:void(0)" id="markerInfo.${cellType}" onclick="requestCellClassifyInfo(this)"><i style="font-size:1vw;" class="fa fa-info-circle"></i></a>`    
          nodes +=      '</th>';            

          nodes +=    '</tr>';  
      });    


      // Initiat list of cluster methods to choose from 
      nodes +=    '<tr>';
      nodes +=      '<th style="text-align: left; margin-left: 0vw; margin-Top: 0vh"><label style="margin-left: 0.69vw; margin-Top: 0vh">Select Method</label></th>';      
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="clusterMethodsList" onchange="onChangeClusterMethod()" style="margin-Left: 0vw; margin-Top: 0vh; width: 100%;  font-size: 0.62vw; -webkit-appearance: none;"  >`;

      mainClusterMethods.forEach((clusterMethodEntry, idx) => {
            let clusterMethod = clusterMethodEntry.method; // e.g. GMM 
            if(idx == 0) {
                nodes +=    `<option value=${clusterMethod} >${clusterMethod}</option>`; 
            } else {
                nodes +=    `<option value=${clusterMethod}>${clusterMethod}</option>`; 
            }
      });

      nodes +=         '</select>'; 
      nodes +=      '</th>';


      nodes +=      '<th style="padding-left:0;">'; 
      nodes +=      '</th>';

      nodes +=      '<th style="padding-left:0;">'; 
      nodes +=        `<a  href="javascript:void(0)" id="clusterMethodInfo" onclick="requestClusterMethodInfo()"><i style="font-size:1vw;" class="fa fa-info-circle"></i></a>`    
      nodes +=      '</th>';            

      nodes +=    '</tr>';  


      // Initiat Threshold-based luster methods to choose from   [ mean, min,  max, "25%", "50%", "75%"]
      nodes +=    '<tr id="OthersTypeThresholdTableEntry" style="visibility: visible;">';
      nodes +=      '<th style="text-align: left; margin-left: 0vw; margin-Top: 0vh"><label style="margin-left: 0.69vw; margin-Top: 0vh">Threshold Val</label></th>';      
      nodes +=      '<th style="text-align: left">'; 
      nodes +=        `<select  id="thresholdBasedMethodsList"  style="margin-Left: 0vw; margin-Top: 0vh; width: 100%;  font-size: 0.62vw; -webkit-appearance: none;"  >`;
      nodes +=          `<option value='max' >Max</option>`; 
      nodes +=          `<option value='75%' >Q3</option>`; 
      nodes +=          `<option value='mean' selected>Mean</option>`; 
      nodes +=          `<option value='50%' >Q2</option>`; 
      nodes +=          `<option value='25%' >Q1</option>`; 
      nodes +=          `<option value='min' >Min</option>`;             
      nodes +=         '</select>'; 
      nodes +=      '</th>';


      nodes +=      '<th style="padding-left:0;">'; 
      nodes +=      '</th>';

      nodes +=      '<th style="padding-left:0;">'; 
      nodes +=        `<a  href="javascript:void(0)" id="thresholdBasedMethodInfo" onclick="requestThresholdBasedMethodInfo()"><i style="font-size:1vw;" class="fa fa-info-circle"></i></a>`    
      nodes +=      '</th>';            

      nodes +=    '</tr>';        


      nodes +=  '</table>';                

      nodes +=  '<hr style="margin-bottom: 1vh;">';
      nodes +=  '<table>';
      nodes +=    '<colgroup><col style="width:50%"><col style="width:50%"></colgroup>';
      nodes +=    '<tr>';   
      nodes +=      '<th><i style="font-size:1vw"  onclick="confirmCellClassifySettings()"  class="fa fa-check-circle"></i></th>';
      nodes +=      '<th><i style="font-size:1vw"  onclick="cancelCellClassifySettings()" class="fa fa-times-circle"></i></th>';      
      nodes +=    '</tr>';  
      nodes +=  '</table>';  

           

      document.getElementById("chartContainer").innerHTML  = nodes;

      // resetGrpChannelsNameType( getSelectedGrpIndex() );

      // mainCellTypesList.forEach((cellTypeEntry, idx) => {  
      //     let cellType = cellTypeEntry.cellType; // e.g. Tumor   
      //     let clr  = cellTypeEntry.cellTypeColor;        
      //     $(`#markerColor.${cellType}`).spectrum({ color: clr});  

      // });      

    

      if( isFeaturesLoaded() ) { 
         // freezeInput("chartOperations", false);
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

    if(chartOptions.container != null) {

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
 } 

//------------------------------------------------------------------------------//
//------------------------- Neighbors Dependency Wheel  --------- --------------//
//------------------------------------------------------------------------------//

// chartData e.g. [["10011", "11011", 53], ["10011", "10101", 30], ... ]
drawNeighborsDependencyWheelChart = (chartData, phenotypeColors) => {

    console.log("chartData", chartData);

    if(chartOptions.animation) {
      chartOptions.animation = {duration: chartOptions.animationDuration};
    } 

    if(chartOptions.defaultLibrary == "highcharts") {


        chartOptions.container = Highcharts.chart('chartContainer', {

                    chart: {
                        backgroundColor: chartOptions.backgroundColor,
                        height: (9 / 16 * 100) + '%' // 16:9 ratio
                    },
                    title: {
                        text: 'Neighbor relations',
                        style: {
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                        }
                    },

                    accessibility: {
                        point: {
                            valueDescriptionFormat: '{index}. From {point.from} to {point.to}: {point.weight}.'
                        }
                    },


                    series: [{
                        keys: ['from', 'to', 'weight'],
                        data: chartData,
                        type: 'dependencywheel',
                        name: 'Dependency wheel series',
                        nodes: phenotypeColors,    //-- e.g.: [{id: "10001", color: "#FF0000"}, ]                    
                        dataLabels: {
                            color: chartOptions.labelsColor,  // label color
                            textPath: {
                                enabled: true,
                                attributes: {
                                    dy: 5
                                }
                            },
                            distance: 10
                        },
                        size: '95%'
                    }],                    

        });          
    }  
}


//------------------------------------------------------------------------------//
//------------------------- Basic Analysis Histogram Chart Column --------------//
//--------------------------(((((((((( Test ))))))))))--------------------------//

testCellTypeHistogramDraw = () => {
    var data = [3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3, 3, 4, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3, 3.8, 3.2, 3.7, 3.3, 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2, 3, 2.2, 2.9, 2.9, 3.1, 3, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3, 2.8, 3, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3, 3.4, 3.1, 2.3, 3, 2.5, 2.6, 3, 2.6, 2.3, 2.7, 3, 2.9, 2.9, 2.5, 2.8, 3.3, 2.7, 3, 2.9, 3, 3, 2.5, 2.9, 2.5, 3.6, 3.2, 2.7, 3, 2.5, 2.8, 3.2, 3, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2, 2.8, 3, 2.8, 3, 2.8, 3.8, 2.8, 2.8, 2.6, 3, 3.4, 3.1, 3, 3.1, 3.1, 3.1, 2.7, 3.2, 3.3, 3, 2.5, 3, 3.4, 3];



    var data1 = [4.5, 4, 5.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 5.7, 3.4, 3, 3, 4, 4.4, 3.9, 3.5, 3.8, 3.8, 5.4, 3.7, 3.6, 3.3, 3.4, 3, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3, 3.8, 5.2, 3.7, 3.3, 3.2, 3.2, 3.1, 2.3, 2.8, 5.8, 3.3, 2.4, 2.9, 2.7, 2, 3, 2.2, 2.9, 5.9, 3.1, 3, 2.7, 2.2, 2.5, 3.2, 2.8, 5.5, 2.8, 2.9, 3, 2.8, 3, 2.9, 2.6, 2.4, 5.4, 2.7, 2.7, 3, 3.4, 3.1, 2.3, 3, 2.5, 2.6, 3, 2.6, 2.3, 2.7, 3, 2.9, 2.9, 2.5, 2.8, 5.3, 2.7, 3, 2.9, 3, 3, 2.5, 2.9, 2.5, 3.6, 5.2, 2.7, 3, 2.5, 2.8, 3.2, 3, 3.8, 2.6, 5.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2, 2.8, 3, 2.8, 3, 2.8, 3.8, 2.8, 2.8, 2.6, 3, 3.4, 3.1, 6, 3.1, 3.1, 3.1, 2.7, 3.2, 3.3, 3, 2.5, 3, 3.4, 3];

    chartOptions.container = Highcharts.chart('chartContainer', {
        chart: {
            backgroundColor: chartOptions.backgroundColor,
            height: '70%'
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
            title: { 
                text: 'Area',
                style: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                }                            


             },

            labels: {
                  rotation: 0,
                  style: {
                      color: "white",
                      fontWeight: "bold"
                  }
            }                        
        }, 

        yAxis: {
            title: { 
                text: '# Cells',
                style: {
                    color: '#fff',
                    fontSize: '10px',
                    fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                }                            


             },        
            gridLineWidth: 0,
            labels: {
                  style: {
                      color: "white", //chartOptions.yAxisTicksColor,
                      fontWeight: "bold" //chartOptions.axisFontWeight
                  } 
              }          

        },

        series: [{
            name: 'Tumor',
            type: 'histogram',
            color: "#ff4846",
            borderColor: "white",
            borderWidth: 3,            
            baseSeries: 's1',
            opacity: 0.9,
            zIndex: 1
          //  binsNumber: 5
        }, {
            name: 'Data',
            visible: false,
            showInLegend: false,    
           // type: 'scatter',
            data: data,
            id: 's1',
            marker: {
                radius: 1.5
            }
        },{
            name: 'Immune',
            type: 'histogram',
            color: '#61c346', 
            borderColor: "white",
            borderWidth: 3,                          
            baseSeries: 's2',
            zIndex: -1
          //  binsNumber: 5 
        }, {
            name: 'Data',
            visible: false,
            showInLegend: false,    
           // type: 'scatter',
            data: data1,
            id: 's2',
            marker: {
                radius: 1.5
            }
        }]
    });


}

// chartData e.g. { Tumor: [ 163, 194, 195, … ] , Immune: [ 519, 316.5, 170, … ], ...}
drawCellTypesHistogramChart = (chartData, featureToPlot) => {

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


         let cellTypeColors = {}

          mainCellTypesList.forEach((cellTypeEntry, idx) => {
                 let cellType = cellTypeEntry.cellType;
                 let clr = cellTypeEntry.cellTypeColor;

                 cellTypeColors[cellTypeEntry.cellType] = cellTypeEntry.cellTypeColor; 
          });    

          // cellTypeColors is Object: { Tumor: "#ff4846", Immune: "#61c346", Stromal: "#5dd1ff", Others: "#6244d9" }

          let seriesToPlot = [];
 
          Object.keys(chartData).forEach((basicClass, idx) => {    // basicClass is [ "Tumor", "Immune", "Stromal" ];      
               seriesToPlot.push({ name: basicClass, 
                                   type: 'histogram', 
                                   color: cellTypeColors[basicClass],                                    
                                   borderColor: "black", 
                                   borderWidth: 0,
                                   baseSeries: "bs" + idx,
                                   opacity: 0.9,
                                   zIndex: idx
                                   // binsNumber: 10                                  
                              });

               seriesToPlot.push({ name: 'Data',
                                   visible: false,
                                   showInLegend: false,
                                   data: chartData[basicClass],
                                   id: "bs" + idx, 

                                });
          });     

 

        chartOptions.container = Highcharts.chart('chartContainer', {

                    chart: {
                        backgroundColor: chartOptions.backgroundColor,
                        height: (9 / 16 * 100) + '%' // 16:9 ratio
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
                        title: { 
                            text: featureToPlot,
                            style: {
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '10px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                            }                            
                        },

                        labels: {
                              rotation: 0,
                              style: {
                                  color: "white",
                                  fontWeight: "bold"
                              }
                        }                        
                    },                         

                    yAxis: {
                        min: 0,
                        gridLineWidth: 0,                        
                        title: {
                            text: '(# Cells)',
                            style: {
                                color: '#fff',
                                fontSize: '10px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif'

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
                    //         '<td style="padding:0; color:black"><b>{point.y:.1f} </b></td></tr>',
                    //     footerFormat: '</table>',
                    //     shared: true,
                    //     useHTML: true
                    // },

                    // plotOptions: {
                    //     column: {
                    //         pointPadding: 0.2,
                    //         borderWidth: 0
                    //     }
                    // },

                    series: seriesToPlot,

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
}

//-----------------------------------------TEST-----------------------------------------------------//
//-------------------------------------Draw Corr Heatmap--------------------------------------------//
//--------------------------------------------------------------------------------------------------//

drawCellTypesFeaturesCorrHeatmap = (chartData, featureToPlot) => {

        function getPointCategoryName(point, dimension) {
            var series = point.series,
                isY = dimension === 'y',
                axis = series[isY ? 'yAxis' : 'xAxis'];
            return axis.categories[point[isY ? 'y' : 'x']];
        }

        chartOptions.container = Highcharts.chart('chartContainer', {

            chart: {
                type: 'heatmap',
                // marginTop: 40,
                // marginBottom: 80,
                // plotBorderWidth: 1,
                backgroundColor: chartOptions.backgroundColor,
                height: (9 / 16 * 100) + '%' // 16:9 ratio
            },



            title: {
                text: ''
            },

            xAxis: {
                categories: featureToPlot,
                labels: {
                      style: {
                          color: chartOptions.xAxisTicksColor,
                          fontWeight: chartOptions.axisFontWeight
                      } 
                }                 
            },

            yAxis: {
                categories: featureToPlot,
                title: null,
                reversed: true,
                labels: {
                      style: {
                          color: chartOptions.yAxisTicksColor,
                          fontWeight: chartOptions.axisFontWeight
                      } 
                }                 
            },

            colorAxis: [{
                min: 0,
                max: 1,
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
                // minColor: 'white',
                // maxColor: 'blue'
                // stops: [
                //     [-1.0, '#660000'],
                //     [-0.875, '#990000'],  
                //     [-0.75, '#cc0000'],  
                //     [-0.625, '#ff1a1a'],  
                //     [-0.5, '#ff4d4d'],  
                //     [-0.375, '#ff8080'],  
                //     [-0.25, '#ffb3b3'],  
                //     [-0.125, '#ffe6e6'],
                //     [ 0.0, '#ffffff'],                    
                //     [ 0.125, '#e6f2ff'],                    
                //     [ 0.25, '#cce6ff'],
                //     [ 0.375, '#99ccff'],
                //     [ 0.5, '#66b3ff'],
                //     [ 0.625, '#3399ff'],
                //     [ 0.75, '#0080ff'],
                //     [ 0.875, '#0066cc'],
                //     [ 1.0, '#004d99']
                // ]                                
            }, 
            {
                min: -1,
                max: 0,
                minColor: '#ff5c33',
                maxColor: '#FFFFFF'                

            }],

            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 0,
                symbolHeight: 150
            },

            tooltip: {
                formatter: function () {
                    // return '<b>' + getPointCategoryName(this.point, 'x') + '</b> has <br><b>' +
                    //     this.point.value + '</b> corr with <br><b>' + getPointCategoryName(this.point, 'y') + '</b>';
                    return  this.point.value;                        
                }
            },

            series: [{
                name: 'Features Correlation',
                borderWidth: 1,
                data: chartData,
                dataLabels: {
                    enabled: false,
                    color: '#000000'
                }
            }],

            // responsive: {
            //     rules: [{
            //         condition: {
            //             maxWidth: 500
            //         },
            //         chartOptions: {
            //             yAxis: {
            //                 labels: {
            //                     formatter: function () {
            //                         return this.value.charAt(0);
            //                     }
            //                 }
            //             }
            //         }
            //     }]
            // }

        }, 
            // For negative correlation values color with red 
            function(chart) {
              chart.series[0].data.forEach(point => {
                if (point.value < 0) {

                    let heatmapColor;

                    if(point.value >= -0.125) {
                        heatmapColor = '#ffe6e6';

                    } else if ( (point.value < -0.125) && (point.value >= -0.250) ) {
                        // heatmapColor = '#ffb3b3';
                        heatmapColor = '#ffd6cc';

                    } else if ( (point.value < -0.250) && (point.value >= -0.375) ) {
                        // heatmapColor = '#ff8080';
                        heatmapColor = '#ffc2b3';

                    } else if ( (point.value < -0.375) && (point.value >= -0.500) ) {
                        // heatmapColor = '#ff4d4d';
                        heatmapColor = '#ffad99';

                    } else if ( (point.value < -0.500) && (point.value >= -0.625) ) {
                        // heatmapColor = '#ff1a1a';
                        heatmapColor = '#ff9980';

                    } else if ( (point.value < -0.625) && (point.value >= -0.750) ) {
                        // heatmapColor = '#cc0000';
                        heatmapColor = '#ff8566';

                    } else if ( (point.value < -0.750) && (point.value >= -0.875) ) {
                        // heatmapColor = '#990000';
                        heatmapColor = '#ff704d';

                    } else if ( (point.value < -0.875) && (point.value >= -1.000) ) {
                        // heatmapColor = '#660000';
                        heatmapColor = '#ff5c33';

                    } 

                    point.update({ color: heatmapColor});
                }
              })
            }

        );
}
//--------------------------------------------------------------------------------------------------//
//-------------------------------------scatter chart 3D---------------------------------------------//
//--------------------------------------------------------------------------------------------------//

drawScatterChart3D = (chartData3D , subTitle = null, xTitle = null, yTitle = null, zTitle =  null) => {

        // Give the points a 3D feel by adding a radial gradient
        // Highcharts.setOptions({
        //     colors: Highcharts.getOptions().colors.map(function (color) {
        //         return {
        //             radialGradient: {
        //                 cx: 0.4,
        //                 cy: 0.3,
        //                 r: 0.5
        //             },
        //             stops: [
        //                 [0, color],
        //                 [1, Highcharts.color(color).brighten(-0.2).get('rgb')]
        //             ]
        //         };
        //     })
        // });

        // Set up the chart
        chartOptions.container = new Highcharts.Chart({
            chart: {
                renderTo: 'chartContainer',
                margin: 10,
                backgroundColor: chartOptions.backgroundColor,
                height: '80%',                
                type: 'scatter3d',
                animation: false,
                options3d: {
                    enabled: true,
                    alpha: 10,
                    beta: 30,
                    depth: 100,
                    viewDistance: 5,
                    fitToPlot: true,
                    frame: {
                        bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                        back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                        side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                    }
                }
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            // plotOptions: {
            //     scatter: {
            //         width: 10,
            //         height: 10,
            //         depth: 10
            //     }
            // },
            yAxis: {
                // min: 0,
                // max: 10,
                title: null
            },
            xAxis: {
                // min: 0,
                // max: 10,
                gridLineWidth: 1
            },
            zAxis: {
                // min: 0,
                // max: 10,
                showFirstLabel: false
            },
            legend: {
               enabled: true,
               align: 'center',
               verticalAlign: 'top',
               layout: 'horizontal',
                itemStyle: {
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: "10px"
                }               
            },
            series: chartData3D,

            responsive: {
               rules: [{
                  condition: {
                      maxWidth: 500
                  },
                  chartOptions: {
                      credits: {
                          enabled: false
                      }
                  }
               }]
            }  
            

        });


        // Add mouse and touch events for rotation
        (function (H) {
            function dragStart(eStart) {
                eStart = chartOptions.container.pointer.normalize(eStart);

                var posX = eStart.chartX,
                    posY = eStart.chartY,
                    alpha = chartOptions.container.options.chart.options3d.alpha,
                    beta = chartOptions.container.options.chart.options3d.beta,
                    sensitivity = 5,  // lower is more sensitive
                    handlers = [];

                function drag(e) {
                    // Get e.chartX and e.chartY
                    e = chartOptions.container.pointer.normalize(e);

                    chartOptions.container.update({
                        chart: {
                            options3d: {
                                alpha: alpha + (e.chartY - posY) / sensitivity,
                                beta: beta + (posX - e.chartX) / sensitivity
                            }
                        }
                    }, undefined, undefined, false);
                }

                function unbindAll() {
                    handlers.forEach(function (unbind) {
                        if (unbind) {
                            unbind();
                        }
                    });
                    handlers.length = 0;
                }

                handlers.push(H.addEvent(document, 'mousemove', drag));
                handlers.push(H.addEvent(document, 'touchmove', drag));


                handlers.push(H.addEvent(document, 'mouseup', unbindAll));
                handlers.push(H.addEvent(document, 'touchend', unbindAll));
            }
            H.addEvent(chartOptions.container.container, 'mousedown', dragStart);
            H.addEvent(chartOptions.container.container, 'touchstart', dragStart);
        }(Highcharts));


}   


//--------------------------------------------------------------------------------------------------//
//-------------------------------------scatter chart 2D---------------------------------------------//
//--------------------------------------------------------------------------------------------------//
// can be used for t-SNE 2D
// chartData [{ name: Tumor, color: TumorCOlor, data: [[100, 161], [175, 122] .. ] }, {...}] 

drawScatterChart = (chartData, subTitle = null, xTitle = null, yTitle = null) => {

    if(chartOptions.defaultLibrary == "highcharts") {

        chartOptions.container =  Highcharts.chart('chartContainer', {

                    chart: {
                        backgroundColor: chartOptions.backgroundColor,
                        type: 'scatter',
                        height: '70%'
                    },
                    title: {
                        text: ""
                    },
                    subtitle: {
                        text: subTitle,
                        style: {
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '10px',
                            fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                        }                        
                    },
                    xAxis: {
                        title: {
                            enabled: true,
                            text: xTitle,
                            style: {
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '10px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                            }                             
                        },
                        labels: {
                              style: {
                                  color: chartOptions.yAxisTicksColor,
                                  fontWeight: chartOptions.axisFontWeight
                                  // fontSize: "1vw"
                              } 
                        }                             
                    },
                    yAxis: {
                        gridLineWidth: 0, 
                        title: {
                            text: yTitle,
                            style: {
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '10px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                            }                             
                        },
                        labels: {
                              style: {
                                  color: chartOptions.yAxisTicksColor,
                                  fontWeight: chartOptions.axisFontWeight
                                  // fontSize: "1vw"
                              }  
                        }                            
                    },

                    legend: {
                        align: 'center',  // left, right
                        verticalAlign: 'top',  // top, middle or bottom
                        layout: 'horizontal',  //horizontal , proximate, vertical
                        itemStyle: {
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: "10px"
                        }
                    },   


                    // legend: {
                    //     layout: 'vertical',
                    //     align: 'left',
                    //     verticalAlign: 'top',
                    //     x: 100,
                    //     y: 70,
                    //     floating: true,
                    //     backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                    //     borderWidth: 1
                    // },
                    plotOptions: {
                        scatter: {
                            marker: {
                                radius: 2,
                                states: {
                                    hover: {
                                        enabled: true,
                                        lineColor: 'rgb(100,100,100)'
                                    }
                                }
                            },
                            states: {
                                hover: {
                                    marker: {
                                        enabled: false
                                    }
                                }
                            },
                            tooltip: {
                                headerFormat: '<b>{series.name}</b><br>',
                                pointFormat: '{point.x} , {point.y}'
                            }
                        }
                    },
                    series: chartData,

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

}
//------------------------------------------------------------------------------//
//------------------------- Celltype Chart Column ------------------------------//
//------------------------------------------------------------------------------//

// chartData Object { Tumor: 21104, Immune: 28816, Stromal: 28934, Others: 26460 }
drawCellTypesColumnChart = (chartData, cellTypeColors, xTitle) => {

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


          // --cellTypeColors is Object: { Tumor: "#ff4846", Immune: "#61c346", Stromal: "#5dd1ff", Others: "#6244d9" }
          // -- OR
          // --cellTypeColors is Object: { 10011: "#ff4846", 10101: "#61c346", ... }

          let seriesToPlot = [];
 
          Object.keys(chartData).forEach(basicClass => {    // basicClass is [ "Tumor", "Immune", "Stromal", "Others" ];      
               seriesToPlot.push({name: basicClass, data: [chartData[basicClass]],  color: cellTypeColors[basicClass]});
          });     

 

        chartOptions.container = Highcharts.chart('chartContainer', {

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
                        categories: [xTitle],
                        crosshair: true,
                        labels: {
                              rotation: 0,
                              style: {
                                  color: chartOptions.xAxisTicksColor,
                                  fontWeight: chartOptions.axisFontWeight
                              }
                        }                        
                    },

                    yAxis: {
                        min: 0,
                        gridLineWidth: 0,                        
                        title: {
                            text: '(#Cells)'
                        },
                        labels: {
                              style: {
                                  color: chartOptions.yAxisTicksColor,
                                  fontWeight: chartOptions.axisFontWeight
                              } 
                        }                         
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0; color:black"><b>{point.y:.1f} </b></td></tr>',
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
                    series: seriesToPlot,
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
}

//---------------------- CellType Chart 3D Pie  ----------------------------//
// drawCellTypes3dPieChart = (chartData) => {

//     if(chartOptions.animation) {
//       chartOptions.animation = {duration: chartOptions.animationDuration};
//     } 

//     if(chartOptions.defaultLibrary == "highcharts") {

//           // Highcharts.setOptions({
//           //     plotOptions: {
//           //         series: {
//           //             animation: chartOptions.animation,
//           //             // borderColor: '#303030'
//           //             borderWidth: 0  // bar border, default is 1 and white
//           //         }
//           //     }
//           // });         

//          let cellTypeColors = {};

//           mainCellTypesList.forEach((cellTypeEntry, idx) => {
//                  let cellType = cellTypeEntry.cellType;
//                  let clr = cellTypeEntry.cellTypeColor;

//                  cellTypeColors[cellTypeEntry.cellType] = cellTypeEntry.cellTypeColor; 
//           });    


//           let seriesToPlot = [];
 
//           Object.keys(chartData).forEach(basicClass => {    // basicClass is [ "Tumor", "Immune", "Stromal", "Others" ];      
//                seriesToPlot.push({name: basicClass, data: [chartData[basicClass]],  color: cellTypeColors[basicClass]});
//           });        

//           Highcharts.chart('chartContainer', {

//                              chart: {
//                                     type: 'pie',
//                                     backgroundColor: chartOptions.backgroundColor,
//                                     height: '70%',
//                                     options3d: {
//                                         enabled: true,
//                                         alpha: 45,
//                                         beta: 0
//                                     }
//                                 },
//                                 title: {
//                                     text: ''
//                                 },
//                                 accessibility: {
//                                     point: {
//                                         valueSuffix: '%'
//                                     }
//                                 },
//                                 tooltip: {
//                                     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//                                 },
//                                 plotOptions: {
//                                     pie: {
//                                         allowPointSelect: true,
//                                         cursor: 'pointer',
//                                         depth: 25,
//                                         dataLabels: {
//                                             enabled: true,
//                                             color: 'rgba(255,255,255)',
//                                             format: '{point.name}'
//                                         }
//                                     }
//                                 },
//                                 series: [{
//                                     type: 'pie',
//                                     name: 'Browser share',
//                                     data: seriesToPlot 
//                                 }]
//         });          
//     }  
// }

//------------------------------------------------------------------------------//
//---------------------- Phenotype Chart Column 3d  ----------------------------//
//------------------------------------------------------------------------------//
// drawCellPhenotypes3dCylinder = (chartData) => {

//     if(chartOptions.animation) {
//       chartOptions.animation = {duration: chartOptions.animationDuration};
//     } 

//     if(chartOptions.defaultLibrary == "highcharts") {



//             //e.g allValidPhenotypes.push({binary: binaryMarkersString, validCells: allValidCells, 
//             //                           totalValidCellsNum: allValidCells.length, phenotypeColor: null });

//           let seriesToPlot = [];

//           for(let i = 0; i < chartData.length; i++) {
//                seriesToPlot.push({name: chartData[i].binary, data: [chartData[i].totalValidCellsNum*100/getTotalTilesNum()],  color: chartData[i].phenotypeColor});
//           }     

 

//          chartOptions.container = Highcharts.chart('chartContainer', {

//                     chart: {
//                         type: 'cylinder',

//                         options3d: {
//                             enabled: true,
//                             alpha: 15,
//                             beta: 15,
//                             depth: 50,
//                             viewDistance: 25
//                         }
//                     },
//                     title: {
//                         text: ''
//                     },
//                     plotOptions: {
//                         series: {
//                             depth: 25,
//                             colorByPoint: true
//                         }
//                     },
//                     series: [{
//                         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
//                         name: 'Cylinders',
//                         showInLegend: false
//                     }]

//         });          
//     }  
// }

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

            //e.g allValidPhenotypes.push({binary: binaryMarkersString, validCells: allValidCells, 
            //                           totalValidCellsNum: allValidCells.length, phenotypeColor: null });

          // let seriesToPlot = [];

          // for(let i = 0; i < chartData.length; i++) {
          //      seriesToPlot.push({name: chartData[i].binary, data: [chartData[i].totalValidCellsNum*100/getTotalTilesNum()],  color: chartData[i].phenotypeColor});
          // }     

          // console.log( " series To plot : ", seriesToPlot)   

          chartOptions.container = Highcharts.chart('chartContainer', {

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
                    series: chartData

        });          
    }  
}

//---------------------- Phenotype Chart Column  ----------------------------//
// drawCellPhenotypesColumnChart = (chartData) => {

//     if(chartOptions.animation) {
//       chartOptions.animation = {duration: chartOptions.animationDuration};
//     } 

//     if(chartOptions.defaultLibrary == "highcharts") {

//           Highcharts.setOptions({
//               plotOptions: {
//                   series: {
//                       animation: chartOptions.animation,
//                       // borderColor: '#303030'
//                       borderWidth: 0  // bar border, default is 1 and white
//                   }
//               }
//           });   

//             //e.g allValidPhenotypes.push({binary: binaryMarkersString, validCells: allValidCells, 
//             //                           totalValidCellsNum: allValidCells.length, phenotypeColor: null });

//           let seriesToPlot = [];

//           for(let i = 0; i < chartData.length; i++) {
//                seriesToPlot.push({name: chartData[i].binary, data: [chartData[i].totalValidCellsNum*100/getTotalTilesNum()],  color: chartData[i].phenotypeColor});
//           }     

//           console.log( " series To plot : ", seriesToPlot)   

//           Highcharts.chart('chartContainer', {

//                     chart: {
//                         type: 'column',
//                         backgroundColor: chartOptions.backgroundColor,
//                         height: '70%',
//                     },
//                     title: {
//                         text: ''
//                     },
//                     legend: {
//                         align: 'center',  // left, right
//                         verticalAlign: 'top',  // top, middle or bottom
//                         layout: 'horizontal',  //horizontal , proximate, vertical
//                         itemStyle: {
//                             color: 'white',
//                             fontWeight: 'bold'
//                         }
//                     },    
//                     xAxis: {
//                         categories: [
//                             'Phenotypes'
//                         ],
//                         crosshair: true
//                     },
//                     yAxis: {
//                         min: 0,
//                         title: {
//                             text: '(%)'
//                         }
//                     },
//                     tooltip: {
//                         headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
//                         pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
//                             '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
//                         footerFormat: '</table>',
//                         shared: true,
//                         useHTML: true
//                     },
//                     plotOptions: {
//                         column: {
//                             pointPadding: 0.2,
//                             borderWidth: 0
//                         }
//                     },
//                     series: seriesToPlot

//         });          
//     }  
// }

//---------------------- Phenotype Chart 3D Pie  ----------------------------//
// drawCellPhenotypes3dPieChart = (chartData) => {

//     if(chartOptions.animation) {
//       chartOptions.animation = {duration: chartOptions.animationDuration};
//     } 

//     if(chartOptions.defaultLibrary == "highcharts") {

//           // Highcharts.setOptions({
//           //     plotOptions: {
//           //         series: {
//           //             animation: chartOptions.animation,
//           //             // borderColor: '#303030'
//           //             borderWidth: 0  // bar border, default is 1 and white
//           //         }
//           //     }
//           // });   

// //e.g allValidPhenotypes.push({binary: binaryMarkersString, validCells: allValidCells, 
// //                           totalValidCellsNum: allValidCells.length, phenotypeColor: null });

//           let seriesToPlot = [];

//           for(let i = 0; i < chartData.length; i++) {
//                seriesToPlot.push({name: chartData[i].binary, y: chartData[i].totalValidCellsNum*100/getTotalTilesNum(),  color: chartData[i].phenotypeColor});
//           }        

//           Highcharts.chart('chartContainer', {

//                              chart: {
//                                     type: 'pie',
//                                     backgroundColor: chartOptions.backgroundColor,
//                                     height: '70%',
//                                     options3d: {
//                                         enabled: true,
//                                         alpha: 45,
//                                         beta: 0
//                                     }
//                                 },
//                                 title: {
//                                     text: ''
//                                 },
//                                 accessibility: {
//                                     point: {
//                                         valueSuffix: '%'
//                                     }
//                                 },
//                                 tooltip: {
//                                     pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//                                 },
//                                 plotOptions: {
//                                     pie: {
//                                         allowPointSelect: true,
//                                         cursor: 'pointer',
//                                         depth: 25,
//                                         dataLabels: {
//                                             enabled: true,
//                                             color: 'rgba(255,255,255)',
//                                             format: '{point.name}'
//                                         }
//                                     }
//                                 },
//                                 series: [{
//                                     type: 'pie',
//                                     name: 'Browser share',
//                                     data: seriesToPlot 
//                                 }]
//         });          
//     }  
// }

//---------------------- Phenotype Chart Pie with gradient fill  ----------------------------//
// drawCellPhenotypesPieGradientChart = (chartData) => {

//     if(chartOptions.animation) {
//       chartOptions.animation = {duration: chartOptions.animationDuration};
//     } 

//     if(chartOptions.defaultLibrary == "highcharts") {

//           // Radialize the colors
//           Highcharts.setOptions({
//               colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
//                   return {
//                       radialGradient: {
//                           cx: 0.5,
//                           cy: 0.3,
//                           r: 0.7
//                       },
//                       stops: [
//                           [0, color],
//                           [1, Highcharts.color(color).brighten(-0.3).get('rgb')] // darken
//                       ]
//                   };
//               })
//           });   

// //e.g allValidPhenotypes.push({binary: binaryMarkersString, validCells: allValidCells, 
// //                           totalValidCellsNum: allValidCells.length, phenotypeColor: null });

//           let seriesToPlot = [];

//           for(let i = 0; i < chartData.length; i++) {
//                seriesToPlot.push({name: chartData[i].binary, y: chartData[i].totalValidCellsNum*100/getTotalTilesNum(),  color: chartData[i].phenotypeColor});
//           }        

//           Highcharts.chart('chartContainer', {
//                         chart: {
//                             plotBackgroundColor: chartOptions.backgroundColor,
//                             plotBorderWidth: null,
//                             plotShadow: false,
//                             type: 'pie',
//                             height: '80%'
//                         },
//                         title: {
//                             text: ''
//                         },
//                         tooltip: {
//                             pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//                         },
//                         accessibility: {
//                             point: {
//                                 valueSuffix: '%'
//                             }
//                         },
//                         plotOptions: {
//                             pie: {
//                                 allowPointSelect: true,
//                                 cursor: 'pointer',
//                                 dataLabels: {
//                                     enabled: true,
//                                     color: 'rgba(255,255,255)',
//                                     format: '<b>{point.name}</b>: {point.percentage:.1f} %',
//                                     connectorColor: 'silver'
//                                 }
//                             }
//                         },
//                         series: [{
//                             name: 'Share',
//                             data: seriesToPlot
//                         }]
//                     });        
//     }  
// }



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
    
    let boxplotData;

    if(Opts.isBoxplotChannelBased) {
         boxplotData = createChannelsStatisticalData();

        if(boxplotData == "Failed") {
             boxplotData = [];
             triggerHint("Calculate makers boxplots Failed, image channel can not convert to gray.. ", "error", 5000);
             return 0;
        } 

        if(boxplotData == "chNormFailed") {
             boxplotData = [];
             triggerHint("Image normalization " + "<b><font color='red'>Failed</font></b>" + " due to insufficient Memory.  ", "error", 10000);
             console.log("Image normalization Failed due to insufficient Memory, please  try without Image Normalization" );                   
             return 0;
        }         


    } else { // if it is cell based
        boxplotData = createMarkerCellsStatisticalData();
    }

    if(boxplotData.length ) {
        setGrpChannelsStatisticalData(boxplotData);
        webix.message("Markers boxplot data calculated successfully");
        if(plotFlag){// if calculateMarkerBoxplots used with Phenotypes, the plotFlag will be false
           plotMarkersBoxPlots();
        }
    }

}

// Can be used for channel based statisticals and cell based statistical
setGrpChannelsStatisticalData = (data) => {
       grpChannelsStatisticalData = data;
}

// Can be used for channel based statisticals and cell based statistical
getGrpChannelsStatisticalData = () => {
     return  grpChannelsStatisticalData.length ? grpChannelsStatisticalData : null;
}

// Can be used for channel based statisticals and cell based statistical
isGrpChannelsStatisticalDataAvailable =() => {
     return  grpChannelsStatisticalData.length ? true : false;

         
}

// Can be used for channel based statisticals and cell based statistical
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


       // check if image normalize not needed with creating features, should be excluded with Channels Statistical Data also
       if(Opts.isBoxplotChNormalizeRequired) {
           if(! Opts.isChannelNormalizeRequired) {  //--if isChannelNormalizeRequired is false
              Opts.isBoxplotChNormalizeRequired = "";  //-- "" is equvalent to false with flask
           } else {
              //-- if isChannelNormalizeRequired is true
              //-- check again for DSA meta settings

              let metaKey = "settings";
              // -- e.g.: {"imageNorm": false };
              let settings = getItemMetadataKeyValue(metaKey);

              if(settings == null) { // settings var  exists only if settings["imageNorm"] = false
                  Opts.isBoxplotChNormalizeRequired = true;
              } else if(settings["imageNorm"]) {
                  Opts.isBoxplotChNormalizeRequired = true;
              } else {
                  Opts.isBoxplotChNormalizeRequired = "";
              }             

           }

       }

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



//  calculate marker cells mean, max, min, std, median, q1, q3, 
// instead of create them based on marker channel intensity, marker cells are used to find mean of all marker cells etc.
createMarkerCellsStatisticalData = () => {

       // e.g. "Structural Components__markers_morphology.csv" 
       // csv file has markers intensities for each cell in addition to cells morphological features
       // it has each cell marker intensity e.g. CD45_max CD45_mean CD45_nonzero_mean
       // Opts.cellFeatureToSelect :  "_mean", // select from [ _mean, _max, _std, _nonzero_mean]
       let markersMorphFileName =  getGrpMarkersMorphFileName(); 
       let grpFeaturesFolder = getGrpFeaturesLocalPath();


       // For boxplot data file and location e.g. Structural Components_MarkerCells_Boxplot_Data.json
       let boxplotFileName = getGrpMarkerCellsBoxplotFileName(); 
       let boxplotFolder = getGrpBoxplotLocalPath();

       // groupMarkers e.g. Array(5) [ "DAPI", "KERATIN", "ASMA", "CD45", "IBA1" ]
       let groupMarkers = getCurGrpChannelsName();

       let boxplotData = [];


       webix.ajax().sync().get("http://127.0.0.1:" + Opts.defaultRestApiPort +  
        "/createMarkerCellsStatisticalData", "&features_folder=" + grpFeaturesFolder + "&markers_morph_file=" + markersMorphFileName +
        "&boxplot_file=" + boxplotFileName + "&boxplot_folder=" + boxplotFolder + "&grp_markers=" + JSON.stringify(groupMarkers) + 
        // "&neglect_zero=" + Opts.boxplotForAboveZeroCells + 
        "&isMarkerFeatureNormalizeRequired=" + Opts.isMarkerFeatureNormalizeRequired + 
        "&cellFeatureToNormalize=" + Opts.cellFeatureToNormalize , function(response) {

             boxplotData = JSON.parse(response);
      });

    // boxplot sample data e.g. {Frame: 'CD45',    max: 255.0,   mean: 5.174311939678205, 
    //                           median: 3.0,   min: 0.0, q1: 1.0,   q3: 8.0,   std: 5.5190755543079115}

     return boxplotData;
}




//For each channel, plot the marker of this channel low, q1, median, q3 and high values
plotMarkersBoxPlots = () => {
        let isFileExistFlat = false;

        if(Opts.isBoxplotChannelBased) {
             isFileExistFlat = isLocalFileExist( getGrpBoxplotFileName(), getGrpBoxplotLocalPath() );

        } else { // if it is cell based
             isFileExistFlat = isLocalFileExist( getGrpMarkerCellsBoxplotFileName(), getGrpBoxplotLocalPath() );
        }




      if( isFileExistFlat ) {     
           if (! isGrpChannelsStatisticalDataAvailable() ) {

                if(Opts.isBoxplotChannelBased) {
                      // load the data       
                      grpChannelsStatisticalData = readJsonFile(getGrpBoxplotFileName(), getGrpBoxplotLocalPath() ); 

                } else { // if it is cell based
                      grpChannelsStatisticalData = readJsonFile(getGrpMarkerCellsBoxplotFileName(), getGrpBoxplotLocalPath() ); 
                }
 
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
         if( (getSelectedChartOperation() == "Histogram") || (getSelectedChartOperation() == "Histogram-log1p(y)" )) {    
              resetChartPlottingData();
         } 
    }         

}
///////////////////////////////////////////////////
//On cell mouse over event - show histogram of each cell
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
    grpChannelsStatisticalData = [];
    dapiMorphStatisticalData = {};    
    cellBasicClassification = [];
    allTilesFeaturesAndClassification =[];   
    filteredNeighbors = {};  
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
    let topFrame = viewer.world.getItemAt(0);
    // var zoomArea = viewer.viewport.imageToViewportRectangle(obj_bbox['left'], obj_bbox['top'], obj_bbox['width'], obj_bbox['height']);
    var zoomArea = topFrame.imageToViewportRectangle(obj_bbox['left'], obj_bbox['top'], obj_bbox['width'], obj_bbox['height']);    
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
    // For future use
  }

  saveFeatureDataLocally = (featuresData, fileName, dirLocalPath ) => {
       let saveSuccessFlag = true;   

        try {
            let jsonString_tilesFeatures = JSON.stringify(featuresData); // convet object to JSON string e.g. {id: 1} -> {"id": 1}
            let maxFileSize = Opts.maxFileSize;  // default 500000 size to send it to flask and avoid javascript syntaxerror "the url is malformed "

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
            viewerZoomHome();                //  <<<<<<<<<<< ------------ enforce sync 
            webix.message("Creating features in progress...");
                                          

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
            let maxFileSize = Opts.maxFileSize;
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
                                                     allTilesFeatures = [];
                                                     triggerHint("Can not  convert image channels to gray image.. ", "error", 5000);
                                                     return 0;
                                                }


                                                if(allTilesFeatures == "chNormFailed") {
                                                     allTilesFeatures = [];
                                                     triggerHint("Image normalization " + "<b><font color='red'>Failed</font></b>" + 
                                                                 " due to insufficient Memory, Would you like to bypass normalize step " +
                                                                '<a href="javascript:void(0)" onclick="bypassImageNormalization()">[<b><font color="green">Yes</font></b>]</a>' + 
                                                                '<a href="javascript:void(0)" onclick="closeHint()">[<b><font color="red">No</font></b>]</a>', "error", 60000);


                                                     console.log("Image normalization Failed due to insufficient Memory, there is a need to bypass normalization or to reduce/crop image size or free more memory, or increase memory size " );                   
                                                     // Opts.isChannelNormalizeRequired = false;
                                                     //setItemMetadataKeyValue(metaKey, metaValue) 
                                                     return 0;
                                                }

                                           // let metaKey = "settings";
                                               // let metaValue = Opts.isChannelNormalizeRequired == true ? {"imageNorm": true } : {"imageNorm": false };
                                               // setItemMetadataKeyValue(metaKey, metaValue);                                                


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
            //     let maxFileSize = Opts.maxFileSize;;  // to send it to flask and avoid javascript syntaxerror "the url is malformed "

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



showLoadingIcon = () => {
    var defer = $.Deferred();
    document.getElementById("loadingIcon").style.display = 'block'; 
    setTimeout(function() {
        defer.resolve(); // When this fires, the code in a().then(/..../); is executed.
    }, 100);

    return defer;     
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
        resetChartOperations();
        resetSelectedTile();
        resetLastSelectedTileId();
        resetRightClickedTile();
        resetTileValuesDependency();
        resetTileFeatures();
   }

})();    