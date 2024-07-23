'use client';
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  color: z.string().regex(/^#?[0-9A-F]{6}$/i, {
    message: "Must be a valid hex color code (e.g., FF0000 or #FF0000).",
  }),
})

interface ColorPickerProps {
  children?: React.ReactNode;
  getValue?: (color: string) => void;
  defaultColor?: string;
}

const presetColors = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF',
  '#FF1493', '#00CED1', '#FFD700', '#32CD32', '#1E90FF', '#9370DB',
  '#FF6347', '#20B2AA', '#FFA07A', '#98FB98', '#87CEFA', '#DDA0DD',
];

const ColorPicker: React.FC<ColorPickerProps> = ({ children, getValue, defaultColor = "#8B00FF" }) => {
  const [color, setColor] = useState(defaultColor);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: defaultColor,
    },
  })

  useEffect(() => {
    form.setValue('color', color);
  }, [color, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newColor = ensureHashPrefix(values.color);
    setColor(newColor);
    if (getValue) getValue(newColor);
  }

  const handlePresetColorClick = (newColor: string) => {
    setColor(newColor);
    form.setValue('color', newColor);
    if (getValue) getValue(newColor);
  };

  const ensureHashPrefix = (color: string): string => {
    return color.startsWith('#') ? color : `#${color}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputColor = e.target.value;
    const newColor = ensureHashPrefix(inputColor);
    
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
      setColor(newColor);
      if (getValue) getValue(newColor);
    }
    form.setValue('color', inputColor);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="default" 
          size="icon" 
          className="rounded-full aspect-square size-5 hover:ring transition-shadow"
          style={{ 
            backgroundColor: color,
            ['--tw-ring-color' as any]: `${color}80`
          }}
        >
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="grid grid-cols-6 gap-2 mb-3">
          {presetColors.map((presetColor) => (
            <Button
              key={presetColor}
              className="size-8 rounded-full hover:ring transition-shadow"
              style={{ 
                backgroundColor: presetColor,
                ['--tw-ring-color' as any]: `${presetColor}80`
              }}
              onClick={() => handlePresetColorClick(presetColor)}
            />
          ))}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <div
                    className="size-8 aspect-square rounded-full"
                    style={{ backgroundColor: ensureHashPrefix(field.value) }}
                  />
                  <FormControl>
                    <Input {...field} onChange={handleInputChange} placeholder="#000000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;