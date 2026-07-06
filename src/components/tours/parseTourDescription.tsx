type Props = {
    text: string;
  };
  
  type LineType = "price" | "heading" | "route" | "schedule" | "label" | "paragraph";
  
  function classifyLine(line: string): LineType {
    if (/^\$\.?\s*\d/.test(line)) return "price";
  
    const lettersOnly = line.replace(/[^A-Za-zÀ-ÿ]/g, "");
    const isAllCaps =
      lettersOnly.length > 0 &&
      lettersOnly === lettersOnly.toUpperCase() &&
      lettersOnly !== lettersOnly.toLowerCase();
    if (isAllCaps && line.length < 60) return "heading";
  
    const timeMatches = line.match(/\d{1,2}[.:]\d{2}\s?(am|pm)/gi);
    if (timeMatches && timeMatches.length >= 2) return "schedule";
  
    const wordCount = line.replace(/:$/, "").trim().split(/\s+/).length;
    if (line.endsWith(":") && wordCount <= 4) return "label";
  
    const routeParts = line.split(/\s[–-]\s/);
    if (routeParts.length >= 3 && line.length < 150) return "route";
  
    return "paragraph";
  }
  
  // Resalta en negrita palabras en MAYÚSCULAS sueltas dentro de un párrafo normal
  // (ej. "cerca del NEVADO APU AUSANGATE") sin gritar en mayúsculas.
  function renderParagraphWithHighlights(line: string, key: number) {
    const parts = line.split(/([A-ZÀ-Ý]{2,}(?:\s[A-ZÀ-Ý]{2,})*)/g);
    return (
      <p
        key={key}
        className="text-earth-800 mb-4"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "1.0625rem", lineHeight: "1.9" }}
      >
        {parts.map((part, i) => {
          const isCapsWord = /^[A-ZÀ-Ý]{2,}(?:\s[A-ZÀ-Ý]{2,})*$/.test(part);
          if (isCapsWord && part.trim().length > 2) {
            const normalized = part
              .toLowerCase()
              .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
            return (
              <strong key={i} className="font-semibold text-jungle-800">
                {normalized}
              </strong>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    );
  }
  
  export function ParsedTourDescription({ text }: Props) {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  
    const elements: React.ReactNode[] = [];
    let scheduleBuffer: string[] = [];
    let priceBuffer: string[] = [];
  
    const flushSchedule = (key: string) => {
      if (scheduleBuffer.length === 0) return;
      const times = scheduleBuffer
        .join(" ")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      elements.push(
        <div key={key} className="flex flex-wrap gap-2 mb-5">
          {times.map((time, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-full border border-jungle-200 bg-jungle-50 px-3 py-1 text-sm font-medium text-jungle-800"
            >
              {time.replace(/\.$/, "")}
            </span>
          ))}
        </div>
      );
      scheduleBuffer = [];
    };
  
    const flushPrices = (key: string) => {
      if (priceBuffer.length === 0) return;
      elements.push(
        <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {priceBuffer.map((line, i) => {
            const match = line.match(/\$\.?\s*(\d+)/);
            const amount = match ? match[1] : "";
            const rest = line.replace(/^\$\.?\s*\d+\s*Dólares?\s*/i, "").trim();
            return (
              <div
                key={i}
                className="rounded-xl border border-jungle-100 bg-gradient-to-br from-jungle-50 to-white px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-jungle-600">
                  {rest}
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-jungle-800">
                  ${amount} <span className="text-sm font-normal text-earth-500">USD</span>
                </p>
              </div>
            );
          })}
        </div>
      );
      priceBuffer = [];
    };
  
    lines.forEach((line, idx) => {
      const type = classifyLine(line);
  
      // Los precios y horarios se agrupan en bloques contiguos
      if (type !== "price" && priceBuffer.length > 0) flushPrices(`prices-${idx}`);
      if (type !== "schedule" && scheduleBuffer.length > 0) flushSchedule(`schedule-${idx}`);
  
      switch (type) {
        case "price":
          priceBuffer.push(line);
          break;
  
        case "schedule":
          scheduleBuffer.push(line);
          break;
  
        case "heading":
          elements.push(
            <h3
              key={idx}
              className="font-display text-lg font-semibold text-jungle-800 mt-6 mb-3 first:mt-0"
            >
              {line
                .toLowerCase()
                .replace(/(^|\s)\S/g, (c) => c.toUpperCase())
                .replace(/:$/, "")}
            </h3>
          );
          break;
  
        case "label":
          elements.push(
            <p key={idx} className="text-sm font-bold uppercase tracking-wide text-earth-500 mb-2">
              {line}
            </p>
          );
          break;
  
        case "route": {
          const steps = line.split(/\s[–-]\s/).map((s) => s.trim().replace(/\.$/, ""));
          elements.push(
            <div key={idx} className="flex flex-wrap items-center gap-2 mb-5 text-sm text-earth-700">
              {steps.map((step, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="rounded-lg bg-earth-100 px-3 py-1.5 font-medium">{step}</span>
                  {i < steps.length - 1 && (
                    <svg className="w-4 h-4 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </span>
              ))}
            </div>
          );
          break;
        }
  
        default:
          elements.push(renderParagraphWithHighlights(line, idx));
      }
    });
  
    // Por si el texto termina justo en un bloque de precios/horarios
    flushPrices("prices-end");
    flushSchedule("schedule-end");
  
    return <div>{elements}</div>;
  }