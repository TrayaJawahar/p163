AFRAME.registerComponent("Balls", {
  init: function () {
    this.shootBall();
  },
  shootBall: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        var Ball = document.createElement("a-entity");

        Ball.setAttribute("geometry", {
          primitive: "sphere",
          radius: 0.1,
        });

        Ball.setAttribute("material", "color", "black");

        var cam = document.querySelector("#camera");

        pos = cam.getAttribute("position");

        Ball.setAttribute("position", {
          x: pos.x,
          y: pos.y,
          z: pos.z,
        });

        var camera = document.querySelector("#camera").object3D;

        //get the camera direction as Three.js Vector
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        //set the velocity and it's direction
        Ball.setAttribute("velocity", direction.multiplyScalar(-10));

        var scene = document.querySelector("#scene");

        //set the Ball as the dynamic entity
        Ball.setAttribute("dynamic-body", {
          shape: "sphere",
          mass: "0",
        });

        //add the collide event listener to the Ball
        Ball.addEventListener("collide", this.removeBall);

        scene.appendChild(Ball);

        //shooting sound
        this.shootSound();
      }
    });
  },
  removeBall: function (e) {
    //Ball element
    var element = e.detail.target.el;

    //element which is hit
    var elementHit = e.detail.body.el;

    if (elementHit.id.includes("box")) {
      elementHit.setAttribute("material", {
        opacity: 1,
        transparent: true,
      });

      //impulse and point vector
      var impulse = new CANNON.Vec3(-2, 2, 1);
      var worldPoint = new CANNON.Vec3().copy(
        elementHit.getAttribute("position")
      );

      elementHit.body.applyImpulse(impulse, worldPoint);

      //remove event listener
      element.removeEventListener("collide", this.removeBall);

      //remove the Balls from the scene
      var scene = document.querySelector("#scene");
      scene.removeChild(element);
    }
  },
  shootSound: function () {
    var entity = document.querySelector("#sound1");
    entity.components.sound.playSound();
  },
});

