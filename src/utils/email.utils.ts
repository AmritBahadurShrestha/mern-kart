export const generate_order_confirmation_email = (order: any) => {
  const html = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #2c3e50;
        }
        .order-details {
          margin-bottom: 20px;
        }
        .order-details table {
          width: 100%;
          border-collapse: collapse;
        }
        .order-details th, .order-details td {
          padding: 8px 12px;
          border: 1px solid #ddd;
        }
        .order-details th {
          background-color: #f4f4f4;
          text-align: left;
        }
        .order-details td {
          text-align: center;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          text-align: right;
          margin-top: 20px;
        }
        .shipping-address {
          margin-top: 20px;
          padding-top: 10px;
          border-top: 2px solid #ddd;
        }
        .footer {
          text-align: center;
          font-size: 14px;
          color: #777;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for shopping with us! Your order has been successfully placed.</p>
        </div>
        <div class="order-details">
          <h3>Order Details</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item: any) => `
                    <tr>
                      <td>${item.product.name}</td>
                      <td>${item.quantity}</td>
                      <td>$${item.product.price.toFixed(2)}</td>
                      <td>$${(item.quantity * item.product.price).toFixed(
                        2
                      )}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
          <div class="total">
            Total Amount: $${order.total_amount.toFixed(2)}
          </div>
        </div>
        <div class="shipping-address">
          <h3>Shipping Address</h3>

          <p>${order.shipping_address.street}</p>
          <p>${order.shipping_address.district}, ${
    order.shipping_address.state
  }</p>
          <p>${order.shipping_address.country}</p>
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to contact our support team.</p>
        </div>
      </div>
    </body>
  </html>
`;

  return html;
};
