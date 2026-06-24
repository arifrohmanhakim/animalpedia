export type { Animal, FamilyMember, FamilyGroup } from "./types";

export { categories } from "./categories";

import type { Animal } from "./types";
import { singa } from "./singa";
import { gajah } from "./gajah";
import { harimau } from "./harimau";
import { jerapah } from "./jerapah";
import { panda } from "./panda";
import { lumba_lumba } from "./lumba-lumba";
import { elang } from "./elang";
import { paus } from "./paus";
import { kupu_kupu } from "./kupu-kupu";
import { buaya } from "./buaya";
import { kanguru } from "./kanguru";
import { beruang } from "./beruang";
import { katak } from "./katak";
import { ular } from "./ular";
import { gurita } from "./gurita";
import { komodo } from "./komodo";
import { lebah } from "./lebah";
import { penguin } from "./penguin";
import { monyet } from "./monyet";
import { hiu } from "./hiu";
import { kambing } from "./kambing";
import { sapi } from "./sapi";
import { bebek } from "./bebek";
import { kakaktua } from "./kakaktua";
import { tokek } from "./tokek";
import { penyu } from "./penyu";
import { ikan_badut } from "./ikan-badut";
import { merak } from "./merak";
import { bintang_laut } from "./bintang-laut";
import { semut } from "./semut";
import { kuda_laut } from "./kuda-laut";
import { capung } from "./capung";
import { flamingo } from "./flamingo";
import { iguana } from "./iguana";
import { angsa } from "./angsa";
import { kura_kura } from "./kura-kura";
import { bunglon } from "./bunglon";
import { kunang_kunang } from "./kunang-kunang";
import { salamander } from "./salamander";
import { axolotl } from "./axolotl";
import { kambing_gunung } from "./kambing-gunung";
import { zebra } from "./zebra";
import { kucing } from "./kucing";
import { anjing } from "./anjing";
import { kelinci } from "./kelinci";
import { kuda } from "./kuda";
import { domba } from "./domba";
import { rubah } from "./rubah";
import { rusa } from "./rusa";
import { unta } from "./unta";
import { badak } from "./badak";
import { gorila } from "./gorila";
import { macan_tutul } from "./macan-tutul";
import { serigala } from "./serigala";
import { tikus } from "./tikus";
import { kelelawar } from "./kelelawar";
import { burung_hantu } from "./burung-hantu";
import { cendrawasih } from "./cendrawasih";
import { elang_laut } from "./elang-laut";
import { kobra } from "./kobra";
import { kadal } from "./kadal";
import { kepiting } from "./kepiting";
import { ubur_ubur } from "./ubur-ubur";
import { paus_pembunuh } from "./paus-pembunuh";
import { singa_laut } from "./singa-laut";
import { belalang } from "./belalang";
import { kumbang } from "./kumbang";
import { laba_laba } from "./laba-laba";
import { kodok } from "./kodok";

export const animalsList: Animal[] = [
  singa,
  gajah,
  harimau,
  jerapah,
  panda,
  lumba_lumba,
  elang,
  paus,
  kupu_kupu,
  buaya,
  kanguru,
  beruang,
  katak,
  ular,
  gurita,
  komodo,
  lebah,
  penguin,
  monyet,
  hiu,
  kambing,
  sapi,
  bebek,
  kakaktua,
  tokek,
  penyu,
  ikan_badut,
  merak,
  bintang_laut,
  semut,
  kuda_laut,
  capung,
  flamingo,
  iguana,
  angsa,
  kura_kura,
  bunglon,
  kunang_kunang,
  salamander,
  axolotl,
  kambing_gunung,
  zebra,
  kucing,
  anjing,
  kelinci,
  kuda,
  domba,
  rubah,
  rusa,
  unta,
  badak,
  gorila,
  macan_tutul,
  serigala,
  tikus,
  kelelawar,
  burung_hantu,
  cendrawasih,
  elang_laut,
  kobra,
  kadal,
  kepiting,
  ubur_ubur,
  paus_pembunuh,
  singa_laut,
  belalang,
  kumbang,
  laba_laba,
  kodok,
];

export { families, findFamilyForAnimal } from "./families";
export { PROGRESSION_ORDER, getProgressionState, getCurrentAnimalId } from "./progression";
export type { ProgressionState } from "./progression";
export const animals = animalsList;
