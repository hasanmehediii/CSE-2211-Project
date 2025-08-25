import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import carLogo from '../../../attachments/car.png';

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
        const purchaseResponse = await axios.get(`http://localhost:8000/purchases/${purchaseId}`);
        setPurchaseDetails(purchaseResponse.data);

        const orderResponse = await axios.get(`http://localhost:8000/orders/purchase/${purchaseId}`);
        if (orderResponse.data.length > 0) {
          const order = orderResponse.data[0];
          setOrderDetails(order);

          const orderItemsResponse = await axios.get(`http://localhost:8000/order_items/by_order/${order.order_id}`);
          if (orderItemsResponse.data.length > 0) {
            const carId = orderItemsResponse.data[0].car_id;

            const carResponse = await axios.get(`http://localhost:8000/cars/${carId}/details`);
            setCarDetails(carResponse.data);
          } else {
            setError('No items found for this order.');
          }
        } else {
          setError('No order found for this purchase.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch purchase details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [purchaseId]);

  const generatePDF = () => {
    if (!purchaseDetails || !carDetails || !orderDetails || !user) {
      setError("Cannot generate PDF: Not all purchase details are available yet.");
      return;
    }

    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.height;
      let yPos = 20;

      // Header
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

      // Title
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Purchase Invoice', 14, yPos);
      yPos += 10;

      // Metadata
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice #: ${purchaseDetails.invoice_number || 'N/A'}`, 14, yPos);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.width - 14, yPos, { align: 'right' });
      yPos += 15;

      // Bill To
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', 14, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(user.username || '', 14, yPos + 6);
      doc.text(user.email || '', 14, yPos + 12);
      doc.text(user.phone_number || '', 14, yPos + 18);
      yPos += 30;

      // Car Details Table
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
        headStyles: { fillColor: [41, 128, 185] },
        didDrawPage: (data) => { yPos = data.cursor.y; }
      });

      // Purchase Summary Table
      autoTable(doc, {
        startY: yPos + 10,
        head: [['Purchase Summary', 'Amount']],
        body: [
          ['Total Price', `$${(purchaseDetails.amount || 0).toFixed(2)}`],
          ['Payment Method', purchaseDetails.payment_method || 'N/A'],
          ['Status', purchaseDetails.status || 'N/A'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133] },
        didDrawPage: (data) => { yPos = data.cursor.y; }
      });

      // Shipping Details Table
      autoTable(doc, {
        startY: yPos + 10,
        head: [['Shipping Details', '']],
        body: [
          ['Shipping Address', orderDetails.shipping_address || 'N/A'],
          ['Tracking Number', orderDetails.tracking_number || 'N/A'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [211, 84, 0] },
        didDrawPage: (data) => { yPos = data.cursor.y; }
      });

      // Footer
      const footerY = pageHeight - 30;
      doc.line(14, footerY, doc.internal.pageSize.width - 14, footerY);
      doc.setFontSize(10);
      doc.text('Thank you for your business!', doc.internal.pageSize.width / 2, footerY + 10, { align: 'center' });
      doc.text('www.goriber-gari.com', doc.internal.pageSize.width / 2, footerY + 15, { align: 'center' });
      doc.text(`Page 1 of 1`, doc.internal.pageSize.width - 14, footerY + 10, { align: 'right' });

      doc.save(`invoice_${purchaseDetails.invoice_number}.pdf`);
    } catch (e) {
      console.error("Error during PDF generation:", e);
      setError("An unexpected error occurred while generating the PDF.");
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <Navbar />
        <div className="loader"></div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <Navbar />
        <div className="purchase-after-container">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />
      <div className="purchase-after-container">
        <div className="confirmation-header">
          <h1>Thank You For Your Purchase!</h1>
          <p>Your order has been placed successfully. Here are the details:</p>
        </div>

        <div className="details-grid">
          {carDetails && (
            <div className="details-card">
              <h2>🚗 Car Details</h2>
              <div className="detail-item"><span>Model:</span><span>{carDetails.model_name}</span></div>
              <div className="detail-item"><span>Manufacturer:</span><span>{carDetails.manufacturer}</span></div>
              <div className="detail-item"><span>Year:</span><span>{carDetails.year}</span></div>
              <div className="detail-item"><span>Price:</span><span>${carDetails.price.toFixed(2)}</span></div>
            </div>
          )}

          {purchaseDetails && (
            <div className="details-card">
              <h2>💳 Purchase Summary</h2>
              <div className="detail-item"><span>Purchase ID:</span><span>{purchaseDetails.purchase_id}</span></div>
              <div className="detail-item"><span>Amount:</span><span>${purchaseDetails.amount.toFixed(2)}</span></div>
              <div className="detail-item"><span>Payment Method:</span><span>{purchaseDetails.payment_method}</span></div>
              <div className="detail-item"><span>Status:</span><span className={`status status-${purchaseDetails.status?.toLowerCase()}`}>{purchaseDetails.status}</span></div>
              <div className="detail-item"><span>Invoice #:</span><span>{purchaseDetails.invoice_number}</span></div>
            </div>
          )}

          {orderDetails && (
            <div className="details-card">
              <h2>🚚 Order & Shipping</h2>
              <div className="detail-item"><span>Order ID:</span><span>{orderDetails.order_id}</span></div>
              <div className="detail-item"><span>Status:</span><span className={`status status-${orderDetails.status?.toLowerCase()}`}>{orderDetails.status}</span></div>
              <div className="detail-item"><span>Shipping Address:</span><span>{orderDetails.shipping_address}</span></div>
              <div className="detail-item"><span>Tracking #:</span><span>{orderDetails.tracking_number || 'N/A'}</span></div>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate(`/payment/${purchaseId}`)} className="action-button primary">
            Proceed to Payment
          </button>
          <button onClick={generatePDF} className="action-button secondary">
            Download Invoice
          </button>
          <button onClick={() => navigate('/')} className="action-button tertiary">
            Back to Home
          </button>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        .page {
          background: linear-gradient(135deg, #010715ff, #010a04ff);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          min-height: 100vh;
          padding-top: 60px;
        }
        .page-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #010715ff, #010a04ff);
        }
        .loader {
            border: 8px solid #444; /* Dark grey */
            border-top: 8px solid #667eea; /* Blue */
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 2s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .purchase-after-container {
          flex: 1;
          padding: 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        .confirmation-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        .confirmation-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #ec4899;
            margin-bottom: 0.5rem;
        }
        .confirmation-header p {
            font-size: 1.2rem;
            color: #d1d5db;
        }
        .details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        .details-card {
            background: rgba(15, 23, 42, 0.9);
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            border: 1px solid #334155;
        }
        .details-card h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #22d3ee;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid #334155;
            padding-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            font-size: 1rem;
            border-bottom: 1px solid #334155;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .detail-item span:first-child {
            font-weight: 500;
            color: #94a3b8;
        }
        .detail-item span:last-child {
            font-weight: 600;
            color: #e5e7eb;
        }
        .status {
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 700;
            color: #fff;
        }
        .status-pending {
            background-color: #f39c12;
        }
        .status-completed {
            background-color: #2ecc71;
        }
        .status-shipped {
            background-color: #3498db;
        }
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .action-button {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }
        .action-button.primary {
            background: #22d3ee;
            color: #1e293b;
        }
        .action-button.primary:hover {
            background: #06b6d4;
            transform: translateY(-2px);
        }
        .action-button.secondary {
            background: #2ecc71;
            color: #ffffff;
        }
        .action-button.secondary:hover {
            background: #27ae60;
            transform: translateY(-2px);
        }
        .action-button.tertiary {
            background: #ec4899;
            color: #ffffff;
        }
        .action-button.tertiary:hover {
            background: #db2777;
            transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default PurchaseAfter;