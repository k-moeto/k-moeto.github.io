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
        console.log(`[Stripe] ${pendingItem}を解除しました`);
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

  // --- UIに解除状態を適用 ---
  const applyUnlockState = (element, itemId) => {
    const unlockedItems = getUnlockedItems();
    if (unlockedItems.includes(itemId)) {
      // paywall-word の場合: 隠されたテキストを表示
      if (element.classList.contains('paywall-word')) {
        const hiddenText = element.dataset.hidden;
        element.textContent = hiddenText;
        element.classList.add('unlocked');
        element.classList.remove('locked');
      }
      // paywall-container の場合: ブラーを解除
      else if (element.classList.contains('paywall-container')) {
        const content = element.querySelector('.paywall-content');
        const overlay = element.querySelector('.paywall-overlay');
        if (content) content.classList.remove('locked');
        if (overlay) overlay.classList.add('hidden');
      }
    }
  };

  // --- 初期化 ---
  const restoreSavedState = () => {
    // paywall-container
    document.querySelectorAll('.paywall-container').forEach(element => {
      const itemId = element.dataset.paywallId;
      applyUnlockState(element, itemId);
    });

    // paywall-word
    document.querySelectorAll('.paywall-word').forEach(element => {
      const itemId = element.dataset.paywallId;
      applyUnlockState(element, itemId);
    });
  };

  // --- イベントリスナー ---
  // paywall-containerの解除ボタン
  document.querySelectorAll('.paywall-container .unlock-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const container = e.target.closest('.paywall-container');
      if (container) {
        unlockItem(container.dataset.paywallId);
      }
    });
  });

  // paywall-word（●●●）クリックで解除
  document.querySelectorAll('.paywall-word').forEach(element => {
    const unlockedItems = getUnlockedItems();
    if (!unlockedItems.includes(element.dataset.paywallId)) {
      element.classList.add('locked');
      element.addEventListener('click', () => {
        unlockItem(element.dataset.paywallId);
      });
    }
  });

  // --- 初期化実行 ---
  checkPaymentSuccess();
  restoreSavedState();

  console.log('ペイウォールシステム初期化完了');
});
