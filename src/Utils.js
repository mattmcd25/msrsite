// Lists
export const intersection = (arr1, arr2) => arr1.filter(x => arr2.includes(x));
export const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));

// Dictionaries
export const makeDict = list => Object.assign({}, ...list.map(head => ({[head]:''})));
export const filterObj = (obj) => Object.assign({}, ...Object.keys(obj).map(k =>
    (obj[k] === '' || obj[k] === false || obj[k] === undefined) ? {} : {[k]:obj[k]}
));
export const dictFromList = (list, key) => Object.assign({}, ...list.map(data => ({[data[key]]:data})));