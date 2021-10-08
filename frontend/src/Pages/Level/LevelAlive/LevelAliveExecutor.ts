/* eslint-disable no-labels */
import LevelCodeExecutor from '../LevelCode/LevelCodeExecutor';
import { images } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/assets';
import { InteractiveObject } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/InteractiveObject';
import { Shape } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/Shape';
import { Vector } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/Vector';
import $ from 'jquery';
import { BaseLayoutObj } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/ts/typesSimulation';
import { Serializer } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/ts/Serializer';
import { makeShapeEditable } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/editMode';
import { User } from '../../../Models/User/user.entity';

// TODO: robotConnected
const robotConnected = false;

class LevelAliveExecutor extends LevelCodeExecutor {
	public s: any;

	public editorButton: any;
	public robotConnectButton: any;

	public d1?: Shape;
	public d2?: Shape;
	public d3?: Shape;

	public sensors: { dA: number; dG: number; dD: number } = {
		dA: 0,
		dG: 0,
		dD: 0,
	};

	public loadLevelLayout(layout: BaseLayoutObj[] | {}) {
		if (JSON.stringify(layout) === '{}') {
			this.s.car = this.s.spawnCar(0, 0, 75, 110);
			console.log('AHAHA');
		} else {
			const shapes = Serializer.deserialize(this.s, layout as BaseLayoutObj[]);

			for (const [idx, shape] of Object.entries(shapes)) {
				this.s.addObjectToScene(shape, idx);
				makeShapeEditable(shape);
			}

			console.log(this.s.shapes);
		}
		if (this.creator?.id) {
			this.spawnEditorButton();
		}
		this.spawnRobotConnectButton();
	}

	public init(s: any) {
		this.s = s;

		/*this.socket.onRobotReceive((data: any) => {
			let car = s.car;

			if (process.env.DEBUG) console.log(data);

			if (this.d1 == null || this.d2 == null || this.d3 == null) {
				this.d1 = s.spawnRect(0, 0, 100, 5);
				this.d1?.setRotation(-60);
				this.d2 = s.spawnRect(0, 0, 100, 5);
				this.d3 = s.spawnRect(0, 0, 100, 5);
				this.d3?.setRotation(60);

				car.shape.addChild(this.d1);
				car.shape.addChild(this.d2);
				car.shape.addChild(this.d3);
			}

			if ('a' in data) {
				car.shape.setRotation(data['a']);
			}

			let frontOfCar = car.shape.pos
				.clone()
				.add(car.shape.forward.clone().normalize().multiplyScalar(55));
			let perpendicularFront = new Vector(frontOfCar.y, -frontOfCar.x)
				.normalize()
				.multiplyScalar(30);

			this.sensors.dA = data['2'] ?? 0;
			this.sensors.dG = data['1'] ?? 0;
			this.sensors.dD = data['3'] ?? 0;

			this.d1?.setPos(frontOfCar.clone().substract(perpendicularFront), false);
			this.d2?.setPos(frontOfCar.clone(), false);
			this.d3?.setPos(frontOfCar.clone().add(perpendicularFront), false);

			this.d1?.moveInDirection(
				this.d1.forward?.normalize(),
				this.sensors.dG * 7,
				false,
			);
			this.d2?.moveInDirection(
				this.d2.forward?.normalize(),
				this.sensors.dA * 7,
				false,
			);
			this.d3?.moveInDirection(
				this.d3.forward?.normalize(),
				this.sensors.dD * 7,
				false,
			);
		});*/

		//try {
		//	// Clear la simulation au cas ou ce qu'il y a déjà des voitures ou autres
		//	let json_script = JSON.parse($('#leveldata').text());
		//
		//	if (
		//		json_script == null ||
		//		json_script === '' ||
		//		json_script === '""' ||
		//		json_script.length < 100
		//	)
		//		throw new Error('No level loaded');
		//	// Génération du niveau
		//	//const level = s.load(json_script, s.creator);
		//} catch (exception) {
		//	s.car = s.spawnCar(0, 0, 75, 110);
		//
		//	// TODO: editor reference
		//	//lineInterface.setValue("# Entrer votre code ci-dessous\n\n")
		//}
	}

	public onStop() {
		if (!this.s) return;
		const s = this.s;

		//if(!robotConnected) {
		s.car.reset();
		//}

		// Methode qui respawn tout les collectables collecter par la voiture
		if (s.coinsToRespawn.length > 0) {
			for (let i = s.coinsToRespawn.length - 1; i >= 0; i--) {
				// Fait apparaitre l'objet sur la scène
				s.addObjectToScene(s.coinsToRespawn[i], s.coinsToRespawn[i].zIndex);

				// Pousse le dernier shape modifier dans le tableau s.movableShapes
				s.movableShapes.push(s.storeShapeData(s.coinsToRespawn[i]));
			}

			s.coinsToRespawn.splice(0, s.coinsToRespawn.length);
		}

		// Méthode qui respawn tout les objets qui ont disparu suite au event du bouton rouge
		if (s.objectsToRespawn.length > 0) {
			for (let i = s.objectsToRespawn.length - 1; i >= 0; i--) {
				// Fait apparaitre l'objet sur la scène
				s.addObjectToScene(s.objectsToRespawn[i], s.objectsToRespawn[i].zIndex);

				// Pousse le dernier shape modifier dans le tableau s.movableShapes
				s.movableShapes.push(s.storeShapeData(s.objectsToRespawn[i]));
			}

			s.objectsToRespawn.splice(0, s.objectsToRespawn.length);
		}

		// Méthode qui remet tout les boutons interactifs à rouge
		for (let i = 0; i < s.movableShapes.length; i++) {
			if (s.movableShapes[i].originalShape instanceof InteractiveObject) {
				if (s.movableShapes[i].originalShape.isButton) {
					// images.red_button
					s.movableShapes[i].originalShape.setImg(images.red_button_unpressed);
				}
			}
		}

		// Clear tous les timeouts de la simulation
		for (let timeout of this.timeouts) {
			clearTimeout(timeout);
		}

		// Reset focus
		if (s.canvasCamera != null) s.canvasCamera.setTarget(null);
	}

	public async onRun() {
		//this.s.canvasCamera.setTarget(this.s.car.shape);
		super.onRun();
	}

	public execute(data: any) {
		if (!this.s) return;
		const s = this.s;

		const res: any = [];
		const ID = 'id';
		const DODO = 'd';
		const PARAMS = 'p';

		const angleDroit = 90;
		const car = s.car;
		console.log(car);

		s.canvasCamera.setTarget(s.car.shape);
		console.log(s.canvasCamera);

		const validDataStructure = (action: any) => {
			return (
				ID in action &&
				typeof action[ID] === 'number' &&
				DODO in action &&
				typeof action[DODO] === 'number' &&
				PARAMS in action &&
				Array.isArray(action[PARAMS])
			);
		};

		const perform_action = (i: number) => {
			if (i >= data.length) {
				return;
			}
			const action = data[i];
			if (validDataStructure(action)) {
				if (action[DODO] < 0) action[DODO] = 0;

				const { [DODO]: dodo, [ID]: id, [PARAMS]: params } = action;

				// Traite l'action a effectuée envoyée par le serveur
				id_switch: switch (id) {
					/*
                                ----    UTILITAIRES    ----
                        */
					/*
                                      ----    VOITURE    ----
                              */
					case 100:
						/*----     arreter     ----*/
						car.stop();
						this.timeouts.push(
							setTimeout(() => {
								perform_action(i + 1);
							}, dodo * 1000),
						);
						break;
					case 101:
						/*----     avancer     ----*/
						car.forward();
						this.timeouts.push(
							setTimeout(() => {
								if (dodo > 0) car.stop();
								perform_action(i + 1);
							}, dodo * 1000),
						);
						break;
					case 102:
						/*----     reculer     ----*/
						car.backward();
						this.timeouts.push(
							setTimeout(() => {
								if (dodo > 0) car.stop();
								perform_action(i + 1);
							}, dodo * 1000),
						);
						break;
					case 103:
						/*----     tourner     ----*/
						if (!robotConnected) {
							if (params.length > 0 && typeof params[0] === 'number') {
								car.turn(-params[0], () => {
									perform_action(i + 1);
								});
							}
						} else {
							perform_action(i + 1);
						}
						break;
					case 104:
						/*----     tournerDroite     ----*/
						if (!robotConnected) {
							car.turn(angleDroit, () => {
								perform_action(i + 1);
							});
						} else {
							let goal = (car.shape.rotation.x + angleDroit) % 360;
							let interval = setInterval(() => {
								if (Math.abs(goal - car.shape.rotation.x) <= 0.5) {
									clearInterval(interval);
									perform_action(i + 1);
								}
							});
						}
						break;
					case 105:
						/*----     tournerGauche     ----*/
						if (!robotConnected) {
							car.turn(-angleDroit, () => {
								perform_action(i + 1);
							});
						} else {
							let goal = (car.shape.rotation.x - angleDroit) % 360;
							let interval = setInterval(() => {
								if (Math.abs(goal - car.shape.rotation.x) <= 0.5) {
									clearInterval(interval);
									perform_action(i + 1);
								}
							}, 50);
						}
						break;
					case 106:
						/*----     rouler     ----*/
						if (!robotConnected) {
							if (params.length >= 2) {
								car.setDirection(
									new Vector(
										params[0] / 255 - params[1] / 255,
										params[0] / 500 + params[1] / 500,
									)
										.normalize()
										.multiplyScalar((params[0] / 2 + params[1] / 2) / 255),
								);
							}
						} else {
							car.forward();
						}
						perform_action(i + 1);
						break;
					case 107:
						/*----     goToAngle     ----*/
						if (!robotConnected) {
							if (params.length > 0 && typeof params[0] === 'number') {
								const currentAngle = car.shape.rotation.x;
								let angle = params[0] % 360;
								angle = angle < 0 ? 360 - angle : angle;
								angle = 360 - angle;
								var rotationAmount: number;
								if (
									360 - currentAngle - angle < 180 &&
									360 - currentAngle - angle >= 0
								)
									rotationAmount = -(360 - currentAngle - angle);
								else rotationAmount = -(360 - angle - currentAngle);
								car.turn(rotationAmount, () => {
									perform_action(i + 1);
								});
							}
						} else {
							perform_action(i + 1);
						}
						break;
					/*
                                      ----    UTILITAIRES    ----
                              */
					case 300:
						/*----     print     ----*/

						if (params.length > 0 && typeof params[0] === 'string') {
							this.cmd?.print(params[0]);
						}
						if (dodo === 0) perform_action(i + 1);
						else {
							this.timeouts.push(
								setTimeout(() => {
									perform_action(i + 1);
								}, dodo * 1000),
							);
						}
						break;
					case 301:
						/*----     attendre     ----*/
						if (params.length > 0 && typeof params[0] === 'number') {
							this.timeouts.push(
								setTimeout(() => {
									perform_action(i + 1);
								}, params[0] * 1000),
							);
						}
						break;
					/*
                                      ----    GET    ----
                              */
					case 500:
						switch (params[0]) {
							case 'read': {
								/*----     lire     ----*/
								let input = prompt(params[1]);
								res.push(input);
								perform_action(i + 1);
								// eslint-disable-next-line no-labels
								break id_switch;
							}

							case 'car': {
								/*----     voiture     ----*/
								const infosCar = {
									x: car.shape.pos.x,
									y: car.shape.pos.y,
									dA: this.sensors.dA,
									dG: this.sensors.dG,
									dD: this.sensors.dD,
									speed: car.speed,
								};
								res.push(infosCar);
								if (process.env.DEBUG) console.log(res);
								perform_action(i + 1);
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
						perform_action(i + 1);
						break;
				}

				/*
                            ----    ERREURS    ----
                    */
				if (id.toString()[0] === '4') {
					if (
						params.length > 1 &&
						typeof params[0] === 'string' &&
						typeof params[2] === 'number'
					) {
						this.cmd?.error(params[0] + ': ' + params[1], params[2]);
					}
				}
			}
		};

		// Check si le data est valide
		if (Array.isArray(data) && data.length > 0) {
			perform_action(0);
		}
		return res;
	}

	// TODO: typing events
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private reset(e: any) {
		if (!this.s) return;
		if (e.collidingWith === this.s.car) {
			//this.playButton.trigger('click');
		}
	}

	// TODO: Add event of zoom to remove s.editorButton and s.robotConnectButton from sketch.js
	//s.editorButton = null
	//s.robotConnectButton = null

	private spawnEditorButton() {
		if (!this.s) return;
		const s = this.s;
		this.editorButton = s.spawnFixedRect(
			s.width / 2 - 35,
			-s.height / 2 + 95,
			50,
			50,
			5000,
		);
		// images.tools
		this.editorButton.setImg(images.animatedCar);
		this.editorButton.color = s.color(0, 0);
		this.editorButton.onHover((e: any) => {
			s.strokeWeight(1);
			this.editorButton.strokeColor = 'red';
		});
		this.editorButton.onClick((e: any) => {
			if (this.execution) {
				//this.playButton.trigger('click');
			}
			s.toggleEditMode();
		});
	}

	private spawnRobotConnectButton() {
		if (!this.s) return;
		this.robotConnectButton = this.s.spawnFixedRect(
			this.s.width / 2 - 35,
			-this.s.height / 2 + 35,
			50,
			50,
			1000,
		);
		this.robotConnectButton.setImg(images.animatedCar);
		this.robotConnectButton.color = this.s.color(0, 0);
		this.robotConnectButton.onHover((e: any) => {
			this.s.strokeWeight(1);
			this.robotConnectButton.strokeColor = '#0177bc';
		});

		// TODO: fix connect modal
		this.robotConnectButton.onClick((e: any) => {
			//connectModal.modal('show')
		});
	}

	public saveLayout(s: any) {
		const shapes = Object.entries(s.shapes)?.flatMap(
			([_, shape]) => shape,
		) as Shape[];

		if (shapes === undefined) return null;

		return Serializer.serialize(shapes);
	}
}

export default LevelAliveExecutor;