import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as Cesium from 'cesium';
import JSZip from 'jszip';

import readZipFile from '../utils/readZipFile';
import satellite from '../assets/satellite.zip';

const Container = styled.div`
  height: 100%;
`;

const Examples = () => {
  const [viewer, setViewer] = useState(null);

  const loadZipFile = async (viewer) => {
    // 读取zip文件
    const zip = await readZipFile(satellite);
    // 需要读取的所有文件
    const pendings = [];
    // 文件Map，文件名对应url
    const fileMap = {};
    // zip文件中的gltf文件的entry（JSZip中读取文件的方法）
    let gltfEntry = null;
    // zip文件中gltf文件名
    let gltfFileName = '';
    // 遍历zip中的所有文件，生成fileMap
    for (let file in zip.files) {
      const entry = zip.file(file);
      if (entry === null) continue;
      if (file.includes('.gltf')) {
        gltfEntry = entry;
        gltfFileName = file;
      }
      // push需要加载的文件
      pendings.push(
        entry.async('blob').then((blob) => {
          // 生成url并放进fileMap
          fileMap[file] = URL.createObjectURL(blob);
        }),
      );
    }
    // 使用JSZip封装好的Promise
    const promise = JSZip.external.Promise;
    // 等待加载文件
    await promise.all(pendings);
    // 加载gltf文件为string类型
    const res = await gltfEntry.async('string');
    // 转化为json
    const gltfJson = JSON.parse(res);
    // 修改buffers和纹理的uri
    gltfJson.buffers.forEach((item) => {
      item.uri = fileMap[item.uri];
    });
    gltfJson.images.forEach((item) => {
      item.uri = fileMap[item.uri];
    });
    // 更新fileMap中gltf文件url
    fileMap[gltfFileName] = URL.createObjectURL(
      new Blob([JSON.stringify(gltfJson)]),
    );

    // 加载模型
    viewer.entities.removeAll();

    const position = Cesium.Cartesian3.fromDegrees(
      -123.0744619,
      44.0503706,
      5000,
    );
    const heading = Cesium.Math.toRadians(135);
    const pitch = 0;
    const roll = 0;
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr,
    );
    const entity = viewer.entities.add({
      name: fileMap[gltfFileName],
      position: position,
      orientation: orientation,
      model: {
        uri: fileMap[gltfFileName],
        minimumPixelSize: 128,
        maximumScale: 20000,
      },
    });
    viewer.trackedEntity = entity;
  };

  const initCesium = () => {
    // 初始化地图
    const viewer = new Cesium.Viewer('cesiumContainer', {
      // 是否显示全屏控件
      fullscreenButton: false,
      // 是否显示图层选择控件
      baseLayerPicker: false,
      // 是否显示选择指示器（选择实体，模型等时的绿色小框）
      selectionIndicator: false,
      // 是否显示信息框
      infoBox: false,
      // 是否显示动画控件
      animation: false,
      // 是否显示Home控件
      homeButton: false,
      // 是否显示搜索地名控件
      geocoder: false,
      // 是否显示时间线控件
      timeline: false,
      // 是否显示场景模式转换控件
      sceneModePicker: false,
      // 是否显示导航控件
      navigationHelpButton: false,
      // 加载ArcGisMap
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url:
          '//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
      }),
    });
    const cesiumViewerToolbar = document.getElementsByClassName(
      'cesium-viewer-toolbar',
    );

    for (let i = 0; i < cesiumViewerToolbar.length; i++) {
      const element = cesiumViewerToolbar[i];

      element.style.display = 'none';
    }
    // 隐藏版权信息
    viewer._cesiumWidget._creditContainer.style.display = 'none';

    setViewer(viewer);

    return viewer;
  };
  useEffect(() => {
    if (!viewer) {
      const viewer = initCesium();
      loadZipFile(viewer);
    }
  });

  return (
    <>
      <Container id='cesiumContainer'></Container>
    </>
  );
};

export default Examples;
