/**
 * The SaySo app icon, the yellow "S" mascot. Replaces the upstream hand mascot in
 * the hero slot. Uses the same source image the desktop app icon is generated
 * from, so the two never drift apart.
 */
const SaySoMark = ({
  className = "",
  alt = "The SaySo app icon: a rounded yellow letter S with two friendly eyes, on a black background.",
}: {
  className?: string;
  alt?: string;
}) => {
  return (
    <img
      src="/icon.png"
      className={`${className} rounded-3xl`}
      alt={alt}
      width={512}
      height={512}
      loading="eager"
    />
  );
};

export default SaySoMark;
