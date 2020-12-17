# OpenSeadragonThreejsOverlay

An [OpenSeadragon](http://openseadragon.github.io) plugin that adds [Three.js](https://threejs.org) overlay capability.

Compatible with OpenSeadragon 2.0.0 or greater.

License: The BSD 3-Clause License. The software was forked from [OpenseadragonPaperjsOverlay](https://github.com/eriksjolund/OpenSeadragonPaperjsOverlay), that also is licensed under the BSD 3-Clause License.

## Demo web page

See the [online demo](https://fervent-snyder-c66537.netlify.com/)
where some Three.js lines are shown on top of an OpenSeadragon window. More lines can be drawn by left clicking anywhere in the Image.

## Introduction

To use, include the `oopenseadragon-threejs-overlay.js` file after `openseadragon.js` on your web page.
   
To add Three.js overlay capability to your OpenSeadragon Viewer, call `threejsOverlay()` on it. 

`````javascript
     var viewer = new OpenSeadragon.Viewer(...);
     var overlay = viewer.threejsOverlay();
     
     // Initialize Threejs variables
     var renderer = overlay.renderer();
     var camera = overlay.camera();
     var scene = overlay.scene();
     
     // Performance Monitor
     var stats = overlay.stats();
     
     // openseadragon Imaging helper
     var imagingHelper = overlay.imagingHelper(); // onImageViewChanged already attached
`````

This will initalize and return a threejs environment complete with a WebGLRenderer, scene, and camera.

_Only PerspectiveCamera is supported for now. Will be adding support for the OrthographicCamera shortly._

The new object is returned return with the following methods:

* `renderer()`: Returns a Threejs [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
* `camera()`: Returns a Threejs [PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera)
* `scene()`: Returns a Threejs [Scene](https://threejs.org/docs/#api/en/scenes/Scene)
* `stats()`: Returns a Javascript Performance monitor [stats.js](https://github.com/mrdoob/stats.js/)
* `imagingHelper()`: Returns the [openseadragonImagingHelper](https://github.com/msalsbery/OpenSeadragonImagingHelper). onImageViewChanged event is already attached and is used to sync the osd viewport to threejs camera system.
