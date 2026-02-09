import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, Plus, Edit, Trash2, TrendingDown, AlertCircle } from 'lucide-react';
import { useGetDebts, useAddDebt, useUpdateDebt, useDeleteDebt, useAddDebtPayment } from '../hooks/useQueries';
import type { DebtRecord, DebtStatus } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DebtManagement() {
  const { data: debts = [], isLoading } = useGetDebts();
  const addDebt = useAddDebt();
  const updateDebt = useUpdateDebt();
  const deleteDebt = useDeleteDebt();
  const addPayment = useAddDebtPayment();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState<bigint | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  const [formData, setFormData] = useState({
    creditorName: '',
    amount: '',
    interestRate: '',
    dueDate: '',
  });

  const handleAddDebt = async () => {
    if (!formData.creditorName || !formData.amount) return;

    const status: DebtStatus = { __kind__: 'active', active: null };

    await addDebt.mutateAsync({
      creditorName: formData.creditorName,
      amount: BigInt(parseFloat(formData.amount) * 100),
      interestRate: BigInt(parseFloat(formData.interestRate || '0') * 100),
      dueDate: BigInt(new Date(formData.dueDate || Date.now()).getTime() * 1000000),
      payments: [],
      status,
    });

    setFormData({ creditorName: '', amount: '', interestRate: '', dueDate: '' });
    setIsAddDialogOpen(false);
  };

  const handleDeleteDebt = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this debt record?')) {
      await deleteDebt.mutateAsync(id);
    }
  };

  const openPaymentDialog = (debtId: bigint) => {
    setSelectedDebtId(debtId);
    setIsPaymentDialogOpen(true);
  };

  const handleAddPayment = async () => {
    if (selectedDebtId === null || !paymentAmount) return;

    const debt = debts.find(d => d.id === selectedDebtId);
    if (!debt) return;

    const amountPaid = BigInt(parseFloat(paymentAmount) * 100);
    const currentBalance = debt.payments.length > 0 
      ? debt.payments[debt.payments.length - 1].remainingBalance 
      : debt.amount;
    const remainingBalance = currentBalance - amountPaid;

    await addPayment.mutateAsync({
      debtId: selectedDebtId,
      payment: {
        paymentDate: BigInt(Date.now() * 1000000),
        amountPaid,
        remainingBalance: remainingBalance > 0n ? remainingBalance : 0n,
      },
    });

    setPaymentAmount('');
    setIsPaymentDialogOpen(false);
    setSelectedDebtId(null);
  };

  const calculateProgress = (debt: DebtRecord): number => {
    if (debt.payments.length === 0) return 0;
    const totalPaid = debt.payments.reduce((sum, p) => sum + Number(p.amountPaid), 0);
    const totalAmount = Number(debt.amount);
    return Math.min(100, (totalPaid / totalAmount) * 100);
  };

  const getCurrentBalance = (debt: DebtRecord): number => {
    if (debt.payments.length === 0) return Number(debt.amount);
    return Number(debt.payments[debt.payments.length - 1].remainingBalance);
  };

  const getChartData = (debt: DebtRecord) => {
    const data = [{ name: 'Start', balance: Number(debt.amount) / 100 }];
    debt.payments.forEach((payment, idx) => {
      data.push({
        name: `Payment ${idx + 1}`,
        balance: Number(payment.remainingBalance) / 100,
      });
    });
    return data;
  };

  const totalDebt = debts.reduce((sum, debt) => sum + getCurrentBalance(debt), 0) / 100;
  const totalOriginal = debts.reduce((sum, debt) => sum + Number(debt.amount), 0) / 100;
  const totalPaid = totalOriginal - totalDebt;

  if (isLoading) {
    return (
      <Card className="border-green-200">
        <CardContent className="py-8">
          <p className="text-center text-gray-600">Loading debts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Debt Management
            </CardTitle>
            <CardDescription>Track and manage your debts</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Debt
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Debt</DialogTitle>
                <DialogDescription>Enter the details of your debt</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="creditor">Creditor Name</Label>
                  <Input
                    id="creditor"
                    value={formData.creditorName}
                    onChange={(e) => setFormData({ ...formData, creditorName: e.target.value })}
                    placeholder="e.g., Medical Center"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g., 5000"
                  />
                </div>
                <div>
                  <Label htmlFor="interest">Interest Rate (%)</Label>
                  <Input
                    id="interest"
                    type="number"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    placeholder="e.g., 5.5"
                  />
                </div>
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddDebt} disabled={addDebt.isPending}>
                  {addDebt.isPending ? 'Adding...' : 'Add Debt'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <img 
          src="/assets/generated/debt-tracker-interface.dim_350x250.png" 
          alt="Debt Tracker" 
          className="w-full h-40 object-cover rounded-lg mb-4"
        />

        {/* Summary */}
        {debts.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Total Debt</p>
              <p className="text-lg font-bold text-gray-800">${totalOriginal.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Total Paid</p>
              <p className="text-lg font-bold text-green-700">${totalPaid.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Remaining</p>
              <p className="text-lg font-bold text-orange-700">${totalDebt.toFixed(2)}</p>
            </div>
          </div>
        )}
        
        {debts.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No debts tracked yet</p>
            <p className="text-sm text-gray-500 mt-1">Click "Add Debt" to start tracking</p>
          </div>
        ) : (
          <div className="space-y-4">
            {debts.map((debt) => {
              const progress = calculateProgress(debt);
              const currentBalance = getCurrentBalance(debt);
              const chartData = getChartData(debt);

              return (
                <div key={Number(debt.id)} className="p-4 border border-green-200 rounded-lg bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        {debt.creditorName}
                        {progress === 100 && (
                          <Badge className="bg-green-100 text-green-700">Paid Off</Badge>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Original: ${(Number(debt.amount) / 100).toFixed(2)} • 
                        Interest: {(Number(debt.interestRate) / 100).toFixed(1)}%
                      </p>
                      <p className="text-sm font-medium text-orange-700 mt-1">
                        Remaining: ${(currentBalance / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteDebt(debt.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {chartData.length > 1 && (
                    <div className="mb-3 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="balance" stroke="#16a34a" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {progress < 100 && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => openPaymentDialog(debt.id)}
                    >
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Record Payment
                    </Button>
                  )}

                  {debt.payments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Recent Payments:</p>
                      <div className="space-y-1">
                        {debt.payments.slice(-3).reverse().map((payment, idx) => (
                          <div key={idx} className="text-xs text-gray-700 flex justify-between">
                            <span>{new Date(Number(payment.paymentDate) / 1000000).toLocaleDateString()}</span>
                            <span className="font-medium">${(Number(payment.amountPaid) / 100).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>Enter the payment amount</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="payment-amount">Payment Amount ($)</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="e.g., 250"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddPayment} disabled={addPayment.isPending}>
                {addPayment.isPending ? 'Recording...' : 'Record Payment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Tip:</span> Regular payments help reduce debt faster and improve your financial wellness score!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
