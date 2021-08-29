/* eslint-disable no-labels */
import { images } from '../../Components/PlayComponents/Simulation/Sketch/simulation/assets';
import { InteractiveObject } from '../../Components/PlayComponents/Simulation/Sketch/simulation/InteractiveObject';
import { Shape } from '../../Components/PlayComponents/Simulation/Sketch/simulation/Shape';
import { Vector } from '../../Components/PlayComponents/Simulation/Sketch/simulation/Vector';
import openPlaySocket from './PlaySocket';
import $ from 'jquery';
import { PlayExecutor } from '../../Models/Executor/PlayExecutor';
import { PlaySocket } from './PlaySocket';
import { CMD } from '../../Components/PlayComponents/Cmd/cmdTypes';
import { User } from '../../Models/User/user.entity';

// TODO: robotConnected
const robotConnected = false;

class SimulationLevelExecutor implements PlayExecutor {
	public s: any;
	public playButton: JQuery;
	public socket?: PlaySocket;
	public cmd?: CMD;

	public lineInterfaceContent: string = '';

	public editorButton: any;
	public robotConnectButton: any;
	public execution: boolean = false;

	public timeouts: Array<NodeJS.Timeout> = [];

	public d1?: Shape;
	public d2?: Shape;
	public d3?: Shape;

	public sensors: { dA: number; dG: number; dD: number } = {
		dA: 0,
		dG: 0,
		dD: 0,
	};

	public levelName?: string;
	public creator?: User | undefined;

	constructor(
		creator: User | undefined,
		levelName: string,
		playButton: HTMLButtonElement,
	) {
		this.creator = creator;
		this.levelName = levelName;
		this.playButton = $(playButton);
	}

	public init(s: any) {
		this.s = s;

		this.execution = false;
		this.socket = openPlaySocket();

		this.socket.onRobotReceive((data: any) => {
			let car = s.car;

			console.log(data);

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
		});

		this.playButton.on('click', (e: any) => {
			if (!this.execution) {
				// TODO: uncomment in future
				//s.saveLevel()

				this.execution = true;
				// Envoie le code à éxécuter au serveur
				let lines: Array<string> = this.lineInterfaceContent.split('\n');
				console.log(lines);
				this.socket?.compile(lines, data => {
					console.log(data);
					let car = s.car;

					s.canvasCamera.setTarget(s.car.shape);

					const perform_action = (
						i: number,
						res: Array<any> | undefined = undefined,
					) => {
						if (res === undefined) res = [];
						const ID = 'id';
						const DODO = 'd';
						const PARAMS = 'p';

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

						if (i >= data.length) {
							this.socket?.response(res);
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
									this.timeouts.push(
										setTimeout(() => {
											perform_action(i + 1, res);
										}, dodo * 1000),
									);
									break;
								case 101:
									/*----     avancer     ----*/
									car.forward();
									this.timeouts.push(
										setTimeout(() => {
											if (dodo > 0) car.stop();
											perform_action(i + 1, res);
										}, dodo * 1000),
									);
									break;
								case 102:
									/*----     reculer     ----*/
									car.backward();
									this.timeouts.push(
										setTimeout(() => {
											if (dodo > 0) car.stop();
											perform_action(i + 1, res);
										}, dodo * 1000),
									);
									break;
								case 103:
									/*----     tourner     ----*/
									if (!robotConnected) {
										if (params.length > 0 && typeof params[0] === 'number') {
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
											car.setDirection(
												new Vector(
													params[0] / 255 - params[1] / 255,
													params[0] / 500 + params[1] / 500,
												)
													.normalize()
													.multiplyScalar(
														(params[0] / 2 + params[1] / 2) / 255,
													),
											);
										}
									} else {
										car.forward();
									}
									perform_action(i + 1, res);
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

									if (params.length > 0 && typeof params[0] === 'string') {
										this.cmd?.print(params[0]);
									}
									if (dodo === 0) perform_action(i + 1, res);
									else {
										this.timeouts.push(
											setTimeout(() => {
												perform_action(i + 1, res);
											}, dodo * 1000),
										);
									}
									break;
								case 301:
									/*----     attendre     ----*/
									if (params.length > 0 && typeof params[0] === 'number') {
										this.timeouts.push(
											setTimeout(() => {
												perform_action(i + 1, res);
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
											let input = prompt("Entrez l'input");
											res.push(input);
											perform_action(i + 1, res);
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
				});

				this.cmd?.clear();
				this.playButton
					.children('img')
					.attr('src', '/static/images/pause_button.png');

				// Ancien système obsolet pour set la target on play
				//if (s.car != null && s.canvasCamera != null) s.canvasCamera.setTarget(s.car)
			} else {
				this.execution = false;
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
						s.addObjectToScene(
							s.objectsToRespawn[i],
							s.objectsToRespawn[i].zIndex,
						);

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
							s.movableShapes[i].originalShape.setImg(images.red_button);
						}
					}
				}

				// Indique au serveur que l'éxécution a été interrompue
				this.socket?.stopCompile();

				// Clear tous les timeouts de la simulation
				for (let timeout of this.timeouts) {
					clearTimeout(timeout);
				}

				this.playButton
					.children('img')
					.attr('src', '/static/images/play_button.png');

				// Reset focus
				if (s.canvasCamera != null) s.canvasCamera.setTarget(null);
			}
		});

		try {
			// Clear la simulation au cas ou ce qu'il y a déjà des voitures ou autres
			let json_script = JSON.parse($('#leveldata').text());

			if (
				json_script == null ||
				json_script === '' ||
				json_script === '""' ||
				json_script.length < 100
			)
				throw new Error('No level loaded');
			// Génération du niveau
			//const level = s.load(json_script, s.creator);
		} catch (exception) {
			s.car = s.spawnCar(0, 0, 75, 110);

			// TODO: editor reference
			//lineInterface.setValue("# Entrer votre code ci-dessous\n\n")
		}

		if (this.creator) {
			this.spawnEditorButton();
		}
		this.spawnRobotConnectButton();
	}

	// TODO: typing events
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private reset(e: any) {
		if (e.collidingWith === this.s.car) {
			this.playButton.trigger('click');
		}
	}

	// TODO: Add event of zoom to remove s.editorButton and s.robotConnectButton from sketch.js
	//s.editorButton = null
	//s.robotConnectButton = null

	private spawnEditorButton() {
		let s = this.s;
		if (this.s) return;
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
				this.playButton.trigger('click');
			}
			s.toggleEditMode();
		});
	}

	private spawnRobotConnectButton() {
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
}

export default SimulationLevelExecutor;