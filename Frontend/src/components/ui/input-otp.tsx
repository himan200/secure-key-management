import * as React from "react"
import { OTPInput } from "input-otp"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const inputOtpSlotVariants = cva(
  "relative h-10 w-10 text-center text-base font-medium shadow-sm border border-input rounded-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface InputOTPProps extends React.ComponentPropsWithoutRef<typeof OTPInput> {
  containerClassName?: string;
}

const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, InputOTPProps>(
  ({ className, containerClassName, ...props }, ref) => (
    <OTPInput
      ref={ref}
      containerClassName={cn(
        "flex items-center gap-2",
        containerClassName
      )}
      className={cn("", className)}
      {...props}
    />
  )
)
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}

const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ className, index, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(inputOtpSlotVariants(), className)}
      data-index={index}
      {...props}
    />
  )
)
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center text-muted-foreground", className)}
    {...props}
  >
    -
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
