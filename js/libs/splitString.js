/**
 *  Split string into chunks of the given size
 * @see {@link  https://gist.github.com/hendriklammers/5231994}
 * @author Hendrik Lammers 
 * @function
 * @param {String} string is the String to split
 * @param {Number} size is the size you of the cuts     
 * @returns {Array} an Array with the strings
 * @example
 * splitString("zzz",1)
 * => Array(3) [ "z", "z", "z" ]
 */ 

splitString = (string, size) => {     
        let re = new RegExp('.{1,' + size + '}', 'g');
        return string.match(re);
}  