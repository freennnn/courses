export const getLimit = () => {
  if (window.innerWidth < 700) {
    return 3;
  } else if (window.innerWidth < 1000) {
    return 6;
  } else {
    return 9;
  }
};
