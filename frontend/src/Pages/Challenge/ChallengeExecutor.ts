/* eslint-disable no-labels */
import { images } from "../../Components/PlayComponents/Simulation/Sketch/simulation/assets";
import { InteractiveObject } from "../../Components/PlayComponents/Simulation/Sketch/simulation/InteractiveObject";
import { Shape } from "../../Components/PlayComponents/Simulation/Sketch/simulation/Shape";
import { Vector } from "../../Components/PlayComponents/Simulation/Sketch/simulation/Vector";
import openPlaySocket from "./PlaySocket";
import $ from 'jquery';

// TODO: robotConnected
const robotConnected = false;

const ChallengeExecutor = (s: any, playButton: any, lineInterfaceContent: string) => {
  playButton = $(playButton);
  

  s.execution = false;
  s.playButton = playButton;
  let timeouts: Array<NodeJS.Timeout> = [];

  let d1: Shape;
  let d2: Shape;
  let d3: Shape;

  let sensors = {
    dA: 0,
    dG: 0,
    dD: 0,
  };

  const playSocket = openPlaySocket();
  playSocket.onRobotReceive((data: any) => {
    let car = s.car;

    console.log(data);

    if (d1 == null || d2 == null || d3 == null) {
      console.log("CREATE");
      d1 = s.spawnRect(0, 0, 100, 5);
      d1.setRotation(-60);
      d2 = s.spawnRect(0, 0, 100, 5);
      d3 = s.spawnRect(0, 0, 100, 5);
      d3.setRotation(60);

      car.shape.addChild(d1);
      car.shape.addChild(d2);
      car.shape.addChild(d3);
    }

    if ("a" in data) {
      car.shape.setRotation(data["a"]);
    }

    let frontOfCar = car.shape.pos
      .clone()
      .add(car.shape.forward.clone().normalize().multiplyScalar(55));
    let perpendicularFront = new Vector(frontOfCar.y, -frontOfCar.x)
      .normalize()
      .multiplyScalar(30);

    sensors.dA = data["2"] ?? 0;
    sensors.dG = data["1"] ?? 0;
    sensors.dD = data["3"] ?? 0;

    d1.setPos(frontOfCar.clone().substract(perpendicularFront), false);
    d2.setPos(frontOfCar.clone(), false);
    d3.setPos(frontOfCar.clone().add(perpendicularFront), false);

    d1.moveInDirection(d1.forward?.normalize(), sensors.dG * 7, false);
    d2.moveInDirection(d2.forward?.normalize(), sensors.dA * 7, false);
    d3.moveInDirection(d3.forward?.normalize(), sensors.dD * 7, false);
  });

  // TODO: typing events
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const reset = (e: any) => {
    if (e.collidingWith === s.car) {
      playButton.trigger('click');
    }
  };

  s.editorButton = null
  s.robotConnectButton = null

  s.spawnEditorButton = () => {
    s.editorButton = s.spawnFixedRect(s.width / 2 - 35, -s.height / 2 + 95, 50, 50, 5000)
    // images.tools
    s.editorButton.setImg(images.animatedCar)
    s.editorButton.color = s.color(0, 0)
    s.editorButton.onHover((e: any) => {
      s.strokeWeight(1)
      s.editorButton.strokeColor = "red"
    })
    s.editorButton.onClick((e: any) => {
      if (s.execution) {
        playButton.trigger('click');
      }
      s.toggleEditMode()
    })
  }

  s.spawnRobotConnectButton = () => {
    s.robotConnectButton = s.spawnFixedRect(s.width / 2 - 35, -s.height / 2 + 35, 50, 50, 1000)
    s.robotConnectButton.setImg(images.animatedCar)
    s.robotConnectButton.color = s.color(0, 0)
    s.robotConnectButton.onHover((e: any) => {
      s.strokeWeight(1)
      s.robotConnectButton.strokeColor = '#0177bc'
    })

    // TODO: fix connect modal
    s.robotConnectButton.onClick((e: any) => {
      //connectModal.modal('show')
    })
  }

  try {
    // Clear la simulation au cas ou ce qu'il y a déjà des voitures ou autres
    let json_script = JSON.parse($("#leveldata").text())

    if (json_script == null || json_script === "" || json_script === '""' || json_script.length < 100) throw new Error('No level loaded')
    // Génération du niveau
    //const level = s.load(json_script, s.creator);
  } catch (exception) {
    s.car = s.spawnCar(0, 0, 75, 110);

    // TODO: editor reference
    //lineInterface.setValue("# Entrer votre code ci-dessous\n\n")
  }

  if (s.creator) {
    s.spawnEditorButton()
    //s.editorText = editor.getValue()
    s.levelName = $("#input-challenge-name").val()
    s.levelAccess = $('#liste-acces').val()
  }
  s.spawnRobotConnectButton()

  //s.canvasCamera.setScale(2000);

  $("#blocs-interface").on('click', () => {
    if (s.execution) playButton.trigger('click');
  });

  playButton.on('click', (e: any) => {

    if (!s.execution) {
      // TODO: uncomment in future
      //s.saveLevel()

      s.execution = true;
      // Envoie le code à éxécuter au serveur
      let lines: Array<string> = lineInterfaceContent.split("\n");
      console.log(lines)
      playSocket.compile(lines, (data) => {
        console.log(data)
        let car = s.car;

        s.canvasCamera.setTarget(s.car.shape);

        function perform_action(i: number, res: Array<any> | undefined = undefined) {
          if (res === undefined) res = [];
          const ID = "id";
          const DODO = "d";
          const PARAMS = "p";

          const validDataStructure = (action: any) => {
            return (
              ID in action &&
              typeof action[ID] === "number" &&
              DODO in action &&
              typeof action[DODO] === "number" &&
              PARAMS in action &&
              Array.isArray(action[PARAMS])
            );
          };

          if (i >= data.length) {
            playSocket.response(res);
            return;
          }
          let action = data[i];
          if (validDataStructure(action)) {
            let dodo = action[DODO] >= 0 ? action[DODO] : 0;
            let id = action[ID];
            let params = action[PARAMS];

            let angleDroit = 90;

            // Traite l'action a effectuée envoyée par le serveur
            id_switch: switch (id) {
              /*
                                    ----    VOITURE    ----
                            */
              case 100:
                /*----     arreter     ----*/
                car.stop();
                timeouts.push(
                  setTimeout(() => {
                    perform_action(i + 1, res);
                  }, dodo * 1000)
                );
                break;
              case 101:
                /*----     avancer     ----*/
                car.forward();
                timeouts.push(
                  setTimeout(() => {
                    if (dodo > 0) car.stop();
                    perform_action(i + 1, res);
                  }, dodo * 1000)
                );
                break;
              case 102:
                /*----     reculer     ----*/
                car.backward();
                timeouts.push(
                  setTimeout(() => {
                    if (dodo > 0) car.stop();
                    perform_action(i + 1, res);
                  }, dodo * 1000)
                );
                break;
              case 103:
                /*----     tourner     ----*/
                if (!robotConnected) {
                  if (params.length > 0 && typeof params[0] === "number") {
                    car.turn(-params[0], () => {
                      perform_action(i + 1, res);
                    });
                  }
                } else {
                  perform_action(i + 1, res);
                }
                break;
              case 104:
                /*----     tournerDroite     ----*/
                if (!robotConnected) {
                  car.turn(angleDroit, () => {
                    perform_action(i + 1, res);
                  });
                } else {
                  let goal = (car.shape.rotation.x + angleDroit) % 360;
                  let interval = setInterval(() => {
                    if (Math.abs(goal - car.shape.rotation.x) <= 0.5) {
                      clearInterval(interval);
                      perform_action(i + 1, res);
                    }
                  });
                }
                break;
              case 105:
                /*----     tournerGauche     ----*/
                if (!robotConnected) {
                  car.turn(-angleDroit, () => {
                    perform_action(i + 1, res);
                  });
                } else {
                  let goal = (car.shape.rotation.x - angleDroit) % 360;
                  let interval = setInterval(() => {
                    if (Math.abs(goal - car.shape.rotation.x) <= 0.5) {
                      clearInterval(interval);
                      perform_action(i + 1, res);
                    }
                  }, 50);
                }
                break;
              case 106:
                /*----     rouler     ----*/
                if (!robotConnected) {
                  if (params.length >= 2) {
                    car.setDirection(new Vector(params[0] / 255 - params[1] / 255, params[0] / 500 + params[1] / 500).normalize().multiplyScalar((params[0] / 2 + params[1] / 2) / 255))
                  }
                } else {
                  car.forward();
                }
                perform_action(i + 1, res);
                break;
              case 107:
                /*----     goToAngle     ----*/
                if (!robotConnected) {
                  if (params.length > 0 && typeof params[0] === "number") {
                    const currentAngle = car.shape.rotation.x
                    let angle = params[0] % 360
                    angle = angle < 0 ? 360 - angle : angle
                    angle = 360 - angle
                    var rotationAmount: number;
                    if (360 - currentAngle - angle < 180 && 360 - currentAngle - angle >= 0)
                      rotationAmount = -(360 - currentAngle - angle)
                    else
                      rotationAmount = -(360 - angle - currentAngle);
                    car.turn(rotationAmount, () => {
                      perform_action(i + 1, res);
                    });
                  }
                } else {
                  perform_action(i + 1, res);
                }
                break;
              /*
                                    ----    UTILITAIRES    ----
                            */
              case 300:
                /*----     print     ----*/

                if (params.length > 0 && typeof params[0] === "string") {
                  // TODO: add print_console
                  //print_console(params[0]);
                }
                if (dodo === 0) perform_action(i + 1, res);
                else {
                  timeouts.push(
                    setTimeout(() => {
                      perform_action(i + 1, res);
                    }, dodo * 1000)
                  );
                }
                break;
              case 301:
                /*----     attendre     ----*/
                if (params.length > 0 && typeof params[0] === "number") {
                  timeouts.push(
                    setTimeout(() => {
                      perform_action(i + 1, res);
                    }, params[0] * 1000)
                  );
                }
                break;
              /*
                                    ----    GET    ----
                            */
              case 500:
                switch (params[0]) {
                  case "read": {
                    /*----     lire     ----*/
                    let input = prompt("Entrez l'input");
                    res.push(input);
                    perform_action(i + 1, res);
                    // eslint-disable-next-line no-labels
                    break id_switch;
                  }

                  case "car": {
                    /*----     voiture     ----*/
                    const infosCar = {
                      x: car.shape.pos.x,
                      y: car.shape.pos.y,
                      dA: sensors.dA,
                      dG: sensors.dG,
                      dD: sensors.dD,
                      speed: car.speed
                    };
                    res.push(infosCar);
                    console.log(res);
                    perform_action(i + 1, res);
                    // eslint-disable-next-line no-labels
                    break id_switch;
                  }
                }
                break;
              /*
                                    ----    SET    ----
                            */
              case 600:
                break;

              case 601:
                /*----     vitesse voiture     ----*/
                car.speed = params[0];
                perform_action(i + 1, res);
                break;
            }

            /*
                                ----    ERREURS    ----
                        */
            if (id.toString()[0] === "4") {
              if (
                params.length > 1 &&
                typeof params[0] === "string" &&
                typeof params[2] === "number"
              ) {
                // TODO: add print_error
                //print_error(params[0] + ": " + params[1], params[2]);
              }
            }
          }
        }

        // Check si le data est valide
        if (Array.isArray(data) && data.length > 0) {
          perform_action(0);
        }
      });

      // TODO: add clear_cmd()
      //clear_cmd();
      playButton.children("img").attr("src", "/static/images/pause_button.png");

      // Ancien système obsolet pour set la target on play
      //if (s.car != null && s.canvasCamera != null) s.canvasCamera.setTarget(s.car)
    } else {
      s.execution = false;
      //if(!robotConnected) {
      s.car.reset();
      //}

      // Methode qui respawn tout les collectables collecter par la voiture
      if (s.coinsToRespawn.length > 0) {

        for (let i = s.coinsToRespawn.length - 1; i >= 0; i--) {
          // Fait apparaitre l'objet sur la scène
          s.addObjectToScene(s.coinsToRespawn[i], s.coinsToRespawn[i].zIndex)

          // Pousse le dernier shape modifier dans le tableau s.movableShapes
          s.movableShapes.push(s.storeShapeData(s.coinsToRespawn[i]))
        }

        s.coinsToRespawn.splice(0, s.coinsToRespawn.length)
      }

      // Méthode qui respawn tout les objets qui ont disparu suite au event du bouton rouge
      if (s.objectsToRespawn.length > 0) {

        for (let i = s.objectsToRespawn.length - 1; i >= 0; i--) {
          // Fait apparaitre l'objet sur la scène
          s.addObjectToScene(s.objectsToRespawn[i], s.objectsToRespawn[i].zIndex)

          // Pousse le dernier shape modifier dans le tableau s.movableShapes
          s.movableShapes.push(s.storeShapeData(s.objectsToRespawn[i]))
        }

        s.objectsToRespawn.splice(0, s.objectsToRespawn.length)
      }


      // Méthode qui remet tout les boutons interactifs à rouge
      for (let i = 0; i < s.movableShapes.length; i++) {
        if (s.movableShapes[i].originalShape instanceof InteractiveObject) {
          if (s.movableShapes[i].originalShape.isButton) {
            // images.red_button
            s.movableShapes[i].originalShape.setImg(images.red_button)
          }
        }
      }

      // Indique au serveur que l'éxécution a été interrompue
      playSocket.stopCompile()

      // Clear tous les timeouts de la simulation
      for (let timeout of timeouts) {
        clearTimeout(timeout);
      }

      playButton.children("img").attr("src", "/static/images/play_button.png");

      // Reset focus
      if (s.canvasCamera != null) s.canvasCamera.setTarget(null);
    }
  });
}

export default ChallengeExecutor;