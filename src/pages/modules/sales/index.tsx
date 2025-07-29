import React, { useState } from 'react';
import { 
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  UserIcon,
  CreditCardIcon,
  BanknotesIcon,
  QrCodeIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Layout from '@/components/layout/Layout';
import { Card, Button } from '@/design-system';

interface SaleItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  discount?: number;
}

interface Sale {
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  customer?: {
    id: string;
    name: string;
    phone: string;
  };
  paymentMethod?: 'cash' | 'card' | 'mobile';
}

const SalesPage: React.FC = () => {
  const [currentSale, setCurrentSale] = useState<Sale>({
    items: [
      {
        id: '1',
        productId: 'prod1',
        name: 'Paracétamol 500mg',
        price: 1200,
        quantity: 2,
        total: 2400
      },
      {
        id: '2',
        productId: 'prod2',
        name: 'Vitamine C 1000mg',
        price: 2500,
        quantity: 1,
        total: 2500
      }
    ],
    subtotal: 4900,
    discount: 0,
    tax: 490,
    total: 5390
  });

  const [productSearch, setProductSearch] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash');

  const [todaySales] = useState([
    { id: 1, time: '14:30', customer: 'Marie Kabila', amount: 12500, items: 3, method: 'card' },
    { id: 2, time: '14:15', customer: 'Paul Tshikala', amount: 8750, items: 2, method: 'cash' },
    { id: 3, time: '13:45', customer: 'Grace Mbuyi', amount: 15200, items: 5, method: 'mobile' },
    { id: 4, time: '13:20', customer: 'Pierre Kasongo', amount: 6800, items: 1, method: 'cash' },
    { id: 5, time: '12:55', customer: 'Sarah Lukonga', amount: 9500, items: 4, method: 'card' }
  ]);

  const availableProducts = [
    { id: 'prod1', name: 'Paracétamol 500mg', price: 1200, stock: 245 },
    { id: 'prod2', name: 'Vitamine C 1000mg', price: 2500, stock: 156 },
    { id: 'prod3', name: 'Amoxicilline 250mg', price: 2100, stock: 25 },
    { id: 'prod4', name: 'Ibuprofène 400mg', price: 1800, stock: 89 },
    { id: 'prod5', name: 'Oméprazole 20mg', price: 3200, stock: 67 }
  ];

  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    setCurrentSale(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
          : item
      )
    }));

    recalculateTotal();
  };

  const removeItem = (itemId: string) => {
    setCurrentSale(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
    recalculateTotal();
  };

  const addProduct = (product: typeof availableProducts[0]) => {
    const existingItem = currentSale.items.find(item => item.productId === product.id);
    
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: SaleItem = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price
      };

      setCurrentSale(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
      recalculateTotal();
    }
  };

  const recalculateTotal = () => {
    setTimeout(() => {
      setCurrentSale(prev => {
        const subtotal = prev.items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.1; // 10% TVA
        const total = subtotal - prev.discount + tax;
        
        return {
          ...prev,
          subtotal,
          tax,
          total
        };
      });
    }, 0);
  };

  const completeSale = () => {
    if (currentSale.items.length === 0) return;
    
    // Simuler la finalisation de la vente
    alert('Vente finalisée avec succès!');
    
    // Réinitialiser
    setCurrentSale({
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0
    });
    setPaymentAmount('');
  };

  const change = paymentAmount ? parseFloat(paymentAmount) - currentSale.total : 0;

  const stats = [
    {
      title: 'Ventes Aujourd\'hui',
      value: '125,500 FC',
      detail: '23 transactions',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Tickets Moyens',
      value: '8,750 FC',
      detail: '+12% vs hier',
      icon: ReceiptPercentIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Clients Servis',
      value: '18',
      detail: 'depuis 8h',
      icon: UserIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Vente Actuelle',
      value: currentSale.total.toLocaleString() + ' FC',
      detail: `${currentSale.items.length} articles`,
      icon: ShoppingCartIcon,
      color: 'bg-indigo-500'
    }
  ];

  const paymentMethods = [
    { id: 'cash', name: 'Espèces', icon: BanknotesIcon, color: 'bg-green-100 text-green-800' },
    { id: 'card', name: 'Carte Bancaire', icon: CreditCardIcon, color: 'bg-blue-100 text-blue-800' },
    { id: 'mobile', name: 'Mobile Money', icon: QrCodeIcon, color: 'bg-purple-100 text-purple-800' }
  ] as const;

  return (
    <Layout title="Point de Vente">
      <div className="p-6 space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Point de Vente</h1>
            <p className="text-gray-600">Interface de caisse et gestion des transactions</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.detail}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Interface de vente principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zone de produits */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recherche produits */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rechercher Produits</h3>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product)}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.price.toLocaleString()} FC</p>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Panier */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Panier</h3>
              
              {currentSale.items.length > 0 ? (
                <div className="space-y-3">
                  {currentSale.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.price.toLocaleString()} FC × {item.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <MinusIcon className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <PlusIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="font-semibold text-gray-900 w-20 text-right">
                          {item.total.toLocaleString()} FC
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Totaux */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sous-total</span>
                      <span>{currentSale.subtotal.toLocaleString()} FC</span>
                    </div>
                    {currentSale.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Remise</span>
                        <span>-{currentSale.discount.toLocaleString()} FC</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>TVA (10%)</span>
                      <span>{currentSale.tax.toLocaleString()} FC</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t pt-2">
                      <span>Total</span>
                      <span>{currentSale.total.toLocaleString()} FC</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun article dans le panier</p>
                </div>
              )}
            </Card>
          </div>

          {/* Zone de paiement */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Paiement</h3>
              
              {/* Méthodes de paiement */}
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`w-full flex items-center p-3 border rounded-lg transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <method.icon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900">{method.name}</span>
                  </button>
                ))}
              </div>

              {/* Montant reçu */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant reçu
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>

                {paymentAmount && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Total à payer:</span>
                      <span className="font-medium">{currentSale.total.toLocaleString()} FC</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Montant reçu:</span>
                      <span className="font-medium">{parseFloat(paymentAmount || '0').toLocaleString()} FC</span>
                    </div>
                    <div className={`flex justify-between font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span>Monnaie à rendre:</span>
                      <span>{Math.max(0, change).toLocaleString()} FC</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCurrentSale({ items: [], subtotal: 0, discount: 0, tax: 0, total: 0 })}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={completeSale}
                  disabled={currentSale.items.length === 0 || change < 0}
                >
                  Finaliser
                </Button>
              </div>
            </Card>

            {/* Historique du jour */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventes du Jour</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {todaySales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sale.time}</p>
                      <p className="text-xs text-gray-600">{sale.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{sale.amount.toLocaleString()} FC</p>
                      <p className="text-xs text-gray-600">{sale.items} articles</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SalesPage;