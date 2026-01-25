/**
 * ペイウォール管理システム
 * Stripe Payment Links連携
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'portfolio_unlocked_items';
  const PENDING_KEY = 'portfolio_pending_item';
  const PAYMENT_LINK = 'https://buy.stripe.com/bJe00legG2HG43aexMe7m00';

  // --- 状態管理 ---
  const getUnlockedItems = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const saveUnlockedItems = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const getPendingItem = () => localStorage.getItem(PENDING_KEY);
  const setPendingItem = (itemId) => localStorage.setItem(PENDING_KEY, itemId);
  const clearPendingItem = () => localStorage.removeItem(PENDING_KEY);

  // --- 決済成功チェック ---
  const checkPaymentSuccess = () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('payment_success') || document.referrer.includes('stripe.com')) {
      const pendingItem = getPendingItem();
      if (pendingItem) {
        const unlockedItems = getUnlockedItems();
        if (!unlockedItems.includes(pendingItem)) {
          unlockedItems.push(pendingItem);
          saveUnlockedItems(unlockedItems);
        }
        clearPendingItem();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  };

  // --- ペイウォール解除処理 ---
  const unlockItem = (itemId) => {
    const unlockedItems = getUnlockedItems();
    if (unlockedItems.includes(itemId)) return;
    setPendingItem(itemId);
    window.location.href = PAYMENT_LINK;
  };

  // --- 保存された状態を復元 ---
  const restoreSavedState = () => {
    const unlockedItems = getUnlockedItems();

    // paywall-block
    document.querySelectorAll('.paywall-block').forEach(el => {
      const itemId = el.dataset.paywallId;
      if (unlockedItems.includes(itemId)) {
        const content = el.querySelector('.paywall-content');
        const overlay = el.querySelector('.paywall-overlay');
        if (content) content.classList.remove('locked');
        if (overlay) overlay.classList.add('hidden');
      }
    });

    // paywall-inline
    document.querySelectorAll('.paywall-inline').forEach(el => {
      const itemId = el.dataset.paywallId;
      if (unlockedItems.includes(itemId)) {
        const content = el.querySelector('.paywall-content');
        const btn = el.querySelector('.unlock-btn');
        if (content) content.classList.remove('locked');
        if (btn) btn.classList.add('hidden');
      }
    });
  };

  // --- イベントリスナー ---
  // paywall-block
  document.querySelectorAll('.paywall-block .unlock-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.paywall-block');
      if (block) unlockItem(block.dataset.paywallId);
    });
  });

  // paywall-inline
  document.querySelectorAll('.paywall-inline .unlock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const inline = btn.closest('.paywall-inline');
      if (inline) unlockItem(inline.dataset.paywallId);
    });
  });

  // --- 初期化 ---
  checkPaymentSuccess();
  restoreSavedState();
});
