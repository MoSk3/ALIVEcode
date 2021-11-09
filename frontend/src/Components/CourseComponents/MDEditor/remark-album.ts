/**
 * ALBUM
 * (AL)ive (B)eautiful (U)timate (M)arkdown
 */

import { albumOptionsType, underlineOptions } from './albumTypes';
import { visit, Parent } from 'unist-util-visit';
import { is } from 'unist-util-is';
import { Root, Text, PhrasingContent } from 'mdast';

export interface Underline extends Parent {
	type: 'underline';
	children: PhrasingContent[];
}

type extendedPhrasingContent = PhrasingContent | Underline;

export namespace remarkAlbum {
	export const underline = (options: underlineOptions = {}) => {
		const underlineRegex = /\|.*?\|/gm;
		return (tree: Root) => {
			//visit(tree, (node: Node) => console.log(node));
			visit(tree, 'paragraph', node => {
				const children = [...node.children];

				for (const [idx, child] of children.entries()) {
					console.log(child);
					if (is(child, 'text')) {
						const childText = (child as Text).value;

						let currentChild: Text = child as Text;

						for (const underlineElement of childText.matchAll(underlineRegex)) {
							currentChild.value = currentChild.value.substring(
								0,
								underlineElement.index,
							);
							(node.children as extendedPhrasingContent[]).splice(idx, 2, {
								type: 'underline',
								children: [
									{
										type: 'text',
										value: underlineElement[0].substring(
											1,
											underlineElement[0].length - 1,
										),
									},
								],
							});
						}
					}
				}
			});
		};
	};
}
