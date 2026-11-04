/**
 * Silhouette au trait des remparts de Jérusalem (créneaux, deux tours, la tour de David, une coupole, la porte en arc),
 * dans un repère 1000 × 200. Sert à l'ouverture et aux filets décoratifs.
 */
function crenel(x1: number, x2: number, y: number, step = 18, h = 7) {
  let d = "";
  for (let x = x1; x < x2; x += step) {
    const a = Math.min(x + step / 2, x2);
    const b = Math.min(x + step, x2);
    d += ` H${a} V${y - h} H${b} V${y}`;
  }
  return d;
}

export function skylinePath() {
  const wall = 128;
  let d = `M0 170 H40 V${wall}`;
  d += crenel(40, 170, wall);
  d += ` V92` + crenel(170, 224, 92) + ` V${wall}`; // tour
  d += crenel(224, 380, wall);
  d += ` V112 H468 V${wall}`; // au-dessus de la porte
  d += crenel(468, 540, wall);
  d += ` H546 C546 84 622 84 622 ${wall}`; // coupole
  d += crenel(622, 660, wall);
  d += ` V60 H668 V50 H700 V60 H708 V${wall}`; // tour de David
  d += crenel(708, 820, wall);
  d += ` V96` + crenel(820, 862, 96) + ` V${wall}`; // tour
  d += crenel(862, 960, wall);
  d += ` V170 H1000`;
  // porte en arc et fenêtres de la tour de David
  d += ` M398 170 V146 A26 26 0 0 1 450 146 V170`;
  d += ` M680 92 V80 A4 4 0 0 1 688 80 V92`;
  d += ` M584 84 V72`;
  return d;
}

/** Onde sinusoïdale amortie qui part de la corde et s'éteint dans les remparts */
export function wavePath() {
  let d = "M0 110";
  for (let x = 0; x <= 1000; x += 8) {
    const t = x / 1000;
    const amp = 46 * Math.sin(Math.PI * t) * (1 - 0.55 * t);
    d += ` L${x} ${(110 + amp * Math.sin(x / 14)).toFixed(1)}`;
  }
  return d;
}
