let addedToCartRetentionButton;
let viewedProductRetention;

!(function () {
  let retention_cart_event_called = false;
  let retention_viewed_product_called = false;

  setTimeout(function(){
    if (document.getElementById('gecheck-a')) {
      document.getElementById('gecheck-a').innerHTML = '<img src="https://jsstore.s3-us-west-2.amazonaws.com/circle-check.png" style="width:18px;display:inline"></td>';
    }
  }, 2000);

  let itemDetails = null;

  let product_url = location.protocol + '//' + location.host + location.pathname;
  if (product_url.includes("/products/")) {
      if (location.href.includes("vge=true")) {
        console.log(window.Shopify.currency);
        console.log(window.Shopify.locale);
        console.log(window.Shopify.country);
      }

    if (product_url.endsWith("/")) {
      product_url = product_url.slice(0, -1);
    }
    fetch(product_url + '.js').then(res => res.clone().json().then(data => {
      itemDetails = data;
    }))
  }

  function fetchItemDetails(item) {
    let itemAdded = null;
    let defaultImageUrl = null;

    if (item !== undefined) {
      if (item.items !== undefined) {
        if (Array.isArray(item.items)) {
          item = item.items[0];
        }
      }

      // Grab the image URL before we replace it - in case the new object doesn't have one.
      defaultImageUrl = bestImageUrl();

      itemDetails = item;
    }

    if (itemDetails !== null) {
      itemAdded = {
        Name: itemDetails.title,
        ProductID: itemDetails.id,
        URL: product_url,
        Brand: itemDetails.vendor,
        Price: itemDetails.price
      };

      if (window.Shopify.currency && window.Shopify.currency.active) {
        itemAdded.currency = window.Shopify.currency.active;
      }

      // If the product is a variant - grab those details!
      // Check first to see if the itemDetails has the variant - else try the URL
      if (itemDetails.variant_id) { 
        if (itemDetails.product_id){
          //there is no point overriding the ProductID if product_id is not defined
          itemAdded.ProductID = itemDetails.product_id;
        }
        itemAdded.VariantID = itemDetails.variant_id;
        itemAdded.Variant = itemDetails.title;
        if (!itemAdded.Name && itemDetails.variant_title ) {
          itemAdded.Name = itemDetails.variant_title;
        }
      } else {
        let variant_id = new URLSearchParams(window.location.search).get('variant');
        if (variant_id) {
          if (itemDetails.variants !== undefined && itemDetails.variants !== null) {
            if (itemDetails.variants.length > 0) {
              for (let index = 0; index < itemDetails.variants.length; index++) {
                let variant = itemDetails.variants[index];
                if (variant_id === variant.id.toString()) {
                  itemAdded.Price = variant.price;
                  itemAdded.VariantID = variant.id;
                  itemAdded.Variant = variant.name;
                }
              }
            }
          }
        }
      }

      let price = itemAdded.Price;
      if (price !== undefined && !price.toString().includes('.')) {
        // The price needs to be tweaked because it is a whole number.
        price = price / 100;
        itemAdded.Price = price;
      }

      var currentImageUrl = bestImageUrl();
      if (currentImageUrl !== null) {
        itemAdded.ImageURL = currentImageUrl
      } else {
        if (defaultImageUrl !== null) {
          itemAdded.ImageURL = defaultImageUrl;
        }
      }

      // Make sure the Image URL is a full/proper URL.
      if (itemAdded.ImageURL !== null && itemAdded.ImageURL !== undefined && itemAdded.ImageURL.startsWith('//')) {
        itemAdded.ImageURL = 'https:' + itemAdded.ImageURL;
      }
    }

    return itemAdded;
  }

  function bestImageUrl() {
    let imageUrl = null;

    if (itemDetails) {
      if (typeof itemDetails.featured_image !== 'undefined') {
        if (typeof itemDetails.featured_image === 'string') {
          imageUrl = itemDetails.featured_image;
        } else if (typeof itemDetails.featured_image === 'object') {
          imageUrl = itemDetails.featured_image.url;
        }
      }

      let variant_id = new URLSearchParams(window.location.search).get('variant');
      if (variant_id) {
        if (itemDetails.variants !== undefined && itemDetails.variants !== null) {
          if (itemDetails.variants.length > 0) {
            for (let index = 0; index < itemDetails.variants.length; index++) {
              let variant = itemDetails.variants[index];
              if (variant_id === variant.id.toString()) {
                if (variant.featured_image !== null) {
                  imageUrl = variant.featured_image.src;
                }
              }
            }
          }
        }
      }
    }

    return imageUrl;
  }

  addedToCartRetentionButton = function(item) {
    if (!retention_cart_event_called) {
      let itemAdded = fetchItemDetails(item);
      if (itemAdded) {
        if (typeof geq !== 'undefined' && typeof geq.addToCart === 'function') {
          geq.addToCart(itemAdded);
          retention_cart_event_called = true;
        }
      }
    }
  };

  viewedProductRetention = function() {
    if (itemDetails) {
      if (!retention_viewed_product_called) {
        let itemAdded = fetchItemDetails();
        if (itemAdded) {
          if (typeof geq !== 'undefined' && typeof geq.event_vp === 'function') {
            geq.event_vp(itemAdded);
            retention_viewed_product_called = true;
          }
        }
      }
    }
  }

  setTimeout(function(){ viewedProductRetention() }, 9000);
})();

(function (ns, fetch) {
  ns.fetch = function() {
    let was_atc = false;
    const response = fetch.apply(this, arguments);
    response.then(res => {
      if ((window.location.origin + '/cart/add.js').includes(res.url)) {
        if (!location.pathname.includes("/cart")) {
          was_atc = true;
          return res.clone().json();
        }
      }
    }).then((data) => {
      if (was_atc) {
        addedToCartRetentionButton(data);
      }
    });
    return response
  }
}(window, window.fetch));
