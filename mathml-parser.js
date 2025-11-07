/**
 * Parses MathML Element.
 * @param {MathMLElement} mmlElem MathML element parsed using MathML.
 */
function MathMLElementToJS(mmlElem, parent = "") {
  let result = '';
  const structElem = ['math', 'mrow', 'msqrt'];
  const textElem = ['mn', 'mo', 'mi'];
  /**
   * Snippet to JavaScript.
   * @param {Node} child Child to iterate.
   */
  const snippetToJS = (child) => {
    if (child.nodeType === 3) return;
    const childName = child.nodeName.toLowerCase();
    switch (childName) {
      case 'mn':
        result += child.textContent;
        break;
      case 'mo':
        if (child.form === 'infix' || child.form === 'postfix') {
          result += child.textContent;
        } else if (child.separator === 'true') {
          result += child.textContent + ' ';
        } else {
          result += ` ${child.textContent} `;
        }
        break;
      case 'mi':
        if (child.textContent === 'π') {
          result += 'Math.PI';
        } else if (child.textContent === 'e') {
          result += 'Math.E';
        } else if (Math[child.textContent]) {
          result += 'Math.' + child.textContent;
        } else {
          result += child.textContent;
        }
        break;
      case 'msup': {
        let childNodesInner = Array.from(child.childNodes);
        if (childNodesInner.at(-1).nodeType === 3) childNodesInner.pop();
        const elem2 = childNodesInner.pop();
        const val2 = MathMLElementToJS(elem2, 'msup');
        if (childNodesInner.at(-1).nodeType === 3) childNodesInner.pop();
        const elem1 = childNodesInner.pop();
        const val1 = MathMLElementToJS(elem1, 'msup');
        result += `(${val1} ** ${val2})`;
        break;
      }
      case 'mfrac': {
        let childNodesInner = Array.from(child.childNodes);
        if (childNodesInner.at(-1).nodeType === 3) childNodesInner.pop();
        const elem2 = childNodesInner.pop();
        const val2 = MathMLElementToJS(elem2, 'mfrac');
        if (childNodesInner.at(-1).nodeType === 3) childNodesInner.pop();
        const elem1 = childNodesInner.pop();
        const val1 = MathMLElementToJS(elem1, 'mfrac');
        result += `(${val1} / ${val2})`;
        break;
      }
      case 'mrow':
        result += `(${MathMLElementToJS(child, 'mrow')})`;
        break;
      case 'msqrt': {
        result += `Math.sqrt(${MathMLElementToJS(child, 'msqrt')})`;
        break;
      }
      case 'mroot': {
        let childNodesInner = Array.from(child.childNodes);
        if (childNodesInner.at(-1).nodeType === 3) childNodesInner.pop();
        const elem2 = childNodesInner.pop();
        const val2 = MathMLElementToJS(elem2, 'mroot');
        if (childNodesInner.at(-1).nodeType === 3) childNodesInner.pop();
        const elem1 = childNodesInner.pop();
        const val1 = MathMLElementToJS(elem1, 'mroot');
        result += `(${val1} ** (1 / ${val2}))`;
        break;
      }
      default:
        break;
    }
  };
  const childNameOuter = mmlElem.nodeName.toLowerCase();
  if (structElem.includes(childNameOuter) && !structElem.includes(parent) && !textElem.includes(parent) {
    const childNodes = Array.from(mmlElem.childNodes);
    childNodes.forEach(snippetToJS);
  } else {
    snippetToJS(mmlElem);
  }
  return result;
}
function MathMLStringToJS(mml) {
  const parser = new DOMParser();
  let mmlElem = parser.parseFromString(mml, 'text/xml').documentElement;
  const errorElement = mmlElem.querySelector('parsererror');
  if (errorElement) {
    throw new Error(errorElement.innerText);
  }
  return MathMLElementToJS(mmlElem);
}
