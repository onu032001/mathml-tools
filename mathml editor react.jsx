import React, { useState, useEffect, useRef } from 'react';
import { 
  Square, 
  Divide, 
  ChevronUp, 
  MoreHorizontal, 
  Trash2, 
  Copy, 
  Plus, 
  Minus, 
  X, 
  Equal,
  ArrowRight
} from 'lucide-react';

const MathEditor = () => {
  const [mathmlContent, setMathmlContent] = useState('<math xmlns="http://www.w3.org/1998/Math/MathML">\n  <mfrac>\n    <mi>x</mi>\n    <mn>2</mn>\n  </mfrac>\n  <mo>=</mo>\n  <mi>y</mi>\n</math>');
  const [copied, setCopied] = useState(false);
  const previewRef = useRef(null);

  // MathML templates
  const templates = {
    fraction: '<mfrac>\n  <mi>a</mi>\n  <mi>b</mi>\n</mfrac>',
    superscript: '<msup>\n  <mi>x</mi>\n  <mn>2</mn>\n</msup>',
    subscript: '<msub>\n  <mi>x</mi>\n  <mi>i</mi>\n</msub>',
    root: '<msqrt>\n  <mi>x</mi>\n</msqrt>',
    integral: '<mo>∫</mo>',
    sum: '<mo>∑</mo>',
    alpha: '<mi>α</mi>',
    beta: '<mi>β</mi>',
    pi: '<mi>π</mi>',
    plus: '<mo>+</mo>',
    minus: '<mo>-</mo>',
    times: '<mo>×</mo>',
    divide: '<mo>÷</mo>',
    equals: '<mo>=</mo>'
  };

  const insertTemplate = (templateKey) => {
    const template = templates[templateKey];
    // Simple insertion logic: insert before the closing </math> tag
    const lines = mathmlContent.split('\n');
    const closingTagIndex = lines.findIndex(line => line.trim() === '</math>');
    
    if (closingTagIndex !== -1) {
      const newLines = [...lines];
      newLines.splice(closingTagIndex, 0, `  ${template}`);
      setMathmlContent(newLines.join('\n'));
    }
  };

  const handleCopy = () => {
    document.execCommand('copy'); // Using legacy as per instructions for iFrame stability
    const textArea = document.createElement("textarea");
    textArea.value = mathmlContent;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed');
    }
    document.body.removeChild(textArea);
  };

  const clearEditor = () => {
    setMathmlContent('<math xmlns="http://www.w3.org/1998/Math/MathML">\n\n</math>');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Plus className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">MathML Editor</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-all text-sm font-medium"
          >
            {copied ? 'Copied!' : <><Copy size={16} /> Copy Code</>}
          </button>
          <button 
            onClick={clearEditor}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-md transition-all text-sm font-medium"
          >
            <Trash2 size={16} /> Clear
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col md:flex-row p-4 gap-4">
        {/* Toolbar & Input */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Symbol Buttons */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Templates & Symbols</p>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              <ToolbarButton onClick={() => insertTemplate('fraction')} icon={<Divide size={18} />} label="Frac" />
              <ToolbarButton onClick={() => insertTemplate('superscript')} icon={<ChevronUp size={18} />} label="Exp" />
              <ToolbarButton onClick={() => insertTemplate('root')} icon={<Square size={18} />} label="Sqrt" />
              <ToolbarButton onClick={() => insertTemplate('integral')} icon={<span className="text-lg">∫</span>} label="Int" />
              <ToolbarButton onClick={() => insertTemplate('sum')} icon={<span className="text-lg">∑</span>} label="Sum" />
              <ToolbarButton onClick={() => insertTemplate('plus')} icon={<Plus size={18} />} label="Plus" />
              <ToolbarButton onClick={() => insertTemplate('minus')} icon={<Minus size={18} />} label="Minus" />
              <ToolbarButton onClick={() => insertTemplate('times')} icon={<X size={18} />} label="Mult" />
              <ToolbarButton onClick={() => insertTemplate('equals')} icon={<Equal size={18} />} label="Eq" />
              <ToolbarButton onClick={() => insertTemplate('alpha')} icon={<span className="italic">α</span>} label="Alpha" />
              <ToolbarButton onClick={() => insertTemplate('beta')} icon={<span className="italic">β</span>} label="Beta" />
              <ToolbarButton onClick={() => insertTemplate('pi')} icon={<span className="italic">π</span>} label="Pi" />
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 shadow-lg flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-slate-800 text-slate-400 text-xs font-mono flex justify-between items-center">
              <span>MathML Source</span>
            </div>
            <textarea
              className="flex-1 w-full bg-transparent text-emerald-400 font-mono text-sm p-4 outline-none resize-none leading-relaxed"
              value={mathmlContent}
              onChange={(e) => setMathmlContent(e.target.value)}
              spellCheck="false"
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b bg-slate-50 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-600">Live Preview</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div 
              ref={previewRef}
              className="text-4xl"
              dangerouslySetInnerHTML={{ __html: mathmlContent }}
            />
          </div>
          <div className="p-4 bg-indigo-50 border-t border-indigo-100 italic text-indigo-600 text-xs text-center">
            "Your complex ideas, beautifully rendered."
          </div>
        </div>
      </main>
    </div>
  );
};

const ToolbarButton = ({ onClick, icon, label }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
  >
    <div className="mb-1">{icon}</div>
    <span className="text-[10px] text-slate-400 group-hover:text-indigo-400">{label}</span>
  </button>
);

export default MathEditor;
