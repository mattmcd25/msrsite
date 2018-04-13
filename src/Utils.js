// Lists
export const intersection = (arr1, arr2) => arr1.filter(x => arr2.includes(x));
export const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));
export const or = (list) => list.reduce((acc, cur) => acc || cur, false);
export const and = (list) => list.reduce((acc, cur) => acc && cur, true);

// Dictionaries
export const makeDict = list => Object.assign({}, ...list.map(head => ({[head]:''})));
export const filterObj = (obj) => Object.assign({}, ...Object.keys(obj).map(k =>
    (obj[k] === '' || obj[k] === false || obj[k] === undefined) ? {} : {[k]:obj[k]}
));
export const dictFromList = (list, key) => Object.assign({}, ...list.map(data => ({[data[key]]:data})));
export const uniteRoutes = (transforms) => {
    let reachedFrom = {};
    transforms.forEach(t => {
        if(reachedFrom.hasOwnProperty(t.from)) {
            reachedFrom[t.to] = reachedFrom[t.from];
            delete reachedFrom[t.from];
        }
        else {
            reachedFrom[t.to] = t.from;
        }
    });
    return reachedFrom;
};