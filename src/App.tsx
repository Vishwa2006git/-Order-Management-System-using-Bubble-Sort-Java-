import React, { Component, useState, useEffect, useRef } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './AuthContext';
import { Layout } from './components/Layout';
import { db, collection, onSnapshot, query, orderBy, addDoc, doc, updateDoc, where, handleFirestoreError, OperationType } from './firebase';
import { geminiService } from './services/geminiService';
import { 
  Plus, 
  Search, 
  Star, 
  MessageSquare, 
  Send, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Package,
  Terminal,
  Image as ImageIcon,
  ChevronRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

// --- Java Logic Simulation ---
class JavaOrderSystem {
  orders: any[] = [];
  maxOrders = 100;

  insertOrder(id: number, name: string, amount: number) {
    if (this.orders.length >= this.maxOrders) return "Error: System full.";
    if (this.orders.some(o => o.orderId === id)) return `Error: ID ${id} already exists.`;
    this.orders.push({ orderId: id, customerName: name, amount: amount });
    return "Order inserted successfully.";
  }

  bubbleSort() {
    let n = this.orders.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (this.orders[j].orderId > this.orders[j + 1].orderId) {
          let temp = this.orders[j];
          this.orders[j] = this.orders[j + 1];
          this.orders[j + 1] = temp;
        }
      }
    }
    return "Orders sorted using Bubble Sort.";
  }

  linearSearch(id: number) {
    for (let i = 0; i < this.orders.length; i++) {
      if (this.orders[i].orderId === id) {
        return this.orders[i];
      }
    }
    return null;
  }
}

// --- Java Console Component ---
const JavaConsole: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const system = useRef(new JavaOrderSystem());
  const inputBuffer = useRef('');

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#1a1a1a',
        foreground: '#f87171',
        cursor: '#ef4444',
      },
      fontSize: 14,
      fontFamily: 'JetBrains Mono, monospace',
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    xtermRef.current = term;

    term.writeln('\x1b[1;31mJava Order Management System v1.0\x1b[0m');
    term.writeln('-----------------------------------');
    showMenu();

    term.onData(data => {
      if (data === '\r') { // Enter
        const input = inputBuffer.current.trim();
        term.write('\r\n');
        handleInput(input);
        inputBuffer.current = '';
      } else if (data === '\u007f') { // Backspace
        if (inputBuffer.current.length > 0) {
          inputBuffer.current = inputBuffer.current.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        inputBuffer.current += data;
        term.write(data);
      }
    });

    return () => term.dispose();
  }, []);

  const showMenu = () => {
    const term = xtermRef.current;
    if (!term) return;
    term.writeln('\r\n1. Insert Order');
    term.writeln('2. Display Orders');
    term.writeln('3. Sort Orders (Bubble Sort)');
    term.writeln('4. Search Order (Linear Search)');
    term.writeln('5. Exit');
    term.write('\r\nSelect option: ');
  };

  const handleInput = (input: string) => {
    const term = xtermRef.current;
    if (!term) return;

    switch (input) {
      case '1':
        term.write('Enter Order ID: ');
        waitForInput((idStr) => {
          term.write('\r\nEnter Customer Name: ');
          waitForInput((name) => {
            term.write('\r\nEnter Amount: ');
            waitForInput((amountStr) => {
              const res = system.current.insertOrder(parseInt(idStr), name, parseFloat(amountStr));
              term.writeln(`\r\n${res}`);
              showMenu();
            });
          });
        });
        break;
      case '2':
        term.writeln('\r\nID         | Name                 | Amount');
        term.writeln('------------------------------------------');
        system.current.orders.forEach(o => {
          term.writeln(`${o.orderId.toString().padEnd(10)} | ${o.customerName.padEnd(20)} | ${o.amount.toFixed(2)}`);
        });
        showMenu();
        break;
      case '3':
        term.writeln(`\r\n${system.current.bubbleSort()}`);
        showMenu();
        break;
      case '4':
        term.write('Enter ID to search: ');
        waitForInput((idStr) => {
          const found = system.current.linearSearch(parseInt(idStr));
          if (found) {
            term.writeln(`\r\nFound: ${found.customerName} - $${found.amount.toFixed(2)}`);
          } else {
            term.writeln('\r\nOrder not found.');
          }
          showMenu();
        });
        break;
      case '5':
        term.writeln('\r\nExiting system...');
        setTimeout(() => window.location.reload(), 1000);
        break;
      default:
        term.writeln('\r\nInvalid option.');
        showMenu();
    }
  };

  const waitForInput = (callback: (val: string) => void) => {
    const term = xtermRef.current;
    if (!term) return;
    let buffer = '';
    const disposable = term.onData(data => {
      if (data === '\r') {
        disposable.dispose();
        callback(buffer.trim());
      } else if (data === '\u007f') {
        if (buffer.length > 0) {
          buffer = buffer.slice(0, -1);
          term.write('\b \b');
        }
      } else {
        buffer += data;
        term.write(data);
      }
    });
  };

  return (
    <div className="bg-slate-900 p-6 rounded-[32px] shadow-2xl border border-red-900/30">
      <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
        </div>
        <span className="text-xs font-mono text-slate-400 ml-2">OrderManagementSystem.java</span>
      </div>
      <div ref={terminalRef} className="h-[400px]" />
    </div>
  );
};

// --- Main App Component ---
function MainApp() {
  const { user, profile, loading, login } = useAuth();
  const [activeTab, setActiveTab] = useState('menu');
  const [menu, setMenu] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', imageUrl: '' });
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isChatting, setIsChatting] = useState(false);

  // Fetch Menu
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'menu'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMenu(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'menu'));
    return () => unsubscribe();
  }, [user]);

  // Fetch Orders
  useEffect(() => {
    if (!user || !profile) return;
    const q = profile.role === 'owner' 
      ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'orders'), where('customerId', '==', user.uid), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));
    return () => unsubscribe();
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[48px] shadow-2xl max-w-md w-full text-center border border-red-100"
        >
          <div className="w-24 h-24 bg-red-600 rounded-[32px] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-red-200">
            <Package className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">RedFlow</h1>
          <p className="text-slate-500 mb-10">Welcome back! Please sign in to access the system.</p>
          <button 
            onClick={login}
            className="w-full bg-red-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-4 shadow-lg shadow-red-200 group"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-7 h-7 bg-white rounded-full p-1 group-hover:scale-110 transition-transform" alt="Google" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  const handleAddMenuItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.description) return;
    try {
      await addDoc(collection(db, 'menu'), {
        ...newItem,
        price: parseFloat(newItem.price),
        createdAt: new Date().toISOString()
      });
      setNewItem({ name: '', price: '', description: '', imageUrl: '' });
      setIsAddingItem(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'menu');
    }
  };

  const generateImage = async () => {
    if (!newItem.name || !newItem.description) return;
    setIsGeneratingImage(true);
    const url = await geminiService.generateMenuImage(newItem.name, newItem.description);
    if (url) setNewItem({ ...newItem, imageUrl: url });
    setIsGeneratingImage(false);
  };

  const placeOrder = async (item: any) => {
    try {
      const orderData = {
        customerId: user.uid,
        customerName: user.displayName || 'Customer',
        items: [{ menuId: item.id, name: item.name, quantity: 1, price: item.price }],
        totalAmount: item.price,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const analysis = await geminiService.analyzeOrder(orderData);
      await addDoc(collection(db, 'orders'), {
        ...orderData,
        aiAnalysis: analysis.summary,
        suggestedRating: analysis.suggestedRating
      });
      alert("Order placed! AI analyzed your choice.");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  const submitFeedback = async (orderId: string, rating: number, feedback: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { rating, feedback });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);
    const aiMsg = await geminiService.clearDoubt(userMsg, menu);
    setChatHistory(prev => [...prev, { role: 'ai', text: aiMsg }]);
    setIsChatting(false);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AnimatePresence mode="wait">
        {activeTab === 'menu' && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-display font-bold text-red-600">Restaurant Menu</h2>
                <p className="text-slate-500 text-sm">Select items to place your order.</p>
              </div>
              {profile?.role === 'owner' && (
                <button 
                  onClick={() => setIsAddingItem(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
                >
                  <Plus className="w-5 h-5" /> Add New Item
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menu.map(item => (
                <div key={item.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-red-50 hover:shadow-2xl transition-all group">
                  <div className="h-56 bg-red-100 relative">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-red-300">
                        <ImageIcon className="w-16 h-16" />
                      </div>
                    )}
                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl text-sm font-bold text-red-600 shadow-lg">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">{item.name}</h3>
                    <p className="text-slate-500 text-sm mb-8 line-clamp-2 leading-relaxed">{item.description}</p>
                    {profile?.role === 'customer' && (
                      <button 
                        onClick={() => placeOrder(item)}
                        className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
                      >
                        Order Now
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'java-console' && (
          <motion.div key="console" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-display font-bold text-red-600">Java System Console</h2>
                <p className="text-slate-500 text-sm">Interactive menu-driven logic powered by Java structure.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl text-xs font-bold">
                <Terminal className="w-4 h-4" />
                SYSTEM ACTIVE
              </div>
            </div>
            <JavaConsole />
          </motion.div>
        )}

        {(activeTab === 'dashboard' || activeTab === 'my-orders') && (
          <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h2 className="text-3xl font-display font-bold text-red-600">Order History</h2>
            <div className="grid grid-cols-1 gap-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-red-50 hover:border-red-200 transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order Ref: {order.id.slice(-8)}</p>
                      <h4 className="text-xl font-bold text-slate-800">{order.items[0].name} {order.items.length > 1 && `+${order.items.length - 1} more`}</h4>
                      <p className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase">Total</p>
                        <p className="text-lg font-bold text-red-600">${order.totalAmount.toFixed(2)}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  {order.aiAnalysis && (
                    <div className="bg-red-50/50 p-6 rounded-3xl mb-6 border border-red-100 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles className="w-12 h-12 text-red-600" />
                      </div>
                      <p className="text-[10px] font-bold text-red-500 uppercase mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> AI Intelligence Analysis
                      </p>
                      <p className="text-sm text-red-900 leading-relaxed italic">"{order.aiAnalysis}"</p>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-red-50">
                    {profile?.role === 'customer' && !order.rating ? (
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-bold text-slate-600">Rate Experience:</span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button 
                              key={star} 
                              onClick={() => submitFeedback(order.id, star, "Excellent service and quality!")}
                              className="text-slate-200 hover:text-amber-400 hover:scale-110 transition-all"
                            >
                              <Star className="w-6 h-6 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : order.rating ? (
                      <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < order.rating ? 'text-amber-400 fill-current' : 'text-slate-100'}`} />
                          ))}
                        </div>
                        <p className="text-sm text-slate-500 italic">"{order.feedback}"</p>
                      </div>
                    ) : <div />}
                    
                    <button className="text-xs font-bold text-red-600 hover:underline">View Receipt</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'help' && (
          <motion.div key="help" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-180px)] flex flex-col bg-white rounded-[40px] shadow-sm border border-red-50 overflow-hidden">
            <div className="p-6 bg-red-600 text-white flex items-center gap-3">
              <HelpCircle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">AI Assistant</h3>
                <p className="text-[10px] opacity-80">Ask me anything about our menu or your orders.</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 p-8">
              {chatHistory.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                  <MessageSquare className="w-16 h-16" />
                  <p className="text-sm">How can I help you today?</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-5 rounded-[24px] text-sm leading-relaxed ${
                    msg.role === 'user' ? 'bg-red-600 text-white rounded-tr-none shadow-lg shadow-red-100' : 'bg-red-50 text-red-900 rounded-tl-none border border-red-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatting && (
                <div className="flex justify-start">
                  <div className="bg-red-50 p-5 rounded-[24px] rounded-tl-none border border-red-100">
                    <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-50 border-t border-red-50 flex gap-3">
              <input 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Type your question here..."
                className="flex-1 bg-white border-red-100 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
              />
              <button 
                onClick={handleChat} 
                disabled={!chatInput.trim() || isChatting}
                className="p-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg shadow-red-200"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAddingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddingItem(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl relative z-10 p-10 border border-red-100">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-display font-bold text-slate-800">New Menu Item</h3>
                <button onClick={() => setIsAddingItem(false)} className="p-2 hover:bg-red-50 rounded-full transition-all text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Item Name</label>
                    <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="e.g. Spicy Ramen" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-red-500/20 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Price ($)</label>
                    <input type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} placeholder="0.00" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-red-500/20 transition-all outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Description</label>
                  <textarea value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} placeholder="Describe the flavors and ingredients..." className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm h-32 focus:ring-2 focus:ring-red-500/20 transition-all outline-none resize-none" />
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={generateImage} 
                    disabled={isGeneratingImage || !newItem.name} 
                    className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-red-100 transition-all disabled:opacity-50"
                  >
                    {isGeneratingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    AI Image
                  </button>
                  <button 
                    onClick={handleAddMenuItem} 
                    disabled={!newItem.name || !newItem.price}
                    className="flex-[1.5] bg-red-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
                  >
                    Publish to Menu
                  </button>
                </div>
                {newItem.imageUrl && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl overflow-hidden h-40 border-4 border-red-50 shadow-inner">
                    <img src={newItem.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <p className="absolute bottom-3 left-4 text-[10px] font-bold text-white uppercase tracking-widest">AI Generated Preview</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}
