/**
 * Parses MathML Element.
 * @param {MathMLElement} mmlElem MathML element parsed using MathML.
 * @returns {string}
 */
function MathMLElementToJS(mmlElem) {
  let result = '';
  const childNodes = Array.from(mmlElem.childNodes);
  childNodes.forEach((child) => {
    if (child.nodeType === 3) return;
    const childName = child.nodeName.toLowerCase();
    switch (childName) {
      case 'mn':
        result += child.nodeValue;
        break;
      case 'mo':
        result += ` ${child.nodeValue} `;
        break;
      case 'mi':
        result += child.nodeValue;
        break;
      case 'msup':
        let childNodesForSup = Array.from(child.childNodes);
        const exponent = childNodesForSup.pop();
        const base = childNodesForSup.pop();
        result += `Math.pow(${base}, ${exponent})`;
        break;
      case 'mrow':
        break;
      default:
        break;
    }
  });
}
function MathMLStringToJS(mml) {
  const parser = new DOMParser();
  let mmlElem = parser.parseFromString(mml, 'text/xml');
  return MathMLElementToJS(mmlElem);
}