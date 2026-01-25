/**
 * ペイウォール管理システム
 * Stripe Payment Links連携
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'portfolio_unlocked_items';
  const PENDING_KEY = 'portfolio_pending_item';

  // Stripe Payment Link
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

    // Stripeからの戻りをチェック（成功URLにパラメータを設定した場合）
    if (urlParams.has('payment_success') || document.referrer.includes('stripe.com')) {
      const pendingItem = getPendingItem();
      if (pendingItem) {
        // 保留中のアイテムを解除
        const unlockedItems = getUnlockedItems();
        if (!unlockedItems.includes(pendingItem)) {
          unlockedItems.push(pendingItem);
          saveUnlockedItems(unlockedItems);
        }
        clearPendingItem();

        // URLパラメータをクリア
        window.history.replaceState({}, document.title, window.location.pathname);

        console.log(`[Stripe] ${pendingItem}を解除しました`);
      }
    }
  };

  // --- ペイウォール解除処理 ---
  const unlockItem = (container) => {
    const paywallId = container.dataset.paywallId;
    const unlockedItems = getUnlockedItems();

    if (unlockedItems.includes(paywallId)) return;

    // 保留中として保存し、Stripeにリダイレクト
    setPendingItem(paywallId);

    // Payment Linkにリダイレクト
    window.location.href = PAYMENT_LINK;
  };

  const applyUnlockState = (container) => {
    const content = container.querySelector('.paywall-content');
    const overlay = container.querySelector('.paywall-overlay');
    if (content) content.classList.remove('locked');
    if (overlay) overlay.classList.add('hidden');
  };

  // --- 初期化：保存された状態を復元 ---
  const restoreSavedState = () => {
    const unlockedItems = getUnlockedItems();
    document.querySelectorAll('.paywall-container').forEach(container => {
      if (unlockedItems.includes(container.dataset.paywallId)) {
        applyUnlockState(container);
      }
    });
  };

  // --- リセット処理 ---
  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PENDING_KEY);
    location.reload();
  };

  // --- イベントリスナー ---
  document.querySelectorAll('.unlock-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const container = e.target.closest('.paywall-container');
      if (container) unlockItem(container);
    });
  });

  const resetButton = document.getElementById('reset-button');
  if (resetButton) resetButton.addEventListener('click', resetAll);

  // --- 初期化 ---
  checkPaymentSuccess();
  restoreSavedState();

  console.log('ペイウォールシステム初期化完了（Stripe Payment Links連携）');
});
