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
        fontFamily: "'Bagel Fat One', cursive",
        color: "#000000",
        WebkitTextStroke: "0.04em #ffffff",
        paintOrder: "stroke fill",
        letterSpacing: "0.02em",
      }}
    >
      altn
    </span>
  );
};

export default AltnWordmark;
