type Size = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
type Type = "spinner" | "wave" | "circle";

interface LoadingProps {
    type?: Type;
    size?: Size;
    className?: string;
}

export { Size, Type, LoadingProps };
