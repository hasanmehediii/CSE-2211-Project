import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FaArrowLeft,
  FaArrowRight,
  FaCarSide,
  FaCheck,
  FaCreditCard,
  FaDownload,
  FaMapMarkerAlt,
  FaReceipt,
  FaTruck,
} from 'react-icons/fa';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import CheckoutSteps from '../components/CheckoutSteps.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import carLogo from '../../../attachments/car.png';
import api from '../api.jsx';
import './Checkout.css';

const money = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

const DetailRow = ({ label, children }) => (
  <div className="confirmation-row">
    <span>{label}</span>
    <strong>{children || 'Not available'}</strong>
  </div>
);

const PurchaseAfter = () => {
  const { purchaseId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const purchaseResponse = await api.get(`/purchases/${purchaseId}`);
        setPurchaseDetails(purchaseResponse.data);

        const orderResponse = await api.get(`/orders/purchase/${purchaseId}`);
        if (!orderResponse.data.length) throw new Error('No order was found for this purchase.');
        const order = orderResponse.data[0];
        setOrderDetails(order);

        const itemsResponse = await api.get(`/order_items/by_order/${order.order_id}`);
        if (!itemsResponse.data.length) throw new Error('No vehicle was found in this order.');

        const carResponse = await api.get(`/cars/${itemsResponse.data[0].car_id}/details`);
        setCarDetails(carResponse.data);
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        setError(fetchError.message || 'We could not load the order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [purchaseId]);

  const generatePDF = () => {
    if (!purchaseDetails || !carDetails || !orderDetails || !user) {
      setError('The invoice is not ready yet. Please refresh and try again.');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      let yPos = 20;

      doc.addImage(carLogo, 'PNG', 14, yPos, 40, 20);
      doc.setFontSize(26);
      doc.setFont('helvetica', 'bold');
      doc.text('Goriber Gari', doc.internal.pageSize.width - 14, yPos + 15, { align: 'right' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Your friendly neighborhood car dealer', doc.internal.pageSize.width - 14, yPos + 22, { align: 'right' });
      yPos += 30;
      doc.setDrawColor(200);
      doc.line(14, yPos, doc.internal.pageSize.width - 14, yPos);
      yPos += 15;
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Purchase Invoice', 14, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice #: ${purchaseDetails.invoice_number || 'N/A'}`, 14, yPos);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width - 14, yPos, { align: 'right' });
      yPos += 15;
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', 14, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(user.username || '', 14, yPos + 6);
      doc.text(user.email || '', 14, yPos + 12);
      doc.text(user.phone_number || '', 14, yPos + 18);
      yPos += 30;

      autoTable(doc, {
        startY: yPos,
        head: [['Specification', 'Details']],
        body: [
          ['Model', carDetails.model_name || 'N/A'],
          ['Manufacturer', carDetails.manufacturer || 'N/A'],
          ['Year', carDetails.year || 'N/A'],
          ['Color', carDetails.color || 'N/A'],
          ['Transmission', carDetails.transmission || 'N/A'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [16, 27, 44] },
        didDrawPage: (data) => { yPos = data.cursor.y; },
      });

      autoTable(doc, {
        startY: yPos + 10,
        head: [['Purchase Summary', 'Amount']],
        body: [
          ['Total Price', money(purchaseDetails.amount)],
          ['Payment Method', purchaseDetails.payment_method || 'N/A'],
          ['Status', purchaseDetails.status || 'N/A'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [255, 107, 53] },
        didDrawPage: (data) => { yPos = data.cursor.y; },
      });

      autoTable(doc, {
        startY: yPos + 10,
        head: [['Shipping Details', '']],
        body: [
          ['Shipping Address', orderDetails.shipping_address || 'N/A'],
          ['Tracking Number', orderDetails.tracking_number || 'N/A'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [16, 27, 44] },
      });

      const footerY = pageHeight - 30;
      doc.line(14, footerY, doc.internal.pageSize.width - 14, footerY);
      doc.setFontSize(10);
      doc.text('Thank you for your business!', doc.internal.pageSize.width / 2, footerY + 10, { align: 'center' });
      doc.text('www.goriber-gari.com', doc.internal.pageSize.width / 2, footerY + 15, { align: 'center' });
      doc.save(`invoice_${purchaseDetails.invoice_number || purchaseId}.pdf`);
    } catch (pdfError) {
      console.error('Error during PDF generation:', pdfError);
      setError('The invoice could not be generated. Please try again.');
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />
      <main className="checkout-main">
        <div className="checkout-container">
          {loading ? (
            <div className="checkout-loading">
              <span />
              <span />
              <span />
            </div>
          ) : error ? (
            <section className="checkout-error-state">
              <span>Order unavailable</span>
              <h1>{error}</h1>
              <button onClick={() => navigate('/')}><FaArrowLeft /> Return to showroom</button>
            </section>
          ) : (
            <>
              <CheckoutSteps active={2} />

              <section className="confirmation-hero">
                <div className="confirmation-check"><FaCheck /></div>
                <span className="confirmation-eyebrow">Order received</span>
                <h1>Your car is one step closer.</h1>
                <p>
                  Order <strong>#{orderDetails.order_id}</strong> has been created successfully.
                  Review the information below, then continue to payment.
                </p>
              </section>

              <div className="confirmation-grid">
                <article className="confirmation-card">
                  <header><span><FaCarSide /></span><div><small>Vehicle</small><h2>Car details</h2></div></header>
                  <DetailRow label="Model">{carDetails.model_name}</DetailRow>
                  <DetailRow label="Manufacturer">{carDetails.manufacturer}</DetailRow>
                  <DetailRow label="Year">{carDetails.year}</DetailRow>
                  <DetailRow label="Price">{money(carDetails.price)}</DetailRow>
                </article>

                <article className="confirmation-card">
                  <header><span><FaReceipt /></span><div><small>Summary</small><h2>Purchase details</h2></div></header>
                  <DetailRow label="Purchase ID">#{purchaseDetails.purchase_id}</DetailRow>
                  <DetailRow label="Amount">{money(purchaseDetails.amount)}</DetailRow>
                  <DetailRow label="Payment">{purchaseDetails.payment_method}</DetailRow>
                  <DetailRow label="Invoice">{purchaseDetails.invoice_number}</DetailRow>
                  <DetailRow label="Status">
                    <em className={`confirmation-status is-${purchaseDetails.status?.toLowerCase()}`}>
                      {purchaseDetails.status}
                    </em>
                  </DetailRow>
                </article>

                <article className="confirmation-card">
                  <header><span><FaTruck /></span><div><small>Delivery</small><h2>Shipping details</h2></div></header>
                  <DetailRow label="Order ID">#{orderDetails.order_id}</DetailRow>
                  <DetailRow label="Status">
                    <em className={`confirmation-status is-${orderDetails.status?.toLowerCase()}`}>
                      {orderDetails.status}
                    </em>
                  </DetailRow>
                  <DetailRow label="Address">{orderDetails.shipping_address}</DetailRow>
                  <DetailRow label="Tracking">{orderDetails.tracking_number || 'Assigned after payment'}</DetailRow>
                </article>
              </div>

              <section className="confirmation-actions">
                <div>
                  <FaMapMarkerAlt />
                  <span><strong>Delivery destination</strong>{orderDetails.shipping_address}</span>
                </div>
                <div className="confirmation-actions__buttons">
                  <button className="confirmation-download" onClick={generatePDF}>
                    <FaDownload /> Download invoice
                  </button>
                  <button className="checkout-primary-button" onClick={() => navigate(`/payment/${purchaseId}`)}>
                    <FaCreditCard /> Continue to payment <FaArrowRight />
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PurchaseAfter;
