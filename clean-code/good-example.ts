let db = {} as any;
let gateway = {} as any;
let sendEmail = (template, client, total) => {};
let deliverProducts = (products) => {};
let config = {} as any;

class OrderDetails {
  // ...
}

function main(orderDetails) {
  let { client, products, promoCode, installments } = orderDetails;
  let total = 0;

  products.forEach((product) => {
    if (!checkInventory(product)) {
      throw new Error("Not possible to create an order");
    }

    total += product.price;
  });

  let doesClientHaveEnoughScore = client.score < 1000;
  let doesStoreHaveInstallmentsAllowed = config.STORE_ALLOWED_INSTALLMENTS;
  let doesPaymentHaveInstallments = installments > 1;

  let isInstallmentAllowed =
    total >= 1000 &&
    doesClientHaveEnoughScore &&
    doesStoreHaveInstallmentsAllowed &&
    doesPaymentHaveInstallments;

  if (isInstallmentAllowed) {
    throw new Error("Not possible to receive installments");
  }

  collectPayment(orderDetails);
  sendEmail("TEMPALTE_123432", orderDetails.client, orderDetails.total);
  deliverProducts(products);
}

function checkInventory(product) {
  let p = db.query("SELECT COUNT(1) FROM prd_i WHERE id = ?", product.id);

  return p;
}

// NB: there is an edge case for this gateway collect: https://github.com/issue...
function collectPayment(orderDetails) {
  gateway.collect(
    orderDetails.client.creditCardToken,
    orderDetails.total,
    orderDetails.installments,
    orderDetails.promoCode
  );
}
