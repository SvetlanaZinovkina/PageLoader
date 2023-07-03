const nameFile = (link) => {
  const { hostname, pathname } = new URL(link);
  const regex = /\W/g;
  const name = hostname.concat(pathname).replace(regex, '-').concat('.html');

  return name;
};

export default nameFile;
