"use client";
import { useState, useRef, useEffect } from "react";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (term: string) => void;
}

export default function SearchInput({ placeholder = "Cari...", onSearch }: SearchInputProps) {
  const [term, setTerm] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, 500);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={term}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm"
    />
  );
}