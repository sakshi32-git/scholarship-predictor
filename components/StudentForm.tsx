
import React, { useState } from 'react';
import { StudentInfo } from '../types';

interface StudentFormProps {
  onSubmit: (info: StudentInfo) => void;
  isLoading: boolean;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<StudentInfo>({
    name: '',
    state: '',
    category: '',
    annualIncome: '',
    lastClass: '',
    percentage: '',
    currentCourse: '',
    situationPrompt: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white";
  const labelClasses = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Sharma"
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label className={labelClasses}>State of Residence</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g. Maharashtra"
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label className={labelClasses}>Category / Caste</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClasses}
            required
          >
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="EWS">EWS</option>
            <option value="PwD">PwD (Disability)</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>Annual Family Income (₹)</label>
          <input
            type="text"
            name="annualIncome"
            value={formData.annualIncome}
            onChange={handleChange}
            placeholder="e.g. 2,50,000"
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label className={labelClasses}>Last Class Completed</label>
          <input
            type="text"
            name="lastClass"
            value={formData.lastClass}
            onChange={handleChange}
            placeholder="e.g. Class 12, Graduation"
            className={inputClasses}
            required
          />
        </div>
        <div>
          <label className={labelClasses}>Marks Percentage (%)</label>
          <input
            type="number"
            name="percentage"
            value={formData.percentage}
            onChange={handleChange}
            placeholder="e.g. 85"
            className={inputClasses}
            required
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Current / Target Course</label>
        <input
          type="text"
          name="currentCourse"
          value={formData.currentCourse}
          onChange={handleChange}
          placeholder="e.g. B.Tech Computer Science"
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>Describe your situation (Optional but helpful)</label>
        <textarea
          name="situationPrompt"
          value={formData.situationPrompt}
          onChange={handleChange}
          rows={4}
          placeholder="Include any specific details like first-generation student, single parent, rural background, or specific scholarship interests."
          className={`${inputClasses} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
          isLoading 
            ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/40'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Opportunities...
          </div>
        ) : 'Analyze Eligibility'}
      </button>
    </form>
  );
};

export default StudentForm;
