let db = {} as any;
let gateway = {} as any;
let sendEmail = (template, client, total) => {};
let logistics = (products) => {};
let config = {} as any;

function m(client, products, promoCode, installments) {
  let t = 0;

  products.forEach((p) => {
    if (!check(p)) {
      throw new Error("Not possible to create an order");
    }

    t += p.price;
  });

  if (
    t >= 1000 &&
    client.score < 1000 &&
    config.STORE_ALLOWED_INSTALLMENTS &&
    installments > 1
  ) {
    throw new Error("Not possible to receive installments");
  }

  pay(client, t, installments, promoCode);

  logistics(products);
}

function check(product) {
  let p = db.query("SELECT COUNT(1) FROM prd_i WHERE id = ?", product.id);

  return p;
}

/*
    This function will collect the payment on the gateway (aka Stripe). It receives the client, total, and promoCode
    The gateway is responsible to process the payment
*/
function pay(client, total, installments, promoCode) {
  gateway.collect(client.creditCardToken, total, installments, promoCode);

  sendEmail("TEMPALTE_123432", client, total);
}
