// make TypeScript understand json files
declare module '*.json' {
    const value: any;
    export default value;
}
