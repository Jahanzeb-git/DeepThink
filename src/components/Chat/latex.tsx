import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

const markdownContent = `
Here is a linear regression equation:

\\[ I = \\beta_0 + \\beta_1 x + \\epsilon \\]
`;

export default function App() {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {markdownContent}
    </ReactMarkdown>
  );
}
