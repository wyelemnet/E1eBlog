import React from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import styled from 'styled-components';

import backgroundCloud from '../assets/images/textures/cloud.jpg';

console.log(backgroundCloud);

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
    z-index: 1; /* TODO Solve this in HTML */
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
  const maskContainer = document.getElementById('mask');

  let camera, scene, renderer, stats;

  const clock = new THREE.Clock();

  let mixer,
    droneMixer,
    mixers = [];
  let cesiumManObject = null;

  let droneModel = null;

  let isFlowMan = false;

  let isClickShift = false;

  let runDroneAnimation = false;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const onMouseClick = (event) => {
    event.preventDefault();
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cesiumManObject, true);
    if (intersects.length > 0) {
      isFlowMan = true;
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

  // window.addEventListener('click', onMouseClick, false);
  // window.addEventListener('keyup', onKeyUp, false);
  // window.addEventListener('keydown', onKeyDown, false);

  const init = () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);

    camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      1,
      2000,
    );
    camera.position.set(0, 50, 300);
    scene.add(camera);

    // 地板
    const groundTexture = new THREE.TextureLoader().load(
      '../assets/images/textures/cloud1.jpg',
    );
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
      '../assets/images/skybox/px.jpg',
      '../assets/images/skybox/nx.jpg',
      '../assets/images/skybox/py.jpg',
      '../assets/images/skybox/ny.jpg',
      '../assets/images/skybox/pz.jpg',
      '../assets/images/skybox/nz.jpg',
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

    const loader = new FBXLoader();
    // 加载建筑模型
    // loader.load('../assets/models/buildings.FBX', function (object) {
    //   console.log(object);
    //   object.traverse(function (child) {
    //     if (child.isMesh) {
    //       child.castShadow = true;
    //       child.receiveShadow = true;
    //     }
    //   });
    //   object.position.set(50, 0, 50);

    //   scene.add(object);

    //   // // 加载车模型1及移动
    //   // loader.load('../assets/models/cars/car01.FBX', function (object) {
    //   //   object.traverse(function (child) {
    //   //     if (child.isMesh) {
    //   //       child.castShadow = true;
    //   //       child.receiveShadow = true;
    //   //     }
    //   //   });
    //   //   mixer = new THREE.AnimationMixer(object);

    //   //   const action = mixer.clipAction(object.animations[0]);
    //   //   action.play();

    //   //   object.traverse(function (child) {
    //   //     if (child.isMesh) {
    //   //       child.castShadow = true;
    //   //       child.receiveShadow = true;
    //   //     }
    //   //   });
    //   //   object.scale.set(3, 3, 3);
    //   //   object.position.set(52.5, 0, 195);

    //   //   scene.add(object);

    //   //   let isBack = false;

    //   //   setInterval(() => {
    //   //     if (isBack) {
    //   //       object.position.z++;
    //   //       if (object.position.z >= 195) {
    //   //         isBack = false;
    //   //         object.rotation.set(0, 0, 0);
    //   //       }
    //   //     } else {
    //   //       object.position.z--;
    //   //       if (object.position.z <= -95) {
    //   //         isBack = true;
    //   //         object.rotation.set(0, Math.PI, 0);
    //   //       }
    //   //     }
    //   //   }, 60 / 1000);
    //   // });

    //   // // 加载车模型2及移动
    //   // loader.load('../assets/models/cars/car02.FBX', function (object) {
    //   //   object.traverse(function (child) {
    //   //     if (child.isMesh) {
    //   //       child.castShadow = true;
    //   //       child.receiveShadow = true;
    //   //     }
    //   //   });
    //   //   mixer = new THREE.AnimationMixer(object);

    //   //   const action = mixer.clipAction(object.animations[0]);
    //   //   action.play();

    //   //   object.traverse(function (child) {
    //   //     if (child.isMesh) {
    //   //       child.castShadow = true;
    //   //       child.receiveShadow = true;
    //   //     }
    //   //   });
    //   //   object.scale.set(3, 3, 3);
    //   //   object.position.set(47.5, 0, -95);

    //   //   scene.add(object);

    //   //   let isBack = false;

    //   //   setInterval(() => {
    //   //     if (isBack) {
    //   //       object.position.z++;
    //   //       if (object.position.z >= 195) {
    //   //         isBack = false;
    //   //         object.rotation.set(0, 0, 0);
    //   //       }
    //   //     } else {
    //   //       object.position.z--;
    //   //       if (object.position.z <= -95) {
    //   //         isBack = true;
    //   //         object.rotation.set(0, Math.PI, 0);
    //   //       }
    //   //     }
    //   //   }, 60 / 1000);
    //   // });

    //   // // 加载车模型3及移动
    //   // loader.load('../assets/models/cars/car03.FBX', function (object) {
    //   //   object.traverse(function (child) {
    //   //     if (child.isMesh) {
    //   //       child.castShadow = true;
    //   //       child.receiveShadow = true;
    //   //     }
    //   //   });
    //   //   mixer = new THREE.AnimationMixer(object);

    //   //   const action = mixer.clipAction(object.animations[0]);
    //   //   action.play();

    //   //   object.traverse(function (child) {
    //   //     if (child.isMesh) {
    //   //       child.castShadow = true;
    //   //       child.receiveShadow = true;
    //   //     }
    //   //   });
    //   //   object.scale.set(3, 3, 3);
    //   //   object.position.set(195, 0, 52.5);
    //   //   object.rotation.set(0, Math.PI / 2, 0);

    //   //   scene.add(object);

    //   //   let isBack = false;
    //   //   let isPause = false;
    //   //   let timer = null;

    //   //   const interval = () => {
    //   //     if (isBack) {
    //   //       if (!isPause && object.position.x === 30) {
    //   //         isPause = true;
    //   //         clearInterval(timer);
    //   //         setTimeout(() => {
    //   //           isPause = false;
    //   //           timer = setInterval(interval, 60 / 1000);
    //   //         }, 1000);
    //   //       }
    //   //       object.position.x++;
    //   //       if (object.position.x >= 195) {
    //   //         isBack = false;
    //   //         object.rotation.set(0, Math.PI / 2, 0);
    //   //       }
    //   //     } else {
    //   //       if (!isPause && object.position.x === 70) {
    //   //         isPause = true;
    //   //         clearInterval(timer);
    //   //         setTimeout(() => {
    //   //           isPause = false;
    //   //           timer = setInterval(interval, 60 / 1000);
    //   //         }, 1000);
    //   //       }
    //   //       object.position.x--;
    //   //       if (object.position.x <= -95) {
    //   //         isBack = true;
    //   //         object.rotation.set(0, (Math.PI * 3) / 2, 0);
    //   //       }
    //   //     }
    //   //   };

    //   //   timer = setInterval(interval, 60 / 1000);
    //   // });

    //   // // 士兵模型加载及绕圈跑动
    //   // const gltfLoader = new GLTFLoader().setPath('../assets/models/');
    //   // for (let i = 0; i < 10; i++) {
    //   //   gltfLoader.load('Soldier.glb', function (gltf) {
    //   //     const model = gltf.scene;
    //   //     model.traverse(function (child) {
    //   //       if (child.isMesh) {
    //   //         child.castShadow = true;
    //   //         child.receiveShadow = true;
    //   //       }
    //   //     });
    //   //     model.scale.set(2, 2, 2);
    //   //     model.position.set(210, 0, 150 + 5 * i);
    //   //     // model.position.set(210, 0, 200);
    //   //     scene.add(model);
    //   //     const mixer = new THREE.AnimationMixer(model);
    //   //     const action = mixer.clipAction(gltf.animations[1]);
    //   //     action.play();
    //   //     mixers.push(mixer);

    //   //     let state = 'top';

    //   //     setInterval(() => {
    //   //       switch (state) {
    //   //         case 'top':
    //   //           model.position.z -= 0.1;
    //   //           if (model.position.z <= -110) {
    //   //             model.rotation.y += Math.PI / 2;
    //   //             state = 'left';
    //   //           }
    //   //           break;
    //   //         case 'left':
    //   //           model.position.x -= 0.1;
    //   //           if (model.position.x <= -110) {
    //   //             model.rotation.y += Math.PI / 2;
    //   //             state = 'bottom';
    //   //           }
    //   //           break;
    //   //         case 'bottom':
    //   //           model.position.z += 0.1;
    //   //           if (model.position.z >= 210) {
    //   //             model.rotation.y += Math.PI / 2;
    //   //             state = 'right';
    //   //           }
    //   //           break;
    //   //         case 'right':
    //   //           model.position.x += 0.1;
    //   //           if (model.position.x >= 210) {
    //   //             model.rotation.y += Math.PI / 2;
    //   //             state = 'top';
    //   //           }
    //   //           break;
    //   //         default:
    //   //           break;
    //   //       }
    //   //     }, 60 / 1000);
    //   //   });
    //   // }

    //   // // cesium_man模型加载，移动及漫游
    //   // gltfLoader.load('Cesium_Man.glb', function (gltf) {
    //   //   const model = gltf.scene;
    //   //   model.traverse(function (child) {
    //   //     if (child.isMesh) {
    //   //       child.castShadow = true;
    //   //       child.receiveShadow = true;
    //   //     }
    //   //   });
    //   //   model.scale.set(3, 3, 3);
    //   //   model.rotation.y -= Math.PI / 2;
    //   //   model.position.set(200, 0, 160);
    //   //   cesiumManObject = model;
    //   //   scene.add(model);
    //   //   // 模型加载完成后去掉遮罩层
    //   //   maskContainer.style.display = 'none';
    //   //   const mixer = new THREE.AnimationMixer(model);
    //   //   const action = mixer.clipAction(gltf.animations[0]);
    //   //   action.play();
    //   //   mixers.push(mixer);

    //   //   let status = 'left';
    //   //   let leftToTop = true;
    //   //   let littleTopMove = false;
    //   //   setInterval(() => {
    //   //     switch (status) {
    //   //       case 'top':
    //   //         model.position.z -= 0.05;
    //   //         if (littleTopMove) {
    //   //           if (model.position.z <= 160) {
    //   //             model.rotation.y += Math.PI / 2;
    //   //             status = 'left';
    //   //             leftToTop = true;
    //   //           }
    //   //         } else {
    //   //           if (model.position.z <= 70) {
    //   //             model.rotation.y += Math.PI / 2;
    //   //             status = 'left';
    //   //             leftToTop = false;
    //   //           }
    //   //         }
    //   //         break;
    //   //       case 'left':
    //   //         model.position.x -= 0.05;
    //   //         if (leftToTop) {
    //   //           if (model.position.x <= 155) {
    //   //             model.rotation.y -= Math.PI / 2;
    //   //             status = 'top';
    //   //             littleTopMove = false;
    //   //           }
    //   //         } else {
    //   //           if (model.position.x <= 148) {
    //   //             model.rotation.y += Math.PI / 2;
    //   //             status = 'bottom';
    //   //           }
    //   //         }
    //   //         break;
    //   //       case 'bottom':
    //   //         model.position.z += 0.05;
    //   //         if (model.position.z >= 168) {
    //   //           model.rotation.y += Math.PI / 2;
    //   //           status = 'right';
    //   //         }
    //   //         break;
    //   //       case 'right':
    //   //         model.position.x += 0.05;
    //   //         if (model.position.x >= 200) {
    //   //           model.rotation.y += Math.PI / 2;
    //   //           status = 'top';
    //   //           leftToTop = true;
    //   //           littleTopMove = true;
    //   //         }
    //   //         break;
    //   //       default:
    //   //         break;
    //   //     }
    //   //   }, 60 / 1000);
    //   // });

    //   // // 加载飞机模型及飞行动画
    //   // // gltfLoader.load('CesiumAir/Cesium_Air.glb', function (gltf) {
    //   // gltfLoader.load('CesiumDrone/CesiumDrone.glb', function (gltf) {
    //   //   const model = gltf.scene;
    //   //   model.traverse(function (child) {
    //   //     if (child.isMesh) {
    //   //       child.castShadow = true;
    //   //       child.receiveShadow = true;
    //   //     }
    //   //   });
    //   //   model.scale.set(3, 3, 3);
    //   //   model.rotation.y += Math.PI;
    //   //   model.position.set(80, 52, 160);
    //   //   droneModel = model;
    //   //   scene.add(model);
    //   //   // 模型加载完成后去掉遮罩层
    //   //   maskContainer.style.display = 'none';
    //   //   droneMixer = new THREE.AnimationMixer(model);
    //   //   const action = droneMixer.clipAction(gltf.animations[0]);
    //   //   action.play();

    //   //   const statuses = ['top', 'bottom', 'left', 'right'];
    //   //   let status = 'up';
    //   //   let lastStatus = 'up';
    //   //   let statusIndex = -1;
    //   //   setInterval(() => {
    //   //     return;
    //   //     switch (status) {
    //   //       case 'up':
    //   //         model.position.y += 1;
    //   //         if (model.position.y >= 200) {
    //   //           statusIndex = Math.round(Math.random() * 3);
    //   //           status = statuses[statusIndex];
    //   //         }
    //   //         break;
    //   //       case 'top':
    //   //         model.position.z -= 1;
    //   //         if (model.position.z <= -100) {
    //   //           statusIndex = Math.round(Math.random() * 3);
    //   //           status = statuses[statusIndex];
    //   //           lastStatus = 'top';
    //   //         }
    //   //         break;
    //   //       case 'bottom':
    //   //         model.position.z += 1;
    //   //         if (model.position.z >= 200) {
    //   //           statusIndex = Math.round(Math.random() * 3);
    //   //           status = statuses[statusIndex];
    //   //         }
    //   //         break;
    //   //       case 'left':
    //   //         model.position.x -= 1;
    //   //         if (model.position.x <= -100) {
    //   //           statusIndex = Math.round(Math.random() * 3);
    //   //           status = statuses[statusIndex];
    //   //         }
    //   //         break;
    //   //       case 'right':
    //   //         model.position.x += 1;
    //   //         if (model.position.x >= 200) {
    //   //           statusIndex = Math.floor(Math.random() * 3);
    //   //           status = statuses[statusIndex];
    //   //         }
    //   //         break;
    //   //       default:
    //   //         break;
    //   //     }
    //   //   }, 60 / 1000);
    //   // });
    // });



    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 100, 0);
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

    // stats
    stats = new Stats();
    container.appendChild(stats.dom);
  };

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  //

  const animate = () => {
    requestAnimationFrame(animate);

    if (isFlowMan) {
      camera.position.set(
        cesiumManObject.position.x,
        cesiumManObject.position.y + 5,
        cesiumManObject.position.z,
      );
      camera.rotation.set(
        cesiumManObject.rotation.x,
        cesiumManObject.rotation.y + Math.PI,
        cesiumManObject.rotation.z,
      );
    }

    const delta = clock.getDelta();

    if (runDroneAnimation) {
      if (droneMixer) droneMixer.update(delta);
    }

    if (mixer) mixer.update(delta);

    mixers &&
      mixers.forEach((mixer) => {
        mixer.update(delta);
      });

    renderer.render(scene, camera);

    stats.update();
  };

  init();
  animate();
  return (
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
    </Container>
  );
};

export default CityInSky;
