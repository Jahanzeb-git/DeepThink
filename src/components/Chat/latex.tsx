import React, { useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css'; // Ensure Katex styles are included

const Latex: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Example equation for rendering
  const equation = `
    $$
    J(\\theta_0, \\theta_1) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2
    $$
  `;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = equation;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="text-gray-900 dark:text-gray-100 p-4 bg-white dark:bg-gray-800 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">LaTeX Rendering Test</h2>
    </div>
  );
};

export default Latex;






