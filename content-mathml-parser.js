/**
 * MathML 토큰 처리
 * @param {MathMLElement} mmlElem 처리할 MathML 요소
 */
function contentMathMLElementToJS(mmlElem) {
  const binMaps = {
    plus: "+", times: "*", divide: "/", power: "**",
    eq: "==", neq: "!=", gt: ">", lt: "<", geq: ">=", neq: "<=",
    and: "&&", or: "||"
  }
  const operatorMaps = {
    sin: "sin", cos: "cos", tan: "tan",
    arcsin: "arcsin", arccos: "arccos", arctan: "arctan",
    ln: "log", log: "log10", floor: "floor", ceiling: "ceil", abs: "abs",
    min: "min", max: "max"
  }
  const nodeName = mmlElem.nodeName;
  if (nodeName == 'ci' || nodeName == 'cn' || nodeName == 'exponentiale' || nodeName == 'pi') {
    let nodeResult = mmlElem.innerHTML;
    if (mmlElem.nodeName == 'ci') {
      if (nodeName == 'pi') nodeResult = 'Math.PI'
      else if (nodeName == 'exponentiale') nodeResult = 'Math.E';
    } else if (mmlElem.nodeName == 'cn' && nodeResult.startsWith('-'))
      nodeResult = `(-${nodeResult})`;
    return nodeResult;
  } else if (mmlElem.nodeName == 'math') {
    return contentMathMLElementToJS(Array.from(mmlElem.children)[0]);
  } else if (mmlElem.nodeName == 'piecewise') {
    let args = Array.from(mmlElem.children);
    args = args.map(contentMathMLElementToJS);
    return '(' + args.join(' : ') + ' : undefined)'
  } else if (mmlElem.nodeName == 'piece') {
    let args = Array.from(mmlElem.children);
    args = args.map(contentMathMLElementToJS);
    return args[1] + ' ? ' + args[0]
  } else if (mmlElem.nodeName == 'apply') {
    const operator = mmlElem.firstChild.nodeName;
    let args = Array.from(mmlElem.children);
    args.shift();
    args = args.map(contentMathMLElementToJS);
    if (operator == 'minus') {
      if (args.length == 2)
        return `(${args[0]} - ${args[1]})`;
      else if (args.length == 1)
        return `(-${args[0]})`;
      else throw new Error('Not implemented yet');
    } else if (Object.keys(binMaps).includes(operator)) {
      return `(${args[0]} ${binMaps[operator]} ${args[1]})`;
    } else if (operator == 'root') {
      if (args.length == 1)
        return `Math.sqrt(${args[0]})`;
      else throw new Error('Not implemented yet');
    } else if (operator == 'not') {
      return `(!(${args[0]}))`;
    } else if (Object.keys(operatorMaps).includes(operator)) {
      return `Math.${operatorMaps[operator]}(${args.join(', ')})`;
    } else {
      return `${operator}(${args.join(', ')})`;
    }
  }
}
function contentMathMLStringToJS(mml) {
  const parser = new DOMParser();
  let mmlElem = parser.parseFromString(mml, 'text/xml').documentElement;
  const errorElement = mmlElem.querySelector('parsererror');
  if (errorElement) {
    throw new Error(errorElement.innerText);
  }
  return contentMathMLElementToJS(mmlElem);
}