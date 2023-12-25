export default function cc(...args: unknown[]) {
    return args.filter(arg =>typeof arg === 'string').join(' ');
    }