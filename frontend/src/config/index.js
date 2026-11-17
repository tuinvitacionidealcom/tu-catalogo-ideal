import celebrarteConfig from './celebrarte/celebrarteConfig.json';
import celebrartePortada from './celebrarte/foto-portada.webp';
import celebrarteForm from './celebrarte/img-formulario.webp';
import celebrarteLogo from './celebrarte/logo.webp';

import perlaFitConfig from './perla-fit/perlaFitConfig.json';
import perlaFitPortada from './perla-fit/foto-portada.webp';
import perlaFitForm from './perla-fit/img-formulario.webp';
import perlaFitLogo from './perla-fit/logo.webp';

celebrarteConfig.coverImage = celebrartePortada;
celebrarteConfig.logoImage = celebrarteLogo;
celebrarteConfig.formImage = celebrarteForm;

perlaFitConfig.coverImage = perlaFitPortada;
perlaFitConfig.logoImage = perlaFitLogo;
perlaFitConfig.formImage = perlaFitForm;

const catalogos = {
  'celebrarte': celebrarteConfig,
  'perla-fit': perlaFitConfig
};

export { celebrarteConfig, perlaFitConfig };
export default catalogos;
