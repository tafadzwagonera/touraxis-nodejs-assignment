export default ((): Map<string, undefined | unknown> =>
  new Map(Object.entries(process.env)))()
