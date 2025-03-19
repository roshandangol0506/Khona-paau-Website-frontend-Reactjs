"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NumberInput = ({ baseAmount, onTotalChange }) => {
  const [value, setValue] = useState(1);
  

  const handleValueChange = (newValue) => {
    const total = baseAmount * newValue;
    setValue(newValue);
    onTotalChange(total, newValue); 
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={() => handleValueChange(Math.max(1, value - 1))}>
          -
        </Button>
        <Input
          type="number"
          className="w-16 text-center"
          value={value}
          onChange={(e) => handleValueChange(Number(e.target.value))}
        />
        <Button variant="outline" onClick={() => handleValueChange(value + 1)}>
          +
        </Button>
      </div>

      <Input type="number" className="w-24 text-center bg-gray-100" value={baseAmount * value} readOnly />
      <Button >Delete</Button>
    </div>
  );
};

export default NumberInput;
