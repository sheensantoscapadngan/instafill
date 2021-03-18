import React, { useRef, useEffect,useContext } from "react";
import {UserContext} from '../contexts/UserProvider.js'
import {addTopupFillers} from '../services/firebase.js'

export default function Paypal() {
  const paypal = useRef();
  let user = useContext(UserContext)

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "5 Instafill Fillers",
                amount: {
                  currency_code: "USD",
                  value: 1.0
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log("SUCCESSFUL PURCHASE:"+order);
          addTopupFillers(user.email)
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, []);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
}