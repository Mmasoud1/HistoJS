// This file has its origin from:
// https://github.com/paperjs/paper.js/blob/develop/src/paper.js
// but it was modified to handle threejs instead of paperjs.

// OpenSeadragon canvas Overlay plugin 0.0.1 based on svg overlay plugin

(function () {

    if (!window.OpenSeadragon) {
        console.error('[openseadragon-canvas-overlay] requires OpenSeadragon');
        return;
    }


    // ----------
    OpenSeadragon.Viewer.prototype.threejsOverlay = function () {
        if (this._threejsOverlayInfo) {
            return this._threejsOverlayInfo;
        }

        this._threejsOverlayInfo = new Overlay(this);
        return this._threejsOverlayInfo;
    };

    // ----------
    class Overlay {

        constructor(viewer) {
            var self = this;
            this._viewer = viewer;
            this._vec = new THREE.Vector3(); // create once and reuse
            this._pos = new THREE.Vector3(); // create once and reuse
            this._containerWidth = 0;
            this._containerHeight = 0;
            this.width = 13306;
            this.height = 10245;
            this._canvasdiv = document.createElement('div');
            this._canvasdiv.setAttribute('id', 'osd-overlaycontainer');
            this._canvasdiv.style.position = 'absolute';
            this._canvasdiv.style.left = 0;
            this._canvasdiv.style.top = 0;
            this._canvasdiv.style.width = '100%';
            this._canvasdiv.style.height = '100%';
            this._viewer.canvas.appendChild(this._canvasdiv);
            this._canvas = document.createElement('canvas');
            this._canvas.setAttribute('id', 'osd-overlaycanvas');
            this._canvasdiv.appendChild(this._canvas);
            this._renderer = this.renderer();
            this._camera = undefined;
            this._scene = undefined;
            this._stats = undefined;
            this._imagingHelper = undefined;
            this.resize();
            // paper.setup(this._canvas);
            this._viewer.addHandler('update-viewport', function () {
                self.resize();
                self.resizecanvas();
            });
            this._viewer.addHandler('open', function () {
                self.resize();
                self.resizecanvas();
            });
            this.resize();
        }

        canvas() {
            return this._canvas;
        }

        context3d() {
            return this._canvas.getContext('webgl');
        }

        renderer() {
            if (this._renderer) return this._renderer;
            this._renderer = new THREE.WebGLRenderer(this.context3d());
            this._renderer.setSize(this._viewer.container.clientWidth, this._viewer.container.clientHeight);
            return this._renderer;
        }

        camera() {
            if (this._camera) return this._camera;
            this._camera = new THREE.PerspectiveCamera(45, this._viewer.viewport.getAspectRatio(), 1, 30000);
            this._camera.position.x = 0;
            this._camera.position.y = 0;
            this._camera.position.z = 1000;
            this._camera.updateProjectionMatrix();
            return this._camera;
        }

        scene() {
            return this._scene ? this._scene : new THREE.Scene();
        }

        sceneToWorld(x, y) {
            x = Math.round(x);
            y = Math.round(y);
            this._vec.set(
                (x / window.innerWidth) * 2 - 1,
                - (y / window.innerHeight) * 2 + 1,
                0.5);

            this._vec.unproject(this._camera);

            this._vec.sub(this._camera.position).normalize();

            var distance = - this._camera.position.z / this._vec.z;
            this._pos.copy(this._camera.position).add(this._vec.multiplyScalar(distance));
            return this._pos;
        }

        stats() {
            if (this._stats) return this._stats;
            this._stats = new Stats();
            this._stats.dom.style.left = 'unset';
            this._stats.dom.style.right = '0px';
            document.body.appendChild(this._stats.dom);
            return this._stats;
        }

        imagingHelper() {
            this._imagingHelper = this._viewer.activateImagingHelper({
                onImageViewChanged: event => {
                    // console.log(event); // Debugging
                    
                    const rot = this._viewer.viewport.getRotation();
                    
                    if (rot == 0) {
                        this._camera.position.x = event.eventSource.imgWidth * (event.viewportCenter.x - 0.5);
                        this._camera.position.y = event.eventSource.imgHeight * (0.5 - event.viewportCenter.y);
                        this._camera.position.z = 
                        (event.viewportHeight / 2) / Math.tan((this._camera.fov * Math.PI / 180) / 2) * event.eventSource.imgHeight;
                    } else if(rot == 180) {
                        this._camera.position.x = event.eventSource.imgWidth * (0.5 - event.viewportCenter.x);
                        this._camera.position.y = event.eventSource.imgHeight * (event.viewportCenter.y - 0.5);
                        this._camera.position.z = 
                        (event.viewportHeight / 2) / Math.tan((this._camera.fov * Math.PI / 180) / 2) * event.eventSource.imgHeight;
                    } else if (rot == 90) {
                        this._camera.position.x = event.eventSource.imgHeight * (0.5 - event.viewportCenter.y);
                        this._camera.position.y = event.eventSource.imgWidth * (0.5 - event.viewportCenter.x);
                        this._camera.position.z = 
                        (event.viewportWidth / 2) / Math.tan((this._camera.fov * Math.PI / 180) / 2) * event.eventSource.imgWidth;
                    } else if(rot == 270) {
                        this._camera.position.x = event.eventSource.imgHeight * (event.viewportCenter.y - 0.5);
                        this._camera.position.y = event.eventSource.imgWidth * (event.viewportCenter.x - 0.5);
                        this._camera.position.z =
                            (event.viewportWidth / 2) / Math.tan((this._camera.fov * Math.PI / 180) / 2) * event.eventSource.imgWidth;
                    }
                    
                    this._camera.updateProjectionMatrix();
                    // console.log(this._camera.position); // Debugging
                }
            });
        }

        clear() {
            // TODO: check what needs to be added here
        }
        // ----------
        resize() { // TODO
            if (this._containerWidth !== this._viewer.container.clientWidth) {
                this._containerWidth = this._viewer.container.clientWidth;
                this._canvasdiv.setAttribute('width', this._containerWidth);
                this._canvas.setAttribute('width', this._containerWidth);
                this._renderer.setSize(this._viewer.container.clientWidth, this._viewer.container.clientHeight);
            }
            if (this._containerHeight !== this._viewer.container.clientHeight) {
                this._containerHeight = this._viewer.container.clientHeight;
                this._canvasdiv.setAttribute('height', this._containerHeight);
                this._canvas.setAttribute('height', this._containerHeight);
                this._renderer.setSize(this._viewer.container.clientWidth, this._viewer.container.clientHeight);
            }
        }

        resizecanvas() {// TODO
            this._canvasdiv.setAttribute('width', this._containerWidth);
            this._canvas.setAttribute('width', this._containerWidth);
            this._canvasdiv.setAttribute('height', this._containerHeight);
            this._canvas.setAttribute('height', this._containerHeight);
            // this._renderer.setSize(this._viewer.container.clientWidth, this._viewer.container.clientHeight);
            // paper.view.viewSize = new paper.Size(this._containerWidth, this._containerHeight);
            var viewportZoom = this._viewer.viewport.getZoom(true);
            var image1 = this._viewer.world.getItemAt(0);
            // paper.view.zoom = image1.viewportToImageZoom(viewportZoom);
            var center = this._viewer.viewport.viewportToImageCoordinates(this._viewer.viewport.getCenter(true));
            // paper.view.center = new paper.Point(center.x, center.y);
            
            // Update camera aspect ratio on resize
            this._camera.aspect = this._containerWidth / this._containerHeight;
            this._camera.updateProjectionMatrix();

            this._renderer.setSize(this._containerWidth, this._containerHeight);
        }

    }
})();
