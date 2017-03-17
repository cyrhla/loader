/**
 * @package @cyrhla/loader
 * @license MIT
 * @copyright Krystian Pietruszka <kpietru@cyrhla.com>
 * @see http://www.cyrhla.com
 */

'use strict'

const Tester                 = require('@cyrhla/tester/Tester')
const ContainerXmlNormalizer = require('../../Normalizer/ContainerXmlNormalizer')

/**
 * ContainerXmlNormalizerTest
 *
 * @author Krystian Pietruszka <kpietru@cyrhla.com>
 */
module.exports = class ContainerXmlNormalizerTest extends Tester
{
    before()
    {
        this.obj = {}
        this.attrKey = '$'
        this.charKey = '_'

        this.parseObj = {
            "$": {
                "xmlns": "http://www.cyrhla.com/2017/schema/container",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container http://www.cyrhla.com/2017/schema/container-0.0.1.xsd"
            },
            "parameters": [
                {
                    "parameter": [
                        {
                            "$": {
                                "id": "foo"
                            }
                        },
                        {
                            "_": -0.1,
                            "$": {
                                "id": "bar"
                            }
                        },
                        {
                            "_": 0,
                            "$": {
                                "id": "baz"
                            }
                        },
                        {
                            "_": "false ",
                            "$": {
                                "id": null
                            }
                        }
                    ]
                }
            ],
            "services": [
                {
                    "service": [
                        {
                            "$": {
                                "id": "bar",
                                "alias": "żółć",
                                "class": null,
                                "public": true
                            },
                            "arguments": [
                                {
                                    "argument": [
                                        "arg1",
                                        "arg2"
                                    ]
                                }
                            ],
                            "argument": [
                                "arg3"
                            ],
                            "call": [
                                {
                                    "$": {
                                        "method": "someMethod"
                                    },
                                    "arguments": [
                                        {
                                            "argument": [
                                                "a1",
                                                "a2"
                                            ]
                                        }
                                    ],
                                    "argument": [
                                        "a3"
                                    ]
                                }
                            ],
                            "tags": [
                                {
                                    "tag": [
                                        "tag1",
                                        "tag2"
                                    ]
                                }
                            ],
                            "tag": [
                                "tag3"
                            ]
                        },
                        {
                            "$": {
                                "id": "baz",
                                "class": "@some/module/Class",
                                "public": false
                            },
                            "arguments": [
                                {
                                    "argument": [
                                        "",
                                        " "
                                    ]
                                }
                            ],
                            "argument": [
                                " żółć "
                            ],
                            "call": [
                                {
                                    "$": {
                                        "method": "someMethod"
                                    },
                                    "arguments": [
                                        {
                                            "argument": [
                                                -0.1
                                            ]
                                        }
                                    ],
                                    "argument": [
                                        "undefined"
                                    ]
                                }
                            ],
                            "tags": [
                                {
                                    "tag": [
                                        "tag1",
                                        "tag2"
                                    ]
                                }
                            ],
                            "tag": [
                                "tag3\n"
                            ]
                        }
                    ]
                }
            ]
        }

        this.parseObjWithoutIdAttribute = {
            "$": {
                "xmlns": "http://www.cyrhla.com/2017/schema/container",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container http://www.cyrhla.com/2017/schema/container-0.0.1.xsd"
            },
            "parameters": [
                {
                    "parameter": [
                        {
                            "$": {
                                "id": "foo"
                            }
                        },
                        {
                            "_": -0.1,
                            "$": {
                                "id": "bar"
                            }
                        },
                        {
                            "_": 0,
                            "$": {
                                "id": "baz"
                            }
                        },
                        {
                            "_": "false ",
                            "$": {
                                "iddddddddddddddddddddddddddddddddddd": null
                            }
                        }
                    ]
                }
            ],
            "services": [
                {
                    "service": [
                        {
                            "$": {
                                "id": "bar",
                                "alias": "żółć",
                                "class": null,
                                "public": true
                            },
                            "arguments": [
                                {
                                    "argument": [
                                        "arg1",
                                        "arg2"
                                    ]
                                }
                            ],
                            "argument": [
                                "arg3"
                            ],
                            "call": [
                                {
                                    "$": {
                                        "method": "someMethod"
                                    },
                                    "arguments": [
                                        {
                                            "argument": [
                                                "a1",
                                                "a2"
                                            ]
                                        }
                                    ],
                                    "argument": [
                                        "a3"
                                    ]
                                }
                            ],
                            "tags": [
                                {
                                    "tag": [
                                        "tag1",
                                        "tag2"
                                    ]
                                }
                            ],
                            "tag": [
                                "tag3"
                            ]
                        },
                        {
                            "$": {
                                "id": "baz",
                                "class": "@some/module/Class",
                                "public": false
                            },
                            "arguments": [
                                {
                                    "argument": [
                                        "",
                                        " "
                                    ]
                                }
                            ],
                            "argument": [
                                " żółć "
                            ],
                            "call": [
                                {
                                    "$": {
                                        "method": "someMethod"
                                    },
                                    "arguments": [
                                        {
                                            "argument": [
                                                -0.1
                                            ]
                                        }
                                    ],
                                    "argument": [
                                        "undefined"
                                    ]
                                }
                            ],
                            "tags": [
                                {
                                    "tag": [
                                        "tag1",
                                        "tag2"
                                    ]
                                }
                            ],
                            "tag": [
                                "tag3\n"
                            ]
                        }
                    ]
                }
            ]
        }

        this.parseObjWithoutMethodAttribute = {
            "$": {
                "xmlns": "http://www.cyrhla.com/2017/schema/container",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container http://www.cyrhla.com/2017/schema/container-0.0.1.xsd"
            },
            "parameters": [
                {
                    "parameter": [
                        {
                            "$": {
                                "id": "foo"
                            }
                        },
                        {
                            "_": -0.1,
                            "$": {
                                "id": "bar"
                            }
                        },
                        {
                            "_": 0,
                            "$": {
                                "id": "baz"
                            }
                        },
                        {
                            "_": "false ",
                            "$": {
                                "id": null
                            }
                        }
                    ]
                }
            ],
            "services": [
                {
                    "service": [
                        {
                            "$": {
                                "id": "bar",
                                "alias": "żółć",
                                "class": null,
                                "public": true
                            },
                            "arguments": [
                                {
                                    "argument": [
                                        "arg1",
                                        "arg2"
                                    ]
                                }
                            ],
                            "argument": [
                                "arg3"
                            ],
                            "call": [
                                {
                                    "$": {
                                        "methodddddddddddddddddddddddddddddddd": "someMethod"
                                    },
                                    "arguments": [
                                        {
                                            "argument": [
                                                "a1",
                                                "a2"
                                            ]
                                        }
                                    ],
                                    "argument": [
                                        "a3"
                                    ]
                                }
                            ],
                            "tags": [
                                {
                                    "tag": [
                                        "tag1",
                                        "tag2"
                                    ]
                                }
                            ],
                            "tag": [
                                "tag3"
                            ]
                        },
                        {
                            "$": {
                                "id": "baz",
                                "class": "@some/module/Class",
                                "public": false
                            },
                            "arguments": [
                                {
                                    "argument": [
                                        "",
                                        " "
                                    ]
                                }
                            ],
                            "argument": [
                                " żółć "
                            ],
                            "call": [
                                {
                                    "$": {
                                        "method": "someMethod"
                                    },
                                    "arguments": [
                                        {
                                            "argument": [
                                                -0.1
                                            ]
                                        }
                                    ],
                                    "argument": [
                                        "undefined"
                                    ]
                                }
                            ],
                            "tags": [
                                {
                                    "tag": [
                                        "tag1",
                                        "tag2"
                                    ]
                                }
                            ],
                            "tag": [
                                "tag3\n"
                            ]
                        }
                    ]
                }
            ]
        }

        // @ =
        this.parseObjWithCustomKeysAttributes = {
            "@": {
                "xmlns": "http://www.cyrhla.com/2017/schema/container",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container http://www.cyrhla.com/2017/schema/container-0.0.1.xsd"
            },
            "parameters": [
                {
                    "parameter": [
                        {
                            "@": {
                                "id": "foo"
                            }
                        },
                        {
                            "=": -0.1,
                            "@": {
                                "id": "bar"
                            }
                        },
                        {
                            "=": 0,
                            "@": {
                                "id": "baz"
                            }
                        },
                        {
                            "=": "false ",
                            "@": {
                                "id": null
                            }
                        }
                    ]
                }
            ],
            "services": [
                {
                    "service": [
                        {
                            "@": {
                                "id": "bar",
                                "alias": "żółć",
                                "class": null,
                                "public": true
                            },
                            "arguments": [
                                {
                                    "argument": [
                                        "arg1",
                                        "arg2"
                                    ]
                                }
                            ],
                            "argument": [
                                "arg3"
                            ],
                            "call": [
                                {
                                    "@": {
                                        "method": "someMethod"
                                    },
                                    "arguments": [
                                        {
                                            "argument": [
                                                "a1",
                                                "a2"
                                            ]
                                        }
                                    ],
                                    "argument": [
                                        "a3"
                                    ]
                                }
                            ],
                            "tags": [
                                {
                                    "tag": [
                                        "tag1",
                                        "tag2"
                                    ]
                                }
                            ],
                            "tag": [
                                "tag3"
                            ]
                        },
                        {
                            "@": {
                                "id": "baz",
                                "class": "@some/module/Class",
                                "public": false
                            },
                            "arguments": [
                                {
                                    "argument": [
                                        "",
                                        " "
                                    ]
                                }
                            ],
                            "argument": [
                                " żółć "
                            ],
                            "call": [
                                {
                                    "@": {
                                        "method": "someMethod"
                                    },
                                    "arguments": [
                                        {
                                            "argument": [
                                                -0.1
                                            ]
                                        }
                                    ],
                                    "argument": [
                                        "undefined"
                                    ]
                                }
                            ],
                            "tags": [
                                {
                                    "tag": [
                                        "tag1",
                                        "tag2"
                                    ]
                                }
                            ],
                            "tag": [
                                "tag3\n"
                            ]
                        }
                    ]
                }
            ]
        }

        this.expected = {
            "parameters": {
                "bar": -0.1,
                "baz": 0,
                "null": "false "
            },
            "services": {
                "bar": {
                    "id": "bar",
                    "alias": "żółć",
                    "class": null,
                    "public": true,
                    "arguments": [
                        "arg3",
                        "arg1",
                        "arg2"
                    ],
                    "calls": [
                        [
                            "someMethod",
                            [
                                "a3",
                                "a1",
                                "a2"
                            ]
                        ]
                    ],
                    "tags": [
                        "tag3",
                        "tag1",
                        "tag2"
                    ]
                },
                "baz": {
                    "id": "baz",
                    "class": "@some/module/Class",
                    "public": false,
                    "arguments": [
                        " żółć ",
                        "",
                        " "
                    ],
                    "calls": [
                        [
                            "someMethod",
                            [
                                "undefined",
                                -0.1
                            ]
                        ]
                    ],
                    "tags": [
                        "tag3\n",
                        "tag1",
                        "tag2"
                    ]
                }
            },
            "$": [
                {
                    "xmlns": "http://www.cyrhla.com/2017/schema/container",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container http://www.cyrhla.com/2017/schema/container-0.0.1.xsd"
                }
            ]
        }

        this.expectedCustomKeys = {
            "parameters": {
                "bar": -0.1,
                "baz": 0,
                "null": "false "
            },
            "services": {
                "bar": {
                    "id": "bar",
                    "alias": "żółć",
                    "class": null,
                    "public": true,
                    "arguments": [
                        "arg3",
                        "arg1",
                        "arg2"
                    ],
                    "calls": [
                        [
                            "someMethod",
                            [
                                "a3",
                                "a1",
                                "a2"
                            ]
                        ]
                    ],
                    "tags": [
                        "tag3",
                        "tag1",
                        "tag2"
                    ]
                },
                "baz": {
                    "id": "baz",
                    "class": "@some/module/Class",
                    "public": false,
                    "arguments": [
                        " żółć ",
                        "",
                        " "
                    ],
                    "calls": [
                        [
                            "someMethod",
                            [
                                "undefined",
                                -0.1
                            ]
                        ]
                    ],
                    "tags": [
                        "tag3\n",
                        "tag1",
                        "tag2"
                    ]
                }
            },
            "@": [
                {
                    "xmlns": "http://www.cyrhla.com/2017/schema/container",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container http://www.cyrhla.com/2017/schema/container-0.0.1.xsd"
                }
            ]
        }
    }

    testConstructorArgumentInvalidTypeError()
    {
        var self = this

        // Invalid obj.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new ContainerXmlNormalizer(arg, self.attrKey, self.charKey)
            }, index)
        }

        // Invalid attrKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new ContainerXmlNormalizer(self.obj, arg, self.charKey)
            }, index)
        }

        // Invalid charKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new ContainerXmlNormalizer(self.obj, self.attrKey, arg)
            }, index)
        }
    }

    testAllReturnsObject()
    {
        var containerXmlNormalizer = new ContainerXmlNormalizer(this.obj, this.attrKey, this.charKey)
        this.assertSame({}, containerXmlNormalizer.all())

        var parseObj = {"foo":"bar","baz":null}
        var containerXmlNormalizer = new ContainerXmlNormalizer(parseObj, this.attrKey, this.charKey)
        this.assertSame({}, containerXmlNormalizer.all())

        var containerXmlNormalizer = new ContainerXmlNormalizer(this.parseObj, this.attrKey, this.charKey)
        this.assertSame(this.expected, containerXmlNormalizer.all())

        var containerXmlNormalizer = new ContainerXmlNormalizer(this.parseObjWithCustomKeysAttributes, '@', '=')
        this.assertSame(this.expectedCustomKeys, containerXmlNormalizer.all())
    }

    test_getTagAndTagsArgumentInvalidTypeError()
    {
        var containerXmlNormalizer = new ContainerXmlNormalizer(this.obj, this.attrKey, this.charKey)
        var self = this

        // Invalid obj.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                containerXmlNormalizer._getTagAndTags(arg, '', '')
            }, index)
        }

        // Invalid tagName.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                containerXmlNormalizer._getTagAndTags({}, arg, '')
            }, index)
        }

        // Invalid tagsName.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                containerXmlNormalizer._getTagAndTags({}, '', arg)
            }, index)
        }
    }

    test_getTagAndTagsReturnsArray()
    {
        var containerXmlNormalizer = new ContainerXmlNormalizer(this.obj, this.attrKey, this.charKey)

        this.assertSame([], containerXmlNormalizer._getTagAndTags({}, '', ''))

        var obj = {
            "$": {
                "method": "someMethod"
            },
            "arguments": [
                {
                    "argument": [
                        9,
                        999999999999999,
                        10000000000000000,
                        9.999999999999998,
                        1e+21
                    ]
                }
            ],
            "argument": [
                "undefined"
            ]
        }

        var result = [
            "undefined",
            9,
            999999999999999,
            10000000000000000,
            9.999999999999998,
            1e+21
        ]
        this.assertSame(result, containerXmlNormalizer._getTagAndTags(obj, 'argument', 'arguments'))
    }

    test_getMethodAndArgumentsArgumentInvalidTypeError()
    {
        var containerXmlNormalizer = new ContainerXmlNormalizer(this.obj, this.attrKey, this.charKey)
        var self = this

        // Invalid call.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                containerXmlNormalizer._getMethodAndArguments(arg, '')
            }, index)
        }

        // Invalid attrKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                containerXmlNormalizer._getMethodAndArguments({}, arg)
            }, index)
        }
    }

    test_getMethodAndArgumentsReturnsArray()
    {
        var containerXmlNormalizer = new ContainerXmlNormalizer(this.obj, this.attrKey, this.charKey)

        var obj = {
            "$": {
                "method": "someMethod"
            },
            "arguments": [
                {
                    "argument": [
                        "a1",
                        "a2"
                    ]
                }
            ],
            "argument": [
                "a3"
            ]
        }

        var result = [
            "someMethod",
            [
                "a3",
                "a1",
                "a2"
            ]
        ]
        this.assertSame(result, containerXmlNormalizer._getMethodAndArguments(obj, this.attrKey))
    }

    test_getCallAndCallsArgumentInvalidTypeError()
    {
        var containerXmlNormalizer = new ContainerXmlNormalizer(this.obj, this.attrKey, this.charKey)
        var self = this

        // Invalid service.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                containerXmlNormalizer._getCallAndCalls(arg, '')
            }, index)
        }

        // Invalid attrKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                containerXmlNormalizer._getCallAndCalls({}, arg)
            }, index)
        }
    }

    test_getCallAndCallsReturnsArray()
    {
        var containerXmlNormalizer = new ContainerXmlNormalizer(this.obj, this.attrKey, this.charKey)

        var obj = {
            "$": {
                "id": "bar",
                "alias": "żółć",
                "class": null,
                "public": true,
                "arguments": [
                    "arg3",
                    "arg1",
                    "arg2"
                ]
            },
            "arguments": [
                {
                    "argument": [
                        "arg1",
                        "arg2"
                    ]
                }
            ],
            "argument": [
                "arg3"
            ],
            "call": [
                {
                    "$": {
                        "method": "someMethod"
                    },
                    "arguments": [
                        {
                            "argument": [
                                "a1",
                                "a2"
                            ]
                        }
                    ],
                    "argument": [
                        "a3"
                    ]
                }
            ],
            "tags": [
                {
                    "tag": [
                        "tag1",
                        "tag2"
                    ]
                }
            ],
            "tag": [
                "tag3"
            ]
        }

        var result = [
            [
                "someMethod",
                [
                    "a3",
                    "a1",
                    "a2"
                ]
            ]
        ]
        this.assertSame(result, containerXmlNormalizer._getCallAndCalls(obj, this.attrKey))         
    }

    test_getCallAndCallsMethodAttributeReferenceError()
    {
        var containerXmlNormalizer = new ContainerXmlNormalizer(this.obj, this.attrKey, this.charKey)
        var self = this

        var obj = {
            "$": {
                "id": "bar",
                "alias": "żółć",
                "class": null,
                "public": true,
                "arguments": [
                    "arg3",
                    "arg1",
                    "arg2"
                ]
            },
            "arguments": [
                {
                    "argument": [
                        "arg1",
                        "arg2"
                    ]
                }
            ],
            "argument": [
                "arg3"
            ],
            "call": [
                {
                    "$": {
                        "methoddddddddddddddddddddddddd": "someMethod"
                    },
                    "arguments": [
                        {
                            "argument": [
                                "a1",
                                "a2"
                            ]
                        }
                    ],
                    "argument": [
                        "a3"
                    ]
                }
            ],
            "tags": [
                {
                    "tag": [
                        "tag1",
                        "tag2"
                    ]
                }
            ],
            "tag": [
                "tag3"
            ]
        }
        this.assertError('MethodAttributeReferenceError', function() {
            containerXmlNormalizer._getCallAndCalls(obj, self.attrKey)
        })
    }

    test_normalizeArgumentInvalidTypeError()
    {
        var containerXmlNormalizer = new ContainerXmlNormalizer(this.obj, this.attrKey, this.charKey)
        var self = this

        // Invalid obj.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                containerXmlNormalizer._normalize(arg, self.attrKey, self.charKey)
            }, index)
        }

        // Invalid attrKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                containerXmlNormalizer._normalize(self.obj, arg, self.charKey)
            }, index)
        }

        // Invalid charKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                containerXmlNormalizer._normalize(self.obj, self.attrKey, arg)
            }, index)
        }
    }

    test_normalizeIdAttributeReferenceError()
    {
        var containerXmlNormalizer = new ContainerXmlNormalizer(this.obj, this.attrKey, this.charKey)
        var self = this

        this.assertError('IdAttributeReferenceError', function() {
            containerXmlNormalizer._normalize(self.parseObjWithoutIdAttribute, self.attrKey, self.charKey)
        })
    }

    testProcessArgumentInvalidTypeError()
    {
        var self = this

        // Invalid obj.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                ContainerXmlNormalizer.process(arg, self.attrKey, self.charKey)
            }, index)
        }

        // Invalid attrKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                ContainerXmlNormalizer.process(self.obj, arg, self.charKey)
            }, index)
        }

        // Invalid charKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                ContainerXmlNormalizer.process(self.obj, self.attrKey, arg)
            }, index)
        }
    }

    testProcessIdAttributeReferenceError()
    {
        var self = this

        this.assertError('IdAttributeReferenceError', function() {
            ContainerXmlNormalizer.process(self.parseObjWithoutIdAttribute, self.attrKey, self.charKey)
        })
    }

    testProcessMethodAttributeReferenceError()
    {
        var self = this

        this.assertError('MethodAttributeReferenceError', function() {
            ContainerXmlNormalizer.process(self.parseObjWithoutMethodAttribute, self.attrKey, self.charKey)
        })
    }

    testProcessReturnsObject()
    {
        this.assertSame({}, ContainerXmlNormalizer.process({}, this.attrKey, this.charKey))

        var parseObj = {"foo":"bar","baz":null}
        this.assertSame({}, ContainerXmlNormalizer.process(parseObj, this.attrKey, this.charKey))

        this.assertSame(this.expected, ContainerXmlNormalizer.process(this.parseObj, this.attrKey, this.charKey))
        this.assertSame(this.expectedCustomKeys, ContainerXmlNormalizer.process(this.parseObjWithCustomKeysAttributes, '@', '='))
    }
}

