"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col gap-2",
        month: "flex flex-col gap-3",
        month_caption: "flex justify-center items-center h-8 relative",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1 absolute inset-x-0 justify-between",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-7 p-0",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "size-7 p-0",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-[var(--muted-foreground)] w-8 text-[0.8rem] font-normal",
        week: "flex w-full mt-1",
        day: "relative p-0 text-center text-sm size-8",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
        ),
        selected: "bg-primary! text-primary-foreground! hover:bg-primary!",
        today: "bg-[var(--accent)] text-[var(--accent-foreground)]",
        outside: "text-[var(--muted-foreground)] opacity-50",
        disabled: "text-[var(--muted-foreground)] opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...chevronProps }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" {...chevronProps} />
          ) : (
            <ChevronRight className="size-4" {...chevronProps} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
