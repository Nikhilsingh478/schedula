'use client';

import { useState } from 'react';
import { FileText, Download } from 'lucide-react';

interface MedicalRecord {
  id: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  prescriptionUrl?: string;
}

const mockRecords: MedicalRecord[] = [
  {
    id: 'r001',
    doctorName: 'Dr. Aman Bumrow',
    date: '2025-05-10',
    diagnosis: 'Mild anxiety and sleep disorder. Prescribed medication and suggested lifestyle changes.',
    prescriptionUrl: '#',
  },
  {
    id: 'r002',
    doctorName: 'Dr. Kavita Rao',
    date: '2025-04-03',
    diagnosis: 'Routine heart checkup. All parameters normal. No medication required.',
  },
  {
    id: 'r003',
    doctorName: 'Dr. Raj Malhotra',
    date: '2024-12-15',
    diagnosis: 'Left shoulder dislocation treated. Follow-up physiotherapy recommended.',
    prescriptionUrl: '#',
  },
];

export default function PatientRecords() {
  const [records] = useState<MedicalRecord[]>(mockRecords);

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-6 pb-24 space-y-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <h1 className="text-xl font-semibold text-gray-800">Medical Records</h1>

      {records.length === 0 ? (
        <p className="text-sm text-gray-500">No medical records found.</p>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white border border-gray-100 rounded-lg shadow-sm p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-base font-medium text-gray-900">{record.doctorName}</h2>
                  <p className="text-sm text-gray-600">{record.date}</p>
                </div>
                {record.prescriptionUrl && (
                  <a
                    href={record.prescriptionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[#46c2de] hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    <span>Prescription</span>
                  </a>
                )}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                {record.diagnosis}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
