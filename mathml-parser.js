/**
 * Parses MathML Element.
 * @param {Element} mmlElem MathML element parsed using MathML.
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
        if (Math[child.textContent]) {
          result += 'Math.' + child.textContent;
        } else if (child.textContent === 'π') {
          result += 'Math.PI';
        } else if (child.textContent === 'e') {
          reslt += 'Math.E';
        } else {
          result += child.textContent;
        }
        break;
      case 'msup': {
        let childNodesForSup = Array.from(child.childNodes);
        const superscriptElem = childNodesForSup.pop();
        const superscript = MathMLElementToJS(superscriptElem);
        const baseElem = childNodesForSup.pop();
        const base = MathMLElementToJS(baseElem);
        result += `${base} ** ${superscript}`;
        break;
      }
      case 'mrow':
        result += MathMLElementToJS(child);
        break;
      case 'msqrt': {
        const sqrtInside = MathMLElementToJS(child);
        result += `Math.sqrt(${sqrtInside})`;
        break;
      }
      case 'mroot': {
        let childNodesForRoot = Array.from(child.childNodes);
        const indexElem = childNodesForRoot.pop();
        const index = MathMLElementToJS(indexElem);
        const baseElem = childNodesForRoot.pop();
        const base = MathMLElementToJS(baseElem);
        result += `${base} ** (1 / ${index})`;
      }
      default:
        break;
    }
  });
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
let MathMLString =
`<math xmlns="http://www.w3.org/1998/Math/MathML">
  <msqrt>
    <mn>2</mn>
  </msqrt>
  <mo>+</mo>
  <msqrt>
    <mn>3</mn>
  </msqrt>
  <mo>+</mo>
  <msup>
    <mi>e</mi>
    <mi>x</mi>
  </msup>
</math>`;
let JSResult = MathMLStringToJS(MathMLString);
console.log(JSResult);