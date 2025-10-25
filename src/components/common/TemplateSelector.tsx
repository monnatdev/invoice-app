'use client';

import { templates, TemplateType } from '@/lib/invoiceTemplates';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  selected: TemplateType;
  onChange: (template: TemplateType) => void;
}

export default function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Choose Template</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(templates).map((template) => (
          <button
            type="button" // Prevent form submission
            key={template.id}
            onClick={() => onChange(template.id)}
            className={`relative p-4 border-2 rounded-xl transition-all ${
              selected === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Color Preview */}
            <div className="mb-3 flex gap-1">
              <div
                className="h-8 w-8 rounded"
                style={{ background: template.primaryColor }}
              ></div>
              <div
                className="h-8 w-8 rounded"
                style={{ background: template.secondaryColor }}
              ></div>
              <div
                className="h-8 w-8 rounded"
                style={{ background: template.accentColor }}
              ></div>
            </div>

            {/* Template Name */}
            <div className="text-left">
              <div className="font-bold text-slate-900 mb-1">{template.name}</div>
              <div className="text-xs text-slate-600">{template.description}</div>
            </div>

            {/* Check Icon */}
            {selected === template.id && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                <Check size={14} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}