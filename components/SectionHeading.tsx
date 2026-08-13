export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-terracotta-600 mb-3">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl md:text-4xl text-teal-800 text-balance">{title}</h2>
      {description ? (
        <p className="mt-4 text-teal-700/80 text-base md:text-lg text-balance">{description}</p>
      ) : null}
    </div>
  );
}
