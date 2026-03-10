(function() {
  var appUrl = "{{ 'YOUR_RAILWAY_URL' }}";
  var shop = "{{ shop.permanent_domain }}";

  fetch(appUrl + "/api/settings?shop=" + shop)
    .then(function(r) { return r.json(); })
    .then(function(s) {
      if (!s.enabled) return;
      var stock = Math.floor(Math.random() * (s.maxStock - s.minStock + 1)) + s.minStock;
      var key = "urgency_stock_" + window.location.pathname;
      if (!sessionStorage.getItem(key)) sessionStorage.setItem(key, stock);
      stock = sessionStorage.getItem(key);
      var msg = s.message.replace("{stock}", stock);
      var div = document.createElement("div");
      div.innerHTML = msg;
      div.style.cssText = "background:" + s.bgColor + ";color:" + s.textColor + ";padding:10px 16px;border-radius:6px;font-weight:600;font-size:14px;text-align:center;margin:10px 0;";
      if (s.pulseAnimation) {
        var style = document.createElement("style");
        style.textContent = "@keyframes urgency-pulse{0%,100%{opacity:1}50%{opacity:.7}}.urgency-pulse{animation:urgency-pulse 2s infinite}";
        document.head.appendChild(style);
        div.classList.add("urgency-pulse");
      }
      var priceEl = document.querySelector(".price") || document.querySelector("[class*='price']");
      if (priceEl) priceEl.parentNode.insertBefore(div, priceEl.nextSibling);
    });
})();
