/*
=========================================================
*             ((------Testing-------))
=========================================================
* HistoJS  
=========================================================
* @see {@link  https://github.com/Mmasoud1/HistoJS}
* @description   A user interface for multiplexed image channels design and analysis.
*                It is based on DSA as backbone server.
*
* @version 1.0.0
* @license MIT  
*
* @author Mohamed Masoud <mmasoud2@outlook.com>
=========================================================
=========================================================
* @file Main Analysis Phase Functions Unit Test (Mocha)
=========================================================*/ 


describe("Main Analysis Functions", function () {

  describe('#getCellTypeColorObj()', function () {
    it('return cell type colors', function () {
       expect(getCellTypeColorObj(  [{"channel_name": "CD45", "channel_type" : "Immune"}, 
                                     {"channel_name": "KERATIN", "channel_type" : "Tumor"},
                                     {"channel_name": "ASMA", "channel_type" : "Stromal"}] 
                                 ) 
             ).to.eql( { Immune: "#61c346", Tumor: "#ff4846", Stromal: "#5dd1ff", Others: "#6244d9" } );
    });
  });  

  describe('#getBinaryStringsOfNbits()', function () {
    it('return all binary strings of n bits', function () {
       expect( getBinaryStringsOfNbits(3) ).to.eql([ "000", "001", "010", "011", "100", "101", "110", "111" ]);
    });
  });

  describe('#getPhenoBinaryDescription()', function () {
    it('return phenotype binary description', function () {
       expect( getPhenoBinaryDescription("10101", [ "DAPI", "KERATIN", "ASMA", "CD45", "IBA1" ]) 

        ).to.eql("DAPI+ KERATIN- ASMA+ CD45- IBA1+ ");
    });
  });  

  describe('#createCellPhenotypesColorsArray()', function () {
    it('return phenotype colors array', function () {
       expect( createCellPhenotypesColorsArray(2) ).to.eql([ "#ff0000", "#00ffff" ]);
    });
  });  

  describe('#getTileBboxFormat()', function () {
    it('return tile BBox', function () {
       let spxBoundaries= "3073,3829 3077,3833 3077,3839 3075,3841 3075,3843 3070,3847 3068,3846" +
                          " 3065,3848 3062,3848 3060,3842 3062,3838 3062,3836 3064,3834 3065,3831 3070,3829" 
       expect( getTileBboxFormat(spxBoundaries) ).to.eql("3060,3829 3060,3848 3077,3848 3077,3829");
    });
  }); 

  describe('#convertCsv2Json()', function () {
    it('return JSON object from CSV content', function () {
       let csvContent    =   `channel_number,channel_name
                                0,DAPI
                                1,CD45`
       expect( convertCsv2Json(csvContent) ).to.eql([{"channel_number": 0, "channel_name": "DAPI"},{"channel_number": 1, "channel_name": "CD45"}]);
    });
  });   

  describe('#fetchRemoteJson()', function () {
    it('return JSON contents from JSON file', function () {
       expect( fetchRemoteJson("./util/jsonData.json") ).to.eql([{"channel_number": 0, "channel_name": "DAPI"},{"channel_number": 1, "channel_name": "CD45"}]);
    });
  });       

  describe('#fetchRemoteCsv()', function () {
    it('return CSV contents from CSV file', function () {
       let expectResult = 
`channel_number,channel_name
0,DAPI
1,CD45
`       
       expect( fetchRemoteCsv("./util/csvData.csv") ).to.eql(expectResult);
    });
  }); 


  describe('#isLocalFileExistByAjax()', function () {
    it('check if file exists', function () {
       expect( isLocalFileExistByAjax("./util/jsonData.json") ).to.be.true;
    });
  });  

  describe('#getBoundariesHomeDir()', function () {
    it('return boundaries home dir', function () {
       expect( getBoundariesHomeDir() ).to.eql("boundaries/");
    });
  });   

  describe('#isFilteredCellFound()', function () {
    it('return if there is filtered cell', function () {
       expect( isFilteredCellFound() ).to.be.false;
    });
  });  

  describe('#isFilteredCellFound()', function () {
    it('return if there is filtered cell', function () {
       expect( isFilteredCellFound() ).to.be.false;
    });
  });   

  describe('#isCellPhenotypeActive()', function () {
    it('return if cell phenotype active', function () {
       expect( isCellPhenotypeActive() ).to.be.false;
    });
  });  

  describe('#compare()', function () {
    it('return 1 or -1 depend on comparsion', function () {
       let dist1 = [], dist2 = [];
       dist1.Distance = 3;
       dist2.Distance = 4;
       expect( compare(dist1, dist2) ).to.eql(1);
    });
  }); 

  describe('#find_bbox()', function () {
    it('return bounding box around cell boundary', function () {
       let spxBoundaries= "3073,3829 3077,3833 3077,3839 3075,3841 3075,3843 3070,3847 3068,3846" +
                          " 3065,3848 3062,3848 3060,3842 3062,3838 3062,3836 3064,3834 3065,3831 3070,3829"
       expect( find_bbox(spxBoundaries, "boundaryString").left ).to.eql(3060);
    });
  });   

  describe('#validateActiveOperationOnScreen()', function () {
    it('return active operation', function () {
       expect( validateActiveOperationOnScreen("Phenotypes") ).to.eql(null);
    });
  }); 

  describe('#computeCellsDistance()', function () {
    it('return cells distance in pixels ', function () {
       expect( computeCellsDistance({x_cent: 2126, y_cent:313},{x_cent: 2175, y_cent: 310}).toFixed(3) ).to.eql('49.092');
    });
  });        

});  