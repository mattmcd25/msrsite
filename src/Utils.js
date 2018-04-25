// Lists
export const intersection = (arr1, arr2) => arr1.filter(x => arr2.includes(x));
export const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));
// export const or = (list) => list.reduce((acc, cur) => acc || cur, false);
// export const and = (list) => list.reduce((acc, cur) => acc && cur, true);
export const count = (list) => list.reduce((acc, cur) => Object.assign(acc, {[cur]: (acc[cur] || 0) + 1}), {});
export const duplicates = list => {
    let dict = count(list);
    return Object.keys(dict).filter((a) => dict[a] > 1);
};

// Dictionaries
export const makeDict = list => Object.assign({}, ...list.map(head => ({[head]:''})));
export const filterObj = (obj) => Object.assign({}, ...Object.keys(obj).map(k =>
    (obj[k] === '' || obj[k] === false || obj[k] === undefined || JSON.stringify(obj[k]) === '{}') ? {} : {[k]:obj[k]}
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

// Strings
export const capitalize = str => str[0].toUpperCase() + str.slice(1);