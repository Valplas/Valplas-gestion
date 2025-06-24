export const fakeFetch = (res:any) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => resolve(res), 2000);
  });
};