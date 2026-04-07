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

  const ALIGNS = ['left', 'center', 'right'];

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const elements = document.querySelectorAll('[data-randomize]');

  elements.forEach(el => {
    const tag = pick(TAG_POOL);
    el.setAttribute('data-tag-open', `<${tag}>`);
    el.setAttribute('data-tag-close', `</${tag}>`);
    el.classList.add(`tag-${tag}`);

    el.style.textAlign = pick(ALIGNS);
    el.style.marginLeft = Math.floor(rand(0, 60)) + 'px';
    el.style.marginRight = Math.floor(rand(0, 60)) + 'px';
    el.style.letterSpacing = rand(-1, 8).toFixed(1) + 'px';
    el.style.transform = 'rotate(' + rand(-3, 3).toFixed(1) + 'deg)';
    el.style.opacity = rand(0.6, 1).toFixed(2);
    el.style.textIndent = Math.floor(rand(0, 40)) + 'px';
  });

  // プロフィール列の位置をランダム化
  const container = document.querySelector('.profile-container');
  const leftCol = document.querySelector('.left-column');
  const rightCol = document.querySelector('.right-column');
  if (container && leftCol && rightCol) {
    // 左右カラムの順序をランダムに入れ替え
    if (Math.random() > 0.5) {
      leftCol.style.order = '2';
      rightCol.style.order = '1';
    }
    // flex-directionをランダム（横並び or 縦並び）
    container.style.flexDirection = pick(['row', 'column', 'row-reverse', 'column-reverse']);
    // align-itemsをランダム
    container.style.alignItems = pick(['flex-start', 'center', 'flex-end']);
  }
});
