'use strict';

const headReg = /(.*)\((.*)\)/;

/**
 * str -> ast
 */
let parse = (str) => {
    let lines = str.split('\n');

    let result = {};

    let linesLen = lines.length;

    for (let i = 0; i < linesLen; i++) {
        let line = lines[i];
        line = line.trim();

        if (line && line[0] !== '#') {
            let part = parseLine(line);
            if (part) {
                result[part.name] = {
                    params: part.params,
                    parser: part.parser || {}
                };
            }
        }
    }

    return result;
};

let parseLine = (line) => {
    let parts = line.split('->');
    let headStr = parts[0];
    let returnStr = line.substring(headStr.length + 2);

    let {
        params, name
    } = parseHead(headStr);

    return {
        name,
        params,
        parser: parseReturn(returnStr)
    };
};

/**
 *
 *  {
 *        params: [{
 *            name: 'a',
 *            type: 'A'
 *        }, {
 *            name: 'b',
 *            def: null
 *        }],
 *        parser: {
 *            type: 'B'
 *        }
 *    }
 *
 */
let parseHead = (headStr) => {
    headStr = headStr.trim();
    let rets = headReg.exec(headStr);
    if (!rets) {
        throw new Error(`fail to match params for string ${headStr}`);
    }

    let name = rets[1],
        paramsStr = rets[2];

    return {
        name: name.trim(),
        params: parseParams(paramsStr)
    };
};

let parseParams = (paramsStr) => {
    let params = [];
    paramsStr = paramsStr.trim();
    if (!paramsStr) return params;
    let parts = paramsStr.split(',');

    let partLen = parts.length;
    for (let i = 0; i < partLen; i++) {
        let part = parts[i];
        part = part.trim();
        if (part) {
            params.push(parseParam(part));
        }
    }

    return params;
};

let parseParam = (paramStr) => {
    let parts = paramStr.split(' ');
    if (parts.length === 1) {
        return {
            name: parts[0]
        };
    }
    let type = parts[0],
        rest = paramStr.substring(type.length).trim();

    let defs = rest.split('=');
    if (defs.length === 1) {
        return {
            type,
            name: rest
        };
    } else {
        let name = defs[0];
        let def = rest.substring(name.length + 1);
        return {
            type,
            def: parseDef(def), name: name.trim()
        };
    }
};

let parseDef = (def) => {
    if (def === '{}') return {};
    if (def === '[]') return [];
    if (def === 'null') return null;
    if (def === 'true') return true;
    if (def === 'false') return false;
    if (/^\d+$/.test(def)) return Number(def);
    if (def[0] === '"' && def[def.length - 1] === '"') {
        return def.substring(1, def.length - 1);
    }

    return null;
};

let parseReturn = (returnStr) => {
    returnStr = returnStr.trim();
    if (!returnStr) return null;
    let parts = returnStr.split('@');
    if (parts.length === 1) {
        return {
            type: returnStr
        };
    } else {
        let type = parts[0];
        let rest = returnStr.substring(type.length + 1).trim();
        return {
            type,
            value: parseDef(rest)
        };
    }
};

module.exports = {
    parse
};
