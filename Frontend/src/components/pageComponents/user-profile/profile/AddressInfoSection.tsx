import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../../../../types/user';
import { Globe, MapPin, Building, Map } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';

interface Props {
  address: UserProfile['address'];
  onUpdate: (info: UserProfile['address']) => void;
}

const AddressForm: React.FC<Props> = ({ address, onUpdate }) => {
  const [formData, setFormData] = useState(address);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(address);
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.country || formData.country.length < 2)
      newErrors.country = "Country must be at least 2 characters";
    if (!formData.stateProvinceRegion || formData.stateProvinceRegion.length < 2)
      newErrors.stateProvinceRegion = "State/Province must be at least 2 characters";
    if (!formData.streetAddress || formData.streetAddress.length < 2)
      newErrors.streetAddress = "Street must be at least 2 characters";
    if (!formData.addressLine1 || formData.addressLine1.length < 5)
      newErrors.addressLine1 = "Address Line 1 must be at least 5 characters";
    if (!formData.postalCode || formData.postalCode.length < 4)
      newErrors.postalCode = "Postal code must be at least 4 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onUpdate(formData);
    }
  };

  const renderInput = (
    name: keyof typeof formData,
    label: string,
    placeholder: string,
    icon: React.ReactNode
  ) => (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          value={formData[name] || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-10"
        />
        <div className="absolute left-3 top-3 h-4 w-4 text-gray-500">{icon}</div>
      </div>
      {errors[name] && <p className="text-sm text-red-600 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Address Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderInput("country", "Country", "United States", <Globe />)}
          {renderInput("stateProvinceRegion", "State/Province", "California", <Map />)}
          {renderInput("streetAddress", "Street", "Main Street", <MapPin />)}
          {renderInput("addressLine1", "Address Line 1", "123 Main St", <Building />)}
          {renderInput("addressLine2", "Address Line 2 (Optional)", "Apt 4B", <Building />)}
          {renderInput("postalCode", "Postal Code", "12345", "#")}
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="px-6">
            Save Address
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
