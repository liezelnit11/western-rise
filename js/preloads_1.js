
    (function() {
      var baseURL = "https://cdn.shopify.com/shopifycloud/checkout-web/assets/";
      var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/runtime.latest.en.96ffdc35545a9f1d7a28.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/387.latest.en.9e34afdfca3b3ca8e82f.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/361.latest.en.6cdbbdf251c67e8731e7.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/706.latest.en.42ccf4e89391ecffca9a.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.latest.en.8b38375ff89916a9158f.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/751.latest.en.50a060a987311ab2c479.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/836.latest.en.60c9eaec136b3caf1602.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/78.latest.en.eef7c2019c4f6c3263f8.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/100.latest.en.c23146172603a4291158.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/OnePage.latest.en.0cfedd26157a856dc0bb.js"];
      var styles = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/387.latest.en.f33bec95ccc28d34a55e.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.latest.en.5e52d9ec000e6dcd2cd6.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/836.latest.en.6e0fd6af0121f716b925.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/268.latest.en.8e0d7d2e2c9284d27302.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0696/1303/files/wr-logo-222222_x320.png?v=1642642379"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [baseURL].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res[0], next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        })();
      }

      function onLoaded() {
        preconnectAssets();
        prefetchAssets();
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  