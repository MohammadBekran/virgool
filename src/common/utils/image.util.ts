export function makeAbsoluteAddressOfGivenImagePath(path: string) {
  return `${process.env.URL}/${path?.slice(7).replaceAll('\\', '/')}`;
}
