import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import styled from 'styled-components';
import { Spin } from 'antd';

import floorBackground from '../assets/images/textures/cloud.jpg';
import skyBoxPX from '../assets/images/skybox/px.jpg';
import skyBoxNX from '../assets/images/skybox/nx.jpg';
import skyBoxPY from '../assets/images/skybox/py.jpg';
import skyBoxNY from '../assets/images/skybox/ny.jpg';
import skyBoxPZ from '../assets/images/skybox/pz.jpg';
import skyBoxNZ from '../assets/images/skybox/nz.jpg';
import buildingsPath from '../assets/models/buildings.FBX';
import carPath01 from '../assets/models/cars/car01.FBX';
import carPath02 from '../assets/models/cars/car02.FBX';
import carPath03 from '../assets/models/cars/car03.FBX';
import SoldierPath from '../assets/models/Soldier.glb';
import manPath from '../assets/models/Cesium_Man.glb';
import dronePath from '../assets/models/CesiumDrone.glb';

const Container = styled.div`
  #info {
    position: absolute;
    top: 0px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
    z-index: 1;
    color: #fff;
  }

  #mask {
    display: none;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #999;
    z-index: 999;
    text-align: center;
    .mask-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
  }
`;

const CityInSky = () => {
  const [loading, setLoading] = useState(true);

  let camera, scene, renderer, stats;
  let mixers = [];
  let manModel = null,
    droneModel = null;
  let isFlowMan = false,
    isClickShift = false,
    runDroneAnimation = false;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const clock = new THREE.Clock();

  const manMove = (
    model,
    status = 'left',
    leftToTop = true,
    littleTopMove = false,
  ) => {
    if (!manModel) {
      manModel = model;
    }
    requestAnimationFrame(() =>
      manMove(model, status, leftToTop, littleTopMove),
    );

    switch (status) {
      case 'top':
        model.position.z -= 0.05;
        if (littleTopMove) {
          if (model.position.z <= 160) {
            model.rotation.y += Math.PI / 2;
            status = 'left';
            leftToTop = true;
          }
        } else if (model.position.z <= 70) {
          model.rotation.y += Math.PI / 2;
          status = 'left';
          leftToTop = false;
        }
        break;
      case 'left':
        model.position.x -= 0.05;
        if (leftToTop) {
          if (model.position.x <= 155) {
            model.rotation.y -= Math.PI / 2;
            status = 'top';
            littleTopMove = false;
          }
        } else if (model.position.x <= 148) {
          model.rotation.y += Math.PI / 2;
          status = 'bottom';
        }
        break;
      case 'bottom':
        model.position.z += 0.05;
        if (model.position.z >= 168) {
          model.rotation.y += Math.PI / 2;
          status = 'right';
        }
        break;
      case 'right':
        model.position.x += 0.05;
        if (model.position.x >= 200) {
          model.rotation.y += Math.PI / 2;
          status = 'top';
          leftToTop = true;
          littleTopMove = true;
        }
        break;
      default:
        break;
    }
  };

  const soldierMove = (model, status = 'top') => {
    requestAnimationFrame(() => soldierMove(model, status));

    switch (status) {
      case 'top':
        model.position.z -= 0.1;
        if (model.position.z <= -110) {
          model.rotation.y += Math.PI / 2;
          status = 'left';
        }
        break;
      case 'left':
        model.position.x -= 0.1;
        if (model.position.x <= -110) {
          model.rotation.y += Math.PI / 2;
          status = 'bottom';
        }
        break;
      case 'bottom':
        model.position.z += 0.1;
        if (model.position.z >= 210) {
          model.rotation.y += Math.PI / 2;
          status = 'right';
        }
        break;
      case 'right':
        model.position.x += 0.1;
        if (model.position.x >= 210) {
          model.rotation.y += Math.PI / 2;
          status = 'top';
        }
        break;
      default:
        break;
    }
  };
  const moveCarTwo = (object, isBack, isPause, timer) => {
    if (isBack) {
      object.position.x += 1;

      // 回去路上停车等待
      if (!isPause && object.position.x === 30) {
        isPause = true;
        clearInterval(timer);
        setTimeout(() => {
          isPause = false;
          timer = setInterval(
            () => moveCarTwo(object, isBack, isPause, timer),
            60 / 1000,
          );
        }, 1000);
      }

      // 调转车头
      if (object.position.x >= 195) {
        isBack = false;
        object.rotation.set(0, Math.PI / 2, 0);
        clearInterval(timer);
        timer = setInterval(
          () => moveCarTwo(object, isBack, isPause, timer),
          60 / 1000,
        );
      }
    } else {
      object.position.x -= 1;

      // 暂停等待
      if (!isPause && object.position.x === 70) {
        isPause = true;
        clearInterval(timer);
        setTimeout(() => {
          isPause = false;
          timer = setInterval(
            () => moveCarTwo(object, isBack, isPause, timer),
            60 / 1000,
          );
        }, 1000);
      }

      // 调转车头
      if (object.position.x <= -95) {
        isBack = true;
        object.rotation.set(0, (Math.PI * 3) / 2, 0);
        clearInterval(timer);
        timer = setInterval(
          () => moveCarTwo(object, isBack, isPause, timer),
          60 / 1000,
        );
      }
    }
  };
  const moveCarOne = (object, isBack = false) => {
    requestAnimationFrame(() => moveCarOne(object, isBack));

    if (isBack) {
      object.position.z += 2;
      if (object.position.z >= 195) {
        isBack = false;
        object.rotation.set(0, 0, 0);
      }
    } else {
      object.position.z -= 2;
      if (object.position.z <= -95) {
        isBack = true;
        object.rotation.set(0, Math.PI, 0);
      }
    }
  };

  const onMouseClick = (event) => {
    event.preventDefault();
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    if (manModel) {
      const intersects = raycaster.intersectObject(manModel, true);
      if (intersects.length > 0) {
        isFlowMan = true;
      }
    }
  };

  const onKeyUp = (event) => {
    // 按下Esc键后停止跟随人物漫游
    if (isFlowMan && event.keyCode === 27) {
      isFlowMan = false;
      camera.position.set(0, 50, 300);
      camera.rotation.set(0, 0, 0);
    } else if (event.keyCode === 16) {
      // shift
      isClickShift = false;
    } else if (event.keyCode === 32) {
      runDroneAnimation = !runDroneAnimation;
    }
  };

  const onKeyDown = (event) => {
    if (!runDroneAnimation) {
      return;
    }
    switch (event.keyCode) {
      case 87: // w:前
        if (isClickShift) {
          // shift + w:上
          droneModel.position.y += 1;
        } else {
          droneModel.rotation.y = Math.PI;
          droneModel.position.z -= 1;
        }
        break;
      case 83: // s:后
        if (isClickShift) {
          // shift + s:下
          droneModel.position.y -= 1;
        } else {
          droneModel.rotation.y = 0;
          droneModel.position.z += 1;
        }
        break;
      case 65: // a:左
        droneModel.rotation.y = -Math.PI / 2;
        droneModel.position.x -= 1;
        break;
      case 68: // d: 右
        droneModel.rotation.y = Math.PI / 2;
        droneModel.position.x += 1;
        break;
      case 16: // shift
        isClickShift = true;
        break;
      default:
        break;
    }
  };

  /**
   *
   * @param {Object} loader Three.js的加载器
   * @param {String} url 模型路径
   * @param {Object} objectOptions 模型需要调整的属性
   * @param {String} modelName 模型名称
   * @param {Function} callback 回调函数
   */
  const loadModel = (loader, url, objectOptions, modelName, callback) => {
    loader.load(url, (object) => {
      // 获取模型，gltf需取object.scene，fbx直接取object
      const model = object.scene || object;

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      Object.keys(objectOptions).forEach((key) => {
        model[key].set(...objectOptions[key]);
      });

      if (object.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        // 士兵有多个动画，使用第二个-RUN
        const action = mixer.clipAction(
          object.animations[1] ? object.animations[1] : object.animations[0],
        );

        mixer.type = modelName;

        action.play();
        mixers.push(mixer);
      }

      scene.add(model);

      callback && callback(model);
    });
  };

  const init = () => {
    const threeContainer = document.getElementById('three');

    scene = new THREE.Scene();

    // const axesHelper = new THREE.AxesHelper(500);
    // scene.add(axesHelper);

    camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      1,
      2000,
    );
    camera.position.set(0, 50, 300);
    scene.add(camera);

    // 地板
    const groundTexture = new THREE.TextureLoader().load(floorBackground);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    const groundMaterial = new THREE.MeshLambertMaterial({
      map: groundTexture,
    });
    const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(500, 500),
      groundMaterial,
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(50, -1, 50);
    mesh.receiveShadow = true;
    scene.add(mesh);

    // 天空盒
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const texture = cubeTextureLoader.load([
      skyBoxPX,
      skyBoxNX,
      skyBoxPY,
      skyBoxNY,
      skyBoxPZ,
      skyBoxNZ,
    ]);
    scene.background = texture;

    const light = new THREE.PointLight(0xddeeff, 0.2);
    light.position.set(0, 200, 0);
    scene.add(light);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.1);
    hemiLight.position.set(0, 200, 0);
    // scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(-500, 500, 500);
    dirLight.castShadow = true;
    dirLight.shadow.camera.far = 1000;
    dirLight.shadow.camera.top = 200;
    dirLight.shadow.camera.bottom = -200;
    dirLight.shadow.camera.left = -200;
    dirLight.shadow.camera.right = 300;
    scene.add(dirLight);

    // scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

    const fbxLoader = new FBXLoader();
    const gltfLoader = new GLTFLoader();
    loadModel(
      fbxLoader,
      buildingsPath,
      {
        position: [50, 0, 50],
      },
      'buildings',
      () => {
        loadModel(
          fbxLoader,
          carPath01,
          {
            scale: [3, 3, 3],
            position: [52.5, 0, 195],
          },
          'car01',
          moveCarOne,
        );

        loadModel(
          fbxLoader,
          carPath02,
          {
            scale: [3, 3, 3],
            position: [47.5, 0, -95],
          },
          'car02',
          moveCarOne,
        );

        loadModel(
          fbxLoader,
          carPath03,
          {
            scale: [3, 3, 3],
            position: [195, 0, 52.5],
            rotation: [0, Math.PI / 2, 0],
          },
          'car03',
          (object) => {
            const isBack = false;
            const isPause = false;

            let timer = null;

            timer = setInterval(
              () => moveCarTwo(object, isBack, isPause, timer),
              60 / 1000,
            );
          },
        );

        for (let i = 0; i < 10; i++) {
          loadModel(
            gltfLoader,
            SoldierPath,
            {
              scale: [2, 2, 2],
              position: [210, 0, 150 + 5 * i],
            },
            'soldier',
            soldierMove,
          );
        }

        loadModel(
          gltfLoader,
          manPath,
          {
            scale: [3, 3, 3],
            rotation: [0, -Math.PI / 2, 0],
            position: [200, 0, 160],
          },
          'manModel',
          manMove,
        );

        loadModel(
          gltfLoader,
          dronePath,
          {
            scale: [3, 3, 3],
            rotation: [0, Math.PI, 0],
            position: [80, 52, 160],
          },
          'droneModel',
          (model) => {
            droneModel = model;
            setLoading(false);
          },
        );
      },
    );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    threeContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', onMouseClick);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);

    // stats
    stats = new Stats();
    threeContainer.appendChild(stats.dom);
  };

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const animate = () => {
    requestAnimationFrame(animate);

    if (isFlowMan) {
      camera.position.set(
        manModel.position.x,
        manModel.position.y + 5,
        manModel.position.z,
      );
      camera.rotation.set(
        manModel.rotation.x,
        manModel.rotation.y + Math.PI,
        manModel.rotation.z,
      );
    }

    const delta = clock.getDelta();

    mixers.forEach((mixer) => {
      if (mixer.type === 'droneModel') {
        if (runDroneAnimation) {
          mixer.update(delta);
        }
      } else {
        mixer.update(delta);
      }
    });

    renderer.render(scene, camera);

    stats.update();
  };

  useEffect(() => {
    if (loading) {
      init();
      animate();
    }
  });

  return (
    <Spin spinning={loading}>
      <Container>
        <div id='info'>
          城市场景模拟;
          <br />
          点击右下角人物进行漫游，Esc退出漫游；
          <br />
          空格启动/停止直升机，w/a/s/d控制直升机前后左右；shift+w/s控制上下；
          <br />
          鼠标左键旋转视角，右键移动移动视角，滚轮缩放视角；
        </div>
        <div id='mask'>
          <span className='mask-text'> 加载模型中，请稍等... </span>
        </div>
        <div id='three'></div>
      </Container>
    </Spin>
  );
};

export default CityInSky;
