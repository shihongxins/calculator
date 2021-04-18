import {
  create,
  chainDependencies,
  parserDependencies,
  parseDependencies,
  compileDependencies,
  evaluateDependencies,
  addDependencies,
  subtractDependencies,
  multiplyDependencies,
  divideDependencies,
  squareDependencies,
  sqrtDependencies,
  unitDependencies,
} from 'mathjs';

const factories = {
  chainDependencies,
  parserDependencies,
  parseDependencies,
  compileDependencies,
  evaluateDependencies,
  addDependencies,
  subtractDependencies,
  multiplyDependencies,
  divideDependencies,
  squareDependencies,
  sqrtDependencies,
  unitDependencies,
};
const config = {
  precision: 15,
};
const math = create(factories, config);
export { math as default };
