"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Edit2, Trash2, Calendar, User, Pill, Plus } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';
import { notificationUtils } from '@/lib/storage';

export interface Prescription {
  id: string;
  patientName: string;
  appointmentId: string;
  appointmentDate: string;
  medicineName: string;
  dosage: string;
  duration: string;
  notes: string;
  dateCreated: string;
  tags?: string[];
  doctorId?: string;
}

export interface FormData {
  medicineName: string;
  dosage: string;
  duration: string;
  notes: string;
}

interface PrescriptionManagerProps {
  doctorId?: string;
  selectedPatient?: {
    name: string;
    appointmentId: string;
    appointmentDate: string;
  };
  doctorName?: string; // Add doctor name prop
}

export function PrescriptionManager({ doctorId, selectedPatient, doctorName }: PrescriptionManagerProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Load prescriptions from API
  useEffect(() => {
    fetchPrescriptions();
  }, [doctorId]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.prescriptions);
      if (response.ok) {
        const data = await response.json();
        // Filter by doctor if doctorId is provided
        const filteredData = doctorId 
          ? data.filter((p: Prescription) => p.doctorId === doctorId)
          : data;
        setPrescriptions(filteredData);
      } else {
        throw new Error('Failed to fetch prescriptions');
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast({
        title: "Error",
        description: "Failed to load prescriptions",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrescription = async (formData: FormData) => {
    try {
      if (editingPrescription) {
        // Update existing prescription
        const response = await fetch(`${API_ENDPOINTS.prescriptions}/${editingPrescription.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...editingPrescription,
            ...formData,
          }),
        });

        if (response.ok) {
          const updatedPrescription = await response.json();
          setPrescriptions(prev => prev.map(p => 
            p.id === editingPrescription.id ? updatedPrescription : p
          ));
          setEditingPrescription(null);
          toast({
            title: "Success",
            description: "Prescription updated successfully",
          });
        } else {
          throw new Error('Failed to update prescription');
        }
      } else {
        // Create new prescription
        const newPrescription: Omit<Prescription, 'id'> = {
          patientName: selectedPatient?.name || 'Unknown Patient',
          appointmentId: selectedPatient?.appointmentId || 'Unknown',
          appointmentDate: selectedPatient?.appointmentDate || new Date().toISOString().split('T')[0],
          doctorId: doctorId,
          ...formData,
          dateCreated: new Date().toISOString().split('T')[0],
          tags: []
        };

        const response = await fetch(API_ENDPOINTS.prescriptions, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPrescription),
        });

        if (response.ok) {
          const createdPrescription = await response.json();
          setPrescriptions(prev => [createdPrescription, ...prev]);
          
          // Send notification to patient
          if (selectedPatient?.name) {
            const notification = {
              id: Date.now().toString(),
              type: 'prescription',
              title: 'New Prescription Available',
              message: `${doctorName || 'Your doctor'} has prescribed ${formData.medicineName} (${formData.dosage}) for ${formData.duration}. Please check your prescription details.`,
              timestamp: new Date().toISOString(),
              read: false,
              prescriptionId: createdPrescription.id,
              medicineName: formData.medicineName,
              dosage: formData.dosage,
              duration: formData.duration
            };
            
            notificationUtils.addNotification(selectedPatient.name, notification);
          }
          
          toast({
            title: "Success",
            description: "Prescription created successfully and notification sent to patient",
          });
        } else {
          throw new Error('Failed to create prescription');
        }
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast({
        title: "Error",
        description: "Failed to save prescription",
      });
    }
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    // Scroll to top on mobile when editing
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeletePrescription = async (id: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.prescriptions}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPrescriptions(prev => prev.filter(p => p.id !== id));
        toast({
          title: "Success",
          description: "Prescription deleted successfully",
        });
      } else {
        throw new Error('Failed to delete prescription');
      }
    } catch (error) {
      console.error('Error deleting prescription:', error);
      toast({
        title: "Error",
        description: "Failed to delete prescription",
      });
    }
  };

  const handleClearForm = () => {
    setEditingPrescription(null);
  };

  // Filter prescriptions based on search term
  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group prescriptions by patient and appointment
  const groupedPrescriptions = filteredPrescriptions.reduce((groups, prescription) => {
    const key = `${prescription.patientName}-${prescription.appointmentId}`;
    if (!groups[key]) {
      groups[key] = {
        patientName: prescription.patientName,
        appointmentId: prescription.appointmentId,
        appointmentDate: prescription.appointmentDate,
        prescriptions: []
      };
    }
    groups[key].prescriptions.push(prescription);
    return groups;
  }, {} as Record<string, {
    patientName: string;
    appointmentId: string;
    appointmentDate: string;
    prescriptions: Prescription[];
  }>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Prescription Management</h2>
          <p className="text-sm text-gray-600 mt-1">Create and manage prescriptions for your patients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prescription Form */}
        <div>
          <PrescriptionForm
            editingPrescription={editingPrescription}
            currentPatient={selectedPatient}
            onSave={handleSavePrescription}
            onClear={handleClearForm}
          />
        </div>

        {/* Prescription List */}
        <div>
          <PrescriptionList
            prescriptions={prescriptions}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEdit={handleEditPrescription}
            onDelete={handleDeletePrescription}
            groupedPrescriptions={groupedPrescriptions}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
}

// Prescription Form Component
interface PrescriptionFormProps {
  editingPrescription: Prescription | null;
  currentPatient?: {
    name: string;
    appointmentId: string;
    appointmentDate: string;
  };
  onSave: (formData: FormData) => void;
  onClear: () => void;
}

function PrescriptionForm({
  editingPrescription,
  currentPatient,
  onSave,
  onClear
}: PrescriptionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    medicineName: '',
    dosage: '',
    duration: '',
    notes: ''
  });

  useEffect(() => {
    if (editingPrescription) {
      setFormData({
        medicineName: editingPrescription.medicineName,
        dosage: editingPrescription.dosage,
        duration: editingPrescription.duration,
        notes: editingPrescription.notes
      });
    } else {
      setFormData({
        medicineName: '',
        dosage: '',
        duration: '',
        notes: ''
      });
    }
  }, [editingPrescription]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.medicineName && formData.dosage && formData.duration) {
      onSave(formData);
      if (!editingPrescription) {
        setFormData({
          medicineName: '',
          dosage: '',
          duration: '',
          notes: ''
        });
      }
    }
  };

  const handleClear = () => {
    setFormData({
      medicineName: '',
      dosage: '',
      duration: '',
      notes: ''
    });
    onClear();
  };

  const isFormValid = formData.medicineName && formData.dosage && formData.duration;

  // If editing, show the form normally. If creating and no patient selected, show message
  if (!editingPrescription && !currentPatient) {
    return (
      <Card className="shadow-sm border border-gray-100">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Create Prescription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">Select a Patient First</p>
            <p className="text-gray-500 text-sm">
              Please select a patient from the dropdown above to create a prescription.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {editingPrescription ? 'Edit Prescription' : 'Create Prescription'}
        </CardTitle>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {editingPrescription 
              ? `Editing for ${editingPrescription.patientName}`
              : currentPatient 
                ? `Creating for ${currentPatient.name}`
                : 'Select a patient'
            }
          </Badge>
          {currentPatient && (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              Appointment #{currentPatient.appointmentId}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medicineName" className="text-sm font-medium text-gray-700">
              Medicine Name *
            </Label>
            <Input
              id="medicineName"
              type="text"
              value={formData.medicineName}
              onChange={(e) => handleInputChange('medicineName', e.target.value)}
              placeholder="Enter medicine name"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage" className="text-sm font-medium text-gray-700">
                Dosage *
              </Label>
              <Input
                id="dosage"
                type="text"
                value={formData.dosage}
                onChange={(e) => handleInputChange('dosage', e.target.value)}
                placeholder="e.g., 500mg, 2 tablets"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                Duration *
              </Label>
              <Input
                id="duration"
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 7 days, 2 weeks"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes / Instructions
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Enter any special instructions or notes"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px] resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingPrescription ? 'Update Prescription' : 'Save Prescription'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Prescription List Component
interface PrescriptionListProps {
  prescriptions: Prescription[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (prescription: Prescription) => void;
  onDelete: (id: string) => void;
  groupedPrescriptions: Record<string, {
    patientName: string;
    appointmentId: string;
    appointmentDate: string;
    prescriptions: Prescription[];
  }>;
  formatDate: (dateString: string) => string;
}

function PrescriptionList({
  prescriptions,
  loading,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  groupedPrescriptions,
  formatDate
}: PrescriptionListProps) {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          All Prescriptions
        </CardTitle>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search medicines or patients..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading prescriptions...</p>
          </div>
        ) : Object.keys(groupedPrescriptions).length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Pill className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</div>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by creating your first prescription'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPrescriptions).map(([key, group]) => (
              <div key={key} className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{group.patientName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span>Appointment #{group.appointmentId} – {group.appointmentDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {group.prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900 text-lg">{prescription.medicineName}</h4>
                              {prescription.tags && prescription.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {prescription.tags.map((tag, index) => (
                                    <Badge 
                                      key={index} 
                                      variant="secondary" 
                                      className="text-xs bg-blue-100 text-blue-700"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(prescription)}
                              className="h-8 px-3 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-3 border-red-200 text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Prescription</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the prescription for <strong>{prescription.medicineName}</strong>? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDelete(prescription.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="bg-white rounded-md p-3 border border-gray-200">
                            <span className="text-gray-600 font-medium">Dosage</span>
                            <div className="text-gray-900 font-semibold mt-1">{prescription.dosage}</div>
                          </div>
                          <div className="bg-white rounded-md p-3 border border-gray-200">
                            <span className="text-gray-600 font-medium">Duration</span>
                            <div className="text-gray-900 font-semibold mt-1">{prescription.duration}</div>
                          </div>
                        </div>
                        
                        {prescription.notes && (
                          <div className="bg-white rounded-md p-3 border border-gray-200">
                            <span className="text-gray-600 font-medium text-sm">Instructions</span>
                            <div className="text-gray-900 text-sm mt-1 leading-relaxed">{prescription.notes}</div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                          <div className="text-xs text-gray-500">
                            Created on {formatDate(prescription.dateCreated)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
