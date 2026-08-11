const AltnWordmark = ({
  className = "",
  title = "altn",
}: {
  className?: string;
  title?: string;
}) => {
  return (
    <span
      className={`inline-flex items-center select-none leading-none ${className}`}
      role="img"
      aria-label={title}
      style={{
        fontFamily: "var(--font-display)",
        color: "var(--sayso-yellow)",
        WebkitTextStroke: "0.03em var(--sayso-text)",
        paintOrder: "stroke fill",
        letterSpacing: "0.02em",
      }}
    >
      altn
    </span>
  );
};

export default AltnWordmark;
