/**
 * Single source of the app palette: tailwind.config.js builds the theme from it
 * and components that need raw values (skeleton loaders, charts) import it.
 */
module.exports = {
  background: '#0e2a1f',
  green: {
    primary: '#75d63a',
    secondary: '#062c01',
    header: '#0a2118',
    btn: '#229b13',
  },
  blue: {
    primary: '#3e9ef5',
  },
  card: {
    primary: '#173d2e',
    secondary: '#0b2219',
  },
  skeleton: '#2c5a47',
};
