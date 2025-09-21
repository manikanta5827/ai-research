import * as React from "react"
import { cn } from "@/lib/utils"

const Toast = React.forwardRef(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "fixed top-4 right-4 z-50 max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out",
            className
        )}
        {...props}
    >
        {children}
    </div>
))
Toast.displayName = "Toast"

const ToastContent = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center space-x-3", className)}
        {...props}
    />
))
ToastContent.displayName = "ToastContent"

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h4
        ref={ref}
        className={cn("font-semibold text-gray-900", className)}
        {...props}
    />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-gray-600", className)}
        {...props}
    />
))
ToastDescription.displayName = "ToastDescription"

export { Toast, ToastContent, ToastTitle, ToastDescription }
