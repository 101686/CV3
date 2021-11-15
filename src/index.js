import "./styles.css";

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/scene";
import { SixDofDragBehavior } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";

import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { GLTFLoader } from "@babylonjs/loaders/glTF/2.0/glTFLoader";
import { Animation } from "@babylonjs/core";
// Basic setup
const canvas = document.querySelector("#app");
const engine = new Engine(canvas, true, null, true);
const scene = new Scene(engine);

const camera = new ArcRotateCamera(
  "ArcRotateCamera",
  2,
  1.45,
  4,
  new Vector3(0, 0, 0),
  scene
);
camera.panningSensibility = 0;
scene.activeCamera.attachControl(canvas, false);

new DirectionalLight("dir01", new Vector3(0.25, -1, 0), scene);

window.addEventListener("resize", () => engine.resize());

engine.runRenderLoop(() => scene.render());

var initFunction = async function () {
  var frezaMeshaset = await SceneLoader.ImportMeshAsync(
    "",
    "public/",
    "endmill.glb",
    scene
  );
  var frezaMesh2 = frezaMeshaset.meshes[0];
  frezaMesh2.rotate(new Vector3(0, 0, 1), (frezaMesh2.rotation.y += 0.00001));

  frezaMesh2.scaling = new Vector3(0.15, 0.15, 0.15);
  frezaMesh2.rotate(new Vector3(-1, 0, 0), Math.PI / 2);
  frezaMesh2.position.x = 2;
  frezaMesh2.position.z = -2;
  var sixDofDragBehavior = new SixDofDragBehavior();
  sixDofDragBehavior.rotateDraggedObject = true;
  // sixDofDragBehavior. = false;
  let frezasubmesh;
  frezasubmesh = frezaMesh2;
  frezasubmesh.addBehavior(sixDofDragBehavior);
  //před vykreslením se vždy provede
  scene.registerBeforeRender(function () {
    //sphere.position.x += 0.03;
    // light1.setDirectionToTarget(sphere.position);
    if (frezaMesh2.position.x > -1) {
      frezaMesh2.rotate(new Vector3(0, 0, 1), (frezaMesh2.rotation.y += 0.01));
    }

    //frezaMesh2.rotate(new Vector3(0, 0, 1), (frezaMesh2.rotation.y += 0.001));
  });
  animationFunction(frezaMesh2);
};
var animationFunction = function (frezaMesh2) {
  const frameRate = 10;
  const xSlide = new Animation(
    "xSlide",
    "position.x",
    frameRate,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );

  const keyFrames = [];

  keyFrames.push({
    frame: 0,
    value: 1
  });

  keyFrames.push({
    frame: frameRate,
    value: -2
  });

  keyFrames.push({
    frame: 2 * frameRate,
    value: 1
  });

  xSlide.setKeys(keyFrames);
  frezaMesh2.animations.push(xSlide);
  scene.beginAnimation(frezaMesh2, 0, 2 * frameRate, true);
};

initFunction();
