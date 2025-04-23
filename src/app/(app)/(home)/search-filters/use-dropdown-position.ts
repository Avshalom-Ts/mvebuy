import { RefObject } from "react";

export const useDropdownPosition = (
    ref: RefObject<HTMLDivElement | null> | RefObject<HTMLButtonElement>,
) => {
    const getDropdownPosition = () => {
        if (!ref.current) return { top: 0, left: 0 }

        const rect = ref.current.getBoundingClientRect()
        const dropdownWidth = 240 // Width of the dropdown (w-60 = 15rem = 240px)

        // Calculate the initial position
        let left = rect.left + window.scrollX;
        const top = rect.bottom + window.scrollY;

        // Check if the dropdown would go off the right edge of the viewport
        if (left + dropdownWidth > window.innerWidth) {
            // Align to the right edge of the button instead
            left = rect.right + window.scrollX - dropdownWidth;

            // If still off-screen, align to the left edge of viewport with some padding
            if (left < 0) {
                left = window.innerWidth - dropdownWidth - 16; // 16px padding from the right edge
            }
        }

        // Ensure dropdown doesn't go off the left edge of the viewport
        if (left < 0) {
            left = 16; // 16px padding from the left edge
        }

        return { top, left }

    }
    return {
        getDropdownPosition
    }
}