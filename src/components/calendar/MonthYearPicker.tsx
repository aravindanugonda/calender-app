import { useCallback } from 'react';
import { format, setMonth, setYear } from 'date-fns';
import { useCalendarStore } from '@/store/calendar-store';

interface MonthYearPickerProps {
  type: 'month' | 'year';
  onClose: () => void;
}

export const MonthYearPicker = ({ type, onClose }: MonthYearPickerProps) => {
  const { currentDate, setCurrentDate } = useCalendarStore();

  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  // Create array of years from 2000 to 2050
  const years = Array.from({ length: 51 }, (_, i) => 2000 + i);

  const handleSelect = useCallback((value: number) => {
    const newDate = new Date(currentDate);
    if (type === 'month') {
      setCurrentDate(setMonth(newDate, value));
    } else {
      setCurrentDate(setYear(newDate, value));
    }
    onClose();
  }, [currentDate, setCurrentDate, type, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-4 max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="grid grid-cols-3 gap-2">
          {type === 'month' ? (
            months.map((month, index) => (
              <button
                key={month}
                onClick={() => handleSelect(index)}
                className={`p-2 rounded hover:bg-gray-100 ${
                  index === currentDate.getMonth() ? 'bg-blue-100 text-blue-600' : ''
                }`}
              >
                {month}
              </button>
            ))
          ) : (
            years.map(year => (
              <button
                key={year}
                onClick={() => handleSelect(year)}
                className={`p-2 rounded hover:bg-gray-100 ${
                  year === currentDate.getFullYear() ? 'bg-blue-100 text-blue-600' : ''
                }`}
              >
                {year}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
