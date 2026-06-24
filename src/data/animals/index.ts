export type { Animal, FamilyMember, FamilyGroup } from './types';

export { categories } from './categories';

import type { Animal } from './types';
import { singa } from './singa';
import { gajah } from './gajah';
import { harimau } from './harimau';
import { jerapah } from './jerapah';
import { panda } from './panda';
import { lumba_lumba } from './lumba-lumba';
import { elang } from './elang';
import { paus } from './paus';
import { kupu_kupu } from './kupu-kupu';
import { buaya } from './buaya';
import { kanguru } from './kanguru';
import { beruang } from './beruang';
import { katak } from './katak';
import { ular } from './ular';
import { gurita } from './gurita';
import { komodo } from './komodo';
import { lebah } from './lebah';
import { penguin } from './penguin';
import { monyet } from './monyet';
import { hiu } from './hiu';
import { kambing } from './kambing';
import { sapi } from './sapi';
import { bebek } from './bebek';
import { kakaktua } from './kakaktua';
import { tokek } from './tokek';
import { penyu } from './penyu';
import { ikan_badut } from './ikan-badut';
import { merak } from './merak';
import { bintang_laut } from './bintang-laut';
import { semut } from './semut';
import { kuda_laut } from './kuda-laut';
import { capung } from './capung';
import { flamingo } from './flamingo';
import { iguana } from './iguana';
import { angsa } from './angsa';
import { kura_kura } from './kura-kura';
import { bunglon } from './bunglon';
import { kunang_kunang } from './kunang-kunang';
import { salamander } from './salamander';
import { axolotl } from './axolotl';
import { kambing_gunung } from './kambing-gunung';

export const animalsList: Animal[] = [
  singa, gajah, harimau, jerapah, panda,
  lumba_lumba, elang, paus, kupu_kupu,
  buaya, kanguru, beruang, katak, ular,
  gurita, komodo, lebah, penguin, monyet,
  hiu, kambing, sapi, bebek, kakaktua,
  tokek, penyu, ikan_badut, merak, bintang_laut,
  semut, kuda_laut, capung, flamingo, iguana,
  angsa, kura_kura, bunglon, kunang_kunang,
  salamander, axolotl, kambing_gunung,
];

export { families, findFamilyForAnimal } from './families';
export const animals = animalsList;
