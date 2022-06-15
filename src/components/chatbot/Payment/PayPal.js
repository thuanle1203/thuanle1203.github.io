import React, { useRef, useEffect } from "react";

export default function Paypal(props) {
  const paypal = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Cool looking table",
                amount: {
                  currency_code: "SGD",
                  value: props.total,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          const response = await props.handlePaymentMethod(order, 'online');

          console.log(response);
        },
        onError: (err) => {
          console.log(err);
        },
      }).render(paypal.current);
  }, [props, props.total]);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
}