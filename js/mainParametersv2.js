/*!
=========================================================
* HistJS Demo - v1.1.0
=========================================================

* Github:  https://github.com/Mmasoud1
* Discription:  A user interface for whole slide image channel design, analysis and registration. 
*               It is based on DSA as backbone server
* 
*
* Coded by Mohamed Masoud ( mmasoud2@outlook.com )

=========================================================



=========================================================
                      Main Parameters
=========================================================*/

    //---------- initialize Globals-------//  
   
   //--  Host list --//
   var DSA_SERVER_LIST = [
                          {id: "1", value: "Girder", hostAPI: "http://dermannotator.org:8080/api/v1"},
                          {id: "2", value: "Cancer digital slide archive", hostAPI: "http://candygram.neurology.emory.edu:8080/api/v1"},
                          {id: "3", value: "Styx", hostAPI: "https://styx.neurology.emory.edu/girder/api/v1/"}  
                          //{id: "4", value: "LocalHost", hostAPI: "http://localhost:8080/api/v1/"}  
                         ]

   
    var colorContrastMap = [ 
                             { /*WHITE*/ color: "FFFFFF", contrast_Max: 35000, contrast_Min: 500  }, 
                             { /**RED**/ color: "FF0000", contrast_Max: 25000, contrast_Min: 1000 },
                             { /*BLUE**/ color: "0000FF", contrast_Max: 60000, contrast_Min: 500  },
                             { /*GREEN*/ color: "00FF00", contrast_Max: 5000 , contrast_Min: 100  }, 
                             { /*AQUA**/ color: "00FFFF", contrast_Max: 65000, contrast_Min: 1000 }
                           ]

 
    class chColorContrastStates {
                 constructor (){
                  this.grpIndex = null;
                  this.chIndex = null;
                  this.originalColor = null;
                  this.originalContrastMax = null;
                  this.originalContrastMin = null;
                  this.newColor = null;                                        
                  this.newContrastMax = null;
                  this.newContrastMin = null;
                  this.changesComfirmed = false;
                  this.changesCanceled = false;        
                  this.lastCommand = null;  
                 }
    }

    var curChColorContrastStates = [];

    //-- Host/Collection selection states --//
    var currentHostCollectSelectionStates = ({hostObject: null, collectionList: null, foldersList: null, item: null, hostIndex: 0, collectionIndex: null, isHostLogin: false})


    var lastHostCollectSelectionStates = ({hostIndex: null, hostChanged: 0, collectionIndex: null, itemId: null}); //-- --//

    var channelStates = ({currentIndex: null, lastIndex: null, channelChanged: 0}); //-- --//
 
    var tempSceneSelections=[];
    var tempGrpRemoved=[];
    var tempServerRemoved=[];

    var currentItemInfo = ({
                            omeDataset: null, 
                            maxGroupLabelLen: null, 
                            dsaSourceExists: null, 
                            dsaSourceNeedUpdate: null, 
                            size: null, 
                            width: null, 
                            height: null,
                            isMultiPlex: null,
                            singlePlexMetaInfo: null,
                            multiPlexMetaInfo: null
                           });  //-- On selected OME File --//


    var lastItemSelectionStates = ({grpIndex: null, zoomValue:0, storyIndex: null});

    var Opts = {
            // General Interface Options
            maxGrpLabelLen:               28,
            maxhostListWithSettings:      4,  // must be <= 4 
            creatItemTreeByBranch:        true, // if false, item tree will be created at all and loaded at once 
            selectedElemBgColor:          "rgba(255,255,255,0.5)",
            selectedElemFontColor:        "black",
            selectedElemFontWeight:       "bold",
            defaultElemBgColor:           "",  
            defaultElemFontColor:         "white", 
            defaultElemFontWeight:        "normal",
            defaultCompositeOperation:    "lighter",

            //Tigger Hint Options
            defaultOpeningTime:            10000,                
            isFirstClickEventAfterTrigger: true,
            isHintAutoClosable:            true, // false means hint does not close with timer 
            isHintCloseOnMouseEvent:       false, // false means hint close with timer, true means close when click on any element             
            numOfMouseEventToCloseHint:    1, // (Future use) minimum number of mouse event to close hint 
            curMouseEventCount:            0, // (Future use) counter to count the number of mouse event   

            // General OSD settings 
            defaultOsdMouseTracking:      true, 

            // General Analysis Options  
            /// Grid
            defaultGridSize:              128,               
            maxGridSizeRange:             512,
            minGridSizeRange:             64,
            gridSizeStep:                 64,
            /// Boundary 
            defaultSpxBoundaryShapes:     {polygon: true}, // False means create bbox
            defaultBoundaryFillColor:     "#bd5656", //"#ff0",
            defaultBoundaryFillOpacity:   0.25,
            /// Strock
            defaultStrokeColor:           "white", //"#000", 
            defaultStrokeOpacity:         0.5, 
            defaultStrokeWidth:           3, 
            maxStrokeWidth:               5,
            /// Tile Selection
            selectedTileStrokeWidth:      10, 
            selectedTileFillColor:        "white",
            selectedTileFillOpacity:      1, 

            // Similar Regions Button Options
            originalTileStrokeWidth:      10, 
            originalTileStrokeColor:      'yellow',             
            originalTileStrokeOpacity:    1,  
            similarTileStrokeWidth:      10, 
            similarTileStrokeColor:      'yellow',             
            similarTileFillColor:        "orange",
            similarTileStrokeOpacity:      1,             

            // During Create Features
            defaultScanningFillColor:     "white", //"#000", 
            defaultScanningFillOpacity:   0.8,   
           
            StrokeWidthOnHover:           10,
            StrokeColorOnHover:           "blue",
            StrokeOpacityOnHover:         1,  

            resetSwitchTimeOut:           2000, // seconds

            // RestApi(flast) default Settings 
            contourApproximation:         true, // For extracting boundaries from cell mask, this option can reduce JSON file by 60%            
            searchEntirHostForResource:   false, // e.g. search entire host to finde cellMask.tiff, to use with getRemoteFileId() 
            createTilesFeature:           {allTilesAtOnce: true}, // "false" : means create features by scanning tile by tile, very slow option


            // General Environment Settings 
            multiPlexFileExtension:       ".ome.tif",

            defaultRestApiPort:           5000,
            defaultFeaturesDir:           "features",  // Local directory  within the widget root level to save features.         
            defaultBoundariesDir:         "boundaries",  // Local directory  within the widget root level to save boundaries info. 
            defaultRegistrationDir:       "registration", // Local directory  within the widget root level to save registration info. 
            dockerMountingDir:            ""             // for  RestApi decker


     }

     var screenStatus = ({activeForm: null, activeLayout: null,  panelActiveState: null,  activeMode: null,  infoPanelFirstEnter: null, 
                         bestScreenDim: { availWidth: 2071,   //  Returns the width of the screen (excluding the Windows Taskbar)
                                          availHeight: 1179, 
                                          innerWidth: 2071,
                                          innerHeight: 1097, 
                                          width: 2144, 
                                          height: 1206, 
                                          colorDepth: 24, 
                                          pixelDepth: 24, 
                                          top: 0, 
                                          left: 0, 
                                          availTop: 27, 
                                          availLeft: 73 
                                        }
                         }); //-- --//




    var compositeOperations = [
                            {id: "1", type: "source-in",  description: "The output shows only the region of the upper channel that overlaps with all lower channels."},
                            {id: "2", type: "lighter",  description: "The output color is determined by adding color values of overlap regions."},
                            {id: "3", type: "xor",  description: "The output has only the non-overlap regions of the all channels, given that there is no two channels have exactly the same cells, or the resulted output will be inaccurate"},
                            {id: "4", type: "multiply", description: "The pixels are of the top channel are multiplied with the corresponding pixel of the bottom channel. A darker regions are the overlap regions."},
                            {id: "5", type: "screen", description: "The pixels are of the top channel are inverted, multiplied, and inverted again with the corresponding pixel of the bottom channel. A lighter regions are the overlap regions. "},
                            {id: "6", type: "difference", description: " Subtracts the bottom channel from the top channel or the other way round to always get a positive value. "}
                          ];


   var  currentGrpFeaturesSelectionStates = ({boundaryOn: false, boundaryType: "grid" /* spx */, displayOption: "composite", 
                                              compositeOperation: "lighter",  tile: null, rightClickedTile: null
                                            });
   var lastGrpFeaturesSelectionStates = ({boundaryOn: false, boundaryType: "grid" /* spx */, displayOption: "composite", 
                                          compositeOperation: "lighter", tileId: null
                                        });
   

   var cellFiltersStates = ({ originalStates: { boundariesOpacity: null, boundariesColor: null, strockOpacity: null, strockColor: null, 
                                  strockWidth: null}, navigatorPointer: 0
                            });


   var featureKeys = ["mean", "max", "std"]; // <-----To create features checkboxes dynamically, change here. Also change in "chart"  below
   var checkboxSelectedFeatures = [...featureKeys]; // when checkboxes selected, by default all features selected

   // Analysis CHNL PLOTS chart
   chartOperationsList = [
                            {id: "1", type: "Histogram",  description: "The output shows the current tile histogram of markers."},
                            {id: "2", type: "Boxplot",  description: "The output shows the boxplot of each marker."},
                            {id: "3", type: "Cluster",  description: "The output cell cluster"}
                         ];   

   var chartOptions = ({ 
                canvas: null,
                container: null,
                
                defaultOperation : "Histogram",
                currentOperation : "Histogram",
                histogram: { 
                                keys: ["mean", "max", "std"],                                        // <-----
                                rangeValues: {min: 0, max: 250, stepSize: 50}, 
                                bgColor:  ['rgba(42, 180, 192, 1.0)', 'rgba(76, 135, 185, 1.0)', 'rgba(243, 82, 58, 1.0)' ]
                              },
                // Channel Grouped Bar Features Chart
                labelsColor:              "white",
                libraries:                ["chartjs", "highcharts"],
                defaultLibrary:           "highcharts", // 0: chartjs, 1: highcharts
                xAxisTicksColor:          "white",
                yAxisTicksColor:          "white",
                axisFontWeight:           "bold",
                backgroundColor:          'rgba(0,0,0,0.3)',
                animation:                false,
                animationDuration:        500,
                isFirstAppear:            true                
   })

   var allTilesFeatures = [];  // need correction to allTilesFeature
   var grpChannelsStatisticalData = []; // has each channel mean, max, min, std, median, q1, q3 
   var allValideTiles = [];
   var Boundary_box = []; 
   var SPXTilesLabel = [];
   var GridTilesLabel = [];

   var HeatmapRange = [
                       "#330000", "#FF0000", "#FF3333", "#FF6666", 
                       "#FF9999", "#FFB266", "#FFE5CC", "#FFFF66",
                       "#FFFFCC", "#FFFFFF", "#CCE5FF", "#99CCFF", 
                       "#66B2FF", "#3399FF", "#0080FF", "#0066CC", "#004C99"
                      ]  

   var animateTile = null; 


