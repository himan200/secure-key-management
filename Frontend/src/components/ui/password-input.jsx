import React, { useState } from 'react';
import { Input } from './input';
import { Eye, EyeOff } from 'lucide-react';

export function PasswordInput({ value, onChange, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        {...props}
      />
      <button
        type="button"
        className="absolute right-0 top-0 h-full px-3 flex items-center justify-center bg-transparent hover:bg-purple-50 rounded-r-md transition-colors"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5 text-purple-600 hover:text-purple-700 transition-colors" />
        ) : (
          <Eye className="h-5 w-5 text-purple-600 hover:text-purple-700 transition-colors" />
        )}
        <span className="sr-only">Toggle password visibility</span>
      </button>
    </div>
  );
}
