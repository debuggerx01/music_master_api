export default (fn: any) => (...args: Array<any>) => fn(...args).catch(args[2]);
