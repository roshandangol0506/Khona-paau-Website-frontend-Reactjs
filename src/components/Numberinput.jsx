"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

const NumberInput = ({ baseAmount, onTotalChange, initialQuantity = 1 }) => {
  const [value, setValue] = useState(initialQuantity);

  const handleValueChange = (newValue) => {
    const total = baseAmount * newValue;
    setValue(newValue);
    onTotalChange(total, newValue);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center border rounded">
        <button
          className="px-3 py-1 border-r"
          onClick={() => handleValueChange(Math.max(1, value - 1))}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="px-4 py-1">{value}</span>
        <button
          className="px-3 py-1 border-l"
          onClick={() => handleValueChange(value + 1)}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="text-right font-medium">
        ${(baseAmount * value).toFixed(2)}
      </div>
    </div>
  );
};

export default NumberInput;
