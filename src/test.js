// const array = [
//   {
//     _id: '621723ddc1f73de5f7e4dcb9',
//     label: 'new 22',
//     slug: 'new-22',
//     vendor: 'admin',
//     options: Array(1)
//   },
//   {
//     _id: '6217272ec1f73de5f7e4dcba',
//     label: 'new 33',
//     slug: 'new-33',
//     vendor: 'admin',
//     options: Array(1)
//   }
// ]

// const newArray = array.map(({ label, slug }) => ({ label, slug }))

// console.log(newArray)


const object = { a: 5, b: 6, c: 7  };
const picked = (({ a, c }) => ({ a, c }))(object);

console.log(picked); // { a: 5, c: 7 }
