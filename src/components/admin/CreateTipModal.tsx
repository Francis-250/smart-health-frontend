import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import type { FirstAidTip, SeverityLevel, TipCategory } from "../../types/admin";

export interface TipFormData {
  title: string;
  category: TipCategory;
  severity: SeverityLevel;
  description: string;
  symptoms: string;
  procedure: string;
  warnings: string;
}

const categories: TipCategory[] = [
  "Burns",
  "Choking",
  "CPR",
  "Bleeding",
  "Fractures",
  "Allergies",
  "Other",
];

const severities: SeverityLevel[] = ["Low", "Medium", "High", "Critical"];

const emptyForm: TipFormData = {
  title: "",
  category: "Burns",
  severity: "Low",
  description: "",
  symptoms: "",
  procedure: "",
  warnings: "",
};

interface CreateTipModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TipFormData) => void;
  initialData?: FirstAidTip | null;
}

function FieldLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-gray-700">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function CreateTipModal({ open, onClose, onSubmit, initialData }: CreateTipModalProps) {
  const [form, setForm] = useState<TipFormData>(
    initialData
      ? {
          title: initialData.title,
          category: initialData.category,
          severity: initialData.severity,
          description: initialData.description,
          symptoms: initialData.symptoms,
          procedure: initialData.procedure,
          warnings: initialData.warnings,
        }
      : emptyForm,
  );

  const isEdit = Boolean(initialData);

  function handleChange<K extends keyof TipFormData>(key: K, value: TipFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    if (!form.title.trim() || !form.description.trim()) return;
    onSubmit(form);
    setForm(emptyForm);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit first aid tip" : "Create first aid tip"}
      subtitle="This content is shown directly to patients in an emergency — keep instructions short and unambiguous."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isEdit ? "Save changes" : "Create tip"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <FieldLabel required>Title</FieldLabel>
          <input
            className={inputClass}
            placeholder="e.g. Treating Minor Burns"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel required>Category</FieldLabel>
            <select
              className={inputClass}
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value as TipCategory)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel required>Emergency severity level</FieldLabel>
            <select
              className={inputClass}
              value={form.severity}
              onChange={(e) => handleChange("severity", e.target.value as SeverityLevel)}
            >
              {severities.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <FieldLabel required>Description</FieldLabel>
          <textarea
            className={`${inputClass} min-h-20 resize-y`}
            placeholder="One or two sentences describing when to use this tip."
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div>
          <FieldLabel>Symptoms</FieldLabel>
          <textarea
            className={`${inputClass} min-h-20 resize-y`}
            placeholder="What patients or bystanders should look for."
            value={form.symptoms}
            onChange={(e) => handleChange("symptoms", e.target.value)}
          />
        </div>

        <div>
          <FieldLabel>Step-by-step procedure</FieldLabel>
          <textarea
            className={`${inputClass} min-h-28 resize-y`}
            placeholder={"1. First step\n2. Second step"}
            value={form.procedure}
            onChange={(e) => handleChange("procedure", e.target.value)}
          />
        </div>

        <div>
          <FieldLabel>Safety warnings</FieldLabel>
          <textarea
            className={`${inputClass} min-h-20 resize-y`}
            placeholder="What NOT to do, and when to call emergency services."
            value={form.warnings}
            onChange={(e) => handleChange("warnings", e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
