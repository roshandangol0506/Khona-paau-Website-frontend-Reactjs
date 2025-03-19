import { cn } from "@/lib/utils"

export function PageContainer({ children, className, fullWidth = false }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full",
        fullWidth ? "px-4 md:px-6" : "container px-4 md:px-6",
        className,
      )}
    >
      <div className={cn("w-full", !fullWidth && "max-w-[1400px]")}>{children}</div>
    </div>
  )
}

