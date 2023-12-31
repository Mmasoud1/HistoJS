/*!
=========================================================
* HistJS Demo - v1.0.0
=========================================================

* Github:  https://github.com/Mmasoud1
* Description:  A user interface for whole slide image channel design and analysis. 
*               It is based on DSA as backbone server.
* 
*
* @author Mohamed Masoud <mmasoud2@outlook.com>

=========================================================



=========================================================
                      Main Parameters
=========================================================*/

//-- (function(){
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
                  this.changesConfirmed = false;
                  this.changesCanceled = false;        
                  this.lastCommand = null;  
                 }
    }

    var curChColorContrastStates = [];

    //-- Host/Collection selection states --//
    //-- var currentHostCollectSelectionStates = [];
    var currentHostCollectSelectionStates = ({hostObject: null, collectionList: null, foldersList: null, item: null, hostIndex: 0, collectionIndex: null, isHostLogin: false})


    var lastHostCollectSelectionStates = ({hostIndex: null, hostChanged: 0, collectionIndex: null, itemId: null}); //-- --//

    var channelStates = ({currentIndex: null, lastIndex: null, channelChanged: 0}); //-- --//
 
    var tempSceneSelections = [];
    var tempGrpRemoved = [];
    var tempServerRemoved = [];

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


    var lastItemSelectionStates = ({grpIndex: null, zoomValue:0, storyIndex: null, DAPIChannelIndex: null});

    const Opts = {
            // General Interface Options
            maxGrpLabelLen:                       28,
            maxhostListWithSettings:              4,  // must be <= 4 
            creatItemTreeByBranch:                true, // if false, item tree will be created at all and loaded at once 
            selectedElemBgColor:                  "rgba(255,255,255,0.5)",
            selectedElemFontColor:                "black",
            selectedElemFontWeight:               "bold",
            defaultElemBgColor:                   "",  
            defaultElemFontColor:                 "white", 
            defaultElemFontWeight:                "normal",
            defaultCompositeOperation:            "lighter",

            // Design Mode 
            designModeAutoUpload:                 true, // if false upload by clicking upload button   

            // Analysis Mode 
            analysisModeAutoUpload:               true, // if false upload by clicking upload button                      

            //Tigger Hint Options
            defaultOpeningTime:                   10000,                
            isFirstClickEventAfterTrigger:        true,
            isHintAutoClosable:                   true, // false means hint does not close with timer 
            isHintCloseOnMouseEvent:              false, // false means hint close with timer, true means close when click on any element             
            numOfMouseEventToCloseHint:           1, // (Future use) minimum number of mouse event to close hint 
            curMouseEventCount:                   0, // (Future use) counter to count the number of mouse event    

            //Progress bar settigns
            numOfPrgBarJumps:                     5, // Make progress bar update only 5 times e.g. when loading the boundaries     

            // General OSD settings 
            defaultOsdMouseTracking:              true, 

            //OSD Scale bar plugin settigns
            tissuePhysicalWidthPerMeter:          0.02, // Tissue section width on the glass slide estimated as 2 cm or 0.02 meter, used for scale bar pixelPerMeter. 


            // General Analysis Options  
            /// Grid
            defaultGridSize:                      128,               
            maxGridSizeRange:                     512,
            minGridSizeRange:                     64,
            gridSizeStep:                         64,
            /// Boundary 
            defaultSpxBoundaryShapes:             {polygon: true}, // False means create bbox
            defaultBoundaryFillColor:             "#bd5656", //"#ff0",
            defaultBoundaryFillOpacity:           0.25,
            /// Strock
            defaultStrokeColor:                   "white", //"#000", 
            defaultStrokeOpacity:                 0.5, 
            defaultStrokeWidth:                   3, 
            maxStrokeWidth:                       5,
            /// Tile Selection
            selectedTileStrokeWidth:              10, 
            selectedTileFillColor:                "white",
            selectedTileFillOpacity:              1, 

            // Similar Regions Button Options
            originalTileStrokeWidth:              10, 
            originalTileStrokeColor:              'yellow',             
            originalTileStrokeOpacity:            1,  
            similarTileStrokeWidth:               10, 
            similarTileStrokeColor:               'yellow',             
            similarTileFillColor:                 "orange",
            similarTileStrokeOpacity:             1,   
            isHeatmapColorManual:                 true, // if true then HeatmapRange array below is used, else then heatmapColor = d3.scaleLinear() is used          

            // During Create Features
            defaultScanningFillColor:             "white", //"#000", 
            defaultScanningFillOpacity:           0.8,   
           
            StrokeWidthOnHover:                   5,
            StrokeColorOnHover:                   "blue",
            StrokeOpacityOnHover:                 1,  

            resetSwitchTimeOut:                   2000, // seconds

            // RestApi(flask) default Settings 
            maskContourApproximation:             true, // For extracting boundaries from cell mask, this option can reduce JSON file by 60%            
            searchEntirHostForResource:           false, // e.g. search entire host to finde cellMask.tiff, to use with getRemoteFileId() 
            createTilesFeature:                   {allTilesAtOnce: true}, // "false" : means create features by scanning tile by tile, very slow option
            cellFeatureToNormalize:         /*R*/ "_nonzero_mean", // select from [ _mean, _max, _std, _nonzero_mean], preceded by underscore "_"            
            isChannelNormalizeRequired:           true, // "true": to normalize each ome channel before extract features.
            // // RestApi - cell classify
            cellUndefinedThresholdValue:          "mean", // select from [ mean, min,  max, "25%", "50%", "75%"], used for "Others" type with Tumor-Immune-Stromal operation,  where those valued are cal with Restapi cell classify fun                       
            exclude_Others_TypeInAnalysis:        true, // if true Tumor-Immune-Stromal basic analysis part will exclude "Others" type with Histogram, correlation, etc methods

            // // RestApi - boxplot stats            
            boxplotForAboveZeroPixels:            true, // "true": neglect zero pixels when calculating a channel or marker boxplot
            isBoxplotChNormalizeRequired:         true, // "true": normalize channels before find boxplot data of each
            isBoxplotChannelBased:          /*R*/ true, // If "false": Boxplot calculation is cell based, takes the mean of each cell and find the boxplot of all cell means            
            boxplotForAboveZeroCells:             false, // "true": neglect zero cells when calculating a  marker boxplot, e.g. neglict any cell with CD45_mean = 0
            isMarkerFeatureNormalizeRequired:     true, // "true": normalize marker cells before find boxplot data of each


            // Cell Boundary Api(flask) default Settings 
            nuclContourApproximation:             true, // For extracting boundaries from Dapi nucleus this option can reduce JSON file by 60%                     
            nuclContourApproxFactor:              0.01, //  Default value, can range from 1% to 9%
            nuclContourApproxFactorMin:           0.01, // The less, the more point to reprsent the contour 
            nuclContourApproxFactorStepSize:      0.01, // Increase by 0.01            
            nuclContourApproxFactorMax:           0.09, // The more, the less point 
            contourScaleFactor:                   1, // To enlarge set this value >1, e.g 1.1, or 1.2, more than 1.2 can result overlaps between neighor cells
            contourScaleFactorMin:                0.8, // shrink each contour to 80%
            contourScaleFactorStepSize:           0.1, // increase by 0.1          
            contourScaleFactorMax:                1.3, // enlarge each contour to 130%          
            isBoundaryExtractionContoursBased:    true, // If contour approach is False then regionprops will be used 
            isRemoveOutliersRequired:             true, // If remove outliers is need
            allFeaturesOutliersConsidered:        0, // [0, 1], set to 1 IF removing all outliers of all morphologies  are needed 
            resetBoundaryLabelAfterOutlierFilter: true,// Reset boundaries label or ids after removing outliers boundaries
            use95_05Percentile:                   true,// If 95-05 percentile method is false then the approach of IQR will be used to remove the outliers
            percentileLower:                      0.1, // If use95_05Percentile is true, set the lower quantile(0.1)
            percentileLowerMin:                   0.1,
            percentileLowerStepSize:              0.1,             
            percentileLowerMax:                   0.5,                                    
            percentileUpper:                      0.999, // If use95_05Percentile is true, set the upper quantile(0.999)  
            percentileUpperMin:                   0.959,
            percentileUpperStepSize:              0.01,            
            percentileUpperMax:                   0.999,   
            invalidNuclAreaThreshold:             1, //(int) Threshold value to exclude any contour or region area below it, must be int                     

            // For cell filtering and phenotyping
            cellIntensityFeature:                 "norm", // can be [mean, max, nonzero_mean, norm] for each cell, norm is based on cellFeatureToNormalize above. This used to filter with it during phenotypes and cell Filtering
            markerPositiveThreshold:        /*R*/ "mean",  // can be [q1, median, mean, q3, max], q1 for 25 percentile
            markerNegativeThreshold:        /*R*/ "q1",   // can be [0, min, q1, median, mean, q3] and less than markerPositiveThreshold
            dapiDefaultNegativeThreshold:         "min",   // can be [0, min, q1, median, mean, q3] and less than markerPositiveThreshold
            isDapiBinaryStrNeedRemove:            true,  // if true then  a binaryString has only  Dapi channel e.g. 10000  will be removed

            // Neighbor Analysis 
            minNumOfCellNeighbors:                0, // 0 neighbor of certain type is useful to know which source cell that has not such neighbor
            maxNumOfCellNeighbors:                10, // For finding a neighbor of certain type and within certain distance   
            // Neighbor Filtering  
            applyCellFilterToNeighborsOnly:       true, // If true than only source cell with valid neighbors will be  all drawn regardless of source cell validation, if false then only valid neighbor or valid source will be drawn.
            isNeighborFilterHintFirstAppear:      true,  // Flag for make Neighbor filtering hint appear once with any sup operations


            //Phenotype Naming/Abbrev
            phenotypeNamingMaxLen:                 10, // Max Length of input text tag when assign a name (e.g. TCell) to phenotype(e.g. 10101)   
            //-- phenotypeAbbrevMaxLen:             5, // Max Length of input text tag when assign an abbrev (e.g. TC) to phenotype(e.g. 10101)              
          

            //Dim Reduction Analysis
            numSamplePerType:                     1000, //  number of samples per CellType to scatter, this num multiply by the num of types e.g Tumor, Immune etc selected from marker/cell-Type form
            maxNumOfAllSamples:                   4000, // Total samples size e.g. 4000 cells represent all samples
            excludeDapiChForPhenotypes:           true, // Exclude dapi from group channels that need to be plot with 2D reducers e.g. t-SNE

            // General Environment Settings 
            multiPlexFileExtension:               ".ome.tif",


            defaultRestApiPort:                   5000,
            defaultCellBoundaryApiPort:           5500,            
            defaultFeaturesDir:                   "features",  // Local directory  within the widget root level to save features.         
            defaultBoundariesDir:                 "boundaries",  // Local directory  within the widget root level to save boundaries info. 
            defaultRegistrationDir:               "registration", // Local directory  within the widget root level to save registration info. 
            dockerMountingDir:                    "",             // for  RestApi decker
            maxFileSize:                          500000  // Max file size send to flask to avoid javascript syntaxerror "the url is malformed "

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




    const compositeOperations = [
                                {id: "1", type: "source-in",  description: "The output shows only the region of the upper channel that overlaps with all lower channels."},
                                //-- {id: "2", operation: "source-out", discription: "The output has only the non-overlap regions of the upper channel. Don't use it for more than 2 channels"},
                                //-- {id: "2", operation: "source-atop", discription: "The output has the bottom channel in addition to the overlap regions of the upper channels."},                            
                                {id: "2", type: "lighter",  description: "The output color is determined by adding color values of overlap regions."},
                                {id: "3", type: "xor",  description: "The output has only the non-overlap regions of the all channels, given that there is no two channels have exactly the same cells, or the resulted output will be inaccurate"},
                                {id: "4", type: "multiply", description: "The pixels are of the top channel are multiplied with the corresponding pixel of the bottom channel. A darker regions are the overlap regions."},
                                {id: "5", type: "screen", description: "The pixels are of the top channel are inverted, multiplied, and inverted again with the corresponding pixel of the bottom channel. A lighter regions are the overlap regions. "},
                                {id: "6", type: "difference", description: " Subtracts the bottom channel from the top channel or the other way round to always get a positive value. "}
                              ];

   //--  var lastGrpFeaturesSelectionStates = currentGrpFeaturesSelectionStates = ({boundaryOn: null, boundaryType: null /* SPX */, displayOption: null, compositeOperation: null})


   var  currentGrpFeaturesSelectionStates = ({boundaryOn: false, boundaryType: "spx" /* spx */, displayOption: "composite", 
                                              compositeOperation: "lighter",  tile: null, rightClickedTile: null
                                            });
   var lastGrpFeaturesSelectionStates = ({boundaryOn: false, boundaryType: "spx" /* spx */, displayOption: "composite", 
                                          compositeOperation: "lighter", tileId: null
                                        });
   

   var cellFiltersAndPhenotypesStates = ({ originalStates: { boundariesOpacity: null, boundariesColor: null, strockOpacity: null, strockColor: null, 
                                  strockWidth: null}, navigatorPointer: 0 ,  phenotypesLastSettings : null
                            });

   const cellPositiveThresholdOptions = ["max", "q3", "mean", "median", "q1"];   //Can try also puting '<i class="fa fa-chevron-right" aria-hidden="true"></i>'

   const cellNegativeThresholdOptions = ["q3", "mean", "median", "q1", "min", "0"];

   const featureKeys = ["mean", "max", "std"]; // <-----To create features checkboxes dynamically, change here. Also change in "chart"  below
   var checkboxSelectedFeatures = [...featureKeys]; // when checkboxes selected, by default all features selected


   // Analysis CHNL Options Cell Morphological Filters
   const cellMorphFeatureList = [
                                {id: "1", morphFeature: "area",  description: "Filter cells with areas above or equal threshold."},
                                {id: "2", morphFeature: "eccentricity",  description: "If the eccentricity value is 1, cell is a line and if it is zero, cell is a perfect circle "},
                                {id: "3", morphFeature: "extent",  description: "Filter cells with thresholed extent.  Extent is the ratio of cell contour area to bounding rectangle area"},
                                {id: "4", morphFeature: "orientation",  description: "Angle between the x-axis and the major axis of the ellipse that has the same second-moments as the region"},                            
                                {id: "5", morphFeature: "solidity",  description: "Solidity is the ratio of contour area to its convex hull area"},
                                {id: "6", morphFeature: "major_axis_length",  description: "Length (in pixels) of the major axis of the cell ellipse"},
                                {id: "7", morphFeature: "minor_axis_length",  description: "Length (in pixels) of the minor axis of the cell ellipse"}                                                        
                             ];   

   // Analysis CHNL PLOTS chart, hasSpecialBar: mean need display special bar icons for extra options such as edit or advanced
   const chartOperationsList = [
                                {id: "1", type: "Histogram",  description: "The output shows the current cell histogram of markers.", isCellColorChanger: false, hasSpecialBar: false},
                                {id: "2", type: "Histogram-log1p(y)",  description: "The output shows the current tile histogram of markers with YAxis in log.", isCellColorChanger: false, hasSpecialBar: false},
                                {id: "3", type: "Boxplot",  description: "The output shows the boxplot of each marker channel.", isCellColorChanger: false, hasSpecialBar: false},
                                {id: "4", type: "Phenotypes",  description: "Shows the phenotypes, e.g. 101 means the top marker in CHNL OPTIONS list is (+), the middle maker is (-) and the bottom one is (+)", isCellColorChanger: true, hasSpecialBar: true}, 
                                {id: "5", type: "Tumor-Immune-Stromal",  description: "Classify/Cluster cells as Tumor, Immune, Stromal or others. Others are cells with low levels of Keratin, CD45 and A-SMA markers  ", isCellColorChanger: true, hasSpecialBar: true},                           
                                {id: "6", type: "Proteomic-Analysis",  description: "Classify cells of certain types or multiple markers", isCellColorChanger: true, hasSpecialBar: true},                                                           
                                {id: "7", type: "Cluster",  description: "Clustering cell expression data into sub-groups", isCellColorChanger: true, hasSpecialBar: true}
                             ]; 

    // initiation of  isOperationActiveOnScreen obj such that { Phenotypes: false, "Tumor-Immune-Stromal": false, Cluster: false }
    var isOperationActiveOnScreen = {}; 

   // Analysis CHNL PLOTS chart subOperation list, parent is the parent operation
   const subOperationsList = [
                                {id: "1", type: "phenotypeNeighbors", parent: "Phenotypes",  description: "The output shows the neighbors of phenotype cells.", isCellColorChanger: true},
                                {id: "2", type: "basicCellTypeNeighbors", parent: "Tumor-Immune-Stromal",  description: "The output shows the neighbors of cell-Type.", isCellColorChanger: true}
                             ];     

    // initiation of  isSubOperationActiveOnScreen obj such that { phenotypeNeighbors: false, "basicCellTypeNeighbors": false }
    var isSubOperationActiveOnScreen = {}; 

   // Analysis CHNL PLOTS chart. (https://www.w3schools.com/colors/colors_hexadecimal.asp)
   const mainCellTypesList =  [
                                {id: "1", cellType: "Tumor", cellTypeColor: "#ff4846" /*Red*/, description: "Cells type have high level of Keratin marker."},
                                {id: "2", cellType: "Immune", cellTypeColor: "#61c346" /*Green*/, description: "Cells type have high level of CD45 marker"},
                                {id: "3", cellType: "Stromal", cellTypeColor: "#5dd1ff" /*#61b2fc"*/ /*Blue*/,  description: "Cells type have high level of A-SMA marker"},
                                {id: "4", cellType: "Others", cellTypeColor: "#6244d9" /*"#6557ae"*/ /*Purple*/, description: "Cells type have low level of Keratin, CD45 and A-SMA markers "}
                            ]; 

   // Analysis CHNL PLOTS chart. (https://www.w3schools.com/colors/colors_hexadecimal.asp)
   const mainClusterMethods =  [
                                {id: "1", method: "Threshold",  description: "Threshold-based is fast method to classify/cluster cells based on thier intensity value, e.g. Cells with high CD45 are immune cells"},
                                {id: "2", method: "K-Means", description: "K-means based method clusters cells into k cluster and use the mode of a coupled threshold method to assign Tumor/Immune/Stromal/Others labels "}
                                // {id: "3", method: "GMM",  description: "Gaussian Mixture Models (GMM) method is used to cluster cells coupled with threshold method to assign labels"}
                              ]; 

   // Basically used with Tumor-Immune-Stromal operation
   const analysisMethods =  [
                                {id: "1", method: "Histogram",  description: "Find features histogram with cellTypes."},
                                {id: "2", method: "Correlation",  description: "Find correlation of features and cellTypes"}
                                //{id: "3", method: "Heatmap",  description: "Heatmap of features"}
                                // {id: "4", method: "t-SNE",   description: "Visualize CellType data in 2D"},
                                // {id: "5", method: "t-SNE-3D",   description: "Visualize CellType data in 3D"}
                            ];  


   const dimReductionMethods = [
                                {id: "1", method: "t-SNE",   description: "t-Distributed Stochastic Neighbor Embedding (t-SNE) is slow non-linear dimensionality reduction method   to visualize CellType data in low dimensions e.g. 2D and 3D"},
                                {id: "2", method: "PCA",     description: "Principal Component Analysis (PCA) is a fast linear  reduction method  to visualize CellType data in low dimensions e.g. 2D and 3D"},
                                {id: "3", method: "LDA",     description: "Latent Dirichlet Allocation (LDA) is a fast linear reduction method  to visualize CellType data in low dimensions e.g. 2D and 3D"},
                                {id: "4", method: "UMAP",    description: "Uniform Manifold Approximation and Projection (UMAP) reduction method  to visualize CellType data in low dimensions e.g. 2D and 3D"}
                            ];  


   var chartOptions = ({ 
                canvas: null,
                container: null,
                //-- operationsList: ["tileFeatures", "boxPlot", "cluster"],
                
                defaultOperation : "Histogram",
                currentOperation : "Histogram",
                lastOperation : "Histogram",
                lastContainerContent: null,
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

   //-- var featuresSelection = [];

   var allTilesFeatures = [];  // need correction to allTilesFeature
   var grpChannelsStatisticalData = []; // has each channel mean, max, min, std, median, q1, q3 
   var dapiMorphStatisticalData = {}; // for each morphological features e.g. area, find mean, max, min, std, median, q1, q3 
   var allValidTiles = [];
   var allValidPhenotypes = [];
   var filteredValidPhenotypes = [];
   var cellBasicClassification = []; // has each cell classification as Tumor, Immune, Stromal or others
   var allTilesFeaturesAndClassification = [];
   var filteredNeighbors = {};         // e.g filteredNeighbors= { cellType: "Tumor", neighborsType: "Immune", validNeighbors: [{ id: "spx-11581", neighbors: (2) [14327, 14395] }, { id: "spx-5492", neighbors: (1) [4875] }, ...] }
   //-- var txt_allTilesFeatures_backup = [];
   var Boundary_box = []; 
   //-- var currentTileId = null;
   //-- var currentTileObj = null;
   //-- var prevGridSelection = null;
   var SPXTilesLabel = [];
   //-- var GridTilesLabel = [];

   //-- var allFeaturesDistance = [];  
  
   const HeatmapRange = [
                       "#330000", "#FF0000", "#FF3333", "#FF6666", 
                       "#FF9999", "#FFB266", "#FFE5CC", "#FFFF66",
                       "#FFFFCC", "#FFFFFF", "#CCE5FF", "#99CCFF", 
                       "#66B2FF", "#3399FF", "#0080FF", "#0066CC", "#004C99"
                      ]  

   var animateTile = null; 

    // for futur use ..
    const inlineHelp = [
                       {id: "cellFilterSlider.CD45",  description: "The output shows ..."},
                       {id: "cellFilterSlider.ASMA",  description: "The output shows ..."}                           
                     ];

   //-- var currentStroke={color:'',width:'',opacity:''};

 

// Expose to global
//--    window['DSA_SERVER_LIST'] = DSA_SERVER_LIST;
//--    window['colorContrastMap'] = colorContrastMap;
//--    window['curChColorContrastStates'] = curChColorContrastStates;
//--    window['currentHostCollectSelectionStates'] = currentHostCollectSelectionStates;
//--    window['lastHostCollectSelectionStates'] = lastHostCollectSelectionStates;
//--    window['channelStates'] = channelStates;
//--    window['tempSceneSelections'] = tempSceneSelections;
//--    window['tempGrpRemoved'] = tempGrpRemoved;
//--    window['tempServerRemoved'] = tempServerRemoved;
//--    window['currentItemInfo'] = currentItemInfo;
//--    window['lastItemSelectionStates'] = lastItemSelectionStates;
//--    window['Opts'] = Opts;
//--    window['screenStatus'] = screenStatus;
//--    window['featureKeys'] = featureKeys;
//--    window['featuresSelection'] = featuresSelection;
//--    window['compositeOperations'] = compositeOperations;
//--    window['currentGrpFeaturesSelectionStates'] = currentGrpFeaturesSelectionStates;   
//--    window['lastGrpFeaturesSelectionStates'] = lastGrpFeaturesSelectionStates;  

//-- })();  