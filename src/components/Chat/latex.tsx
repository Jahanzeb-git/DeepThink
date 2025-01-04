import React from 'react';

const markdownContent = `
Here is a simple LaTeX equation:

\( y_i = \beta_0 + \beta_1 x_i + \epsilon_i \)
`;

export default function App() {
  return (
    <div>
      <div id="math" dangerouslySetInnerHTML={{ __html: markdownContent.replace(/\\\[(.*?)\\\]/g, '<span class="math">$1</span>') }}></div>
    </div>
  );
}

