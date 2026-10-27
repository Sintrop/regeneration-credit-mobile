/**
 * Single source of the app palette: tailwind.config.js builds the theme from it
 * and components that need raw values (skeleton loaders, charts) import it.
 */
module.exports = {
  background: '#1f5d38',
  green: {
    primary: '#75d63a',
    secondary: '#062c01',
    header: '#044640',
    btn: '#229b13',
  },
  blue: {
    primary: '#3e9ef5',
  },
  card: {
    primary: '#03364b',
    secondary: '#012939',
  },
  skeleton: '#ecebeb',
};
