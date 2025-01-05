import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS for styling

const Latex: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Example equation for rendering
  const equation = `
    [ y = \theta_0 + \theta_1 x_1 + \theta_2 x_2 + \dots + \theta_n x_n ]
  `;

  useEffect(() => {
    if (containerRef.current) {
      try {
        // Render KaTeX content
        katex.render(equation, containerRef.current, {
          throwOnError: false, // Handle errors gracefully
        });
      } catch (err) {
        console.error('KaTeX rendering failed:', err);
      }
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="text-gray-900 dark:text-gray-100 p-4 bg-white dark:bg-gray-800 rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">KaTeX Rendering Test</h2>
    </div>
  );
};

export default Latex;




