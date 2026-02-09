import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, Plus, Edit, Trash2, Check, X, Bell } from 'lucide-react';
import { useGetMedications, useAddMedication, useUpdateMedication, useDeleteMedication, useLogMedicationAdherence } from '../hooks/useQueries';
import type { MedicationRecord } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

export default function MedicationManagement() {
  const { data: medications = [], isLoading } = useGetMedications();
  const addMedication = useAddMedication();
  const updateMedication = useUpdateMedication();
  const deleteMedication = useDeleteMedication();
  const logAdherence = useLogMedicationAdherence();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<MedicationRecord | null>(null);
  const [adherenceDialogOpen, setAdherenceDialogOpen] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState<bigint | null>(null);
  const [adherenceNotes, setAdherenceNotes] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    timeOfDay: 'Morning',
  });

  const handleAddMedication = async () => {
    if (!formData.name || !formData.dosage) return;

    await addMedication.mutateAsync({
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      timeOfDay: formData.timeOfDay,
      startDate: BigInt(Date.now() * 1000000),
      endDate: null,
    });

    setFormData({ name: '', dosage: '', frequency: 'Daily', timeOfDay: 'Morning' });
    setIsAddDialogOpen(false);
  };

  const handleEditMedication = async () => {
    if (!editingMed || !formData.name || !formData.dosage) return;

    await updateMedication.mutateAsync({
      medicationId: editingMed.id,
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      timeOfDay: formData.timeOfDay,
      startDate: editingMed.startDate,
      endDate: editingMed.endDate || null,
    });

    setFormData({ name: '', dosage: '', frequency: 'Daily', timeOfDay: 'Morning' });
    setEditingMed(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteMedication = async (id: bigint) => {
    if (confirm('Are you sure you want to delete this medication?')) {
      await deleteMedication.mutateAsync(id);
    }
  };

  const openEditDialog = (med: MedicationRecord) => {
    setEditingMed(med);
    setFormData({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      timeOfDay: med.timeOfDay,
    });
    setIsEditDialogOpen(true);
  };

  const handleLogAdherence = async (taken: boolean) => {
    if (selectedMedId === null) return;

    await logAdherence.mutateAsync({
      medicationId: selectedMedId,
      taken,
      notes: adherenceNotes,
    });

    setAdherenceDialogOpen(false);
    setSelectedMedId(null);
    setAdherenceNotes('');
  };

  const openAdherenceDialog = (medId: bigint) => {
    setSelectedMedId(medId);
    setAdherenceDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="border-rose-200">
        <CardContent className="py-8">
          <p className="text-center text-gray-600">Loading medications...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-rose-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-rose-700 flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Medication Management
            </CardTitle>
            <CardDescription>Track your medications and adherence</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>Enter the details of your medication</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="med-name">Medicine Name</Label>
                  <Input
                    id="med-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Aspirin"
                  />
                </div>
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g., 100mg"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                    <SelectTrigger id="frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Twice Daily">Twice Daily</SelectItem>
                      <SelectItem value="Three Times Daily">Three Times Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="As Needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time">Time of Day</Label>
                  <Select value={formData.timeOfDay} onValueChange={(value) => setFormData({ ...formData, timeOfDay: value })}>
                    <SelectTrigger id="time">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Afternoon">Afternoon</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                      <SelectItem value="Night">Night</SelectItem>
                      <SelectItem value="With Meals">With Meals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMedication} disabled={addMedication.isPending}>
                  {addMedication.isPending ? 'Adding...' : 'Add Medication'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <img 
          src="/assets/generated/medication-management.dim_300x200.png" 
          alt="Medication Management" 
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
        
        {medications.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <Pill className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No medications added yet</p>
            <p className="text-sm text-gray-500 mt-1">Click "Add Medication" to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {medications.map((med) => (
              <div key={Number(med.id)} className="p-4 border border-rose-200 rounded-lg bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      {med.name}
                      <Badge variant="outline" className="text-xs">
                        <Bell className="w-3 h-3 mr-1" />
                        {med.timeOfDay}
                      </Badge>
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {med.dosage} • {med.frequency}
                    </p>
                    {med.adherenceLogs.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Last logged: {new Date(Number(med.adherenceLogs[med.adherenceLogs.length - 1].timestamp) / 1000000).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEditDialog(med)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteMedication(med.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openAdherenceDialog(med.id)}>
                    <Check className="w-4 h-4 mr-1" />
                    Log Adherence
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Medication</DialogTitle>
              <DialogDescription>Update medication details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-name">Medicine Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-dosage">Dosage</Label>
                <Input
                  id="edit-dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                  <SelectTrigger id="edit-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Twice Daily">Twice Daily</SelectItem>
                    <SelectItem value="Three Times Daily">Three Times Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="As Needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-time">Time of Day</Label>
                <Select value={formData.timeOfDay} onValueChange={(value) => setFormData({ ...formData, timeOfDay: value })}>
                  <SelectTrigger id="edit-time">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                    <SelectItem value="With Meals">With Meals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditMedication} disabled={updateMedication.isPending}>
                {updateMedication.isPending ? 'Updating...' : 'Update Medication'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Adherence Dialog */}
        <Dialog open={adherenceDialogOpen} onOpenChange={setAdherenceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Medication Adherence</DialogTitle>
              <DialogDescription>Did you take this medication?</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="adherence-notes">Notes (Optional)</Label>
                <Textarea
                  id="adherence-notes"
                  value={adherenceNotes}
                  onChange={(e) => setAdherenceNotes(e.target.value)}
                  placeholder="Any side effects or observations?"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setAdherenceDialogOpen(false)}>Cancel</Button>
              <Button variant="outline" onClick={() => handleLogAdherence(false)} disabled={logAdherence.isPending}>
                <X className="w-4 h-4 mr-2" />
                Missed
              </Button>
              <Button onClick={() => handleLogAdherence(true)} disabled={logAdherence.isPending}>
                <Check className="w-4 h-4 mr-2" />
                Taken
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="mt-4 p-3 bg-rose-50 rounded-lg border border-rose-200">
          <p className="text-sm text-rose-800 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="font-medium">Daily Reminder:</span> Log your medication adherence to track progress and earn wellness points!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
