// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get
export const get = (obj: any, path: string, defaultValue = undefined) => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

interface ObjPaths {
  data: any;
  path: string[];
}

export const getPaths = (data: any, dedupelicate?: boolean) => {
  let paths: string[][] = [];
  let nodes: ObjPaths[] = [
    {
      data,
      path: [],
    },
  ];
  while (nodes.length > 0) {
    const node = nodes.pop()!;
    const keys = Object.keys(node.data);
    let objKeys: string[] = [];
    for (const key of keys) {
      if (typeof node.data[key] === "object") {
        // handle nested objects and arrays
        const path = node.path.concat(key);
        paths.push(path);
        nodes.unshift({
          data: node.data[key],
          path,
        });
      } else {
        // collect the keys that are on top level objects
        objKeys = [...objKeys, key];
      }
    }
    for (const k of objKeys) {
      // add top level keys to path array
      const path = node.path.concat(k);
      paths.push(path);
    }
  }

  if (!dedupelicate) {
    return paths.map((p) => p.join("."));
  }
  // numbers represent array indexes, so we replace numbers with '*'
  const set = paths.map((path) =>
    path
      .map((p) => {
        const int = parseInt(p);
        return int || int === 0 ? "*" : p;
      })
      .join(".")
  );

  // dedupelicate paths and return, joined by '.'
  return Array.from(new Set(set));
};

export function flattenByPath<T>(data: T[], template: string) {
  // you gotta do stuff now boss
  const paths = getPaths(data)
  if (template.includes("*")) {
    const paths = template.split(".");
    for(let i = 0; i < paths.length; i++){
      const path = 
    }
  }
}

/[,[\].]+?/;
const reg = /[a-z]\.[a-z]\.[a-z]\.\d*\.[a-z]/gim;
const reg2 = /\w\.\w\../;
