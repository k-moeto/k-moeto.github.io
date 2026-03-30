document.addEventListener('DOMContentLoaded', () => {
  const TAG_POOL = [
    'h1', 'h2', 'h3',
    'strong', 'b',
    'em', 'i',
    'mark',
    'small',
    'del',
    'code',
    'blockquote',
    'sup', 'sub'
  ];

  const elements = document.querySelectorAll('[data-randomize]');

  elements.forEach(el => {
    const tag = TAG_POOL[Math.floor(Math.random() * TAG_POOL.length)];
    el.setAttribute('data-tag-open', `<${tag}>`);
    el.setAttribute('data-tag-close', `</${tag}>`);
    el.classList.add(`tag-${tag}`);
  });
});
