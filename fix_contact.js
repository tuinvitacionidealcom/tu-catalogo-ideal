const fs = require('fs');
const path = require('path');

const contactFormPath = path.join(__dirname, 'frontend/src/components/common/ContactForm.jsx');
let contactForm = fs.readFileSync(contactFormPath, 'utf8');

// Modify the props of ContactForm
contactForm = contactForm.replace(
  `const ContactForm = ({ catalogId = 1, catalogName = 'Nuestros Servicios', imageUrl }) => {`,
  `const ContactForm = ({ 
  catalogId = 1, 
  catalogName = 'Nuestros Servicios', 
  imageUrl,
  subjectOptions = [
    { value: "Consulta General", label: "Consulta General" },
    { value: "Presupuesto", label: "Solicitar Presupuesto" },
    { value: "Envío / Stock", label: "Envíos y Stock" },
    { value: "Otro", label: "Otro Asunto" }
  ],
  buttonBackground = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
}) => {`
);

// Modify the select rendering
contactForm = contactForm.replace(
  `<option value="Consulta General">Consulta General</option>
                <option value="Presupuesto">Solicitar Presupuesto</option>
                <option value="Envío / Stock">Envíos y Stock</option>
                <option value="Otro">Otro Asunto</option>`,
  `{subjectOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}`
);

// Modify the button background
contactForm = contactForm.replace(
  `background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',`,
  `background: buttonBackground,`
);

fs.writeFileSync(contactFormPath, contactForm, 'utf8');

const celebrartePath = path.join(__dirname, 'frontend/src/catalogos/celebrarte-julieta/page/CelebrarteCatalogo.jsx');
let celebrarte = fs.readFileSync(celebrartePath, 'utf8');

const newProps = `catalogId={1} 
          catalogName={info.name || 'Celebrarte by Juli'} 
          imageUrl="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80"
          buttonBackground="#a67b5b"
          subjectOptions={[
            { value: "Consulta General", label: "Consulta General" },
            { value: "Presupuesto", label: "Solicitar Presupuesto" },
            { value: "Disponibilidad de Fechas", label: "Disponibilidad de Fechas" },
            { value: "Detalles de Servicio", label: "Detalles de Servicio" }
          ]}`;

celebrarte = celebrarte.replace(
  `catalogId={1} 
          catalogName={info.name || 'Celebrarte by Juli'} 
          imageUrl="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80"`,
  newProps
);

fs.writeFileSync(celebrartePath, celebrarte, 'utf8');

console.log('Done modifying ContactForm and CelebrarteCatalogo');
