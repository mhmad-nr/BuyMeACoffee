import { toast } from "react-toastify";
export const rString = (str: string, max: number) =>
  str.substring(0, max) + "..." + str.substring(str.length - max);
export function sameMembers<T>(firstArray: T[], secondArray: T[]) {
  const containsAll = (first: T[], second: T[]) =>
    second.every((secondItem) => first.includes(secondItem));
  return (
    containsAll(firstArray, secondArray) && containsAll(secondArray, firstArray)
  );
}

export const getTime = (timestamp: number) =>
  new Date(timestamp * 1000).toDateString();
export const bigIntToInt = (bigIntValue: BigInt) => {
  const bigIntString = bigIntValue.toString();

  return parseInt(bigIntString);
};
export const saveToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast("Copied in clipboard", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
export function concat<T>(one: T[], two: T[]): T[] {
  const c = one.concat(two);
  return c.filter((item, pos) => c.indexOf(item) === pos);
}
