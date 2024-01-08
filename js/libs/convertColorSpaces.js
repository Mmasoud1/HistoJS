    /**
    * Convert rgb(rValue,gValue,bValue) to "hsl(hue, saturation, lightness)" string
    * @see  https://css-tricks.com/converting-color-spaces-in-javascript/
    *
    * @param {r} rgb- r value
    * @param {g} rgb- g value
    * @param {b} rgb- b value        
    * @returns {string} Returns hsl as string
    * @example
    * 
    * RgbToHsl( 255, 0, 0 )
    * =>  "hsl(0,100%,50%)"
    *
    */ 

    RgbToHsl = (r, g, b) => {  // 
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


    /**
    * Convert hsl(hue, saturation, lightness) to "rgb(rValue,gValue,bValue)" string.  
    * @see  https://css-tricks.com/converting-color-spaces-in-javascript/
    *
    * @param {h} hsl- h value
    * @param {s} hsl- s value
    * @param {l} hsl- l value 
    * @returns {string} Returns RGB as string
    * @example
    * 
    * HSLToRGB( 180, 100, 50 )
    * => "rgb(0,255,255)"
    *
    */ 

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


    hexToRgb = (hex) => {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }


    /**
    * Convert rgb object to hex string.  
    * @see  https://stackoverflow.com/questions/5623838/
    *
    * @param {object} rgbOb 
    * @returns {string} Returns hex as string
    * @example
    * 
    * rgbToHex( { r: 255, g: 0, b: 0 } )
    * => "#"
    *
    */ 
    RGBtoHEX = (rgb) => { //rgb(255,0,0)
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }