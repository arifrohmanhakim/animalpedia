export interface RegionConfig {
  key: string;
  label: string;
  path: string;
  pinX: number;
  pinY: number;
}

/**
 * Simplified, stylized continent paths for a child-friendly world map.
 * ViewBox: 0 0 1000 500
 */
export const CONTINENTS: Record<string, RegionConfig> = {
  "north-america": {
    key: "north-america",
    label: "Amerika Utara",
    path: "M110,95 C140,48 220,40 290,48 C340,54 375,70 388,98 C400,125 385,155 365,178 C345,200 320,218 295,228 C272,237 252,238 238,228 C218,216 200,198 182,174 C164,150 148,128 134,108 C122,92 116,88 110,95 Z",
    pinX: 250,
    pinY: 148,
  },
  "south-america": {
    key: "south-america",
    label: "Amerika Selatan",
    path: "M252,230 C278,226 308,234 325,258 C342,282 348,312 342,345 C336,378 318,408 300,422 C282,436 268,440 258,432 C248,424 238,398 234,368 C230,338 230,308 234,278 C238,252 243,234 252,230 Z",
    pinX: 282,
    pinY: 332,
  },
  "europe": {
    key: "europe",
    label: "Eropa",
    path: "M458,80 C478,58 518,50 542,56 C566,62 582,78 588,100 C594,122 590,144 578,160 C566,176 548,186 530,190 C510,194 492,188 476,174 C460,160 448,140 442,120 C438,100 442,88 458,80 Z",
    pinX: 515,
    pinY: 122,
  },
  "africa": {
    key: "africa",
    label: "Afrika",
    path: "M452,192 C482,184 512,186 538,198 C558,208 572,226 576,252 C580,278 576,308 562,338 C548,368 528,388 508,398 C490,406 474,400 462,384 C450,368 442,342 438,312 C434,282 434,252 438,228 C442,210 446,198 452,192 Z",
    pinX: 510,
    pinY: 292,
  },
  "asia": {
    key: "asia",
    label: "Asia",
    path: "M572,58 C612,44 678,36 742,40 C802,44 852,62 882,90 C912,118 922,150 916,182 C910,214 888,242 858,264 C828,286 798,302 770,310 C742,318 722,316 702,302 C682,288 660,266 644,240 C628,214 616,186 604,158 C592,132 580,108 574,86 C570,70 568,62 572,58 Z",
    pinX: 740,
    pinY: 172,
  },
  "oceania": {
    key: "oceania",
    label: "Australia & Oseania",
    path: "M742,312 C772,302 808,308 828,326 C848,344 854,364 846,384 C838,404 816,414 790,414 C764,414 744,404 728,384 C712,364 708,344 716,328 C724,314 732,310 742,312 Z",
    pinX: 784,
    pinY: 362,
  },
  "antarctica": {
    key: "antarctica",
    label: "Antartika",
    path: "M130,460 C260,440 460,434 660,438 C810,442 890,452 898,468 C906,484 882,494 750,496 C520,498 320,498 180,494 C120,492 100,486 102,476 C104,466 110,462 130,460 Z",
    pinX: 500,
    pinY: 472,
  },
};

export type ContinentKey = keyof typeof CONTINENTS;

/** Maps distribution label → continent keys + display label */
export const DISTRIBUTION_MAP: Record<string, { continentKeys: ContinentKey[]; label: string }> = {
  "Afrika Sub-Sahara":   { continentKeys: ["africa"],         label: "📍 Afrika Sub-Sahara" },
  "Afrika Utara":        { continentKeys: ["africa"],         label: "📍 Afrika Utara" },
  "Asia Selatan":        { continentKeys: ["asia"],           label: "📍 Asia Selatan" },
  "Asia Tenggara":       { continentKeys: ["asia"],           label: "📍 Asia Tenggara" },
  "Asia Timur":          { continentKeys: ["asia"],           label: "📍 Asia Timur" },
  "Asia Tengah":         { continentKeys: ["asia"],           label: "📍 Asia Tengah" },
  "Eropa":               { continentKeys: ["europe"],         label: "📍 Eropa" },
  "Amerika Utara":       { continentKeys: ["north-america"],  label: "📍 Amerika Utara" },
  "Amerika Selatan":     { continentKeys: ["south-america"],  label: "📍 Amerika Selatan" },
  "Amerika Tengah":      { continentKeys: ["north-america","south-america"], label: "📍 Amerika Tengah" },
  "Australia & Oseania": { continentKeys: ["oceania"],        label: "📍 Australia & Oseania" },
  "Kutub Selatan":       { continentKeys: ["antarctica"],     label: "📍 Kutub Selatan" },
  "Di Seluruh Dunia":    { continentKeys: ["north-america","south-america","europe","africa","asia","oceania"], label: "📍 Di Seluruh Dunia" },
  "Semua Lautan":        { continentKeys: ["north-america","south-america","europe","africa","asia","oceania"], label: "📍 Semua Lautan" },
};