import React from 'react';

const markdownContent = `
Here is a simple LaTeX equation:

\\[ E = mc^2 \\]
`;

export default function App() {
  return (
    <div>
      <div id="math" dangerouslySetInnerHTML={{ __html: markdownContent.replace(/\\\[(.*?)\\\]/g, '<span class="math">$1</span>') }}></div>
    </div>
  );
}

