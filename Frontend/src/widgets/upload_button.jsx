import { Button, Input } from "@material-tailwind/react";
import React from 'react';

const FileUploadButton = () => {
  return (
    <div className="flex items-center justify-center bg-white text-black dark:text-white p-6 rounded-lg shadow-md">
      <Button
        buttonType="filled"
        size="regular"
        rounded={true}
        block={false}
        iconOnly={false}
        ripple="light"
        className="mr-2 bg-green-800 p-2 gap-3"
      >
        <Input type="file" accept=".pdf,.docx,.zip" hidden id="file-upload" />
        <label htmlFor="file-upload" className="flex items-center cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
          />
        </svg>
          Upload zipped dataset
        </label>
      </Button>
      <span className="text-gray-500 text-sm ml-2">Max 10 MBs</span>
    </div>
  );
};

export default FileUploadButton;
