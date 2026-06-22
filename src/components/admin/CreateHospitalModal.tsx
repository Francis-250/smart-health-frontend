import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import type { Hospital } from "../../types/admin";

export interface HospitalFormData {
  name: string;
  location: string;
  contact: string;
  status: Hospital["status"];
}

const emptyForm: HospitalFormData = {
  name: "",
  location: "",
  contact: "",
  status: "Active",
};

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

interface CreateHospitalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HospitalFormData) => void;
}

export function CreateHospitalModal({ open, onClose, onSubmit }: CreateHospitalModalProps) {
  const [form, setForm] = useState<HospitalFormData>(emptyForm);

  function handleChange<K extends keyof HospitalFormData>(key: K, value: HospitalFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.location.trim()) return;
    onSubmit(form);
    setForm(emptyForm);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add hospital"
      subtitle="Register a new partner hospital to the network."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add hospital</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Hospital name <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClass}
            placeholder="e.g. Kigali Central Hospital"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClass}
            placeholder="e.g. Kigali, Rwanda"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Contact</label>
          <input
            className={inputClass}
            placeholder="e.g. +250 788 000 000"
            value={form.contact}
            onChange={(e) => handleChange("contact", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value as Hospital["status"])}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}
