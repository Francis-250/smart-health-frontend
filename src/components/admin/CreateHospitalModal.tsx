import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export interface HospitalFormData {
  address: string;
  isEmergency: boolean;
  latitude: string;
  longitude: string;
  name: string;
  phoneNumber: string;
}

const emptyForm: HospitalFormData = {
  address: "",
  isEmergency: true,
  latitude: "",
  longitude: "",
  name: "",
  phoneNumber: "",
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
    if (!form.name.trim() || !form.address.trim() || !form.latitude || !form.longitude) return;
    onSubmit(form);
    setForm(emptyForm);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add hospital"
      subtitle="Add a care location that patients can find during urgent situations."
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
            placeholder="e.g. Kigali University Teaching Hospital"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClass}
            placeholder="e.g. KN 4 Ave, Kigali"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Latitude <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClass}
              placeholder="-1.9536"
              value={form.latitude}
              onChange={(e) => handleChange("latitude", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Longitude <span className="text-red-500">*</span>
            </label>
            <input
              className={inputClass}
              placeholder="30.0605"
              value={form.longitude}
              onChange={(e) => handleChange("longitude", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone number</label>
          <input
            className={inputClass}
            placeholder="e.g. +250 788 000 000"
            value={form.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Emergency services</label>
          <select
            className={inputClass}
            value={form.isEmergency ? "true" : "false"}
            onChange={(e) => handleChange("isEmergency", e.target.value === "true")}
          >
            <option value="true">Available</option>
            <option value="false">Not available</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}
