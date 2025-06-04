import React, { useEffect, useState } from 'react';
import type { UserProfile } from '../../../../types/user';

interface Props {
  personalInfo: UserProfile['personalInfo'];
  onUpdate: (info: UserProfile['personalInfo']) => void;
}

const PersonalInfoForm: React.FC<Props> = ({ personalInfo, onUpdate }) => {
  const [form, setForm] = useState({ ...personalInfo });
  const [changed, setChanged] = useState(false);

  // Detect changes to the form data
  useEffect(() => {
    setChanged(JSON.stringify(form) !== JSON.stringify(personalInfo));
  }, [form, personalInfo]);

  // Handle input changes and update state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (changed) {
      onUpdate(form); 
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            placeholder="Date of Birth"
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={!changed}
          className={`px-6 py-2 rounded ${changed ? 'bg-teal-600 text-white' : 'bg-gray-300 text-gray-600'}`}
        >
          Save
        </button>
      </form>
    </section>
  );
};

export default PersonalInfoForm;
