export const convertObjectToArray = (object: any) => {
    return Object.keys(object).map((key) => object[key]);
};
