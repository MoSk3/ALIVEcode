import { Car } from "./Car";
import { Shape } from "../Shape";
import { Template } from './typesSimulation';
import { SerializableShape } from './typesSimulation';
import { Vector } from '../Vector';

type TemplateNamesObstacle = 'stop' | 'fall' | 'water' | 'lava';

export class Obstacle
	extends Shape
	implements SerializableShape<TemplateNamesObstacle, Obstacle>
{
	readonly shapeType = 'Obstacle';

	readonly templateName: TemplateNamesObstacle;
	isGameOver: boolean;
	gameOverEvent?: {
		gameOverImg: string;
		message: string;
	};

	constructor(
		s: any,
		templateName: TemplateNamesObstacle,
		...points: Vector[]
	) {
		super(s, ...points);
		this.class = 'Obstacle';
		this.templateName = templateName;
		this.carInteraction = true;
	}

	override collisionFct() {
		if (!this.s.editMode && this.s.execution && !this.isGameOver) {
			this.colliding.find(collider => collider instanceof Car)?.stop(this);
		}
	}

	playGameOverEvent?() {
		if (!this.gameOverEvent?.gameOverImg || !this.gameOverEvent?.message)
			return;
		const img = this.gameOverEvent.gameOverImg;
		const message = this.gameOverEvent.message;

		$('#level-failed-modal').on('show.bs.modal', function () {
			$('#failure-cause').attr('src', img);
			$('#description').text(message ?? '');
		});

		//levelFailedModal.modal('show');
	}

	get uniqueProperties() {
		return {};
	}

	loadFromTemplate() {
		Object.assign(this, this.templates[this.templateName]);
	}

	readonly defaultTemplate: TemplateNamesObstacle = 'stop';
	readonly templates: Template<TemplateNamesObstacle, Obstacle> = {
		stop: {
			isGameOver: false,
		},

		fall: {
			isGameOver: true,
			gameOverEvent: {
				gameOverImg: '/static/images/gifs/hole.gif',
				message: 'La voiture est tombée dans un trou!',
			},
		},

		lava: {
			isGameOver: true,
			gameOverEvent: {
				gameOverImg: '/static/images/gifs/lava.gif',
				message: 'La voiture est tombée dans la lave!',
			},
		},

		water: {
			isGameOver: true,
			gameOverEvent: {
				gameOverImg: '/static/images/gifs/water_splash.gif',
				message: "La voiture est tombée dans l'eau!",
			},
		},
	};
}