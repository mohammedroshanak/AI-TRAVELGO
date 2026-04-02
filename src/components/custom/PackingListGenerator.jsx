import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Printer, 
  Download, 
  ListChecks, 
  Trash2, 
  Bell, 
  Plane, 
  Shirt, 
  Bath, 
  Plug,
  CalendarClock
} from 'lucide-react';

const generateSmartList = (destination, duration) => {
  const destLower = (destination || '').toLowerCase();
  
  const isCold = ['switzerland', 'canada', 'norway', 'iceland', 'alaska', 'sweden', 'finland', 'russia'].some(w => destLower.includes(w));
  const isHot = ['dubai', 'thailand', 'singapore', 'goa', 'maldives', 'kerala', 'bali', 'hawaii', 'mexico', 'egypt'].some(w => destLower.includes(w));
  const isRainy = ['monsoon', 'seattle', 'london', 'cherrapunji', 'scotland'].some(w => destLower.includes(w));
  
  // Extract number of days
  const daysMatch = String(duration).match(/\d+/);
  const days = daysMatch ? parseInt(daysMatch[0], 10) : 3;
  
  let shirtCount = 3;
  let socksCount = 3;
  let underwearCount = 4;
  
  if (days >= 4 && days <= 7) {
    shirtCount = 5;
    socksCount = 5;
    underwearCount = 6;
  } else if (days >= 8) {
    shirtCount = 8;
    socksCount = 8;
    underwearCount = 10;
  }

  const list = {
    documents: [
      { id: 'doc-1', text: 'Passport / Travel ID', category: 'documents' },
      { id: 'doc-2', text: 'Visa (if required)', category: 'documents' },
      { id: 'doc-3', text: 'Travel Insurance Documents', category: 'documents' },
      { id: 'doc-4', text: 'Flight / Hotel Bookings', category: 'documents' },
      { id: 'doc-5', text: 'Cash / Credit Cards', category: 'documents' },
      { id: 'doc-6', text: 'Emergency Contact List', category: 'documents' }
    ],
    clothing: [
      { id: 'clo-1', text: `T-Shirts / Casual Tops (${shirtCount})`, category: 'clothing' },
      { id: 'clo-2', text: 'Long Pants / Jeans (2-3)', category: 'clothing' },
      { id: 'clo-3', text: `Undergarments (${underwearCount})`, category: 'clothing' },
      { id: 'clo-4', text: `Socks (${socksCount})`, category: 'clothing' },
      { id: 'clo-5', text: 'Comfortable Walking Shoes', category: 'clothing' },
      { id: 'clo-6', text: 'Casual / Evening Wear', category: 'clothing' },
      { id: 'clo-7', text: 'Sleepwear', category: 'clothing' }
    ],
    toiletries: [
      { id: 'toi-1', text: 'Toothbrush & Toothpaste', category: 'toiletries' },
      { id: 'toi-2', text: 'Deodorant', category: 'toiletries' },
      { id: 'toi-3', text: 'Shampoo & Conditioner', category: 'toiletries' },
      { id: 'toi-4', text: 'Skincare Products', category: 'toiletries' },
      { id: 'toi-5', text: 'Hand Sanitizer', category: 'toiletries' },
      { id: 'toi-6', text: 'Medications & First Aid Kit', category: 'toiletries' },
      { id: 'toi-7', text: 'Towel / Face Cloth', category: 'toiletries' }
    ],
    electronics: [
      { id: 'ele-1', text: 'Phone Charger & Cable', category: 'electronics' },
      { id: 'ele-2', text: 'Power Bank', category: 'electronics' },
      { id: 'ele-3', text: 'Universal Travel Adapter', category: 'electronics' },
      { id: 'ele-4', text: 'Headphones / Earbuds', category: 'electronics' }
    ]
  };

  // Smart Additions
  if (isCold) {
    list.clothing.push(
      { id: 'cold-1', text: 'Winter Jacket', category: 'clothing' },
      { id: 'cold-2', text: 'Thermal Wear', category: 'clothing' },
      { id: 'cold-3', text: 'Gloves', category: 'clothing' },
      { id: 'cold-4', text: 'Scarves', category: 'clothing' },
      { id: 'cold-5', text: 'Wool Socks', category: 'clothing' },
      { id: 'cold-6', text: 'Winter Boots', category: 'clothing' },
      { id: 'cold-7', text: 'Beanie', category: 'clothing' }
    );
  }

  if (isHot) {
    list.clothing.push(
      { id: 'hot-1', text: 'Light breathable clothing', category: 'clothing' },
      { id: 'hot-2', text: 'Swimsuit', category: 'clothing' },
      { id: 'hot-3', text: 'Shorts', category: 'clothing' },
      { id: 'hot-4', text: 'Flip Flops', category: 'clothing' },
      { id: 'hot-5', text: 'Hat', category: 'clothing' }
    );
    list.toiletries.push(
      { id: 'hot-6', text: 'Sunscreen', category: 'toiletries' },
      { id: 'hot-7', text: 'Aloe vera', category: 'toiletries' },
      { id: 'hot-8', text: 'Sunglasses', category: 'documents' } // Or electronics/essentials
    );
  }

  if (isRainy || destLower.includes('rain')) {
    list.clothing.push(
      { id: 'rain-1', text: 'Raincoat / Rain Jacket', category: 'clothing' },
      { id: 'rain-2', text: 'Waterproof Shoes', category: 'clothing' }
    );
    list.documents.push(
      { id: 'rain-3', text: 'Waterproof Bag', category: 'documents' },
      { id: 'rain-4', text: 'Umbrella', category: 'documents' }
    );
  }

  return list;
};

function PackingListGenerator({ tripId, destination, totalDays }) {
  const STORAGE_KEY = `packing-list-${tripId}`;
  
  // State
  const [categories, setCategories] = useState({ documents: [], clothing: [], toiletries: [], electronics: [] });
  const [checkedItems, setCheckedItems] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [reminder, setReminder] = useState(null);
  const [reminderActive, setReminderActive] = useState(false);

  // Load / Initialize Data
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const smartList = generateSmartList(destination, totalDays);
    
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setCheckedItems(parsed.checkedItems || {});
      setCustomItems(parsed.customItems || []);
      setReminder(parsed.reminder || null);
      
      // Check reminder
      if (parsed.reminder && Date.now() >= parsed.reminder) {
        setReminderActive(true);
      }
    }
    
    setCategories(smartList);
  }, [tripId, destination, totalDays]);

  // Save to persistence whenever state changes
  useEffect(() => {
    // Prevent overriding with empty object before initialization
    if (Object.keys(categories).some(k => categories[k].length > 0)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        checkedItems,
        customItems,
        reminder
      }));
    }
  }, [checkedItems, customItems, reminder, STORAGE_KEY, categories]);

  const toggleItem = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    
    const newItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      category: 'custom'
    };
    
    setCustomItems([...customItems, newItem]);
    setNewItemText('');
  };

  const markAllPacked = () => {
    const newChecked = {};
    Object.values(categories).flat().forEach(item => {
      newChecked[item.id] = true;
    });
    customItems.forEach(item => {
      newChecked[item.id] = true;
    });
    setCheckedItems(newChecked);
  };

  const clearAll = () => {
    setCheckedItems({});
  };

  const printList = () => {
    window.print();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Smart Packing List`, 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Destination: ${destination || 'Unknown'}`, 20, 30);
    doc.text(`Duration: ${totalDays || 'N/A'} Days`, 20, 36);

    let yPos = 50;

    const renderCategoryToPDF = (title, items) => {
      if (items.length === 0) return;
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(title, 20, yPos);
      yPos += 8;

      doc.setFontSize(11);
      doc.setTextColor(50);
      items.forEach(item => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        const isChecked = checkedItems[item.id];
        const box = isChecked ? '[X]' : '[ ]';
        doc.text(`${box} ${item.text}`, 25, yPos);
        yPos += 7;
      });
      yPos += 5;
    };

    renderCategoryToPDF('DOCUMENTS & ESSENTIALS', categories.documents);
    renderCategoryToPDF('CLOTHING', categories.clothing);
    renderCategoryToPDF('TOILETRIES & PERSONAL CARE', categories.toiletries);
    renderCategoryToPDF('ELECTRONICS', categories.electronics);
    renderCategoryToPDF('CUSTOM ITEMS', customItems);

    doc.save(`Traveezy-Packing-${destination?.split(',')[0] || 'List'}.pdf`);
  };

  const handleSetReminder = (daysOut) => {
    // Simplification: set reminder X seconds/days from now. 
    // In a real app with a fixed departure date, you'd calculate against the departure date.
    // For this UI requirements, we capture the intent and store the target timestamp.
    const targetDate = Date.now() + (daysOut * 24 * 60 * 60 * 1000);
    setReminder(targetDate);
    setReminderActive(false);
    alert(`Reminder set for ${daysOut} day(s) from now!`);
  };

  // Progress calculations
  const totalCategoryItems = Object.values(categories).flat();
  const allItems = [...totalCategoryItems, ...customItems];
  const totalCount = allItems.length;
  const packedCount = allItems.filter(item => checkedItems[item.id]).length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((packedCount / totalCount) * 100);

  const renderCategoryIcon = (category) => {
    switch(category) {
      case 'documents': return <Plane className="w-5 h-5 text-blue-500" />;
      case 'clothing': return <Shirt className="w-5 h-5 text-orange-500" />;
      case 'toiletries': return <Bath className="w-5 h-5 text-teal-500" />;
      case 'electronics': return <Plug className="w-5 h-5 text-purple-500" />;
      default: return null;
    }
  };

  const renderList = (items, categoryColorClass) => {
    return items.map(item => {
      const isChecked = checkedItems[item.id];
      return (
        <div 
          key={item.id} 
          onClick={() => toggleItem(item.id)}
          className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 border ${
            isChecked 
              ? 'bg-gray-800/80 border-gray-700/50 opacity-60 line-through text-gray-400' 
              : 'bg-gray-900/50 border-gray-800 hover:border-gray-600 hover:bg-gray-800 text-gray-200'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {isChecked ? <CheckSquare className="w-5 h-5 text-orange-500" /> : <Square className="w-5 h-5 text-gray-500" />}
          </div>
          <span className="text-sm font-medium leading-tight pt-0.5 select-none">{item.text}</span>
        </div>
      );
    });
  };

  return (
    <div className="mt-16 mb-20 bg-gray-950 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden font-sans print-wrapper">
      
      {/* Header Area */}
      <div className="bg-gradient-to-r from-gray-900 to-black p-6 md:p-8 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between lg:items-end gap-6">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 mb-2">
              📋 Smart Packing List
            </h2>
            <p className="text-gray-400 font-medium">For {destination?.split(',')[0] || 'Unknown'} ({totalDays || '?'} days)</p>
            
            {/* Progress Bar */}
            <div className="mt-8 max-w-xl">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-orange-400 tracking-wide uppercase">Packing Progress</span>
                <span className="text-white bg-gray-800 px-3 py-1 rounded-full">{packedCount} / {totalCount} items ({progressPercent}%)</span>
              </div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div 
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-700 ease-out relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-white/20 opacity-50 block progress-stripe"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 shrink-0">
            <button onClick={markAllPacked} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-colors">
              <ListChecks className="w-4 h-4 text-green-400" /> Mark All Packed
            </button>
            <button onClick={clearAll} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-colors">
              <Trash2 className="w-4 h-4 text-red-400" /> Clear All
            </button>
            <button onClick={printList} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-colors hidden md:flex">
              <Printer className="w-4 h-4 text-blue-400" /> Print List
            </button>
            <button onClick={exportPDF} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 border border-orange-500 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Reminder Notification */}
      {reminderActive && (
        <div className="bg-orange-500/20 border-l-4 border-orange-500 p-4 mx-6 md:mx-8 mt-6 rounded-r-xl flex items-center gap-4">
          <div className="p-2 bg-orange-500/30 rounded-full animate-bounce">
            <Bell className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h4 className="text-orange-100 font-bold">Reminder: Start packing for your trip!</h4>
            <p className="text-orange-200/80 text-sm">Your trip to {destination?.split(',')[0]} is coming up. Let's get packing!</p>
          </div>
          <button onClick={() => setReminderActive(false)} className="ml-auto text-sm bg-orange-500/30 hover:bg-orange-500/50 px-3 py-1.5 rounded-lg text-white font-medium transition-colors">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid content */}
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* DOCUMENTS & ESSENTIALS */}
        <div className="space-y-4">
          <h3 className="font-black text-lg tracking-widest text-gray-300 flex items-center gap-2 uppercase border-b border-gray-800 pb-3">
            {renderCategoryIcon('documents')} Documents & Essentials
          </h3>
          <div className="grid gap-3">
            {renderList(categories.documents)}
          </div>
        </div>

        {/* CLOTHING */}
        <div className="space-y-4">
          <h3 className="font-black text-lg tracking-widest text-gray-300 flex items-center gap-2 uppercase border-b border-gray-800 pb-3">
            {renderCategoryIcon('clothing')} Clothing
          </h3>
          <div className="grid gap-3">
            {renderList(categories.clothing)}
          </div>
        </div>

        {/* TOILETRIES */}
        <div className="space-y-4">
          <h3 className="font-black text-lg tracking-widest text-gray-300 flex items-center gap-2 uppercase border-b border-gray-800 pb-3">
            {renderCategoryIcon('toiletries')} Toiletries & Personal Care
          </h3>
          <div className="grid gap-3">
            {renderList(categories.toiletries)}
          </div>
        </div>

        {/* ELECTRONICS */}
        <div className="space-y-4">
          <h3 className="font-black text-lg tracking-widest text-gray-300 flex items-center gap-2 uppercase border-b border-gray-800 pb-3">
            {renderCategoryIcon('electronics')} Electronics
          </h3>
          <div className="grid gap-3">
            {renderList(categories.electronics)}
          </div>
        </div>

        {/* CUSTOM ITEMS */}
        <div className="space-y-4 md:col-span-2 mt-4 bg-gray-900/30 p-6 rounded-3xl border border-gray-800/80">
          <h3 className="font-black text-lg tracking-widest text-gray-300 flex items-center gap-2 uppercase border-b border-gray-800 pb-3">
            <Plus className="w-5 h-5 text-green-500" /> Custom Items
          </h3>
          
          <form onSubmit={handleAddCustomItem} className="flex gap-3 mb-4 mt-2">
            <input 
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="E.g., Snorkel gear, Medications, Books..."
              className="flex-1 bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-gray-600 font-medium"
            />
            <button 
              type="submit" 
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-colors border border-gray-700 shrink-0 flex items-center gap-2"
              disabled={!newItemText.trim()}
            >
              <Plus className="w-5 h-5 text-orange-500" /> Add Item
            </button>
          </form>

          {customItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {renderList(customItems)}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic py-2">No custom items added yet.</p>
          )}
        </div>
      </div>

      {/* Footer Area (Reminders) */}
      <div className="bg-black/40 border-t border-gray-800 py-5 px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-orange-500" /> 
          Need a nudge before your trip?
        </p>
        <div className="flex gap-2">
           <button onClick={() => handleSetReminder(7)} className="px-3 py-1.5 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-lg text-xs font-bold text-gray-300 transition-all">
             Remind 1 Week Before
           </button>
           <button onClick={() => handleSetReminder(2)} className="px-3 py-1.5 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-lg text-xs font-bold text-gray-300 transition-all">
             Remind 2 Days Before
           </button>
           <button onClick={() => handleSetReminder(1)} className="px-3 py-1.5 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-lg text-xs font-bold text-gray-300 transition-all">
             Remind 1 Day Before
           </button>
        </div>
      </div>

    </div>
  );
}

export default PackingListGenerator;
