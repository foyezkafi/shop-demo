import { STORE_CONFIG } from '../config/constants';
import { CartItem, OrderCustomerInfo, OrderPaymentInfo } from '../types';

interface OrderMessagePayload {
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment?: OrderPaymentInfo;
  orderId?: string;
  productCodeNote?: string;
}

export function generateWhatsAppOrderMessage(payload: OrderMessagePayload): string {
  const { customer, items, subtotal, deliveryFee, total, payment, orderId, productCodeNote } = payload;

  const itemDetailsText = items
    .map((item, index) => {
      const p = item.product;
      const itemTotal = p.price * item.quantity;
      return `${items.length > 1 ? `[পণ্য #${index + 1}]\n` : ''}Product Name: ${p.nameBn} (${p.nameEn})
Product Code: ${p.code}
Price: ৳${p.price.toLocaleString('en-IN')}
Quantity: ${item.quantity}
Item Total: ৳${itemTotal.toLocaleString('en-IN')}`;
    })
    .join('\n\n');

  let paymentText = '';
  if (payment) {
    if (payment.method === 'cod') {
      paymentText = `\nPayment Method: Cash on Delivery (ক্যাশ অন ডেলিভারি)`;
    } else {
      paymentText = `\nPayment Method: ${payment.method.toUpperCase()} (Online Payment)
Transaction ID: ${payment.trxId || 'N/A'}
Payer Number: ${payment.senderNumber || 'N/A'}
Paid Amount: ৳${(payment.amount || total).toLocaleString('en-IN')}`;
    }
  }

  const message = `NEW ORDER – IDEAL BIGSHOP${orderId ? ` (#${orderId})` : ''}

Customer Information:
Name: ${customer.fullName || 'N/A'}
Phone: ${customer.phone || 'N/A'}
WhatsApp: ${customer.whatsapp || customer.phone || 'N/A'}
Address: ${customer.address || 'N/A'}
District: ${customer.district || 'N/A'}
Upazila: ${customer.upazila || 'N/A'}

Product Code & Details:
${productCodeNote ? `Selected Product Code / Item: ${productCodeNote}\n` : ''}${itemDetailsText}

Bill Summary:
Subtotal: ৳${subtotal.toLocaleString('en-IN')}
Delivery Fee: ৳${deliveryFee.toLocaleString('en-IN')}
Total Amount: ৳${total.toLocaleString('en-IN')}
${paymentText}

Additional Notes: ${customer.deliveryNotes ? customer.deliveryNotes : 'None'}

--
Generated from Ideal Bigshop Online Store`;

  return message;
}

export function getWhatsAppOrderUrl(payload: OrderMessagePayload): string {
  const message = generateWhatsAppOrderMessage(payload);
  const encoded = encodeURIComponent(message);
  return `${STORE_CONFIG.whatsappUrl}?text=${encoded}`;
}
