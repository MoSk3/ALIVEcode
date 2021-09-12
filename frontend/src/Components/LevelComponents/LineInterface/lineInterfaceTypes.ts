import styled from 'styled-components';
export type LineInterfaceProps = {
	handleChange: (content: any) => void;
	hasTabs?: boolean;
	tabs?: EditorTabModel[];
	content?: string;
};

export type EditorTabModel = {
	title: string;
	open: boolean;
	loaded?: boolean;
	defaultContent?: string;
	content?: string;
	onChange?: (content: string) => void;
};

export const StyledLineInterface = styled.div`
	flex: 1 1 auto;

	.hidden-editor {
		display: none;
	}

	.ace-editor {
		font-size: large;
	}

	.ace-alive .ace_gutter {
		background: var(--primary-color);
		color: var(--foreground-color);
	}
	/*.ace-alive .ace_print-margin {
width: 1px;
background: #002e66
}*/
	.ace-alive {
		background-color: black;
		color: var(--foreground-color);
	}
	.ace-alive .ace_scroller {
		background-color: rgba(var(--primary-color-rgb), 0.8);
		color: var(--foreground-color);
	}
	.ace-alive .ace_cursor {
		color: var(--foreground-color);
	}
	.ace-alive .ace_marker-layer .ace_selection {
		background: #5b8bc7;
	}
	.ace-alive.ace_multiselect .ace_selection.ace_start {
		box-shadow: 0 0 3px 0px #272822;
	}
	.ace-alive .ace_marker-layer .ace_step {
		background: rgb(102, 82, 0);
	}
	.ace-alive .ace_marker-layer .ace_bracket {
		margin: -1px 0 0 -1px;
		border: 1px solid #49483e;
	}
	.ace-alive .ace_marker-layer .ace_active-line {
		background: rgba(var(--primary-color-rgb), 1);
	}
	.ace-alive .ace_gutter-active-line {
		background-color: var(--contrast-color);
	}
	.ace-alive .ace_marker-layer .ace_selected-word {
		border: 1px solid #49483e;
	}
	.ace-alive .ace_invisible {
		color: #52524d;
	}
	.ace-alive .ace_entity.ace_name.ace_tag,
	.ace-alive .ace_keyword,
	.ace-alive .ace_meta.ace_tag,
	.ace-alive .ace_storage {
		color: #f92672;
	}
	.ace-alive .ace_punctuation,
	.ace-alive .ace_punctuation.ace_tag {
		color: var(--foreground-color);
	}
	.ace-alive .ace_constant.ace_character,
	.ace-alive .ace_constant.ace_language,
	.ace-alive .ace_constant.ace_numeric,
	.ace-alive .ace_constant.ace_other {
		color: #ae81ff;
	}
	.ace-alive .ace_invalid {
		color: var(--foreground-color);
		background-color: #f92672;
	}
	.ace-alive .ace_invalid.ace_deprecated {
		color: var(--foreground-color);
		background-color: #ae81ff;
	}
	.ace-alive .ace_support.ace_constant,
	.ace-alive .ace_support.ace_function {
		color: #66d9ef;
	}
	.ace-alive .ace_fold {
		background-color: #a6e22e;
		border-color: var(--foreground-color);
	}
	.ace-alive .ace_support.ace_class {
		color: #fd971f;
	}
	.ace-alive .ace_storage.ace_type,
	.ace-alive .ace_support.ace_type {
		font-style: italic;
		color: #66d9ef;
	}
	.ace-alive .ace_entity.ace_name.ace_function,
	.ace-alive .ace_entity.ace_other,
	.ace-alive .ace_entity.ace_other.ace_attribute-name,
	.ace-alive .ace_variable {
		color: #a6e22e;
	}
	.ace-alive .ace_variable.ace_parameter {
		font-style: italic;
		color: #fd971f;
	}
	.ace-alive .ace_string {
		color: #e6db74;
	}
	.ace-alive .ace_comment {
		color: #fffb40;
	}
	.ace-alive .ace_indent-guide {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC)
			right repeat-y;
	}
`;