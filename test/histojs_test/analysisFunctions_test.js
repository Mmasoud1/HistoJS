/*
=========================================================
* HistoJS - v1.0.0 - ((------Testing-------))
=========================================================
* Description:  A user interface for whole slide image channel design and analysis. 
*               It is based on DSA as backbone server 
*                                                
*
* Authors:  Mohamed Masoud - 2023
=========================================================
=========================================================
         Main Analysis Phase Functions Unit Test (Mocha)
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

  

});  