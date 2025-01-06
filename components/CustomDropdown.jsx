import React, { useState } from "react";

const CustomDropdown = ({ students, selectedStudent, handleChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (student) => {
    handleChange({ target: { value: student.id } });
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <div
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        onClick={toggleDropdown}
      >
        {selectedStudent.name || "Select a student"}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-max mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {students.map((student) => (
            <div
              key={student.id}
              onClick={() => handleSelect(student)}
              className="hover:bg-gray-100 cursor-pointer flex justify-between p-2 rounded-md shadow-lg"
            >
              <div className="font-poppins text-gray-800">{student.name}</div>
              {student.notification>0 && (
                <div className="font-poppins w-6 h-6 text-center font-semibold text-red-500 ml-2 rounded-full">
                  {student.notification}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
