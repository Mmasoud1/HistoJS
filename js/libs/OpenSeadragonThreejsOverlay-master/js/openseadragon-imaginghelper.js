//! OpenSeadragonImagingHelper 1.2.0
//! Build date: 2017-11-29
//! Git commit: v1.2.0-13-g98ee9c3-dirty
//! https://github.com/msalsbery/OpenSeadragonImagingHelper
/*
 * Copyright (c) 2013-2014 Mark Salsbery
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


/**
 * @file
 * @version  OpenSeadragonImagingHelper 1.2.0
 * @author Mark Salsbery <msalsbery@hotmail.com>
 *
 */

/**
 * @module openseadragon-imaginghelper
 * @version  OpenSeadragonImagingHelper 1.2.0
 *
 */


(function (OSD, $, undefined) {

    //if (!OSD.version || OSD.version.major < 1) {
    //    throw new Error('OpenSeadragonImagingHelper requires OpenSeadragon version 0.9.131+');
    //}

    /**
     * Creates a new ImagingHelper attached to the viewer.
     *
     * @method activateImagingHelper
     * @memberof external:"OpenSeadragon.Viewer"#
     * @param {Object} options
     * @param {OpenSeadragon.EventHandler} [options.onImageViewChanged] - {@link OpenSeadragonImaging.ImagingHelper.event:image-view-changed} handler method.
     * @param {Integer} [options.worldIndex] - The index of the image for world.getItemAt
     * @returns {OpenSeadragonImaging.ImagingHelper}
     *
     **/
    OSD.Viewer.prototype.activateImagingHelper = function (options) {
        if (!this.imagingHelper) {
            options = options || {};
            options.viewer = this;
            this.imagingHelper = new $.ImagingHelper(options);
        }
        return this.imagingHelper;
    };

    /**
     * Creates a new ImagingHelper attached to the viewer instance passed in the options parameter.
     *
     * @class ImagingHelper
     * @classdesc Provides imaging helper methods and properties for the OpenSeadragon viewer.
     * @memberof OpenSeadragonImaging
     * @extends external:"OpenSeadragon.EventSource"
     * @param {Object} options
     * @param {external:"OpenSeadragon.Viewer"} options.viewer - Required! Reference to OpenSeadragon viewer to attach to.
     * @param {external:"OpenSeadragon.EventHandler"} [options.onImageViewChanged] - {@link OpenSeadragonImaging.ImagingHelper.event:image-view-changed} handler method.
     * @param {Integer} [options.worldIndex] - The index of the image for world.getItemAt
     *
     **/
    $.ImagingHelper = function (options) {
        options = options || {};

        if (!options.viewer) {
            throw new Error('A viewer must be specified.');
        }
        if (options.viewer.imagingHelper) {
            throw new Error('Viewer already has an ImagingHelper.');
        }

        this._viewer = options.viewer;

        // Call base class constructor
        OSD.EventSource.call(this);

        // Add this object to the Viewer
        this._viewer.imagingHelper = this;

        /**
         * A reference to the options passed at creation.
         * @member {object} options
         * @memberof OpenSeadragonImaging.ImagingHelper#
         * @property {external:"OpenSeadragon.Viewer"} viewer - Reference to OpenSeadragon viewer this ImagingHelper is attached to.
         * @property {OpenSeadragon.EventHandler} [onImageViewChanged] - {@link OpenSeadragonImaging.ImagingHelper.event:image-view-changed} handler method.
         */
        this.options = options;
        /**
         * The image's native width in pixels.
         * @member {number} imgWidth
         * @memberof OpenSeadragonImaging.ImagingHelper#
         */
        this.imgWidth = 0.0;
        /**
         * The image's native height in pixels.
         * @member {number} imgHeight
         * @memberof OpenSeadragonImaging.ImagingHelper#
         */
        this.imgHeight = 0.0;
        /**
         * The image's aspect ratio (width / height).
         * @member {number} imgAspectRatio
         * @memberof OpenSeadragonImaging.ImagingHelper#
         */
        this.imgAspectRatio = 0.0;

        // Private
        this._zoomFactor = 1.0;
        this._minZoom = 0.001;
        this._maxZoom = 10;
        this._zoomStepPercent = 30;
        this._haveImage = false;
        this._viewerSize = null;
        // Unadjusted viewport settings (aspect ratio not applied)
        // All coordinates are logical (0 to 1) relative to the image
        this._viewportWidth = 0.0;
        this._viewportHeight = 0.0;
        this._viewportOrigin = new OpenSeadragon.Point(0, 0);
        this._viewportCenter = new OpenSeadragon.Point(0, 0);

        // Wire up event handlers
        if (options.onImageViewChanged) {
            this.addHandler('image-view-changed', options.onImageViewChanged);
        }
        this._viewer.addHandler('open', OSD.delegate(this, onOpen));
        this._viewer.addHandler('close', OSD.delegate(this, onClose));
        this._viewer.addHandler('animation', OSD.delegate(this, onAnimation));
        this._viewer.addHandler('animation-finish', OSD.delegate(this, onAnimationFinish));
        this._viewer.addHandler('resize', OSD.delegate(this, onResize));
        this._viewer.addHandler('full-page', OSD.delegate(this, onFullPage));
        this._viewer.addHandler('full-screen', OSD.delegate(this, onFullScreen));
    };

    /**
     * ImagingHelper version.
     * @member {Object} OpenSeadragonImaging.ImagingHelper.version
     * @property {String} versionStr - The version number as a string ('major.minor.revision').
     * @property {Number} major - The major version number.
     * @property {Number} minor - The minor version number.
     * @property {Number} revision - The revision number.
     */
    /* jshint ignore:start */
    $.ImagingHelper.version = {
        versionStr: '1.2.0',
        major: 1,
        minor: 2,
        revision: 0
    };
    /* jshint ignore:end */


    // Inherit OpenSeadragon.EventSource
    // TODO Drop IE<9 support and use these. For now we'll use the OpenSeadragon.extend() call below...
    //$.ImagingHelper.prototype = Object.create(OSD.EventSource.prototype);
    //Object.defineProperty($.ImagingHelper.prototype, 'constructor', {enumerable: false, value: $.ImagingHelper});


    // TODO Drop IE<9 support and use Object.create()/Object.defineProperty(). For now we'll inherit OpenSeadragon.EventSource this way...
    OSD.extend($.ImagingHelper.prototype, OSD.EventSource.prototype,
        /** @lends OpenSeadragonImaging.ImagingHelper.prototype */
        {
            /*
             *
             * Raises the {@link OpenSeadragonImaging.ImagingHelper.image-view-changed} event
             *
             * @private
             * @method
             *
             **/
            _raiseImageViewChanged: function () {
                /**
                 * Raised whenever the viewer's zoom or pan changes and the ImagingHelper's properties have been updated.
                 * @event image-view-changed
                 * @memberof OpenSeadragonImaging.ImagingHelper
                 * @type {Object}
                 * @property {OpenSeadragonImaging.ImagingHelper} eventSource - A reference to the ImagingHelper which raised the event.
                 * @property {number} viewportWidth - Width of viewport in logical coordinates.
                 * @property {number} viewportHeight - Height of viewport in logical coordinates.
                 * @property {external:"OpenSeadragon.Point"} viewportOrigin - Center of viewport in logical coordinates.
                 * @property {external:"OpenSeadragon.Point"} viewportCenter - Center of viewport in logical coordinates.
                 * @property {number} zoomFactor - Zoom factor.
                 * @property {Object} [userData=null] - Arbitrary subscriber-defined object.
                 */
                this.raiseEvent('image-view-changed', {
                    viewportWidth: this._viewportWidth,
                    viewportHeight: this._viewportHeight,
                    viewportOrigin: this._viewportOrigin,
                    viewportCenter: this._viewportCenter,
                    zoomFactor: this._zoomFactor
                });
            },

            /*
             *
             * Called whenever the OpenSeadragon viewer zoom/pan changes
             *
             * @private
             * @method
             * @fires OpenSeadragonImaging.ImagingHelper.image-view-changed
             *
             **/
            _trackZoomPan: function () {
                var boundsRect = this._viewer.viewport.getBounds(true);
                this._viewportOrigin.x = boundsRect.x;
                this._viewportOrigin.y = boundsRect.y * this.imgAspectRatio;
                this._viewportWidth = boundsRect.width;
                this._viewportHeight = boundsRect.height * this.imgAspectRatio;
                this._viewportCenter.x = this._viewportOrigin.x + (this._viewportWidth / 2.0);
                this._viewportCenter.y = this._viewportOrigin.y + (this._viewportHeight / 2.0);
                this._zoomFactor = this.getViewerContainerSize().x / (this._viewportWidth * this.imgWidth);

                this._raiseImageViewChanged();
            },

            /**
             * Gets the size of the viewer's container element.
             *
             * @method
             * @returns {external:"OpenSeadragon.Point"}
             *
             **/
            getViewerContainerSize: function () {
                //return this._viewer.viewport.getContainerSize();
                var element = this._viewer.container;
                //return new OSD.Point(
                //    (element.clientWidth === 0 ? 1 : element.clientWidth),
                //    (element.clientHeight === 0 ? 1 : element.clientHeight)
                //);
                return new OSD.Point(element.clientWidth, element.clientHeight);
            },

            /**
             * Helper method for users of the OpenSeadragon.Viewer's autoResize = false option.
             * Call this whenever the viewer is resized, and the image will stay displayed at the same scale
             * and same center point.
             *
             * @method
             * @fires OpenSeadragonImaging.ImagingHelper.image-view-changed
             *
             **/
            notifyResize: function () {
                var newViewerSize,
                    center,
                    zoom;
                if (this._haveImage) {
                    newViewerSize = this.getViewerContainerSize();
                    if (!newViewerSize.equals(this._viewerSize)) {
                        this._viewerSize = newViewerSize;
                        center = new OpenSeadragon.Point(this._viewportCenter.x, this._viewportCenter.y / this.imgAspectRatio);
                        zoom = this._zoomFactor;
                        this._viewer.viewport.resize(newViewerSize, false);
                        this._viewer.viewport.zoomTo((zoom * this.imgWidth) / newViewerSize.x, null, true);
                        this._viewer.viewport.panTo(center, true);
                        this._raiseImageViewChanged();
                    }
                }
            },

            /**
             * Gets the minimum zoom factor allowed.
             *
             * @method
             * @returns {number}
             *
             **/
            getMinZoom: function () {
                return this._minZoom;
            },

            /**
             * Sets the minimum zoom factor allowed.
             *
             * @method
             * @param {number} value - The desired minimum zoom factor.
             *
             **/
            setMinZoom: function (value) {
                this._minZoom = value;
                this._viewer.minZoomLevel = (value * this.imgWidth) / this.getViewerContainerSize().x;
            },

            /**
             * Gets the maximum zoom factor allowed.
             *
             * @method
             * @returns {number}
             *
             **/
            getMaxZoom: function () {
                return this._maxZoom;
            },

            /**
             * Sets the maximum zoom factor allowed.
             *
             * @method
             * @param {number} value - The desired maximum zoom factor.
             *
             **/
            setMaxZoom: function (value) {
                this._maxZoom = value;
                this._viewer.maxZoomLevel = (value * this.imgWidth) / this.getViewerContainerSize().x;
            },

            /**
             * Gets the percentage of the current zoom factor to increase/decrease when using the zoomIn/zoomOut methods.
             *
             * @method
             * @returns {number}
             *
             **/
            getZoomStepPercent: function () {
                return this._zoomStepPercent;
            },

            /**
             * Sets the percentage of the current zoom factor to increase/decrease when using the zoomIn/zoomOut methods.
             *
             * @method
             * @param {number} value - The desired percentage.
             *
             **/
            setZoomStepPercent: function (value) {
                this._zoomStepPercent = value;
            },

            /**
             * Zooms and/or pans the viewport based on a viewport width and center point.
             *
             * @method
             * @param {number} width - The desired viewport width in logical units.
             * @param {number} height - The desired viewport width in logical units (currently not used, native image aspect ratio is preserved).
             * @param {external:"OpenSeadragon.Point"} centerpoint - The desired viewport center point in logical units.
             * @param {boolean} [immediately] - If true, the view is set immediately with no spring animation.
             *
             **/
            setView: function (width, height, centerpoint, immediately) {
                if (this._haveImage) {
                    if (this._viewportWidth != width || this._viewportHeight != height) {
                        this._viewer.viewport.zoomTo(1.0 / width, null, immediately);
                    }
                    if (this._viewportCenter.x != centerpoint.x || this._viewportCenter.y != centerpoint.y) {
                        this._viewer.viewport.panTo(new OpenSeadragon.Point(centerpoint.x, centerpoint.y / this.imgAspectRatio), immediately);
                    }
                }
            },

            /**
             * Gets the current zoom factor, the ratio of the displayed size to the image's native size.
             *
             * @method
             * @returns {number}
             *
             **/
            getZoomFactor: function () {
                return this._zoomFactor;
            },

            /**
             * Sets the zoom factor, the ratio of the displayed size to the image's native size.
             *
             * @method
             * @param {number} value - The desired zoom factor.
             * @param {boolean} [immediately] - If true, the view is set immediately with no spring animation.
             *
             **/
            setZoomFactor: function (value, immediately) {
                if (this._haveImage && value != this._zoomFactor && value > 0.0) {
                    this._viewer.viewport.zoomTo((value * this.imgWidth) / this.getViewerContainerSize().x,
                        new OpenSeadragon.Point(this._viewportCenter.x, this._viewportCenter.y / this.imgAspectRatio), immediately);
                }
            },

            /**
             * Zooms in by a factor of getZoomStepPercent().
             *
             * @method
             * @param {boolean} [immediately] - If true, the view is set immediately with no spring animation.
             *
             **/
            zoomIn: function (immediately) {
                var newzoom = this._zoomFactor;
                newzoom *= (1.0 + this._zoomStepPercent / 100.0);
                if (newzoom > this._maxZoom) {
                    newzoom = this._maxZoom;
                }
                this.setZoomFactor(newzoom, immediately);
            },

            /**
             * Zooms out by a factor of getZoomStepPercent().
             *
             * @method
             * @param {boolean} [immediately] - If true, the view is set immediately with no spring animation.
             *
             **/
            zoomOut: function (immediately) {
                var newzoom = this._zoomFactor;
                newzoom /= (1.0 + this._zoomStepPercent / 100.0);
                if (newzoom < this._minZoom) {
                    newzoom = this._minZoom;
                }
                this.setZoomFactor(newzoom, immediately);
            },

            /**
             * Sets the zoom factor, the ratio of the displayed size to the image's native size, leaving the logical point in the same viewer position.
             *
             * @method
             * @param {number} newzoomfactor - The desired zoom factor.
             * @param {external:"OpenSeadragon.Point"} logpoint - The logical point to remain in current displayed position.
             * @param {boolean} [immediately] - If true, the view is set immediately with no spring animation.
             *
             **/
            zoomAboutLogicalPoint: function (newzoomfactor, logpoint, immediately) {
                if (this._haveImage && newzoomfactor != this._zoomFactor && newzoomfactor > 0.0) {
                    this._viewer.viewport.zoomTo((newzoomfactor * this.imgWidth) / this.getViewerContainerSize().x,
                        new OpenSeadragon.Point(logpoint.x, logpoint.y / this.imgAspectRatio), immediately);
                }
            },

            /**
             * Zooms in by a factor of getZoomStepPercent(), leaving the logical point in the same viewer position.
             *
             * @method
             * @param {external:"OpenSeadragon.Point"} logpoint - The logical point to remain in current displayed position.
             * @param {boolean} [immediately] - If true, the view is set immediately with no spring animation.
             *
             **/
            zoomInAboutLogicalPoint: function (logpoint, immediately) {
                var newzoom = this._zoomFactor;
                newzoom *= (1.0 + this._zoomStepPercent / 100.0);
                if (newzoom > this._maxZoom) {
                    newzoom = this._maxZoom;
                }
                this.zoomAboutLogicalPoint(newzoom, logpoint, immediately);
            },

            /**
             * Zooms out by a factor of getZoomStepPercent(), leaving the logical point in the same viewer position.
             *
             * @method
             * @param {external:"OpenSeadragon.Point"} logpoint - The logical point to remain in current displayed position.
             * @param {boolean} [immediately] - If true, the view is set immediately with no spring animation.
             *
             **/
            zoomOutAboutLogicalPoint: function (logpoint, immediately) {
                var newzoom = this._zoomFactor;
                newzoom /= (1.0 + this._zoomStepPercent / 100.0);
                if (newzoom < this._minZoom) {
                    newzoom = this._minZoom;
                }
                this.zoomAboutLogicalPoint(newzoom, logpoint, immediately);
            },

            /**
             * Pans the view so the logical point is centered in the viewport.
             *
             * @method
             * @param {external:"OpenSeadragon.Point"} logpoint - The desired center point.
             * @param {boolean} [immediately] - If true, the view is set immediately with no spring animation.
             *
             **/
            centerAboutLogicalPoint: function (logpoint, immediately) {
                if (this._haveImage && this._viewportCenter.x != logpoint.x || this._viewportCenter.y != logpoint.y) {
                    this._viewer.viewport.panTo(new OpenSeadragon.Point(logpoint.x, logpoint.y / this.imgAspectRatio), immediately);
                }
            },

            /**
             *
             *
             * @method
             *
             **/
            physicalToLogicalPoint: function (point) {
                return new OpenSeadragon.Point(this.physicalToLogicalX(point.x), this.physicalToLogicalY(point.y));
            },

            /**
             *
             *
             * @method
             *
             **/
            logicalToPhysicalPoint: function (point) {
                return new OpenSeadragon.Point(this.logicalToPhysicalX(point.x), this.logicalToPhysicalY(point.y));
            },

            /**
             *
             *
             * @method
             *
             **/
            physicalToLogicalX: function (x) {
                return this._haveImage ? (this._viewportOrigin.x + ((x / this.getViewerContainerSize().x) * this._viewportWidth)) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            physicalToLogicalY: function (y) {
                return this._haveImage ? (this._viewportOrigin.y + ((y / this.getViewerContainerSize().y) * this._viewportHeight)) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            logicalToPhysicalX: function (x) {
                return this._haveImage ? (((x - this._viewportOrigin.x) / this._viewportWidth) * this.getViewerContainerSize().x) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            logicalToPhysicalY: function (y) {
                return this._haveImage ? (((y - this._viewportOrigin.y) / this._viewportHeight) * this.getViewerContainerSize().y) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            physicalToLogicalDistance: function (distance) {
                return this._haveImage ? ((distance / this.getViewerContainerSize().x) * this._viewportWidth) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            logicalToPhysicalDistance: function (distance) {
                return this._haveImage ? ((distance / this._viewportWidth) * this.getViewerContainerSize().x) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            logicalToDataPoint: function (point) {
                return new OpenSeadragon.Point(this.logicalToDataX(point.x), this.logicalToDataY(point.y));
            },

            /**
             *
             *
             * @method
             *
             **/
            dataToLogicalPoint: function (point) {
                return new OpenSeadragon.Point(this.dataToLogicalX(point.x), this.dataToLogicalY(point.y));
            },

            /**
             *
             *
             * @method
             *
             **/
            physicalToDataPoint: function (point) {
                return new OpenSeadragon.Point(this.physicalToDataX(point.x), this.physicalToDataY(point.y));
            },

            /**
             *
             *
             * @method
             *
             **/
            dataToPhysicalPoint: function (point) {
                return new OpenSeadragon.Point(this.dataToPhysicalX(point.x), this.dataToPhysicalY(point.y));
            },

            /**
             *
             *
             * @method
             *
             **/
            logicalToDataX: function (x) {
                return this._haveImage ? (x * this.imgWidth) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            logicalToDataY: function (y) {
                return this._haveImage ? (y * this.imgHeight) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            dataToLogicalX: function (x) {
                return (this._haveImage && this.imgWidth > 0) ? (x / this.imgWidth) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            dataToLogicalY: function (y) {
                return (this._haveImage && this.imgHeight > 0) ? (y / this.imgHeight) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            physicalToDataX: function (x) {
                return (this._haveImage && this.getViewerContainerSize().x > 0) ? ((this._viewportOrigin.x + ((x / this.getViewerContainerSize().x) * this._viewportWidth)) * this.imgWidth) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            physicalToDataY: function (y) {
                return (this._haveImage && this.getViewerContainerSize().y > 0) ? ((this._viewportOrigin.y + ((y / this.getViewerContainerSize().y) * this._viewportHeight)) * this.imgHeight) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            dataToPhysicalX: function (x) {
                return (this._haveImage && this.imgWidth > 0) ? ((((x / this.imgWidth) - this._viewportOrigin.x) / this._viewportWidth) * this.getViewerContainerSize().x) : 0;
            },

            /**
             *
             *
             * @method
             *
             **/
            dataToPhysicalY: function (y) {
                return (this._haveImage && this.imgHeight > 0) ? ((((y / this.imgHeight) - this._viewportOrigin.y) / this._viewportHeight) * this.getViewerContainerSize().y) : 0;
            }

        });


    /*
     * @private
     * @method
     *
     **/
    function onOpen() {
        this._haveImage = true;
        var contentSizeViewport = {},
            contentSize;
        // use world if we can't use contentSize
        if (!this._viewer.viewport.contentSize) {
            var homeBounds = this._viewer.world.getHomeBounds();
            contentSizeViewport.x = homeBounds.width - homeBounds.x;
            contentSizeViewport.y = homeBounds.height - homeBounds.y;
            // options could have an index for world
            var worldIndex = parseInt(this.options.worldIndex) || 0;
            contentSize = this._viewer.world.getItemAt(worldIndex).viewportToImageCoordinates(contentSizeViewport.x, contentSizeViewport.y);
        }
        else {
            contentSize = this._viewer.viewport.contentSize;
        }
        this.imgWidth = contentSize.x;
        this.imgHeight = contentSize.y;
        this.imgAspectRatio = this.imgWidth / this.imgHeight;
        this._trackZoomPan();
    }

    /*
     * @private
     * @method
     *
     **/
    function onClose() {
        this._haveImage = false;
        this.imgWidth = 0.0;
        this.imgHeight = 0.0;
        this.imgAspectRatio = 0.0;
    }

    /*
     * @private
     * @method
     *
     **/
    function onAnimation() {
        this._trackZoomPan();
    }

    /*
     * @private
     * @method
     *
     **/
    function onAnimationFinish() {
        this._trackZoomPan();
    }

    /*
     * @private
     * @method
     *
     **/
    function onResize() {
        if (this._viewer && this._viewer.autoResize) {
            this._trackZoomPan();
        }
    }

    /*
     * @private
     * @method
     *
     **/
    function onFullPage() {
        this._trackZoomPan();
    }

    /*
     * @private
     * @method
     *
     **/
    function onFullScreen() {
        this._trackZoomPan();
    }


}(OpenSeadragon, window.OpenSeadragonImaging = window.OpenSeadragonImaging || {}));
