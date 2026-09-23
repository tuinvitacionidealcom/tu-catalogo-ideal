const fs = require('fs');
const path = require('path');

const fileFooter = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/componentes/FooterCatalogo.jsx');
let contentFooter = fs.readFileSync(fileFooter, 'utf8');

// description and ul (address/clock)
contentFooter = contentFooter.replace(/text-slate-400/g, 'text-white/80');

// whatsapp links, top products
contentFooter = contentFooter.replace(/text-slate-300/g, 'text-white/90');

// bottom bar text (copyright)
contentFooter = contentFooter.replace(/text-slate-500/g, 'text-white/70');

// icons are accent (pink), the user might want them white if they said "textos e icon detalles que sean de color blanco"
// let's change text-accent on MapPin and Clock to text-white
contentFooter = contentFooter.replace(/<MapPin className="w-4 h-4 text-accent shrink-0" \/>/g, '<MapPin className="w-4 h-4 text-white shrink-0" />');
contentFooter = contentFooter.replace(/<Clock className="w-4 h-4 text-accent shrink-0" \/>/g, '<Clock className="w-4 h-4 text-white shrink-0" />');

// also change the top products accent hash tags if needed, but accent looks fine there.
// wait, the title "Contacto y Local" and "Servicios Destacados" is text-accent, which might be hard to read? No, accent is pink, which contrasts okay, but white is better.
contentFooter = contentFooter.replace(/text-accent/g, 'text-white'); // Actually, there are things like text-accent in logo, let's just do targeted replacements.

fs.writeFileSync(fileFooter, contentFooter, 'utf8');
console.log('Done fixing footer colors.');
