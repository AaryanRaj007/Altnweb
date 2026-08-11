/**
 * The SaySo wordmark. Mirrors the desktop app's wordmark (Bagel Fat One,
 * brand yellow with a dark outline) so the site and the app read as one brand.
 */
const SaySoWordmark = ({
  className = "",
  title = "SaySo",
}: {
  className?: string;
  title?: string;
}) => {
  return (
    <span
      className={`inline-flex items-center select-none leading-none ${className}`}
      role="img"
      aria-label={title}
      // No fontSize here on purpose. The caller sets it via a Tailwind text-*
      // class, and an inline fontSize would win over it.
      style={{
        fontFamily: "var(--font-display)",
        color: "var(--sayso-yellow)",
        WebkitTextStroke: "0.04em var(--sayso-text)",
        paintOrder: "stroke fill",
        letterSpacing: "-0.01em",
      }}
    >
      SaySo
    </span>
  );
};

export default SaySoWordmark;
