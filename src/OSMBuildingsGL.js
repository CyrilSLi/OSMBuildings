
var GLVIEW;

var OSMBuildingsGL = function(containerId, options) {
  options = options || {};

  var container = document.getElementById(containerId);

  GLVIEW = new GL.View(container);

  this.renderer = new Renderer({
    backgroundColor: options.backgroundColor
  }).start();

  Map.init(options);
  Events.init(container);

  this.setDisabled(options.disabled);
  if (options.style) {
    this.setStyle(options.style);
  }

  TileGrid.setSource(options.tileSource);
  DataGrid.setSource(options.dataSource, options.dataKey || DATA_KEY);

  if (options.attribution !== null && options.attribution !== false && options.attribution !== '') {
    var attribution = document.createElement('DIV');
    attribution.setAttribute('style', 'position:absolute;right:0;bottom:0;padding:1px 3px;background:rgba(255,255,255,0.5);font:11px sans-serif');
    attribution.innerHTML = options.attribution || OSMBuildingsGL.ATTRIBUTION;
    container.appendChild(attribution);
  }
};

OSMBuildingsGL.VERSION = '0.1.8';
OSMBuildingsGL.ATTRIBUTION = '© OSM Buildings (http://osmbuildings.org)</a>';
OSMBuildingsGL.ATTRIBUTION_HTML = '&copy; <a href="http://osmbuildings.org">OSM Buildings</a>';

OSMBuildingsGL.prototype = {

  setStyle: function(style) {
    var color = style.color || style.wallColor;
    if (color) {
      // TODO: move this to Renderer
      DEFAULT_COLOR = Color.parse(color).toRGBA();
    }
    return this;
  },

  addModifier: function(fn) {
    Data.addModifier(fn);
    return this;
  },

  removeModifier: function(fn) {
    Data.removeModifier(fn);
    return this;
  },

  // DEPRECATED
  addMesh: function(url, options) {
    console.warn('Method addMesh() is deprecated and will be removed soon. Use addGeoJSON() or addOBJ() instead.');
  },

  addOBJ: function(url, options) {
    return new OBJMesh(url, options);
  },

  addGeoJSON: function(url, options) {
    return new GeoJSONMesh(url, options);
  },

  on: function(type, fn) {
    Events.on(type, fn);
    return this;
  },

  off: function(type, fn) {
    Events.off(type, fn);
    return this;
  },

  setDisabled: function(flag) {
    Events.setDisabled(flag);
    return this;
  },

  isDisabled: function() {
    return Events.isDisabled();
  },

  setZoom: function(zoom) {
    Map.setZoom(zoom);
    return this;
  },

  getZoom: function() {
    return Map.zoom;
  },

  setPosition: function(position) {
    Map.setPosition(position);
    return this;
  },

  getPosition: function() {
    return Map.getPosition();
  },

  getBounds: function() {
    var mapBounds = Map.bounds;
    var worldSize = TILE_SIZE*Math.pow(2, Map.zoom);
    var nw = unproject(mapBounds.minX, mapBounds.maxY, worldSize);
    var se = unproject(mapBounds.maxX, mapBounds.minY, worldSize);
    return {
      n: nw.latitude,
      w: nw.longitude,
      s: se.latitude,
      e: se.longitude
    };
  },

  setSize: function(size) {
    GLVIEW.setSize(size.width, size.height);
    return this;
  },

  getSize: function() {
    return { width:WIDTH, height:HEIGHT };
  },

  setRotation: function(rotation) {
    Map.setRotation(rotation);
    return this;
  },

  getRotation: function() {
    return Map.rotation;
  },

  setTilt: function(tilt) {
    Map.setTilt(tilt);
    return this;
  },

  getTilt: function() {
    return Map.tilt;
  },

  destroy: function() {
    this.renderer.destroy();
    TileGrid.destroy();
    DataGrid.destroy();
  }
};

//*****************************************************************************

if (typeof define === 'function') {
  define([], OSMBuildingsGL);
} else if (typeof exports === 'object') {
  module.exports = OSMBuildingsGL;
} else {
  global.OSMBuildingsGL = OSMBuildingsGL;
}