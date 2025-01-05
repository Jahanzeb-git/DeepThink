import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

const markdownContent = `
## Markdown with Math and GFM

Here is an inline math expression: 

Here is a block math expression:

$$
J(\theta_0, \theta_1) = \frac{1}{2m} \sum_{i=1}^{m} (h_\theta(x^{(i)}) - y^{(i)})^2
$$

- [x] This is a completed task
- [ ] This is an incomplete task
`;

const MarkdownRenderer: React.FC = () => {
  return (
    <div className="text-gray-900 dark:text-gray-100 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <ReactMarkdown
        children={markdownContent}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      />
    </div>
  );
};

export default MarkdownRenderer;





