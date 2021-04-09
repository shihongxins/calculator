import {
  create,
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

const config = {
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
const math = create(config);
export { math as default };
