import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckSquare, Square, Plus, Trash2, ListChecks, Plane, Shirt, Bath, Plug } from 'lucide-react-native';

const generateSmartList = (destination, duration) => {
  const destLower = (destination || '').toLowerCase();
  
  const isCold = ['switzerland', 'canada', 'norway', 'iceland', 'alaska', 'sweden', 'finland', 'russia'].some(w => destLower.includes(w));
  const isHot = ['dubai', 'thailand', 'singapore', 'goa', 'maldives', 'kerala', 'bali', 'hawaii', 'mexico', 'egypt'].some(w => destLower.includes(w));
  const isRainy = ['monsoon', 'seattle', 'london', 'cherrapunji', 'scotland'].some(w => destLower.includes(w));
  
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
      { id: 'doc-3', text: 'Travel Insurance', category: 'documents' },
      { id: 'doc-4', text: 'Flight / Hotel Bookings', category: 'documents' },
      { id: 'doc-5', text: 'Cash / Credit Cards', category: 'documents' },
      { id: 'doc-6', text: 'Emergency Contacts', category: 'documents' }
    ],
    clothing: [
      { id: 'clo-1', text: `T-Shirts / Tops (${shirtCount})`, category: 'clothing' },
      { id: 'clo-2', text: 'Long Pants / Jeans (2-3)', category: 'clothing' },
      { id: 'clo-3', text: `Undergarments (${underwearCount})`, category: 'clothing' },
      { id: 'clo-4', text: `Socks (${socksCount})`, category: 'clothing' },
      { id: 'clo-5', text: 'Comfortable Shoes', category: 'clothing' },
      { id: 'clo-6', text: 'Casual / Evening Wear', category: 'clothing' },
      { id: 'clo-7', text: 'Sleepwear', category: 'clothing' }
    ],
    toiletries: [
      { id: 'toi-1', text: 'Toothbrush & Paste', category: 'toiletries' },
      { id: 'toi-2', text: 'Deodorant', category: 'toiletries' },
      { id: 'toi-3', text: 'Shampoo & Conditioner', category: 'toiletries' },
      { id: 'toi-4', text: 'Skincare Products', category: 'toiletries' },
      { id: 'toi-5', text: 'Hand Sanitizer', category: 'toiletries' },
      { id: 'toi-6', text: 'First Aid Kit', category: 'toiletries' }
    ],
    electronics: [
      { id: 'ele-1', text: 'Phone Charger & Cable', category: 'electronics' },
      { id: 'ele-2', text: 'Power Bank', category: 'electronics' },
      { id: 'ele-3', text: 'Universal Adapter', category: 'electronics' },
      { id: 'ele-4', text: 'Headphones', category: 'electronics' }
    ]
  };

  if (isCold) {
    list.clothing.push(
      { id: 'cold-1', text: 'Winter Jacket', category: 'clothing' },
      { id: 'cold-2', text: 'Thermal Wear', category: 'clothing' },
      { id: 'cold-3', text: 'Gloves & Beanie', category: 'clothing' }
    );
  }

  if (isHot) {
    list.clothing.push(
      { id: 'hot-1', text: 'Swimsuit & Shorts', category: 'clothing' },
      { id: 'hot-2', text: 'Flip Flops', category: 'clothing' },
      { id: 'hot-3', text: 'Hat', category: 'clothing' }
    );
    list.toiletries.push(
      { id: 'hot-4', text: 'Sunscreen', category: 'toiletries' }
    );
  }

  return list;
};

export default function PackingListGenerator({ tripId, destination, totalDays }) {
  const STORAGE_KEY = `packing-list-${tripId}`;
  
  const [categories, setCategories] = useState({ documents: [], clothing: [], toiletries: [], electronics: [] });
  const [checkedItems, setCheckedItems] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tripId, destination, totalDays]);

  const loadData = async () => {
    const smartList = generateSmartList(destination, totalDays);
    setCategories(smartList);
    
    try {
      const savedDataStr = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedDataStr) {
        const parsed = JSON.parse(savedDataStr);
        setCheckedItems(parsed.checkedItems || {});
        setCustomItems(parsed.customItems || []);
      }
    } catch (e) {
      console.error("Failed to load packing list", e);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newChecked, newCustom) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        checkedItems: newChecked,
        customItems: newCustom
      }));
    } catch (e) {
      console.error("Failed to save packing list", e);
    }
  };

  const toggleItem = (id) => {
    const newChecked = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newChecked);
    saveData(newChecked, customItems);
  };

  const handleAddCustomItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      category: 'custom'
    };
    
    const newCustom = [...customItems, newItem];
    setCustomItems(newCustom);
    setNewItemText('');
    saveData(checkedItems, newCustom);
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
    saveData(newChecked, customItems);
  };

  const clearAll = () => {
    setCheckedItems({});
    saveData({}, customItems);
  };

  const removeCustomItem = (id) => {
     const newCustom = customItems.filter(item => item.id !== id);
     const newChecked = { ...checkedItems };
     delete newChecked[id];
     setCustomItems(newCustom);
     setCheckedItems(newChecked);
     saveData(newChecked, newCustom);
  };

  if (loading) {
     return <ActivityIndicator color="#f97316" className="my-10" />
  }

  const allItems = [...Object.values(categories).flat(), ...customItems];
  const totalCount = allItems.length;
  const packedCount = allItems.filter(item => checkedItems[item.id]).length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((packedCount / totalCount) * 100);

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'documents': return <Plane color="#3b82f6" size={20} />;
      case 'clothing': return <Shirt color="#f97316" size={20} />;
      case 'toiletries': return <Bath color="#14b8a6" size={20} />;
      case 'electronics': return <Plug color="#a855f7" size={20} />;
      default: return null;
    }
  };

  const renderList = (items) => {
    return items.map(item => {
      const isChecked = !!checkedItems[item.id];
      const isCustom = item.category === 'custom';
      return (
        <TouchableOpacity 
          key={item.id} 
          onPress={() => toggleItem(item.id)}
          activeOpacity={0.7}
          className={`flex-row items-center justify-between p-3 rounded-xl border mb-2 ${
            isChecked 
              ? 'bg-gray-800/80 border-gray-700/50' 
              : 'bg-white/5 border-gray-700/80'
          }`}
        >
          <View className="flex-row items-center gap-3 flex-1 pr-2">
            {isChecked ? <CheckSquare color="#f97316" size={20} /> : <Square color="#6b7280" size={20} />}
            <Text className={`text-sm flex-1 ${isChecked ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
              {item.text}
            </Text>
          </View>
          {isCustom && (
            <TouchableOpacity onPress={() => removeCustomItem(item.id)} className="px-2 py-1 bg-red-500/10 rounded-lg">
               <Trash2 color="#ef4444" size={16} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      );
    });
  };

  return (
    <View className="bg-[#020817] rounded-3xl border border-gray-800 w-full mb-10 overflow-hidden">
      
      {/* Header */}
      <View className="bg-gray-900 border-b border-gray-800 px-6 py-6 pb-4">
        <Text className="text-2xl font-black text-white mb-1">📋 Packing List</Text>
        <Text className="text-gray-400 font-medium mb-6 text-xs uppercase tracking-wider">For {destination?.split(',')[0] || 'Unknown'}</Text>
        
        {/* Progress bar */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-orange-400 text-[10px] font-bold uppercase tracking-widest">Progress</Text>
          <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{packedCount} / {totalCount} Packed</Text>
        </View>
        <View className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <View className="h-full bg-orange-500 rounded-full" style={{ width: `${progressPercent}%` }} />
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity onPress={markAllPacked} className="flex-1 bg-gray-800 border border-gray-700 p-2.5 rounded-xl flex-row justify-center items-center gap-2">
            <ListChecks color="#34d399" size={16} />
            <Text className="text-white font-bold text-xs uppercase tracking-wide">Mark All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAll} className="flex-1 bg-gray-800 border border-gray-700 p-2.5 rounded-xl flex-row justify-center items-center gap-2">
            <Trash2 color="#ef4444" size={16} />
            <Text className="text-white font-bold text-xs uppercase tracking-wide">Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid Content */}
      <View className="px-5 py-6">
        
        {['documents', 'clothing', 'toiletries', 'electronics'].map(cat => (
          <View key={cat} className="mb-6">
            <View className="flex-row items-center gap-2 mb-3 px-1">
              {getCategoryIcon(cat)}
              <Text className="text-gray-300 font-bold uppercase tracking-widest text-xs">{cat}</Text>
            </View>
            <View>
              {renderList(categories[cat])}
            </View>
          </View>
        ))}

        {/* Custom Items */}
        <View className="mt-2 bg-white/5 p-4 rounded-2xl border border-white/5">
          <View className="flex-row items-center gap-2 mb-3 border-b border-gray-800/80 pb-3">
            <Plus color="#10b981" size={16} />
            <Text className="text-gray-300 font-bold uppercase tracking-widest text-xs">Custom Items</Text>
          </View>
          
          <View className="flex-row gap-2 mb-4 mt-2">
            <TextInput 
              value={newItemText}
              onChangeText={setNewItemText}
              placeholder="Add custom item..."
              placeholderTextColor="#4b5563"
              className="flex-1 bg-black border border-gray-800 rounded-xl px-4 py-3 text-white font-medium text-sm"
            />
            <TouchableOpacity 
              onPress={handleAddCustomItem} 
              className="bg-gray-800 justify-center items-center px-4 rounded-xl border border-gray-700"
            >
              <Plus color="#f97316" size={24} />
            </TouchableOpacity>
          </View>

          <View>
            {customItems.length > 0 ? renderList(customItems) : (
              <Text className="text-gray-500 text-xs text-center py-2 italic font-medium">No custom items added.</Text>
            )}
          </View>
        </View>

      </View>
    </View>
  );
}
