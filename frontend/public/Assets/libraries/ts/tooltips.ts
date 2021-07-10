type Annotation = {
    text: string[]
}

function addToolTip(annotation: Annotation) {
    editor.renderer.$gutterLayer.$annotations?.push(annotation);
}