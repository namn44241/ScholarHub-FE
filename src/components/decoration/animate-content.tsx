import { motion, type Transition, type Variants } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

interface AnimatedContentProps {
    children: ReactNode;
    distance?: number;
    direction?: "vertical" | "horizontal";
    reverse?: boolean;
    // Prop 'transition' của Framer Motion thay thế 'config' của react-spring
    // Mặc định tương ứng với { tension: 50, friction: 25 } của react-spring
    transition?: Transition;
    initialOpacity?: number;
    animateOpacity?: boolean;
    // 'scale' được đổi tên thành 'initialScale' để chỉ rõ đây là giá trị ban đầu
    // Hoạt ảnh sẽ luôn đưa scale về 1
    initialScale?: number;
    threshold?: number; // Tương ứng với viewport.amount trong Framer Motion
    delay?: number; // Sẽ được tích hợp vào prop 'transition'
}

const AnimatedContent = forwardRef<HTMLDivElement, AnimatedContentProps>(({
    children,
    distance = 100,
    direction = "vertical",
    reverse = false,
    // Mặc định transition của Framer Motion dựa trên config mặc định của react-spring
    transition = { type: "spring", stiffness: 50, damping: 25 },
    initialOpacity = 0,
    animateOpacity = true,
    initialScale = 1, // Giá trị scale ban đầu
    threshold = 0.1,
    delay = 0, // Framer Motion xử lý delay bên trong prop transition
}, ref) => {

    const axis = direction === "vertical" ? "y" : "x";
    const initialTranslateValue = reverse ? -distance : distance;

    const variants: Variants = {
        hidden: {
            [axis]: initialTranslateValue,
            opacity: animateOpacity ? initialOpacity : 1,
            scale: initialScale,
        },
        visible: {
            [axis]: 0,
            opacity: 1,
            scale: 1, // Hoạt ảnh luôn scale về 1
        },
    };

    // Kết hợp 'delay' vào đối tượng 'transition'
    // Ưu tiên 'delay' từ prop 'transition', sau đó là prop 'delay' riêng, cuối cùng là 0
    const effectiveTransition: Transition = {
        ...transition,
        delay: transition?.delay || delay || 0,
    };

    return (
        <motion.div
            ref={ref} // Component của Framer Motion chuyển tiếp ref trực tiếp
            variants={variants}
            initial="hidden" // Trạng thái ban đầu
            whileInView="visible" // Hoạt ảnh khi component hiển thị trong viewport
            viewport={{ once: true, amount: threshold }} // Cấu hình viewport: chạy 1 lần, ngưỡng hiển thị
            transition={effectiveTransition} // Áp dụng transition đã bao gồm delay
        >
            {children}
        </motion.div>
    );
});

// Thêm displayName để debug tốt hơn
AnimatedContent.displayName = 'AnimatedContent';

export default AnimatedContent;