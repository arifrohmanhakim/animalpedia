import type { Animal } from './types';

export const gajah: Animal = {
    id: 'gajah',
    name: 'Gajah',
    englishName: 'Elephant',
    scientificName: 'Loxodonta africana',
    emoji: '🐘',
    illustrationSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <g stroke-linejoin="round" stroke-linecap="round">
    <!-- Back Left Leg -->
    <path d="M 165 385 C 165 375, 180 370, 195 370 L 205 370 C 220 370, 220 385, 220 400 L 220 435 C 220 450, 205 455, 195 455 C 180 455, 165 450, 165 435 Z" fill="#A0A0A0" stroke="#5B3E2B" stroke-width="6"/>

    <!-- Back Right Leg -->
    <path d="M 292 385 C 292 375, 307 370, 322 370 L 332 370 C 347 370, 347 385, 347 400 L 347 435 C 347 450, 332 455, 322 455 C 307 455, 292 450, 292 435 Z" fill="#A0A0A0" stroke="#5B3E2B" stroke-width="6"/>

    <!-- Tail -->
    <path d="M 155 300 C 130 315, 115 340, 112 370" fill="none" stroke="#5B3E2B" stroke-width="5"/>
    <path d="M 112 370 C 105 378, 102 385, 107 388 C 112 390, 118 385, 120 378 C 121 374, 117 370, 112 370 Z" fill="#A0A0A0" stroke="#5B3E2B" stroke-width="4"/>

    <!-- Body -->
    <path d="M 140 260 C 120 310, 115 385, 160 415 C 200 430, 312 430, 352 415 C 397 385, 392 310, 372 260 C 355 230, 310 225, 256 225 C 202 225, 157 230, 140 260 Z" fill="#B8B8B8" stroke="#5B3E2B" stroke-width="7"/>

    <!-- Belly -->
    <path d="M 165 360 C 165 392, 200 415, 256 415 C 312 415, 347 392, 347 360 C 347 342, 330 335, 256 335 C 182 335, 165 342, 165 360 Z" fill="#D0D0D0" stroke="none"/>

    <!-- Front Left Leg -->
    <path d="M 190 395 C 190 385, 205 380, 220 380 L 230 380 C 245 380, 245 395, 245 410 L 245 445 C 245 460, 230 465, 220 465 C 205 465, 190 460, 190 445 Z" fill="#B8B8B8" stroke="#5B3E2B" stroke-width="7"/>

    <!-- Front Right Leg -->
    <path d="M 267 395 C 267 385, 282 380, 297 380 L 307 380 C 322 380, 322 395, 322 410 L 322 445 C 322 460, 307 465, 297 465 C 282 465, 267 460, 267 445 Z" fill="#B8B8B8" stroke="#5B3E2B" stroke-width="7"/>

    <!-- Left Ear -->
    <path d="M 182 165 C 145 115, 70 125, 65 200 C 60 265, 100 295, 155 290 C 185 287, 195 255, 198 225 Z" fill="#A0A0A0" stroke="#5B3E2B" stroke-width="7"/>

    <!-- Right Ear -->
    <path d="M 330 165 C 367 115, 442 125, 447 200 C 452 265, 412 295, 357 290 C 327 287, 317 255, 314 225 Z" fill="#A0A0A0" stroke="#5B3E2B" stroke-width="7"/>

    <!-- Head -->
    <path d="M 176 180 C 171 118, 202 98, 256 98 C 310 98, 341 118, 336 180 C 334 222, 318 248, 256 248 C 194 248, 178 222, 176 180 Z" fill="#B8B8B8" stroke="#5B3E2B" stroke-width="7"/>

    <!-- Left Inner Ear -->
    <path d="M 178 170 C 150 135, 88 145, 85 205 C 82 250, 112 275, 155 271 C 178 268, 186 245, 190 220 Z" fill="#C9A9A0" stroke="#5B3E2B" stroke-width="5"/>

    <!-- Right Inner Ear -->
    <path d="M 334 170 C 362 135, 424 145, 427 205 C 430 250, 400 275, 357 271 C 334 268, 326 245, 322 220 Z" fill="#C9A9A0" stroke="#5B3E2B" stroke-width="5"/>

    <!-- Trunk -->
    <path d="M 234 242 C 230 280, 215 330, 230 370 C 237 388, 252 385, 258 368 C 266 342, 258 310, 262 270 C 265 255, 258 242, 248 240 Z" fill="#B8B8B8" stroke="#5B3E2B" stroke-width="7"/>

    <!-- Trunk curl -->
    <path d="M 230 370 C 225 385, 240 395, 256 383" fill="none" stroke="#5B3E2B" stroke-width="5"/>

    <!-- Left Tusk -->
    <path d="M 238 252 C 220 275, 214 305, 220 318 C 226 326, 236 315, 244 292 C 249 278, 250 265, 247 255 Z" fill="#FFF8E7" stroke="#5B3E2B" stroke-width="5"/>

    <!-- Right Tusk -->
    <path d="M 274 252 C 292 275, 298 305, 292 318 C 286 326, 276 315, 268 292 C 263 278, 262 265, 265 255 Z" fill="#FFF8E7" stroke="#5B3E2B" stroke-width="5"/>

    <!-- Eyes -->
    <circle cx="222" cy="185" r="8" fill="#1A1A1A" stroke="#5B3E2B" stroke-width="4"/>
    <circle cx="290" cy="185" r="8" fill="#1A1A1A" stroke="#5B3E2B" stroke-width="4"/>

    <!-- Catchlights -->
    <circle cx="220" cy="182" r="3" fill="#FFFFFF" stroke="none"/>
    <circle cx="288" cy="182" r="3" fill="#FFFFFF" stroke="none"/>

    <!-- Eye corner wrinkles -->
    <path d="M 212 184 C 216 186, 218 186, 220 184" fill="none" stroke="#5B3E2B" stroke-width="3"/>
    <path d="M 300 184 C 296 186, 294 186, 292 184" fill="none" stroke="#5B3E2B" stroke-width="3"/>

    <!-- Subtle smile -->
    <path d="M 244 232 C 250 236, 262 236, 268 232" fill="none" stroke="#5B3E2B" stroke-width="4"/>

    <!-- Glossy highlight on forehead -->
    <path d="M 230 125 C 238 117, 250 117, 256 121 C 260 123, 258 128, 252 128 C 244 128, 234 131, 230 125 Z" fill="#FFFFFF" opacity="0.35" stroke="none"/>

    <!-- Glossy highlight on body -->
    <path d="M 195 265 C 203 257, 218 255, 225 258 C 228 260, 226 264, 220 264 C 212 264, 198 269, 195 265 Z" fill="#FFFFFF" opacity="0.3" stroke="none"/>

    <!-- Toenails -->
    <ellipse cx="210" cy="460" rx="5" ry="4" fill="#D4D4D4" stroke="#5B3E2B" stroke-width="3"/>
    <ellipse cx="223" cy="461" rx="5" ry="4" fill="#D4D4D4" stroke="#5B3E2B" stroke-width="3"/>
    <ellipse cx="236" cy="460" rx="5" ry="4" fill="#D4D4D4" stroke="#5B3E2B" stroke-width="3"/>
    <ellipse cx="276" cy="460" rx="5" ry="4" fill="#D4D4D4" stroke="#5B3E2B" stroke-width="3"/>
    <ellipse cx="289" cy="461" rx="5" ry="4" fill="#D4D4D4" stroke="#5B3E2B" stroke-width="3"/>
    <ellipse cx="302" cy="460" rx="5" ry="4" fill="#D4D4D4" stroke="#5B3E2B" stroke-width="3"/>
  </g>
</svg>`,
    category: 'mamalia',
    habitat: 'Savana dan Hutan',
    habitatEmoji: '🌳',
    food: 'Tumbuhan (herbivora)',
    foodEmoji: '🌿',
    lifespan: '60–70 tahun',
    weight: '3.000–6.000 kg',
    description: 'Gajah adalah hewan darat terbesar di dunia! Mereka sangat cerdas, memiliki ingatan yang kuat, dan hidup dalam keluarga yang dipimpin oleh gajah betina tertua.',
    color: '#B8B8B8',
    funFacts: [
      'Belalai gajah memiliki sekitar 100.000 otot dan bisa menampung 7,5 liter air!',
      'Gajah bisa berkomunikasi melalui getaran tanah dari jarak jauh.',
      'Anak gajah sering menghisap belalainya sendiri untuk rasa nyaman, seperti bayi menghisap jempol.',
      'Gajah mandi lumpur untuk melindungi kulit dari sinar matahari dan gigitan serangga.',
      'Gajah dewasa bisa makan hingga 136 kg makanan dalam sehari!',
    ],
    conservationStatus: 'terancam',
    videoEmbedUrl: 'https://www.youtube.com/embed/Fk3VdpuFx0Q',
    videoUrl: 'https://www.youtube.com/watch?v=Fk3VdpuFx0Q',
    distribution: ['Afrika Sub-Sahara', 'Asia Selatan', 'Asia Tenggara'],
    distributionCountries: 'Afrika, India, Thailand, Sri Lanka, Indonesia (Sumatra)',
  };
