// Frozen evidence, not the live art catalogue. Source revisions:
// v2: 5033130 levels.mjs + extra-levels.mjs; v3: 6833dbf target-calibration.mjs.
// Both versions used this exact scene order and sequential target-ID order.
// Same counts in six scenes make many schema-v1 saves indistinguishable.
const v3Names = {
  navratri: ['Rooftop cat', 'White goat', 'Painted little pot', 'Brass owl', 'Sleeping dog', 'Stone elephant', 'Perched peacock', 'Little doll', 'Painted owl', 'Wheeled horse', 'Balcony cat', 'Carved elephant'],
  ahmedabad: ['Blue bag', 'Telescope', 'Pink bird', 'Fish kite', 'Sun-face kite', 'Toy cow', 'Red toy elephant', 'Toy truck', 'Black binoculars', 'Owl kite', 'Wooden birdhouse', 'Red-white ball'],
  jamnagar: ['Rooftop peacock', 'Sewing machine', 'Black cat', 'Child’s pinwheel', 'Tall brass lantern', 'Walking striped cat', 'Painted elephant', 'Wooden comb', 'White conch', 'Walking white-pawed cat', 'Dog under the table', 'Coiled rope'],
  kutch: ['Black goat', 'White goat', 'Purple turban', 'Brass camel', 'Sitting cat', 'Ferris wheel', 'Carved owl', 'Wooden elephant', 'Hand mirror', 'Wheeled camel', 'Four-colour kite', 'Glowing lantern'],
  junagadh: ['Wall monkey', 'Bicycle', 'White cow', 'Brass elephant', 'Resting dog', 'Seated saffron sage', 'Brass sun face', 'Wheeled toy horse', 'Mango monkey', 'Striped spinning top', 'Clay owl', 'Carved horse'],
  surat: ['Green turban', 'Red stool', 'Green-fruit basket', 'Toy sailboat', 'Acoustic guitar', 'Parked bicycle', 'Ground pigeon', 'Drinking cat', 'Brass teapot', 'Wooden elephant', 'Rainbow stacking toy', 'Little bell stand'],
  patan: ['Spinning wheel', 'White goose', 'Courtyard dog', 'Yarn ball', 'Wooden elephant cart', 'Hanging lantern', 'Little tortoise', 'Tailor’s scissors', 'Painted toy car', 'Wooden ram', 'Small iron', 'Playful tabby', 'Balcony cat', 'Resting ginger cat'],
  garba: ['Pink lotus', 'Stage speaker', 'Blue-coated dancer', 'Tree owl', 'Colourful ball', 'Green parrot', 'Pond tortoise', 'Embroidered ball', 'Small stone elephant', 'Black toy elephant', 'Red toy cart', 'Stone elephant statue', 'Open pool lotus', 'Hanging brass bell'],
};
const catalogue = (version) => Object.freeze(Object.entries(v3Names).map(([id, names]) => Object.freeze({
  id, contentVersion: version,
  targets: Object.freeze(names.slice(0, version === 2 && ['navratri', 'ahmedabad'].includes(id) ? 10 : names.length)
    .map((name, index) => Object.freeze({id: `${id}-${index + 1}`, ...(version === 3 ? {name} : {})}))),
})));
export const historicalCatalogues = Object.freeze({2: catalogue(2), 3: catalogue(3)});
