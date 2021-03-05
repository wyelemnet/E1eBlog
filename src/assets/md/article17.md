## 使用Three.js构建天空之城

### 壹（序）
手中有很多模型，其中包括建筑模型，汽车模型若干，人物模型，直升机模型...于是产生了使用这些模型做点事情的想法。
说干就干，但是干什么呢，做个天空之城吧！

### 贰（准备工作）
* 模型并不缺，但是缺少一个天空，我需要构建一个天空盒，最后在github找到一个满意的[SkyBox](https://github.com/Sergioperezalonzo/Skybox/tree/master/resources/skybox)
* 看着士兵模型，我觉得他们可以去保卫城市；
* 看着Cesium小人，我觉得让他闲逛就行；
* 看着直升机，正好建筑模型里面有停机坪；
* 看着几辆车，建筑模型有两条直直的大马路；

### 叁（动手）
* 先将场景初始化出来
	```
    const threeContainer = document.getElementById('three');

    scene = new THREE.Scene();

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
    ```
* 再将所有模型加载进去，可是加载模型是异步操作，建筑模型是比较大的，人物经常先加载完成，那么我需要等建筑模型加载完成再加载其他模型；需要加载很多模型，那么封装一个函数吧：
	```
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
        console.log(object);
        // 获取模型，gltf需取object.scene，fbx直接取object
        const model = object.scene || object;
        // const model = gltf.scene;

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
    ```
* 士兵们具有动画，那么让他们绕着城市奔跑，以保卫天空之城；
  围城跑的思路：使用requestAnimationFrame更新模型位置，给定一个初始朝向状态（如top），表示此时往什么方向移动，再判断是否已经到达临界点，到达后需转向奔跑;
	```
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
    ```
* 汽车的移动
	```
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
    ```
* 另一个方向汽车，做一个暂停等待的功能；
	```
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
    ```
* 直升机的操控，监听键盘事件，对直升机进行操控，前后左右（w/s/a/d)及上下(shift+w/shift+s)
	```
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
    ```
* Cesium人物模型的移动与其他模型的移动是一样的，只是转向比较多，需要多处理一下，相当于重复功能，所以增加一个漫游功能，随着人物的第一视角漫游；
	```
    // 使用Raycaster，增加鼠标与人物模型的碰撞监测：
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
    // 点击到漫游者后，更改相机position及rotation，实现漫游
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
    ```

### 肆（细节）
* 自此所有主要功能已完成，再增加一点点细节，比如增加平行光模拟太阳光（天空盒中正好有太阳），但是阴影会让城市看起来太暗，所有增加点光源，调节亮度；
	```
    const light = new THREE.PointLight(0xddeeff, 0.2);
    light.position.set(0, 200, 0);
    scene.add(light);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(-500, 500, 500);
    dirLight.castShadow = true;
    dirLight.shadow.camera.far = 1000;
    dirLight.shadow.camera.top = 200;
    dirLight.shadow.camera.bottom = -200;
    dirLight.shadow.camera.left = -200;
    dirLight.shadow.camera.right = 300;
    scene.add(dirLight);
    ```
* 还有一开始不启动直升机的动画，而是按下键盘空格再启动，直升机动画效果启动之后才能操控；

### 伍（完结）
完善所有功能及细节后，部署到[我的个人博客](https://wyelemnet.github.io/E1eBlog/#/home);

使天空之城能预览:[天空之城](https://wyelemnet.github.io/E1eBlog/#/examples/cityInSky)

