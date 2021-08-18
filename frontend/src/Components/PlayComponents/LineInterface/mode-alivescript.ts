import ace from "react-ace/lib/ace";

ace.define(
	'ace/mode/alivescript',
	[
		'require',
		'exports',
		'ace/lib/oop',
		'ace/mode/text',
		'ace/mode/as_highlight_rules',
	],
	(acequire: any, exports: any) => {
		const oop = acequire('ace/lib/oop');
		const TextMode = acequire('ace/mode/text').Mode;
		const CustomHighlightRules = acequire(
			'ace/mode/as_highlight_rules',
		).CustomHighlightRules;

		var Mode = function (this: any) {
			this.HighlightRules = CustomHighlightRules;
		};

		oop.inherits(Mode, TextMode); // ACE's way of doing inheritance

		exports.Mode = Mode; // eslint-disable-line no-param-reassign
	},
);

// This is where we really create the highlighting rules
ace.define(
	'ace/mode/simplifie_highlight_rules',
	['require', 'exports', 'ace/lib/oop', 'ace/mode/text_highlight_rules'],
	(acequire: any, exports: any) => {
		const oop = acequire('ace/lib/oop');
		const TextHighlightRules = acequire(
			'ace/mode/text_highlight_rules',
		).TextHighlightRules;

		const CustomHighlightRules = function CustomHighlightRules(this: any) {
			//this.$rules = new TextHighlightRules().getRules(); // Use Text's rules as a base
			var identifierRe =
				'[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*';
			const reserved_words = {
				boucles: [
					'\\brepeter\\b',
					'\\bfaire\\b',
					'\\btant que\\b',
					'\\bpour\\b',
					'\\bsi\\b',
					'\\bsinon\\b',
					'\\.\\.\\.',
					'\\bbond\\b',
					'\\bdans\\b',
					'\\bconst\\b',
				],
				fonctions: [
					'\\bstructure\\b',
					'\\bfonction\\b',
					'\\bset\\b',
					'\\bget\\b',
				],
				fonctions_built_in: [
					'\\baleatoire\\b',
					'\\btypeDe\\b',
					'\\binfo\\b',

					// liste
					'\\bmap\\b',
					'\\bfiltrer\\b',
					'\\bsomme\\b',
					'\\bmax\\b',
					'\\bmin\\b',
					'\\bunir\\b',
					'\\bjoindre\\b',

					// iterable (liste + texte)
					'\\binverser\\b',
					'\\btailleDe\\b',

					// texte
					'\\bmaj\\b',
					'\\bminus\\b',
					'\\bestNumerique\\b',
					'\\bformat\\b',
					'\\bsep\\b',

					// nombre (entier + decimal)
					'\\bbin\\b',
				],
				fin_fonctions: [
					'\\bfin fonction\\b',
					'\\bfin structure\\b',
					'\\bfin set\\b',
					'\\bfin get\\b',
				],
				fin_structures: [
					'\\bfin pour\\b',
					'\\bfin si\\b',
					'\\bfin tant que\\b',
					'\\bfin repeter\\b',
				],
				commands: [
					'\\bavancer\\b',
					'\\breculer\\b',
					'\\bdroite\\b',
					'\\bgauche\\b',
					'\\barreter\\b',
					'\\blire dans\\b',
					'\\bafficher\\b',
					'\\battendre\\b',
					'\\butiliser\\b',
					'\\bvar\\b',
				],
				autres: ['\\bretourner\\b', '\\bsortir\\b', '\\bcontinuer\\b'],
				datatypes: [
					'\\bentier\\b',
					'\\bdecimal\\b',
					'\\btexte\\b',
					'\\bbooleen\\b',
					'\\bliste\\b',
					'\\bfonctionType\\b',
					'\\bnulType\\b',
					'\\bnombre\\b',
					'\\btout\\b',
					'\\biterable\\b',
				],
				logiques: ['\\bet\\b', '\\bou\\b', '\\bpas\\b'],
			};

			this.$rules = {
				start: [
					{
						token: 'empty',
						regex: '',
						next: 'main',
					},
				],
				main: [
					{
						token: 'variable.language',
						regex: reserved_words['commands'].join('|'),
					},
					{
						token: 'support.function',
						regex: reserved_words['fonctions'].join('|'),
						next: 'fonction_arguments',
					},
					{
						token: 'keyword.control',
						regex: reserved_words['fin_structures'].join('|'),
					},
					{
						token: 'keyword.control',
						regex: reserved_words['boucles'].join('|'),
					},
					{
						token: 'keyword.operator',
						regex: reserved_words['logiques'].join('|'),
					},
					{
						token: 'support.function',
						regex: reserved_words['fin_fonctions'].join('|'),
					},
					{
						token: 'variable.parameter',
						regex: reserved_words['datatypes'].join('|'),
					},
					{
						token: 'keyword.control.bold',
						regex: reserved_words['autres'].join('|'),
					},
					{
						token: 'support.class',
						regex: '\\bvrai\\b|\\bfaux\\b',
					},
					{
						token: 'support.function.italic',
						regex: reserved_words['fonctions_built_in'].join('|'),
					},
					{
						token: function (name: string, parenthesis: string) {
							if (reserved_words['fonctions_built_in'].includes(name))
								return ['support.function.italic', 'empty'];
							else return ['support.function', 'empty'];
						},
						regex: '(\\w+\\s*)(\\((?=.*\\)))',
					},
					{
						token: 'support.class',
						regex: '\\bnul\\b',
					},
					{
						token: 'empty',
						regex: /[a-zA-Z_](\w+)?/,
					},
					{
						token: 'constant.numeric',
						regex:
							/\d+\.\d+|\d+\.(?!\.)|(?<!\.)\.\d+|-?\d+\.\d+|-?\d+\.(?!\.)|-?(?<!\.)\.\d+|-?\d+/,
					},
					{
						token: 'string.double',
						regex: /(".*?")|('.*?')/,
					},
					{
						token: 'comment.line',
						regex: '#.*',
					},
					{
						token: 'comment.line',
						regex: /\(:/,
						next: 'multi_line_comment',
					},
					{
						token: 'keyword',
						regex: '\\s+',
					},
				],
				multi_line_comment: [
					{
						token: 'comment.line',
						regex: /.*:\)/,
						next: 'main',
					},
					{
						token: 'comment.line',
						regex: '.*',
					},
				],
				fonction_arguments: [
					{
						token: 'empty',
						regex: identifierRe,
					},
					{
						token: 'punctuation.operator',
						regex: '(, )+',
					},
					{
						token: 'empty',
						regex: '(.*?)',
						next: 'main',
					},
				],
			};
		};
		//$(document).ready(() => {
		//	ace.addKeyboardHandler(autocomplete, 0);
		//});
		oop.inherits(CustomHighlightRules, TextHighlightRules);
		exports.CustomHighlightRules = CustomHighlightRules;
	},
);

export {};