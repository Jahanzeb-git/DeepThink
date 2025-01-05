import React, { useEffect, useRef } from 'react';

const Latex: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Example equation for rendering
  const equation = `
    \\[
    E = mc^2
    \\]
  `;

  useEffect(() => {
    if (window.MathJax && containerRef.current) {
      // Render MathJax content
      window.MathJax.typesetPromise([containerRef.current]).catch((err) =>
        console.error('MathJax rendering failed:', err)
      );
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="text-gray-900 dark:text-gray-100 p-4 bg-white dark:bg-gray-800 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">LaTeX Rendering Test</h2>
      <div>{equation}</div>
    </div>
  );
};

export default Latex;



