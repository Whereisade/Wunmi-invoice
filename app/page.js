"use client"
import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Home() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    itemName: '',
    quantity: 1,
    price: 0,
    rentalDate: '',
    transportPrice: 0,
  });
  const [items, setItems] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addItem = () => {
    setItems([...items, { ...formData }]);
    setFormData({
      customerName: '',
      customerAddress: '',
      itemName: '',
      quantity: 1,
      price: 0,
      rentalDate: '',
      transportPrice: 0,
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.text('Invoice - Wunmi\'s Kitchen', 20, 20);
    doc.text(`Customer: ${formData.customerName}`, 20, 30);
    doc.text(`Address: ${formData.customerAddress}`, 20, 40);
    doc.text(`Rental Date: ${formData.rentalDate}`, 20, 50);

    const tableColumn = ['Item Name', 'Quantity', 'Price (₦)', 'Total (₦)'];
    const tableRows = [];

    items.forEach(item => {
      const itemData = [
        item.itemName,
        item.quantity,
        item.price,
        item.quantity * item.price,
      ];
      tableRows.push(itemData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 60 });

    // Add Transport Price
    doc.text(`Transport Price: ₦${formData.transportPrice}`, 20, doc.lastAutoTable.finalY + 10);

    // Total amount
    const totalPrice = items.reduce((total, item) => total + item.quantity * item.price, 0) + parseFloat(formData.transportPrice);
    doc.text(`Total: ₦${totalPrice}`, 20, doc.lastAutoTable.finalY + 20);

    doc.save('invoice.pdf');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Invoice Generator - Wunmi's Kitchen</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Customer Name</label>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Customer Address</label>
        <input
          type="text"
          name="customerAddress"
          value={formData.customerAddress}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Item Name</label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          min="1"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Price per Item (₦)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          min="0"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Rental Date</label>
        <input
          type="date"
          name="rentalDate"
          value={formData.rentalDate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Transport Price (₦)</label>
        <input
          type="number"
          name="transportPrice"
          value={formData.transportPrice}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <button
        type="button"
        className="w-full bg-blue-500 text-white p-3 rounded mb-4"
        onClick={addItem}
      >
        Add Item
      </button>

      <button
        type="button"
        className="w-full bg-green-500 text-white p-3 rounded"
        onClick={generatePDF}
      >
        Generate Invoice (PDF)
      </button>
    </div>
  );
}
