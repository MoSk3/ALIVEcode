/* eslint-disable no-labels */
import LevelCodeExecutor from '../LevelCode/LevelCodeExecutor';
import { images } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/assets';
import { Shape } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/Shape';
import { Vector } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/Vector';
import { BaseLayoutObj } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/ts/typesSimulation';
import { Serializer } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/ts/Serializer';
import { makeShapeEditable } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/editMode';
import { User } from '../../../Models/User/user.entity';
import { PlaySocket } from '../PlaySocket';

// TODO: robotConnected
const robotConnected = false;

class LevelAliveExecutor extends LevelCodeExecutor {
	public s: any;

	public editorButton: any;
	public robotConnectButton: any;
	public playSocket: PlaySocket | null;

	public d1?: Shape;
	public d2?: Shape;
	public d3?: Shape;

	public sensors: { dA: number; dG: number; dD: number } = {
		dA: 0,
		dG: 0,
		dD: 0,
	};

	constructor(
		levelName: string,
		private editMode: boolean,
		playSocket: PlaySocket | null,
		creator?: User,
	) {
		super(levelName, creator);
		this.playSocket = playSocket;
	}

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

			if (process.env.REACT_APP_DEBUG) console.log(this.s.shapes);
		}
		if (this.creator && this.editMode) {
			this.spawnEditorButton();
		}
		this.spawnRobotConnectButton();
	}

	public init(s: any) {
		this.s = s;
	}

	public onStop() {
		if (!this.s) return;
		const s = this.s;

		this.playSocket && this.playSocket.stopCompile();
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
		for (const interactiveShape of s.interactiveObjects) {
			if (interactiveShape.isButton) {
				// images.red_button
				interactiveShape.setImg(images.red_button_unpressed);
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

		s.canvasCamera.setTarget(s.car.shape);

		this.playSocket && this.playSocket.compile(data);

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
		this.editorButton.setImg(images.tools);
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
			this.s.onConnectCar && this.s.onConnectCar();
		});
	}

	public saveLayout(s: any) {
		const shapes = Object.entries(s.shapes)
			?.sort(([z_idx1], [z_idx2]) => Number(z_idx1) - Number(z_idx2))
			.flatMap(([_, shape]) => shape) as Shape[];

		if (shapes === undefined) return null;

		return Serializer.serialize(shapes);
	}
}

export default LevelAliveExecutor;