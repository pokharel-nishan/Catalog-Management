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

interface Staff {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface DialogState {
  isOpen: boolean;
  mode: 'view' | 'edit' | 'add';
  selectedStaff: Staff | null;
}

const mockStaffData: Staff[] = [
  { id: '1', username: 'johndoe', email: 'john@example.com', role: 'Sales' },
  { id: '2', username: 'janedoe', email: 'jane@example.com', role: 'Support' },
  { id: '3', username: 'bobsmith', email: 'bob@example.com', role: 'Marketing' },
];

const mockServices = {
  getAllStaff: (): Promise<Staff[]> => new Promise(resolve => setTimeout(() => resolve(mockStaffData), 500)),
  addStaff: (newStaff: Omit<Staff, 'id'>): Promise<Staff> => new Promise(resolve => setTimeout(() => resolve({ ...newStaff, id: Math.random().toString(36).substring(2, 9) }), 500)),
  updateStaffProfile: (updatedStaff: Staff): Promise<Staff> => new Promise(resolve => setTimeout(() => resolve(updatedStaff), 500)),
  deleteStaff: (staffId: string): Promise<void> => new Promise(resolve => setTimeout(() => resolve(), 500)),
};

export const AdminStaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false, mode: 'view', selectedStaff: null });

  useEffect(() => {
    mockServices.getAllStaff()
      .then(data => {
        setStaff(data);
        setFilteredStaff(data);
      })
      .catch(() => toast.error('Failed to fetch staff'));
  }, []);

  useEffect(() => {
    setFilteredStaff(
      staff.filter(s => `${s.username} ${s.email} ${s.role}`.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, staff]);

  const handleAddStaff = async (newStaff: Omit<Staff, 'id'>) => {
    try {
      const staffMember = await mockServices.addStaff(newStaff);
      setStaff(prev => [staffMember, ...prev]);
      toast.success('Staff added successfully');
    } catch {
      toast.error('Failed to add staff');
    }
  };

  const handleUpdateStaff = async (updatedStaff: Staff) => {
    try {
      const staffMember = await mockServices.updateStaffProfile(updatedStaff);
      setStaff(prev => prev.map(s => s.id === staffMember.id ? staffMember : s));
      toast.success('Staff updated successfully');
    } catch {
      toast.error('Failed to update staff');
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      await mockServices.deleteStaff(staffId);
      setStaff(prev => prev.filter(s => s.id !== staffId));
      toast.success('Staff deleted successfully');
    } catch {
      toast.error('Failed to delete staff');
    }
  };

  const StaffCard: React.FC<{ staff: Staff }> = ({ staff }) => (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{staff.username}</h3>
            <p className="text-sm text-gray-500">{staff.email}</p>
            <p className="text-sm text-gray-500">{staff.role}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setDialogState({ isOpen: true, mode: 'view', selectedStaff: staff })}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setDialogState({ isOpen: true, mode: 'edit', selectedStaff: staff })}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={() => handleDeleteStaff(staff.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StaffDialog: React.FC = () => {
    const { isOpen, mode, selectedStaff } = dialogState;
    const isView = mode === 'view';
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: '' });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      if (selectedStaff) {
        setFormData({ username: selectedStaff.username, email: selectedStaff.email, password: '', role: selectedStaff.role });
      } else {
        setFormData({ username: '', email: '', password: '', role: '' });
      }
    }, [selectedStaff]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const { username, email, password, role } = formData;
      const payload = { username, email, role } as Omit<Staff, 'id'>;
      mode === 'add' ? handleAddStaff(payload) : selectedStaff && handleUpdateStaff({ ...selectedStaff, ...payload });
      setDialogState({ ...dialogState, isOpen: false });
    };

    const roleOptions = ['Sales', 'Support', 'Marketing', 'HR', 'Finance', 'Operations'];

    return (
      <Dialog open={isOpen} onOpenChange={(open) => setDialogState({ ...dialogState, isOpen: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isView ? 'Staff Details' : mode === 'edit' ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={isView}
              required
            >
              <option value="">Select Role</option>
              {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            {!isView && (
              <div className="relative">
                <Input
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={mode === 'add'}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}
            {!isView && <Button type="submit">{mode === 'edit' ? 'Update Staff' : 'Create Staff'}</Button>}
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Manage Staff</h1>
        <Button onClick={() => setDialogState({ isOpen: true, mode: 'add', selectedStaff: null })}>Add Staff</Button>
      </div>
      <Input
        placeholder="Search staff by name, email or role"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.length === 0 ? (
          <p>No staff members found.</p>
        ) : (
          filteredStaff.map(s => <StaffCard key={s.id} staff={s} />)
        )}
      </div>
      <StaffDialog />
    </div>
  );
};

export default AdminStaffManagement;
