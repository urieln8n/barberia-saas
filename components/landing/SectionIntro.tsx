type SectionIntroProps = {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
};

export function SectionIntro({ eyebrow, title, text, center = false }: SectionIntroProps) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-xs font-black uppercase tracking-widest text-[#D5A84C]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-[1.05] text-white md:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-base leading-8 text-white/60">{text}</p>}
    </div>
  );
}
