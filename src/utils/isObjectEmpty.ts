const isObjectEmpty = (obj: { [key: string]: unknown }) => {
  if (Object.keys(obj).length === 0) return true;

  return false;
};
export default isObjectEmpty;
