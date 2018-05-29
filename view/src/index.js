let ws;
let viewer;

contnectWS().then((ws) => {
  return ws;
}, err => {
  console.log('websocket 链接出错');
}).then(res => {
  return getViewer();
}).then(viewer => {
  return AddModal(viewer);
});

/**
 * 连接Websocket
 */
function contnectWS() {
  return new Promise((resolve, reject) => {
    if ('WebSocket' in window) {
      ws = new WebSocket('ws://localhost:8181');
      ws.onopen = function (e) {
        console.log('websocket has connected');
      };
      ws.onmessage = function (res) {
        console.log(JSON.parse(res.data));
      };
      ws.onclose = function (e) {
        console.log('websocket has disconnected');
      };
      resolve(ws);
    } else {
      alert('你的浏览器不支持WebSocket, 请更新浏览器。');
      reject(new Errow('un supported browser....'));
    }
  });
}
/**
 * 创建三维视图
 */
function getViewer() {
  return new Promise((resolve, reject) => {
    viewer = new Cesium.Viewer('cesiumContainer', {
      animation: false,
      baseLayerPicker: false, //地图切换控件(底图以及地形图)是否显示,默认显示true
      fullscreenButton: true, //全屏按钮,默认显示true
      geocoder: false, //地名查找,默认true
      timeline: false, //时间线,默认true
      vrButton: false, //双屏模式,默认不显示false
      homeButton: false, //主页按钮，默认true
      infoBox: false, //点击要素之后显示的信息,默认true
      selectionIndicator: true, //选中元素显示,默认true
      sceneModePicker: false, //是否显示投影方式控件
      navigationHelpButton: false, //是否显示帮助信息控件
      terrainProvider: Cesium.createWorldTerrain({
        requestVertexNormals: true,
        requestWaterMask: true
      }),
      baseLayerPicker: false
    });

    viewer.scene.globe.enableLighting = false;
    viewer._cesiumWidget._creditContainer.style.display = 'none';
    resolve(viewer);
  });
}

/**
 * 添加模型
 * @param {Cesium.Ｖiewer} viewer 三维球视图
 */
function AddModal(viewer) {
  // modal 位置
  var position = new Cesium.Cartesian3(-1371108.6511167218, -5508684.080096612,
    2901825.449865087
  );
  var heading = Cesium.Math.toRadians(180);
  var pitch = Cesium.Math.toRadians(2);
  var roll = Cesium.Math.toRadians(-6);
  var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

  var entity = viewer.entities.add({
    name: 'truck',
    position: position,
    orientation: orientation,
    model: {
      uri: '../lib/Cesium-1.45/Apps/SampleData/models/CesiumGround/Cesium_Ground.gltf',
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      minimumPixelSize: 128,
      maximumScale: 20,
      scale: 8.0
    }
  });
  viewer.trackedEntity = entity;
}
