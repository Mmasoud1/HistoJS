/*
=========================================================
* HistoJS - v1.0.0 - ((------Testing-------))
=========================================================
* Description:  A user interface for whole slide image channel design and analysis. 
*               It is based on DSA as backbone server 
*                                                
*
* @author Mohamed Masoud <mmasoud2@outlook.com>
=========================================================
=========================================================
         Main Design Phase Functions Unit Test (Mocha)
=========================================================*/ 


describe("Main Design Phase Functions", function () {
  describe('#findObjectByKeyValue()', function () {
    it('return  index or array element', function () {
       expect(findObjectByKeyValue( [{id: "1", value: "val1"}, {id: "2", value: "val2"}]  , 'id', "2", 'INDEX')).to.equal(1);
    });
  });

  describe('#removeArrayElem()', function () {
    it('return array after remove element', function () {
       let arr2Test = ['a', 'b', 'c', 'd'];
       removeArrayElem(arr2Test, 'c');
       expect(arr2Test).to.eql(['a', 'b', 'd']);
    });
  });

  describe('#insertArrayElem()', function () {
    it('return array after insert an element', function () {
       let arr2Test = ['b', 'c', 'd'];
       insertArrayElem(arr2Test, 'a', 0);      
       expect(arr2Test).to.eql(['a', 'b', 'c', 'd']);
    });
  });

  describe('#setObjectValues()', function () {
    it('return all object values initialized to the value to set ', function () {
       let obj2Test = { id: '1', value: 'val1' };
       setObjectValues(obj2Test, null);
       expect(obj2Test).to.eql({ id: null, value: null });
    });
  });

  describe('#mergeArrayOfObjByKey()', function () {
    it('return merged two arrays of objects by common key ', function () {
       expect( mergeArrayOfObjByKey( "id", [ {id:"spx-1", Type:"Tumor"}, 
                                             {id:"spx-7", Type:"Immune"} ], 
                                                         [{id : "spx-1", area: 250,  solidity: 0.95}, 
                                                          {id : "spx-3", area: 150,  solidity: 0.85}, 
                                                          {id : "spx-7", area: 100,  solidity: 0.80} ])

             ).to.be.an('array');
    });
  });

  describe('#array2ObjWithHashKey()', function () {
    it('return a conversion of array of objects to object with hashing key', function () {
       expect(array2ObjWithHashKey( "id", [ {id:"spx-1", Type:"Tumor"}, 
                                            {id:"spx-7", Type:"Immune"} ])
             ).to.eql({ "spx-1": {id: "spx-1", Type: "Tumor"}, "spx-7": {id: "spx-7", Type: "Immune"} });
    });
  });

  describe('#arrayUniqueValues()', function () {
    it('return unique values of array ', function () {
       expect( arrayUniqueValues( [1, 1, 2, 3, 2, 5]) ).to.eql([1, 2, 3, 5]);
    });
  });

  describe('#fastArraysConcat()', function () {
    it('return  fast arrays concatenation ', function () {
       expect( fastArraysConcat( [1, 1, 2, 3], [5, 2, 5]) ).to.eql([1, 1, 2, 3, 5, 2, 5]);
    });
  });  

  describe('#areArraysEquals()', function () {
    it('return if two arrays are identical ', function () {
       expect( areArraysEquals( [1, 1, 2, 3], [1, 1, 2, 5]) ).to.be.false
    });
  });

  describe('#chunkArray()', function () {
    it('return array into number of  chunks ', function () {
       expect(chunkArray( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 3 )

             ).to.eql( [ [ 1, 2, 3, 4, 5, 6 ], [ 7, 8, 9, 10, 11, 12 ], [ 13, 14, 15, 16, 17 ] ] ) ;
    });
  });


  describe('#isLetter()', function () {
    it('return true or false  ', function () {
       expect( isLetter("A") ).to.be.true;
    });
  });

  describe('#refineGrpChName()', function () {
    it('return refined group channel name ', function () {
       expect(refineGrpChName("A488 background")).to.eql("A488.ba");
    });
  });  

  describe('#suggestNewGrplabel()', function () {
    it('return suggested group of channels name ', function () {
       expect(suggestNewGrplabel([{ channel_name: "DNA 1", channel_number: 0},
                                  {channel_name: "A488 background", channel_number: 0}])
             ).to.be.a("string");
    });
  }); 


  describe('#getArrayKeyValues()', function () {
    it('return array of objects key values ', function () {
       expect(getArrayKeyValues([{ color: "FFFFFF", contrast_Max: 35000},
                                 { color: "FF0000", contrast_Max: 25000}], "color")
             ).to.eql(["FFFFFF","FF0000"]);
    });
  });    


 describe('#getNewGrpPath()', function () {
    it('return new group of channels path', function () {
       expect(getNewGrpPath([{ channel_name: "DNA 1", channel_number: 0},
                                  {channel_name: "A488 background", channel_number: 0}])
             ).to.be.a("string");
    });
  }); 


});
