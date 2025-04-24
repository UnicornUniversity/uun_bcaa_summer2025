const a = { ahoj: { nazdar: true }, hello: true };
const b = JSON.parse(JSON.stringify(a));
a.ahoj.nazdar = false;

console.log(b);
