'use strict';

let {
    parse
} = require('..');
let assert = require('assert');

describe('index', () => {
    it('base', () => {
        assert.deepEqual(parse('a()'), {
            a: {
                params: [],
                parser: {}
            }
        });
    });

    it('simple params', () => {
        assert.deepEqual(parse('fun(p1, p2, p3)'), {
            'fun': {
                'params': [{
                    'name': 'p1'
                }, {
                    'name': 'p2'
                }, {
                    'name': 'p3'
                }],
                'parser': {}
            }
        });
    });

    it('simple return', () => {
        assert.deepEqual(parse('fun(p1, p2, p3) -> ret'), {
            'fun': {
                'params': [{
                    'name': 'p1'
                }, {
                    'name': 'p2'
                }, {
                    'name': 'p3'
                }],
                'parser': {
                    type: 'ret'
                }
            }
        });
    });

    it('simple lines', () => {
        assert.deepEqual(parse('f1(a, b)\nf2(c, d, e) -> ok'), {
            'f1': {
                'params': [{
                    'name': 'a'
                }, {
                    'name': 'b'
                }],
                'parser': {}
            },

            'f2': {
                'params': [{
                    'name': 'c'
                }, {
                    'name': 'd'
                }, {
                    'name': 'e'
                }],
                'parser': {
                    'type': 'ok'
                }
            }
        });
    });

    it('comment', () => {
        assert.deepEqual(parse('#comment1\nf1(a, b)\n#comment2'), {
            f1: {
                params: [{
                    name: 'a'
                }, {
                    name: 'b'
                }],

                parser: {}
            }
        });
    });

    it('type for param', () => {
        assert.deepEqual(parse('f(A a, B b, c)'), {
            'f': {
                'params': [{
                    'type': 'A',
                    'name': 'a'
                }, {
                    'type': 'B',
                    'name': 'b'
                }, {
                    'name': 'c'
                }],
                'parser': {}
            }
        });
    });

    it('return as value', () => {
        assert.deepStrictEqual(parse('f(a) -> T@10'), {
            'f': {
                'params': [{
                    'name': 'a'
                }],
                'parser': {
                    'type': 'T',
                    'value': 10
                }
            }
        });
    });

    it('default value', () => {
        assert.deepStrictEqual(parse('f(A a=null) -> T'), {
            'f': {
                'params': [{
                    type: 'A',
                    'name': 'a',
                    def: null
                }],
                'parser': {
                    'type': 'T'
                }
            }
        });
    });

    it('default value:{}', () => {
        assert.deepStrictEqual(parse('f(A a={}) -> T'), {
            'f': {
                'params': [{
                    type: 'A',
                    'name': 'a',
                    def: {}
                }],
                'parser': {
                    'type': 'T'
                }
            }
        });
    });

    it('default value:string', () => {
        assert.deepStrictEqual(parse('f(A a="123") -> T'), {
            'f': {
                'params': [{
                    type: 'A',
                    'name': 'a',
                    def: '123'
                }],
                'parser': {
                    'type': 'T'
                }
            }
        });
    });
});
