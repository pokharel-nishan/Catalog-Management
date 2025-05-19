import React, { useEffect, useState } from 'react';
import { Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../ui/dialog';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import apiClient from '../../../../api/config';

// Updated Staff interface to match backend API structure
interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  role?: string; // Made optional to handle null roles
}

interface DialogState {
  isOpen: boolean;
  mode: 'view' | 'edit' | 'add';
  selectedStaff: Staff | null;
}

export const AdminStaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    mode: 'view',
    selectedStaff: null,
  });

  // Fetch all staff on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await apiClient.get('/User/all-staffs');
        // Extract staff array from response.data.userDetails.result
        const staffData = response.data.userDetails?.result || [];
        // Map API fields to Staff interface
        const mappedStaff = staffData.map((s: any) => ({
          id: s.userId,
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email,
          address: s.address,
          role: s.roles || 'Unknown', // Fallback for null roles
        }));
        setStaff(mappedStaff);
        setFilteredStaff(mappedStaff);
      } catch (error: any) {
        console.error('Failed to fetch staff:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch staff');
      }
    };
    fetchStaff();
  }, []);

  // Filter staff based on search term
  useEffect(() => {
    setFilteredStaff(
      staff.filter((s) =>
        `${s.firstName} ${s.lastName} ${s.email} ${s.role || ''}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, staff]);

  // Add a new staff member
  const handleAddStaff = async (newStaff: Omit<Staff, 'id'> & { password: string }) => {
    try {
      const response = await apiClient.post('/User/createStaffUser', {
        email: newStaff.email,
        password: newStaff.password,
        firstName: newStaff.firstName,
        lastName: newStaff.lastName,
        address: newStaff.address,
        role: newStaff.role,
      });
      // Map response to Staff interface
      const newStaffMember: Staff = {
        id: response.data.UserId,
        firstName: newStaff.firstName,
        lastName: newStaff.lastName,
        email: newStaff.email,
        address: newStaff.address,
        role: newStaff.role || 'Unknown',
      };
      setStaff((prev) => [newStaffMember, ...prev]);
      toast.success('Staff added successfully');
    } catch (error: any) {
      console.error('Failed to add staff:', error);
      toast.error(error.response?.data?.message || 'Failed to add staff');
    }
  };

  // Update an existing staff member
  const handleUpdateStaff = async (updatedStaff: Staff) => {
    try {
      const response = await apiClient.put(`/Staff/${updatedStaff.id}`, {
        email: updatedStaff.email,
        firstName: updatedStaff.firstName,
        lastName: updatedStaff.lastName,
        address: updatedStaff.address,
        role: updatedStaff.role,
      });
      // Map response to Staff interface
      const updatedStaffMember: Staff = {
        id: updatedStaff.id,
        firstName: response.data.firstName || updatedStaff.firstName,
        lastName: response.data.lastName || updatedStaff.lastName,
        email: response.data.email || updatedStaff.email,
        address: response.data.address || updatedStaff.address,
        role: response.data.role || updatedStaff.role || 'Unknown',
      };
      setStaff((prev) =>
        prev.map((s) => (s.id === updatedStaff.id ? updatedStaffMember : s))
      );
      toast.success('Staff updated successfully');
    } catch (error: any) {
      console.error('Failed to update staff:', error);
      toast.error(error.response?.data?.message || 'Failed to update staff');
    }
  };

  // Delete a staff member
  const handleDeleteStaff = async (staffId: string) => {
    try {
      await apiClient.delete(`/Staff/${staffId}`);
      setStaff((prev) => prev.filter((s) => s.id !== staffId));
      toast.success('Staff deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete staff:', error);
      toast.error(error.response?.data?.message || 'Failed to delete staff');
    }
  };

  // Staff Card component
  const StaffCard: React.FC<{ staff: Staff }> = ({ staff }) => (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{`${staff.firstName} ${staff.lastName}`}</h3>
            <p className="text-sm text-gray-500">{staff.email}</p>
            {staff.address && <p className="text-sm text-gray-500">{staff.address}</p>}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setDialogState({ isOpen: true, mode: 'view', selectedStaff: staff })
              }
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setDialogState({ isOpen: true, mode: 'edit', selectedStaff: staff })
              }
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDeleteStaff(staff.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Staff Dialog component
  const StaffDialog: React.FC = () => {
    const { isOpen, mode, selectedStaff } = dialogState;
    const isView = mode === 'view';
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      address: '',
      role: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      if (selectedStaff) {
        setFormData({
          firstName: selectedStaff.firstName,
          lastName: selectedStaff.lastName,
          email: selectedStaff.email,
          password: '',
          address: selectedStaff.address || '',
          role: selectedStaff.role || '',
        });
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          address: '',
          role: '',
        });
      }
    }, [selectedStaff]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const { firstName, lastName, email, password, address, role } = formData;
      const payload = { firstName, lastName, email, address, role: role || undefined };

      if (mode === 'add') {
        if (!password) {
          toast.error('Password is required for new staff');
          return;
        }
        handleAddStaff({ ...payload, password });
      } else if (selectedStaff) {
        handleUpdateStaff({ ...selectedStaff, ...payload });
      }
      setDialogState({ ...dialogState, isOpen: false });
    };

    return (
      <Dialog
        open={isOpen}
        onOpenChange={(open) => setDialogState({ ...dialogState, isOpen: open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isView ? 'Staff Details' : mode === 'edit' ? 'Edit Staff' : 'Add Staff'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              disabled={isView}
              required
            />
            <Input
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              disabled={isView}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isView}
              required
            />
            <Input
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              disabled={isView}
            />
            {!isView && mode === 'add' && (
              <div className="relative">
                <Input
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
            {!isView && (
              <Button type="submit">
                {mode === 'edit' ? 'Update Staff' : 'Create Staff'}
              </Button>
            )}
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Manage Staff</h1>
        <Button
          onClick={() =>
            setDialogState({ isOpen: true, mode: 'add', selectedStaff: null })
          }
        >
          Add Staff
        </Button>
      </div>
      <Input
        placeholder="Search staff by name, email, or role"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.length === 0 ? (
          <p>No staff members found.</p>
        ) : (
          filteredStaff.map((s) => <StaffCard key={s.id} staff={s} />)
        )}
      </div>
      <StaffDialog />
    </div>
  );
};

export default AdminStaffManagement;